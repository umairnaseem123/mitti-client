"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function getWishlist() {
  return JSON.parse(localStorage.getItem("mitti_wishlist") || "[]");
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlist());
    const syncWishlist = () => setWishlist(getWishlist());
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => item.productId !== productId);
    setWishlist(updated);
    localStorage.setItem("mitti_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("mitti_cart") || "[]");
    const existingIndex = cart.findIndex((c) => c.productId === item.productId);

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: 1,
      });
    }

    localStorage.setItem("mitti_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Saved for Later
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Your Wishlist
        </h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8B6F5C] text-lg mb-6">
              Your wishlist is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#8B6F5C] mb-6">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white border border-[#E5D5C3] rounded-2xl overflow-hidden group"
                >
                  <Link href={`/product/${item.productId}`}>
                    <div className="relative aspect-square bg-[#F0CBA3] overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8B6F5C] text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link href={`/product/${item.productId}`}>
                      <p className="text-[#6B4530] font-medium text-sm truncate hover:underline">
                        {item.name}
                      </p>
                    </Link>
                    <p className="text-[#6B4530] font-semibold text-sm mt-1 mb-3">
                      Rs. {item.price}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-[#6B4530] text-white text-xs font-medium py-2 rounded-full hover:bg-[#8B6F5C] transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        aria-label="Remove from wishlist"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E5D5C3] text-[#C1653A] hover:bg-red-50 transition shrink-0"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
