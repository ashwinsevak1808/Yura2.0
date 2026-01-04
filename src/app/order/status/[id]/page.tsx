"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main_layout";
import { getOrderDetailsAction } from "@/app/actions/checkout";
import { requestReturnAction } from "@/app/actions/order";
import { CheckCircle, Clock, Package, Truck, Info, ArrowRight, X, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

export default function OrderStatusPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Return Modal State
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

    useEffect(() => {
        if (!orderId) return;
        loadOrder();
    }, [orderId]);

    const loadOrder = () => {
        setLoading(true);
        getOrderDetailsAction(orderId)
            .then(res => {
                if (res.success) {
                    setOrder(res.order);
                } else {
                    setError(res.message || "Failed to load order.");
                }
            })
            .catch(() => setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    const handleReturnSubmit = async () => {
        if (!returnReason.trim()) return;

        setIsSubmittingReturn(true);
        try {
            const res = await requestReturnAction(orderId, returnReason);
            if (res.success) {
                setIsReturnModalOpen(false);
                setReturnReason("");
                // Reload order to show updated status
                loadOrder();
                alert("Return request submitted successfully. We will review it shortly.");
            } else {
                alert(res.message || "Failed to submit return request.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        } finally {
            setIsSubmittingReturn(false);
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

    if (error || !order) {
        return (
            <MainLayout>
                <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
                    <div className="bg-white p-12 max-w-lg w-full text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-serif text-black mb-3">Order Not Found</h2>
                        <p className="text-gray-500 font-light mb-8 max-w-sm mx-auto leading-relaxed">
                            {error || "We couldn't seem to find the order you're looking for. It might have been moved or doesn't exist."}
                        </p>
                        <a href="/" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Determine current step index
    const steps = [
        { id: 'pending', label: 'Confirmed', icon: Clock, description: 'Order received' },
        { id: 'confirmed', label: 'Processing', icon: Package, description: 'We are preparing your order' },
        { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Package has been delivered' },
    ];

    let currentStepIndex = 0;
    const status = order.status;

    if (status === 'confirmed') currentStepIndex = 1;
    if (status === 'shipped') currentStepIndex = 2;
    if (status === 'delivered') currentStepIndex = 3;
    if (status === 'cancelled') currentStepIndex = -1; // Handle separately

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-24">
                    <div className="max-w-4xl mx-auto">

                        {/* Return Request Banner */}
                        {order.return_status && (
                            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 md:p-6 rounded-sm shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 rounded-full shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1">
                                            Return {order.return_status === 'requested' ? 'Requested' : order.return_status}
                                        </h3>
                                        <p className="text-sm text-amber-700/80 leading-relaxed">
                                            You have requested a return for this order on {new Date(order.return_requested_at).toLocaleDateString()}.
                                            <br />Status: <span className="font-medium">{order.return_status}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header Section */}
                        <div className="mb-8 md:mb-16 bg-white p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest ${status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'cancelled' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                                            {status === 'pending' ? 'Order Placed' : status}
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-serif font-medium text-black">
                                        Order #{order.id.slice(0, 8).toUpperCase()}
                                    </h1>
                                </div>
                                <div className="text-right">
                                    {status === 'delivered' && !order.return_status && (
                                        <button
                                            onClick={() => setIsReturnModalOpen(true)}
                                            className="inline-flex items-center justify-center gap-2 bg-white text-black border border-gray-200 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm"
                                        >
                                            Return Order
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* Decorative background pattern */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50 z-0"></div>
                        </div>

                        {/* Status Timeline */}
                        {status === 'cancelled' ? (
                            <div className="bg-white p-6 md:p-10 mb-8 md:mb-12 border-l-4 border-red-500 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 rounded-full">
                                        <Info className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-600 mb-1">Order Cancelled</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            This order was cancelled on {new Date(order.cancelled_at || order.updated_at).toLocaleDateString()}.
                                            <br />Reason: <span className="text-black font-medium">{order.cancellation_reason || "Canceled by user request."}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-6 md:p-12 mb-8 md:mb-12 shadow-sm border border-gray-100">
                                <div className="relative">
                                    {/* Desktop Progress Bar (Horizontal) - Cleaner Style */}
                                    <div className="hidden md:block absolute left-0 top-[24px] w-full h-[2px] bg-gray-100 rounded-full"></div>
                                    <div
                                        className="hidden md:block absolute left-0 top-[24px] h-[2px] bg-black transition-all duration-1000 rounded-full"
                                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                    ></div>

                                    {/* Mobile Timeline Container - Redesigned */}
                                    <div className="md:hidden relative border-l-2 border-gray-100 ml-4 pl-8 space-y-10 py-2">
                                        {/* Dynamic darker line for progress on mobile */}
                                        <div
                                            className="absolute left-[-2px] top-0 w-[2px] bg-black transition-all duration-1000"
                                            style={{ height: `${Math.min((currentStepIndex / (steps.length - 1)) * 100, 100)}%` }}
                                        ></div>

                                        {steps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isCompleted = index <= currentStepIndex;
                                            const isCurrent = index === currentStepIndex;

                                            return (
                                                <div key={step.id} className="relative">
                                                    {/* Dot on Line */}
                                                    <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white z-10 ${isCompleted ? 'border-black' : 'border-gray-200'
                                                        }`}>
                                                        {isCompleted ? <div className="w-2 h-2 bg-black rounded-full" /> : null}
                                                    </div>

                                                    <div className={`transition-all duration-300 ${isCurrent ? 'transform translate-x-1' : ''}`}>
                                                        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                            {step.label}
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 font-light leading-snug">
                                                            {step.description}
                                                        </p>
                                                        {isCurrent && (
                                                            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                                                <Clock className="w-3 h-3" />
                                                                Current Status
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop Timeline - Cleaner Cards */}
                                    <div className="hidden md:flex justify-between relative w-full">
                                        {steps.map((step, index) => {
                                            const Icon = step.icon;
                                            const isCompleted = index <= currentStepIndex;
                                            const isCurrent = index === currentStepIndex;

                                            return (
                                                <div key={step.id} className="flex flex-col items-center relative z-10 group" style={{ width: '140px' }}>
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white mb-4 ${isCompleted ? 'border-black text-black z-20 shadow-lg' : 'border-gray-100 text-gray-300'
                                                            } ${isCurrent ? 'ring-4 ring-gray-50 scale-110' : ''}`}
                                                    >
                                                        {isCompleted ? <Icon className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                                    </div>
                                                    <div className="text-center w-full">
                                                        <p className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 mb-1 ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                                                            {step.label}
                                                        </p>
                                                        {isCurrent && (
                                                            <p className="text-[10px] text-green-600 font-medium animate-pulse">
                                                                ● In Progress
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Tracking Info If Shipped */}
                                {status === 'shipped' && order.tracking_number && (
                                    <div className="mt-8 md:mt-12 pt-6 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 px-6 py-5 rounded-sm border border-gray-200 border-dashed">
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded-sm">
                                                    <Truck className="w-5 h-5 text-black" strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Carrier</p>
                                                    <p className="font-medium text-black text-sm">{order.carrier || "Standard Delivery"}</p>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
                                            <div className="w-full sm:w-auto text-center sm:text-left">
                                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Tracking Number</p>
                                                <p className="font-mono text-base text-black">{order.tracking_number}</p>
                                            </div>
                                            <div className="w-full sm:w-auto">
                                                <a href="#" className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-sm">
                                                    Track Package <ArrowRight className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                <div className="bg-white shadow-sm overflow-hidden rounded-sm border border-gray-100">
                                    <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-black">Order Summary</h3>
                                        <span className="text-xs text-gray-400 font-light">{order.items?.length || 0} Items</span>
                                    </div>

                                    <div className="p-4 md:p-8 space-y-6">
                                        {(order.items || []).map((item: any, i: number) => (
                                            <div key={i} className="flex gap-4 md:gap-6 group">
                                                <div className="w-20 md:w-24 h-28 md:h-32 bg-gray-50 flex-shrink-0 relative overflow-hidden rounded-sm border border-gray-100">
                                                    <ImageWithFallback
                                                        src={item.image_url}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="flex-1 py-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 gap-1">
                                                        <h4 className="text-sm md:text-base font-medium text-black font-serif truncate pr-4">{item.product_name}</h4>
                                                        <p className="text-sm font-medium text-black">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-4">
                                                            <p className="text-xs text-gray-500 font-light">Size: <span className="text-black font-normal">{item.size}</span></p>
                                                            <p className="text-xs text-gray-500 font-light">Color: <span className="text-black font-normal">{item.color}</span></p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-light">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 bg-gray-50/50 p-6 md:p-8 space-y-3">
                                        <div className="flex justify-between text-xs md:text-sm">
                                            <span className="text-gray-500 font-light">Subtotal</span>
                                            <span className="font-medium text-black">₹{order.subtotal?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs md:text-sm">
                                            <span className="text-gray-500 font-light">Shipping</span>
                                            <span className="font-medium text-black">
                                                {order.shipping_cost === 0 ? "Free" : `₹${order.shipping_cost}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base md:text-lg pt-4 border-t border-gray-200 mt-2">
                                            <span className="font-bold uppercase tracking-widest text-black text-xs self-center">Total</span>
                                            <span className="font-serif font-medium text-black">₹{order.total_amount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                {/* Address Card */}
                                <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm border border-gray-100 h-fit">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 pb-2 border-b border-gray-50">Delivery Address</h3>
                                    <p className="text-sm font-medium text-black mb-1">{order.customer_name}</p>
                                    <address className="text-sm text-gray-500 font-light leading-relaxed not-italic mb-5 block">
                                        {order.shipping_address?.street}<br />
                                        {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                                        {order.shipping_address?.zipCode}
                                    </address>

                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Contact Number</p>
                                            <p className="text-xs text-black font-medium">{order.customer_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Card */}
                                <div className="bg-black text-white p-6 md:p-8 shadow-sm rounded-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Need Help?</h3>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                    <p className="text-xs text-gray-300 font-light leading-relaxed mb-6">
                                        Have questions about your order? Our support team is here to assist you.
                                    </p>
                                    <a
                                        href="mailto:info.yura.co@gmail.com"
                                        className="flex items-center justify-center gap-2 w-full py-3 border border-white/20 text-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Return Request Modal */}
                {isReturnModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white max-w-md w-full p-6 shadow-xl rounded-sm relative animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setIsReturnModalOpen(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-xl font-serif text-black mb-2">Request Return</h3>
                            <p className="text-sm text-gray-500 font-light mb-6">
                                We are sorry you are not satisfied with your purchase. Please tell us why you would like to return this order.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 block">
                                        Reason for Return
                                    </label>
                                    <textarea
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        placeholder="e.g., Wrong size, Damaged item, Not as described..."
                                        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-sm focus:border-black focus:ring-0 transition-colors resize-none placeholder:text-gray-300"
                                    />
                                </div>

                                <button
                                    onClick={handleReturnSubmit}
                                    disabled={!returnReason.trim() || isSubmittingReturn}
                                    className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmittingReturn ? "Submitting..." : "Submit Request"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
