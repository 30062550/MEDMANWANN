"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { X, Plus } from "lucide-react";

export default function ProductForm({ existingProduct }: { existingProduct?: Product }) {
  const router = useRouter();
  const isEdit = !!existingProduct;

  const [title, setTitle] = useState(existingProduct?.title || "");
  const [subject, setSubject] = useState(existingProduct?.subject || "");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const [price, setPrice] = useState(existingProduct?.price?.toString() || "");

  // แยกลิงก์เดิม (คั่นด้วยขึ้นบรรทัดใหม่) กลับเป็น array ตอนโหลดฟอร์มแก้ไข
  const initialLinks = existingProduct?.file_path
    ? existingProduct.file_path.split("\n").filter((l) => l.trim())
    : [""];
  const [driveLinks, setDriveLinks] = useState<string[]>(
    initialLinks.length > 0 ? initialLinks : [""]
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLink(index: number, value: string) {
    setDriveLinks((prev) => prev.map((l, i) => (i === index ? value : l)));
  }

  function addLinkField() {
    setDriveLinks((prev) => [...prev, ""]);
  }

  function removeLinkField(index: number) {
    setDriveLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFile(file: File, type: "cover") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok) throw new Error(json.error || "อัปโหลดไฟล์ไม่สำเร็จ");
    return json;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanLinks = driveLinks.map((l) => l.trim()).filter((l) => l.length > 0);
    if (cleanLinks.length === 0) {
      setError("กรุณาใส่ลิงก์ Google Drive อย่างน้อย 1 ลิงก์");
      return;
    }

    setLoading(true);

    try {
      let coverImageUrl = existingProduct?.cover_image_url;

      if (coverFile) {
        const result = await uploadFile(coverFile, "cover");
        coverImageUrl = result.coverImageUrl;
      }

      const payload = {
        title,
        subject,
        description,
        price: parseFloat(price),
        filePath: cleanLinks.join("\n"), // รวมหลายลิงก์เป็น string เดียว คั่นด้วยขึ้นบรรทัดใหม่
        coverImageUrl,
      };

      const res = await fetch(
        isEdit ? `/api/admin/products/${existingProduct!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "บันทึกไม่สำเร็จ");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="เช่น ข้อสอบจำลอง คณิตศาสตร์ ม.6 ชุดที่ 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่/วิชา</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="เช่น แยกชุด, แยกวิชา, คู่, เซตใหญ่"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท)</label>
        <input
          type="number"
          required
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ลิงก์ Google Drive (ใส่ได้หลายลิงก์)
        </label>
        <div className="space-y-2">
          {driveLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder="https://drive.google.com/drive/folders/xxxxxxx"
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              {driveLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLinkField(index)}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 text-red-500 hover:bg-red-50"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLinkField}
          className="mt-2 flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
        >
          <Plus size={14} /> เพิ่มลิงก์
        </button>
        <p className="text-xs text-gray-400 mt-1">
          ตั้งค่าแชร์แต่ละลิงก์เป็น &quot;ทุกคนที่มีลิงก์&quot; ก่อนวางที่นี่
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รูปหน้าปก {isEdit && "— เว้นว่างถ้าไม่เปลี่ยน"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-600 border border-gray-200 rounded-md p-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
      >
        {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
      </button>
    </form>
  );
}
