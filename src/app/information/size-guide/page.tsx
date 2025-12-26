import { MainLayout } from "@/components/layout/main_layout";

export default function SizeGuidePage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mb-16 pb-12 border-b border-gray-100">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            Fitting Guide
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
                            Size Guide
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Find your perfect fit with our comprehensive size chart.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-12">

                        {/* Size Chart */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">Size Chart</h2>

                            <div className="space-y-4">
                                {[
                                    { size: 'XS', bust: '32"', waist: '26"', hips: '34"' },
                                    { size: 'S', bust: '34"', waist: '28"', hips: '36"' },
                                    { size: 'M', bust: '36"', waist: '30"', hips: '38"' },
                                    { size: 'L', bust: '38"', waist: '32"', hips: '40"' },
                                    { size: 'XL', bust: '40"', waist: '34"', hips: '42"' },
                                    { size: 'XXL', bust: '42"', waist: '36"', hips: '44"' },
                                ].map((row, index) => (
                                    <div
                                        key={row.size}
                                        className={`flex items-center justify-between py-4 ${index !== 5 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center gap-12">
                                            <span className="text-sm font-medium text-black w-12">{row.size}</span>
                                            <span className="text-sm font-light text-gray-600">Bust: {row.bust}</span>
                                            <span className="text-sm font-light text-gray-600">Waist: {row.waist}</span>
                                            <span className="text-sm font-light text-gray-600">Hips: {row.hips}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* How to Measure */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">How to Measure</h2>
                            <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                                <p>
                                    <strong className="text-black font-medium">Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.
                                </p>
                                <p>
                                    <strong className="text-black font-medium">Waist:</strong> Measure around your natural waistline, typically the narrowest part of your torso.
                                </p>
                                <p>
                                    <strong className="text-black font-medium">Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.
                                </p>
                            </div>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-light italic">
                                Still unsure about sizing? Contact our customer care team for personalized assistance.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
