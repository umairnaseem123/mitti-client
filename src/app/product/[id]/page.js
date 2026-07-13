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
  const [linkCopied, setLinkCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

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

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

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

  const reviews = product.reviews || [];
  const faqs = product.faqs || [];
  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const shareText = `Check out ${product.name} on Mitti!`;
  const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`;
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" strokeLinejoin="round" />
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next design"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow-md transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
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

          <div className="flex gap-4 mb-6">
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

          {/* Social sharing */}
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 11a5 5 0 00-7.07 0L4.1 13.83a5 5 0 007.07 7.07l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {linkCopied && (
              <span className="text-xs text-green-700">Link copied!</span>
            )}
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
            <h3 className="font-medium text-[#6B4530] mb-4">
              Write a Review
            </h3>
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
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
