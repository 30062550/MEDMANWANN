import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { formatTHB } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

const METHOD_MAP: Record<string, { subject: string; title: string; description: string }> = {
  "by-set": {
    subject: "แยกชุด",
    title: "ซื้อแยกชุด",
    description: "เลือกซื้อทีละชุดข้อสอบ",
  },
  "by-pair": {
    subject: "คู่",
    title: "ซื้อคู่",
    description: "ซื้อเป็นคู่ในราคาพิเศษ",
  },
  "by-subject": {
    subject: "แยกวิชา",
    title: "ซื้อแยกวิชา",
    description: "เลือกซื้อตามรายวิชา",
  },
};

export default async function PurchaseMethodPage({ params }: { params: { method: string } }) {
  const methodInfo = METHOD_MAP[params.method];
  if (!methodInfo) notFound();

  const supabase = createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("subject", methodInfo.subject)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const typedProducts = (products as Product[] | null) || [];

  return (
    <div>
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline mb-4"
      >
        <ArrowLeft size={16} /> กลับไปเลือกวิธีซื้อ
      </Link>

      <h1 className="text-2xl font-bold text-brand-800">{methodInfo.title}</h1>
      <p className="text-gray-500 mt-1 mb-6">{methodInfo.description}</p>

      {typedProducts.length === 0 && (
        <p className="text-gray-500">ยังไม่มีสินค้าในหมวดนี้</p>
      )}

      <div className="space-y-4">
        {typedProducts.map((product) => {
          const isFree = Number(product.price) === 0;
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition"
            >
              <Link
                href={`/products/${product.id}`}
                className="relative w-24 h-20 sm:w-28 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-cream-100"
              >
                {product.cover_image_url ? (
                  <Image
                    src={product.cover_image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    ไม่มีรูป
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-brand-800 hover:text-brand-600 truncate">
                    {product.title}
                  </h3>
                </Link>
                {product.description && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="font-bold text-accent-500">
                  {isFree ? "ฟรี" : formatTHB(product.price)}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 whitespace-nowrap"
                >
                  <ShoppingCart size={14} /> เลือกซื้อเลย
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
