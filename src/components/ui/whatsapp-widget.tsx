"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface WhatsAppWidgetProps {
    phoneNumber?: string;
    message?: string;
}

export default function WhatsAppWidget({
    phoneNumber = "918879963368",
    message = "Hi YURAA, I'm looking for products on your website."
}: WhatsAppWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating WhatsApp Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

                {/* Tooltip/Message Bubble */}
                {isOpen && (
                    <div className="bg-white rounded-xl shadow-2xl p-5 max-w-xs animate-slideIn">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-black">YURAA Support</h4>
                                    <p className="text-xs text-gray-500">Online now</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Hi there! 👋<br />
                            How can we help you today?
                        </p>

                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Start Chat on WhatsApp
                        </button>
                    </div>
                )}

                {/* Main WhatsApp Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="whatsapp-button group relative w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95"
                    aria-label="Contact us on WhatsApp"
                >
                    {/* Animated Ring */}
                    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping-slow opacity-25"></span>

                    {/* WhatsApp Logo */}
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white relative z-10 transform group-hover:rotate-12 transition-transform duration-300">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </button>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.25;
                    }
                    50% {
                        transform: scale(1.15);
                        opacity: 0.1;
                    }
                    100% {
                        transform: scale(1.3);
                        opacity: 0;
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }

                .animate-ping-slow {
                    animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .whatsapp-button {
                    filter: drop-shadow(0 8px 20px rgba(37, 211, 102, 0.35));
                }


                .whatsapp-button:hover {
                    filter: drop-shadow(0 12px 28px rgba(37, 211, 102, 0.45));
                }
            `}</style>
        </>
    );
}
