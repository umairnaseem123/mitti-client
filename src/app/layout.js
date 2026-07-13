import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://mitti-client.vercel.app"),
  title: {
    default: "Mitti | Handmade Gifts & Decor",
    template: "%s | Mitti",
  },
  description:
    "Handmade concrete decor and candles crafted in Pakistan. Unique home decor, wedding favors, and corporate gifts by Aliza & Muniba. Free shipping on online payments.",
  keywords: [
    "handmade candles Pakistan",
    "concrete decor Pakistan",
    "handmade gifts Karachi",
    "wedding favors Pakistan",
    "corporate gifts Pakistan",
    "home decor Pakistan",
  ],
  openGraph: {
    title: "Mitti | Handmade Gifts & Decor",
    description:
      "Handmade concrete decor and candles crafted in Pakistan. Where every space feels alive.",
    url: "https://mitti-client.vercel.app",
    siteName: "Mitti",
    images: [
      {
        url: "/logo2.png",
        width: 800,
        height: 800,
        alt: "Mitti - Handmade Gifts & Decor",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitti | Handmade Gifts & Decor",
    description: "Handmade concrete decor and candles crafted in Pakistan.",
    images: ["/logo2.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} bg-[#FBF3E9]`}>
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
