"use server";

import { supabaseAdmin as supabase } from "@/utils/supabse/admin";
import { ShiprocketService } from "@/services/shiprocket.service";

export async function requestReturnAction(orderId: string, reason: string) {
    try {
        if (!orderId || !reason) {
            return { success: false, message: "Order ID and reason are required." };
        }

        // Verify order exists and is eligible for return (e.g. delivered)
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("status, return_status")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            return { success: false, message: "Order not found." };
        }

        if (order.status !== 'delivered') {
            return { success: false, message: "Only delivered orders can be returned." };
        }

        if (order.return_status) {
            return { success: false, message: "A return request has already been initiated for this order." };
        }

        const { error } = await supabase
            .from("orders")
            .update({
                return_status: 'requested',
                return_reason: reason,
                return_requested_at: new Date().toISOString()
            })
            .eq("id", orderId);

        if (error) {
            console.error("Return Request Error:", error);
            throw new Error("Failed to update order");
        }

        return { success: true, message: "Return request submitted successfully." };

    } catch (error) {
        console.error("Request Return Action Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

export async function approveReturnAction(orderId: string) {
    try {
        // 1. Fetch Order
        const { data: order, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            return { success: false, message: "Order not found." };
        }

        if (order.return_status !== 'requested') {
            return { success: false, message: "This order does not have a pending return request." };
        }

        // 2. Prepare Items for Shiprocket Return
        // Assuming all items are returned for now, or parsing from metadata if we supported partial returns
        const itemsToReturn = order.items.map((item: any) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
            image_url: item.image_url
        }));

        // 3. Create Return in Shiprocket
        const shipRes = await ShiprocketService.createReturnOrder(order, itemsToReturn);

        if (!shipRes.success) {
            console.error("Shiprocket Return Failed:", shipRes);
            return { success: false, message: "Failed to create return in Shiprocket: " + (shipRes.message || "Unknown error") };
        }

        // 4. Update Database
        const { error } = await supabase
            .from("orders")
            .update({
                return_status: 'approved',
                metadata: {
                    ...order.metadata,
                    return_shipment_id: shipRes.data.shipment_id,
                    return_order_id: shipRes.data.order_id,
                }
            })
            .eq("id", orderId);

        if (error) throw error;

        return { success: true, message: "Return approved and pickup initiated via Shiprocket." };

    } catch (error) {
        console.error("Approve Return Error:", error);
        return { success: false, message: "Internal Server Error" };
    }
}
