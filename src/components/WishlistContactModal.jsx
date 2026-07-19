"use client";

import { useState } from "react";

export default function WishlistContactModal({
  open,
  onClose,
  onSubmit,
  title = "Just one more step",
  description = "Share your name and number so we can reach out about this product — restocks, offers, or updates.",
  submitLabel = "Save",
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(name.trim(), phone.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#6B4530] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#8B6F5C] mb-5">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-[#E5D5C3] text-[#6B4530] text-sm font-medium hover:bg-[#FBF3E9] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#6B4530] text-white text-sm font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
