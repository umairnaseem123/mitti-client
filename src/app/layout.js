import "./globals.css";
import Script from "next/script";
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
      {/* suppressHydrationWarning here only: browser extensions like
          Grammarly inject attributes (data-gr-ext-installed, etc.) into
          <body> before React hydrates, which was triggering Next.js's
          full-screen dev error overlay on every page load and silently
          blocking clicks underneath it (that's why the wishlist heart
          button appeared to do nothing on /shop). This tells React to
          ignore attribute mismatches on this one element without
          disabling hydration warnings anywhere else in the app. */}
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} bg-[#FBF3E9]`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N00D0R0S75"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N00D0R0S75');
          `}
        </Script>

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1019721567646041');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1019721567646041&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
