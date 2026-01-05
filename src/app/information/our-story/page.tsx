import { MainLayout } from "@/components/layout/main_layout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story | YURAA',
    description: 'The story of YURAA - Founded by Shweta, Deepika & Kiran.',
};

export default function OurStoryPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            About The Brand
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Our Story
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "Crafting timeless elegance through premium fabrics and meticulous attention to detail."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16">

                        <section className="fade-in">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">Our Beginning</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    This brand began with three friends who never planned to start a business together. Over the years, shared conversations, creativity, and a love for clothing slowly turned into an idea — and eventually, into this brand.
                                </p>
                                <p>
                                    What started at home grew with trust, teamwork, and the desire to create something meaningful together.
                                </p>
                            </div>
                        </section>

                        <section className="fade-in">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">Our Philosophy</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    We believe in creating clothing that blends modern styles with traditional elements, while staying true to slow and mindful fashion. Every design is created by us, with attention to detail and thoughtful handwork.
                                </p>
                                <p>
                                    All our products are made at home, in small quantities. We do not mass-produce. Each piece is crafted with care, patience, and intention.
                                </p>
                            </div>
                        </section>

                        <section className="fade-in">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">Our Commitment</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    From fabric hunting to design, stitching, quality checks, packing, and delivery — we are personally involved in every step. Each order is packed by us and sent with love, ensuring it reaches you just the way it was meant to.
                                </p>
                                <p>
                                    We are committed to honesty, quality, and creating clothing that our customers truly love and feel connected to.
                                </p>
                            </div>
                        </section>

                        <section className="pt-12 border-t border-gray-100 mt-12">
                            <p className="text-xl font-serif text-black italic">
                                With love,<br />
                                <span className="mt-2 block text-gray-600">Shweta, Deepika & Kiran 🤍</span>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
