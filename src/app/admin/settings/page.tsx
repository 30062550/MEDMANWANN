import { requireAdmin } from "@/lib/admin";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-brand-800 mb-6">กำหนดค่าระบบ</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
            <Settings size={18} />
          </div>
          <p className="font-semibold text-gray-800">การตั้งค่าหลัก</p>
        </div>
        <p className="text-sm text-gray-500">
          ค่าสำคัญของระบบ เช่น อีเมลรับการแจ้งเตือน, การเชื่อมต่อ Supabase และ Resend
          ถูกตั้งไว้ผ่าน Environment Variables บน Vercel โดยตรง (ไม่ได้ตั้งในหน้านี้)
          หากต้องการเปลี่ยนแปลง ให้ไปที่ Vercel Dashboard &gt; Project Settings &gt;
          Environment Variables
        </p>
      </div>
    </div>
  );
}
