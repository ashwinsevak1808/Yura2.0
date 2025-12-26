"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartService } from '@/services/cart.service';
import { CartItem } from '@/types';
import { Product } from '@/types/product';

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number, size: string, color: string) => void;
    removeFromCart: (productId: string, size: string, color: string) => void;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    const refreshCart = () => {
        setCartItems(CartService.getCart());
    };

    useEffect(() => {
        setMounted(true);
        refreshCart();

        // Subscribe to CartService events
        const unsubscribe = CartService.subscribe(() => {
            refreshCart();
        });

        return () => unsubscribe();
    }, []);

    const addToCart = (product: Product, quantity: number, size: string, color: string) => {
        CartService.addToCart(product, quantity, size, color);
    };

    const removeFromCart = (productId: string, size: string, color: string) => {
        CartService.removeFromCart(productId, size, color);
    };

    const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
        CartService.updateQuantity(productId, size, color, quantity);
    };

    const clearCart = () => {
        CartService.clearCart();
    };

    const cartCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
