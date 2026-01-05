"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-black text-white p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-light leading-relaxed text-gray-200">
                        We use cookies to improve your experience and analyze website traffic. By continuing to use our site, you agree to our use of cookies & <a href="/legal/privacy-policy" className="underline hover:text-white transition-colors">privacy policy</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors px-4 py-2"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors rounded-lg"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
