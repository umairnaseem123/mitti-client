import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Product fetch failed");

    const product = await res.json();

    return {
      title: `${product.name} | Mitti Handmade Gifts`,
      description: product.description
        ? product.description.slice(0, 160)
        : "Handmade concrete decor and candles from Mitti.",
      openGraph: {
        title: product.name,
        description: product.description
          ? product.description.slice(0, 160)
          : undefined,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch (err) {
    return {
      title: "Product | Mitti Handmade Gifts",
      description: "Handmade concrete decor and candles.",
    };
  }
}

export default function ProductPage() {
  return <ProductDetailClient />;
}

