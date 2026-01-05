import { MainLayout } from "@/components/layout/main_layout";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Size Guide | YURAA',
    description: 'Find your perfect fit with the YURAA sizing chart.',
};

export default function SizeGuidePage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-2xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            Fitting Guide
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Size Guide
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "Find your perfect fit with our comprehensive size chart."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto mb-20 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        {/* Size Chart */}
                        <section>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="py-4 px-4 border-b border-black text-xs font-bold text-center uppercase tracking-widest text-black">Size</th>
                                            <th className="py-4 px-4 border-b border-gray-200 text-xs font-bold text-center uppercase tracking-widest text-gray-500">India</th>
                                            <th className="py-4 px-4 border-b border-gray-200 text-xs font-bold text-center uppercase tracking-widest text-gray-500">Bust (in)</th>
                                            <th className="py-4 px-4 border-b border-gray-200 text-xs font-bold text-center uppercase tracking-widest text-gray-500">Waist (in)</th>
                                            <th className="py-4 px-4 border-b border-gray-200 text-xs font-bold text-center uppercase tracking-widest text-gray-500">Hip (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-light text-gray-600">
                                        {[
                                            { size: 'XXS', india: '30', bust: '30-31', waist: '24-25', hips: '32-33' },
                                            { size: 'XS', india: '32', bust: '32-33', waist: '26-27', hips: '34-35' },
                                            { size: 'S', india: '34', bust: '34-35', waist: '28-29', hips: '36-37' },
                                            { size: 'M', india: '36', bust: '36-37', waist: '30-31', hips: '38-39' },
                                            { size: 'L', india: '38', bust: '38-39', waist: '32-33', hips: '40-41' },
                                            { size: 'XL', india: '40', bust: '40-41', waist: '34-35', hips: '42-43' },
                                            { size: 'XXL', india: '42', bust: '42-43', waist: '36-37', hips: '44-45' },
                                        ].map((row) => (
                                            <tr key={row.size} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                <td className="py-6 text-center px-4 font-medium text-black">{row.size}</td>
                                                <td className="py-6 text-center px-4">{row.india}</td>
                                                <td className="py-6 text-center px-4">{row.bust}"</td>
                                                <td className="py-6 text-center px-4">{row.waist}"</td>
                                                <td className="py-6 text-center px-4">{row.hips}"</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* How to Measure */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">How to Measure</h2>
                            <div className="space-y-8  mx-auto">
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Bust</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-lg">
                                        Measure around the fullest part of your chest, keeping the tape horizontal and comfortably loose.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Waist</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-lg">
                                        Measure around your natural waistline, typically the narrowest part of your torso, usually slightly above the navel.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-2">Hips</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-lg">
                                        Measure around the fullest part of your hips, keeping the tape horizontal.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-light italic">
                                * Measurements typically vary by 0.5 to 1 inch. If you are between sizes, we generally recommend sizing up for a more comfortable fit. Still unsure? Contact us for assistance.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
