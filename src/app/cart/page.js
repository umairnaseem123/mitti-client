"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [checkingStock, setCheckingStock] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const stored = JSON.parse(localStorage.getItem("mitti_cart") || "[]");
    setCart(stored);
    await checkStock(stored);
  };

  const checkStock = async (items) => {
    if (items.length === 0) {
      setCheckingStock(false);
      return;
    }
    setCheckingStock(true);
    try {
      const res = await api.get("/api/products");
      const map = {};
      res.data.forEach((p) => {
        map[p._id] = p.stock;
      });
      setStockMap(map);
    } catch (err) {
      console.error("Error checking stock:", err);
    } finally {
      setCheckingStock(false);
    }
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

  const getStockIssue = (item) => {
    const available = stockMap[item.productId];
    if (available === undefined) return null;
    if (available <= 0) return "out";
    if (item.qty > available) return "exceeds";
    return null;
  };

  const hasAnyStockIssue = cart.some((item) => getStockIssue(item) !== null);

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
              {cart.map((item) => {
                const stockIssue = getStockIssue(item);
                const available = stockMap[item.productId];

                return (
                  <div
                    key={item.productId}
                    className={`bg-white border rounded-2xl p-5 flex items-center gap-5 ${
                      stockIssue ? "border-red-300" : "border-[#E5D5C3]"
                    }`}
                  >
                    <div className="w-20 h-20 bg-[#F0CBA3] rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover ${
                            stockIssue === "out" ? "opacity-50 grayscale" : ""
                          }`}
                        />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-[#6B4530] font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-[#8B6F5C] text-sm">Rs. {item.price}</p>
                      {stockIssue === "out" && (
                        <p className="text-red-600 text-xs font-medium mt-1">
                          Out of stock — please remove to continue.
                        </p>
                      )}
                      {stockIssue === "exceeds" && (
                        <p className="text-red-600 text-xs font-medium mt-1">
                          Only {available} left in stock — please lower quantity.
                        </p>
                      )}
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
                );
              })}
            </div>

            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 flex items-center justify-between mb-8">
              <p className="text-lg text-[#6B4530] font-semibold">Subtotal</p>
              <p className="text-lg text-[#6B4530] font-semibold">
                Rs. {subtotal}
              </p>
            </div>

            {hasAnyStockIssue && (
              <p className="text-red-600 text-sm text-center mb-4">
                Please resolve the stock issues above before checking out.
              </p>
            )}

            <button
              onClick={() => router.push("/checkout")}
              disabled={checkingStock || hasAnyStockIssue}
              className={`w-full text-white py-4 rounded-full font-medium transition ${
                checkingStock || hasAnyStockIssue
                  ? "bg-[#6B4530]/50 cursor-not-allowed"
                  : "bg-[#6B4530] hover:bg-[#8B6F5C]"
              }`}
            >
              {checkingStock ? "Checking availability..." : "Proceed to Checkout"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
