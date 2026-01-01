import { MainLayout } from '@/components/layout/main_layout';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping and Delivery',
};

export default function ShippingDeliveryPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mb-16 pb-12 border-b border-gray-100">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            Legal
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
                            Shipping & Delivery Policy
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Last updated on Dec 27, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-8">

                        <div className="space-y-6">
                            <p className="text-gray-600 font-light leading-relaxed">
                                For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Orders are shipped within <strong className="font-medium text-black">8-14 days</strong> or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                YURAA is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 8-14 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                For any issues in utilizing our services you may contact our helpdesk on <a href="tel:8879963368" className="text-black font-medium hover:underline">8879963368</a> or <a href="mailto:info.yura.co@gmail.com" className="text-black font-medium hover:underline">info.yura.co@gmail.com</a>
                            </p>
                        </div>

                        {/* Shipping Information */}
                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">
                                Shipping Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6">
                                    <h3 className="text-lg font-medium text-black mb-3">Domestic Shipping</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 font-light">
                                        <li>• Delivery within India</li>
                                        <li>• 8-14 business days</li>
                                        <li>• Registered courier services</li>
                                        <li>• Tracking available</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-50 p-6">
                                    <h3 className="text-lg font-medium text-black mb-3">International Shipping</h3>
                                    <ul className="space-y-2 text-sm text-gray-600 font-light">
                                        <li>• Worldwide delivery</li>
                                        <li>• 10-20 business days</li>
                                        <li>• International courier</li>
                                        <li>• Customs may apply</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                Track Your Order
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                For order tracking and shipping queries, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-600 font-light">
                                <p>
                                    <strong className="font-medium text-black">Email:</strong>{' '}
                                    <a href="mailto:info.yura.co@gmail.com" className="text-black hover:underline">
                                        info.yura.co@gmail.com
                                    </a>
                                </p>
                                <p>
                                    <strong className="font-medium text-black">Phone:</strong>{' '}
                                    <a href="tel:8879963368" className="text-black hover:underline">
                                        8879963368
                                    </a>
                                </p>
                            </div>
                        </section>

                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
