import Link from "next/link";
import api from "@/lib/api";
import NewsletterForm from "@/components/NewsletterForm";

function Stars({ rating }) {
  return (
    <span className="text-[#F0CBA3] text-lg tracking-tight">
      {"\u2605".repeat(rating)}
      <span className="text-white/25">{"\u2605".repeat(5 - rating)}</span>
    </span>
  );
}

async function getFeaturedReviews() {
  try {
    const res = await api.get("/api/products/reviews/featured");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching featured reviews:", err);
    return [];
  }
}

export default async function Home() {
  const reviews = await getFeaturedReviews();

  return (
    <main className="bg-[#FBF3E9]">
      <section className="relative h-[640px] flex items-end overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Mitti handmade products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D2417]/90 via-[#3D2417]/35 to-transparent"></div>

        <div className="relative z-10 max-w-2xl px-6 md:px-16 pb-16 md:pb-20">
          <p className="text-sm tracking-[0.2em] text-[#F0CBA3] mb-4 uppercase font-medium">
            From Soil to Soul
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-white mb-6 leading-[1.05]">
            Welcome to Mitti&apos;s World
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-9 max-w-lg leading-relaxed">
            Born from mitti, made with soul: handcrafted concrete art and
            scented candles for every space.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#F0CBA3] text-[#6B4530] px-9 py-4 rounded-full font-semibold text-base hover:bg-white transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      <section className="bg-[#6B4530] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            100% Handmade
          </p>
          <span className="hidden sm:inline text-[#8B6F5C]">&bull;</span>
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            Made in Pakistan
          </p>
          <span className="hidden sm:inline text-[#8B6F5C]">&bull;</span>
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            Delivery Across Pakistan
          </p>
        </div>
      </section>

      <section className="bg-[#FBF3E9] py-24 px-6 max-w-5xl mx-auto">
        <p className="text-sm tracking-[0.2em] text-[#8B6F5C] uppercase text-center mb-3">
          Two Crafts, One Studio
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#6B4530] text-center mb-14">
          Explore Our Collections
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/shop?category=Concrete"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
          >
            <img
              src="/concrete.png"
              alt="Concrete Decor"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2417]/85 via-[#3D2417]/20 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-white mb-2">
                Concrete Decor
              </h3>
              <p className="text-white/85">
                Handcrafted pieces with an earthy touch
              </p>
              <span className="mt-4 text-sm text-[#F0CBA3] font-medium underline underline-offset-4">
                Shop Concrete
              </span>
            </div>
          </Link>

          <Link
            href="/shop?category=Candles"
            className="group relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
          >
            <img
              src="/candles.png"
              alt="Candles"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2417]/85 via-[#3D2417]/20 to-transparent"></div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-white mb-2">
                Candles
              </h3>
              <p className="text-white/85">
                Warm, hand-poured candles for every mood
              </p>
              <span className="mt-4 text-sm text-[#F0CBA3] font-medium underline underline-offset-4">
                Shop Candles
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-white border border-[#E5D5C3] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-sm tracking-[0.2em] text-[#8B6F5C] uppercase mb-3">
              Weddings &amp; Events
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] mb-3">
              Planning a wedding or corporate gift order?
            </h2>
            <p className="text-[#8B6F5C] max-w-md">
              We craft in bulk for weddings, corporate gifting, and events
              &mdash; personalized to your occasion.
            </p>
          </div>
          <Link
            href="/bulk-orders"
            className="shrink-0 inline-block bg-[#6B4530] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#8B6F5C] transition-colors"
          >
            Explore Bulk Orders
          </Link>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="bg-[#F0CBA3] py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm tracking-[0.2em] text-[#8B6F5C] uppercase text-center mb-3">
              Real Feedback
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#6B4530] text-center mb-14">
              What Our Customers Say
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-7 flex flex-col shadow-sm"
                >
                  <span className="text-[#F0CBA3] text-5xl font-[family-name:var(--font-playfair)] leading-none mb-2">
                    &ldquo;
                  </span>
                  <p className="text-[#6B4530] leading-relaxed mb-5 flex-1">
                    {review.comment}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#6B4530] text-sm">
                        {review.customerName}
                      </p>
                      <p className="text-xs text-[#8B6F5C]">
                        on {review.productName}
                      </p>
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#FBF3E9] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] text-[#8B6F5C] uppercase mb-3">
            Our Story
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#6B4530] mb-6">
            Made with heart, since June 2025
          </h2>
          <p className="text-[#6B4530]/80 text-lg leading-relaxed mb-8">
            Mitti was founded by two teenage creators, Aliza and Muniba, who
            turned their love for handmade decor into a growing small business.
          </p>
          <Link
            href="/about"
            className="inline-block border-2 border-[#6B4530] text-[#6B4530] px-8 py-3 rounded-full font-medium hover:bg-[#6B4530] hover:text-white transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#6B4530] to-[#4A2F20] py-20 px-6 text-center">
        <p className="text-sm tracking-[0.2em] text-[#F0CBA3] uppercase mb-3">
          Stay in the Loop
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white mb-4">
          Let Us Send You Our Offers
        </h2>
        <p className="text-[#E5D5C3]/90 max-w-md mx-auto mb-9">
          Be the first to know about new collections, discounts, and restocks
          &mdash; straight to your inbox.
        </p>
        <NewsletterForm />
      </section>
    </main>
  );
}
