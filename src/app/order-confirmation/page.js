"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Your business WhatsApp number (with country code, no + or spaces)
const OWNER_WHATSAPP_NUMBER = "923290175894";

function getPaymentLabel(method) {
  if (method === "easypaisa") return "Easypaisa (Online)";
  if (method === "jazzcash") return "JazzCash (Online)";
  return "Cash on Delivery";
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const method = searchParams.get("method");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("mitti_last_order");
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  const isOnlinePayment = method === "easypaisa" || method === "jazzcash";

  const buildWhatsAppMessage = () => {
    if (!order) return "";

    const itemsList = order.items
      .map(
        (item) => `- ${item.name} x${item.qty} (Rs. ${item.price * item.qty})`,
      )
      .join("\n");

    const paymentLine = isOnlinePayment
      ? `Payment Method: ${getPaymentLabel(order.paymentMethod)}\n` +
        `I have sent the payment via QR code — screenshot attached below for confirmation.\n`
      : `Payment Method: ${getPaymentLabel(order.paymentMethod)}\n`;

    const message =
      `Hi! I just placed an order on Mitti:\n\n` +
      `Name: ${order.customer.name}\n` +
      `Phone: ${order.customer.phone}\n` +
      `Address: ${order.customer.address}\n\n` +
      `Items:\n${itemsList}\n\n` +
      `Total: Rs. ${order.totalAmount.toFixed(0)}\n` +
      paymentLine +
      `\nPlease confirm my order. Thank you!`;

    return encodeURIComponent(message);
  };

  const whatsappLink = order
    ? `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`
    : "#";

  return (
    <main className="bg-[#FBF3E9] min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center bg-white border border-[#E5D5C3] rounded-2xl p-12">
        {success === "true" ? (
          <>
            <div className="text-5xl mb-6">✓</div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-4">
              Order Confirmed!
            </h1>
            <p className="text-[#8B6F5C] mb-2">
              Thank you for shopping with Mitti.
            </p>
            <p className="text-[#8B6F5C] mb-8">
              {method === "cod"
                ? "Your order will be delivered soon. Payment is due on arrival."
                : isOnlinePayment
                ? "Please send your payment screenshot on WhatsApp so we can confirm your order."
                : "Your payment was successful and your order is being processed."}
            </p>

            {order && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1ebe57] transition mb-4 w-full"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
                </svg>
                {isOnlinePayment
                  ? "Send Payment Screenshot on WhatsApp"
                  : "Confirm Order on WhatsApp"}
              </a>
            )}

            {isOnlinePayment && (
              <p className="text-xs text-[#C1653A] mb-2 font-medium">
                Important: Please attach your payment screenshot in the WhatsApp chat before sending.
              </p>
            )}

            <p className="text-xs text-[#8B6F5C] mb-6">
              Tap the button above and hit send — it helps us process your order
              faster.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-4">
              Something Went Wrong
            </h1>
            <p className="text-[#8B6F5C] mb-8">
              Your order could not be confirmed. Please try again or contact us.
            </p>
          </>
        )}
        <Link
          href="/shop"
          className="inline-block bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF3E9]" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
