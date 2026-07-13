import Link from "next/link";

export default function ReturnPolicyPage() {
  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Good to Know
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Return &amp; Refund Policy
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <p className="text-[#8B6F5C] leading-relaxed">
          Every piece at Mitti is handmade with care, and we want you to love
          what arrives at your door. If something isn&apos;t right, here&apos;s
          how we can help.
        </p>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Damaged or Incorrect Items
          </h2>
          <p className="text-[#8B6F5C] leading-relaxed">
            If your order arrives damaged, defective, or different from what you
            ordered, please contact us on WhatsApp within{" "}
            <strong className="text-[#6B4530]">48 hours</strong> of delivery,
            along with a photo or video of the item. We&apos;ll arrange a free
            replacement or a full refund, whichever you prefer.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Change of Mind
          </h2>
          <p className="text-[#8B6F5C] leading-relaxed">
            Because each item is handcrafted to order, we currently{" "}
            <strong className="text-[#6B4530]">
              do not accept returns or exchanges
            </strong>{" "}
            for change of mind. We encourage you to review product photos,
            descriptions, and dimensions carefully before ordering. If you have
            any questions about a piece, message us on WhatsApp before placing
            your order &mdash; we&apos;re happy to help.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            How Refunds Work
          </h2>
          <p className="text-[#8B6F5C] leading-relaxed">
            Approved refunds are processed within{" "}
            <strong className="text-[#6B4530]">5&ndash;7 business days</strong>.
            For Cash on Delivery orders, refunds are sent via bank transfer or
            Easypaisa/JazzCash. For online payments, refunds are returned to the
            original payment method used.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Cancellations
          </h2>
          <p className="text-[#8B6F5C] leading-relaxed">
            Orders can be cancelled free of charge as long as they haven&apos;t
            been shipped yet. Once an order has been dispatched, it can no
            longer be cancelled. To cancel, message us on WhatsApp with your
            order details as soon as possible.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Need Help?
          </h2>
          <p className="text-[#8B6F5C] leading-relaxed">
            We&apos;re here for you. Reach out anytime on{" "}
            <a
              href="https://wa.me/923290175894"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B4530] underline hover:text-[#8B6F5C]"
            >
              WhatsApp
            </a>{" "}
            or through our{" "}
            <Link
              href="/contact"
              className="text-[#6B4530] underline hover:text-[#8B6F5C]"
            >
              Contact page
            </Link>
            , and we&apos;ll sort things out together.
          </p>
        </div>
      </section>
    </main>
  );
}
