"use client";

import { X, Check } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    info: (message: string) => addToast(message, "info"),
};

function addToast(message: string, type: ToastType) {
    const id = Math.random().toString(36).substring(7);
    toasts = [...toasts, { id, message, type }];
    listeners.forEach((listener) => listener(toasts));

    setTimeout(() => {
        removeToast(id);
    }, 3000);
}

function removeToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
}

export function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

    useEffect(() => {
        listeners.push(setCurrentToasts);
        return () => {
            listeners = listeners.filter((l) => l !== setCurrentToasts);
        };
    }, []);

    return (
        <div className="fixed top-24 right-4 z-50 space-y-2 max-w-sm">
            {currentToasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-6 py-4 animate-slide-in ${toast.type === "success"
                            ? "bg-black text-white"
                            : toast.type === "error"
                                ? "bg-red-600 text-white"
                                : "bg-gray-900 text-white"
                        }`}
                >
                    {toast.type === "success" && (
                        <Check className="w-4 h-4 flex-shrink-0" />
                    )}

                    <p className="flex-1 text-sm font-light">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
