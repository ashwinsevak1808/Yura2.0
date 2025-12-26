"use server";

import { supabase } from "@/utils/supabse/server";
import { OrderData } from "@/types";
import { EmailService } from "@/services/email.service";

export async function submitOrderAction(orderData: OrderData) {
    try {
        // 1. Create Order Record
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                shipping_address: orderData.shippingAddress,
                special_instructions: orderData.specialInstructions,
                payment_method: orderData.paymentMethod,
                total_amount: orderData.totalAmount,
                status: "pending",
            })
            .select()
            .single();

        if (orderError) {
            console.error("Error creating order:", orderError);
            throw new Error("Failed to create order");
        }

        // 2. Create Order Items
        const orderItems = orderData.items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.selectedSize,
            color: item.selectedColor,
            product_name: item.name,
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Error creating order items:", itemsError);
            throw new Error("Failed to create order items");
        }

        // 3. Update Stock
        for (const item of orderData.items) {
            const { data: product } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.id)
                .single();

            if (product) {
                const newStock = Math.max(0, product.stock - item.quantity);
                await supabase
                    .from("products")
                    .update({ stock: newStock })
                    .eq("id", item.id);
            }
        }

        // 4. Send Email
        await EmailService.sendOrderConfirmation(order.id, orderData);

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Checkout Action Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}
