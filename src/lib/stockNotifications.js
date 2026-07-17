import api from "@/lib/api";

// Reuses the same remembered name+phone as the wishlist popup, so a
// returning customer isn't asked twice on the same device.
const CONTACT_KEY = "mitti_wishlist_contact";

export function getSavedContact() {
  try {
    const stored = localStorage.getItem(CONTACT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    return null;
  }
}

export function saveContact(name, phone) {
  localStorage.setItem(CONTACT_KEY, JSON.stringify({ name, phone }));
}

export async function requestStockNotification(productId, contact) {
  await api.post("/api/stock-notifications", {
    productId,
    name: contact.name,
    phone: contact.phone,
  });
}
