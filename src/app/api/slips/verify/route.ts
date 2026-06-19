import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { sendNeedsReviewEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const formData = await req.formData();
  const orderId = formData.get("orderId") as string | null;
  const file = formData.get("file") as File | null;

  if (!orderId || !file) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  // โหลดออเดอร์ ตรวจสอบว่าเป็นของ user คนนี้จริง และยังไม่จ่ายเงิน
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, user_id, amount, status, order_no, product_id, products(title)")
    .eq("id", orderId)
    .single();

  if (orderError || !order || order.user_id !== userData.user.id) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อนี้" }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ error: "คำสั่งซื้อนี้ชำระเงินแล้ว" }, { status: 400 });
  }

  // แปลงไฟล์เป็น buffer เพื่อเก็บลง storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ใช้ service role client เพื่ออัปโหลดไฟล์ลง storage bucket "slips" แบบ private
  // (path ขึ้นต้นด้วย user id ตาม storage policy ที่ตั้งไว้)
  const serviceClient = createSupabaseServiceRoleClient();
  const fileExt = file.name.split(".").pop() || "jpg";
  const slipPath = `${userData.user.id}/${orderId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await serviceClient.storage
    .from("slips")
    .upload(slipPath, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json({ error: "อัปโหลดสลิปไม่สำเร็จ: " + uploadError.message }, {
      status: 500,
    });
  }

  // ไม่เช็คอัตโนมัติแล้ว — ทุกสลิปเข้าสถานะ "รอแอดมินตรวจสอบมือ" เสมอ
  await serviceClient.from("payment_slips").insert({
    order_id: orderId,
    slip_image_path: slipPath,
    slipok_response: null,
    verified: false,
    verify_message: "รอแอดมินตรวจสอบสลิปด้วยมือ",
  });

  await serviceClient
    .from("orders")
    .update({ status: "pending_review" })
    .eq("id", orderId);

  const productTitle =
    (order.products as unknown as { title: string } | null)?.title || "ไฟล์ข้อสอบ";

  // แจ้งอีเมลแอดมินว่ามีสลิปใหม่รอตรวจสอบ
  try {
    await sendNeedsReviewEmail({
      orderNo: order.order_no,
      productTitle,
      reason: "ลูกค้าแจ้งสลิปใหม่ รอตรวจสอบด้วยมือ",
    });
  } catch (e) {
    console.error("ส่งอีเมลไม่สำเร็จ", e);
  }

  return NextResponse.json({
    status: "pending_review",
    message: "อัปโหลดสลิปสำเร็จ รอแอดมินตรวจสอบและยืนยันการชำระเงิน",
  });
}
