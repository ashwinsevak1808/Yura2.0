"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react";

export default function PaymentFailurePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errorDetails, setErrorDetails] = useState({
        reason: "",
        description: "",
        orderId: "",
        paymentId: "",
    });

    useEffect(() => {
        // Get error details from URL params
        const reason = searchParams.get("reason") || "Payment failed";
        const description = searchParams.get("description") || "Your payment could not be processed. Please try again.";
        const orderId = searchParams.get("order_id") || "";
        const paymentId = searchParams.get("payment_id") || "";

        setErrorDetails({ reason, description, orderId, paymentId });
    }, [searchParams]);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    <div className="max-w-2xl mx-auto">
                        {/* Error Icon */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-black mb-4">
                                Payment Failed
                            </h1>
                            <p className="text-gray-600 font-light text-lg">
                                {errorDetails.description}
                            </p>
                        </div>

                        {/* Error Details Card */}
                        <div className="bg-white p-8 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                Error Details
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                                    <span className="text-sm text-gray-500 font-light">Reason</span>
                                    <span className="text-sm text-black font-medium text-right max-w-xs">
                                        {errorDetails.reason}
                                    </span>
                                </div>

                                {errorDetails.orderId && (
                                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                                        <span className="text-sm text-gray-500 font-light">Order ID</span>
                                        <span className="text-sm font-mono text-black font-medium">
                                            {errorDetails.orderId.slice(0, 20)}...
                                        </span>
                                    </div>
                                )}

                                {errorDetails.paymentId && (
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm text-gray-500 font-light">Payment ID</span>
                                        <span className="text-sm font-mono text-black font-medium">
                                            {errorDetails.paymentId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div className="bg-yellow-50 p-6 mb-8">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">
                                        Common Reasons for Payment Failure
                                    </h3>
                                    <ul className="text-sm text-gray-700 font-light space-y-1">
                                        <li>• Insufficient funds in your account</li>
                                        <li>• Incorrect card details or CVV</li>
                                        <li>• Card expired or blocked</li>
                                        <li>• Bank declined the transaction</li>
                                        <li>• Network or connectivity issues</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => router.push("/checkout")}
                                className="flex-1 bg-black text-white py-4 px-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="flex-1 bg-white text-black py-4 px-6 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>

                        {/* Support */}
                        <div className="mt-8 p-6 bg-white border border-gray-100">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-3">
                                Need Help?
                            </h3>
                            <p className="text-sm text-gray-600 font-light mb-4">
                                If you continue to face issues, please contact our support team:
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600 font-light">
                                    <strong className="font-medium text-black">Email:</strong>{" "}
                                    <a href="mailto:yura.info.co@gmail.com" className="text-black hover:underline">
                                        yura.info.co@gmail.com
                                    </a>
                                </p>
                                <p className="text-gray-600 font-light">
                                    <strong className="font-medium text-black">Phone:</strong>{" "}
                                    <a href="tel:8879963368" className="text-black hover:underline">
                                        8879963368
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
