"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    priority?: boolean;
}

export function ImageWithFallback({
    src,
    alt,
    className = "",
    fallbackClassName = "",
    priority = false
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Show fallback if no src or error
    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${fallbackClassName || className || "w-full h-full"}`}>
                <div className="text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Image unavailable</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className={`object-cover duration-700 ease-in-out ${loading ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}
