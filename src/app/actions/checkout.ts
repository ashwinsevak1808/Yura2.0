"use server";

import { supabaseAdmin as supabase } from "@/utils/supabse/admin";
import { OrderData } from "@/types";
import { EmailService } from "@/services/email.service";
import { ShiprocketService } from "@/services/shiprocket.service";


export async function submitOrderAction(orderData: OrderData) {
    try {
        // 0. Security Check: Verify valid OTP existence for COD
        if (orderData.paymentMethod === 'COD') {
            const { data: otpRecord } = await supabase
                .from('otp_verifications')
                .select('created_at, is_verified')
                .eq('email', orderData.customerEmail)
                .eq('is_verified', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (!otpRecord) {
                console.error("Security Alert: blocked unverified COD order for " + orderData.customerEmail);
                return { success: false, message: "Please verify your phone number before placing order." };
            }

            // Optional: Check if verification is fresh (e.g., last 1 hour)
            const verifyTime = new Date(otpRecord.created_at).getTime();
            if (Date.now() - verifyTime > 60 * 60 * 1000) {
                return { success: false, message: "Verification session expired. Please verify again." };
            }
        }

        // Calculate pricing breakdown
        // Calculate pricing breakdown
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 0.1 Security Check: Verify Razorpay Signature for ONLINE payments
        if (orderData.paymentMethod === 'ONLINE') {
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = orderData;

            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                return { success: false, message: "Payment details missing. Order Verification Failed." };
            }

            const crypto = require('crypto');
            const secret = process.env.RAZORPAY_KEY_SECRET;
            if (!secret) {
                console.error("Critical: RAZORPAY_KEY_SECRET not set");
                return { success: false, message: "Server configuration error. Contact support." };
            }

            const generated_signature = crypto
                .createHmac('sha256', secret)
                .update(razorpayOrderId + "|" + razorpayPaymentId)
                .digest('hex');

            if (generated_signature !== razorpaySignature) {
                console.error("Security Alert: Invalid Razorpay Signature for order " + razorpayOrderId);
                return { success: false, message: "Payment verification failed. Invalid Signature." };
            }
            console.log("✅ Payment Verified Successfully for " + razorpayOrderId);
        }

        // RE-CALCULATE Charges on Server for Security
        const { ChargesService } = await import('@/services/charges.service');
        const applicableCharges = await ChargesService.getApplicableCharges(subtotal, supabase); // Pass admin client
        const additionalCharges = ChargesService.calculateCharges(subtotal, applicableCharges);

        // Use server-calcuated total
        const tax = 0; // Included in charges now if applicable
        const discount = 0; // Add discount logic if needed
        const totalAmount = subtotal + additionalCharges + tax - discount;



        // Prepare items as JSONB array
        const items = orderData.items.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.selectedSize || 'One Size',
            color: item.selectedColor || 'Default',
            image_url: item.images?.find(img => img.is_primary)?.image_url || item.images?.[0]?.image_url || ''
        }));

        // 1. Generate Order ID (UUID) upfront to link everything
        const orderId = crypto.randomUUID();

        // 2. Prepare Order Object for Shiprocket (Simulated)
        // We need to mimic the structure ShiprocketService expects, or pass raw data
        // Currently ShiprocketService.createOrder expects (order, items). 
        // We'll construct a mock 'order' object with the generated ID.
        const orderForShiprocket = {
            id: orderId,
            created_at: new Date().toISOString(),
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            shipping_address: orderData.shippingAddress,
            payment_method: orderData.paymentMethod.toLowerCase(),
            subtotal: subtotal,
            total_amount: totalAmount
        };

        // 3. Create Order in Shiprocket FIRST
        let shiprocketData = {};
        console.log("Initiating Shiprocket Order Creation...");
        try {
            const shipRes = await ShiprocketService.createOrder(orderForShiprocket, items);

            if (!shipRes.success) {
                console.error("Shiprocket Creation Failed:", shipRes.error || shipRes.message);
                // CRITICAL: Stop order processing if Shiprocket fails (as per user request)
                return {
                    success: false,
                    message: `Shipping Provider Error: ${shipRes.message || 'Unable to create shipment'}. Please contact support.`
                };
            }

            console.log("✅ Shiprocket Success Response:", JSON.stringify(shipRes.data, null, 2));

            // Capture Shiprocket Success Data
            if (shipRes.data) {
                shiprocketData = {
                    shiprocket_order_id: shipRes.data.order_id,
                    shiprocket_shipment_id: shipRes.data.shipment_id,
                    awb_code: shipRes.data.awb_code
                };
            }
        } catch (shipError) {
            console.error("Critical Shiprocket Exception:", shipError);
            return { success: false, message: "Shipping System Unavailable. Order not placed." };
        }

        // 4. Create Order Record in Supabase (Only if Shiprocket succeeded)
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                id: orderId, // Use the pre-generated ID
                // Customer Information
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                shipping_address: orderData.shippingAddress,
                special_instructions: orderData.specialInstructions || null,

                // Order Items (JSONB)
                items: items,

                // Pricing Information
                subtotal: subtotal,
                shipping_cost: additionalCharges,
                tax: tax,
                discount: discount,
                total_amount: totalAmount,

                // Payment Information
                payment_method: orderData.paymentMethod === 'ONLINE' ? 'razorpay' : orderData.paymentMethod.toLowerCase(),
                payment_status: orderData.paymentMethod === "ONLINE" ? "paid" : "pending",
                razorpay_order_id: orderData.razorpayOrderId || null,
                razorpay_payment_id: orderData.razorpayPaymentId || null,
                razorpay_signature: orderData.razorpaySignature || null,

                // Order Status
                status: orderData.paymentMethod === "ONLINE" ? "confirmed" : "pending",

                // Metadata (Include Shiprocket Data)
                metadata: {
                    user_agent: orderData.userAgent || null,
                    ip_address: orderData.ipAddress || null,
                    source: 'website',
                    ...shiprocketData
                }
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creating order in DB:", orderError);
            // Panic: Shiprocket order exists but DB failed.
            // In a real prod environment, we would queue a 'Cancel Shiprocket Order' job here.
            throw new Error("Failed to save order record");
        }

        // 5. Send Email Confirmation
        // Run in background so we don't block the UI response
        EmailService.sendOrderConfirmation(order.id, orderData).catch(err =>
            console.error("Email sending failed (background):", err)
        );





        return { success: true, orderId: order.id, order };
    } catch (error) {
        console.error("Checkout Action Error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error"
        };
    }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string, additionalData?: any) {
    try {
        const updateData: any = {
            status,
            updated_at: new Date().toISOString()
        };

        // Add status-specific fields
        if (status === 'shipped' && additionalData?.trackingNumber) {
            updateData.tracking_number = additionalData.trackingNumber;
            updateData.carrier = additionalData.carrier || null;
            updateData.shipped_at = new Date().toISOString();
        }

        if (status === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        if (status === 'cancelled') {
            updateData.cancelled_at = new Date().toISOString();
            updateData.cancellation_reason = additionalData?.reason || null;
        }

        const { data, error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", orderId)
            .select()
            .single();

        if (error) {
            console.error("Error updating order status:", error);
            throw new Error("Failed to update order status");
        }

        return { success: true, order: data };
    } catch (error) {
        console.error("Update Order Status Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

/**
 * Fetch full order details for receipt generation (Server Action)
 */
export async function getOrderDetailsAction(orderId: string) {
    try {
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (error) {
            console.error("Error fetching order details:", error);
            return { success: false, message: "Order not found" };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Get Order Details Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}
