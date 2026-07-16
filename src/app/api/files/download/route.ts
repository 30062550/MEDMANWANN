import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }
  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 400 });
  }
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, user_id, status, products(file_path)")
    .eq("id", orderId)
    .single();
  if (error || !order || order.user_id !== userData.user.id) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อนี้" }, { status: 404 });
  }
  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "คำสั่งซื้อนี้ยังไม่ได้รับการยืนยันการชำระเงิน" },
      { status: 403 }
    );
  }
  const rawFilePath = (order.products as unknown as { file_path: string } | null)?.file_path;
  const links = (rawFilePath || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (links.length === 0) {
    return NextResponse.json({ error: "ไม่พบไฟล์สินค้านี้" }, { status: 404 });
  }

  const serviceClient = createSupabaseServiceRoleClient();
  await serviceClient.from("download_logs").insert({
    order_id: orderId,
    user_id: userData.user.id,
  });

  return NextResponse.json({ links });
}
