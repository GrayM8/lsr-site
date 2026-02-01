import { Money } from "./types";

const STORAGE_KEY = "lsr_wishlist";

export interface WishlistItem {
  handle: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  price: Money;
  addedAt: number;
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToWishlist(item: Omit<WishlistItem, "addedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const items = getWishlist();
    // Check if already exists
    if (items.some((i) => i.handle === item.handle)) return;
    // Add new item
    const updated = [{ ...item, addedAt: Date.now() }, ...items];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch event for components to listen
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function removeFromWishlist(handle: string): void {
  if (typeof window === "undefined") return;
  try {
    const items = getWishlist();
    const updated = items.filter((i) => i.handle !== handle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch event for components to listen
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function isInWishlist(handle: string): boolean {
  const items = getWishlist();
  return items.some((i) => i.handle === handle);
}

export function toggleWishlist(item: Omit<WishlistItem, "addedAt">): boolean {
  if (isInWishlist(item.handle)) {
    removeFromWishlist(item.handle);
    return false;
  } else {
    addToWishlist(item);
    return true;
  }
}
