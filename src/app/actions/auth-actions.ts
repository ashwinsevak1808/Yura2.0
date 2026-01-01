"use server";

import { supabaseAdmin } from "@/utils/supabse/admin";
import { EmailService } from "@/services/email.service";

export async function resetPasswordAction(email: string, redirectTo: string) {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo
            }
        });

        if (error) {
            console.error("Supabase generateLink error:", error);
            throw new Error(error.message);
        }

        if (data && data.properties && data.properties.action_link) {
            const sent = await EmailService.sendPasswordResetLink(email, data.properties.action_link);
            if (!sent) throw new Error("Failed to send email via EmailService");
            return { success: true };
        } else {
            throw new Error("Failed to generate reset link");
        }
    } catch (error: any) {
        console.error("Reset password action failed:", error);
        return { success: false, error: error.message };
    }
}
