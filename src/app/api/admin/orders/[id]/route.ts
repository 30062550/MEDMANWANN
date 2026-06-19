import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { sendOrderPaidEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const serviceClient = createSupabaseServiceRoleClient();

  const { data: order, error } = await serviceClient
    .from("orders")
    .select("id, order_no, amount, user_id, products(title)")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  if (parsed.data.action === "approve") {
    await serviceClient
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", params.id);

    // ดึงอีเมลลูกค้าจาก auth.users ผ่าน admin API
    const { data: userResult } = await serviceClient.auth.admin.getUserById(order.user_id);
    const customerEmail = userResult?.user?.email;

    if (customerEmail) {
      try {
        await sendOrderPaidEmail({
          customerEmail,
          customerName: userResult.user?.user_metadata?.full_name ?? null,
          orderNo: order.order_no,
          productTitle: (order.products as unknown as { title: string } | null)?.title || "",
          amount: order.amount,
        });
      } catch (e) {
        console.error("ส่งอีเมลไม่สำเร็จ", e);
      }
    }
  } else {
    await serviceClient.from("orders").update({ status: "rejected" }).eq("id", params.id);
  }

  return NextResponse.json({ ok: true });
}
