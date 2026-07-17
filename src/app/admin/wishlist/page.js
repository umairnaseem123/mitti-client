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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      const sorted = [...res.data].sort(
        (a, b) => (b.wishlistCount || 0) - (a.wishlistCount || 0),
      );
      setProducts(sorted);
      // Leads live on a per-product endpoint (GET /api/products/:id/wishlist-entries),
      // so we fetch one per wishlisted product and merge the results.
      fetchLeads(sorted);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLeadsLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (productList) => {
    setLeadsLoading(true);
    setLeadsError("");
    try {
      const candidates = productList.filter((p) => (p.wishlistCount || 0) > 0);
      const results = await Promise.all(
        candidates.map((p) =>
          api
            .get(`/api/products/${p._id}/wishlist-entries`)
            .then((res) =>
              res.data.map((entry) => ({ ...entry, productName: p.name })),
            )
            .catch((err) => {
              console.error(`Error fetching wishlist entries for ${p.name}:`, err);
              return [];
            }),
        ),
      );
      const merged = results
        .flat()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLeads(merged);
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
          See which products customers are saving for later, and the
          customers who left their contact details.
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
