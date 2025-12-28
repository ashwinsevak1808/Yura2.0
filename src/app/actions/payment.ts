'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface CreateOrderParams {
    amount: number; // in rupees
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export interface VerifyPaymentParams {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(params: CreateOrderParams) {
    try {
        const options = {
            amount: Math.round(params.amount * 100), // Convert to paise
            currency: 'INR',
            receipt: params.orderId,
            notes: {
                order_id: params.orderId,
                customer_name: params.customerName,
                customer_email: params.customerEmail,
                customer_phone: params.customerPhone,
                business: 'YURAA',
            },
        };

        const order = await razorpay.orders.create(options);

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
        };
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return {
            success: false,
            error: error.message || 'Failed to create payment order',
        };
    }
}

/**
 * Verify Razorpay payment signature
 */
export async function verifyRazorpayPayment(params: VerifyPaymentParams) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

        // Generate signature
        const text = razorpay_order_id + '|' + razorpay_payment_id;
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(text)
            .digest('hex');

        // Verify signature
        const isValid = generated_signature === razorpay_signature;

        if (isValid) {
            return {
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            };
        } else {
            return {
                success: false,
                message: 'Payment verification failed - Invalid signature',
            };
        }
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return {
            success: false,
            message: error.message || 'Payment verification failed',
        };
    }
}

/**
 * Fetch payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
    try {
        const payment = await razorpay.payments.fetch(paymentId);

        return {
            success: true,
            payment: {
                id: payment.id,
                amount: typeof payment.amount === 'number' ? payment.amount / 100 : 0,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                email: payment.email,
                contact: payment.contact,
                createdAt: payment.created_at,
            },
        };
    } catch (error: any) {
        console.error('Error fetching payment details:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch payment details',
        };
    }
}

/**
 * Initiate refund
 */
export async function initiateRefund(paymentId: string, amount?: number) {
    try {
        const refundData: any = {
            speed: 'normal', // or 'optimum'
        };

        // If amount is specified, do partial refund
        if (amount) {
            refundData.amount = Math.round(amount * 100); // Convert to paise
        }

        const refund = await razorpay.payments.refund(paymentId, refundData);

        return {
            success: true,
            refundId: refund.id,
            amount: refund.amount ? refund.amount / 100 : 0,
            status: refund.status,
            message: 'Refund initiated successfully',
        };
    } catch (error: any) {
        console.error('Error initiating refund:', error);
        return {
            success: false,
            error: error.message || 'Failed to initiate refund',
        };
    }
}
