"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout failed.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "14px 22px",
          background: "#236b52",
          color: "white",
          border: 0,
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        {loading ? "Opening Stripe..." : "Upgrade to FRAMEWORK Pro — $5"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
