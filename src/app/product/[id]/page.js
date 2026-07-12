"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function Stars({ rating, size = "text-base" }) {
  return (
    <span className={`${size} text-[#C1653A] tracking-tight`}>
      {"\u2605".repeat(rating)}
      <span className="text-[#E5D5C3]">{"\u2605".repeat(5 - rating)}</span>
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Zoom lightbox state
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    if (id) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Let the Escape key close the zoom lightbox, and disable page scroll
  // while it's open so the background doesn't move behind it.
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

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
      setActiveImage(0); // reset to first photo whenever a new product loads
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Could not load product.");
    } finally {
      setLoading(false);
    }
  };

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

  // Tracks cursor position over the zoomed image as a percentage, so the
  // zoomed-in view centers on wherever the customer is pointing.
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
      (item) => item.productId === product._id,
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
      setProduct(res.data);
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

  const reviews = product.reviews || [];
  const faqs = product.faqs || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div>
          <div className="relative aspect-square bg-[#F0CBA3] rounded-2xl overflow-hidden flex items-center justify-center">
            {hasDiscount && (
              <span className="absolute top-3 left-3 z-10 bg-[#C1653A] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {discountPercent}% OFF
              </span>
            )}

            {images.length > 0 ? (
              <img
                onClick={openZoom}
                src={images[activeImage]}
                alt={`${product.name} ${"\u2014"} design ${activeImage + 1}`}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            ) : (
              <span className="text-[#8B6F5C]">No image</span>
            )}

            {/* Zoom hint badge — makes the zoom feature discoverable */}
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

            {/* Prev/Next arrows — only shown when there's more than one photo */}
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

                {/* Image counter */}
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnail strip — only shown when there's more than one photo */}
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
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-3">
            {product.name}
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

          <p className="text-[#8B6F5C] mb-6 whitespace-pre-line">
            {product.description}
          </p>

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

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
            >
              {added ? `Added ${"\u2713"}` : "Add to Cart"}
            </button>
            <Link
              href="/cart"
              className="px-8 py-3 rounded-full font-medium border border-[#E5D5C3] text-[#6B4530] hover:bg-white transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs + Reviews */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {/* FAQs */}
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
                    {faq.question}
                    <span className="text-[#8B6F5C] group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-[#8B6F5C] mt-3 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
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
                      {review.customerName}
                    </p>
                    <Stars rating={review.rating} size="text-sm" />
                  </div>
                  <p className="text-[#8B6F5C] text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add a review */}
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
      </section>

      {/* Zoom Lightbox */}
      {zoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeZoom}
        >
          {/* Close button */}
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

          {/* Prev/Next inside the lightbox, if there's more than one photo */}
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

          {/* Zoomable image — click toggles zoomed in/out, cursor position
              controls where the zoom centers on */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeImage]}
              alt={`${product.name} ${"\u2014"} zoomed view`}
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
    </main>
  );
}
