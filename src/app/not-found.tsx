import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <p className="font-extrabold text-2xl text-brand-700 mb-1">MEDMANWANN</p>
        <h1 className="text-3xl font-bold text-gray-800">404</h1>
        <p className="text-gray-500 mt-2">ไม่พบหน้าที่คุณต้องการ</p>
        <Link href="/" className="text-brand-700 font-medium mt-4 inline-block">
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
