"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
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
      const products = productsRes.data;
      const orders = ordersRes.data;
      const pending = orders.filter((o) => o.orderStatus === "pending").length;
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pending,
        totalRevenue: revenue,
      });

      setLowStockProducts(
        products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD),
      );
      setOutOfStockProducts(products.filter((p) => p.stock <= 0));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasStockAlerts =
    lowStockProducts.length > 0 || outOfStockProducts.length > 0;

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
          <>
            {hasStockAlerts && (
              <div className="bg-white border border-red-200 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <h2 className="font-semibold text-[#6B4530]">Stock Alerts</h2>
                </div>

                {outOfStockProducts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-red-600 uppercase mb-1.5">
                      Out of Stock ({outOfStockProducts.length})
                    </p>
                    <div className="space-y-1">
                      {outOfStockProducts.map((p) => (
                        <Link
                          key={p._id}
                          href={`/admin/products/edit/${p._id}`}
                          className="flex items-center justify-between text-sm hover:bg-[#FBF3E9] rounded-lg px-3 py-2 transition"
                        >
                          <span className="text-[#6B4530]">{p.name}</span>
                          <span className="text-red-600 font-medium">0 left</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {lowStockProducts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#C1653A] uppercase mb-1.5">
                      Running Low ({lowStockProducts.length})
                    </p>
                    <div className="space-y-1">
                      {lowStockProducts.map((p) => (
                        <Link
                          key={p._id}
                          href={`/admin/products/edit/${p._id}`}
                          className="flex items-center justify-between text-sm hover:bg-[#FBF3E9] rounded-lg px-3 py-2 transition"
                        >
                          <span className="text-[#6B4530]">{p.name}</span>
                          <span className="text-[#C1653A] font-medium">
                            {p.stock} left
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
          </>
        )}
      </main>
    </div>
  );
}
