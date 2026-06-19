"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadButton({
  orderId,
  compact = false,
}: {
  orderId: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/files/download?orderId=${orderId}`);
    const json = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(json.error || "ดาวน์โหลดไม่สำเร็จ");
      return;
    }

    window.location.href = json.url;
  }

  if (compact) {
    return (
      <div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-brand-700 text-white text-xs font-medium hover:bg-brand-800 disabled:opacity-50 whitespace-nowrap"
        >
          <Download size={14} />
          {loading ? "กำลังโหลด..." : "ดาวน์โหลดไฟล์"}
        </button>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800 disabled:opacity-50"
      >
        <Download size={18} />
        {loading ? "กำลังเตรียมไฟล์..." : "ดาวน์โหลดไฟล์ข้อสอบ"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
