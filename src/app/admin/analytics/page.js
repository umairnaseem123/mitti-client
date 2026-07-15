"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const COLORS = ["#C1653A", "#D9B48A", "#6B4530"];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchAnalytics(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async (token) => {
    try {
      const res = await api.get("/api/orders/analytics/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/analytics" adminName={adminName} />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Sales Analytics
        </h1>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading analytics...</p>
        ) : !data ? (
          <p className="text-red-600">Could not load analytics.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
                <p className="text-[#8B6F5C] text-sm mb-2">Total Orders</p>
                <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                  {data.totalOrders}
                </p>
              </div>
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-4 md:p-6">
                <p className="text-[#8B6F5C] text-sm mb-2">Total Revenue</p>
                <p className="text-2xl md:text-3xl font-semibold text-[#6B4530]">
                  Rs. {data.totalRevenue}
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 mb-8">
              <h2 className="font-medium text-[#6B4530] mb-4">
                Revenue by Month (Last 6 Months)
              </h2>
              {data.revenueByMonth.length === 0 ? (
                <p className="text-[#8B6F5C] text-sm">No order data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C3" />
                    <XAxis dataKey="month" stroke="#8B6F5C" fontSize={12} />
                    <YAxis stroke="#8B6F5C" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5D5C3",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6B4530"
                      strokeWidth={2}
                      dot={{ fill: "#C1653A" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
                <h2 className="font-medium text-[#6B4530] mb-4">
                  Best-Selling Products
                </h2>
                {data.topProducts.length === 0 ? (
                  <p className="text-[#8B6F5C] text-sm">No sales data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5D5C3" />
                      <XAxis type="number" stroke="#8B6F5C" fontSize={12} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#8B6F5C"
                        fontSize={11}
                        width={110}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5D5C3",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="qty" fill="#C1653A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6">
                <h2 className="font-medium text-[#6B4530] mb-4">
                  Order Status Breakdown
                </h2>
                {data.statusBreakdown.every((s) => s.count === 0) ? (
                  <p className="text-[#8B6F5C] text-sm">No order data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data.statusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {data.statusBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5D5C3",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
