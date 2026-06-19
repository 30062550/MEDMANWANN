import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null; // "exam-file" หรือ "cover"

  if (!file || !type) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const serviceClient = createSupabaseServiceRoleClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${Date.now()}-${safeName}`;

  if (type === "exam-file") {
    const { error } = await serviceClient.storage
      .from("exam-files")
      .upload(path, buffer, { contentType: file.type });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ filePath: path });
  }

  if (type === "cover") {
    const { error } = await serviceClient.storage
      .from("covers")
      .upload(path, buffer, { contentType: file.type });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: publicUrlData } = serviceClient.storage.from("covers").getPublicUrl(path);

    return NextResponse.json({ coverImageUrl: publicUrlData.publicUrl });
  }

  return NextResponse.json({ error: "ประเภทไฟล์ไม่ถูกต้อง" }, { status: 400 });
}
