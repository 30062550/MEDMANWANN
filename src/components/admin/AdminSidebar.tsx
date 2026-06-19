"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  ClipboardList,
  UserCircle,
  Settings,
  ArrowLeftRight,
} from "lucide-react";

const mainNav = [
  { href: "/admin", label: "แดชบอร์ด", icon: LayoutGrid },
  { href: "/admin/products", label: "คลังสินค้า", icon: Package },
  { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ClipboardList },
];

const settingsNav = [
  { href: "/admin/profile", label: "โปรไฟล์", icon: UserCircle },
  { href: "/admin/settings", label: "กำหนดค่าระบบ", icon: Settings },
];

export default function AdminSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  }

  return (
    <aside className="w-60 shrink-0 bg-cream-100 border-r border-cream-200 min-h-screen flex flex-col">
      <div className="p-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
          <Package size={16} />
        </div>
        <span className="font-extrabold text-brand-800">MEDMANWANN</span>
      </div>

      <nav className="px-3 mt-2 flex-1">
        <ul className="space-y-1">
          {mainNav.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? "bg-brand-700 text-white font-medium"
                    : "text-gray-600 hover:bg-cream-200"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs text-gray-400 mt-6 mb-2 px-3">ตั้งค่า</p>
        <ul className="space-y-1">
          {settingsNav.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive(href)
                    ? "bg-brand-700 text-white font-medium"
                    : "text-gray-600 hover:bg-cream-200"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-cream-200">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:bg-cream-200 rounded-lg mb-2"
        >
          <ArrowLeftRight size={14} /> กลับไปหน้าร้านค้า
        </Link>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {userEmail ? userEmail[0].toUpperCase() : "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">ทีมผู้ดูแลระบบ</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
