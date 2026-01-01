/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabse/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { resetPasswordAction } from "@/app/actions/auth-actions";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    // const supabase = createClient(); // Not needed for this action anymore

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setSuccess(false);

        // Use window.location.origin to ensure it works on both localhost and production
        // Direct redirect to the update page, letting the client SDK handle the code exchange
        const redirectTo = `${window.location.origin}/admin/update-password`;

        const result = await resetPasswordAction(email, redirectTo);

        if (!result.success) {
            setMessage(result.error || "An error occurred.");
            setSuccess(false);
        } else {
            setMessage("Check your email for the password reset link.");
            setSuccess(true);
        }
        setLoading(false);
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-serif tracking-tight font-bold">YURA.</h1>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/70">Security</p>
                    <blockquote className="text-3xl font-serif italic leading-tight text-white">
                        "Secure access to your empire."
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="mb-10 text-center lg:text-left">
                        <Link href="/admin/login" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-6 inline-block transition-colors">
                            ← Back to Login
                        </Link>
                        <h2 className="text-3xl font-serif text-black mb-3">Forgot Password?</h2>
                        <p className="text-sm text-gray-500 font-light leading-relaxed">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleReset}>
                        {message && (
                            <div className={`p-4 border text-sm flex items-start gap-3 rounded-md animate-in fade-in zoom-in-95 duration-300 ${success ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                {success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
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
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all shadow-lg shadow-black/5 hover:shadow-black/10"
                            >
                                {loading ? "Sending Link..." : "Send Reset Link"}
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
