import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { DbProduct } from "@/hooks/useProducts";

export interface CartItem {
  product: DbProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: DbProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from DB when user logs in
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    const loadCart = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("cart_items")
        .select("quantity, product_id, products(*)")
        .eq("user_id", user.id);
      if (data) {
        setItems(
          data
            .filter((ci) => ci.products)
            .map((ci) => ({
              product: ci.products as unknown as DbProduct,
              quantity: ci.quantity,
            }))
        );
      }
      setLoading(false);
    };
    loadCart();
  }, [user]);

  const syncToDb = useCallback(
    async (productId: string, quantity: number) => {
      if (!user) return;
      if (quantity <= 0) {
        await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
      } else {
        await supabase.from("cart_items").upsert(
          { user_id: user.id, product_id: productId, quantity },
          { onConflict: "user_id,product_id" }
        );
      }
    },
    [user]
  );

  const addToCart = useCallback(
    (product: DbProduct) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const newQty = existing ? existing.quantity + 1 : 1;
        syncToDb(product.id, newQty);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: newQty } : i
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
    },
    [syncToDb]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      syncToDb(productId, 0);
    },
    [syncToDb]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
      );
      syncToDb(productId, quantity);
    },
    [syncToDb, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
  }, [user]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
