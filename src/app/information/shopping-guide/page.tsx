import { MainLayout } from "@/components/layout/main_layout";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shopping Guide',
};

export default function ShoppingGuidePage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mb-16 pb-12 border-b border-gray-100">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            Customer Care
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
                            Shopping Guide
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Everything you need to know about shopping with us, from placing an order to delivery and returns.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-12">

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">How to Order</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Ordering from our store is simple and secure. Browse our collections, select your preferred size and color, and add items to your cart. When you're ready, proceed to checkout where you can choose between Cash on Delivery (COD) or UPI payments.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Shipping & Delivery</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                                <p>
                                    <strong className="text-black font-medium">Mumbai Delivery:</strong> For zip codes starting with '400', we offer standard local delivery which typically arrives within 2-3 business days.
                                </p>
                                <p>
                                    <strong className="text-black font-medium">Courier Shipping:</strong> For all other locations across India, we partner with trusted couriers like BlueDart and Delhivery. Expected delivery is 5-7 business days.
                                </p>
                                <p>
                                    <strong className="text-black font-medium">Shipping Costs:</strong> Shipping is free for orders over ₹2,000. A flat rate of ₹150 applies to orders below this amount.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Payment Methods</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                                <p>We currently accept:</p>
                                <p>
                                    <strong className="text-black font-medium">Cash on Delivery (COD):</strong> Pay in cash when your order arrives.
                                </p>
                                <p>
                                    <strong className="text-black font-medium">UPI:</strong> Pay securely via any UPI app.
                                </p>
                            </div>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-light italic">
                                For any questions about ordering or delivery, please don't hesitate to reach out to our customer care team.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
