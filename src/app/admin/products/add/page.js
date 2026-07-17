"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "Concrete",
  stock: "",
  colors: [],
  imageUrls: [],
};

// Preset color swatches — earthy palette that fits concrete/candle products,
// plus standard colors, similar to a Word-style color grid.
const COLOR_SWATCHES = [
  { name: "Terracotta", hex: "#C16E4F" },
  { name: "Rust", hex: "#A0522D" },
  { name: "Sand", hex: "#D9B48A" },
  { name: "Beige", hex: "#E8DCC8" },
  { name: "Cream", hex: "#F5EEDD" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Olive", hex: "#708238" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Grey", hex: "#9E9E9E" },
  { name: "Brown", hex: "#795548" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Red", hex: "#E53935" },
  { name: "Orange", hex: "#FB8C00" },
  { name: "Amber", hex: "#FFB300" },
  { name: "Yellow", hex: "#FDD835" },
  { name: "Green", hex: "#43A047" },
  { name: "Teal", hex: "#00897B" },
  { name: "Blue", hex: "#1E88E5" },
  { name: "Navy", hex: "#1A237E" },
  { name: "Purple", hex: "#8E24AA" },
  { name: "Pink", hex: "#EC407A" },
];

export default function AddProductPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);
  const customColorInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleColor = (colorName) => {
    setForm((prev) => {
      const alreadySelected = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: alreadySelected
          ? prev.colors.filter((c) => c !== colorName)
          : [...prev.colors, colorName],
      };
    });
  };

  const handleCustomColorPick = (e) => {
    const hex = e.target.value;
    if (!hex) return;
    setForm((prev) =>
      prev.colors.includes(hex)
        ? prev
        : { ...prev, colors: [...prev.colors, hex] },
    );
  };

  const handleRemoveColor = (colorName) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== colorName),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("mitti_admin_token");
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await api.post("/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedUrls.push(res.data.imageUrl);
      }

      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));
    } catch (err) {
      console.error(err);
      setError("One or more images failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.imageUrls.length === 0) {
      setError("Please upload at least one photo before adding the product.");
      return;
    }

    if (
      form.originalPrice &&
      Number(form.originalPrice) <= Number(form.price)
    ) {
      setError(
        "Original Price must be higher than the current Price for a discount to show.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.post(
        "/api/products",
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          category: form.category,
          stock: Number(form.stock),
          colors: form.colors,
          images: form.imageUrls,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess(
        `"${form.name}" added successfully! Add the next product below.`,
      );
      setForm(emptyForm);
      setFileInputKey((k) => k + 1);

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to add product. Please check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/products" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 max-w-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530]">
            Add New Product
          </h1>
          <Link
            href="/admin/products"
            className="text-sm text-[#6B4530] underline hover:text-[#8B6F5C] transition"
          >
            Done adding? View all products →
          </Link>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price (Rs.)"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price (optional)"
              value={form.originalPrice}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />
          </div>
          <p className="text-xs text-[#8B6F5C] -mt-2">
            Fill Original Price only if this item is on sale — it must be higher
            than the Price above. It will show struck-through with a % OFF
            badge.
          </p>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
          >
            <option value="Concrete">Concrete</option>
            <option value="Candles">Candles</option>
          </select>
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
          />

          <div className="border border-[#E5D5C3] rounded-lg p-4 bg-white">
            <label className="block text-sm text-[#8B6F5C] mb-1">
              Colors (optional)
            </label>
            <p className="text-xs text-[#8B6F5C] mb-3">
              Click to select every color this product comes in. Leave blank
              if it doesn&apos;t come in different colors.
            </p>

            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((swatch) => {
                const selected = form.colors.includes(swatch.name);
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => toggleColor(swatch.name)}
                    title={swatch.name}
                    aria-pressed={selected}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selected
                        ? "border-[#6B4530] scale-110 shadow"
                        : "border-[#E5D5C3] hover:scale-105"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={
                          ["White", "Cream", "Ivory", "Beige", "Yellow"].includes(
                            swatch.name,
                          )
                            ? "#6B4530"
                            : "#FFFFFF"
                        }
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mx-auto"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                );
              })}

              {/* Custom color swatch — opens the native color picker */}
              <button
                type="button"
                onClick={() => customColorInputRef.current?.click()}
                title="Pick a custom color"
                className="w-8 h-8 rounded-full border-2 border-dashed border-[#8B6F5C] flex items-center justify-center hover:scale-105 transition bg-[conic-gradient(from_0deg,red,yellow,lime,cyan,blue,magenta,red)]"
              >
                <span className="w-3 h-3 rounded-full bg-white/80 flex items-center justify-center text-[#6B4530] text-xs leading-none font-bold">
                  +
                </span>
              </button>
              <input
                ref={customColorInputRef}
                type="color"
                onChange={handleCustomColorPick}
                className="hidden"
              />
            </div>

            {form.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E5D5C3]">
                {form.colors.map((color) => {
                  const preset = COLOR_SWATCHES.find((s) => s.name === color);
                  const hex = preset ? preset.hex : color;
                  const label = preset ? preset.name : color;
                  return (
                    <span
                      key={color}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-[#E5D5C3] text-sm text-[#6B4530]"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-[#E5D5C3]"
                        style={{ backgroundColor: hex }}
                      />
                      {label}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        aria-label={`Remove ${label}`}
                        className="text-[#8B6F5C] hover:text-red-600 transition"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border border-[#E5D5C3] rounded-lg p-4 bg-white">
            <label className="block text-sm text-[#8B6F5C] mb-1">
              Product Photos
            </label>
            <p className="text-xs text-[#8B6F5C] mb-3">
              If this item comes in different designs or colors, select all of
              them at once — customers will be able to flip between them on the
              product page.
            </p>

            {/* Hidden native file input, triggered by the styled button below */}
            <input
              key={fileInputKey}
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleImageUpload}
              multiple
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#D9B48A] rounded-lg py-6 text-[#6B4530] font-medium hover:bg-[#FBF3E9] hover:border-[#6B4530] transition disabled:opacity-50"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path
                  d="M21 15l-5-5L5 21"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 3v6M14 6h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {uploading ? "Uploading..." : "+ Add Images"}
            </button>

            {form.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {form.imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-[#E5D5C3]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      aria-label="Remove this photo"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-[#E5D5C3] text-[#6B4530] text-xs flex items-center justify-center shadow hover:bg-red-50 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Product & Continue"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
