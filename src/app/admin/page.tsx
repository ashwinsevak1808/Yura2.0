"use client";

import { useEffect, useState } from "react";
import { AdminService } from "@/services/admin.service";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        averageOrderValue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const dashboardStats = await AdminService.getDashboardStats();
                setStats(dashboardStats);

                const orders = await AdminService.getRecentOrders();
                setRecentOrders(orders || []);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const statCards = [
        { name: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+12.5%", trend: "up" },
        { name: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, change: "+4.3%", trend: "up" },
        { name: "Total Products", value: stats.totalProducts, icon: Package, change: "0%", trend: "neutral" },
        { name: "Avg. Order Value", value: `₹${Math.round(stats.averageOrderValue).toLocaleString()}`, icon: TrendingUp, change: "-2.1%", trend: "down" },
    ];

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-serif font-medium text-black tracking-tight">Dashboard Overview</h1>
                <p className="mt-2 text-sm text-gray-500">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="bg-white p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon className="w-16 h-16 text-black" />
                            </div>
                            <div className="relative">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
                                <p className="mt-4 text-3xl font-serif font-medium text-gray-900">{item.value}</p>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-xs font-medium ${item.trend === 'up' ? 'text-green-600' :
                                        item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                        }`}>
                                        {item.change}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-400">from last month</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-100 shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-serif font-medium text-gray-900">Recent Orders</h3>
                    <a href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-black hover:text-gray-600 border-b border-black hover:border-gray-600 pb-0.5 transition-all">
                        View All
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Order ID
                                </th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Customer
                                </th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Date
                                </th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Total
                                </th>
                                <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-black font-mono">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900 font-serif">
                                        ₹{order.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest border 
                                            ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    order.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
