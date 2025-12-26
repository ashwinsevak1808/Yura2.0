"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface PremiumHeroBannerProps {
  products: Product[];
}

export default function PremiumHeroBanner({ products }: PremiumHeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroProducts = products.slice(0, 3);

  // Auto-play functionality  
  useEffect(() => {
    if (!isAutoPlaying || heroProducts.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, heroProducts.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (heroProducts.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full bg-white overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{ marginTop: '88px' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-88px)]">

          {/* Left Content Section */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center py-12 lg:py-0 relative z-20">
            <div className="w-full grid grid-cols-1">
              {heroProducts.map((product, index) => {
                const isActive = index === currentSlide;

                return (
                  <div
                    key={product.id}
                    className={`col-start-1 row-start-1 flex flex-col justify-center transition-opacity duration-500 ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                  >
                    {/* Category - Mask Reveal */}
                    <div className="overflow-hidden mb-4">
                      <p
                        className={`text-xs font-bold tracking-[0.2em] text-gray-400 uppercase transform transition-transform duration-700 ease-out ${isActive ? "translate-y-0" : "translate-y-full"
                          }`}
                      >
                        {product.category || "Collection 2024"}
                      </p>
                    </div>

                    {/* Product Name - Mask Reveal */}
                    <div className="overflow-hidden mb-6">
                      <h1
                        className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-medium text-black leading-[1.1] transform transition-transform duration-700 delay-100 ease-out ${isActive ? "translate-y-0" : "translate-y-[110%]"
                          }`}
                      >
                        {product.name}
                      </h1>
                    </div>

                    {/* Description - Fade In */}
                    <div
                      className={`border-l-2 border-black pl-5 mb-8 lg:mb-10 transition-all duration-700 delay-200 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        }`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed max-w-md line-clamp-3">
                        {product.description || product.full_description}
                      </p>
                    </div>

                    {/* Price & CTA - Slide Up */}
                    <div
                      className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 transition-all duration-700 delay-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                    >
                      <span className="text-2xl lg:text-3xl font-light text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>

                      <a
                        href={`/product/${product.slug}`}
                        className="inline-flex items-center gap-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-black hover:opacity-60 transition-opacity border-b border-black pb-1"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation - Bottom Left (Relative to this column) */}
            <div className="mt-12 lg:absolute lg:bottom-12 lg:left-0 flex items-center gap-6">
              <div className="flex border border-gray-200 divide-x divide-gray-200">
                <button
                  onClick={handlePrev}
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-colors text-gray-800"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-colors text-gray-800"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs font-medium tracking-widest text-gray-400">
                <span className="text-black">{String(currentSlide + 1).padStart(2, "0")}</span>
                <span className="mx-2">—</span>
                <span>{String(heroProducts.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full lg:w-7/12 h-[50vh] lg:h-auto relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[55%] overflow-hidden bg-gray-50 order-first lg:order-last">
            {heroProducts.map((product, index) => {
              const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
              const isActive = index === currentSlide;

              return (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                  <div className={`relative w-full h-full transform transition-transform duration-[2000ms] ease-out ${isActive ? 'scale-100' : 'scale-110'}`}>
                    <ImageWithFallback
                      src={primaryImage?.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
