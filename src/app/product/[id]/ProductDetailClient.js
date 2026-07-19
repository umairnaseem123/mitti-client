"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  isWishlisted as checkIsWishlisted,
  getWishlistContact,
  saveWishlistContact,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/wishlist";
import WishlistContactModal from "@/components/WishlistContactModal";
import {
  getSavedContact,
  saveContact,
  requestStockNotification,
} from "@/lib/stockNotifications";

const DESCRIPTION_LIMIT = 220;

// Matches the admin's preset color swatches (Add/Edit Product pages). Admin
// stores just the color NAME for presets (e.g. "Terracotta"), which isn't a
// valid CSS color keyword, so we map it back to its hex here. Custom colors
// picked via the admin's color wheel are already stored as hex and pass
// through unchanged.
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

function getColorHex(colorValue) {
  const preset = COLOR_SWATCHES.find((s) => s.name === colorValue);
  return preset ? preset.hex : colorValue;
}

function Stars({ rating, size = "text-base" }) {
  const safeRating = rating || 0;
  return (
    <span className={`${size} text-[#C1653A] tracking-tight`}>
      {"\u2605".repeat(safeRating)}
      <span className="text-[#E5D5C3]">{"\u2605".repeat(5 - safeRating)}</span>
    </span>
  );
}

export default function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/products/${id}`);
        if (!cancelled) {
          setProduct(res.data || null);
          setActiveImage(0);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        if (!cancelled) setError("Could not load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!product) return;
    setWishlisted(checkIsWishlisted(product._id));
    if (product.colors?.length) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  useEffect(() => {
    if (!product?.category) return;

    let cancelled = false;

    async function loadRelated() {
      try {
        const res = await api.get("/api/products", {
          params: { category: product.category },
        });
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const filtered = data
          .filter((p) => p && p._id !== product._id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    }

    loadRelated();

    return () => {
      cancelled = true;
    };
  }, [product?.category, product?._id]);

  useEffect(() => {
    if (!zoomOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeZoom();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOpen]);

  const images = product?.images?.length ? product.images : [];

  const goToPrev = () => {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
    setIsZoomed(false);
  };

  const goToNext = () => {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));
    setIsZoomed(false);
  };

  const openZoom = () => {
    if (images.length === 0) return;
    setZoomOpen(true);
    setIsZoomed(false);
  };

  const closeZoom = () => {
    setZoomOpen(false);
    setIsZoomed(false);
  };

  const handleZoomMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const stored = JSON.parse(localStorage.getItem("mitti_cart") || "[]");

    const existingIndex = stored.findIndex(
      (item) => item.productId === product._id && item.color === selectedColor,
    );

    if (existingIndex > -1) {
      stored[existingIndex].qty += qty;
    } else {
      stored.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: images[0] || "",
        qty: qty,
        color: selectedColor || undefined,
      });
    }

    localStorage.setItem("mitti_cart", JSON.stringify(stored));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) {
      setReviewError("Please fill in your name and a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/api/products/${id}/reviews`, {
        customerName: reviewForm.customerName.trim(),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });
      if (res.data) setProduct(res.data);
      setReviewForm({ customerName: "", rating: 5, comment: "" });
      setReviewSuccess("Thanks for your review!");
      setTimeout(() => setReviewSuccess(""), 4000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewError("Could not submit your review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Wishlist toggle: removing never needs contact details. Adding needs a
  // name+phone on file - if we already have one saved on this device we use
  // it silently, otherwise we show a quick popup to collect it once.
  const handleToggleWishlist = async () => {
    if (!product) return;

    if (wishlisted) {
      setWishlisted(false);
      await removeFromWishlist(product._id);
      return;
    }

    const savedContact = getWishlistContact();
    if (savedContact) {
      setWishlisted(true);
      await addToWishlist(product, images, savedContact);
    } else {
      setWishlistModalOpen(true);
    }
  };

  const handleWishlistContactSubmit = async (name, phone) => {
    if (!product) return;
    saveWishlistContact(name, phone);
    setWishlisted(true);
    await addToWishlist(product, images, { name, phone });
    setWishlistModalOpen(false);
  };

  // Notify Me (out of stock): reuse the same saved contact as wishlist if
  // we already have it on this device, otherwise show the popup once.
  const handleNotifyMe = async () => {
    if (!product) return;

    const savedContact = getSavedContact();
    if (savedContact) {
      await requestStockNotification(product._id, savedContact);
      setNotifyRequested(true);
    } else {
      setNotifyModalOpen(true);
    }
  };

  const handleNotifyContactSubmit = async (name, phone) => {
    if (!product) return;
    saveContact(name, phone);
    await requestStockNotification(product._id, { name, phone });
    setNotifyRequested(true);
    setNotifyModalOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy link:", err);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#FBF3E9] min-h-screen flex items-center justify-center">
        <p className="text-[#8B6F5C]">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="bg-[#FBF3E9] min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Product not found."}</p>
      </main>
    );
  }

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const faqs = Array.isArray(product.faqs) ? product.faqs : [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r?.rating || 0), 0) / reviews.length
    : 0;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;
  const isOutOfStock = !product.stock || product.stock <= 0;

  const description = product.description || "";
  const isLongDescription = description.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    isLongDescription && !descriptionExpanded
      ? description.slice(0, DESCRIPTION_LIMIT).trimEnd() + "\u2026"
      : description;

  const productName = product.name || "This product";
  const shareText = `Check out ${productName} on Mitti!`;
  const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative aspect-square bg-[#F0CBA3] rounded-2xl overflow-hidden flex items-center justify-center">
            {hasDiscount && (
              <span className="absolute top-3 left-3 z-10 bg-[#C1653A] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {discountPercent}% OFF
              </span>
            )}

            {isOutOfStock && (
              <span className="absolute top-3 right-3 z-10 bg-[#6B4530] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            )}

            {images.length > 0 ? (
              <img
                onClick={openZoom}
                src={images[activeImage]}
                alt={`${productName} \u2014 design ${activeImage + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            ) : (
              <span className="text-[#8B6F5C]">No image</span>
            )}

            {images.length > 0 && (
              <button
                type="button"
                onClick={openZoom}
                aria-label="Zoom in on photo"
                className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow-md transition z-10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path
                    d="M21 21l-4.3-4.3M11 8v6M8 11h6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  aria-label="Previous design"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow-md transition"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next design"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow-md transition"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(index);
                    setIsZoomed(false);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                    activeImage === index
                      ? "border-[#6B4530]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-3">
            {productName}
          </h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={Math.round(averageRating)} />
              <span className="text-sm text-[#8B6F5C]">
                {averageRating.toFixed(1)} ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-[#8B6F5C] mb-1 whitespace-pre-line">
            {displayedDescription}
          </p>
          {isLongDescription && (
            <button
              type="button"
              onClick={() => setDescriptionExpanded((v) => !v)}
              className="text-sm text-[#C1653A] font-medium hover:underline mb-5"
            >
              {descriptionExpanded ? "See Less" : "See More"}
            </button>
          )}
          <div className={isLongDescription ? "mb-1" : "mb-6"} />

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <p className="text-2xl font-semibold text-[#6B4530]">
              Rs. {product.price}
            </p>
            {hasDiscount && (
              <>
                <p className="text-lg text-[#8B6F5C] line-through">
                  Rs. {product.originalPrice}
                </p>
                <span className="bg-[#C1653A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {colorPickerOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setColorPickerOpen(false)}
            />
          )}

          <div className="mb-6 relative inline-block">
            <span className="text-[#6B4530] block mb-2">
              Color{selectedColor ? ` \u2014 ${selectedColor}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setColorPickerOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E5D5C3] bg-white hover:border-[#C1653A] transition"
            >
              <span
                className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                style={{
                  backgroundColor: selectedColor ? getColorHex(selectedColor) : "#ffffff",
                }}
              />
              <span className="text-sm text-[#6B4530]">
                {selectedColor || "Choose a color"}
              </span>
              <svg
                className="w-4 h-4 text-[#8B6F5C]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {colorPickerOpen && (
              <div className="absolute z-50 mt-2 p-4 bg-white border border-[#E5D5C3] rounded-xl shadow-lg grid grid-cols-6 gap-3 w-72">
                {COLOR_SWATCHES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                      setColorPickerOpen(false);
                    }}
                    aria-label={`Select color ${c.name}`}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center ${
                      selectedColor === c.name
                        ? "border-[#C1653A] ring-2 ring-offset-1 ring-[#C1653A]"
                        : "border-[#E5D5C3] hover:border-[#C1653A]"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.name && (
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        style={{
                          filter: "drop-shadow(0 0 1px rgba(0,0,0,0.6))",
                        }}
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#6B4530]">Quantity:</span>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full border border-[#E5D5C3] text-[#6B4530]"
            >
              -
            </button>
            <span className="text-[#6B4530] w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full border border-[#E5D5C3] text-[#6B4530]"
            >
              +
            </button>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium transition ${isOutOfStock ? "opacity-50 cursor-not-allowed" : "hover:bg-[#8B6F5C]"}`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : added
                  ? `Added ${"\u2713"}`
                  : "Add to Cart"}
            </button>

            {isOutOfStock && (
              <button
                type="button"
                onClick={handleNotifyMe}
                disabled={notifyRequested}
                className={`px-8 py-3 rounded-full font-medium border transition ${
                  notifyRequested
                    ? "border-green-300 text-green-700 bg-green-50 cursor-default"
                    : "border-[#6B4530] text-[#6B4530] hover:bg-[#6B4530] hover:text-white"
                }`}
              >
                {notifyRequested
                  ? `We'll notify you ${"\u2713"}`
                  : "Notify Me When Available"}
              </button>
            )}

            <Link
              href="/cart"
              className="px-8 py-3 rounded-full font-medium border border-[#E5D5C3] text-[#6B4530] hover:bg-white transition"
            >
              View Cart
            </Link>
            <button
              type="button"
              onClick={handleToggleWishlist}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="w-12 h-12 rounded-full border border-[#E5D5C3] flex items-center justify-center hover:bg-white transition flex-shrink-0"
            >
              <svg
                className={`w-5 h-5 ${wishlisted ? "text-[#C1653A]" : "text-[#6B4530]"}`}
                viewBox="0 0 24 24"
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#8B6F5C]">Share:</span>

            <a
              href={whatsappShareLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="w-9 h-9 rounded-full bg-white border border-[#E5D5C3] flex items-center justify-center text-[#6B4530] hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
              </svg>
            </a>

            <a
              href={facebookShareLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="w-9 h-9 rounded-full bg-white border border-[#E5D5C3] flex items-center justify-center text-[#6B4530] hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy product link"
              className="w-9 h-9 rounded-full bg-white border border-[#E5D5C3] flex items-center justify-center text-[#6B4530] hover:bg-[#6B4530] hover:border-[#6B4530] hover:text-white transition"
            >
              {linkCopied ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.5 1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.5-1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {linkCopied && (
              <span className="text-xs text-green-700">Link copied!</span>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        {faqs.length > 0 && (
          <div className="mb-14">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white border border-[#E5D5C3] rounded-xl p-4 group"
                >
                  <summary className="cursor-pointer font-medium text-[#6B4530] list-none flex items-center justify-between">
                    {faq?.question}
                    <span className="text-[#8B6F5C] group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-[#8B6F5C] mt-3 text-sm leading-relaxed">
                    {faq?.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-6">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-[#8B6F5C] mb-8">
              No reviews yet — be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4 mb-10">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E5D5C3] rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-[#6B4530]">
                      {review?.customerName}
                    </p>
                    <Stars rating={review?.rating} size="text-sm" />
                  </div>
                  <p className="text-[#8B6F5C] text-sm leading-relaxed">
                    {review?.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 max-w-lg">
            <h3 className="font-medium text-[#6B4530] mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <input
                type="text"
                name="customerName"
                placeholder="Your name"
                value={reviewForm.customerName}
                onChange={handleReviewChange}
                className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#8B6F5C]">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() =>
                        setReviewForm({ ...reviewForm, rating: n })
                      }
                      className="text-xl leading-none"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <span
                        className={
                          n <= reviewForm.rating
                            ? "text-[#C1653A]"
                            : "text-[#E5D5C3]"
                        }
                      >
                        {"\u2605"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                name="comment"
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={handleReviewChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
              />

              {reviewError && (
                <p className="text-red-600 text-sm">{reviewError}</p>
              )}
              {reviewSuccess && (
                <p className="text-green-700 text-sm">{reviewSuccess}</p>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#6B4530] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#8B6F5C] transition disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((item) => {
                if (!item) return null;
                const itemHasDiscount =
                  item.originalPrice && item.originalPrice > item.price;
                const itemDiscountPercent = itemHasDiscount
                  ? Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100,
                    )
                  : 0;
                const itemName = item.name || "Product";

                return (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="bg-white border border-[#E5D5C3] rounded-xl overflow-hidden hover:shadow-md transition group"
                  >
                    <div className="relative aspect-square bg-[#F0CBA3] overflow-hidden">
                      {itemHasDiscount && (
                        <span className="absolute top-2 left-2 z-10 bg-[#C1653A] text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {itemDiscountPercent}% OFF
                        </span>
                      )}
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="text-[#6B4530] font-medium text-sm truncate">
                        {itemName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#6B4530] font-semibold text-sm">
                          Rs. {item.price}
                        </p>
                        {itemHasDiscount && (
                          <p className="text-[#8B6F5C] text-xs line-through">
                            Rs. {item.originalPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {zoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeZoom}
        >
          <button
            type="button"
            onClick={closeZoom}
            aria-label="Close zoom view"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous design"
                className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next design"
                className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeImage]}
              alt={`${productName} \u2014 zoomed view`}
              onClick={() => setIsZoomed((z) => !z)}
              onMouseMove={handleZoomMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              className={`max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ${
                isZoomed ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in"
              }`}
              style={{
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
            />
          </div>
        </div>
      )}

      <WishlistContactModal
        open={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
        onSubmit={handleWishlistContactSubmit}
      />

      <WishlistContactModal
        open={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        onSubmit={handleNotifyContactSubmit}
        title="Notify me when available"
        description="Share your name and number and we'll reach out on WhatsApp as soon as this is back in stock."
        submitLabel="Notify Me"
      />
    </main>
  );
}
