import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-800 text-cream-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="font-bold text-lg text-white">MEDMANWANN</p>
          <p className="text-sm text-cream-200 mt-1">
            ช้อสอบ Mock Exam TPAT1 เตรียมสอบเข้าคณะสายกสพท
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:justify-end items-start text-sm">
          <Link href="/privacy" className="hover:text-white">
            เงื่อนไขความเป็นส่วนตัว
          </Link>
          <Link href="/terms" className="hover:text-white">
            เงื่อนไขการใช้บริการ
          </Link>
          <Link href="/help" className="hover:text-white">
            ศูนย์ช่วยเหลือ
          </Link>
        </div>
      </div>

      <div className="border-t border-brand-700">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs text-cream-200">
          © {new Date().getFullYear()} MEDMANWANN. สงวนลิขสิทธิ์ทั้งหมด
        </p>
      </div>
    </footer>
  );
}
