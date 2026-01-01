"use server";

import { supabaseAdmin } from "@/utils/supabse/admin";
import { EmailService } from "@/services/email.service";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: string, status: string) {
    console.log("Starting updateOrderStatusAction for order:", orderId, "status:", status);

    try {
        // 1. Fetch Order to get email using ADMIN client (bypasses RLS)
        const { data: order, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (fetchError) {
            console.error("Error fetching order in action:", fetchError);
            throw new Error(`Failed to fetch order: ${fetchError.message}`);
        }

        // 2. Update Status using ADMIN client (bypasses RLS)
        // If status is "delivered", we also mark payment as "paid" (assuming COD collection or confirmation)
        const updateData: any = { status: status };
        if (status === 'delivered') {
            updateData.payment_status = 'paid';
        }

        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update(updateData)
            .eq("id", orderId);

        if (updateError) {
            console.error("Error updating order in action:", updateError);
            throw new Error(`Failed to update order status: ${updateError.message}`);
        }

        console.log("Database update successful.");

        // 3. Send Email
        if (order?.customer_email) {
            console.log("Sending email to:", order.customer_email);
            // We use EmailService which uses nodemailer (Node.js only)
            // Since this file is "use server", this is valid.
            await EmailService.sendOrderStatusUpdate(orderId, order, status);
        } else {
            console.log("No customer email found, skipping email.");
        }

        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/admin/accounting');
        revalidatePath('/admin');

        return { success: true };
    } catch (error: any) {
        console.error("updateOrderStatusAction failed:", error);
        return { success: false, error: error.message };
    }
}
