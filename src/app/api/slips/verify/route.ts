import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { sendNeedsReviewEmail } from "@/lib/email";
import { appendSlipRow } from "@/lib/googleSheets";

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

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const serviceClient = createSupabaseServiceRoleClient();
  const fileExt = file.name.split(".").pop() || "jpg";
  const slipPath = `${userData.user.id}/${orderId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await serviceClient.storage
    .from("slips")
    .upload(slipPath, buffer, { contentType: file.type });

  if (uploadError) {
    return NextResponse.json(
      { error: "อัปโหลดสลิปไม่สำเร็จ: " + uploadError.message },
      { status: 500 }
    );
  }

  // อัปโหลดสำเนาไปยัง bucket สาธารณะเพื่อเอาลิงก์ไปบันทึกใน Google Sheet
  let publicSlipUrl = "";
  const { error: publicUploadError } = await serviceClient.storage
    .from("slip-public")
    .upload(slipPath, buffer, { contentType: file.type });
  if (!publicUploadError) {
    const { data: publicUrlData } = serviceClient.storage
      .from("slip-public")
      .getPublicUrl(slipPath);
    publicSlipUrl = publicUrlData.publicUrl;
  }

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
    (order.products as unknown as { title: string } | null)?.title || "ไม่ทราบชื่อสินค้า";

  // ส่งอีเมลแจ้งแอดมิน
  try {
    await sendNeedsReviewEmail({
      orderNo: order.order_no,
      productTitle,
      reason: "ลูกค้าแจ้งสลิปใหม่ รอตรวจสอบด้วยมือ",
    });
  } catch (e) {
    console.error("ส่งอีเมลไม่สำเร็จ", e);
  }

  // บันทึกลง Google Sheet
  try {
    await appendSlipRow({
      orderNo: order.order_no,
      productTitle,
      customerName: userData.user.user_metadata?.full_name || "-",
      customerEmail: userData.user.email || "-",
      amount: Number(order.amount),
      slipUrl: publicSlipUrl || "ไม่สามารถสร้างลิงก์ได้",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("บันทึกลง Google Sheet ไม่สำเร็จ", e);
  }

  return NextResponse.json({
    status: "pending_review",
    message: "อัปโหลดสลิปสำเร็จ รอแอดมินตรวจสอบและยืนยันการชำระเงิน",
  });
}
