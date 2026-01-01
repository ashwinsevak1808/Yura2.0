
interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    image_url: string;
}

export interface ShiprocketOrderItem {
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: string;
    tax?: string;
    hsn?: number;
}

export class ShiprocketService {
    private static readonly API_URL = 'https://apiv2.shiprocket.in/v1/external';

    private static async login(ignoreStatic = false) {
        try {
            // 1. Check for static token first (unless ignored)
            if (!ignoreStatic && process.env.SHIPROCKET_TOKEN) {
                const token = process.env.SHIPROCKET_TOKEN.trim();
                if (token.split('.').length === 3) {
                    console.log("Using static SHIPROCKET_TOKEN (Length: " + token.length + ")");
                    return token;
                }
                console.warn("Static SHIPROCKET_TOKEN is set but appears invalid (not a JWT). Proceeding to login with credentials.");
            }

            // 2. Login with credentials
            const email = process.env.SHIPROCKET_EMAIL;
            const password = process.env.SHIPROCKET_PASSWORD;

            if (!email || !password) {
                console.error('Shiprocket credentials missing. Set SHIPROCKET_EMAIL/PASSWORD or SHIPROCKET_TOKEN.');
                return null;
            }

            console.log(`Attempting Shiprocket Login with email: ${email}`);

            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Shiprocket Login Failed [${response.status}]: ${errorText}`);
                return null; // Return null explicitly so caller knows auth failed
            }

            const data = await response.json();
            if (!data.token) {
                console.error('Shiprocket Login response validation failed: No token received', data);
                return null;
            }

            return data.token;
        } catch (error) {
            console.error('Shiprocket Login Exception:', error);
            return null;
        }
    }

    public static async createOrder(order: any, items: OrderItem[]) {
        try {
            let token = await this.login();
            if (!token) return { success: false, message: 'Auth Failed' };

            // Map Items to Shiprocket format
            const orderItems: ShiprocketOrderItem[] = items.map(item => ({
                name: item.product_name,
                sku: `${item.product_id.substring(0, 5)}-${item.size}-${item.color}`, // Generate SKU
                units: item.quantity,
                selling_price: item.price,
                discount: "0",
                tax: "0"
            }));

            const date = new Date(order.created_at);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

            // Payload
            const payload = {
                order_id: order.id,
                order_date: formattedDate,
                pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Home",
                billing_customer_name: order.customer_name.split(' ')[0],
                billing_last_name: order.customer_name.split(' ').slice(1).join(' ') || "",
                billing_address: order.shipping_address.street,
                billing_address_2: "",
                billing_city: order.shipping_address.city,
                billing_pincode: order.shipping_address.zipCode || order.shipping_address.zip_code, // Handle both casing
                billing_state: order.shipping_address.state,
                billing_country: "India",
                billing_email: order.customer_email,
                billing_phone: order.customer_phone,
                shipping_is_billing: true,
                order_items: orderItems,
                payment_method: order.payment_method === 'cod' ? 'COD' : 'Prepaid',
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: order.subtotal,
                length: 30, // Default dimensions
                breadth: 20,
                height: 10,
                weight: 0.5
            };

            console.log('Shiprocket Payload:', JSON.stringify(payload, null, 2));

            let response = await fetch(`${this.API_URL}/orders/create/adhoc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            // RETRY LOGIC for 401 (Unauthorized)
            if (response.status === 401) {
                console.warn("Shiprocket returned 401 Unauthorized. Retrying with fresh login...");

                // Debug credentials presence
                const hasEmail = !!process.env.SHIPROCKET_EMAIL;
                const hasPass = !!process.env.SHIPROCKET_PASSWORD;
                console.log(`Credentials check - Email: ${hasEmail}, Pass: ${hasPass}`);

                token = await this.login(true); // Force fresh login

                if (token) {
                    console.log("Fresh login successful. Retrying order creation...");
                    response = await fetch(`${this.API_URL}/orders/create/adhoc`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload),
                    });
                } else {
                    console.error("Fresh login failed during retry. Cannot recover from 401.");
                    throw new Error("Shiprocket Authentication Failed: Unable to login with provided Email/Password after Token rejection.");
                }
            }

            // Handle non-JSON responses gracefully
            const textResponse = await response.text();
            let result;
            try {
                result = JSON.parse(textResponse);
            } catch (e) {
                console.error("Shiprocket Non-JSON Response:", textResponse);
                throw new Error(`Invalid Response: ${textResponse.substring(0, 100)}`);
            }

            if (!response.ok) {
                console.error("Shiprocket API Error (Final):", result);
                throw new Error(JSON.stringify(result));
            }

            // Validating that we actually got an Order ID
            // Shiprocket might return 200 OK with "message": "Wrong Pickup location..."
            if (!result.order_id && !result.shipment_id) {
                console.error("Shiprocket Logic Error:", result);
                throw new Error(`Shiprocket Error: ${result.message || JSON.stringify(result)}`);
            }

            return { success: true, data: result };

        } catch (error) {
            console.error('Shiprocket Create Order Error:', error);
            // Return the error message to the UI for visibility
            return {
                success: false,
                message: error instanceof Error ? error.message : "Shiprocket Unknown Error",
                error
            };
        }
    }
}
