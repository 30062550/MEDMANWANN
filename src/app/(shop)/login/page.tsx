"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
      <h1 className="text-xl font-bold text-brand-800 mb-6">เข้าสู่ระบบ</h1>

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

        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
  <input
    type="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-300"
  />
  <div className="text-right mt-1">
    <Link href="/forgot-password" className="text-xs text-brand-700 hover:underline">
      ลืมรหัสผ่าน?
    </Link>
  </div>
</div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-700 text-white rounded-md py-2.5 font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="text-brand-700 font-medium">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}
