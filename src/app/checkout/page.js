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
  const [paymentMethod, setPaymentMethod] = useState("card");
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
  const codCharge = paymentMethod === "cod" ? settings.codExtraCharge || 0 : 0;
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
        paymentMethod,
      };
      localStorage.setItem("mitti_last_order", JSON.stringify(orderSummary));

      if (paymentMethod === "cod") {
        await api.post("/api/orders", {
          customer: form,
          items: orderItems,
          totalAmount: total,
          paymentMethod: "cod",
        });

        localStorage.removeItem("mitti_cart");
        router.push("/order-confirmation?success=true&method=cod");
      } else {
        // Create the order first and capture its real MongoDB _id.
        const orderRes = await api.post("/api/orders", {
          customer: form,
          items: orderItems,
          totalAmount: total,
          paymentMethod: "stripe",
        });

        const orderId = orderRes.data._id;

        // IMPORTANT: only productId and qty are sent for the Stripe session.
        // The backend looks up real prices (and the delivery charge) from
        // the database — never trust prices coming from the browser/cart
        // for anything that charges money.
        const stripeItems = orderItems.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        }));

        // orderId is sent so Stripe can tag the payment session with it.
        // When Stripe confirms payment via webhook, this is how our
        // backend knows which order to mark as paid.
        const res = await api.post("/api/payment/checkout", {
          items: stripeItems,
          orderId,
        });

        localStorage.removeItem("mitti_cart");
        window.location.href = res.data.url;
      }
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

            <h2 className="text-xl font-semibold text-[#6B4530] pt-4 mb-2">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 bg-white border border-[#E5D5C3] rounded-lg p-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span className="text-[#6B4530]">Credit / Debit Card (Stripe)</span>
              </label>
              <label className="flex items-center gap-3 bg-white border border-[#E5D5C3] rounded-lg p-4 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="text-[#6B4530]">
                  Cash on Delivery {settings.codExtraCharge > 0 && `(+Rs. ${settings.codExtraCharge})`}
                </span>
              </label>
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
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-[#6B4530]">
                  {item.name} x{item.qty}
                </span>
                <span className="text-[#6B4530]">Rs. {item.price * item.qty}</span>
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
                <span className="text-[#8B6F5C]">Tax ({settings.taxPercentage}%)</span>
                <span className="text-[#6B4530]">Rs. {taxAmount.toFixed(0)}</span>
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
