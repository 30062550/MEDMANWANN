import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const serviceClient = createSupabaseServiceRoleClient();
  const { data: slips, error } = await serviceClient
    .from("payment_slips")
    .select("*")
    .eq("order_id", params.orderId)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // ดึง public URL ของแต่ละสลิปจาก bucket slip-public (ไม่หมดอายุ ไม่ต้องสร้าง signed url)
  const slipsWithUrls = (slips || []).map((slip) => {
    const { data: publicUrlData } = serviceClient.storage
      .from("slip-public")
      .getPublicUrl(slip.slip_image_path);
    return { ...slip, signedUrl: publicUrlData.publicUrl };
  });
  return NextResponse.json({ slips: slipsWithUrls });
}
