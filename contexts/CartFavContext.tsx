"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/components/ProductCard";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartFavContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isInCart: (productId: number) => boolean;

  // Favorites
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;

  // UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartFavContext = createContext<CartFavContextType | null>(null);

export function CartFavProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("sv_cart");
      const savedFavs = localStorage.getItem("sv_favorites");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {}
    setHydrated(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("sv_cart", JSON.stringify(cart)); } catch {}
  }, [cart, hydrated]);

  // Persist favorites
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("sv_favorites", JSON.stringify(favorites)); } catch {}
  }, [favorites, hydrated]);

  // Cart actions
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const isInCart = (productId: number) => cart.some((i) => i.product.id === productId);

  // Favorites actions
  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isFavorite = (productId: number) => favorites.includes(productId);

  return (
    <CartFavContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, isInCart,
      favorites, toggleFavorite, isFavorite,
      cartOpen, setCartOpen,
    }}>
      {children}
    </CartFavContext.Provider>
  );
}

export function useCartFav() {
  const ctx = useContext(CartFavContext);
  if (!ctx) throw new Error("useCartFav must be used within CartFavProvider");
  return ctx;
}