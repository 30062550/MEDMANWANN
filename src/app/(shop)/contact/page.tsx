import { MessageCircle } from "lucide-react";

const LINKTREE_URL = "https://linktr.ee/medmanwann";

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-brand-800 mb-2">ติดต่อเรา</h1>
      <p className="text-gray-500 mb-8">
        มีคำถามหรือต้องการความช่วยเหลือ ติดต่อเราได้ตามช่องทางด้านล่าง
      </p>

      <a
        href={LINKTREE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-brand-700 text-white rounded-md py-3 font-medium hover:bg-brand-800"
      >
        <MessageCircle size={18} /> ช่องทางติดต่อทั้งหมด
      </a>
    </div>
  );
}
