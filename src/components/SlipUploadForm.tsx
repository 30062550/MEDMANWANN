"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SlipUploadForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("file", file);

    const res = await fetch("/api/slips/verify", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setResult({ status: "error", message: json.error || "เกิดข้อผิดพลาด" });
      return;
    }

    setResult({ status: json.status, message: json.message });
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-gray-100 shadow-sm p-5 bg-white">
      <h3 className="font-semibold text-brand-800 mb-3">แจ้งสลิปการโอนเงิน</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-600 border border-gray-200 rounded-md p-2"
        />
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            result.status === "pending_review"
              ? "bg-accent-50 text-accent-600"
              : "bg-red-50 text-red-800"
          }`}
        >
          {result.status === "pending_review" &&
            "อัปโหลดสลิปสำเร็จ แอดมินจะตรวจสอบและยืนยันการชำระเงินให้เร็วที่สุด"}
          {result.status === "error" && result.message}
          {result.status !== "pending_review" && result.status !== "error" && (
            <span>{result.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
