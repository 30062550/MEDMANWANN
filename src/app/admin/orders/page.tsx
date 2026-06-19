import { requireAdmin } from "@/lib/admin";
import { Order, Product } from "@/lib/types";
import { formatTHB, formatDateTH, ORDER_STATUS_LABEL } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import SlipViewer from "@/components/admin/SlipViewer";
import OrderReviewActions from "@/components/admin/OrderReviewActions";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  const { data: orders } = await auth.supabase
    .from("orders")
    .select("*, product:products(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  const typedOrders = (orders as (Order & { product: Product })[] | null) || [];
  const needsReview = typedOrders.filter((o) => o.status === "pending_review");
  const others = typedOrders.filter((o) => o.status !== "pending_review");

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-800 mb-6">คำสั่งซื้อทั้งหมด</h1>

      {needsReview.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 font-semibold text-accent-600 mb-3">
            <AlertTriangle size={18} /> รอตรวจสอบสลิปด้วยมือ ({needsReview.length})
          </h2>
          <div className="space-y-4">
            {needsReview.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-accent-200 shadow-sm p-5"
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {order.order_no} — {order.product?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTHB(order.amount)} · {formatDateTH(order.created_at)}
                    </p>
                  </div>
                  <OrderReviewActions orderId={order.id} />
                </div>
                <SlipViewer orderId={order.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-semibold text-gray-700 mb-3">คำสั่งซื้อล่าสุด</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">เลขที่ออเดอร์</th>
              <th className="px-4 py-3">สินค้า</th>
              <th className="px-4 py-3">ยอดเงิน</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">วันที่</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {others.map((order) => {
              const statusInfo = ORDER_STATUS_LABEL[order.status];
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-gray-800">{order.order_no}</td>
                  <td className="px-4 py-3">{order.product?.title}</td>
                  <td className="px-4 py-3 text-accent-500">{formatTHB(order.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDateTH(order.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {others.length === 0 && (
          <p className="text-gray-500 text-center py-8">ยังไม่มีคำสั่งซื้ออื่น</p>
        )}
      </div>
    </div>
  );
}
