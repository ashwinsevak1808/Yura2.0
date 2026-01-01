import { MainLayout } from '@/components/layout/main_layout';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions',
};

export default function TermsConditionsPage() {
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
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Last updated on Dec 27, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-8">

                        <p className="text-gray-600 font-light leading-relaxed">
                            For the purpose of these Terms and Conditions, the term "we", "us", "our" used anywhere on this page shall mean <strong className="font-medium text-black">YURAA</strong>, whose registered/operational office is <strong className="font-medium text-black">B3, Devdarshan Society Pererawadi Sakinaka, Near Theresa High School Mumbai MAHARASHTRA 400072</strong>. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
                        </p>

                        <p className="text-gray-600 font-light leading-relaxed">
                            Your use of the website and/or purchase from us are governed by following Terms and Conditions:
                        </p>

                        <div className="space-y-6">
                            <p className="text-gray-600 font-light leading-relaxed">
                                The content of the pages of this website is subject to change without notice.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                You may not create a link to our website from another website or document without YURAA's prior written consent.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the <strong className="font-medium text-black">laws of India</strong>.
                            </p>

                            <p className="text-gray-600 font-light leading-relaxed">
                                We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
                            </p>
                        </div>

                        {/* Contact Section */}
                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                Questions?
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                If you have any questions about these Terms & Conditions, please contact us:
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
                                <p>
                                    <strong className="font-medium text-black">Address:</strong> B3, Devdarshan Society Pererawadi Sakinaka, Near Theresa High School, Mumbai, Maharashtra 400072
                                </p>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
