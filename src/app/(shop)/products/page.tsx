import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Layers, Users2, BookOpen, Package } from "lucide-react";

export const revalidate = 0;

export default async function ProductsPage() {
  const supabase = createSupabaseServerClient();

  // ออปชั่น "ซื้อเป็นเซตใหญ่" ไม่มีลิสต์ย่อย ลิงก์ตรงไปหน้าสินค้าเลย
  const { data: bigSetProduct } = await supabase
    .from("products")
    .select("id")
    .eq("subject", "เซตใหญ่")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const methods = [
    {
      key: "by-set",
      title: "ซื้อแยกชุด",
      description: "เลือกซื้อทีละชุดข้อสอบ มี 4 แบบให้เลือก",
      icon: Layers,
      href: "/buy/by-set",
      disabled: false,
    },
    {
      key: "by-pair",
      title: "ซื้อคู่",
      description: "ซื้อเป็นคู่ในราคาพิเศษ มี 3 แบบให้เลือก",
      icon: Users2,
      href: "/buy/by-pair",
      disabled: false,
    },
    {
      key: "by-subject",
      title: "ซื้อแยกวิชา",
      description: "เลือกซื้อตามรายวิชา มี 3 แบบให้เลือก",
      icon: BookOpen,
      href: "/buy/by-subject",
      disabled: false,
    },
    {
      key: "big-set",
      title: "ซื้อเป็นเซตใหญ่",
      description: "รวมทุกอย่างในราคาคุ้มสุด",
      icon: Package,
      href: bigSetProduct ? `/products/${bigSetProduct.id}` : "#",
      disabled: !bigSetProduct,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">เลือกวิธีซื้อข้อสอบ</h1>
      <p className="text-gray-500 mt-1 mb-6">เลือกรูปแบบการซื้อที่ตรงกับความต้องการของคุณ</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <Link
              key={method.key}
              href={method.href}
              className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition ${
                method.disabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-800">{method.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                {method.disabled && (
                  <p className="text-xs text-red-500 mt-1">ยังไม่มีสินค้าในหมวดนี้</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
