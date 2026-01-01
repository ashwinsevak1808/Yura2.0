"use client";

import React from 'react';

interface InvoiceItem {
    name: string;
    size?: string;
    qty: number;
    price: number;
}

interface InvoiceCustomer {
    name: string;
    email: string;
    address: string;
}

interface InvoiceData {
    id: string;
    date: string;
    customer: InvoiceCustomer;
    items: InvoiceItem[];
    subtotal: number;
    shipping: number;
    total: number;
    payment_method?: string;
    payment_status?: string;
}

interface InvoiceTemplateProps {
    invoice: InvoiceData;
}

export function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
    return (
        <>
            <div id="invoice-template" className="bg-white text-black relative shadow-2xl overflow-hidden mx-auto print:shadow-none"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '15mm', // Standard print margins
                    backgroundColor: 'white'
                }}
            >
                {/* 1. HEADER SECTION */}
                <header className="flex justify-between items-start border-b border-black/10 pb-8 mb-12">
                    <div>
                        <img src="/logo.svg" alt="YURAA" className="h-20 mb-6" />
                        <div className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium space-y-1">
                            <p>Premium Department</p>
                            <p>Mumbai, India</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-block border border-black p-4 mb-4">
                            {/* Dummy QR Code */}
                            <div className="w-16 h-16 bg-white flex flex-wrap content-center justify-center gap-1 opacity-80">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-black">Invoice No.</p>
                        <p className="font-mono text-xl text-black">#{invoice.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </header>

                {/* 2. CUSTOMER & META DATA */}
                <div className="grid grid-cols-12 gap-8 mb-16">
                    <div className="col-span-4">
                        <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Billed To</h3>
                        <p className="font-serif text-xl mb-2 text-black">{invoice.customer.name}</p>
                        <p className="text-xs text-gray-600 leading-relaxed max-w-[180px]">{invoice.customer.address}</p>
                        <p className="text-xs text-gray-400 mt-2 hover:text-black transition-colors">{invoice.customer.email}</p>
                    </div>

                    <div className="col-span-4">
                        {/* Spacer or Shipping Address if distinct */}
                    </div>

                    <div className="col-span-4 space-y-6 text-right">
                        <div>
                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Date Issued</h3>
                            <p className="font-mono text-sm text-black">{invoice.date}</p>
                        </div>
                        <div>
                            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Payment Status</h3>
                            <span className="inline-flex items-center px-2 py-1 rounded bg-black text-white text-[9px] font-bold uppercase tracking-wider">
                                {invoice.payment_method || 'Online'} - {invoice.payment_status || 'Paid'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. LINE ITEMS (Minimalist Table) */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="text-left font-bold text-[9px] uppercase tracking-[0.2em] pb-3 pl-2 text-black">Item</th>
                                <th className="text-center font-bold text-[9px] uppercase tracking-[0.2em] pb-3 text-black">Size</th>
                                <th className="text-center font-bold text-[9px] uppercase tracking-[0.2em] pb-3 text-black">Qty</th>
                                <th className="text-right font-bold text-[9px] uppercase tracking-[0.2em] pb-3 text-black">Price</th>
                                <th className="text-right font-bold text-[9px] uppercase tracking-[0.2em] pb-3 pr-2 text-black">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoice.items.map((item, i) => (
                                <tr key={i}>
                                    <td className="py-5 pl-2">
                                        <p className="text-sm font-medium text-black">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {`YU-${2024 + i}-X`}</p>
                                    </td>
                                    <td className="py-5 text-center text-xs font-mono text-gray-500">{item.size || '-'}</td>
                                    <td className="py-5 text-center text-xs font-mono text-gray-500">{item.qty}</td>
                                    <td className="py-5 text-right text-xs font-mono text-gray-500">₹{item.price.toLocaleString()}</td>
                                    <td className="py-5 text-right text-sm font-mono font-medium pr-2 text-black">₹{(item.price * item.qty).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. TOTALS & SIGNATURE */}
                <div className="flex justify-end mt-12 mb-20">
                    <div className="w-1/2 max-w-sm">
                        <div className="space-y-3 pb-6 border-b border-black/10">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-mono text-black">₹{invoice.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Shipping</span>
                                <span className="font-mono text-black">₹{invoice.shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Taxes (Allocated)</span>
                                <span className="font-mono text-black">₹0.00</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline pt-4">
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-black">Total</span>
                            <span className="text-3xl font-mono font-medium tracking-tight text-black">₹{invoice.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* 5. FOOTER / TERMS */}
                <footer className="absolute bottom-0 left-0 right-0 p-[15mm] border-t border-black/5 flex justify-between items-end">
                    <div className="max-w-xs space-y-4">
                        <div className="h-px w-40 bg-black mb-4"></div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Authorized Signatory</p>
                        <p className="text-[9px] text-gray-300 leading-relaxed mt-2">
                            This is a computer generated invoice and no signature is required.
                            <br />Terms & Conditions apply.
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="font-serif italic text-lg text-gray-300">Essential Luxury.</p>
                        <p className="text-[9px] text-gray-200 uppercase tracking-widest mt-1">yura.co.in</p>
                    </div>
                </footer>
            </div>

            {/* Self-contained Print Styles */}
            <style jsx global>{`
                @media print {
                    /* Hide Everything Else */
                    body * {
                        visibility: hidden;
                    }

                    /* Make Invoice Visible */
                    #invoice-template, #invoice-template * {
                        visibility: visible;
                    }

                    /* Reset Body Background */
                    body {
                        background: white;
                    }

                    /* Position Invoice Fixed on Top */
                    #invoice-template {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 15mm !important;
                        z-index: 99999; /* Ensure on top */
                        background-color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    /* Reset Page Margins */
                    @page {
                        margin: 0;
                        size: A4;
                    }
                }
            `}</style>
        </>
    );
}
