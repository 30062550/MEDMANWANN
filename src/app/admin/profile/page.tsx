import { requireAdmin } from "@/lib/admin";
import { UserCircle } from "lucide-react";

export default async function AdminProfilePage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-brand-800 mb-6">โปรไฟล์ผู้ดูแลระบบ</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
          <UserCircle size={28} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{auth.user.email}</p>
          <p className="text-sm text-gray-500">ผู้ดูแลระบบ</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        ส่วนแก้ไขข้อมูลโปรไฟล์เพิ่มเติม (เปลี่ยนรหัสผ่าน, ชื่อแสดงผล) จะมาในอัปเดตถัดไป
      </p>
    </div>
  );
}
