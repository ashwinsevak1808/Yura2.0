"use server";

import { supabaseAdmin } from "@/utils/supabse/admin";

export interface AdminUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    role: string;
    user_metadata: any;
}

export async function getUsers(): Promise<AdminUser[]> {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users");
        }

        return users.map(user => ({
            id: user.id,
            email: user.email || "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at || null,
            role: user.role || 'user',
            user_metadata: user.user_metadata
        }));
    } catch (error) {
        console.error("Server action getUsers failed:", error);
        return [];
    }
}
