import { requireAdmin } from "@/lib/admin";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-brand-800 mb-6">เพิ่มสินค้าใหม่</h1>
      <ProductForm />
    </div>
  );
}
