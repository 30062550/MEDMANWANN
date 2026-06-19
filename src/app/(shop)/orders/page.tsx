import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order, Product } from "@/lib/types";
import { formatDateTH } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText, Clock } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";

export const revalidate = 0;

export default async function OrdersListPage() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login?next=/orders");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, product:products(*)")
    .order("created_at", { ascending: false });

  const typedOrders = (orders as (Order & { product: Product })[] | null) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">คลังข้อสอบของฉัน</h1>
      <p className="text-gray-500 mt-1 mb-6">
        เข้าถึงข้อสอบและเอกสารที่คุณซื้อไว้ทั้งหมดได้ที่นี่
      </p>

      {typedOrders.length === 0 && (
        <p className="text-gray-500">คุณยังไม่มีคำสั่งซื้อ</p>
      )}

      <div className="space-y-4">
        {typedOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
          >
            <Link
              href={`/orders/${order.id}`}
              className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-cream-100"
            >
              {order.product?.cover_image_url ? (
                <Image
                  src={order.product.cover_image_url}
                  alt={order.product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileText size={20} />
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/orders/${order.id}`}>
                <p className="font-semibold text-brand-800 hover:text-brand-600 truncate">
                  {order.product?.title}
                </p>
              </Link>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {formatDateTH(order.created_at)}
                </span>
                <span>PDF</span>
              </p>
            </div>

            <div className="shrink-0">
              {order.status === "paid" && <DownloadButton orderId={order.id} compact />}

              {order.status === "pending_review" && (
                <span className="text-xs px-3 py-2 rounded-md bg-accent-100 text-accent-600 font-medium whitespace-nowrap">
                  รอตรวจสอบสลิป
                </span>
              )}

              {(order.status === "pending_payment" || order.status === "rejected") && (
                <Link
                  href={`/orders/${order.id}`}
                  className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 font-medium whitespace-nowrap hover:bg-gray-50"
                >
                  ดำเนินการต่อ
                </Link>
              )}

              {order.status === "cancelled" && (
                <span className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-400 font-medium whitespace-nowrap">
                  ยกเลิกแล้ว
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
