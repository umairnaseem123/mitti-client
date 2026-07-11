"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar({ adminName }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("mitti_admin_token");
    localStorage.removeItem("mitti_admin_name");
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-[#E5D5C3] px-4 py-3 sticky top-0 z-40">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#6B4530]">
          Mitti Admin
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="text-[#6B4530] p-2"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, static on desktop */}
      <aside
        className={`
          bg-white border-r border-[#E5D5C3] p-6 w-64
          fixed md:static top-0 left-0 h-full z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-1 md:block">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530]">
            Mitti Admin
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-[#6B4530] p-1"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <p className="text-sm text-[#8B6F5C] mb-8">Hi, {adminName}</p>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg font-medium transition ${
                pathname === item.href
                  ? "bg-[#F0CBA3] text-[#6B4530]"
                  : "text-[#6B4530] hover:bg-[#F0CBA3]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 text-sm text-[#C1653A] underline"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
