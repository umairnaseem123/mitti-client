"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const loadWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("mitti_wishlist") || "[]");
    setWishlist(stored);
  };

  const removeItem = (productId) => {
    const updated = wishlist.filter((item) => item.productId !== productId);
    setWishlist(updated);
    localStorage.setItem("mitti_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Saved For Later
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Wishlist
        </h1>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-[#E5D5C3] rounded-2xl overflow-hidden flex flex-col"
              >
                <Link href={`/product/${item.productId}`}>
                  <div className="relative aspect-square bg-[#F0CBA3] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-[#6B4530] font-bold text-sm md:text-base leading-snug line-clamp-1 hover:underline">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[#6B4530] font-semibold text-sm md:text-base mt-1.5">
                    Rs. {item.price}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-[#C1653A] text-xs underline mt-3 text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
