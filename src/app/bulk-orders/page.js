import Link from "next/link";
export const metadata = {
  title: "Bulk & Corporate Gifting",
  description:
    "Handmade concrete decor and candles crafted in bulk for weddings, corporate gifting, and events. Get a custom quote on WhatsApp.",
};
const WHATSAPP_NUMBER = "923290175894";

const buildWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const DEFAULT_MESSAGE =
  "Hi Mitti! I'm interested in a bulk / corporate order. Could you share more details?";

const occasions = [
  {
    title: "Weddings",
    description: "Personalized favors and decor pieces for your big day.",
    emoji: "\u{1F48D}",
    message:
      "Hi Mitti! I'm interested in a bulk order for a wedding. Could you share more details?",
  },
  {
    title: "Corporate Gifting",
    description: "Branded, thoughtful gifts for clients, partners, and teams.",
    emoji: "\u{1F454}",
    message:
      "Hi Mitti! I'm interested in a bulk order for corporate gifting. Could you share more details?",
  },
  {
    title: "Events & Favors",
    description: "Baby showers, birthdays, and celebrations of every size.",
    emoji: "\u{1F389}",
    message:
      "Hi Mitti! I'm interested in a bulk order for an event / party favors. Could you share more details?",
  },
  {
    title: "Custom Orders",
    description: "Have something specific in mind? We'll work with you on it.",
    emoji: "\u2728",
    message:
      "Hi Mitti! I have a custom order in mind. Could we discuss the details?",
  },
];

const steps = [
  {
    step: "01",
    title: "Tell us what you need",
    description:
      "Reach out on WhatsApp with your occasion, quantity, and timeline.",
  },
  {
    step: "02",
    title: "We put together a quote",
    description:
      "We'll suggest pieces and pricing based on your budget and vision.",
  },
  {
    step: "03",
    title: "We craft and deliver",
    description:
      "Every piece is handmade to order and delivered across Pakistan.",
  },
];

export default function BulkOrdersPage() {
  const whatsappLink = buildWhatsAppLink(DEFAULT_MESSAGE);

  return (
    <main className="bg-[#FBF3E9]">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          For Every Occasion
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530] mb-4">
          Bulk &amp; Corporate Gifting
        </h1>
        <p className="text-[#6B4530]/80 max-w-xl mx-auto">
          Handmade concrete decor and candles, crafted in bulk for weddings,
          corporate events, and everything worth celebrating.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] text-center mb-12">
          What We Help With
        </h2>
        <p className="text-[#8B6F5C] text-sm text-center -mt-8 mb-10">
          Tap any card below to start a conversation on WhatsApp for that
          occasion.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {occasions.map((occasion) => (
            <a
              key={occasion.title}
              href={buildWhatsAppLink(occasion.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#E5D5C3] rounded-2xl p-6 text-center hover:border-[#6B4530] hover:shadow-md transition cursor-pointer"
            >
              <div className="text-3xl mb-3">{occasion.emoji}</div>
              <h3 className="text-[#6B4530] font-semibold mb-2">
                {occasion.title}
              </h3>
              <p className="text-[#8B6F5C] text-sm leading-relaxed">
                {occasion.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-[#F0CBA3] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] text-center mb-14">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-[family-name:var(--font-playfair)] text-white/70 mb-3">
                  {item.step}
                </div>
                <h3 className="text-[#6B4530] font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B4530]/80 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] mb-4">
          Ready to plan your order?
        </h2>
        <p className="text-[#8B6F5C] mb-8">
          Message us on WhatsApp with your occasion, quantity, and timeline
          &mdash; we&apos;ll take it from there.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#1ebc59] transition"
        >
          <span className="text-lg">{"\u{1F4AC}"}</span>
          Enquire on WhatsApp
        </a>
        <p className="text-[#8B6F5C] text-sm mt-6">
          Prefer to browse first?{" "}
          <Link href="/shop" className="underline hover:text-[#6B4530]">
            Explore our collection
          </Link>
        </p>
      </section>
    </main>
  );
}
