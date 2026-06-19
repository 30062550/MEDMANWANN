import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, Bell } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    if (auth.status === 401) {
      redirect("/login?next=/admin");
    }
    // ล็อกอินแล้วแต่ไม่ใช่แอดมิน
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <AdminSidebar userEmail={auth.user.email ?? null} />

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-cream-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="relative w-72 hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาคำสั่งซื้อ, ผู้ใช้..."
              className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-cream-100 text-gray-500">
            <Bell size={18} />
          </button>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
