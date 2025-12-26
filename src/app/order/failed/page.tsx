import { MainLayout } from "@/components/layout/main_layout";
import { XCircle, RefreshCw, ShoppingBag, Mail } from "lucide-react";

export default function OrderFailedPage() {
    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    <div className="max-w-2xl mx-auto">

                        {/* Error Icon */}
                        <div className="bg-white p-12 text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-6">
                                <XCircle className="w-10 h-10 text-white" />
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-black mb-4 leading-tight">
                                Order Failed
                            </h1>

                            <p className="text-base text-gray-600 font-light mb-8 max-w-md mx-auto">
                                We're sorry, but there was an issue processing your order. Please try again or contact our support team.
                            </p>
                        </div>

                        {/* What Happened Section */}
                        <div className="bg-white p-8 mb-8">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                What Happened?
                            </h2>

                            <div className="space-y-4 text-sm text-gray-600 font-light">
                                <p>Your order could not be completed due to one of the following reasons:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Payment processing error</li>
                                    <li>Network connectivity issue</li>
                                    <li>Invalid shipping information</li>
                                    <li>Technical error on our end</li>
                                </ul>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white p-8">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                What Can You Do?
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                                        <RefreshCw className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-black mb-1">Try Again</h3>
                                        <p className="text-sm text-gray-600 font-light">
                                            Return to your cart and attempt to complete your order again.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-black mb-1">Contact Support</h3>
                                        <p className="text-sm text-gray-600 font-light">
                                            Reach out to us at{" "}
                                            <a href="mailto:info.yura.co@gmail.com" className="text-black hover:underline">
                                                info.yura.co@gmail.com
                                            </a>
                                            {" "}for assistance.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/cart"
                                    className="flex-1 bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors text-center"
                                >
                                    Return to Cart
                                </a>
                                <a
                                    href="/collections"
                                    className="flex-1 border border-black text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center"
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
