"use server";

import { supabase } from "@/utils/supabse/server";
import { OrderData } from "@/types";
import { EmailService } from "@/services/email.service";
import { NotionService } from "@/services/notion.service";

export async function submitOrderAction(orderData: OrderData) {
    try {
        // Calculate pricing breakdown
        const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = subtotal >= 2000 ? 0 : 100; // Free shipping over ₹2000
        const tax = 0; // Add tax calculation if needed
        const discount = 0; // Add discount if applicable
        const totalAmount = subtotal + shippingCost + tax - discount;

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

        // 1. Create Order Record with new structure
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
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
                shipping_cost: shippingCost,
                tax: tax,
                discount: discount,
                total_amount: totalAmount,

                // Payment Information
                payment_method: orderData.paymentMethod.toLowerCase(), // 'razorpay', 'cod', or 'upi'
                payment_status: orderData.paymentMethod === "ONLINE" ? "paid" : "pending",
                razorpay_order_id: orderData.razorpayOrderId || null,
                razorpay_payment_id: orderData.razorpayPaymentId || null,
                razorpay_signature: orderData.razorpaySignature || null,

                // Order Status
                status: orderData.paymentMethod === "ONLINE" ? "confirmed" : "pending",

                // Metadata
                metadata: {
                    user_agent: orderData.userAgent || null,
                    ip_address: orderData.ipAddress || null,
                    source: 'website'
                }
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creating order:", orderError);
            throw new Error("Failed to create order");
        }

        // 2. Inventory is now handled by database trigger automatically
        // No need to manually update stock here

        // 3. Send Email Confirmation
        await EmailService.sendOrderConfirmation(order.id, orderData);

        // 4. Sync to Notion (don't wait for it, run in background)
        NotionService.createOrder(order).catch((error) => {
            console.error("Notion sync failed (non-critical):", error);
        });

        return { success: true, orderId: order.id, order };
    } catch (error) {
        console.error("Checkout Action Error:", error);
        return { success: false, message: "Internal Server Error" };
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
