import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { formatTHB } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";

export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createSupabaseServerClient();

  let query = supabase.from("products").select("*").eq("is_active", true);

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }

  const { data: products, error } = await query.order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">Exam List</h1>
      <p className="text-gray-500 mt-1 mb-6">รายการข้อสอบทั้งหมดที่จำหน่าย</p>

      <form className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q || ""}
            placeholder="ค้นหา..."
            className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
        >
          ค้นหาเลย
        </button>
      </form>

      {error && (
        <p className="text-red-600">เกิดข้อผิดพลาดในการโหลดสินค้า: {error.message}</p>
      )}

      {!error && (!products || products.length === 0) && (
        <p className="text-gray-500">ไม่พบสินค้าที่ค้นหา</p>
      )}

      <div className="space-y-4">
        {(products as Product[] | null)?.map((product) => {
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
                {isFree && (
                  <span className="absolute top-1 left-1 bg-brand-700 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Free
                  </span>
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
