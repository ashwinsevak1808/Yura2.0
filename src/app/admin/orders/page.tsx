"use client";

import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { ChevronDown, Search, Filter } from "lucide-react";

import { useRouter } from "next/navigation";

import { Pagination } from "@/components/ui/pagination";

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadOrders();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchQuery]);

    async function loadOrders() {
        try {
            const data = await AdminService.getAllOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "All" || order.status === filterStatus.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Calculate Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Orders</h1>
                <p className="mt-2 text-sm text-gray-500">Track and manage customer orders.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-gray-100 shadow-sm">
                <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-50 text-sm placeholder-gray-400 focus:ring-0"
                        placeholder="Search by order ID or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 text-sm font-medium focus:ring-0 cursor-pointer rounded-none transition-all w-full sm:w-48 shadow-sm"
                        >
                            {["All", "Paid", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-black transition-colors" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Order ID
                            </th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Customer
                            </th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Date
                            </th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Total
                            </th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                Status
                            </th>
                            <th scope="col" className="relative px-8 py-5">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {paginatedOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-black font-mono">
                                    #{order.id.slice(0, 8)}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{order.customer_email}</div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900 font-serif">
                                    ₹{order.total_amount.toLocaleString()}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm
                                        ${order.status === 'paid' ? 'bg-green-50 text-green-700' :
                                                order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                                                        order.status === 'processing' ? 'bg-yellow-50 text-yellow-700' :
                                                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                                        className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
