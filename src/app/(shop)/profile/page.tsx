import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/lib/types";
import ProfileEditForm from "@/components/ProfileEditForm";

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/login?next=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user!.id)
    .single<Profile>();

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-brand-800 mb-6">แก้ไขโปรไฟล์</h1>
      <ProfileEditForm profile={profile} email={userData.user!.email || ""} />
    </div>
  );
}
