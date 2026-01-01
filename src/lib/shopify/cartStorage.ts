const CART_STORAGE_KEY = "lsr_shopify_cart_id_v1";

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_STORAGE_KEY);
}

export function setStoredCartId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, id);
}

export function clearStoredCartId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}
