"use client";

import { MainLayout } from "@/components/layout/main_layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <MainLayout>
            {/* Hero Section */}
            <div className="bg-gray-50 pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">Get in Touch</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">
                        We are here to assist you with any inquiries about our collection, sizing, or your order.
                    </p>
                </div>
            </div>

            <div className="bg-white py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-serif text-black mb-8">Contact Information</h2>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Visit Our Boutique</h3>
                                            <p className="text-gray-600 font-light leading-relaxed">
                                                123 Fashion Street, Design District<br />
                                                Mumbai, Maharashtra 400001
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Email Us</h3>
                                            <p className="text-gray-600 font-light mb-1">General Inquiries: info@yura.co.in</p>
                                            <p className="text-gray-600 font-light">Support: support@yura.co.in</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-2">Call Us</h3>
                                            <p className="text-gray-600 font-light mb-1">+91 98765 43210</p>
                                            <p className="text-gray-400 text-xs">Mon - Sat, 10am - 7pm IST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 border-t border-gray-100">
                                <h3 className="font-serif text-xl text-black mb-6">Connect With Us</h3>
                                <div className="flex gap-4">
                                    {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 p-8 lg:p-12 border border-gray-100">
                            <h2 className="text-2xl font-serif text-black mb-2">Send us a Message</h2>
                            <p className="text-gray-500 font-light text-sm mb-8">Fill the form below and we will get back to you shortly.</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border-0 border-b border-gray-200 px-0 py-3 focus:ring-0 focus:border-black transition-colors"
                                            placeholder="Jane"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border-0 border-b border-gray-200 px-0 py-3 focus:ring-0 focus:border-black transition-colors"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white border-0 border-b border-gray-200 px-0 py-3 focus:ring-0 focus:border-black transition-colors"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-white border-0 border-b border-gray-200 px-0 py-3 focus:ring-0 focus:border-black transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 mt-4"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
