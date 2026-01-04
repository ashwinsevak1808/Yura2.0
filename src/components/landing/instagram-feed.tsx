import React from "react";
import { Instagram, Heart } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { InstagramService } from "@/services/instagram.service";

const FALLBACK_POSTS = [
    {
        id: '1',
        media_url: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
        like_count: "2.4k",
        caption: "Summer vibes in our new Anarkali collection. ✨ #Yura #EthnicWear",
        permalink: "https://instagram.com/_yuraaclothing_"
    },
    {
        id: '2',
        media_url: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
        like_count: "1.8k",
        caption: "Details that matter. Hand-embroidered perfection.",
        permalink: "https://instagram.com/_yuraaclothing_"
    },
    {
        id: '3',
        media_url: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800",
        like_count: "3.2k",
        caption: "Elegance is the only beauty that never fades. 💫",
        permalink: "https://instagram.com/_yuraaclothing_"
    },
    {
        id: '4',
        media_url: "https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=800",
        like_count: "1.5k",
        caption: "Festive ready with our latest silk sarees.",
        permalink: "https://instagram.com/_yuraaclothing_"
    },
    {
        id: '5',
        media_url: "https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=800",
        like_count: "4.1k",
        caption: "Behind the scenes of our latest shoot.",
        permalink: "https://instagram.com/_yuraaclothing_"
    }
];

export default async function InstagramFeed() {
    // Fetch live feed
    const liveFeed = await InstagramService.getFeed();

    // Use live feed if available, otherwise fallback
    const posts = (liveFeed && liveFeed.length > 0) ? liveFeed.slice(0, 5) : FALLBACK_POSTS;

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
                    {posts.map((post: any) => {
                        // Intelligent media selection (Thumbnail for video, media_url for image)
                        const imageUrl = post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url;

                        return (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative aspect-square block overflow-hidden bg-gray-100"
                            >
                                <ImageWithFallback
                                    src={imageUrl}
                                    alt={post.caption || "Instagram Post"}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center backdrop-blur-[2px]">
                                    <Instagram className="w-8 h-8 mb-3" />
                                    {/* Show likes only if available (fallback data) or just a heart icon for real data */}
                                    {post.like_count ? (
                                        <p className="font-bold text-sm tracking-wide mb-2">{post.like_count}</p>
                                    ) : (
                                        <Heart className="w-4 h-4 mb-2 opacity-80" />
                                    )}
                                    <p className="hidden sm:block text-xs opacity-90 line-clamp-2 text-ellipsis overflow-hidden px-2 max-h-[2.5rem] leading-tight">{post.caption}</p>
                                </div>
                            </a>
                        );
                    })}
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
