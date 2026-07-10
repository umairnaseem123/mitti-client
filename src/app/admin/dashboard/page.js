"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchStats(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async (token) => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/api/products"),
        api.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const orders = ordersRes.data;
      const pending = orders.filter((o) => o.orderStatus === "pending").length;
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: orders.length,
        pendingOrders: pending,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mitti_admin_token");
    localStorage.removeItem("mitti_admin_name");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5D5C3] p-6 hidden md:block">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#6B4530] mb-1">
          Mitti Admin
        </h2>
        <p className="text-sm text-[#8B6F5C] mb-8">Hi, {adminName}</p>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded-lg bg-[#F0CBA3] text-[#6B4530] font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition"
          >
            Orders
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2 rounded-lg text-[#6B4530] hover:bg-[#F0CBA3] transition"
          >
            Settings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 text-sm text-[#C1653A] underline"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Dashboard Overview
        </h1>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Products</p>
              <p className="text-3xl font-semibold text-[#6B4530]">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-semibold text-[#6B4530]">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
              {/* Renamed from "Pending Orders" â€” this tracks shipping status
                  (orderStatus), not payment status, so the old label was
                  easy to misread as "orders awaiting payment." */}
              <p className="text-[#8B6F5C] text-sm mb-2">Awaiting Shipment</p>
              <p className="text-3xl font-semibold text-[#6B4530]">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-semibold text-[#6B4530]">
                Rs. {stats.totalRevenue}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
