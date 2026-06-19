import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  subject: z.string().optional(),
  price: z.number().min(0).optional(),
  filePath: z.string().optional(),
  coverImageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const serviceClient = createSupabaseServiceRoleClient();

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.subject !== undefined) updateData.subject = parsed.data.subject;
  if (parsed.data.price !== undefined) updateData.price = parsed.data.price;
  if (parsed.data.filePath !== undefined) updateData.file_path = parsed.data.filePath;
  if (parsed.data.coverImageUrl !== undefined)
    updateData.cover_image_url = parsed.data.coverImageUrl;
  if (parsed.data.isActive !== undefined) updateData.is_active = parsed.data.isActive;
  updateData.updated_at = new Date().toISOString();

  const { error } = await serviceClient
    .from("products")
    .update(updateData)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const serviceClient = createSupabaseServiceRoleClient();

  // ไม่ลบจริง แค่ปิดการขาย (กันออเดอร์เก่าที่อ้างอิงสินค้านี้พัง)
  const { error } = await serviceClient
    .from("products")
    .update({ is_active: false })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
