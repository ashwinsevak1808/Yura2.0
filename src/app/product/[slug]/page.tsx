"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, Truck, Shield, RefreshCw, ShoppingBag } from "lucide-react";
import { MainLayout } from "@/components/layout/main_layout";
import { getProductBySlug, getProducts } from "@/services/products.service";
import { CartService } from "@/services/cart.service";
import { Product } from "@/types/product";
import ProductGridSection from "@/components/landing/product_listing";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);

        if (productData) {
          if (productData.sizes.length > 0) setSelectedSize(productData.sizes[0].size);
          if (productData.colors.length > 0) setSelectedColor(productData.colors[0].color_name);
          if (productData.images.length > 0) setActiveImage(productData.images[0].image_url);

          const related = await getProducts({ category: productData.category || undefined });
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load product data", error);
        toast.error("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor && product.colors.length > 0) {
      toast.error("Please select a color");
      return;
    }

    CartService.addToCart(product, quantity, selectedSize, selectedColor);
    toast.success("Added to bag");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl font-light">Product not found</p>
        </div>
      </MainLayout>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-20">
        <div className="pt-28 lg:pt-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

            {/* Minimal Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 lg:mb-12">
              <ol role="list" className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-500">
                <li><a href="/" className="hover:text-black transition-colors">Home</a></li>
                <li className="select-none">/</li>
                <li><a href="/collections" className="hover:text-black transition-colors">Shop</a></li>
                <li className="select-none">/</li>
                <li className="text-black font-medium">{product.name}</li>
              </ol>
            </nav>

            <div className="lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left Column: Image Gallery (Thumbnail + Main) */}
              <div className="lg:col-span-7 mb-10 lg:mb-0">
                <div className="flex flex-col-reverse lg:flex-row gap-6">
                  {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
                  <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible lg:w-[120px] shrink-0 no-scrollbar">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(image.image_url)}
                        className={`relative w-20 h-24 lg:w-full lg:h-[160px] shrink-0 overflow-hidden border transition-all duration-300 ${activeImage === image.image_url
                          ? 'border-black opacity-100 ring-1 ring-black'
                          : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <ImageWithFallback
                          src={image.image_url}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="flex-1 relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    <ImageWithFallback
                      src={activeImage || product.images[0]?.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Product Info (Sticky) */}
              <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-32">

                {/* Header */}
                <div className="mb-5">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-black mb-3 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-baseline gap-4">
                    <p className="text-2xl font-light text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </p>
                    {/* Kept minimal, no badges */}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 text-gray-600 text-sm leading-relaxed font-light">
                  <p>{product.description || product.full_description}</p>
                </div>

                {/* Selectors and Actions */}
                <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>

                  {/* Colors - Minimal Circles */}
                  {product.colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Color: <span className="text-gray-500 font-normal ml-1">{selectedColor}</span></h3>
                      <div className="flex items-center gap-4">
                        {product.colors.map((color) => (
                          <label
                            key={color.color_name}
                            className={classNames(
                              'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none transition-all duration-300',
                              selectedColor === color.color_name
                                ? 'ring-1 ring-black ring-offset-2 scale-110'
                                : 'hover:scale-110'
                            )}
                          >
                            <input
                              type="radio"
                              name="color"
                              value={color.color_name}
                              checked={selectedColor === color.color_name}
                              onChange={() => setSelectedColor(color.color_name)}
                              className="sr-only"
                            />
                            <span
                              className="h-8 w-8 rounded-full border border-black/10"
                              style={{ backgroundColor: color.color_hex }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes - Clean Text Buttons */}
                  {product.sizes.length > 0 && (
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">Size</h3>
                        <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Size Guide</a>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {product.sizes.map((size) => {
                          const inStock = product.stock > 0;
                          const isSelected = selectedSize === size.size;

                          return (
                            <label
                              key={size.size}
                              className={classNames(
                                inStock
                                  ? 'cursor-pointer'
                                  : 'cursor-not-allowed opacity-50',
                                'group relative flex items-center justify-center border transition-all duration-200 py-3 text-xs font-medium uppercase',
                                isSelected && inStock
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900'
                              )}
                            >
                              <input
                                type="radio"
                                name="size"
                                value={size.size}
                                disabled={!inStock}
                                checked={isSelected}
                                onChange={() => setSelectedSize(size.size)}
                                className="sr-only"
                              />
                              <span>{size.size}</span>
                              {!inStock && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-[1px] bg-gray-300 -rotate-45 transform"></div>
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-black text-white px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 transition-colors duration-300"
                  >
                    Add to Bag — ₹{product.price.toLocaleString()}
                  </button>

                  <p className="mt-4 text-center text-xs text-gray-500 font-light">
                    Free shipping on orders over ₹2000. Imports & taxes included.
                  </p>
                </form>

                {/* Additional Details Accordion-style (Simplified list for now to look cleaner) */}
                <div className="mt-8 border-t border-gray-100 pt-6 space-y-5">
                  {product.specifications.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Highlights</h3>
                      <ul className="text-sm text-gray-600 space-y-2 font-light list-disc pl-5">
                        {product.specifications.slice(0, 4).map((spec, idx) => (
                          <li key={idx}><span className="font-medium text-gray-900">{spec.spec_name}:</span> {spec.spec_value}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.full_description && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Details</h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        {product.full_description}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Related Products - Clean Header */}
            {relatedProducts.length > 0 && (
              <div className="mt-24 lg:mt-32 mb-16 border-t border-gray-100 pt-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-medium text-black mb-4">You May Also Like</h2>
                  <a href="/collections" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-all pb-1">View All Products</a>
                </div>

                <ProductGridSection products={relatedProducts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}