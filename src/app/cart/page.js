"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("mitti_cart") || "[]");
    setCart(stored);
  };

  const saveCart = (updated) => {
    setCart(updated);
    localStorage.setItem("mitti_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQty = (productId, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, qty: newQty } : item
    );
    saveCart(updated);
  };

  const removeItem = (productId) => {
    const updated = cart.filter((item) => item.productId !== productId);
    saveCart(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Your Bag
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Cart
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8B6F5C] text-lg mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-10">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white border border-[#E5D5C3] rounded-2xl p-5 flex items-center gap-5"
                >
                  <div className="w-20 h-20 bg-[#F0CBA3] rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[#6B4530] font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-[#8B6F5C] text-sm">Rs. {item.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="w-8 h-8 rounded-full border border-[#E5D5C3] text-[#6B4530]"
                    >
                      -
                    </button>
                    <span className="text-[#6B4530] w-6 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="w-8 h-8 rounded-full border border-[#E5D5C3] text-[#6B4530]"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-[#6B4530] font-semibold w-20 text-right">
                    Rs. {item.price * item.qty}
                  </p>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-[#C1653A] text-sm underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 flex items-center justify-between mb-8">
              <p className="text-lg text-[#6B4530] font-semibold">Subtotal</p>
              <p className="text-lg text-[#6B4530] font-semibold">
                Rs. {subtotal}
              </p>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full bg-[#6B4530] text-white py-4 rounded-full font-medium hover:bg-[#8B6F5C] transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </section>
    </main>
  );
}
