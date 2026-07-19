import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Home, FileText, FolderOpen, Search, ShoppingCart, User, MessageCircle } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = !!profile?.is_admin;
  }
  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-extrabold text-lg text-brand-700 tracking-tight shrink-0">
          MEDMANWANN
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="flex items-center gap-1.5 hover:text-brand-600">
            <Home size={16} /> หน้าแรก
          </Link>
          <Link href="/products" className="flex items-center gap-1.5 hover:text-brand-600">
            <FileText size={16} /> รายการข้อสอบ
          </Link>
          {user && (
            <Link href="/orders" className="flex items-center gap-1.5 hover:text-brand-600">
              <FolderOpen size={16} /> คลังข้อสอบของฉัน
            </Link>
          )}
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-brand-600">
            <MessageCircle size={16} /> ติดต่อเรา
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-brand-700 font-medium hover:text-brand-800"
            >
              แดชบอร์ดแอดมิน
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/products"
            aria-label="ค้นหา"
            className="p-2 rounded-full text-gray-500 hover:bg-cream-100 hidden sm:inline-flex"
          >
            <Search size={18} />
          </Link>
          {user && (
            <Link
              href="/orders"
              aria-label="คลังข้อสอบของฉัน"
              className="p-2 rounded-full text-gray-500 hover:bg-cream-100 relative"
            >
              <ShoppingCart size={18} />
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline text-sm text-gray-500">{user.email}</span>
              <Link
                href="/profile"
                aria-label="โปรไฟล์"
                className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center hover:bg-brand-200"
              >
                <User size={16} />
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-cream-100 text-sm"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-md bg-brand-700 text-white hover:bg-brand-800 text-sm font-medium"
              >
                สร้างบัญชีใหม่
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
