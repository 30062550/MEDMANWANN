"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderReviewActions({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    setLoading(null);

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "approve" ? "กำลังอนุมัติ..." : "อนุมัติ (ปลดล็อกไฟล์)"}
      </button>
      <button
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-sm hover:bg-red-100 disabled:opacity-50"
      >
        {loading === "reject" ? "กำลังปฏิเสธ..." : "ปฏิเสธสลิป"}
      </button>
    </div>
  );
}
