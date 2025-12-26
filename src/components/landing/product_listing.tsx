"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ProductGridSectionProps {
  products: Product[];
}

export default function ProductGridSection({ products }: ProductGridSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-4xl mb-16">
          <p className="text-xs font-bold text-black mb-4 uppercase tracking-widest">
            Curated Collection
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-6 leading-tight">
            Featured Pieces
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-light max-w-2xl leading-relaxed">
            Discover our handpicked selection of premium kurties, each piece crafted with meticulous attention to detail and timeless elegance.
          </p>
        </div>

        {/* Category Filter - With Better Spacing */}
        <div className="flex flex-wrap gap-6 mb-12">
          {["All", ...Array.from(new Set(products.map((product) => product.category))).filter((c): c is string => typeof c === "string" && c !== "")].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm transition-all ${selectedCategory === category
                  ? "text-black font-medium border-b-2 border-black pb-1"
                  : "text-gray-500 hover:text-black font-light pb-1"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => {
            const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
            return (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="group block"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                  <ImageWithFallback
                    src={primaryImage?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                  />
                  {/* Badge */}
                  {product.discount && (
                    <span className="absolute top-3 right-3 bg-black text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                      Sale
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-lg text-black group-hover:underline decoration-gray-300 underline-offset-4 decoration-1 transition-all">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="font-light text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="line-through text-gray-400 font-light text-xs">₹{product.original_price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-16 md:mt-20 text-center">
          <a
            href="/collections"
            className="inline-block text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:opacity-70 transition-opacity"
          >
            View All Collection
          </a>
        </div>
      </div>
    </section>
  );
}
