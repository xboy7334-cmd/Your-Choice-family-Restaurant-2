import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartLine, Product } from '../types';

type CartState = {
  lines: CartLine[];
  add: (product: Product) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(persist((set, get) => ({
  lines: [],
  add: (product) => set((state) => {
    const found = state.lines.find((line) => line.product.id === product.id);
    return { lines: found ? state.lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...state.lines, { product, quantity: 1 }] };
  }),
  setQuantity: (id, quantity) => set((state) => ({ lines: quantity <= 0 ? state.lines.filter((line) => line.product.id !== id) : state.lines.map((line) => line.product.id === id ? { ...line, quantity } : line) })),
  remove: (id) => set((state) => ({ lines: state.lines.filter((line) => line.product.id !== id) })),
  clear: () => set({ lines: [] }),
  count: () => get().lines.reduce((sum, line) => sum + line.quantity, 0),
  subtotal: () => get().lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
}), { name: 'your-choice-cart-v1', storage: createJSONStorage(() => localStorage) }));
