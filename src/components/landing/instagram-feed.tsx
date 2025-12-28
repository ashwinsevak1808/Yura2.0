"use client";

import React from "react";
import { Instagram } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

const INSTAGRAM_POSTS = [
    {
        id: 1,
        image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: "2.4k",
        caption: "Summer vibes in our new Anarkali collection. ✨ #Yura #EthnicWear"
    },
    {
        id: 2,
        image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: "1.8k",
        caption: "Details that matter. Hand-embroidered perfection."
    },
    {
        id: 3,
        image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: "3.2k",
        caption: "Elegance is the only beauty that never fades. 💫"
    },
    {
        id: 4,
        image: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: "1.5k",
        caption: "Festive ready with our latest silk sarees."
    },
    {
        id: 5,
        image: "https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=800",
        likes: "4.1k",
        caption: "Behind the scenes of our latest shoot."
    }
];

export default function InstagramFeed() {
    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Instagram</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif font-medium text-black">Follow Us @_yuraaclothing_</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0.5">
                    {INSTAGRAM_POSTS.map((post) => (
                        <a
                            key={post.id}
                            href="https://instagram.com/_yuraaclothing_"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative aspect-square block overflow-hidden bg-gray-100"
                        >
                            <ImageWithFallback
                                src={post.image}
                                alt={post.caption}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center backdrop-blur-[2px]">
                                <Instagram className="w-8 h-8 mb-3" />
                                <p className="font-bold text-sm tracking-wide">{post.likes}</p>
                                <p className="hidden sm:block text-xs mt-2 opacity-90 line-clamp-2">{post.caption}</p>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="https://instagram.com/_yuraaclothing_"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block border-b border-black pb-1 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                        View Full Feed
                    </a>
                </div>
            </div>
        </section>
    );
}
