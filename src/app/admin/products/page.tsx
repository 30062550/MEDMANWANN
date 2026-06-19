import { requireAdmin } from "@/lib/admin";
import { Product } from "@/lib/types";
import { formatTHB } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import ToggleProductButton from "@/components/admin/ToggleProductButton";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  const { data: products } = await auth.supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-brand-800">คลังสินค้า</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-700 text-white text-sm font-medium hover:bg-brand-800"
        >
          <Plus size={16} /> เพิ่มสินค้าใหม่
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">ชื่อสินค้า</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">ราคา</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(products as Product[] | null)?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                <td className="px-4 py-3 text-gray-500">{p.subject || "-"}</td>
                <td className="px-4 py-3 text-accent-500 font-medium">{formatTHB(p.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.is_active ? "วางขาย" : "ปิดการขาย"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ToggleProductButton productId={p.id} isActive={p.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!products || products.length === 0) && (
          <p className="text-gray-500 text-center py-8">ยังไม่มีสินค้า</p>
        )}
      </div>
    </div>
  );
}
