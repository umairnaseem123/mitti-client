"use client";

import { useState } from "react";

/**
 * Reusable popup that collects a customer's name + phone.
 * Used by both ShopClient.js and ProductDetailClient.js, which call it
 * two different ways — this component supports both:
 *
 *  1) ShopClient.js style — conditionally mounted, no `open` prop:
 *     <WishlistContactModal product={product} onSubmit={...} onSkip={...} />
 *
 *  2) ProductDetailClient.js style — always mounted, visibility via `open`,
 *     with optional custom copy (used for both "wishlist" and
 *     "notify me when back in stock" flows):
 *     <WishlistContactModal
 *       open={wishlistModalOpen}
 *       onClose={...}
 *       onSubmit={...}
 *       title="Notify me when available"
 *       description="..."
 *       submitLabel="Notify Me"
 *     />
 *
 * This component is presentation-only: it does NOT call the API itself.
 * The parent owns the actual save request via onSubmit.
 *
 * Props:
 *  - product?: { _id, name } — optional; when provided (and no custom
 *      `description` is given), the default copy mentions the product by name
 *  - open?: boolean — defaults to true, so callers that conditionally
 *      mount the component (instead of passing `open`) still work
 *  - onSubmit: (name, phone) => Promise — called with trimmed values;
 *      should reject if the save fails so the modal can show an error
 *  - onSkip / onClose: () => void — either works; called when the user
 *      closes the modal without necessarily finishing the form
 *  - title?: string — overrides the default "Added to wishlist" heading
 *  - description?: string | ReactNode — overrides the default body copy
 *  - submitLabel?: string — overrides the default "Save" button text
 */
export default function WishlistContactModal({
  product,
  open = true,
  onSubmit,
  onSkip,
  onClose,
  title,
  description,
  submitLabel = "Save",
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleClose = onSkip || onClose || (() => {});

  const modalTitle = title || "Added to wishlist";
  const modalDescription =
    description ??
    (product ? (
      <>
        Leave your name and phone number and we&apos;ll reach out when{" "}
        <span className="font-medium text-[#6B4530]">{product.name}</span>{" "}
        is back or on offer.
      </>
    ) : (
      "Leave your name and phone number and we'll reach out with updates."
    ));

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
      onClick={handleClose}
    >
      <div
        className="bg-[#FBF3E9] rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#8B6F5C] hover:bg-white transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#6B4530] mb-1 pr-6">
          {modalTitle}
        </h3>
        <p className="text-sm text-[#8B6F5C] mb-5">{modalDescription}</p>

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
              {submitting ? "Saving..." : submitLabel}
            </button>
            <button
              type="button"
              onClick={handleClose}
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
