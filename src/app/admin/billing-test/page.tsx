"use client";

import { InvoiceTemplate } from "@/components/admin/InvoiceTemplate";
import { Printer } from "lucide-react";

export default function BillingTestPage() {
    // Dummy Data for Preview
    const invoice = {
        id: "INV-2024-001",
        date: new Date().toLocaleDateString('en-IN'),
        customer: {
            name: "Ashwin Sevak",
            email: "ashwin@example.com",
            address: "123 Lux Street, Mumbai, MH 400001"
        },
        items: [
            { name: "Silk Kurti - Midnight Blue", size: "M", price: 4999, qty: 1 },
            { name: "Cotton Pant - White", size: "M", price: 1299, qty: 2 }
        ],
        subtotal: 7597,
        shipping: 100,
        total: 7697
    };

    return (
        <div className="max-w-[210mm] mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 my-10">
            {/* Control Panel (No Print) */}
            <div className="flex justify-between items-center bg-zinc-900 text-white p-4 px-6 rounded-full shadow-2xl no-print mx-4 lg:mx-0">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Billing Sandbox Mode</span>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-all rounded-full"
                >
                    <Printer className="w-3 h-3 mr-2" /> Print Invoice
                </button>
            </div>

            {/* A4 Page Container */}
            <InvoiceTemplate invoice={invoice} />
        </div>
    );
}
