/**
 * OTP Service for Order Verification
 * Sends OTP to customer's phone before order placement
 */

interface OTPData {
    phone: string;
    otp: string;
    expiresAt: Date;
}

// In-memory OTP storage (for production, use Redis or database)
const otpStore = new Map<string, OTPData>();

export class OTPService {
    /**
     * Generate a 6-digit OTP
     */
    private static generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP to customer's phone
     * @param phone Customer's phone number
     * @returns OTP (in production, this would be sent via SMS gateway)
     */
    static async sendOTP(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
        try {
            // Clean phone number
            const cleanPhone = phone.replace(/\D/g, '');

            // Generate OTP
            const otp = this.generateOTP();

            // Store OTP with 5-minute expiry
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            otpStore.set(cleanPhone, { phone: cleanPhone, otp, expiresAt });

            // TODO: In production, integrate with SMS gateway (Twilio, MSG91, etc.)
            // For now, we'll return the OTP for testing
            console.log(`📱 OTP for ${phone}: ${otp}`);

            // Simulate SMS sending
            // await this.sendSMS(phone, `Your YURAA order verification OTP is: ${otp}. Valid for 5 minutes.`);

            return {
                success: true,
                message: 'OTP sent successfully',
                otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only return OTP in dev mode
            };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            };
        }
    }

    /**
     * Verify OTP
     * @param phone Customer's phone number
     * @param otp OTP entered by customer
     * @returns Verification result
     */
    static verifyOTP(phone: string, otp: string): { success: boolean; message: string } {
        try {
            const cleanPhone = phone.replace(/\D/g, '');
            const storedData = otpStore.get(cleanPhone);

            if (!storedData) {
                return {
                    success: false,
                    message: 'OTP not found. Please request a new OTP.'
                };
            }

            // Check if OTP expired
            if (new Date() > storedData.expiresAt) {
                otpStore.delete(cleanPhone);
                return {
                    success: false,
                    message: 'OTP expired. Please request a new OTP.'
                };
            }

            // Verify OTP
            if (storedData.otp !== otp) {
                return {
                    success: false,
                    message: 'Invalid OTP. Please try again.'
                };
            }

            // OTP verified successfully, remove from store
            otpStore.delete(cleanPhone);

            return {
                success: true,
                message: 'OTP verified successfully'
            };
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                message: 'Failed to verify OTP. Please try again.'
            };
        }
    }

    /**
     * Clean up expired OTPs (run periodically)
     */
    static cleanupExpiredOTPs(): void {
        const now = new Date();
        for (const [phone, data] of otpStore.entries()) {
            if (now > data.expiresAt) {
                otpStore.delete(phone);
            }
        }
    }

    /**
     * TODO: Integrate with SMS gateway
     * Example with MSG91 (popular in India):
     */
    /*
    private static async sendSMS(phone: string, message: string): Promise<void> {
        const response = await fetch('https://api.msg91.com/api/v5/flow/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': process.env.MSG91_AUTH_KEY!
            },
            body: JSON.stringify({
                flow_id: process.env.MSG91_FLOW_ID,
                sender: 'YURAA',
                mobiles: phone,
                VAR1: otp // OTP variable in template
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
    }
    */
}

// Clean up expired OTPs every 10 minutes
if (typeof window === 'undefined') {
    setInterval(() => {
        OTPService.cleanupExpiredOTPs();
    }, 10 * 60 * 1000);
}
