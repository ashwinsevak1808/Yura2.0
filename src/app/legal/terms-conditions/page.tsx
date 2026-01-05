import { MainLayout } from '@/components/layout/main_layout';
import { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Terms & Conditions | YURAA',
    description: 'Terms and conditions for using the YURAA website and services.',
};

export default function TermsConditionsPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            Legal Docs
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Terms & Conditions
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "Please read these terms carefully before accessing or using our website."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 mb-20">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">1. Overview</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                This website is operated by <strong>YURAA</strong>. Throughout the site, the terms “we”, “us” and “our” refer to YURAA. YURAA offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">2. Products & Accuracy</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. However, we cannot guarantee that your computer monitor's display of any color will be accurate.
                            </p>
                            <div className="space-y-2 pl-2">
                                {[
                                    "We reserve the right to limit the quantities of any products or services that we offer.",
                                    "All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us.",
                                    "We reserve the right to discontinue any product at any time."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-600 font-light text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">3. Pricing & Billing</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                            </p>
                            <div className="space-y-2 pl-2">
                                {[
                                    "We accept payments via trusted third-party gateways (UPI, Cards, etc.) and Cash on Delivery (COD).",
                                    "You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-600 font-light text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">4. User Comments & Feedback</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">5. Errors, Inaccuracies & Omissions</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">6. Governing Law</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising in relation hereto shall be subject to the exclusive jurisdiction of the courts at <strong>Mumbai, Maharashtra</strong>.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">7. Changes to Terms of Service</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="text-center">
                            <h2 className="text-xl font-serif font-medium text-black mb-4">Contact Information</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                                Questions about the Terms of Service should be sent to us at:
                            </p>

                            <div className="max-w-2xl mx-auto">
                                <div className="space-y-8 pl-4 text-left">
                                    <div className="flex items-start gap-6 group">
                                        <MapPin className="w-6 h-6 stroke-[1.5] text-gray-400 group-hover:text-black transition-colors mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-medium text-black mb-1">Mailing Address</h3>
                                            <p className="text-lg font-light text-gray-600 leading-relaxed">
                                                <strong>YURAA</strong><br />
                                                Devdarshan Society, Pererawadi,<br />
                                                Sakinaka, Mumbai, Maharashtra 400072<br />
                                                (Near Theresa High School)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <Mail className="w-6 h-6 stroke-[1.5] text-gray-400 group-hover:text-black transition-colors mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-medium text-black mb-1">Email Us</h3>
                                            <a href="mailto:info.yura.co@gmail.com" className="text-lg font-light text-gray-600 border-b border-transparent group-hover:border-black transition-all">
                                                info.yura.co@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <FaWhatsapp className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-lg font-medium text-black mb-1">Chat Support</h3>
                                            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-lg font-light text-gray-600 border-b border-transparent group-hover:border-black transition-all">
                                                Click to chat on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
