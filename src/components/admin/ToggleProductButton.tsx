"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ToggleProductButton({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <a
        href={`/admin/products/${productId}/edit`}
        className="text-brand-600 hover:underline"
      >
        แก้ไข
      </a>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="text-gray-500 hover:underline disabled:opacity-50"
      >
        {isActive ? "ปิดการขาย" : "เปิดขายอีกครั้ง"}
      </button>
    </div>
  );
}
