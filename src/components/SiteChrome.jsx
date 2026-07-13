"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children, footer }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && footer}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}
