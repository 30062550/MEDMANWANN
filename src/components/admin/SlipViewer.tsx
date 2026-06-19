"use client";

import { useEffect, useState } from "react";
import { PaymentSlip } from "@/lib/types";

interface SlipWithUrl extends PaymentSlip {
  signedUrl: string | null;
}

export default function SlipViewer({ orderId }: { orderId: string }) {
  const [slips, setSlips] = useState<SlipWithUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/slips/${orderId}`)
      .then((res) => res.json())
      .then((json) => setSlips(json.slips || []))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p className="text-sm text-gray-400">กำลังโหลดสลิป...</p>;
  if (slips.length === 0) return <p className="text-sm text-gray-400">ยังไม่มีสลิปแนบมา</p>;

  return (
    <div className="space-y-3">
      {slips.map((slip) => (
        <div key={slip.id} className="border border-gray-100 bg-cream-50 rounded-lg p-3">
          {slip.signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slip.signedUrl}
              alt="สลิปการโอนเงิน"
              className="max-w-xs rounded-md border border-gray-100 mb-2"
            />
          )}
          <p className="text-xs text-gray-500">แนบสลิปเมื่อ: {slip.verify_message}</p>
        </div>
      ))}
    </div>
  );
}
