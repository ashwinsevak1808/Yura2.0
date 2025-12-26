"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { CartService } from "@/services/cart.service";
import { submitOrderAction } from "@/app/actions/checkout";
import { OrderData, CartItem } from "@/types";
import { Lock, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        specialInstructions: "",
        paymentMethod: "COD" as "COD" | "UPI",
    });

    useEffect(() => {
        const items = CartService.getCart();
        if (items.length === 0) {
            router.push("/cart");
            return;
        }
        setCartItems(items);
        setLoading(false);
    }, [router]);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = subtotal > 2000 ? 0 : 150;
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const orderData: OrderData = {
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
            },
            specialInstructions: formData.specialInstructions,
            paymentMethod: formData.paymentMethod,
            totalAmount: total,
            items: cartItems,
        };

        try {
            const result = await submitOrderAction(orderData);

            if (result.success) {
                CartService.clearCart();
                router.push("/order/confirmed");
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert("Failed to place order. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
                            Checkout
                        </h1>
                        <p className="text-sm text-gray-500 font-light">
                            Complete your order details below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column - Forms (2 columns) */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Contact Information */}
                                <div className="bg-white p-8">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="firstName" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white p-8">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Shipping Address
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="street" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="street"
                                                id="street"
                                                required
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label htmlFor="city" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="zipCode" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                    ZIP Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    id="zipCode"
                                                    required
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="specialInstructions" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Special Instructions (Optional)
                                            </label>
                                            <textarea
                                                name="specialInstructions"
                                                id="specialInstructions"
                                                rows={3}
                                                value={formData.specialInstructions}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors resize-none"
                                                placeholder="Any special delivery instructions..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white p-8">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Payment Method
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className={`relative flex flex-col p-6 border-2 cursor-pointer transition-all ${formData.paymentMethod === "COD"
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-black"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="COD"
                                                checked={formData.paymentMethod === "COD"}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-sm font-bold uppercase tracking-wider ${formData.paymentMethod === "COD" ? "text-white" : "text-black"
                                                    }`}>
                                                    Cash on Delivery
                                                </p>
                                                {formData.paymentMethod === "COD" && (
                                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-xs font-light ${formData.paymentMethod === "COD" ? "text-gray-300" : "text-gray-500"
                                                }`}>
                                                Pay when you receive your order
                                            </p>
                                        </label>

                                        <label className={`relative flex flex-col p-6 border-2 cursor-pointer transition-all ${formData.paymentMethod === "UPI"
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-black"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="UPI"
                                                checked={formData.paymentMethod === "UPI"}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-sm font-bold uppercase tracking-wider ${formData.paymentMethod === "UPI" ? "text-white" : "text-black"
                                                    }`}>
                                                    UPI Payment
                                                </p>
                                                {formData.paymentMethod === "UPI" && (
                                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-xs font-light ${formData.paymentMethod === "UPI" ? "text-gray-300" : "text-gray-500"
                                                }`}>
                                                Pay securely via UPI
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 lg:sticky lg:top-32">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Order Summary
                                    </h2>

                                    {/* Cart Items */}
                                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                        {cartItems.map((item) => {
                                            const primaryImage = item.images.find(img => img.is_primary) || item.images[0];
                                            return (
                                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                                                    <div className="w-16 h-20 bg-gray-50 flex-shrink-0">
                                                        <ImageWithFallback
                                                            src={primaryImage?.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium text-black mb-1 truncate">{item.name}</h3>
                                                        <p className="text-xs text-gray-500 font-light">
                                                            {item.selectedSize} • {item.selectedColor}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-light">Qty: {item.quantity}</p>
                                                        <p className="text-sm font-medium text-black mt-1">₹{item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Totals */}
                                    <dl className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <dt className="text-gray-600 font-light">Subtotal</dt>
                                            <dd className="text-black font-medium">₹{subtotal.toLocaleString()}</dd>
                                        </div>
                                        <div className="flex items-center justify-between text-sm pb-4 border-b border-gray-100">
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

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                Place Order
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 font-light text-center mt-4">
                                        Your payment information is secure
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
