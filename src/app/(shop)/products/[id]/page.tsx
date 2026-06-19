import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { formatTHB } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import BuyButton from "@/components/BuyButton";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single<Product>();

  if (!product) notFound();

  const { data: userData } = await supabase.auth.getUser();
  const isFree = Number(product.price) === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        <div className="relative w-full aspect-[3/4] sm:aspect-square bg-brand-50 rounded-xl overflow-hidden">
          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              ไม่มีรูปตัวอย่าง
            </div>
          )}
          <span className="absolute top-3 left-3 bg-accent-300 text-brand-900 text-xs font-semibold px-2 py-1 rounded">
            Hot Deal
          </span>
        </div>

        <div>
          {product.subject && (
            <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              {product.subject}
            </span>
          )}
          <h1 className="text-2xl font-bold text-brand-800 mt-2">{product.title}</h1>
          <p className="text-gray-600 mt-3 whitespace-pre-line">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            {isFree ? (
              <span className="text-3xl font-bold text-accent-500">ฟรี</span>
            ) : (
              <span className="text-3xl font-bold text-accent-500">
                {formatTHB(product.price)}
              </span>
            )}
          </div>

          <div className="mt-6">
            <BuyButton productId={product.id} isLoggedIn={!!userData.user} />
          </div>

          <div className="mt-6 bg-cream-100 border border-cream-200 rounded-lg p-4 text-sm text-gray-600">
            <p className="font-medium text-brand-800 mb-1">วิธีรับไฟล์</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>กดสั่งซื้อ ระบบจะสร้างคำสั่งซื้อพร้อมเลขที่อ้างอิง</li>
              <li>โอนเงินตามยอดที่ระบุ แล้วอัปโหลดสลิปในหน้าคำสั่งซื้อ</li>
              <li>แอดมินตรวจสอบสลิปและยืนยันการชำระเงิน (ปกติไม่เกิน 24 ชม.)</li>
              <li>เมื่อยืนยันสำเร็จ ดาวน์โหลดไฟล์ได้ทันทีในหน้าคลังข้อสอบของฉัน</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
