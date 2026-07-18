# Run this from D:\mitti-website\client
# Fixes: customer /wishlist page had gotten overwritten with the admin
# wishlist code. This restores the correct file in each location.

$customerWishlistPath = "src\app\wishlist\page.js"
$adminWishlistPath = "src\app\admin\wishlist\page.js"

# 1. Customer-facing wishlist page (correct content)
$customerWishlistContent = @'
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
    window.addEventListener("wishlistUpdated", loadWishlist);
    return () => window.removeEventListener("wishlistUpdated", loadWishlist);
  }, []);

  const loadWishlist = () => {
    const stored = JSON.parse(localStorage.getItem("mitti_wishlist") || "[]");
    setWishlist(stored);
  };

  const removeItem = (productId) => {
    const updated = wishlist.filter((item) => item.productId !== productId);
    setWishlist(updated);
    localStorage.setItem("mitti_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="bg-[#FBF3E9] min-h-screen">
      <section className="bg-[#F0CBA3] py-16 px-6 text-center">
        <p className="text-sm tracking-widest text-[#8B6F5C] mb-3 uppercase">
          Saved For Later
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#6B4530]">
          Wishlist
        </h1>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8B6F5C] text-lg mb-6">
              Your wishlist is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-[#E5D5C3] rounded-2xl overflow-hidden flex flex-col"
              >
                <Link href={`/product/${item.productId}`}>
                  <div className="relative aspect-square bg-[#F0CBA3] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-[#6B4530] font-bold text-sm md:text-base leading-snug line-clamp-1 hover:underline">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[#6B4530] font-semibold text-sm md:text-base mt-1.5">
                    Rs. {item.price}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-[#C1653A] text-xs underline mt-3 text-left"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
'@

# 2. Admin wishlist insights page (the code you pasted earlier - moved here)
$adminWishlistContent = @'
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

  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState("");
  const [leadSearch, setLeadSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchProducts();
    fetchLeads();
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

  const fetchLeads = async () => {
    setLeadsError("");
    try {
      const res = await api.get("/api/wishlist");
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setLeads(sorted);
    } catch (err) {
      console.error("Error fetching wishlist leads:", err);
      setLeadsError("Could not load wishlist contacts.");
    } finally {
      setLeadsLoading(false);
    }
  };

  const totalWishlists = products.reduce(
    (sum, p) => sum + (p.wishlistCount || 0),
    0,
  );
  const wishlistedProducts = products.filter((p) => (p.wishlistCount || 0) > 0);

  const filteredLeads = leadSearch.trim()
    ? leads.filter((lead) => {
        const q = leadSearch.trim().toLowerCase();
        return (
          lead.name?.toLowerCase().includes(q) ||
          lead.phone?.toLowerCase().includes(q) ||
          lead.productName?.toLowerCase().includes(q)
        );
      })
    : leads;

  const formatDate = (dateStr) => {
    if (!dateStr) return "\u2014";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "\u2014";
    }
  };

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
              <p className="text-[#8B6F5C] mb-12">
                No products have been wishlisted yet.
              </p>
            ) : (
              <div className="bg-white rounded-lg border border-[#E5D5C3] overflow-x-auto mb-12">
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
                  Wishlist Contacts
                </h2>
                <p className="text-sm text-[#8B6F5C]">
                  Customers who left their name and phone number when they
                  added a product to their wishlist.
                </p>
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or product..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full md:w-72 px-4 py-2 rounded-full border border-[#E5D5C3] bg-white text-[#6B4530] text-sm focus:outline-none focus:ring-2 focus:ring-[#C1653A]"
              />
            </div>

            {leadsLoading ? (
              <p className="text-[#8B6F5C]">Loading contacts...</p>
            ) : leadsError ? (
              <p className="text-red-600">{leadsError}</p>
            ) : filteredLeads.length === 0 ? (
              <p className="text-[#8B6F5C]">
                {leadSearch
                  ? "No contacts match your search."
                  : "No wishlist contacts yet."}
              </p>
            ) : (
              <div className="bg-white rounded-lg border border-[#E5D5C3] overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-[#F0CBA3] text-[#6B4530]">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, i) => (
                      <tr key={lead._id || i} className="border-t border-[#E5D5C3]">
                        <td className="px-4 py-3 text-[#6B4530] font-medium">
                          {lead.name}
                        </td>
                        <td className="px-4 py-3 text-[#6B4530]">
                          <a
                            href={`tel:${lead.phone}`}
                            className="hover:text-[#C1653A] transition"
                          >
                            {lead.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-[#6B4530]">
                          {lead.productName || "\u2014"}
                        </td>
                        <td className="px-4 py-3 text-[#8B6F5C] text-sm">
                          {formatDate(lead.createdAt)}
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
'@

if (-not (Test-Path "src\app")) {
    Write-Host "ERROR: 'src\app' not found. Run this script from D:\mitti-website\client" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path (Split-Path $customerWishlistPath) | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $adminWishlistPath) | Out-Null

Set-Content -Path $customerWishlistPath -Value $customerWishlistContent -Encoding UTF8
Write-Host "Fixed: $customerWishlistPath (customer wishlist restored)" -ForegroundColor Green

Set-Content -Path $adminWishlistPath -Value $adminWishlistContent -Encoding UTF8
Write-Host "Fixed: $adminWishlistPath (admin wishlist insights restored)" -ForegroundColor Green

Write-Host "`nDone! Restart your dev server and hard-refresh the browser." -ForegroundColor Cyan
