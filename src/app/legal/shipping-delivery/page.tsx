import { MainLayout } from '@/components/layout/main_layout';
import { Metadata } from 'next';
import { Truck, MapPin, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Shipping and Delivery Policy | YURAA',
    description: 'Information about shipping timelines, delivery partners, and tracking.',
};

export default function ShippingDeliveryPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            Legal
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Shipping & Delivery
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "Committed to delivering your YURAA pieces with care and speed."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        {/* Step 1: Logistics & Coverage */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 01</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Logistics & Coverage</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                YURAA is proudly based in <strong>Mumbai</strong>.
                            </p>
                            <div className="space-y-4 pl-2">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                                    <span className="text-gray-600 font-light text-lg">
                                        <strong>Mumbai Orders:</strong> Often handled directly or via fast local courier partners for quicker delivery.
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Truck className="w-5 h-5 text-black mt-1 flex-shrink-0" />
                                    <span className="text-gray-600 font-light text-lg">
                                        <strong>Rest of India:</strong> For locations outside Mumbai, we partner with trusted courier services to ensure your package travels safely to your doorstep.
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Timelines */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 02</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Dispatch & Timelines</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                We strive to dispatch all orders within <strong>24–48 hours</strong> of placement.
                            </p>
                            <div className="space-y-3 pl-2">
                                {[
                                    "Mumbai & Metro Cities: Typically 5-7 business days.",
                                    "Rest of India: Typically 8-14 business days.",
                                    "Remote Areas: May take slightly longer depending on courier accessibility."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-600 font-light text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Step 3: Tracking */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 03</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Tracking Your Order</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    Once your order is shipped, you will automatically receive a specific <strong>tracking link via Email</strong>.
                                </p>
                                <p>
                                    Simply click on this link to view the real-time status of your package on our partner's tracking page.
                                </p>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Contact */}
                        <section className="text-center">
                            <h2 className="text-xl font-serif font-medium text-black mb-4">Shipping Queries?</h2>
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
