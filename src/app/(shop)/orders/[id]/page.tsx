import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order, Product } from "@/lib/types";
import { formatTHB, formatDateTH, ORDER_STATUS_LABEL } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import SlipUploadForm from "@/components/SlipUploadForm";
import DownloadButton from "@/components/DownloadButton";

export const revalidate = 0;

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect(`/login?next=/orders/${params.id}`);
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, product:products(*)")
    .eq("id", params.id)
    .single<Order & { product: Product }>();

  if (!order) notFound();

  const statusInfo = ORDER_STATUS_LABEL[order.status];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-brand-800">คำสั่งซื้อ {order.order_no}</h1>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>สินค้า: {order.product?.title}</p>
          <p>
            ยอดที่ต้องชำระ:{" "}
            <span className="font-semibold text-accent-500">{formatTHB(order.amount)}</span>
          </p>
          <p>วันที่สั่งซื้อ: {formatDateTH(order.created_at)}</p>
        </div>
      </div>

      {(order.status === "pending_payment" || order.status === "rejected") && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-brand-800 mb-3">ข้อมูลการโอนเงิน</h3>
          <div className="bg-cream-100 rounded-lg p-4 text-sm text-gray-700 space-y-1">
            <p>ธนาคาร: กสิกรไทย</p>
            <p>เลขที่บัญชี: XXX-X-XXXXX-X</p>
            <p>ชื่อบัญชี: บริษัท ตัวอย่าง จำกัด</p>
            <p className="text-brand-700 font-semibold mt-2">
              ยอดที่ต้องโอน: {formatTHB(order.amount)}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            *แก้ไขเลขบัญชีจริงในไฟล์ src/app/orders/[id]/page.tsx หรือทำเป็นรูป QR พร้อมเพย์ก็ได้
          </p>
        </div>
      )}

      {(order.status === "pending_payment" ||
        order.status === "pending_review" ||
        order.status === "rejected") && <SlipUploadForm orderId={order.id} />}

      {order.status === "pending_review" && (
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 text-sm text-accent-600">
          แอดมินกำลังตรวจสอบสลิปของคุณ จะได้รับอีเมลแจ้งผลเมื่อตรวจสอบเสร็จ
        </div>
      )}

      {order.status === "paid" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-green-700 font-medium mb-3">
            ชำระเงินสำเร็จ เมื่อ {order.paid_at ? formatDateTH(order.paid_at) : "-"}
          </p>
          <DownloadButton orderId={order.id} />
        </div>
      )}
    </div>
  );
}
