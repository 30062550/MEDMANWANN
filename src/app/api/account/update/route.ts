import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(1).optional(),
  username: z
    .string()
    .min(3, "username ต้องมีอย่างน้อย 3 ตัวอักษร")
    .regex(/^[a-zA-Z0-9_]+$/, "username ใช้ได้แค่ตัวอักษร ตัวเลข และ _")
    .optional(),
  dekYear: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.fullName !== undefined) updateData.full_name = parsed.data.fullName;
  if (parsed.data.username !== undefined) updateData.username = parsed.data.username;
  if (parsed.data.dekYear !== undefined) updateData.dek_year = parsed.data.dekYear;
  if (parsed.data.avatarUrl !== undefined) updateData.avatar_url = parsed.data.avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", userData.user.id);

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return NextResponse.json({ error: "username นี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
