import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "Mitti | Handmade Gifts & Decor",
  description:
    "Where every space feels alive. Handmade concrete and candle decor by Aliza & Muniba.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} bg-[#FBF3E9]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
