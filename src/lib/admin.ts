import { createSupabaseServerClient } from "./supabase/server";

/**
 * เช็คว่า user ปัจจุบันล็อกอินและเป็นแอดมินไหม
 * ใช้ใน Server Component (หน้า /admin/*) หรือ API route (/api/admin/*)
 */
export async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { ok: false as const, status: 401, message: "กรุณาเข้าสู่ระบบ" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .single();

  if (!profile?.is_admin) {
    return { ok: false as const, status: 403, message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้" };
  }

  return { ok: true as const, user: userData.user, supabase };
}
