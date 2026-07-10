export default function Contact() {
  return (
    <main className="bg-[#FBF3E9]">
      <section className="bg-[#F0CBA3] py-20 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Get in Touch
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Contact Us
        </h1>
      </section>

      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <p className="text-[#8B6F5C] text-lg mb-16 max-w-md mx-auto leading-relaxed">
          We&apos;d love to hear from you. Reach out through any of the platforms below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <a
            href="https://www.instagram.com/mittibyalibaa?igsh=MTA1NmR0ODNvNTZ5Mg=="
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#E5D5C3] rounded-2xl px-6 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C1653A]"
          >
            <div className="w-14 h-14 rounded-full bg-[#FBF3E9] flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#F0CBA3]">
              <svg
                className="w-6 h-6 text-[#6B4530]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#6B4530] mb-1 tracking-wide">
              Instagram
            </h3>
            <p className="text-[#8B6F5C] text-sm">@mittibyalibaa</p>
          </a>

          <a
            href="https://www.facebook.com/share/18Gjg5Lk47/"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#E5D5C3] rounded-2xl px-6 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C1653A]"
          >
            <div className="w-14 h-14 rounded-full bg-[#FBF3E9] flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#F0CBA3]">
              <svg
                className="w-6 h-6 text-[#6B4530]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#6B4530] mb-1 tracking-wide">
              Facebook
            </h3>
            <p className="text-[#8B6F5C] text-sm">Mitti</p>
          </a>

          <a
            href="https://wa.me/923290175894"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-[#E5D5C3] rounded-2xl px-6 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#C1653A]"
          >
            <div className="w-14 h-14 rounded-full bg-[#FBF3E9] flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#F0CBA3]">
              <svg
                className="w-6 h-6 text-[#6B4530]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#6B4530] mb-1 tracking-wide">
              WhatsApp
            </h3>
            <p className="text-[#8B6F5C] text-sm">+92 329 0175894</p>
          </a>
        </div>
      </section>
    </main>
  );
}
