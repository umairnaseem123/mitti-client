"use client";

import { useState } from "react";
import api from "@/lib/api";

const statusSteps = ["pending", "shipped", "delivered"];

const statusLabels = {
  pending: "Order Received",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.post("/api/orders/track", {
        orderId: orderId.trim(),
        phone: phone.trim(),
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Error tracking order:", err);
      setError(
        err.response?.data?.message ||
          "Could not find that order. Please check your Order ID and phone number.",
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? statusSteps.indexOf(order.orderStatus)
    : -1;

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Where's My Order
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Track Order
        </h1>
      </section>

      <section className="max-w-xl mx-auto px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E5D5C3] rounded-2xl p-6 space-y-4 mb-8"
        >
          <div>
            <label className="block text-sm text-[#8B6F5C] mb-1">
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 64f8a2b1c9e77a001234abcd"
              required
              className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
            />
            <p className="text-xs text-[#8B6F5C] mt-1">
              You'll find this in your order confirmation.
            </p>
          </div>

          <div>
            <label className="block text-sm text-[#8B6F5C] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="The number you used at checkout"
              required
              className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4530] text-white py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-8">
            {error}
          </div>
        )}

        {order && (
          <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <p className="text-xs text-[#8B6F5C]">Order ID</p>
                <p className="text-[#6B4530] font-mono text-sm">{order._id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8B6F5C]">Placed on</p>
                <p className="text-[#6B4530] text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Status timeline */}
            <div className="flex items-center mb-8">
              {statusSteps.map((step, index) => {
                const isComplete = index <= currentStepIndex;
                const isLast = index === statusSteps.length - 1;

                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isComplete
                            ? "bg-[#6B4530] text-white"
                            : "bg-[#E5D5C3] text-[#8B6F5C]"
                        }`}
                      >
                        {isComplete ? "\u2713" : index + 1}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center ${
                          isComplete ? "text-[#6B4530] font-medium" : "text-[#8B6F5C]"
                        }`}
                      >
                        {statusLabels[step]}
                      </p>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-1 ${
                          index < currentStepIndex ? "bg-[#6B4530]" : "bg-[#E5D5C3]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="border-t border-[#E5D5C3] pt-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-[#6B4530]">
                    {item.name} x{item.qty}
                  </span>
                  <span className="text-[#8B6F5C]">
                    Rs. {item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E5D5C3] mt-4 pt-4 flex justify-between font-semibold">
              <span className="text-[#6B4530]">Total</span>
              <span className="text-[#6B4530]">Rs. {order.totalAmount}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5D5C3] flex justify-between text-sm">
              <span className="text-[#8B6F5C]">Payment Status</span>
              <span
                className={`font-medium ${
                  order.paymentStatus === "paid"
                    ? "text-green-700"
                    : order.paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-[#8B6F5C]"
                }`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        )}

        {searched && !loading && !order && !error && (
          <p className="text-center text-[#8B6F5C] text-sm">
            No results yet.
          </p>
        )}
      </section>
    </main>
  );
}
