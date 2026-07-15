"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminWishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      const sorted = [...res.data].sort(
        (a, b) => (b.wishlistCount || 0) - (a.wishlistCount || 0),
      );
      setProducts(sorted);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalWishlists = products.reduce(
    (sum, p) => sum + (p.wishlistCount || 0),
    0,
  );
  const wishlistedProducts = products.filter((p) => (p.wishlistCount || 0) > 0);

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/wishlist" adminName={adminName} />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-1">
          Wishlist Insights
        </h1>
        <p className="text-sm text-[#8B6F5C] mb-8">
          See which products customers are saving for later. Wishlists are
          anonymous, so this shows demand per product, not individual
          customers.
        </p>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
                <p className="text-[#8B6F5C] text-sm mb-2">Total Wishlists</p>
                <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                  {totalWishlists}
                </p>
              </div>
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
                <p className="text-[#8B6F5C] text-sm mb-2">Products Wishlisted</p>
                <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                  {wishlistedProducts.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
                <p className="text-[#8B6F5C] text-sm mb-2">Most Wanted</p>
                <p className="text-lg md:text-xl font-semibold text-[#6B4530] truncate">
                  {wishlistedProducts[0]?.name || "\u2014"}
                </p>
              </div>
            </div>

            {wishlistedProducts.length === 0 ? (
              <p className="text-[#8B6F5C]">
                No products have been wishlisted yet.
              </p>
            ) : (
              <div className="bg-white rounded-lg border border-[#E5D5C3] overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-[#F0CBA3] text-[#6B4530]">
                    <tr>
                      <th className="px-4 py-3">Image</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Wishlists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistedProducts.map((p) => (
                      <tr key={p._id} className="border-t border-[#E5D5C3]">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0CBA3] flex items-center justify-center">
                            {p.images && p.images[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-[#8B6F5C]">No img</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6B4530] font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-[#6B4530]">{p.category}</td>
                        <td className="px-4 py-3 text-[#6B4530]">Rs. {p.price}</td>
                        <td className="px-4 py-3 text-[#6B4530]">{p.stock}</td>
                        <td className="px-4 py-3">
                          <span className="bg-[#F0CBA3] text-[#6B4530] font-semibold text-sm px-2.5 py-1 rounded-full">
                            {p.wishlistCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
