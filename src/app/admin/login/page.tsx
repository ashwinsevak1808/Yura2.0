"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabse/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main_layout";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (email !== "ashwinsevak2091@gmail.com") {
            setMessage("Access denied. This area is restricted.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/admin`,
            },
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Check your email for the login link!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
            <div className="w-full max-w-md p-8 sm:p-12">
                {/* Brand Logo */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-serif font-medium tracking-tighter text-white mb-4">YURA.</h1>
                    <div className="h-px w-16 bg-white/20 mx-auto" />
                </div>

                {/* Login Card */}
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-medium tracking-wide">Admin Access</h2>
                        <p className="text-sm text-gray-400">Enter your credentials to manage the store.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                                Email Address
                            </label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-white focus:ring-1 focus:ring-white h-12 rounded-none px-4 font-mono text-sm"
                            />
                        </div>

                        {message && (
                            <div className={`p-4 text-sm text-center border ${message.includes("Check") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-[0.2em] rounded-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Send Magic Link"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-xs text-gray-600">
                            Protected by secure authentication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
