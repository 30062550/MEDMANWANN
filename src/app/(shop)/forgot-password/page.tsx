"use client";
import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <h2 className="text-xl font-bold text-brand-800 mb-2">ส่งลิงก์แล้ว</h2>
        <p className="text-gray-600">
          กรุณาตรวจสอบอีเมลของคุณ แล้วกดลิงก์เพื่อตั้งรหัสผ่านใหม่
        </p>
        <Link href="/login" className="text-brand-700 font-medium mt-4 inline-block">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
      <h1 className="text-xl font-bold text-brand-800 mb-2">ลืมรหัสผ่าน</h1>
      <p className="text-sm text-gray-500 mb-6">
        กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        <Link href="/login" className="text-brand-700 font-medium">
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
