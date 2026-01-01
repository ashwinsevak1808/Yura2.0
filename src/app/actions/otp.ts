"use server";

import { createClient } from "@/utils/supabse/client"; // Note: This might be client-side import in utils, check if we have server util
import { createClient as createServerClient } from "@supabase/supabase-js";
import { EmailService } from "@/services/email.service";
import { SmsService } from "@/services/sms.service";

// Init admin client for bypassing RLS during OTP creation/verification if needed
// Or use standard client if RLS allows public insert
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createServerClient(supabaseUrl, supabaseServiceKey);

export async function generateAndSendOtp(email: string, phone: string) {
    try {
        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 2. Save to DB
        // Check if we should update existing or insert new.
        // For simplicity and audit log, we insert new.
        // But to prevent spam, maybe check rate limit? Skipping for now.

        const { error } = await supabaseAdmin
            .from('otp_verifications')
            .insert({
                email,
                phone,
                otp_code: otp,
                expires_at: expiresAt.toISOString(),
                is_verified: false
            });

        if (error) {
            console.error("DB Error saving OTP:", error);
            return { success: false, message: "Failed to generate OTP" };
        }

        // 3. Send via Email
        const emailSent = await EmailService.sendOtp(email, otp);

        if (!emailSent) {
            return { success: false, message: "Failed to send OTP code to email." };
        }

        return { success: true, message: "OTP sent successfully to your email." };

    } catch (error) {
        console.error("OTP Generation Error:", error);
        return { success: false, message: "Internal server error" };
    }
}

export async function verifyOtpAction(email: string, code: string) {
    try {
        // 1. Fetch latest OTP for this email
        const { data, error } = await supabaseAdmin
            .from('otp_verifications')
            .select('*')
            .eq('email', email)
            .eq('is_verified', false)
            .gt('expires_at', new Date().toISOString()) // Not expired
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return { success: false, message: "Invalid or expired OTP" };
        }

        if (data.otp_code !== code) {
            return { success: false, message: "Incorrect OTP code" };
        }

        // 2. Mark as verified
        await supabaseAdmin
            .from('otp_verifications')
            .update({ is_verified: true })
            .eq('id', data.id);

        return { success: true, message: "Verified successfully" };

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return { success: false, message: "Verification failed" };
    }
}
