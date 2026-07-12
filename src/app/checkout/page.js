"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { Truck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [settings, setSettings] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "easypaisa" | "jazzcash"

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
      setSettings({ taxPercentage: 0, codExtraCharge: 0, deliveryCharge: 300 });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isOnlinePayment = paymentMethod !== "cod";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = settings
    ? (subtotal * (settings.taxPercentage || 0)) / 100
    : 0;
  const codCharge = !isOnlinePayment ? settings?.codExtraCharge || 0 : 0;
  const deliveryCharge = isOnlinePayment
    ? 0
    : (settings?.deliveryCharge ?? 300);
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

      const orderSummary = {
        customer: form,
        items: orderItems,
        totalAmount: total,
        paymentMethod,
      };
      localStorage.setItem("mitti_last_order", JSON.stringify(orderSummary));

      await api.post("/api/orders", {
        customer: form,
        items: orderItems,
        totalAmount: total,
        paymentMethod,
      });

      localStorage.removeItem("mitti_cart");
      router.push(`/order-confirmation?success=true&method=${paymentMethod}`);
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

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <p className="text-[#6B4530] font-medium">Payment Method</p>

              {/* COD Option */}
              <label
                className={`block bg-white border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-[#6B4530] ring-1 ring-[#6B4530]"
                    : "border-[#E5D5C3]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#6B4530]"
                  />
                  <div>
                    <p className="text-[#6B4530] font-medium">
                      Cash on Delivery
                    </p>
                    <p className="text-[#8B6F5C] text-sm">
                      Pay in cash when your order arrives
                      {settings?.codExtraCharge > 0 &&
                        ` (+Rs. ${settings.codExtraCharge})`}
                    </p>
                  </div>
                </div>
              </label>

              {/* Easypaisa Option */}
              <label
                className={`block bg-white border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === "easypaisa"
                    ? "border-[#6B4530] ring-1 ring-[#6B4530]"
                    : "border-[#E5D5C3]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "easypaisa"}
                    onChange={() => setPaymentMethod("easypaisa")}
                    className="accent-[#6B4530]"
                  />
                  <div>
                    <p className="text-[#6B4530] font-medium">
                      Easypaisa (Online Payment)
                    </p>
                    <p className="text-green-700 text-sm font-medium flex items-center gap-1">
                      <Truck size={14} /> Free Shipping
                    </p>
                  </div>
                </div>
              </label>

              {/* JazzCash Option */}
              <label
                className={`block bg-white border rounded-lg p-4 cursor-pointer transition ${
                  paymentMethod === "jazzcash"
                    ? "border-[#6B4530] ring-1 ring-[#6B4530]"
                    : "border-[#E5D5C3]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "jazzcash"}
                    onChange={() => setPaymentMethod("jazzcash")}
                    className="accent-[#6B4530]"
                  />
                  <div>
                    <p className="text-[#6B4530] font-medium">
                      JazzCash (Online Payment)
                    </p>
                    <p className="text-green-700 text-sm font-medium flex items-center gap-1">
                      <Truck size={14} /> Free Shipping
                    </p>
                  </div>
                </div>
              </label>

              {/* QR Code Display */}
              {isOnlinePayment && (
                <div className="bg-white border border-[#E5D5C3] rounded-lg p-6 text-center">
                  <p className="text-[#6B4530] font-medium mb-4">
                    Scan the QR code below to pay via{" "}
                    {paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"}
                  </p>
                  <div className="flex justify-center mb-4">
                    <img
                      src={
                        paymentMethod === "easypaisa"
                          ? "/easypaisa-qr.jpg"
                          : "/jazzcash-qr.jpg"
                      }
                      alt={`${paymentMethod} QR Code`}
                      width={220}
                      height={220}
                      className="rounded-lg border border-[#E5D5C3]"
                    />
                  </div>
                  <p className="text-[#8B6F5C] text-sm">
                    Scan this QR code using{" "}
                    {paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"}{" "}
                    app, complete the payment, then send a screenshot on
                    WhatsApp to confirm your order.
                  </p>
                </div>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !settings}
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

            {!settings ? (
              <p className="text-[#8B6F5C] text-sm text-center py-4">
                Loading order summary...
              </p>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F5C]">Subtotal</span>
                  <span className="text-[#6B4530]">Rs. {subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F5C]">Delivery Charge</span>
                  {isOnlinePayment ? (
                    <span className="text-green-700 font-medium">FREE</span>
                  ) : (
                    <span className="text-[#6B4530]">Rs. {deliveryCharge}</span>
                  )}
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
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
