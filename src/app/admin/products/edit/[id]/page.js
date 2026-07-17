"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

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

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const customColorInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (id) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      const p = res.data;
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: p.price ?? "",
        originalPrice: p.originalPrice ?? "",
        category: p.category || "Concrete",
        stock: p.stock ?? "",
        colors: p.colors?.length ? p.colors : [],
        imageUrls: p.images || [],
      });
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Could not load product.");
    } finally {
      setLoading(false);
    }
  };

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

    if (form.imageUrls.length === 0) {
      setError("Please keep at least one photo for this product.");
      return;
    }

    if (
      form.originalPrice &&
      Number(form.originalPrice) <= Number(form.price)
    ) {
      setError(
        "Original Price must be higher than the current Price for a discount to show."
      );
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/products/${id}`,
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          originalPrice: form.originalPrice
            ? Number(form.originalPrice)
            : null,
          category: form.category,
          stock: Number(form.stock),
          colors: form.colors,
          images: form.imageUrls,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Failed to update product. Please check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <aside className="w-64 bg-white border-r border-[#E5D5C3] p-6 hidden md:block">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
          Mitti Admin
        </h2>
        <nav className="space-y-2 mt-8">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded-lg bg-[#F0CBA3] text-[#6B4530] font-medium">
            Products
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Orders
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Edit Product
        </h1>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading product...</p>
        ) : (
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

            <div className="grid grid-cols-2 gap-4">
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
              Fill Original Price only if this item is on sale — it must be
              higher than the Price above. Leave blank to remove any
              discount.
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
                Click to select every color this product comes in. Leave
                blank if it doesn&apos;t come in different colors.
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
                            [
                              "White",
                              "Cream",
                              "Ivory",
                              "Beige",
                              "Yellow",
                            ].includes(swatch.name)
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
                    const preset = COLOR_SWATCHES.find(
                      (s) => s.name === color,
                    );
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
              <p className="text-xs text-[#8B6F5C] mb-2">
                Add more photos below, or remove existing ones. At least one
                photo must remain.
              </p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleImageUpload}
                multiple
                className="w-full text-[#6B4530] text-sm"
              />
              {uploading && (
                <p className="text-sm text-[#8B6F5C] mt-2">Uploading...</p>
              )}
              {form.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
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
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/admin/products"
                className="px-8 py-3 rounded-full font-medium border border-[#E5D5C3] text-[#6B4530] hover:bg-white transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
