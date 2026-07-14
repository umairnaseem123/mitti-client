"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchOrders(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async (token) => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/orders/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders(token);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/orders/${orderId}`,
        { paymentStatus: newPaymentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchOrders(token);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status.");
    }
  };

  const handleCopyId = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
    } catch (err) {
      console.error("Could not copy order ID:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/orders" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Orders
        </h1>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#8B6F5C]">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-[#E5D5C3] rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-[#6B4530] font-mono font-medium">
                        {order._id}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopyId(order._id)}
                        aria-label="Copy order ID"
                        className="text-[#8B6F5C] hover:text-[#6B4530] transition"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      </button>
                    </div>
                    <p className="font-semibold text-[#6B4530]">
                      {order.customer.name}
                    </p>
                    <p className="text-sm text-[#8B6F5C]">
                      {order.customer.email} &bull; {order.customer.phone}
                    </p>
                    <p className="text-sm text-[#8B6F5C]">
                      {order.customer.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#6B4530]">
                      Rs. {order.totalAmount}
                    </p>
                    <p className="text-sm text-[#8B6F5C] uppercase">
                      {order.paymentMethod} &bull; {order.paymentStatus}
                    </p>
                    {order.transactionId && (
                      <p className="text-xs text-[#8B6F5C] mt-1">
                        TXN: {order.transactionId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#E5D5C3] pt-4 mb-4">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-[#6B4530]">
                      {item.name} x{item.qty} &mdash; Rs.{" "}
                      {item.price * item.qty}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-[#8B6F5C]">
                      Order Status:
                    </label>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="px-3 py-2 border border-[#E5D5C3] rounded-lg text-[#6B4530] text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  {order.paymentMethod !== "cod" && (
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-[#8B6F5C]">
                        Payment Status:
                      </label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                          order.paymentStatus === "paid"
                            ? "border-green-300 text-green-700 bg-green-50"
                            : order.paymentStatus === "failed"
                              ? "border-red-300 text-red-700 bg-red-50"
                              : "border-[#E5D5C3] text-[#6B4530]"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

