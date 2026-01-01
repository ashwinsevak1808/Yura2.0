"use client";

import { useEffect, useState } from "react";
import { getAccountingStatsAction } from "@/app/actions/admin-accounting";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PackageCheck,
    Clock,
    Ban,
    Wallet,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export default function AccountingPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Use Server Action for fresh data
                const data = await getAccountingStatsAction();
                setStats(data);
            } catch (error) {
                console.error("Failed to load accounting stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
            </div>
        );
    }

    if (!stats) return null;

    const netIncome = stats.totalRevenue - stats.lostRevenue;
    const profitMargin = stats.totalRevenue > 0 ? ((netIncome / stats.totalRevenue) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Financial Overview</h1>
                <p className="mt-2 text-sm text-gray-500">Real-time analysis of your revenue, losses, and order performance.</p>
            </div>

            {/* Key Metrics Grid - Matching Dashboard Style */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-16 h-16 text-black" />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
                        <p className="mt-4 text-3xl font-serif font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                Realized
                            </span>
                            <span className="ml-2 text-xs text-gray-400">from paid orders</span>
                        </div>
                    </div>
                </div>

                {/* Net Income */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-green-600" />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Income</p>
                        <p className="mt-4 text-3xl font-serif font-medium text-gray-900">{formatCurrency(netIncome)}</p>
                        <div className="mt-4 flex items-center">
                            <span className={`text-xs font-medium flex items-center gap-1 ${Number(profitMargin) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {profitMargin}% Margin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pending Revenue */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Wallet className="w-16 h-16 text-blue-600" />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Projected</p>
                        <p className="mt-4 text-3xl font-serif font-medium text-gray-900">{formatCurrency(stats.potentialRevenue)}</p>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                            </span>
                            <span className="ml-2 text-xs text-gray-400">{formatCurrency(stats.codPendingAmount)} via COD</span>
                        </div>
                    </div>
                </div>

                {/* Lost Revenue */}
                <div className="bg-white p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Ban className="w-16 h-16 text-red-600" />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-red-600/70">Losses</p>
                        <p className="mt-4 text-3xl font-serif font-medium text-red-600">{formatCurrency(stats.lostRevenue)}</p>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <ArrowDownRight className="w-3 h-3" />
                                Deducted
                            </span>
                            <span className="ml-2 text-xs text-gray-400">from {stats.ordersCancelled} cancellations</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Ledger / Balance Sheet */}
            <div className="bg-white border border-gray-100 shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-serif font-medium text-gray-900">Financial Statement</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">FY 2024-25 • Current Period</p>
                    </div>
                    <div className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                        INR (Rupees)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                    {/* Left Column: INCOME / ASSETS */}
                    <div className="p-8 space-y-8">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Credits (Income)
                        </h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-50 hover:bg-gray-50/50 px-2 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Product Sales (Realized)</p>
                                    <p className="text-xs text-gray-400">Payment collected via Razorpay/UPI</p>
                                </div>
                                <span className="font-serif font-medium text-green-700">+{formatCurrency(stats.totalRevenue)}</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-50 hover:bg-gray-50/50 px-2 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Pending Collections (Assets)</p>
                                    <p className="text-xs text-gray-400">COD & Pending Orders</p>
                                </div>
                                <span className="font-serif font-medium text-blue-600">+{formatCurrency(stats.potentialRevenue)}</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-50 hover:bg-gray-50/50 px-2 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Gross Sales Value</p>
                                    <p className="text-xs text-gray-400">Total potential volume</p>
                                </div>
                                <span className="font-serif font-medium text-gray-900">{formatCurrency(stats.totalRevenue + stats.potentialRevenue)}</span>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Credits</span>
                                <span className="text-xl font-serif font-bold text-gray-900">{formatCurrency(stats.totalRevenue + stats.potentialRevenue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: EXPENSES / LOSSES */}
                    <div className="p-8 space-y-8 bg-gray-50/30">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span> Debits (Losses & Deductions)
                        </h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-white px-2 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Cancelled Orders</p>
                                    <p className="text-xs text-gray-400">{stats.ordersCancelled} orders failed/cancelled</p>
                                </div>
                                <span className="font-serif font-medium text-red-600">-{formatCurrency(stats.lostRevenue)}</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-white px-2 transition-colors opacity-50">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Operational Expenses</p>
                                    <p className="text-xs text-gray-400">Shipping, Packaging (Est.)</p>
                                </div>
                                <span className="font-serif font-medium text-red-600">-₹0.00</span>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Debits</span>
                                <span className="text-xl font-serif font-bold text-red-600">-{formatCurrency(stats.lostRevenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Net Summary Footer */}
                <div className="bg-black text-white px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Net Realized Income</div>
                            <div className="text-sm text-gray-500">Total Revenue - Total Loss</div>
                        </div>
                        <div className="text-3xl font-serif font-medium tracking-tight">
                            {formatCurrency(netIncome)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
