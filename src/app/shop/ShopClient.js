"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import WishlistContactModal from "@/components/WishlistContactModal";

function getWishlist() {
  return JSON.parse(localStorage.getItem("mitti_wishlist") || "[]");
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistModalProduct, setWishlistModalProduct] = useState(null);

  const [activeImageIndices, setActiveImageIndices] = useState({});

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  useEffect(() => {
    setWishlist(getWishlist());
    const syncWishlist = () => setWishlist(getWishlist());
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await api.get("/api/products", {
        params,
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveIndex = (productId) => activeImageIndices[productId] || 0;

  const handlePrevImage = (e, productId, length) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current === 0 ? length - 1 : current - 1 };
    });
  };

  const handleNextImage = (e, productId, length) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndices((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current === length - 1 ? 0 : current + 1 };
    });
  };

  const performWishlistToggle = async (product, action, name, phone) => {
    const current = getWishlist();
    let updated;
    if (action === "remove") {
      updated = current.filter((item) => item.productId !== product._id);
    } else {
      updated = [
        ...current,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          phone: phone || "",
        },
      ];
    }
    localStorage.setItem("mitti_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));

    // The backend saves the WishlistEntry (name/phone) as part of this
    // same call — there's no separate contact-capture endpoint.
    await api.put(`/api/products/${product._id}/wishlist`, {
      action,
      name,
      phone,
    });
  };

  const toggleWishlist = (e, product) => {
    console.log("HEART CLICKED", product.name);
    e.preventDefault();
    e.stopPropagation();
    const current = getWishlist();
    const exists = current.some((item) => item.productId === product._id);
    console.log("Already wishlisted?", exists);

    if (exists) {
      console.log("Removing...");
      // Removing — no popup needed. Pass along the phone we stored
      // when adding, so the backend can find and delete the matching entry.
      const entry = current.find((item) => item.productId === product._id);
      performWishlistToggle(product, "remove", undefined, entry?.phone).catch(
        (err) => {
          console.error("Error updating wishlist count:", err);
        },
      );
    } else {
      console.log("Setting wishlistModalProduct to:", product);
      // Adding — collect name/phone first, then make the single PUT call.
      setWishlistModalProduct(product);
    }
  };

  const handleWishlistSubmit = async (name, phone) => {
    await performWishlistToggle(wishlistModalProduct, "add", name, phone);
    setWishlistModalProduct(null);
  };

  const handleWishlistSkip = async () => {
    try {
      await performWishlistToggle(
        wishlistModalProduct,
        "add",
        undefined,
        undefined,
      );
    } catch (err) {
      console.error("Error updating wishlist count:", err);
    } finally {
      setWishlistModalProduct(null);
    }
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item.productId === productId);

  console.log("RENDER — wishlistModalProduct is:", wishlistModalProduct);

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Our Collection
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Shop
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-[#E5D5C3] bg-white text-[#6B4530] focus:outline-none focus:ring-2 focus:ring-[#C1653A]"
        />

        <div className="flex gap-3">
          <button
            onClick={() => setCategory("")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              category === ""
                ? "bg-[#6B4530] text-white"
                : "bg-white border border-[#E5D5C3] text-[#6B4530]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory("Concrete")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              category === "Concrete"
                ? "bg-[#6B4530] text-white"
                : "bg-white border border-[#E5D5C3] text-[#6B4530]"
            }`}
          >
            Concrete
          </button>
          <button
            onClick={() => setCategory("Candles")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              category === "Candles"
                ? "bg-[#6B4530] text-white"
                : "bg-white border border-[#E5D5C3] text-[#6B4530]"
            }`}
          >
            Candles
          </button>
        </div>
      </section>

      {!loading && products.length > 0 && (
        <section className="max-w-6xl mx-auto px-6">
          <p className="text-sm text-[#8B6F5C] mb-4">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <p className="text-center text-[#8B6F5C] py-20">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-[#8B6F5C] py-20">
            No products found. Try a different search or category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map((product) => {
              const images = product.images || [];
              const activeIndex = getActiveIndex(product._id);
              const hasDiscount =
                product.originalPrice && product.originalPrice > product.price;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )
                : 0;
              const isOutOfStock = !product.stock || product.stock <= 0;
              const wishlisted = isWishlisted(product._id);

              return (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group bg-white border border-[#E5D5C3] rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col"
                >
                  <div className="relative aspect-square bg-[#F0CBA3] flex items-center justify-center overflow-hidden">
                    {hasDiscount && !isOutOfStock && (
                      <span className="absolute top-2 left-2 z-10 bg-[#C1653A] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {isOutOfStock && (
                      <span className="absolute top-2 right-2 z-10 bg-[#6B4530] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(e, product)}
                      aria-label={
                        wishlisted ? "Remove from wishlist" : "Add to wishlist"
                      }
                      className="absolute bottom-2 left-2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition"
                    >
                      <svg
                        className={`w-4 h-4 ${wishlisted ? "text-[#C1653A]" : "text-[#6B4530]"}`}
                        viewBox="0 0 24 24"
                        fill={wishlisted ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>

                    {images.length > 0 ? (
                      <img
                        src={images[activeIndex]}
                        alt={`${product.name}${images.length > 1 ? ` design ${activeIndex + 1}` : ""}`}
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          isOutOfStock ? "opacity-50 grayscale" : ""
                        }`}
                      />
                    ) : (
                      <span className="text-[#8B6F5C] text-sm">No image</span>
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) =>
                            handlePrevImage(e, product._id, images.length)
                          }
                          aria-label="Previous design"
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow transition z-10"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
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
                          onClick={(e) =>
                            handleNextImage(e, product._id, images.length)
                          }
                          aria-label="Next design"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-[#6B4530] flex items-center justify-center shadow transition z-10"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {images.map((_, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition ${
                                i === activeIndex ? "bg-white" : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-[#6B4530] font-bold text-base md:text-lg leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <p className="text-[#6B4530] font-semibold text-base md:text-lg">
                        Rs. {product.price}
                      </p>
                      {hasDiscount && (
                        <p className="text-[#8B6F5C] text-sm line-through">
                          Rs. {product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {wishlistModalProduct && (
        <WishlistContactModal
          product={wishlistModalProduct}
          onSubmit={handleWishlistSubmit}
          onSkip={handleWishlistSkip}
        />
      )}
    </main>
  );
}

export default function ShopClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF3E9]" />}>
      <ShopContent />
    </Suspense>
  );
}
