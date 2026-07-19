"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Profile } from "@/lib/types";
import { User } from "lucide-react";

const DEK_OPTIONS = ["dek69", "dek70", "dek71", "dek72", "other"];

export default function ProfileEditForm({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [dekYear, setDekYear] = useState(profile?.dek_year || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await fetch("/api/account/upload-avatar", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "อัปโหลดรูปไม่สำเร็จ");
        finalAvatarUrl = json.avatarUrl;
        setAvatarUrl(finalAvatarUrl);
      }

      const res = await fetch("/api/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          dekYear,
          avatarUrl: finalAvatarUrl || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "บันทึกไม่สำเร็จ");

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white rounded-xl border border-gray-100 shadow-sm p-6"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-brand-50 border border-gray-200">
          {avatarPreview || avatarUrl ? (
            <Image
              src={avatarPreview || avatarUrl}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-300">
              <User size={36} />
            </div>
          )}
        </div>
        <label className="text-sm text-brand-600 hover:underline cursor-pointer">
          เปลี่ยนรูปโปรไฟล์
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
        <input
          type="text"
          value={email}
          disabled
          className="w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-50 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="ชื่อ-นามสกุล"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="เช่น medman_user"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นปี / รหัส Dek</label>
        <select
          value={dekYear}
          onChange={(e) => setDekYear(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          <option value="">เลือกชั้นปี</option>
          {DEK_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">บันทึกข้อมูลสำเร็จ</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
      >
        {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </button>
    </form>
  );
}
