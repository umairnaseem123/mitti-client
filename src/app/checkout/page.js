"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [settings, setSettings] = useState({
    taxPercentage: 0,
    codExtraCharge: 0,
    deliveryCharge: 300,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mitti_cart") || "[]");
    setCart(stored);
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/settings");
      setSettings(res.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = (subtotal * (settings.taxPercentage || 0)) / 100;
  const codCharge = settings.codExtraCharge || 0;
  const deliveryCharge = settings.deliveryCharge ?? 300;
  const total = subtotal + taxAmount + codCharge + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all fields.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      // Save order summary so the confirmation page can build a WhatsApp message
      const orderSummary = {
        customer: form,
        items: orderItems,
        totalAmount: total,
        paymentMethod: "cod",
      };
      localStorage.setItem("mitti_last_order", JSON.stringify(orderSummary));

      await api.post("/api/orders", {
        customer: form,
        items: orderItems,
        totalAmount: total,
        paymentMethod: "cod",
      });

      localStorage.removeItem("mitti_cart");
      router.push("/order-confirmation?success=true&method=cod");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Almost There
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Checkout
        </h1>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <h2 className="text-xl font-semibold text-[#6B4530] mb-6">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />
            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-white"
            />

            <div className="bg-white border border-[#E5D5C3] rounded-lg p-4 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#6B4530] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h4" />
              </svg>
              <div>
                <p className="text-[#6B4530] font-medium">Cash on Delivery</p>
                <p className="text-[#8B6F5C] text-sm">
                  Pay in cash when your order arrives
                  {codCharge > 0 && ` (+Rs. ${codCharge})`}
                </p>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6B4530] text-white py-4 rounded-full font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50 mt-4"
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-[#6B4530] mb-6">
            Order Summary
          </h2>
          <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-[#6B4530]">
                  {item.name} x{item.qty}
                </span>
                <span className="text-[#6B4530]">
                  Rs. {item.price * item.qty}
                </span>
              </div>
            ))}

            <hr className="border-[#E5D5C3]" />

            <div className="flex justify-between text-sm">
              <span className="text-[#8B6F5C]">Subtotal</span>
              <span className="text-[#6B4530]">Rs. {subtotal}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#8B6F5C]">Delivery Charge</span>
              <span className="text-[#6B4530]">Rs. {deliveryCharge}</span>
            </div>

            {settings.taxPercentage > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8B6F5C]">
                  Tax ({settings.taxPercentage}%)
                </span>
                <span className="text-[#6B4530]">
                  Rs. {taxAmount.toFixed(0)}
                </span>
              </div>
            )}

            {codCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#8B6F5C]">COD Charge</span>
                <span className="text-[#6B4530]">Rs. {codCharge}</span>
              </div>
            )}

            <hr className="border-[#E5D5C3]" />

            <div className="flex justify-between text-lg font-semibold">
              <span className="text-[#6B4530]">Total</span>
              <span className="text-[#6B4530]">Rs. {total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
