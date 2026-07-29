import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline mb-6"
      >
        <ArrowLeft size={16} /> กลับหน้าแรก
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
          <h1 className="text-2xl font-bold text-brand-800 mb-2">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p>
            Medmanwann เคารพความเป็นส่วนตัวของผู้ใช้งานและผู้ซื้อสินค้าทุกท่าน
            นโยบายความเป็นส่วนตัวนี้จัดทำขึ้นเพื่ออธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้
            เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณ
            ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
          </p>
        </div>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p className="mb-2">
            เพื่อให้การสั่งซื้อและการจัดส่งสินค้าเป็นไปอย่างราบรื่น
            เราจำเป็นต้องเก็บรวบรวมข้อมูลดังต่อไปนี้:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>ข้อมูลส่วนตัว: ชื่อ-นามสกุล, ชื่อผู้ใช้ (Username)</li>
            <li>ข้อมูลการติดต่อและการจัดส่ง: เบอร์โทรศัพท์, อีเมล, LINE ID</li>
            <li>
              ข้อมูลทางการเงินและการชำระเงิน: หลักฐานการโอนเงิน (สลิป),
              ข้อมูลบัญชีธนาคาร (กรณีมีการคืนเงิน)
              (หมายเหตุ: เราไม่มีการบันทึกหรือเก็บข้อมูลบัตรเครดิต/เดบิตของคุณไว้ในระบบ)
            </li>
            <li>
              ข้อมูลการสั่งซื้อ: ประวัติการสั่งซื้อสินค้า, สินค้าที่สนใจ (Wishlist),
              ข้อเสนอแนะ หรือคำร้องเรียน
            </li>
            <li>ข้อมูลทางเทคนิค: หมายเลข IP Address</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p className="mb-2">เรานำข้อมูลของคุณไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              การดำเนินการสั่งซื้อและจัดส่ง: เพื่อยืนยันคำสั่งซื้อ ตรวจสอบการชำระเงิน
              ออกใบเสร็จ
            </li>
            <li>
              การบริการลูกค้า: เพื่อให้บริการหลังการขาย รับประกันสินค้า
              เคลมสินค้า หรือตอบข้อซักถาม
            </li>
            <li>
              การพัฒนาบริการ: เพื่อวิเคราะห์พฤติกรรมการซื้อและปรับปรุงคุณภาพสินค้า
              เว็บไซต์ และบริการให้ดียิ่งขึ้น
            </li>
            <li>
              การตลาดและโปรโมชัน (ตามความยินยอม): เพื่อแจ้งข่าวสาร สิทธิพิเศษ
              ส่วนลด หรือสินค้าใหม่ผ่านทางอีเมล SMS หรือ LINE
              (คุณสามารถยกเลิกการรับข่าวสารได้ตลอดเวลา)
            </li>
            <li>
              การปฏิบัติตามกฎหมาย: เพื่อการทำบัญชี ภาษี
              และการปฏิบัติตามข้อกำหนดทางกฎหมาย
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">
            3. การเปิดเผยข้อมูลแก่บุคคลที่สาม
          </h2>
          <p className="mb-2">
            เราจะไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลภายนอกอย่างเด็ดขาด
            เว้นแต่จำเป็นต้องเปิดเผยให้แก่ผู้ให้บริการที่เป็นพันธมิตรของเราเพื่อดำเนินงานให้บรรลุวัตถุประสงค์
            ได้แก่
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>ผู้ให้บริการระบบชำระเงิน: เพื่อตรวจสอบและยืนยันการชำระเงิน</li>
            <li>
              ผู้ให้บริการระบบไอทีและนักพัฒนา:
              เพื่อดูแลและพัฒนาระบบเว็บไซต์ให้มีประสิทธิภาพและปลอดภัย
            </li>
            <li>หน่วยงานรัฐ: หากมีคำสั่งตามกฎหมายหรือหมายศาล</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">
            4. สิทธิของคุณในฐานะเจ้าของข้อมูล
          </h2>
          <p className="mb-2">ตามกฎหมาย PDPA คุณมีสิทธิตามกฎหมายดังนี้:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>สิทธิในการขอเข้าถึง ขอสำเนา หรือขอให้โอนย้ายข้อมูลส่วนบุคคลของคุณ</li>
            <li>สิทธิในการขอแก้ไขข้อมูลให้ถูกต้อง สมบูรณ์ และเป็นปัจจุบัน</li>
            <li>สิทธิในการขอให้ลบ ทำลาย หรือระงับการใช้ข้อมูลส่วนบุคคล</li>
            <li>สิทธิในการถอนความยินยอมในการรับข้อมูลข่าวสารทางการตลาดได้ทุกเมื่อ</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">
            5. การรักษาความปลอดภัยของข้อมูล
          </h2>
          <p>
            เราใช้มาตรการรักษาความปลอดภัยทางเทคนิคและการบริหารจัดการที่เหมาะสม
            (เช่น การเข้ารหัสข้อมูล SSL)
            เพื่อป้องกันไม่ให้ข้อมูลส่วนบุคคลของคุณสูญหาย ถูกเข้าถึง
            หรือเปิดเผยโดยไม่ได้รับอนุญาต
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-brand-800 mb-2">6. ติดต่อเรา</h2>
          <p className="mb-2">
            หากคุณมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
            หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของคุณ สามารถติดต่อเราได้ที่:
          </p>
          <ul className="space-y-1 pl-2">
            <li>
              อีเมล:{" "}
              <a href="mailto:medmanwann@gmail.com" className="text-brand-700 hover:underline">
                medmanwann@gmail.com
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/medmanwann"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline"
              >
                medmanwann
              </a>
            </li>
            <li>
              LINE Official Account:{" "}
              <a
                href="https://lin.ee/xyteUTe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline"
              >
                คลิกที่นี่
              </a>
            </li>
            <li>
              X:{" "}
              <a
                href="https://x.com/medmanwann"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline"
              >
                medmanwann
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
