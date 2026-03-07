"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Cart } from "./types";
import {
  getStoredCartId,
  setStoredCartId,
  clearStoredCartId,
} from "./cartStorage";
import { toast } from "sonner";

interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  addToCart: (
    merchandiseId: string,
    quantity: number,
    productTitle?: string
  ) => Promise<boolean>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const cartCount = cart?.totalQuantity ?? 0;

  const fetchCart = useCallback(async () => {
    const cartId = getStoredCartId();
    if (!cartId) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/shopify/cart/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      });
      const data = await res.json();
      if (data.ok && data.cart) {
        setCart(data.cart);
      } else {
        clearStoredCartId();
        setCart(null);
      }
    } catch (e) {
      console.error("Failed to fetch cart:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (
      merchandiseId: string,
      quantity: number,
      productTitle?: string
    ): Promise<boolean> => {
      setIsUpdating(true);
      try {
        let cartId = getStoredCartId();

        if (!cartId) {
          const res = await fetch("/api/shopify/cart/create", {
            method: "POST",
          });
          const data = await res.json();
          if (data.ok && data.cart) {
            cartId = data.cart.id;
            setStoredCartId(cartId!);
          } else {
            toast.error("Failed to create cart", {
              description: "Please try again",
            });
            return false;
          }
        }

        const res = await fetch("/api/shopify/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartId,
            merchandiseId,
            quantity,
          }),
        });

        const data = await res.json();
        if (data.ok && data.cart) {
          setCart(data.cart);
          toast.success("Added to cart", {
            description: productTitle || "Item added successfully",
            action: {
              label: "View Cart",
              onClick: () => {
                window.location.href = "/shop/cart";
              },
            },
          });
          return true;
        } else {
          toast.error("Failed to add to cart", {
            description: "Please try again",
          });
          return false;
        }
      } catch (e) {
        console.error("Add to cart error:", e);
        toast.error("Failed to add to cart", {
          description: "Please try again",
        });
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      if (quantity < 1) return;

      setIsUpdating(true);
      try {
        const res = await fetch("/api/shopify/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cart.id, lineId, quantity }),
        });
        const data = await res.json();
        if (data.ok && data.cart) {
          setCart(data.cart);
        } else {
          toast.error("Failed to update quantity");
        }
      } catch (e) {
        console.error("Update quantity error:", e);
        toast.error("Failed to update quantity");
      } finally {
        setIsUpdating(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return;

      setIsUpdating(true);
      try {
        const res = await fetch("/api/shopify/cart/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cart.id, lineId }),
        });
        const data = await res.json();
        if (data.ok && data.cart) {
          setCart(data.cart);
          toast.success("Item removed from cart");
        } else {
          toast.error("Failed to remove item");
        }
      } catch (e) {
        console.error("Remove item error:", e);
        toast.error("Failed to remove item");
      } finally {
        setIsUpdating(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        isUpdating,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
