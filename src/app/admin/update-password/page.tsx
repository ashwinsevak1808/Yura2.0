/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabse/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Verify session on mount
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                // User is here to recover password, allow specific access
            } else if (event === "SIGNED_IN") {
                // User signed in (via code exchange), legitimate access
            } else if (!session) {
                // Give the client a moment to exchange code before redirecting
                // check if url has 'code'
                const params = new URLSearchParams(window.location.search);
                if (!params.get('code')) {
                    // router.push('/admin/login'); // allow for now to see if it fixes the loop
                }
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router, supabase]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setSuccess(false);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage(error.message);
            setSuccess(false);
        } else {
            setMessage("Password updated successfully. Redirecting...");
            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-serif tracking-tight font-bold">YURA.</h1>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <p className="text-sm font-medium tracking-[0.2em] uppercase text-white/70">Security</p>
                    <blockquote className="text-3xl font-serif italic leading-tight text-white">
                        "New credentials, same ambition."
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-serif text-black mb-3">Set New Password</h2>
                        <p className="text-sm text-gray-500 font-light leading-relaxed">
                            Please create a new secure password for your account.
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleUpdate}>
                        {message && (
                            <div className={`p-4 border text-sm flex items-start gap-3 rounded-md animate-in fade-in zoom-in-95 duration-300 ${success ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                {success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <span className="pt-0.5">{message}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-[11px] uppercase font-bold tracking-[0.1em] text-gray-900"
                                >
                                    New Password
                                </label>
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

                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-[11px] uppercase font-bold tracking-[0.1em] text-gray-900"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-12 bg-gray-50 border-gray-200 rounded-lg px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                                {loading ? "Updating..." : "Update Password"}
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
