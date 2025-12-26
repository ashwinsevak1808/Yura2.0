"use client";

import { CartProvider } from "@/context/cart-context";
import { DialogProvider } from "@/context/dialog-context";
import { ToastContainer } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <DialogProvider>
                {children}
                <ToastContainer />
            </DialogProvider>
        </CartProvider>
    );
}
