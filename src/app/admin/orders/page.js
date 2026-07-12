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
      console.error("Error updating order:", error);
      alert("Failed to update order status.");
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

                <div className="flex items-center gap-3">
                  <label className="text-sm text-[#8B6F5C]">Status:</label>
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
