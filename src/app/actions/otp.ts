"use server";

import { OTPService } from "@/services/otp.service";

/**
 * Send OTP to customer's phone for order verification
 */
export async function sendOrderOTP(phone: string) {
    try {
        if (!phone || phone.length < 10) {
            return {
                success: false,
                message: "Please provide a valid phone number"
            };
        }

        const result = await OTPService.sendOTP(phone);
        return result;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return {
            success: false,
            message: "Failed to send OTP. Please try again."
        };
    }
}

/**
 * Verify OTP before placing order
 */
export async function verifyOrderOTP(phone: string, otp: string) {
    try {
        if (!phone || !otp) {
            return {
                success: false,
                message: "Phone number and OTP are required"
            };
        }

        if (otp.length !== 6) {
            return {
                success: false,
                message: "OTP must be 6 digits"
            };
        }

        const result = OTPService.verifyOTP(phone, otp);
        return result;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return {
            success: false,
            message: "Failed to verify OTP. Please try again."
        };
    }
}
