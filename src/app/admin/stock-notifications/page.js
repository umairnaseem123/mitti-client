"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminStockNotificationsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [tab, setTab] = useState("pending"); // "pending" | "completed"

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchEntries(token, tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchEntries = async (token, status) => {
    setLoading(true);
    try {
      const res = await api.get("/api/stock-notifications", {
        params: { status },
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching stock notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotified = async (id) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/stock-notifications/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error marking as notified:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Group entries by product so the admin can see all interested customers
  // for the same product together.
  const grouped = entries.reduce((acc, entry) => {
    const key = entry.product?._id || "unknown";
    if (!acc[key]) {
      acc[key] = { product: entry.product, requests: [] };
    }
    acc[key].requests.push(entry);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/stock-notifications" adminName={adminName} />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-1">
          Restock Requests
        </h1>
        <p className="text-sm text-[#8B6F5C] mb-6">
          Customers who asked to be notified when an out-of-stock product is
          available again.
        </p>

        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={`px-5 py-2 rounded-full font-medium text-sm transition ${
              tab === "pending"
                ? "bg-[#6B4530] text-white"
                : "bg-white border border-[#E5D5C3] text-[#6B4530]"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setTab("completed")}
            className={`px-5 py-2 rounded-full font-medium text-sm transition ${
              tab === "completed"
                ? "bg-[#6B4530] text-white"
                : "bg-white border border-[#E5D5C3] text-[#6B4530]"
            }`}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-[#8B6F5C]">
            {tab === "pending"
              ? "No pending restock requests."
              : "No completed requests yet."}
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map(({ product, requests }) => (
              <div
                key={product?._id || Math.random()}
                className="bg-white border border-[#E5D5C3] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0CBA3] flex items-center justify-center flex-shrink-0">
                    {product?.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#8B6F5C]">No img</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#6B4530]">
                      {product?.name || "Unknown product"}
                    </p>
                    <p className="text-xs text-[#8B6F5C]">
                      Current stock: {product?.stock ?? "\u2014"} &bull;{" "}
                      {requests.length}{" "}
                      {requests.length === 1 ? "request" : "requests"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {requests.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between bg-[#FBF3E9] border border-[#E5D5C3] rounded-lg px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm text-[#6B4530] font-medium">
                          {entry.name}
                        </p>
                        <p className="text-xs text-[#8B6F5C]">{entry.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {tab === "pending" ? (
                          <>
                            <a
                              href={`https://wa.me/${entry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hi ${entry.name}! Good news — "${product?.name}" is back in stock on Mitti. Would you like to order?`,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-[#25D366] hover:underline"
                            >
                              WhatsApp
                            </a>
                            <button
                              type="button"
                              onClick={() => handleMarkNotified(entry._id)}
                              disabled={updatingId === entry._id}
                              className="text-xs font-medium text-[#6B4530] border border-[#E5D5C3] rounded-full px-3 py-1.5 hover:bg-white transition disabled:opacity-50"
                            >
                              {updatingId === entry._id ? "..." : "Mark Done"}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                            Notified {"\u2713"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
