import { MainLayout } from "@/components/layout/main_layout";

export default function ReturnsPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mb-16 pb-12 border-b border-gray-100">
                        <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
                            Customer Care
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
                            Returns & Exchanges
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            We want you to love your purchase. If you're not completely satisfied, we're here to help.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-12">

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Return Policy</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                You have 7 days from the date of delivery to return your item. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging with tags attached.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">How to Initiate a Return</h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                To start a return, please contact us at <a href="mailto:info.yura.co@gmail.com" className="text-black font-medium underline hover:opacity-70 transition-opacity">info.yura.co@gmail.com</a> with your order number and reason for return. We will provide you with instructions on how and where to send your package.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Refunds</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (or bank account for COD orders) within 5-7 business days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">Exchanges</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a href="mailto:info.yura.co@gmail.com" className="text-black font-medium underline hover:opacity-70 transition-opacity">info.yura.co@gmail.com</a>.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-light italic">
                                For any questions about returns or exchanges, please don't hesitate to reach out to our customer care team.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
