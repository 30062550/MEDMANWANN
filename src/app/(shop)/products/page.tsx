import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

export default async function ProductsPage() {
  const supabase = createSupabaseServerClient();

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
      title: "เลือกซื้อ 1 ชุดใดก็ได้",
      description:
        "ได้ข้อสอบ 1 ชุด ครบทั้ง 3 วิชา ได้แก่ เชาวน์ปัญญา จริยธรรมทางการแพทย์ และเชื่อมโยง วิชาละ 1 ฉบับ",
      price: 105,
      coverImage: "", // <-- ใส่ URL รูปปกตรงนี้
      href: "/buy/by-set",
      disabled: false,
    },
    {
      key: "by-subject",
      title: "เลือกซื้อ 1 วิชาใดก็ได้",
      description:
        "ได้ข้อสอบ 1 วิชา ครบ 4 ฉบับจากชุดมันปิ้ง, ชุดมันเผา, ชุดมันเชื่อม และชุดมันหนึบ",
      price: 140,
      coverImage: "", // <-- ใส่ URL รูปปกตรงนี้
      href: "/buy/by-subject",
      disabled: false,
    },
    {
      key: "by-pair",
      title: "เลือกซื้อ 2 วิชาใดก็ได้",
      description:
        "ได้ข้อสอบ 2 วิชา วิชาละ 4 ฉบับจากชุดมันปิ้ง, ชุดมันเผา, ชุดมันเชื่อม และชุดมันหนึบ",
      price: 269,
      coverImage: "", // <-- ใส่ URL รูปปกตรงนี้
      href: "/buy/by-pair",
      disabled: false,
    },
    {
      key: "big-set",
      title: "MAXMANWANN (แถมข้อสอบเชื่อมโยง 1 ชุด)",
      description:
        'ได้ข้อสอบครบ 4 ชุด 3 วิชา รวม 12 ฉบับ แถมฟรีข้อสอบเชื่อมโยง "ชุดมันลูกคุณหนูติดแกลม" สุดหิน',
      price: 319,
      coverImage: "", // <-- ใส่ URL รูปปกตรงนี้
      href: bigSetProduct ? `/products/${bigSetProduct.id}` : "#",
      disabled: !bigSetProduct,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">รายการข้อสอบที่จำหน่าย</h1>
      <p className="text-gray-500 mt-1 mb-6">เลือกวิธีการซื้อได้เลย</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {methods.map((method) => (
          <Link
            key={method.key}
            href={method.href}
            className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition ${
              method.disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="relative w-full aspect-video bg-cream-100">
              {method.coverImage ? (
                <Image
                  src={method.coverImage}
                  alt={method.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  ไม่มีรูปปก
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-brand-800">{method.title}</h3>
                <span className="shrink-0 font-bold text-accent-500 whitespace-nowrap">
                  ฿{method.price}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1.5">{method.description}</p>
              {method.disabled && (
                <p className="text-xs text-red-500 mt-2">ยังไม่มีสินค้าในหมวดนี้</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
