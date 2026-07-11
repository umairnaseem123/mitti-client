"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await api.post("/api/subscribers", { email: email.trim() });
      setStatus("success");
      setMessage(res.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-5 py-3.5 rounded-full bg-white text-[#6B4530] placeholder-[#8B6F5C] focus:outline-none focus:ring-2 focus:ring-[#F0CBA3]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#F0CBA3] text-[#6B4530] px-7 py-3.5 rounded-full font-semibold hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === "loading" ? "Sending..." : "Subscribe"}
          {status !== "loading" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </form>

      {message && (
        <p
          className={`text-sm mt-3 ${
            status === "success" ? "text-[#F0CBA3]" : "text-red-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
