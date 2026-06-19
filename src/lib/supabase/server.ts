import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// ใช้ใน Server Components, Route Handlers, Server Actions
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // เรียกจาก Server Component (read-only) จะ error ได้ ไม่เป็นไร
            // middleware จะ refresh session ให้แทน
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // ไม่เป็นไรเหมือนด้านบน
          }
        },
      },
    }
  );
}

// ใช้เฉพาะฝั่ง server เท่านั้น สำหรับงานที่ต้อง "ข้าม" RLS เช่น
// อนุมัติออเดอร์, ปลดล็อกไฟล์หลังเช็คสลิปผ่าน, งาน admin บางอย่าง
// ***ห้ามนำ service role key ไปใช้ฝั่ง client โดยเด็ดขาด***
import { createClient } from "@supabase/supabase-js";

export function createSupabaseServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
