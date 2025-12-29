import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

export interface OrderData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
    };
    specialInstructions?: string;
    paymentMethod: "COD" | "ONLINE" | "UPI";
    totalAmount: number;
    items: CartItem[];

    // Payment tracking
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    // OTP verification
    otpVerified?: boolean;

    // Metadata
    userAgent?: string;
    ipAddress?: string;
}

export interface OrderItem {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    image_url?: string;
}

export interface Order {
    id: string;
    created_at: string;
    updated_at: string;

    // Customer Information
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
    };
    special_instructions?: string;

    // Order Items (JSONB)
    items: OrderItem[];

    // Pricing Information
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total_amount: number;

    // Payment Information
    payment_method: 'razorpay' | 'cod' | 'upi';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;

    // Refund Information
    refund_id?: string;
    refund_amount?: number;
    refund_status?: 'pending' | 'processed' | 'failed';
    refund_reason?: string;
    refunded_at?: string;

    // Order Status & Fulfillment
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    tracking_number?: string;
    carrier?: string;
    shipped_at?: string;
    delivered_at?: string;

    // Cancellation Information
    cancelled_at?: string;
    cancellation_reason?: string;



    // Notes & Metadata
    admin_notes?: string;
    metadata?: {
        user_agent?: string;
        ip_address?: string;
        source?: string;
        [key: string]: any;
    };
}

export interface OrderWithDetails extends Order {
    // For displaying order details with product information
    itemsWithProducts?: (OrderItem & { product?: Partial<Product> })[];
}
