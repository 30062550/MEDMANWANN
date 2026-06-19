import { requireAdmin } from "@/lib/admin";
import { formatTHB, formatDateTH, ORDER_STATUS_LABEL } from "@/lib/utils";
import { Order, Product } from "@/lib/types";
import Link from "next/link";
import { DollarSign, UserPlus, FileText, ClipboardCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  const { supabase } = auth;

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("amount")
    .eq("status", "paid");

  const totalRevenue = (paidOrders || []).reduce((sum, o) => sum + Number(o.amount), 0);

  const { count: pendingReviewCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending_review");

  const { count: productCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  // ผู้ใช้ใหม่ในช่วง 30 วันล่าสุด
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: newUsersCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, product:products(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const typedRecentOrders = (recentOrders as (Order & { product: Pick<Product, "title"> })[] | null) || [];

  const stats = [
    {
      label: "ยอดขายทั้งหมด",
      value: formatTHB(totalRevenue),
      icon: DollarSign,
    },
    {
      label: "ผู้ใช้ใหม่ (30 วัน)",
      value: String(newUsersCount || 0),
      icon: UserPlus,
    },
    {
      label: "จำนวนข้อสอบ",
      value: String(productCount || 0),
      icon: FileText,
    },
    {
      label: "รอยืนยันสลิป",
      value: String(pendingReviewCount || 0),
      icon: ClipboardCheck,
      highlight: (pendingReviewCount || 0) > 0,
      href: "/admin/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-800 mb-6">ภาพรวมระบบ</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const cardContent = (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                {stat.highlight && (
                  <span className="text-xs bg-accent-100 text-accent-600 px-2 py-0.5 rounded-full font-medium">
                    ต้องดำเนินการ
                  </span>
                )}
              </div>
              <p className={`text-2xl font-bold ${stat.highlight ? "text-accent-500" : "text-brand-800"}`}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </>
          );

          if (stat.href) {
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 block hover:shadow-md transition"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              {cardContent}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-800">รายการสั่งซื้อล่าสุด</h2>
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">
              ดูทั้งหมด
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="py-2 pr-3">รหัสคำสั่งซื้อ</th>
                  <th className="py-2 pr-3">สินค้า</th>
                  <th className="py-2 pr-3">ยอดเงิน</th>
                  <th className="py-2 pr-3">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {typedRecentOrders.map((order) => {
                  const statusInfo = ORDER_STATUS_LABEL[order.status];
                  return (
                    <tr key={order.id}>
                      <td className="py-2.5 pr-3 font-medium text-gray-700">{order.order_no}</td>
                      <td className="py-2.5 pr-3 text-gray-600 truncate max-w-[160px]">
                        {order.product?.title}
                      </td>
                      <td className="py-2.5 pr-3 text-gray-700">{formatTHB(order.amount)}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {typedRecentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      ยังไม่มีคำสั่งซื้อ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
            <ClipboardCheck size={22} />
          </div>
          <p className="font-medium text-brand-800">ตรวจสอบการชำระเงิน</p>
          <p className="text-sm text-gray-500 mt-1">
            {pendingReviewCount
              ? `มี ${pendingReviewCount} รายการรอตรวจสอบสลิป`
              : "ไม่มีรายการรอตรวจสอบในขณะนี้"}
          </p>
        </Link>
      </div>
    </div>
  );
}
