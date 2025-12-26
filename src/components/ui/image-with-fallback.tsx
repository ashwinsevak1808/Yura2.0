"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackClassName?: string;
}

export function ImageWithFallback({ src, alt, className = "", fallbackClassName = "" }: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Show fallback if no src or error
    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${fallbackClassName || className}`}>
                <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Image unavailable</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {/* Loading placeholder */}
            {loading && (
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
                    <div className="animate-pulse">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                </div>
            )}

            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                className={className}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                onLoad={() => setLoading(false)}
                style={{ display: loading ? 'none' : 'block' }}
            />
        </div>
    );
}
