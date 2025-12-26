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
export interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: any;
    special_instructions?: string;
    payment_method: string;
    total_amount: number;
    status: string;
}
