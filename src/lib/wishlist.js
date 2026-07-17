import api from "@/lib/api";

const WISHLIST_KEY = "mitti_wishlist";
const CONTACT_KEY = "mitti_wishlist_contact";

export function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
}

export function isWishlisted(productId) {
  return getWishlist().some((item) => item.productId === productId);
}

// Returns { name, phone } if the customer has already given their details
// once before (so we don't ask again on this device), otherwise null.
export function getWishlistContact() {
  try {
    const stored = localStorage.getItem(CONTACT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    return null;
  }
}

export function saveWishlistContact(name, phone) {
  localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone }));
}

// Adds a product to the local wishlist, updates the product's wishlist
// count on the backend, and records the customer's name+phone against this
// product so the admin can follow up later.
export async function addToWishlist(product, images, contact) {
  const current = getWishlist();
  const updated = [
    ...current,
    {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: (images && images[0]) || product.images?.[0] || "",
    },
  ];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));

  try {
    await api.put(`/api/products/${product._id}/wishlist`, { action: "add" });
  } catch (err) {
    console.error("Error updating wishlist count:", err);
  }

  try {
    await api.post("/api/wishlist", {
      productId: product._id,
      name: contact.name,
      phone: contact.phone,
    });
  } catch (err) {
    console.error("Error saving wishlist contact entry:", err);
  }
}

export async function removeFromWishlist(productId) {
  const current = getWishlist();
  const updated = current.filter((item) => item.productId !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlistUpdated"));

  try {
    await api.put(`/api/products/${productId}/wishlist`, { action: "remove" });
  } catch (err) {
    console.error("Error updating wishlist count:", err);
  }
}
