import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";

export const revalidate = 0;

const FREE_TRIAL_LINK = "https://drive.google.com/drive/folders/xxxxxxx"; // <-- ใส่ลิงก์ Google Drive ของชุดทดลอง
const FREE_TRIAL_COVER = ""; // <-- ใส่ URL รูปปกของชุดทดลอง (ถ้ามี)

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
      key: "big-set",
      title: "MAXMANWANN (แถมข้อสอบเชื่อมโยง 1 ชุด)",
      description:
        'ได้ข้อสอบครบ 4 ชุด 3 วิชา รวม 12 ฉบับ แถมฟรีข้อสอบเชื่อมโยง "ชุดมันลูกคุณหนูติดแกลม" สุดหิน',
      price: 319,
      coverImage: "",
      href: bigSetProduct ? `/products/${bigSetProduct.id}` : "#",
      disabled: !bigSetProduct,
    },
    {
      key: "by-set",
      title: "เลือกซื้อ 1 ชุดใดก็ได้",
      description:
        "ได้ข้อสอบ 1 ชุด ครบทั้ง 3 วิชา ได้แก่ เชาวน์ปัญญา จริยธรรมทางการแพทย์ และเชื่อมโยง วิชาละ 1 ฉบับ",
      price: 105,
      coverImage: "",
      href: "/buy/by-set",
      disabled: false,
    },
    {
      key: "by-subject",
      title: "เลือกซื้อ 1 วิชาใดก็ได้",
      description:
        "ได้ข้อสอบ 1 วิชา ครบ 4 ฉบับจากชุดมันปิ้ง, ชุดมันเผา, ชุดมันเชื่อม และชุดมันหนึบ",
      price: 140,
      coverImage: "",
      href: "/buy/by-subject",
      disabled: false,
    },
    {
      key: "by-pair",
      title: "เลือกซื้อ 2 วิชาใดก็ได้",
      description:
        "ได้ข้อสอบ 2 วิชา วิชาละ 4 ฉบับจากชุดมันปิ้ง, ชุดมันเผา, ชุดมันเชื่อม และชุดมันหนึบ",
      price: 269,
      coverImage: "",
      href: "/buy/by-pair",
      disabled: false,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">เลือกวิธีซื้อข้อสอบ</h1>
      <p className="text-gray-500 mt-1 mb-6">เลือกรูปแบบการซื้อที่ตรงกับความต้องการของคุณ</p>

      <a
        href={FREE_TRIAL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
      >
        <div className="relative w-24 h-20 sm:w-28 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-cream-100">
          {FREE_TRIAL_COVER ? (
            <Image src={FREE_TRIAL_COVER} alt="FREE! ข้อสอบชุดทดลอง" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              ไม่มีรูป
            </div>
          )}
          <span className="absolute top-1 left-1 bg-brand-700 text-white text-[10px] px-1.5 py-0.5 rounded">
            Free
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-brand-800">FREE! ข้อสอบชุดทดลอง</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            ลองทำความรู้จัก Mock TPAT1 by MEDMANWANN ได้เลย ฟรี! ไม่มีค่าใช้จ่าย
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="font-bold text-accent-500">ฟรี</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 whitespace-nowrap">
            <Download size={14} /> ดาวน์โหลดเลย
          </span>
        </div>
      </a>

      <div className="grid sm:grid-cols-2 gap-5">
        {methods.map((method) => (
          <Link
            key={method.key}
            href={method.href}
            className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition ${
              method.disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="relative w-full aspect-[4/3] bg-cream-100">
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
