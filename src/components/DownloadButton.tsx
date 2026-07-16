"use client";
import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";

export default function DownloadButton({
  orderId,
  compact = false,
}: {
  orderId: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<string[] | null>(null);

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
    if (json.links.length === 1) {
      window.open(json.links[0], "_blank", "noopener,noreferrer");
      return;
    }
    setLinks(json.links);
  }

  const buttonClass = compact
    ? "flex items-center gap-1.5 px-3 py-2 rounded-md bg-brand-700 text-white text-xs font-medium hover:bg-brand-800 disabled:opacity-50 whitespace-nowrap"
    : "w-full flex items-center justify-center gap-2 bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800 disabled:opacity-50";

  return (
    <div>
      <button onClick={handleDownload} disabled={loading} className={buttonClass}>
        <Download size={compact ? 14 : 18} />
        {loading ? "กำลังโหลด..." : "ดาวน์โหลดไฟล์ข้อสอบ"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {links && links.length > 1 && (
        <div className="mt-2 space-y-1">
          {links.map((url, i) => (
            
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-brand-700 hover:underline"
            >
              <ExternalLink size={14} /> ไฟล์ที่ {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
