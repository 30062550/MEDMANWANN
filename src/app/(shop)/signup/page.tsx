"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  if (password.length < 8) {
    setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
    return;
  }

  setLoading(true);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  setLoading(false);
  if (error) {
    setError(error.message);
    return;
  }
  setDone(true);
}

  if (done) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <h2 className="text-xl font-bold text-brand-800 mb-2">สมัครสมาชิกสำเร็จ</h2>
        <p className="text-gray-600">
          กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันการสมัครสมาชิก ก่อนเข้าสู่ระบบ
        </p>
        <Link href="/login" className="text-brand-700 font-medium mt-4 inline-block">
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
      <h1 className="text-xl font-bold text-brand-800 mb-6">สมัครสมาชิก</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </div>

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

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
  <input
    type="password"
    required
    minLength={8}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
  />
  <p className="text-xs text-gray-400 mt-1">รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
</div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-brand-700 font-medium">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
