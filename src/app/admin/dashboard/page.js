"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

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

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/dashboard" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#8B6F5C] mb-8">Hi, {adminName}</p>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Products</p>
              <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                {stats.totalProducts}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Orders</p>
              <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Awaiting Shipment</p>
              <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
              <p className="text-[#8B6F5C] text-sm mb-2">Total Revenue</p>
              <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                Rs. {stats.totalRevenue}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
