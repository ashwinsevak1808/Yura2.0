"use client";

import React, { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Truck, Shield } from "lucide-react";
import { MainLayout } from "@/components/layout/main_layout";
import { CartService } from "@/services/cart.service";
import { CartItem } from "@/types/cart";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCartItems(CartService.getCart());
    setLoading(false);

    const unsubscribe = CartService.subscribe(() => {
      setCartItems(CartService.getCart());
    });

    return () => unsubscribe();
  }, []);

  const updateQuantity = (item: CartItem, newQuantity: number) => {
    CartService.updateQuantity(item.id, item.selectedSize, item.selectedColor, newQuantity);
  };

  const removeItem = (item: CartItem) => {
    CartService.removeFromCart(item.id, item.selectedSize, item.selectedColor);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen pb-20 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-black mb-2 leading-tight">
              Shopping Bag
            </h1>
            <p className="text-sm text-gray-500 font-light">
              You have {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white p-16 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-200 mb-6" />
              <h2 className="text-2xl font-serif font-medium text-black mb-3">Your bag is empty</h2>
              <p className="text-gray-500 font-light mb-8 text-sm">Start adding items to your collection</p>
              <a
                href="/collections"
                className="inline-block bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Cart Items - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => {
                  const primaryImage = item.images.find(img => img.is_primary) || item.images[0];
                  return (
                    <div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="bg-white p-6 flex gap-6"
                    >

                      {/* Product Image - Larger */}
                      <div className="flex-shrink-0 w-40 h-52 bg-gray-50">
                        <a href={`/product/${item.slug}`}>
                          <ImageWithFallback
                            src={primaryImage?.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                          />
                        </a>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">

                        {/* Top Section - Name, Color, Size, Remove */}
                        <div className="flex justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <a href={`/product/${item.slug}`}>
                              <h3 className="font-serif text-2xl text-black mb-3 hover:opacity-70 transition-opacity">
                                {item.name}
                              </h3>
                            </a>
                            <div className="space-y-1 text-sm">
                              {item.selectedColor && (
                                <p className="text-gray-600 font-light">
                                  <span className="text-xs uppercase tracking-wider text-gray-400">Color:</span> {item.selectedColor}
                                </p>
                              )}
                              {item.selectedSize && (
                                <p className="text-gray-600 font-light">
                                  <span className="text-xs uppercase tracking-wider text-gray-400">Size:</span> {item.selectedSize}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item)}
                            className="text-gray-400 hover:text-black transition-colors h-fit"
                            aria-label="Remove item"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Bottom Section - Price and Quantity */}
                        <div className="mt-auto flex items-end justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Price</p>
                            <p className="text-xl font-light text-black">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Quantity</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-9 h-9 flex items-center justify-center border border-gray-300 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center border border-gray-300 hover:border-black transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Benefits Section */}
                <div className="bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Free Shipping</h4>
                        <p className="text-sm text-gray-600 font-light">On orders above ₹2,000</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Secure Payment</h4>
                        <p className="text-sm text-gray-600 font-light">100% secure transactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Sticky Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 lg:sticky lg:top-32">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                    Order Summary
                  </h2>

                  <dl className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <dt className="text-gray-600 font-light">Subtotal</dt>
                      <dd className="text-black font-medium">₹{subtotal.toLocaleString()}</dd>
                    </div>
                    <div className="flex items-center justify-between text-sm pb-6 border-b border-gray-100">
                      <dt className="text-gray-600 font-light">Shipping</dt>
                      <dd className="text-black font-medium">
                        {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <dt className="text-sm font-bold uppercase tracking-wider text-black">Total</dt>
                      <dd className="text-2xl font-medium text-black">₹{total.toLocaleString()}</dd>
                    </div>
                  </dl>

                  {shipping > 0 && (
                    <div className="bg-gray-50 p-4 mb-6">
                      <p className="text-xs text-gray-600 font-light text-center">
                        Add <span className="font-medium text-black">₹{(2000 - subtotal).toLocaleString()}</span> more for free shipping
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => window.location.href = "/checkout"}
                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <a
                    href="/collections"
                    className="block text-center text-xs text-gray-500 hover:text-black font-light uppercase tracking-widest transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}