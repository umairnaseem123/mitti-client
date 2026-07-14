"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const helpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const stored = JSON.parse(localStorage.getItem("mitti_cart") || "[]");
      const totalItems = stored.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalItems);
    };

    // Initial load
    updateCartCount();

    // Listen for cart changes dispatched from anywhere in the app
    window.addEventListener("cartUpdated", updateCartCount);
    // Also catch cross-tab changes
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const stored = JSON.parse(localStorage.getItem("mitti_wishlist") || "[]");
      setWishlistCount(stored.length);
    };

    updateWishlistCount();

    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("storage", updateWishlistCount);

    return () => {
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("storage", updateWishlistCount);
    };
  }, []);

  return (
    <nav className="bg-[#F0CBA3] border-b border-[#D9B48A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" onClick={() => setMenuOpen(false)}>
        <img src="/logo2.png" alt="Mitti Logo" className="h-14" />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[#6B4530] font-medium">
        <Link href="/" className="hover:text-[#8B6F5C] transition">
          Home
        </Link>
        <Link href="/shop" className="hover:text-[#8B6F5C] transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-[#8B6F5C] transition">
          About Us
        </Link>
        <Link href="/bulk-orders" className="hover:text-[#8B6F5C] transition">
          Bulk Orders
        </Link>
        <Link href="/contact" className="hover:text-[#8B6F5C] transition">
          Contact
        </Link>
        <Link href="/track-order" className="hover:text-[#8B6F5C] transition">
          Track Order
        </Link>

        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="flex items-center gap-1 hover:text-[#8B6F5C] transition"
            aria-expanded={helpOpen}
            aria-haspopup="true"
          >
            Help
            <svg
              className={`w-3.5 h-3.5 transition-transform ${helpOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {helpOpen && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-[#E5D5C3] overflow-hidden">
              <a
                href="https://wa.me/923290175894?text=Hi%20Mitti%2C%20I%27d%20like%20to%20track%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHelpOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#6B4530] hover:bg-[#F0CBA3]/40 transition"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.88.525 3.638 1.436 5.135L2 22l4.995-1.312A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12.001 2zm0 18.001a7.96 7.96 0 01-4.276-1.24l-.307-.183-3.006.79.803-2.933-.2-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8.001-8 4.411 0 8 3.589 8 8s-3.589 8.001-8 8.001z" />
                </svg>
                Track my order
              </a>

              <Link
                href="/contact"
                onClick={() => setHelpOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#6B4530] hover:bg-[#F0CBA3]/40 transition border-t border-[#F0E4D3]"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                Shipping info
              </Link>

              <Link
                href="/contact"
                onClick={() => setHelpOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#6B4530] hover:bg-[#F0CBA3]/40 transition border-t border-[#F0E4D3]"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                Contact us
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <Link
          href="/wish-list"
          className="relative flex items-center gap-2 text-[#6B4530] font-medium hover:text-[#8B6F5C] transition"
        >
          <div className="relative">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Wishlist</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-[#6B4530] font-medium hover:text-[#8B6F5C] transition"
        >
          <div className="relative">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Cart</span>
        </Link>

        <button
          className="md:hidden text-[#6B4530]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#F0CBA3] flex flex-col gap-4 p-6 md:hidden border-t border-[#D9B48A] text-[#6B4530] font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <Link href="/bulk-orders" onClick={() => setMenuOpen(false)}>
            Bulk Orders
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/track-order" onClick={() => setMenuOpen(false)}>
            Track Order
          </Link>
          <Link href="/wish-list" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>

          <div className="pt-2 mt-2 border-t border-[#D9B48A] flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-[#8B6F5C]">
              Help
            </span>
            <a
              href="https://wa.me/923290175894?text=Hi%20Mitti%2C%20I%27d%20like%20to%20track%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Track my order
            </a>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Shipping info
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
