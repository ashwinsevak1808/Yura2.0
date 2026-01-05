import { MainLayout } from '@/components/layout/main_layout';
import { Metadata } from 'next';
import { Mail, MapPin } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Privacy Policy | YURAA',
    description: 'Comprehensive Privacy Policy detailing the collection, use, and protection of your data at YURAA.',
};

export default function PrivacyPolicyPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block mb-4 text-[10px] font-bold tracking-[0.25em] text-gray-400 uppercase">
                            Legal Documentation
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-black mb-6 leading-none tracking-tight">
                            Privacy Policy
                        </h1>
                        <div className="w-12 h-0.5 bg-black/80 mx-auto mb-8"></div>
                        <p className="text-gray-600 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto font-serif italic text-balance">
                            "We are committed to maintaining the confidentiality, integrity, and security of your personal information."
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">1. Introduction</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Welcome to <strong>YURAA</strong> ("we," "us," or "our"). We operate strict privacy and security measures to protect your personal information. This Privacy Policy ("Policy") describes the types of information we may collect from you or that you may provide when you visit our website (our "Website") and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                By accessing or using this Website, you agree to this Policy. This Policy may change from time to time. Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please check the Policy periodically for updates.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-serif font-medium text-black">2. Information We Collect About You</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                We collect several types of information from and about users of our Website, including:
                            </p>

                            <div className="space-y-8 pl-2">
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-2">A. Personal Identification Information</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                        We may collect personal identification information from Users in a variety of ways, including when Users visit our site, register on the site, place an order, or subscribe to the newsletter. Users may be asked for:
                                    </p>
                                    <div className="space-y-2 pl-2">
                                        {[
                                            "Full Name",
                                            "Billing Address & Shipping Address",
                                            "Email Address",
                                            "Phone Number"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                                <span className="text-gray-600 font-light text-lg">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-black mb-2">B. Non-personal Identification Information</h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                        We may automatically collect non-personal identification information whenever you interact with our Site. This may include:
                                    </p>
                                    <div className="space-y-2 pl-2">
                                        {[
                                            "Browser name and version",
                                            "Type of computer or device used",
                                            "Operating system",
                                            "Internet Service Provider utilized",
                                            "Other similar technical information"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                                <span className="text-gray-600 font-light text-lg">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">3. How We Use Use Your Information</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                We may use the information we collect from you when you register, make a purchase, or surf the website in the following ways:
                            </p>
                            <div className="space-y-4 pl-2">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-black">To Process Transactions</h3>
                                    <p className="text-gray-600 font-light text-lg leading-relaxed">
                                        We use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service (e.g., sharing address with courier partners).
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-black">To Improve Customer Service</h3>
                                    <p className="text-gray-600 font-light text-lg leading-relaxed">
                                        Information you provide helps us respond to your customer service requests and support needs more efficiently.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-black">To Personalize User Experience</h3>
                                    <p className="text-gray-600 font-light text-lg leading-relaxed">
                                        We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-black">To Send Periodic Emails</h3>
                                    <p className="text-gray-600 font-light text-lg leading-relaxed">
                                        We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">4. Web Browser Cookies</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-4">
                                We utilize cookies to:
                            </p>
                            <div className="space-y-2 pl-2">
                                {[
                                    "Remember and process the items in your shopping cart.",
                                    "Understand and save user's preferences for future visits.",
                                    "Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <span className="mt-2 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                        <span className="text-gray-600 font-light text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">5. How We Protect Your Information</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">6. Sharing Your Personal Information</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                            </p>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                We may use third-party service providers (such as <strong>Razorpay</strong> for payments and various <strong>Courier Services</strong> for logistics) to help us operate our business and the Site or administer activities on our behalf. We may share your information with these third parties for those limited purposes provided that you have given us your permission.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">7. Third-Party Websites</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors, and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website's own terms and policies.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">8. Changes to This Privacy Policy</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                <strong>YURAA</strong> has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Site and revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-serif font-medium text-black">9. Your Rights</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                Under applicable laws, you may have the right to access, correct, update, or delete the personal information we hold about you. If you wish to exercise any of these rights, please contact us using the information below.
                            </p>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Contact */}
                        <section className="text-center">
                            <h2 className="text-xl font-serif font-medium text-black mb-4">Contacting Us</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg mb-8 max-w-2xl mx-auto">
                                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
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
