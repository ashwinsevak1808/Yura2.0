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
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);

        if (productData) {
          // Auto-select first available size
          if (productData.sizes && productData.sizes.length > 0) {
            const firstAvailableSize = productData.sizes.find(s => s.stock > 0)?.size || productData.sizes[0].size;
            setSelectedSize(firstAvailableSize);
          }

          // Set first image as active
          if (productData.images && productData.images.length > 0) {
            setActiveImage(productData.images[0].image_url);
          }

          // Load related products
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

  // Derive current stock for selected size
  const currentSizeObj = product?.sizes?.find(s => s.size === selectedSize);
  const currentStock = currentSizeObj ? currentSizeObj.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const newVal = prev + delta;
      if (newVal < 1) return 1;
      if (newVal > currentStock) {
        toast.error(`Only ${currentStock} items available in this size`);
        return currentStock;
      }
      return newVal;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      toast.error("This size is out of stock.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    CartService.addToCart(product, quantity, selectedSize, 'Default');
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

  return (
    <MainLayout>
      <div className="bg-white min-h-screen pb-20 pt-16">
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

              {/* Left Column: Image Gallery */}
              <div className="lg:col-span-7 mb-10 lg:mb-0">
                <div className="flex flex-col-reverse lg:flex-row gap-6">
                  {/* Thumbnails */}
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

              {/* Right Column: Product Info */}
              <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-32">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-black leading-tight">
                    {product.name}
                  </h1>
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      const title = product.meta_title || product.name || "YURA";
                      const text = product.meta_description || product.description || `Check out ${product.name}`;

                      if (navigator.share) {
                        navigator.share({ title, text, url }).catch(console.error);
                        return;
                      }

                      // Robust Clipboard Logic with Fallback for non-secure contexts
                      const copyToClipboard = (text: string) => {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          navigator.clipboard.writeText(text)
                            .then(() => toast.success("Link copied to clipboard"))
                            .catch(() => copyFallback(text));
                        } else {
                          copyFallback(text);
                        }
                      };

                      const copyFallback = (text: string) => {
                        try {
                          const textArea = document.createElement("textarea");
                          textArea.value = text;
                          textArea.style.position = "fixed"; // prevent scrolling
                          document.body.appendChild(textArea);
                          textArea.focus();
                          textArea.select();
                          const successful = document.execCommand('copy');
                          document.body.removeChild(textArea);
                          if (successful) toast.success("Link copied to clipboard");
                          else toast.error("Your browser does not support sharing");
                        } catch (err) {
                          console.error('Fallback copy failed', err);
                          toast.error("Could not copy link");
                        }
                      };

                      copyToClipboard(url);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Share product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
                  </button>
                </div>
                <div className="flex items-baseline gap-4">
                  <p className="text-2xl font-light text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>

                <div className="mb-8 text-gray-600 text-sm leading-relaxed font-light">
                  <p>{product.description || product.full_description}</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}>

                  {/* Sizes */}
                  {product.sizes.length > 0 && (
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900">
                          Size {currentStock < 5 && currentStock > 0 && <span className="text-red-600 normal-case ml-2 rounded bg-red-50 px-2 py-0.5 text-[10px]">Only {currentStock} left!</span>}
                        </h3>
                        <a href="/information/size-guide" className="text-xs text-gray-400 hover:text-black transition-colors underline decoration-gray-300 underline-offset-4">Size Guide</a>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {product.sizes.map((size) => {
                          const stockCount = size.stock;
                          const hasStock = stockCount > 0;
                          const isSelected = selectedSize === size.size;

                          return (
                            <label
                              key={size.size}
                              className={classNames(
                                hasStock
                                  ? 'cursor-pointer'
                                  : 'cursor-not-allowed opacity-40 bg-gray-50',
                                'group relative flex items-center justify-center border transition-all duration-200 py-3 text-xs font-medium uppercase',
                                isSelected && hasStock
                                  ? 'border-black bg-black text-white'
                                  : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900'
                              )}
                            >
                              <input
                                type="radio"
                                name="size"
                                value={size.size}
                                disabled={!hasStock}
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedSize(size.size);
                                  setQuantity(1); // Reset quantity when size changes
                                }}
                                className="sr-only"
                              />
                              <span>{size.size}</span>
                              {!hasStock && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-[120%] h-[1px] bg-gray-400 -rotate-45 transform"></div>
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector (New) */}
                  {!isOutOfStock && (
                    <div className="mb-8">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Quantity</h3>
                      <div className="flex items-center border border-gray-300 w-32">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(-1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <div className="flex-1 text-center text-sm font-medium">{quantity}</div>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isOutOfStock}
                    className={`w-full flex items-center justify-center px-8 py-4 text-sm uppercase tracking-widest font-medium transition-colors duration-300 ${isOutOfStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    {isOutOfStock ? "Out of Stock" : `Add to Bag — ₹${(product.price * quantity).toLocaleString()}`}
                  </button>

                  <p className="mt-4 text-center text-xs text-gray-500 font-light">
                    Free shipping on orders over ₹2000. Imports & taxes included.
                  </p>
                </form>

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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}