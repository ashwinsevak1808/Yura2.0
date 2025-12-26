import { CartItem } from "@/types/cart";

export interface OrderData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    specialInstructions?: string;
    paymentMethod: "COD" | "UPI";
    totalAmount: number;
    items: CartItem[];
}

export const CheckoutService = {
    submitOrder: async (orderData: OrderData) => {
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to place order");
            }

            return await response.json();
        } catch (error) {
            console.error("Checkout Error:", error);
            throw error;
        }
    },
};
