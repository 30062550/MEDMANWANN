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

  // ตรวจสอบสิทธิ์: ออเดอร์นี้เป็นของ user คนนี้ และสถานะ "paid" แล้วเท่านั้น
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

  const filePath = (order.products as unknown as { file_path: string } | null)?.file_path;
  if (!filePath) {
    return NextResponse.json({ error: "ไม่พบไฟล์สินค้านี้" }, { status: 404 });
  }

  // ใช้ service role สร้าง signed URL อายุสั้น (5 นาที) จาก bucket private
  const serviceClient = createSupabaseServiceRoleClient();
  const { data: signedUrlData, error: signError } = await serviceClient.storage
    .from("exam-files")
    .createSignedUrl(filePath, 60 * 5);

  if (signError || !signedUrlData) {
    return NextResponse.json({ error: "สร้างลิงก์ดาวน์โหลดไม่สำเร็จ" }, { status: 500 });
  }

  // log การดาวน์โหลดไว้เผื่อตรวจสอบ
  await serviceClient.from("download_logs").insert({
    order_id: orderId,
    user_id: userData.user.id,
  });

  return NextResponse.json({ url: signedUrlData.signedUrl });
}
