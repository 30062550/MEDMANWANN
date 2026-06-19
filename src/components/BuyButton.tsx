"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

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
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 px-5 py-3 rounded-md border border-brand-200 text-brand-700 font-medium hover:bg-brand-50"
        >
          <ShoppingCart size={16} /> เพิ่มลงตะกร้า
        </button>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="flex-1 bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังสร้างคำสั่งซื้อ..." : "ซื้อเลย"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
