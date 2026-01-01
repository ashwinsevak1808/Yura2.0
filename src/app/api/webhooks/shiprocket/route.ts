import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabse/admin";
import { EmailService } from "@/services/email.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Shiprocket Webhook Received:", JSON.stringify(body, null, 2));

        // Validate secret if configured
        const secret = req.headers.get('x-shiprocket-token');
        if (process.env.SHIPROCKET_WEBHOOK_SECRET && secret !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Shiprocket sends 'order_id' which typically matches the 'order_id' we sent during creation (our UUID)
        const orderId = body.order_id;
        const status = body.current_status;
        const awb = body.awb; // or awb_code, checking both
        const courier = body.courier_name;

        if (!orderId || !status) {
            return NextResponse.json({ message: "Invalid Payload: Missing order_id or status" }, { status: 400 });
        }

        let newStatus = "";
        // Map Shiprocket Status to App Status
        const normalizedStatus = status.toUpperCase();

        switch (normalizedStatus) {
            case "SHIPPED":
                newStatus = "shipped";
                break;
            case "DELIVERED":
                newStatus = "delivered";
                break;
            case "CANCELED":
            case "CANCELLED":
            case "RTO INITIATED":
                newStatus = "cancelled";
                break;
            default:
                console.log(`Webhook: Status '${status}' ignored.`);
                return NextResponse.json({ message: "Status ignored" });
        }

        // 1. Fetch Order and check if update is needed
        const { data: order, error: fetchError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (fetchError || !order) {
            console.error("Webhook: Order not found in DB:", orderId);
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        if (order.status === newStatus) {
            return NextResponse.json({ message: "Status already up to date" });
        }

        // 2. Update Order in DB
        const updateData: any = {
            status: newStatus,
            updated_at: new Date().toISOString()
        };

        if (newStatus === 'shipped') {
            if (awb) updateData.tracking_number = awb; // Update AWB if provided in webhook
            if (courier) updateData.carrier = courier;
            updateData.shipped_at = new Date().toISOString();
        }

        if (newStatus === 'delivered') {
            updateData.delivered_at = new Date().toISOString();
        }

        if (newStatus === 'cancelled') {
            updateData.cancelled_at = new Date().toISOString();
        }

        const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update(updateData)
            .eq("id", orderId);

        if (updateError) {
            console.error("Webhook: DB Update Failed", updateError);
            return NextResponse.json({ message: "DB Update Failed" }, { status: 500 });
        }

        console.log(`Webhook: Order ${orderId} updated to ${newStatus}`);

        // 3. Send Email Notification
        // Ensure email service has what it needs. 'order' object here is the OLD order data.
        // It's fine for items/customer info.
        await EmailService.sendOrderStatusUpdate(orderId, order, newStatus);

        return NextResponse.json({ success: true, message: `Updated to ${newStatus}` });

    } catch (error) {
        console.error("Webhook Logic Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
