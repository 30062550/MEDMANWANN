import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "กรุณาเลือกรูป" }, { status: 400 });
  }

  const serviceClient = createSupabaseServiceRoleClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExt = file.name.split(".").pop() || "jpg";
  const path = `${userData.user.id}-${Date.now()}.${fileExt}`;

  const { error } = await serviceClient.storage
    .from("avatars")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = serviceClient.storage.from("avatars").getPublicUrl(path);

  return NextResponse.json({ avatarUrl: publicUrlData.publicUrl });
}
