import Link from "next/link";
import { ArrowLeft, ThumbsUp, Bell, Camera } from "lucide-react";
import FreeTrialUploadForm from "@/components/FreeTrialUploadForm";

const FREE_TRIAL_DRIVE_LINK = "https://drive.google.com/drive/folders/1543bS049n0WQ2OJ4p1YK-f6NDBfvSyNu?usp=sharing"; // <-- ใส่ลิงก์เดียวกับที่ใช้ในหน้า products

export default function FreeTrialPage() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
      >
        <ArrowLeft size={16} /> กลับไปเลือกวิธีซื้อ
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-brand-800">FREE! MOCKMANWANN</h1>
        <p className="text-gray-500 mt-1">
          Mock TPAT1 by MEDMANWANN ชุดทดลอง ฟรี! ไม่มีค่าใช้จ่าย
        </p>

        <div className="mt-5 bg-cream-100 border border-cream-200 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-medium text-brand-800 mb-2">วิธีรับไฟล์ FREE! MOCKMANWANN</p>
          <ol className="space-y-2">
            <li className="flex items-start gap-2">
              <ThumbsUp size={16} className="text-brand-600 shrink-0 mt-0.5" />
              กดไลก์/รีโพสต์ โพสต์ FREE! MOCKMANWANN ใน IG หรือ X @medmanwann
            </li>
            <li className="flex items-start gap-2">
              <Bell size={16} className="text-brand-600 shrink-0 mt-0.5" />
              กดติดตาม (Follow) IG หรือ X @medmanwann
            </li>
            <li className="flex items-start gap-2">
              <Camera size={16} className="text-brand-600 shrink-0 mt-0.5" />
              แคปหน้าจอรูปหลักฐาน แล้วแนบรูปด้านล่างเพื่อรับไฟล์ FREE! MOCKMANWANN (แนบได้หลายรูป)
            </li>
          </ol>
        </div>
      </div>

      <FreeTrialUploadForm driveLink={FREE_TRIAL_DRIVE_LINK} />
    </div>
  );
}
