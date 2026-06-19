import { requireAdmin } from "@/lib/admin";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/lib/types";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return null; // layout เช็คสิทธิ์และ redirect ไปแล้ว

  const { data: product } = await auth.supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single<Product>();

  if (!product) notFound();

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-brand-800 mb-6">แก้ไขสินค้า</h1>
      <ProductForm existingProduct={product} />
    </div>
  );
}
