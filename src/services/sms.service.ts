
export const SmsService = {
    /**
     * Sends an OTP via SMS using Brevo (Sendinblue) API v3.
     * Requires BREVO_API_KEY in environment variables.
     */
    sendOtp: async (phone: string, otp: string) => {
        try {
            console.log("Attempting to send OTP via SMS...");
            // Ensure phone number has country code. Default to +91 if missing
            let formattedPhone = phone.trim();
            if (!formattedPhone.startsWith('+')) {
                // If it starts with 91 and is 12 digits, assume it has country code but no +
                if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
                    formattedPhone = '+' + formattedPhone;
                } else if (formattedPhone.length === 10) {
                    formattedPhone = '+91' + formattedPhone;
                }
            }

            const apiKey = process.env.BREVO_API_KEY;

            if (!apiKey) {
                console.error("BREVO_API_KEY is missing in environment variables. Cannot send SMS.");
                return false;
            }

            // STRICT VALIDATION: Reject Legacy v2 keys
            if (!apiKey.startsWith('xkeysib-')) {
                console.error("\n❌ BREVO CONFIGURATION ERROR ❌");
                console.error(`You are using a Legacy v2 API Key ('${apiKey.substring(0, 5)}...').`);
                console.error("This system works with the modern Brevo v3 API.");
                console.error("👉 ACTION REQUIRED: Generate a new 'v3 API Key' specifically.");
                console.error("   Go to: https://app.brevo.com/settings/keys/api");
                console.error("   The new key will start with 'xkeysib-'. Update your .env.local file.\n");
                return false;
            }

            const url = 'https://api.brevo.com/v3/transactionalSMS/sms';
            const body = {
                sender: 'YURA', // Max 11 alphanumeric chars. Custom sender requires verified account/DLT.
                recipient: formattedPhone,
                content: `Your YURA verification code is ${otp}. Valid for 10 minutes.`,
                type: 'transactional',
                tag: 'otp'
            };

            console.log(`Sending SMS to ${formattedPhone} with body:`, JSON.stringify(body));

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify(body)
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                // If response is not JSON, try text
                const text = await response.text();
                // Brevo V3 usually returns JSON, so if this fails, something is wrong
                console.error("Failed to parse JSON response from Brevo. Raw status:", response.status, "Raw text:", text);
                return false;
            }

            if (!response.ok) {
                console.error("Brevo SMS API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: data
                });
                return false;
            }

            console.log("SMS sent successfully. Response:", data);
            return true;

        } catch (error) {
            console.error("Failed to send SMS (Exception):", error);
            return false;
        }
    }
};
