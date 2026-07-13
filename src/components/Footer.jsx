import Link from "next/link";

async function getDeliveryCharge() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiUrl}/api/settings`, { cache: "no-store" });
    if (!res.ok) return 300;
    const data = await res.json();
    return data.deliveryCharge ?? 300;
  } catch {
    return 300;
  }
}

export default async function Footer() {
  const deliveryCharge = await getDeliveryCharge();

  return (
    <footer className="bg-[#6B4530] text-[#FBF3E9]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img src="/logo2.png" alt="Mitti Logo" className="h-12 mb-4 brightness-0 invert opacity-90" />
          <p className="text-sm text-[#E5D5C3] leading-relaxed max-w-xs">
            Handmade concrete and candle decor, crafted to make every space feel alive.
          </p>
        </div>

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
              <Link href="/bulk-orders" className="hover:text-white transition">
                Bulk Orders
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-[#F0CBA3] mb-4">
            Legal
          </h3>
          <ul className="space-y-2 text-sm text-[#E5D5C3]">
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-white transition">
                Return &amp; Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-[#F0CBA3] mb-4">
            Get in Touch
          </h3>
          <div className="flex gap-4 mb-5">
            <a
              href="https://www.instagram.com/mittibyalibaa?igsh=MTA1NmR0ODNvNTZ5Mg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#8B6F5C] flex items-center justify-center hover:bg-[#F0CBA3] hover:text-[#6B4530] transition"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/18Gjg5Lk47/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#8B6F5C] flex items-center justify-center hover:bg-[#F0CBA3] hover:text-[#6B4530] transition"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://wa.me/923290175894"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#8B6F5C] flex items-center justify-center hover:bg-[#F0CBA3] hover:text-[#6B4530] transition"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-[#E5D5C3]">+92 329 0175894</p>
        </div>
      </div>

      <div className="border-t border-[#8B6F5C]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#E5D5C3]">
          <p>© {new Date().getFullYear()} Mitti. All rights reserved.</p>
          <p>Delivery across Pakistan · Rs. {deliveryCharge} flat rate · 2-3 business days</p>
        </div>
      </div>
    </footer>
  );
}
