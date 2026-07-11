"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminSubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSubscribers(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscribers = async (token) => {
    setLoading(true);
    try {
      const res = await api.get("/api/subscribers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribers(res.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this email from the subscriber list?")) return;
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.delete(`/api/subscribers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribers(subscribers.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subscriber:", err);
      alert("Failed to remove subscriber.");
    }
  };

  const handleCopyAll = () => {
    const allEmails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(allEmails);
    alert("All emails copied to clipboard!");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5D5C3] p-6 hidden md:block">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
          Mitti Admin
        </h2>
        <nav className="space-y-2 mt-8">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Products
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Orders
          </Link>
          <Link href="/admin/subscribers" className="block px-4 py-2 rounded-lg bg-[#F0CBA3] text-[#6B4530] font-medium">
            Subscribers
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530]">
              Subscribers
            </h1>
            {!loading && subscribers.length > 0 && (
              <p className="text-sm text-[#8B6F5C] mt-1">
                {subscribers.length}{" "}
                {subscribers.length === 1 ? "email" : "emails"} collected
              </p>
            )}
          </div>
          {!loading && subscribers.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="bg-[#6B4530] text-white px-6 py-2 rounded-full font-medium hover:bg-[#8B6F5C] transition text-sm"
            >
              Copy All Emails
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading subscribers...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : subscribers.length === 0 ? (
          <p className="text-[#8B6F5C]">
            No subscribers yet. Emails collected from the homepage
            newsletter form will show up here.
          </p>
        ) : (
          <div className="bg-white rounded-lg border border-[#E5D5C3] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#F0CBA3] text-[#6B4530]">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Subscribed On</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s._id} className="border-t border-[#E5D5C3]">
                    <td className="px-4 py-3 text-[#6B4530] font-medium">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-[#8B6F5C] text-sm">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 underline hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
