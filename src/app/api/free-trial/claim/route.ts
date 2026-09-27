import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const { error } = await supabase
    .from("free_trial_claims")
    .insert({ user_id: userData.user.id });

  // ถ้าเคยเคลมไปแล้ว (unique constraint ชน) ถือว่าสำเร็จเหมือนกัน ไม่ต้อง error
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
