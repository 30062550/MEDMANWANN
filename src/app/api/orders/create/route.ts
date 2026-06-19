import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateOrderNo } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  productId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, is_active")
    .eq("id", parsed.data.productId)
    .single();

  if (productError || !product || !product.is_active) {
    return NextResponse.json({ error: "ไม่พบสินค้านี้" }, { status: 404 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_no: generateOrderNo(),
      user_id: userData.user.id,
      product_id: product.id,
      amount: product.price,
      status: "pending_payment",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message || "สร้างคำสั่งซื้อไม่สำเร็จ" },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderId: order.id });
}
