
"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/data';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const getPriceForQuantity = useCallback((product: Product, quantity: number): number => {
    if (!product.wholesalePricing || product.wholesalePricing.length === 0) {
      return product.price;
    }

    const sortedTiers = [...product.wholesalePricing].sort((a, b) => b.minQuantity - a.minQuantity);

    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity) {
        return tier.price;
      }
    }

    return product.price;
  }, []);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const pricePerUnit = getPriceForQuantity(item.product, item.quantity);
      return acc + pricePerUnit * item.quantity;
    }, 0);
  }, [cart, getPriceForQuantity]);


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

    