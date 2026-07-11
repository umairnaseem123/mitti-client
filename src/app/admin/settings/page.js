"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [codExtraCharge, setCodExtraCharge] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(300);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("mitti_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/settings");
      setTaxPercentage(res.data.taxPercentage || 0);
      setCodExtraCharge(res.data.codExtraCharge || 0);
      setDeliveryCharge(
        res.data.deliveryCharge !== undefined ? res.data.deliveryCharge : 300,
      );
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("mitti_admin_token");
      await api.put(
        "/api/settings",
        {
          taxPercentage: Number(taxPercentage),
          codExtraCharge: Number(codExtraCharge),
          deliveryCharge: Number(deliveryCharge),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E9] flex">
      <AdminSidebar active="/admin/settings" />

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 max-w-xl">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-8">
          Settings
        </h1>

        {loading ? (
          <p className="text-[#8B6F5C]">Loading settings...</p>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-white border border-[#E5D5C3] rounded-2xl p-8 space-y-6"
          >
            <div>
              <label className="block text-[#6B4530] font-medium mb-2">
                Delivery Charge (Rs.)
              </label>
              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                min="0"
                className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530]"
              />
              <p className="text-sm text-[#8B6F5C] mt-1">
                Flat shipping charge applied to every order, regardless of
                payment method.
              </p>
            </div>

            <div>
              <label className="block text-[#6B4530] font-medium mb-2">
                Tax Percentage (%)
              </label>
              <input
                type="number"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530]"
              />
              <p className="text-sm text-[#8B6F5C] mt-1">
                Applied to every order&apos;s subtotal at checkout.
              </p>
            </div>

            <div>
              <label className="block text-[#6B4530] font-medium mb-2">
                Cash on Delivery Extra Charge (Rs.)
              </label>
              <input
                type="number"
                value={codExtraCharge}
                onChange={(e) => setCodExtraCharge(e.target.value)}
                min="0"
                className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530]"
              />
              <p className="text-sm text-[#8B6F5C] mt-1">
                Additional charge applied only when customer selects COD.
              </p>
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bg-[#6B4530] text-white px-8 py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
