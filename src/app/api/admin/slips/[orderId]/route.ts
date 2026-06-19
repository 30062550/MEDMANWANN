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

  // สร้าง signed URL สำหรับแต่ละสลิป (อายุ 10 นาที)
  const slipsWithUrls = await Promise.all(
    (slips || []).map(async (slip) => {
      const { data: signedUrlData } = await serviceClient.storage
        .from("slips")
        .createSignedUrl(slip.slip_image_path, 60 * 10);

      return { ...slip, signedUrl: signedUrlData?.signedUrl || null };
    })
  );

  return NextResponse.json({ slips: slipsWithUrls });
}
