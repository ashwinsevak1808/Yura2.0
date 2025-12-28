
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabse/client";
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                if (pathname !== "/admin/login") {
                    router.push("/admin/login");
                }
            } else if (user.email !== "ashwinsevak2091@gmail.com") {
                await supabase.auth.signOut();
                router.push("/admin/login");
            }

            setLoading(false);
        }

        checkAuth();
    }, [router, pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Products", href: "/admin/products", icon: ShoppingBag },
        { name: "Orders", href: "/admin/orders", icon: Package },
        { name: "Testimonials", href: "/admin/testimonials", icon: Users }, // Using Users icon as a placeholder since Star isn't imported yet
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar - Premium Dark Theme */}
            <aside className="w-72 bg-[#0a0a0a] text-white flex flex-col flex-shrink-0 z-40 relative shadow-2xl">
                {/* Logo Area */}
                <div className="h-24 flex items-center justify-center border-b border-white/10">
                    <span className="text-4xl font-serif font-medium tracking-tighter text-white cursor-default">YURA.</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-1.5 scrollbar-none">
                    <div className="px-3 mb-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Platform</p>
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-4 py-3.5 text-sm font-medium transition-all duration-200 rounded-xl ease-out
                                    ${isActive
                                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] translate-x-1"
                                        : "text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                                    }`}
                            >
                                <item.icon
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive ? "text-black" : "text-gray-500 group-hover:text-white"}`}
                                />
                                <span className={isActive ? "tracking-wide font-semibold" : "tracking-normal"}>{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black/30" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile - Dark Card */}
                <div className="p-6 mt-auto border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm font-serif font-bold text-black group-hover:scale-105 transition-transform">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Admin</p>
                            <p className="text-[10px] text-gray-400 truncate">admin@yura.co</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSignOut();
                            }}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-white/5"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50/50 scroll-smooth">
                <div className="mx-auto p-8 lg:p-12 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
