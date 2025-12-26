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
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
                            Admin Login
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Restricted access for store owners only.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <Input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {message && (
                            <div className={`text-sm text-center ${message.includes("Check") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={loading}
                        >
                            Send Magic Link
                        </Button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
