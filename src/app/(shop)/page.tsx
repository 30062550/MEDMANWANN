import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Layers, Star } from "lucide-react";
import LoginBox from "@/components/LoginBox";

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="relative rounded-2xl overflow-hidden h-[420px] sm:h-[480px]">
  {/* รูปพื้นหลัง */}
  <img
    src="https://icltzbnzdjfskpzowygk.supabase.co/storage/v1/object/sign/newnew%20hero/Untitled%20design%20(6).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZGUwYTg4Zi1hZjhjLTRjZjgtYTRhZS1iZjNjZmQ2YTljOGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJuZXduZXcgaGVyby9VbnRpdGxlZCBkZXNpZ24gKDYpLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ0ODc2ODgsImV4cCI6MTgxNjAyMzY4OH0.6xbl6b2f2MZ-lNsvw2D-P2NfAFruHUuSVUjjPJbTRcM"
    alt="MEDMANWANN"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Overlay ไล่เฉดมืดจากล่างขึ้นบน ให้ตัวหนังสืออ่านง่าย */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

  {/* เนื้อหาลอยอยู่ด้านล่างของรูป */}
  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 text-white">
    <p className="text-cream-100 text-sm"> คลัง Mock Exam TPAT1 พร้อมเฉลยละเอียด</p>
    <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 leading-tight">
      MEDMANWANN
    </h1>
    <p className="text-cream-100 mt-3 max-w-md">
      พี่มันหวาน พาเตรียมตัวสอบ #กสพท #tpat1 
      รวมข้อสอบ / แชร์ทริค / คอนเทนต์ พาเข้าคณะสายแพทย์
    </p>
    <Link
      href="/products"
      className="inline-block mt-6 px-6 py-2.5 rounded-full bg-accent-300 text-brand-900 font-semibold hover:bg-accent-200"
    >
      คลิกเพื่อเลือกซื้อข้อสอบ
    </Link>
  </div>
</div>

        <LoginBox isLoggedIn={!!user} />
      </div>

      <div className="text-center mt-16 mb-8">
        <h2 className="text-2xl font-bold text-brand-800">ทำไมต้อง MEDMANWANN?</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <FeatureCard
          icon={<FileText size={22} />}
          title="Mock Exam"
          description="ข้อสอบจำลองที่พี่มันหวานทำเองกับมือ หลากหลายแนว แปลกใหม่ และเหมาะสำหรับการฝึกเสมือนจริง"
          href="/products"
          linkLabel="เลือกซื้อข้อสอบ"
        />
        <FeatureCard
          icon={<Layers size={22} />}
          title="Content"
          description="แบ่งปันข้อมูลเกี่ยวกับการสอบ TPAT1 ทั้งแชร์ทริคการสอบและการเตรียมตัว"
          href="/products"
          linkLabel="เลือกดูคอนเทนต์"
        />
        <FeatureCard
          icon={<Star size={22} />}
          title="Review"
          description="มีรีวิวจากน้อง ๆ ที่ฝึกทำข้อสอบ จนได้คะแนนดีขึ้นและติดคณะสายกสพทตามที่หวังไว้"
          href="/products"
          linkLabel="เลือกดูรีวิว"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="font-bold text-brand-800 mt-4">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
      <Link
        href={href}
        className="inline-block mt-4 text-sm font-medium text-brand-700 border border-brand-200 rounded-md px-4 py-1.5 hover:bg-brand-50"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
