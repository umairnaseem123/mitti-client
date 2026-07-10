"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#F0CBA3] border-b border-[#D9B48A] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" onClick={() => setMenuOpen(false)}>
        <img src="/logo2.png" alt="Mitti Logo" className="h-14" />
      </Link>

      <div className="hidden md:flex gap-8 text-[#6B4530] font-medium">
        <Link href="/" className="hover:text-[#8B6F5C] transition">
          Home
        </Link>
        <Link href="/shop" className="hover:text-[#8B6F5C] transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-[#8B6F5C] transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-[#8B6F5C] transition">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-[#6B4530] font-medium hover:text-[#8B6F5C] transition"
        >
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
          <span className="hidden sm:inline">Cart</span>
        </Link>

        <button
          className="md:hidden text-[#6B4530]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
