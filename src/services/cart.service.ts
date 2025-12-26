import { CartItem } from "@/types";
import { Product } from '@/types/product';

const CART_STORAGE_KEY = 'yura_cart_storage';
const CART_EVENT_KEY = 'yura_cart_updated';

export const CartService = {
    getCart: (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    addToCart: (product: Product, quantity: number, size: string, color: string) => {
        const cart = CartService.getCart();
        const existingItemIndex = cart.findIndex(
            (item) =>
                item.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity,
                selectedSize: size,
                selectedColor: color,
            });
        }

        CartService.saveCart(cart);
    },

    removeFromCart: (productId: string, size: string, color: string) => {
        const cart = CartService.getCart();
        const newCart = cart.filter(
            (item) =>
                !(
                    item.id === productId &&
                    item.selectedSize === size &&
                    item.selectedColor === color
                )
        );
        CartService.saveCart(newCart);
    },

    updateQuantity: (
        productId: string,
        size: string,
        color: string,
        quantity: number
    ) => {
        const cart = CartService.getCart();
        const itemIndex = cart.findIndex(
            (item) =>
                item.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color
        );

        if (itemIndex > -1) {
            if (quantity <= 0) {
                CartService.removeFromCart(productId, size, color);
            } else {
                cart[itemIndex].quantity = quantity;
                CartService.saveCart(cart);
            }
        }
    },

    clearCart: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(CART_STORAGE_KEY);
        window.dispatchEvent(new Event(CART_EVENT_KEY));
    },

    getCartTotal: (): number => {
        const cart = CartService.getCart();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    getCartCount: (): number => {
        const cart = CartService.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    saveCart: (cart: CartItem[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new Event(CART_EVENT_KEY));
    },

    subscribe: (callback: () => void) => {
        if (typeof window === 'undefined') return () => { };
        window.addEventListener(CART_EVENT_KEY, callback);
        return () => window.removeEventListener(CART_EVENT_KEY, callback);
    }
};
