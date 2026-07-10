export default function About() {
  return (
    <main className="bg-[#FBF3E9]">
      {/* Header Section */}
      <section className="bg-[#F0CBA3] py-20 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Our Story
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          From Soil to Soul
        </h1>
      </section>

      {/* Story Content */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#6B4530] text-lg leading-relaxed mb-6">
          Mitti began in June 2025, founded by two teenage creators —
          <span className="font-semibold"> Aliza</span> and{" "}
          <span className="font-semibold">Muniba</span> — who turned their
          shared love for handmade art into a small business rooted in
          creativity and care.
        </p>
        <p className="text-[#6B4530] text-lg leading-relaxed mb-6">
          What started as a simple idea grew into a collection of handcrafted
          concrete decor and hand-poured candles, each piece shaped with the
          same intention: to bring warmth and character into every space they
          touch.
        </p>
        <p className="text-[#6B4530] text-lg leading-relaxed mb-6">
          Every product is made by hand, with an eye for detail and a heart
          for the craft. From soil to soul, Mitti is a reminder that beauty
          often begins with the simplest materials — and a lot of love.
        </p>
      </section>

      {/* Where to find us */}
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#6B4530] mb-4">
          Find Us
        </h2>
        <p className="text-[#8B6F5C] max-w-xl mx-auto">
          We currently operate through Instagram, Facebook, and WhatsApp —
          bringing our handmade pieces directly to you, one order at a time.
        </p>
      </section>
    </main>
  );
}
