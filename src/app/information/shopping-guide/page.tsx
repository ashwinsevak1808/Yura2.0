import { MainLayout } from "@/components/layout/main_layout";
import { Metadata } from 'next';
import { Mail, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Shopping Guide | YURAA',
    description: 'A step-by-step guide on how to shop at YURAA.',
};

export default function ShoppingGuidePage() {
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
                            Shopping Guide
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "Everything you need to know about placing an order with us."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        {/* Step 1: Browse & Discover */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 01</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Browse & Discover</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Explore our latest collections of handcrafted kurties. You can filter by price, arrival date, or style to find exactly what you're looking for.
                            </p>
                        </section>

                        {/* Step 2: Select Your Fit */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 02</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Select Your Fit</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                Once you've found a piece you love, select your size. We highly recommend checking our detailed size chart before making a selection to ensure the perfect fit.
                            </p>
                            <a href="/information/size-guide" className="inline-flex items-center text-sm font-medium text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity">
                                View Size Guide <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </section>

                        {/* Step 3: Add to Bag */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 03</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Add to Bag & Checkout</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Click "Add to Bag" to secure your item. When you're ready, proceed to checkout. We offer seamless and secure payment options including <strong>UPI</strong> and <strong>Cash on Delivery (COD)</strong> for your convenience.
                            </p>
                        </section>

                        {/* Step 4: After Order */}
                        <section>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Step 04</span>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Confirmation & Tracking</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Once your order is placed, you will receive an immediate confirmation via email. We will keep you updated on your package's journey with a tracking link as soon as it is dispatched.
                            </p>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Essential Links */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-8">Essential Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-2">Shipping & Delivery</h3>
                                    <p className="text-gray-600 font-light text-base mb-3 max-w-lg">
                                        Learn about our shipping timelines, charges, and delivery partners across India.
                                    </p>
                                    <a href="/legal/shipping-delivery" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
                                        Read Shipping Policy <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-black mb-2">Returns & Exchanges</h3>
                                    <p className="text-gray-600 font-light text-base mb-3 max-w-lg">
                                        Need to return or exchange? Read our detailed policy on eligibility, timelines, and the process.
                                    </p>
                                    <a href="/information/returns" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors">
                                        View Returns Policy <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
