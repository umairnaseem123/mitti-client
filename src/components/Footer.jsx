import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#6B4530] text-[#FBF3E9]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <img src="/logo2.png" alt="Mitti Logo" className="h-12 mb-4 brightness-0 invert opacity-90" />
          <p className="text-sm text-[#E5D5C3] leading-relaxed max-w-xs">
            Handmade concrete and candle decor, crafted to make every space feel alive.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-[#F0CBA3] mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[#E5D5C3]">
            <li>
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h3 className="text-sm uppercase tracking-widest text-[#F0CBA3] mb-4">
            Get in Touch
          </h3>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/mittibyalibaa?igsh=MTA1NmR0ODNvNTZ5Mg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <defs>
                  <radialGradient id="igGradient" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#FFDD55" />
                    <stop offset="10%" stopColor="#FFDD55" />
                    <stop offset="50%" stopColor="#FF543E" />
                    <stop offset="100%" stopColor="#C837AB" />
                  </radialGradient>
                </defs>
                <rect width="48" height="48" rx="12" fill="url(#igGradient)" />
                <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="white" strokeWidth="2.2" />
                <circle cx="24" cy="24" r="6.5" fill="none" stroke="white" strokeWidth="2.2" />
                <circle cx="32" cy="16" r="1.6" fill="white" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/share/18Gjg5Lk47/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <circle cx="24" cy="24" r="24" fill="#1877F2" />
                <path
                  d="M27.5 24.5h4l.6-4.4h-4.6v-2.8c0-1.27.35-2.14 2.18-2.14h2.33V11.2c-.4-.05-1.79-.17-3.4-.17-3.37 0-5.67 2.06-5.67 5.83v3.25H19v4.4h3.94V37h4.56V24.5z"
                  fill="white"
                />
              </svg>
            </a>

            <a
              href="https://wa.me/923290175894"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 hover:scale-110 transition-transform"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <circle cx="24" cy="24" r="24" fill="#25D366" />
                <path
                  d="M32.94 15.02A11.82 11.82 0 0 0 24.02 11c-6.56 0-11.9 5.32-11.9 11.88 0 2.1.55 4.14 1.6 5.95L12 37l8.35-1.68a11.9 11.9 0 0 0 3.66.58h.01c6.56 0 11.9-5.32 11.9-11.88a11.8 11.8 0 0 0-3-7.99zM24.02 34.1a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.86 9.86 0 0 1-1.5-5.27c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.79 9.79 0 0 1 2.9 6.98c0 5.45-4.44 9.92-9.89 9.92zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.19.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#8B6F5C]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#E5D5C3]">
          <p>© {new Date().getFullYear()} Mitti. All rights reserved.</p>
          <p>Delivery across Pakistan · Rs. 300 flat rate · 2-3 business days</p>
        </div>
      </div>
    </footer>
  );
}
