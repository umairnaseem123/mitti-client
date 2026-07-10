import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-[#FBF3E9]">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Mitti handmade products"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/40"></div>

        <div className="relative z-10 max-w-xl px-6 md:px-16">
          <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
            From Soil to Soul
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl text-[#6B4530] mb-6 leading-tight">
            Welcome to Mitti's World
          </h1>
          <p className="text-[#6B4530] text-lg mb-8">
            Discover handcrafted concrete art and scented candles — each piece
            shaped by earth, touched by artistry, and made with soul.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-[#FBF3E9] py-20 px-6 max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] text-center mb-12">
          Explore Our Collections
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/shop?category=Concrete"
            className="bg-white border border-[#E5D5C3] rounded-2xl p-10 text-center hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-semibold text-[#6B4530]">
              Concrete Decor
            </h3>
            <p className="text-[#8B6F5C] mt-2">
              Handcrafted pieces with an earthy touch
            </p>
          </Link>
          <Link
            href="/shop?category=Candles"
            className="bg-white border border-[#E5D5C3] rounded-2xl p-10 text-center hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-semibold text-[#6B4530]">Candles</h3>
            <p className="text-[#8B6F5C] mt-2">
              Warm, hand-poured candles for every mood
            </p>
          </Link>
        </div>
      </section>

      {/* Brand Story Snippet */}
      <section className="bg-[#F0CBA3] py-20 px-6 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] mb-4">
          Made with heart, since June 2025
        </h2>
        <p className="text-[#8B6F5C] max-w-2xl mx-auto mb-6">
          Mitti was founded by two teenage creators, Aliza and Muniba, who
          turned their love for handmade decor into a growing small business.
        </p>
        <Link
          href="/about"
          className="text-[#6B4530] font-medium underline hover:text-[#8B6F5C]"
        >
          Read Our Story
        </Link>
      </section>
    </main>
  );
}
