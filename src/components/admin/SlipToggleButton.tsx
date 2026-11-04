"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SlipViewer from "@/components/admin/SlipViewer";

export default function SlipToggleButton({
  orderId,
  orderNo,
}: {
  orderId: string;
  orderNo: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1 rounded-md border border-gray-200 text-brand-700 hover:bg-brand-50 whitespace-nowrap"
      >
        ดูสลิป
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[85vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-brand-800">สลิป {orderNo}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิด"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <SlipViewer orderId={orderId} />
          </div>
        </div>
      )}
    </>
  );
}
