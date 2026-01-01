"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabse/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            setLoading(false);
        } else {
            // Check if user is admin
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: roleData } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                // Fallback: Check email directly if role table is not yet populated/synced
                if (roleData?.role === 'admin' || user.email === 'ashwinsevak2091@gmail.com') {
                    router.push("/admin");
                } else {
                    await supabase.auth.signOut();
                    setMessage("Access denied. Admin privileges required.");
                }
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans text-black overflow-hidden selection:bg-black selection:text-white">
            {/* Left Side - Visual / Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#050505] relative flex-col justify-between p-16 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                    <img
                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2274&auto=format&fit=crop"
                        alt="Fashion Texture"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-serif tracking-tight font-bold">YURA.</h1>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/70">The Admin Suite</p>
                    <blockquote className="text-3xl font-serif italic leading-tight text-white">
                        "Curating the future of fashion, one collection at a time."
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-serif text-black mb-3">Hello, Admin</h2>
                        <p className="text-sm text-gray-500 font-light leading-relaxed">
                            Log in to manage your inventory, orders, and customer insights.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleLogin}>
                        {message && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 rounded-md animate-in fade-in zoom-in-95 duration-300">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span className="pt-0.5">{message}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-[11px] uppercase font-bold tracking-[0.1em] text-gray-900"
                                >
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@yura.co"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg px-4 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label
                                        htmlFor="password"
                                        className="block text-[11px] uppercase font-bold tracking-[0.1em] text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <Link href="/admin/forgot-password" className="text-[10px] uppercase font-bold tracking-[0.05em] text-gray-400 hover:text-black transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all shadow-lg shadow-black/5 hover:shadow-black/10"
                            >
                                {loading ? "Authenticating..." : "Access Dashboard"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-wider">
                        <span>Secure Connection</span>
                        <span>YURA Platform 1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
