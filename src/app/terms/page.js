export default function TermsPage() {
  return (
    <main className="bg-[#FBF3E9]">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Legal
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530] mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-[#6B4530]/70 text-sm">
          Mitti &mdash; Home Decor, Cultural Gifts &amp; Arts and Crafts Store
        </p>
        <p className="text-[#6B4530]/70 text-sm mt-1">
          Last updated: July 2026
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <p className="text-[#6B4530]/90 leading-relaxed">
            By using this website and placing an order with Mitti, you agree
            to the following terms and conditions.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Products
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            All items sold by Mitti are handmade. Because each piece is
            crafted by hand, slight variations in color, texture, and
            finish are normal and part of the charm of a handmade product
            &mdash; not a defect.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Pricing
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            All prices are listed in Pakistani Rupees (PKR) and are subject
            to change without prior notice. Delivery charges and any
            applicable taxes are shown separately at checkout.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Orders &amp; Payment
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            We accept Cash on Delivery, as well as online payments via
            EasyPaisa and JazzCash. For online payments, orders are
            confirmed once the transaction details are submitted through
            our website; for Cash on Delivery, payment is collected at the
            time of delivery.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Shipping &amp; Delivery
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            We deliver across Pakistan. Estimated delivery time is
            2&ndash;3 business days from the date of order, though this may
            vary depending on your location and courier availability.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Returns &amp; Refunds
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            Please see our{" "}
            <a href="/return-policy" className="underline hover:text-[#8B6F5C]">
              Return &amp; Refund Policy
            </a>{" "}
            for details on returns, exchanges, and refunds.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Intellectual Property
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            All content on this website, including product photography, the
            Mitti logo, and written content, is the property of Mitti and
            may not be reproduced without permission.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Limitation of Liability
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            Mitti is not liable for delays caused by courier services,
            incorrect shipping information provided by the customer, or
            circumstances beyond our reasonable control.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Governing Law
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            These terms are governed by the laws of Pakistan.
          </p>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-3">
            Contact Us
          </h2>
          <p className="text-[#6B4530]/80 leading-relaxed">
            Mitti &mdash; Home Decor, Cultural Gifts &amp; Arts and Crafts
            Store
            <br />
            Karachi, Pakistan
            <br />
            Email: mittibyaliba@gmail.com
            <br />
            Phone: +92 329 0175894
          </p>
        </div>
      </section>
    </main>
  );
}
