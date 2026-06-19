import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.string().optional(),
  price: z.number().min(0),
  filePath: z.string().min(1), // path ที่อัปโหลดไว้ใน bucket exam-files แล้ว
  coverImageUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง: " + parsed.error.message }, {
      status: 400,
    });
  }

  // ใช้ service role เพื่อ bypass RLS (เรา auth เช็คสิทธิ์แอดมินไปแล้วข้างบน)
  const serviceClient = createSupabaseServiceRoleClient();

  const { data, error } = await serviceClient
    .from("products")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      subject: parsed.data.subject || null,
      price: parsed.data.price,
      file_path: parsed.data.filePath,
      cover_image_url: parsed.data.coverImageUrl || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "เพิ่มสินค้าไม่สำเร็จ" }, {
      status: 500,
    });
  }

  return NextResponse.json({ productId: data.id });
}
