"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      localStorage.setItem("mitti_admin_token", res.data.token);
      localStorage.setItem("mitti_admin_name", res.data.name);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FBF3E9] min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-[#E5D5C3] rounded-2xl p-10">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#6B4530] mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-[#8B6F5C] text-center mb-8">Mitti Dashboard Access</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#E5D5C3] rounded-lg text-[#6B4530]"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4530] text-white py-3 rounded-full font-medium hover:bg-[#8B6F5C] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
