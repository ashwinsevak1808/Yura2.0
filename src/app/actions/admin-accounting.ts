"use server";

import { supabaseAdmin } from "@/utils/supabse/admin";
import { unstable_noStore as noStore } from "next/cache";

export async function getAccountingStatsAction() {
    noStore();
    try {
        const { data: orders, error } = await supabaseAdmin
            .from("orders")
            .select("id, status, payment_status, total_amount, created_at, payment_method");

        if (error) {
            console.error("Error fetching accounting stats:", error);
            throw new Error("Failed to fetch accounting stats");
        }

        const metrics = {
            totalRevenue: 0,
            potentialRevenue: 0,
            lostRevenue: 0,
            ordersDelivered: 0,
            ordersPending: 0,
            ordersCancelled: 0,
            totalOrders: orders.length,
            codPendingAmount: 0,
        };

        orders.forEach(order => {
            const amount = Number(order.total_amount) || 0;

            // Revenue Calculations
            if (order.payment_status === 'paid') {
                metrics.totalRevenue += amount;
            } else if (order.payment_status === 'pending' && order.status !== 'cancelled' && order.status !== 'refunded') {
                metrics.potentialRevenue += amount;
                if (order.payment_method === 'cod') {
                    metrics.codPendingAmount += amount;
                }
            }

            // Loss Calculation
            if (order.status === 'cancelled' || order.status === 'refunded') {
                metrics.lostRevenue += amount;
                metrics.ordersCancelled++;
            }

            // Delivery Stats
            if (order.status === 'delivered') {
                metrics.ordersDelivered++;
            } else if (order.status !== 'cancelled' && order.status !== 'refunded') {
                metrics.ordersPending++;
            }
        });

        return metrics;
    } catch (error) {
        console.error("getAccountingStatsAction failed:", error);
        throw error;
    }
}
