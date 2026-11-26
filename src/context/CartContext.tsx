import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types/database';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (variant_id: string, delta: number) => void;
  removeFromCart: (variant_id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kalara_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.variant_id === newItem.variant_id);
      if (existing) {
        const nextQty = Math.min(existing.quantity + newItem.quantity, newItem.max_stock);
        return prev.map(item =>
          item.variant_id === newItem.variant_id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const updateQuantity = (variant_id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.variant_id === variant_id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(nextQty, item.max_stock) };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (variant_id: string) => {
    setCart(prev => prev.filter(item => item.variant_id !== variant_id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
