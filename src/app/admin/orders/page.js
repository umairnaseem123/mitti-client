"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const COURIERS = ["TCS", "Leopards"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Pending, unsaved edits to courier / tracking number, keyed by order ID.
  // Kept separate from the order data itself so typing a tracking number
  // doesn't trigger a save on every keystroke like the status dropdowns do.
  const [trackingEdits, setTrackingEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

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

  const getTrackingField = (order, field) => {
    const edit = trackingEdits[order._id];
    if (edit && edit[field] !== undefined) return edit[field];
    return order[field] || "";
  };

  const handleTrackingFieldChange = (orderId, field, value) => {
    setTrackingEdits((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  const handleSaveTracking = async (order) => {
    const courier = getTrackingField(order, "courier");
    const trackingNumber = getTrackingField(order, "trackingNumber");

    setSavingId(order._id);
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/orders/${order._id}`,
        { courier, trackingNumber },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Clear the pending edit for this order now that it's saved,
      // then refetch so the row reflects the confirmed server state.
      setTrackingEdits((prev) => {
        const next = { ...prev };
        delete next[order._id];
        return next;
      });
      await fetchOrders(token);
    } catch (error) {
      console.error("Error saving tracking info:", error);
      alert("Failed to save tracking info.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCopyId = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
    } catch (err) {
      console.error("Could not copy order ID:", err);
    }
  };

  // Wraps a value in quotes and escapes internal quotes, so commas/quotes
  // inside addresses or names don't break the CSV columns.
  const csvEscape = (value) => {
    const str = String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "Items",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Transaction ID",
      "Order Status",
      "Courier",
      "Tracking Number",
    ];

    const rows = orders.map((order) => {
      const itemsSummary = order.items
        .map((item) => `${item.name} x${item.qty}`)
        .join("; ");

      return [
        order._id,
        new Date(order.createdAt).toLocaleDateString("en-GB"),
        order.customer.name,
        order.customer.email,
        order.customer.phone,
        order.customer.address,
        itemsSummary,
        order.totalAmount,
        order.paymentMethod,
        order.paymentStatus,
        order.transactionId || "",
        order.orderStatus,
        order.courier || "",
        order.trackingNumber || "",
      ]
        .map(csvEscape)
        .join(",");
    });

    const csvContent = [headers.map(csvEscape).join(","), ...rows].join("\n");

    // Prefix with a BOM so Excel opens the file with correct UTF-8 encoding
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mitti-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/orders" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530]">
            Orders
          </h1>

          {!loading && orders.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#6B4530] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#8B6F5C] transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export to CSV
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-[#8B6F5C]">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const hasTrackingEdit = Boolean(trackingEdits[order._id]);
              const isSaving = savingId === order._id;

              return (
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
                        {item.name}
                        {item.color ? ` (${item.color})` : ""} x{item.qty}{" "}
                        &mdash; Rs. {item.price * item.qty}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
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

                  {/* Shipping / courier tracking — separate save action so
                      typing a tracking number doesn't fire a request on
                      every keystroke like the status dropdowns above do. */}
                  <div className="border-t border-[#E5D5C3] pt-4 flex flex-wrap items-end gap-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-[#8B6F5C]">
                        Courier:
                      </label>
                      <select
                        value={getTrackingField(order, "courier")}
                        onChange={(e) =>
                          handleTrackingFieldChange(
                            order._id,
                            "courier",
                            e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-[#E5D5C3] rounded-lg text-[#6B4530] text-sm"
                      >
                        <option value="">Select courier</option>
                        {COURIERS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm text-[#8B6F5C]">
                        Tracking #:
                      </label>
                      <input
                        type="text"
                        value={getTrackingField(order, "trackingNumber")}
                        onChange={(e) =>
                          handleTrackingFieldChange(
                            order._id,
                            "trackingNumber",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. 123456789"
                        className="px-3 py-2 border border-[#E5D5C3] rounded-lg text-[#6B4530] text-sm w-40"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveTracking(order)}
                      disabled={isSaving}
                      className="bg-[#6B4530] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
                    >
                      {isSaving
                        ? "Saving..."
                        : hasTrackingEdit
                          ? "Save Tracking"
                          : order.courier && order.trackingNumber
                            ? "Update Tracking"
                            : "Save Tracking"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
