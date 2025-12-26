import { supabase } from "@/utils/supabse/server";
import { Product, Order } from "@/types";

export const AdminService = {
    async getDashboardStats() {
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("total_amount, created_at");

        const { count: productsCount, error: productsError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });

        const { count: ordersCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true });

        if (ordersError || productsError) {
            console.error("Error fetching admin stats:", ordersError || productsError);
            throw new Error("Failed to fetch admin stats");
        }

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const averageOrderValue = ordersCount ? totalRevenue / ordersCount : 0;

        return {
            totalRevenue,
            totalOrders: ordersCount || 0,
            totalProducts: productsCount || 0,
            averageOrderValue,
        };
    },

    async getRecentOrders(limit = 5) {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    async getAllOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);

        if (error) throw error;
    },

    async uploadProductImage(file: File) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        return publicUrl;
    },

    async createProduct(productData: any) {
        // This will be complex as it involves multiple tables
        // For now, let's just define the signature
        // We might need to use a transaction or multiple calls
        console.log("createProduct not implemented yet", productData);
        return { success: true };
    }
};
