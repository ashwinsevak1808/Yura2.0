import React from "react";
import { Instagram, Heart } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { InstagramService } from "@/services/instagram.service";


export default async function InstagramFeed() {
    // Fetch live feed
    const liveFeed = await InstagramService.getFeed();

    // If no feed is available, hide the entire section
    if (!liveFeed || liveFeed.length === 0) {
        return null;
    }

    const posts = liveFeed.slice(0, 5);

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
                                    {post.like_count && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <Heart className="w-4 h-4 fill-white text-white" />
                                            <p className="font-bold text-sm tracking-wide">{post.like_count}</p>
                                        </div>
                                    )}
                                    <p
                                        className="hidden sm:block text-xs font-medium leading-relaxed overflow-hidden px-4"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {post.caption}
                                    </p>
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
