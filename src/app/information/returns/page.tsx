import { MainLayout } from "@/components/layout/main_layout";
import { Metadata } from 'next';
import { Mail, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
    title: 'Returns & Exchanges | YURAA',
    description: 'Guide to Returns and Exchanges process at YURAA.',
};

export default function ReturnsPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            Customer Care
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Returns & Exchanges
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "We want you to love what you wear. Here is how our return process works."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        {/* Step 1: Eligibility */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 01</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Check Eligibility</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                To ensure fairness and quality, we accept returns or exchanges <strong>only</strong> under the following conditions:
                            </p>
                            <div className="space-y-3 pl-2">
                                {[
                                    "Manufacturing defect in the product.",
                                    "Incorrect size received (different from what was ordered)."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Step 2: Conditions */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 02</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Prepare the Item</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                Before initiating a request, please ensure the item meets our return standards:
                            </p>
                            <div className="space-y-3 pl-2">
                                {[
                                    "Item must be unused and unwashed.",
                                    "Original packaging must be preserved.",
                                    "All tags must be intact."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-600">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Step 3: Initiate Request */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 03</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Initiate Request</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-8">
                                You can easily request a return or exchange directly through your order tracking page.
                            </p>

                            <div className="space-y-8 mb-8">
                                <div className="flex items-start gap-6">
                                    <span className="font-serif text-3xl text-gray-200 leading-none">01</span>
                                    <p className="text-gray-600 text-lg font-light pt-1">Open the <strong>Tracking Link</strong> sent to your email.</p>
                                </div>
                                <div className="flex items-start gap-6">
                                    <span className="font-serif text-3xl text-gray-200 leading-none">02</span>
                                    <p className="text-gray-600 text-lg font-light pt-1">Click on the <strong>'Return / Exchange'</strong> button on the tracking page.</p>
                                </div>
                                <div className="flex items-start gap-6">
                                    <span className="font-serif text-3xl text-gray-200 leading-none">03</span>
                                    <p className="text-gray-600 text-lg font-light pt-1">Follow the prompts to select the item and reason.</p>
                                </div>
                            </div>

                            <p className="text-gray-600 font-light text-lg mb-4 pl-1">
                                <span className="font-medium text-black">Note:</span> A <strong>₹99 processing & shipping charge</strong> will be applicable for all approved returns or exchanges.
                            </p>

                            <p className="text-sm text-gray-500 font-light italic pl-1">
                                *Having trouble? You can still email us at <a href="mailto:info.yura.co@gmail.com" className="text-black underline">info.yura.co@gmail.com</a> for manual assistance.
                            </p>
                        </section>

                        {/* Step 4: Processing */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 04</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Processing</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Once your request is approved, we will arrange for a pickup. After the item reaches our warehouse and passes quality check, your exchange or refund will be processed as per our policy within 5-7 business days.
                            </p>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Contact */}
                        <section className="text-center">
                            <h2 className="text-xl font-serif font-medium text-black mb-4">Need Help?</h2>
                            <a href="mailto:info.yura.co@gmail.com" className="flex items-center justify-center gap-2 text-gray-600 hover:text-black transition-colors group">
                                <Mail className="w-5 h-5 stroke-[1.5]" />
                                <span className="text-lg font-light border-b border-transparent group-hover:border-black transition-all">info.yura.co@gmail.com</span>
                            </a>
                        </section>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
