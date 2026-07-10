import Link from "next/link";

export default function About() {
  return (
    <main className="bg-[#FBF3E9]">
      {/* Hero Section */}
      <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Mitti handmade craft"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3D2417]/80 via-[#3D2417]/55 to-[#3D2417]/85"></div>

        <div className="relative z-10 text-center px-6">
          <p className="text-sm tracking-[0.2em] text-[#F0CBA3] mb-4 uppercase font-medium">
            Our Story
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-white">
            From Soil to Soul
          </h1>
        </div>
      </section>

      {/* Values strip */}
      <section className="bg-[#6B4530] py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            Founded June 2025
          </p>
          <span className="hidden sm:inline text-[#8B6F5C]">•</span>
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            100% Handmade
          </p>
          <span className="hidden sm:inline text-[#8B6F5C]">•</span>
          <p className="text-[#F0CBA3] text-sm tracking-wide uppercase">
            Small-Batch Crafted
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-[#E5D5C3] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-[#F0CBA3] text-[#6B4530] flex items-center justify-center mx-auto mb-5 font-[family-name:var(--font-playfair)] text-2xl">
              A
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
              Aliza
            </h3>
            <p className="text-sm text-[#8B6F5C] uppercase tracking-wide">
              Co-Founder
            </p>
          </div>
          <div className="bg-white border border-[#E5D5C3] rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-[#F0CBA3] text-[#6B4530] flex items-center justify-center mx-auto mb-5 font-[family-name:var(--font-playfair)] text-2xl">
              M
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
              Muniba
            </h3>
            <p className="text-sm text-[#8B6F5C] uppercase tracking-wide">
              Co-Founder
            </p>
          </div>
        </div>

        {/* Story Content */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#6B4530] text-lg leading-relaxed mb-6">
            Mitti began in June 2025, founded by two teenage creators —{" "}
            <span className="font-semibold">Aliza</span> and{" "}
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
          <p className="text-[#6B4530] text-lg leading-relaxed">
            Every product is made by hand, with an eye for detail and a heart
            for the craft. From soil to soul, Mitti is a reminder that beauty
            often begins with the simplest materials — and a lot of love.
          </p>
        </div>
      </section>

      {/* Find Us */}
      <section className="bg-[#F0CBA3] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] text-[#8B6F5C] uppercase mb-3">
            Stay Connected
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#6B4530] mb-6">
            Find Us
          </h2>
          <p className="text-[#6B4530]/80 text-lg leading-relaxed mb-9">
            We currently operate through Instagram, Facebook, and WhatsApp —
            bringing our handmade pieces directly to you, one order at a time.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/mittibyalibaa?igsh=MTA1NmR0ODNvNTZ5Mg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white text-[#6B4530] flex items-center justify-center hover:bg-[#6B4530] hover:text-white transition-colors shadow-sm"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/18Gjg5Lk47/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white text-[#6B4530] flex items-center justify-center hover:bg-[#6B4530] hover:text-white transition-colors shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://wa.me/923290175894"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white text-[#6B4530] flex items-center justify-center hover:bg-[#6B4530] hover:text-white transition-colors shadow-sm"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
              </svg>
            </a>
          </div>

          <Link
            href="/shop"
            className="inline-block mt-10 bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#5a3826] transition-colors"
          >
            Shop Our Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
