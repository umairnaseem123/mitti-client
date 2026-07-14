"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setAdminName(localStorage.getItem("mitti_admin_name") || "Admin");
    fetchCoupons(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCoupons = async (token) => {
    setLoading(true);
    try {
      const res = await api.get("/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.code.trim() || !form.discountValue) {
      setError("Please enter a code and discount value.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.post(
        "/api/coupons",
        {
          code: form.code.trim(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
          expiresAt: form.expiresAt || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setForm(emptyForm);
      fetchCoupons(token);
    } catch (err) {
      console.error("Error creating coupon:", err);
      setError(err.response?.data?.message || "Failed to create coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        `/api/coupons/${coupon._id}`,
        { isActive: !coupon.isActive },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCoupons(token);
    } catch (err) {
      console.error("Error updating coupon:", err);
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!confirm("Delete this coupon? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.delete(`/api/coupons/${couponId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCoupons(token);
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar adminName={adminName} />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Coupons
        </h1>

        <div className="bg-white border border-[#E5D5C3] rounded-2xl p-6 mb-8 max-w-xl">
          <h2 className="font-medium text-[#6B4530] mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="code"
              placeholder="Coupon Code (e.g. EID10)"
              value={form.code}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm uppercase"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
              <input
                type="number"
                name="discountValue"
                placeholder={
                  form.discountType === "percentage" ? "e.g. 10" : "e.g. 200"
                }
                value={form.discountValue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#8B6F5C] mb-1">
                  Min. Order Amount (optional)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  placeholder="e.g. 1000"
                  value={form.minOrderAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8B6F5C] mb-1">
                  Expires On (optional)
                </label>
                <input
                  type="date"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-[#E5D5C3] rounded-lg text-[#6B4530] bg-[#FBF3E9] text-sm"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#6B4530] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#8B6F5C] transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>

        <h2 className="font-medium text-[#6B4530] mb-4">All Coupons</h2>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-[#8B6F5C]">No coupons yet.</p>
        ) : (
          <div className="space-y-3">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white border border-[#E5D5C3] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-semibold text-[#6B4530]">
                      {coupon.code}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        coupon.isActive
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-[#8B6F5C] mt-1">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% off`
                      : `Rs. ${coupon.discountValue} off`}
                    {coupon.minOrderAmount > 0 &&
                      ` \u2022 Min order Rs. ${coupon.minOrderAmount}`}
                    {coupon.expiresAt &&
                      ` \u2022 Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(coupon)}
                    className="text-sm px-4 py-2 rounded-full border border-[#E5D5C3] text-[#6B4530] hover:bg-[#FBF3E9] transition"
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
