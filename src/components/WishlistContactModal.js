"use client";

import { useState } from "react";

/**
 * Reusable popup that collects a customer's name + phone when they add
 * a product to their wishlist. Used by both ShopClient.js and
 * ProductDetailClient.js.
 *
 * This component is presentation-only: it does NOT call the API itself.
 * The backend saves name/phone as part of the same PUT /:id/wishlist
 * call that increments the count, so the parent owns that request.
 *
 * Props:
 *  - product: { _id, name } — the product being wishlisted
 *  - onSubmit: (name, phone) => Promise — called with trimmed values;
 *      should reject if the save fails so the modal can show an error
 *  - onSkip: () => void — called when the user skips leaving details
 *      (the wishlist add still happens, just without contact info)
 */
export default function WishlistContactModal({ product, onSubmit, onSkip }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please share your name and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(name.trim(), phone.trim());
    } catch (err) {
      console.error("Error saving wishlist contact:", err);
      setError("Could not save your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      onClick={onSkip}
    >
      <div
        className="bg-[#FBF3E9] rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onSkip}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#8B6F5C] hover:bg-white transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#6B4530] mb-1 pr-6">
          Added to wishlist
        </h3>
        <p className="text-sm text-[#8B6F5C] mb-5">
          Leave your name and phone number and we&apos;ll reach out when{" "}
          <span className="font-medium text-[#6B4530]">{product.name}</span>{" "}
          is back or on offer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white text-sm focus:outline-none focus:border-[#C1653A]"
            autoFocus
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white text-sm focus:outline-none focus:border-[#C1653A]"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#6B4530] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#8B6F5C] transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onSkip}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full font-medium text-sm border border-[#E5D5C3] text-[#6B4530] hover:bg-white transition disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

