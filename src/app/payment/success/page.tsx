"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState({
        orderId: "",
        paymentId: "",
        amount: "",
    });

    useEffect(() => {
        // Get payment details from URL params
        const orderId = searchParams.get("order_id") || "";
        const paymentId = searchParams.get("payment_id") || "";
        const amount = searchParams.get("amount") || "";

        setPaymentDetails({ orderId, paymentId, amount });

        // Redirect to home if no payment details
        if (!orderId && !paymentId) {
            setTimeout(() => router.push("/"), 3000);
        }
    }, [searchParams, router]);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    <div className="max-w-2xl mx-auto">
                        {/* Success Icon */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-black mb-4">
                                Payment Successful!
                            </h1>
                            <p className="text-gray-600 font-light text-lg">
                                Your order has been placed successfully
                            </p>
                        </div>

                        {/* Payment Details Card */}
                        <div className="bg-white p-8 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                Payment Details
                            </h2>

                            <div className="space-y-4">
                                {paymentDetails.paymentId && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-sm text-gray-500 font-light">Payment ID</span>
                                        <span className="text-sm font-mono text-black font-medium">
                                            {paymentDetails.paymentId}
                                        </span>
                                    </div>
                                )}

                                {paymentDetails.orderId && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-sm text-gray-500 font-light">Order ID</span>
                                        <span className="text-sm font-mono text-black font-medium">
                                            {paymentDetails.orderId.slice(0, 20)}...
                                        </span>
                                    </div>
                                )}

                                {paymentDetails.amount && (
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm text-gray-500 font-light">Amount Paid</span>
                                        <span className="text-lg font-serif text-black font-medium">
                                            ₹{(parseInt(paymentDetails.amount) / 100).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* What's Next */}
                        <div className="bg-blue-50 p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">
                                        What's Next?
                                    </h3>
                                    <ul className="text-sm text-gray-700 font-light space-y-1">
                                        <li>• You'll receive an order confirmation email shortly</li>
                                        <li>• We'll start processing your order immediately</li>
                                        <li>• Track your order status in your email</li>
                                        <li>• Expected delivery: 8-14 business days</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push("/")}
                                className="flex-1 bg-black text-white py-4 px-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => router.push("/order/confirmed")}
                                className="flex-1 bg-white text-black py-4 px-6 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-gray-50 transition-colors"
                            >
                                View Order Details
                            </button>
                        </div>

                        {/* Support */}
                        <p className="text-center text-xs text-gray-500 font-light mt-8">
                            Need help? Contact us at{" "}
                            <a href="mailto:yura.info.co@gmail.com" className="text-black hover:underline">
                                yura.info.co@gmail.com
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
