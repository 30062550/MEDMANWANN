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
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden">
          <p className="text-cream-100 text-sm">🏷️ ดี เป็นเวลาอะทุกคนคนใส่ใจติดต่อหากันเตรียมสอบ</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 leading-tight">
            MEDMANWANN
          </h1>
          <p className="text-cream-100 mt-3 max-w-md">
            คลังข้อสอบจำลองพร้อมเฉลย ที่รวบรวมแนวข้อสอบจริงไว้ในที่เดียว
            เตรียมตัวสอบเข้าทางการแพทย์ได้อย่างมั่นใจ
          </p>
          <Link
            href="/products"
            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-accent-300 text-brand-900 font-semibold hover:bg-accent-200"
          >
            เลือกซื้อข้อสอบเลย
          </Link>
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
          description="ข้อสอบจำลองที่ตรงแนวจริงล่าสุด เตรียมตัวให้พร้อมก่อนสอบสนามจริง"
          href="/products"
          linkLabel="เลือกซื้อข้อสอบ"
        />
        <FeatureCard
          icon={<Layers size={22} />}
          title="Content"
          description="เนื้อหาสรุปย่อแยกตามรายวิชาสอบแบบครบ กระชับ เข้าใจง่าย เน้นใช้สอบจริง"
          href="/products"
          linkLabel="เลือกดูเนื้อหา"
        />
        <FeatureCard
          icon={<Star size={22} />}
          title="Review"
          description="มีรีวิวจากผู้เรียนจริง ที่ใช้ระบบจนสอบติด ยืนยันผลลัพธ์ที่จับต้องได้"
          href="/products"
          linkLabel="ดูรีวิวทั้งหมด"
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
