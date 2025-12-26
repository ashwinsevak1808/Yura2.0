import { MainLayout } from "@/components/layout/main_layout";

export default function OurStoryPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mb-16 pb-12 border-b border-gray-100">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            About Us
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
                            Our Story
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Crafting timeless elegance through premium fabrics and meticulous attention to detail.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-12">

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Our Beginning</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Founded with a passion for traditional craftsmanship and contemporary design, Yura represents the perfect blend of heritage and modernity. Each piece in our collection tells a story of skilled artisans, premium materials, and timeless elegance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Our Philosophy</h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                We believe that true luxury lies in the details. Every kurti we create is a testament to our commitment to quality, from the selection of the finest fabrics to the precision of each stitch. Our designs celebrate the modern woman who values both tradition and contemporary style.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Sustainability and ethical practices are at the heart of everything we do. We work closely with local artisans, ensuring fair wages and preserving traditional techniques for future generations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Our Commitment</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                We're dedicated to providing you with not just beautiful clothing, but an experience that reflects our values of quality, authenticity, and exceptional service. Each purchase supports our community of artisans and contributes to the preservation of traditional craftsmanship.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-light italic">
                                Thank you for being part of our journey. We look forward to helping you discover pieces that will become cherished parts of your wardrobe.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
