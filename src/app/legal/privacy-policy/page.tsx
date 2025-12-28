import { MainLayout } from '@/components/layout/main_layout';

export default function PrivacyPolicyPage() {
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
                            Privacy Policy
                        </h1>
                        <p className="text-gray-500 text-base font-light max-w-2xl leading-relaxed">
                            Last updated on Dec 27, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl space-y-8">

                        <p className="text-gray-600 font-light leading-relaxed">
                            This privacy policy sets out how YURAA uses and protects any information that you give YURAA when you visit their website and/or agree to purchase from them.
                        </p>

                        <p className="text-gray-600 font-light leading-relaxed">
                            YURAA is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
                        </p>

                        <p className="text-gray-600 font-light leading-relaxed">
                            YURAA may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
                        </p>

                        {/* What We Collect */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                What Information We Collect
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-3">We may collect the following information:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light leading-relaxed">
                                <li>Name</li>
                                <li>Contact information including email address</li>
                                <li>Demographic information such as postcode, preferences and interests, if required</li>
                                <li>Other information relevant to customer surveys and/or offers</li>
                            </ul>
                        </section>

                        {/* What We Do */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                What We Do With the Information We Gather
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-3">
                                We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light leading-relaxed">
                                <li>Internal record keeping</li>
                                <li>We may use the information to improve our products and services</li>
                                <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided</li>
                                <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail</li>
                                <li>We may use the information to customise the website according to your interests</li>
                            </ul>
                        </section>

                        {/* Security */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                Security
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                How We Use Cookies
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-600 font-light leading-relaxed">
                                    A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                                </p>
                                <p className="text-gray-600 font-light leading-relaxed">
                                    We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                                </p>
                                <p className="text-gray-600 font-light leading-relaxed">
                                    Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                                </p>
                                <p className="text-gray-600 font-light leading-relaxed">
                                    You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                                </p>
                            </div>
                        </section>

                        {/* Controlling Information */}
                        <section>
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                Controlling Your Personal Information
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-3">
                                You may choose to restrict the collection or use of your personal information in the following ways:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-light leading-relaxed mb-4">
                                <li>Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
                                <li>If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:yura.info.co@gmail.com" className="text-black font-medium hover:underline">yura.info.co@gmail.com</a></li>
                            </ul>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed">
                                If you believe that any information we are holding on you is incorrect or incomplete, please write to B3, Devdarshan Society Pererawadi Sakinaka, Near Theresa High School Mumbai MAHARASHTRA 400072 or contact us at <a href="tel:8879963368" className="text-black font-medium hover:underline">8879963368</a> or <a href="mailto:yura.info.co@gmail.com" className="text-black font-medium hover:underline">yura.info.co@gmail.com</a> as soon as possible. We will promptly correct any information found to be incorrect.
                            </p>
                        </section>

                        {/* Contact Section */}
                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-serif font-medium text-black mb-4">
                                Privacy Questions?
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="space-y-2 text-gray-600 font-light">
                                <p>
                                    <strong className="font-medium text-black">Email:</strong>{' '}
                                    <a href="mailto:yura.info.co@gmail.com" className="text-black hover:underline">
                                        yura.info.co@gmail.com
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
