"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyButton({
  productId,
  isLoggedIn,
}: {
  productId: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push(`/login?next=/products/${productId}`);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "เกิดข้อผิดพลาด");
      return;
    }

    router.push(`/orders/${json.orderId}`);
  }

return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800 disabled:opacity-50"
      >
        {loading ? "กำลังสร้างคำสั่งซื้อ..." : "ซื้อเลย"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
