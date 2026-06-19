"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginBox({ isLoggedIn }: { isLoggedIn: boolean }) {
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

  if (isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
          <LogIn size={24} />
        </div>
        <p className="font-semibold text-brand-800">ยินดีต้อนรับกลับมา</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">เริ่มเลือกซื้อข้อสอบได้เลย</p>
        <Link
          href="/products"
          className="px-5 py-2 rounded-full bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
        >
          ไปหน้ารายการข้อสอบ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-2">
          <LogIn size={20} />
        </div>
        <h2 className="font-bold text-brand-800">เข้าสู่ระบบ</h2>
        <p className="text-xs text-gray-400 mt-1 text-center">
          กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <input
          type="password"
          required
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-700 text-white rounded-md py-2 text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-4 text-center">
        ยังไม่มีบัญชี MEDMANWANN?{" "}
        <Link href="/signup" className="text-brand-700 font-medium">
          สร้างบัญชีใหม่
        </Link>
      </p>
    </div>
  );
}
