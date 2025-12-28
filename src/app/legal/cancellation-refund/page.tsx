"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main_layout';

export default function CancellationRefundPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-4 leading-tight">
                            Cancellation & Refund Policy
                        </h1>
                        <p className="text-sm text-gray-500 font-light">
                            Last updated on Dec 27, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto prose prose-lg">
                        <div className="space-y-6 text-gray-700 leading-relaxed">

                            <p className="text-base font-light">
                                YURAA believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
                            </p>

                            <div className="space-y-4">
                                <p className="text-base font-light">
                                    Cancellations will be considered only if the request is made within <strong className="font-medium text-black">7 days of placing the order</strong>. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                                </p>

                                <p className="text-base font-light">
                                    YURAA does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                                </p>

                                <p className="text-base font-light">
                                    In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within <strong className="font-medium text-black">7 days of receipt of the products</strong>.
                                </p>

                                <p className="text-base font-light">
                                    In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong className="font-medium text-black">7 days of receiving the product</strong>. The Customer Service Team after looking into your complaint will take an appropriate decision.
                                </p>

                                <p className="text-base font-light">
                                    In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
                                </p>

                                <p className="text-base font-light">
                                    In case of any Refunds approved by YURAA, it'll take <strong className="font-medium text-black">3-5 days</strong> for the refund to be processed to the end customer.
                                </p>
                            </div>

                            {/* Contact Section */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                    Need Help?
                                </h2>
                                <p className="text-base font-light mb-4">
                                    For any queries regarding cancellations or refunds, please contact us:
                                </p>
                                <div className="space-y-2 text-base font-light">
                                    <p>
                                        <strong className="font-medium text-black">Email:</strong>{' '}
                                        <a href="mailto:yura.info.co@gmail.com" className="text-black hover:underline">
                                            yura.info.co@gmail.com
                                        </a>
                                    </p>
                                    <p>
                                        <strong className="font-medium text-black">Phone:</strong>{' '}
                                        <a href="tel:8879963368" className="text-black hover:underline">
                                            8879963368
                                        </a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
