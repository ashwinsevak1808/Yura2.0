"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { CartService } from "@/services/cart.service";
import { submitOrderAction } from "@/app/actions/checkout";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/payment";
import { generateAndSendOtp, verifyOtpAction } from "@/app/actions/otp"; // Import OTP actions
import { OrderData, CartItem } from "@/types";
import { Lock, ChevronDown, ChevronUp, X } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Declare Razorpay on window object
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    // OTP States
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState("");

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
        paymentMethod: "COD" as "COD" | "ONLINE",
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

    const [subtotal, setSubtotal] = useState(0);
    const [charges, setCharges] = useState<{ label: string, amount: number }[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const calculate = async () => {
            const sub = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            setSubtotal(sub);

            // Fetch charges dynamically
            const { ChargesService } = await import('@/services/charges.service');
            const applicableCharges = await ChargesService.getApplicableCharges(sub);
            const chargeAmount = ChargesService.calculateCharges(sub, applicableCharges);

            setCharges(applicableCharges.map(c => ({
                label: c.label,
                amount: c.type === 'fixed' ? c.amount : (sub * (c.amount / 100))
            })));
            setTotal(sub + chargeAmount);
        };
        if (cartItems.length > 0) calculate();
    }, [cartItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const initiateOtp = async () => {
        // Validation for Phone Number (10 digits)
        if (!/^\d{10}$/.test(formData.phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        setOtpLoading(true);
        setOtpError("");
        const result = await generateAndSendOtp(formData.email, formData.phone);
        setOtpLoading(false);

        if (result.success) {
            setShowOtpModal(true);
        } else {
            alert(result.message || "Failed to send verification code.");
        }
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length < 6) {
            setOtpError("Please enter a valid 6-digit code");
            return;
        }
        setOtpLoading(true);
        const result = await verifyOtpAction(formData.email, otpCode);
        setOtpLoading(false);

        if (result.success) {
            setIsVerified(true);
            setShowOtpModal(false);
            processOrderSubmission();
        } else {
            setOtpError(result.message || "Invalid code. Please try again.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Checkout Submit Triggered. Verified Status:", isVerified);

        if (!isVerified) {
            console.log("Not verified yet. Initiating OTP...");
            // Trigger OTP flow
            await initiateOtp();
            return;
        }

        // Proceed if verified
        console.log("Verified. Processing Order Submission...");
        await processOrderSubmission();
    };

    const processOrderSubmission = async () => {
        console.log("Starting processOrderSubmission...");
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
            // If COD, submit order directly
            if (formData.paymentMethod === "COD") {
                const result = await submitOrderAction(orderData);

                if (result.success) {
                    CartService.clearCart();
                    router.push(`/order/confirmed?order_id=${result.orderId}&payment_method=COD`);
                } else {
                    throw new Error(result.message);
                }
            }
            // If ONLINE, create Razorpay order and open payment modal
            else if (formData.paymentMethod === "ONLINE") {
                // First, create a temporary order ID
                const tempOrderId = `ORDER-${Date.now()}`;

                // Create Razorpay order
                const razorpayOrderResult = await createRazorpayOrder({
                    amount: total,
                    orderId: tempOrderId,
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    customerPhone: orderData.customerPhone,
                });

                if (!razorpayOrderResult.success) {
                    throw new Error("Failed to create payment order");
                }

                // Load Razorpay script if not already loaded
                if (!window.Razorpay) {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.async = true;
                    document.body.appendChild(script);
                    await new Promise((resolve) => {
                        script.onload = resolve;
                    });
                }

                // Configure Razorpay options
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: razorpayOrderResult.amount,
                    currency: razorpayOrderResult.currency,
                    name: "YURAA",
                    description: "Order Payment",
                    order_id: razorpayOrderResult.orderId,
                    prefill: {
                        name: orderData.customerName,
                        email: orderData.customerEmail,
                        contact: orderData.customerPhone,
                    },
                    notes: {
                        customer_name: orderData.customerName,
                        customer_email: orderData.customerEmail,
                        shipping_address: JSON.stringify(orderData.shippingAddress),
                    },
                    theme: {
                        color: "#000000",
                    },
                    handler: async function (response: any) {
                        try {
                            console.log("Payment successful:", response);

                            // Verify payment signature
                            const verifyResult = await verifyRazorpayPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });

                            if (verifyResult.success) {
                                // Payment verified, now create the order in database
                                const orderResult = await submitOrderAction({
                                    ...orderData,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                });

                                if (orderResult.success) {
                                    CartService.clearCart();
                                    // Redirect to order confirmed page with payment details
                                    router.push(
                                        `/order/confirmed?order_id=${orderResult.orderId}&payment_method=ONLINE&razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}`
                                    );
                                } else {
                                    throw new Error("Failed to create order after payment");
                                }
                            } else {
                                throw new Error("Payment verification failed");
                            }
                        } catch (error) {
                            console.error("Payment handler error:", error);
                            // Redirect to failure page
                            const errorMsg = error instanceof Error ? error.message : "Order creation failed";
                            router.push(
                                `/payment/failure?reason=Order Creation Failed&description=${encodeURIComponent(errorMsg)}. Please contact support.&payment_id=${response.razorpay_payment_id || ""}`
                            );
                            setSubmitting(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setSubmitting(false);
                            console.log("Payment modal dismissed by user");
                        },
                        // Handle payment errors in modal
                        escape: true,
                        confirm_close: false,
                        // Add error handler
                        backdropclose: true,
                    },
                };

                // Create Razorpay instance
                const razorpay = new window.Razorpay(options);

                // Add payment failure handler
                razorpay.on('payment.failed', function (response: any) {
                    console.log("=== PAYMENT FAILED EVENT FIRED ===");
                    console.error("Payment failed response:", response);

                    // Handle empty or undefined error object
                    const error = response?.error || {};
                    // If response is completely empty, use better defaults
                    const reason = error.reason || error.code || "Payment Declined";
                    const description = error.description || error.source || "Your payment could not be processed. This may be due to insufficient funds, incorrect card details, or your bank declining the transaction. Please try again or use a different payment method.";
                    const orderId = error.metadata?.order_id || "";
                    const paymentId = error.metadata?.payment_id || "";

                    console.log("Error details:", { reason, description, orderId, paymentId });

                    // Close the modal
                    try {
                        razorpay.close();
                        console.log("Modal closed");
                    } catch (e) {
                        console.log("Modal close error:", e);
                    }

                    // Redirect to failure page
                    const failureUrl = `/payment/failure?reason=${encodeURIComponent(reason)}&description=${encodeURIComponent(description)}&order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`;
                    console.log("Redirecting to:", failureUrl);

                    // Use window.location.href for forced redirect (more reliable)
                    window.location.href = failureUrl;
                });

                // Open Razorpay payment modal
                razorpay.open();
            }
        } catch (error) {
            alert("Failed to place order. Please try again.");
            console.error(error);
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
            <div className="bg-gray-50 min-h-screen pb-20 pt-16 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">

                    {/* Breadcrumb */}
                    <Breadcrumb items={[
                        { label: 'Home', href: '/' },
                        { label: 'Shopping Bag', href: '/cart' },
                        { label: 'Checkout' }
                    ]} />

                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-black mb-2 leading-tight">
                            Checkout
                        </h1>
                        <p className="text-sm text-gray-500 font-light">
                            Complete your order details below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} id="checkout-form">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column - Forms (2 columns) */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Contact Information */}
                                <div className="bg-white p-6 sm:p-8">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                                            Contact Information
                                        </h2>
                                        {isVerified && (
                                            <span className="text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                                                readOnly={isVerified}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors ${isVerified ? 'bg-gray-50 text-gray-500' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                                                Phone *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-light pointer-events-none">
                                                    +91
                                                </span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    required
                                                    readOnly={isVerified}
                                                    maxLength={10}
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) {
                                                            setFormData(prev => ({ ...prev, phone: val }));
                                                        }
                                                    }}
                                                    className={`w-full pl-12 pr-4 py-3 border border-gray-200 text-sm font-light focus:outline-none focus:border-black transition-colors ${isVerified ? 'bg-gray-50 text-gray-500' : ''}`}
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="bg-white p-6 sm:p-8">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Shipping Address
                                    </h2>
                                    <div className="space-y-4 sm:space-y-6">
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
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                                <div className="bg-white p-6 sm:p-8">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6 pb-4 border-b border-gray-100">
                                        Payment Method
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                        <label className={`relative flex flex-col p-6 border-2 cursor-pointer transition-all ${formData.paymentMethod === "ONLINE"
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 hover:border-black"
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="ONLINE"
                                                checked={formData.paymentMethod === "ONLINE"}
                                                onChange={handleInputChange}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between mb-2">
                                                <p className={`text-sm font-bold uppercase tracking-wider ${formData.paymentMethod === "ONLINE" ? "text-white" : "text-black"
                                                    }`}>
                                                    Online Payment
                                                </p>
                                                {formData.paymentMethod === "ONLINE" && (
                                                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-xs font-light ${formData.paymentMethod === "ONLINE" ? "text-gray-300" : "text-gray-500"
                                                }`}>
                                                Pay securely via Razorpay
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary - HIDDEN ON MOBILE */}
                            <div className="hidden lg:block lg:col-span-1">
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
                                        {charges.map((charge, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm pb-2 border-gray-100">
                                                <dt className="text-gray-600 font-light">{charge.label}</dt>
                                                <dd className="text-black font-medium">₹{charge.amount.toLocaleString()}</dd>
                                            </div>
                                        ))}

                                        {charges.length === 0 && (
                                            <div className="flex items-center justify-between text-sm pb-4 border-b border-gray-100">
                                                <dt className="text-gray-600 font-light">Shipping</dt>
                                                <dd className="text-black font-medium">Free</dd>
                                            </div>
                                        )}
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
                                                {isVerified ? "Place Order" : "Verify & Place Order"}
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 font-light text-center mt-4">
                                        Your payment information is secure
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sticky Footer with Expandable Summary */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
                            {/* Expandable Breakdown */}
                            {isSummaryOpen && (
                                <div className="px-4 pt-4 pb-2 border-b border-gray-100 bg-gray-50">
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-gray-600 font-light">Subtotal</dt>
                                            <dd className="text-black font-medium">₹{subtotal.toLocaleString()}</dd>
                                        </div>
                                        {/* Dynamic Charges */}
                                        {charges.map((charge, index) => (
                                            <div key={index} className="flex justify-between">
                                                <dt className="text-gray-600 font-light">{charge.label}</dt>
                                                <dd className="text-black font-medium">₹{charge.amount.toLocaleString()}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            {/* Main Footer Bar */}
                            <div className="px-4 py-3">
                                <div className="flex items-center justify-between mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                                        className="flex items-center gap-1 text-xs uppercase tracking-widest text-gray-500 font-bold"
                                    >
                                        {isSummaryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                        <span>{isSummaryOpen ? 'Hide' : 'Show'} Details</span>
                                    </button>
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-0.5">Total</p>
                                        <p className="text-xl font-medium text-black">₹{total.toLocaleString()}</p>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            {isVerified ? "Place Order" : "Verify & Place Order"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* OTP Verification Modal */}
                {showOtpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
                            <button
                                onClick={() => setShowOtpModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-5 h-5 text-black" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-black mb-2">Verify Your Order</h3>
                                <p className="text-sm text-gray-500 font-light">
                                    We've sent a 6-digit code to <br />
                                    <span className="font-medium text-black">{formData.email}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full text-center text-3xl tracking-[0.5em] font-mono p-4 border border-gray-200 focus:border-black focus:outline-none transition-colors placeholder:text-gray-200"
                                    />
                                    {otpError && (
                                        <p className="text-red-500 text-xs text-center mt-2 font-medium animate-pulse">{otpError}</p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={otpLoading || otpCode.length !== 6}
                                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {otpLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={initiateOtp}
                                        className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
