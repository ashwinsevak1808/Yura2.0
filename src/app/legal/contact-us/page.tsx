"use client";

import React from 'react';
import { MainLayout } from '@/components/layout/main_layout';
import { Mail, Phone, MapPin } from 'lucide-react';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
};

export default function ContactUsPage() {
    return (
        <MainLayout>
            <div className="bg-white min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Header */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-4 leading-tight">
                            Contact Us
                        </h1>
                        <p className="text-sm text-gray-500 font-light">
                            Last updated on Dec 27, 2025
                        </p>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto">

                        {/* Contact Cards */}
                        <div className="grid md:grid-cols-2 gap-8 mb-12">

                            {/* Email Card */}
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-black mb-2">Email Us</h3>
                                        <a
                                            href="mailto:info.yura.co@gmail.com"
                                            className="text-base text-gray-700 hover:text-black transition-colors font-light"
                                        >
                                            info.yura.co@gmail.com
                                        </a>
                                        <p className="text-sm text-gray-500 mt-2 font-light">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-black mb-2">Call Us</h3>
                                        <a
                                            href="tel:8879963368"
                                            className="text-base text-gray-700 hover:text-black transition-colors font-light"
                                        >
                                            8879963368
                                        </a>
                                        <p className="text-sm text-gray-500 mt-2 font-light">
                                            Mon-Sat, 10 AM - 7 PM IST
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Address Section */}
                        <div className="bg-gray-50 p-8 rounded-lg mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-black mb-2">Visit Us</h3>
                                    <div className="space-y-1 text-base text-gray-700 font-light">
                                        <p>B3, Devdarshan Society</p>
                                        <p>Pererawadi Sakinaka</p>
                                        <p>Near Theresa High School</p>
                                        <p>Mumbai, Maharashtra 400072</p>
                                        <p className="mt-2 text-sm text-gray-500">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="border-t border-gray-200 pt-8">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">
                                Business Information
                            </h2>

                            <div className="space-y-4 text-base font-light">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Merchant Legal Entity Name</p>
                                        <p className="text-black font-medium">YURAA</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Business Type</p>
                                        <p className="text-black font-medium">E-Commerce - Women's Ethnic Wear</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Registered Address</p>
                                        <p className="text-gray-700">
                                            B3, Devdarshan Society Pererawadi Sakinaka, Near Theresa High School, Mumbai, Maharashtra 400072
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Operational Address</p>
                                        <p className="text-gray-700">
                                            B3, Devdarshan Society Pererawadi Sakinaka, Near Theresa High School, Mumbai, Maharashtra 400072
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Telephone</p>
                                        <a href="tel:8879963368" className="text-black font-medium hover:underline">
                                            8879963368
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <a href="mailto:info.yura.co@gmail.com" className="text-black font-medium hover:underline">
                                            info.yura.co@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-serif font-medium text-black mb-6">
                                Quick Links
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <a href="/legal/privacy-policy" className="text-base text-gray-700 hover:text-black transition-colors font-light">
                                    → Privacy Policy
                                </a>
                                <a href="/legal/terms-conditions" className="text-base text-gray-700 hover:text-black transition-colors font-light">
                                    → Terms & Conditions
                                </a>
                                <a href="/legal/shipping-delivery" className="text-base text-gray-700 hover:text-black transition-colors font-light">
                                    → Shipping & Delivery Policy
                                </a>
                                <a href="/legal/cancellation-refund" className="text-base text-gray-700 hover:text-black transition-colors font-light">
                                    → Cancellation & Refund Policy
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
