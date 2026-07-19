"use client";

import { useState } from "react";
import { Upload, X, Download } from "lucide-react";

export default function FreeTrialUploadForm({ driveLink }: { driveLink: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function handleUnlock() {
    if (files.length === 0) return;
    setUnlocked(true);
    window.open(driveLink, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-brand-800 mb-3">แนบหลักฐานการติดตาม</h3>

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-8 cursor-pointer hover:bg-cream-50 transition">
        <Upload size={24} className="text-gray-400" />
        <span className="text-sm text-gray-500">แตะเพื่อเลือกรูปภาพ (เลือกได้หลายรูป)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={src} alt={`หลักฐาน ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleUnlock}
        disabled={files.length === 0}
        className="w-full mt-5 flex items-center justify-center gap-2 bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} />
        {files.length === 0 ? "กรุณาแนบหลักฐานก่อน" : "รับไฟล์ข้อสอบฟรี"}
      </button>

      {unlocked && (
        <p className="text-sm text-green-600 mt-3 text-center">
          เปิดลิงก์ไฟล์ข้อสอบให้แล้ว หากไม่ขึ้นหน้าต่างใหม่ อาจถูกเบราว์เซอร์บล็อก
          กด{" "}
          
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            ที่นี่
          </a>{" "}
          เพื่อเปิดอีกครั้ง
        </p>
      )}
    </div>
  );
}
