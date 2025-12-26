"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminService } from "@/services/admin.service";
import { ArrowLeft, Printer, Mail, MapPin, Phone, User } from "lucide-react";
import { useDialog } from "@/context/dialog-context";
import { Order } from "@/types";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { showSuccess, showError } = useDialog();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            if (params.id) {
                try {
                    const data = await AdminService.getOrderById(params.id as string);
                    setOrder(data);
                } catch (error) {
                    console.error("Failed to load order", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        loadOrder();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="mx-auto space-y-8 animate-in fade-in duration-500 max-w-5xl">
            {/* Header - Hidden on Print */}
            <div className="flex items-center justify-between no-print">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    <div className="mr-2 p-2 bg-white border border-gray-200 rounded-full group-hover:border-black transition-colors">
                        <ArrowLeft className="w-4 h-4 text-black" />
                    </div>
                    Back to Orders
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center px-6 h-11 bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-black transition-all min-w-[140px]"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Print Invoice
                    </button>
                    <button className="flex items-center justify-center px-6 h-11 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 shadow-lg shadow-black/20 transition-all min-w-[140px]">
                        <Mail className="w-4 h-4 mr-2" /> Send Email
                    </button>
                </div>
            </div>

            {/* Print Header - Visible ONLY on Print */}
            <div className="hidden print:block mb-8">
                <div className="flex justify-between items-start border-b border-black pb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-black tracking-tighter">YURA.</h1>
                        <div className="mt-4 text-sm text-gray-600 space-y-1">
                            <p>123 Fashion Street, Design District</p>
                            <p>Mumbai, Maharashtra 400001</p>
                            <p>support@yura.co.in | +91 98765 43210</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-light uppercase tracking-widest text-gray-400">Invoice</h2>
                        <p className="font-mono text-lg font-bold mt-2">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden print:border-none print:shadow-none">
                {/* Status Bar - Hidden on Print */}
                <div className="bg-gray-50/50 px-8 py-8 border-b border-gray-100 flex justify-between items-center no-print">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Order ID</p>
                        <h1 className="text-2xl font-mono font-medium text-black tracking-tight">#{order.id}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Status</p>
                        <div className="relative group">
                            <select
                                value={order.status}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                        setLoading(true);
                                        await AdminService.updateOrderStatus(order.id, newStatus);
                                        setOrder({ ...order, status: newStatus });
                                        showSuccess("Status Updated", `Order status updated to ${newStatus.toUpperCase()} and email notification sent.`);
                                    } catch (error) {
                                        console.error("Failed to update status", error);
                                        showError("Update Failed", "Failed to update order status. Please try again.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className={`appearance-none cursor-pointer pl-4 pr-10 py-2 text-xs font-bold uppercase tracking-widest border focus:outline-none focus:ring-1 focus:ring-black transition-all ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        order.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-8 print:p-0 print:mb-8">
                    {/* Billed To */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 print:text-black">Billed To</h3>
                        <div className="text-sm text-gray-900 leading-relaxed font-medium">
                            <p className="text-lg text-black font-serif font-bold mb-1">{order.customer_name || "Guest Checkout"}</p>
                            <p className="font-mono text-gray-600 mb-1">{order.customer_email}</p>
                            <p className="font-mono text-gray-600">{order.customer_phone || "No phone provided"}</p>
                        </div>
                    </div>

                    {/* Shipped To */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 print:text-black">Shipped To</h3>
                        <div className="text-sm text-gray-900 leading-relaxed">
                            {order.shipping_address ? (
                                <div className="space-y-1">
                                    {Object.values(order.shipping_address).filter(Boolean).map((line: any, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No shipping address provided</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="print:mt-8">
                    <table className="min-w-full divide-y divide-gray-100 print:divide-black">
                        <thead>
                            <tr className="bg-gray-50 print:bg-transparent print:border-b-2 print:border-black">
                                <th scope="col" className="px-8 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] print:px-0 print:text-black">Product</th>
                                <th scope="col" className="px-8 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] print:px-0 print:text-black">Price</th>
                                <th scope="col" className="px-8 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] print:px-0 print:text-black">Qty</th>
                                <th scope="col" className="px-8 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] print:px-0 print:text-black">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white print:divide-gray-200">
                            {order.order_items?.map((item: any) => {
                                const product = item.product;
                                return (
                                    <tr key={item.id} className="group">
                                        <td className="px-8 py-6 print:px-0">
                                            <div className="flex items-start">
                                                <div className="ml-0">
                                                    <div className="text-sm font-bold text-gray-900">{product?.name || "Unknown Product"}</div>
                                                    <div className="text-xs text-gray-500 font-mono mt-1">Size: {item.size} | Color: {item.color}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm text-gray-600 font-mono print:px-0">
                                            ₹{Number(item.price).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm text-gray-900 font-mono font-medium print:px-0">
                                            {item.quantity}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-bold text-gray-900 font-mono print:px-0">
                                            ₹{(Number(item.price) * item.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="border-t border-gray-100 bg-gray-50/30 p-8 lg:p-10 print:bg-transparent print:border-t-2 print:border-black print:px-0">
                    <div className="flex justify-end">
                        <div className="w-80 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-mono font-medium">₹{order.total_amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span className="font-mono text-green-600 font-medium">Free</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-baseline print:border-black">
                                <span className="text-base font-bold text-gray-900 uppercase tracking-widest">Total</span>
                                <span className="font-mono text-2xl font-bold text-black">₹{order.total_amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-xs text-gray-400 no-print">
                    <p>Order placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
                </div>

                {/* Print Only Footer */}
                <div className="hidden print:block mt-12 pt-8 border-t border-gray-200 text-center">
                    <p className="text-xs font-serif text-gray-500 italic">Thank you for choosing YURA. We hope to see you again soon.</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 2cm; }
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </div >
    );
}
