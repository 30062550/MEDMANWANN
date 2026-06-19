import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-thai",
});

export const metadata: Metadata = {
  title: "MEDMANWANN - คลังข้อสอบจำลองออนไลน์",
  description: "ซื้อไฟล์ข้อสอบจำลอง โอนเงิน แจ้งสลิป โหลดไฟล์ได้ทันทีในเว็บเดียว",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="min-h-screen bg-cream-50 antialiased font-sans text-gray-800">
        {children}
      </body>
    </html>
  );
}
