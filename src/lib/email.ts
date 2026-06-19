import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

export async function sendOrderPaidEmail(params: {
  customerEmail: string;
  customerName: string | null;
  orderNo: string;
  productTitle: string;
  amount: number;
}) {
  const { customerEmail, customerName, orderNo, productTitle, amount } = params;

  // อีเมลถึงลูกค้า
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `ชำระเงินสำเร็จ - คำสั่งซื้อ ${orderNo}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>ขอบคุณสำหรับการสั่งซื้อ${customerName ? ` คุณ${customerName}` : ""}!</h2>
        <p>คำสั่งซื้อ <b>${orderNo}</b> สำหรับสินค้า <b>${productTitle}</b>
        จำนวน ${amount.toLocaleString("th-TH")} บาท ได้รับการยืนยันการชำระเงินแล้ว</p>
        <p>เข้าไปที่หน้า "คำสั่งซื้อของฉัน" ในเว็บไซต์เพื่อดาวน์โหลดไฟล์ได้เลย</p>
      </div>
    `,
  });

  // อีเมลแจ้งแอดมิน
  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `[แจ้งยอดขาย] คำสั่งซื้อ ${orderNo} ชำระเงินสำเร็จ`,
      html: `
        <div style="font-family: sans-serif;">
          <p>มีคำสั่งซื้อใหม่ที่ชำระเงินสำเร็จ</p>
          <ul>
            <li>เลขที่ออเดอร์: ${orderNo}</li>
            <li>สินค้า: ${productTitle}</li>
            <li>ยอดเงิน: ${amount.toLocaleString("th-TH")} บาท</li>
            <li>ลูกค้า: ${customerEmail}</li>
          </ul>
        </div>
      `,
    });
  }
}

export async function sendNeedsReviewEmail(params: {
  orderNo: string;
  productTitle: string;
  reason: string;
}) {
  if (!ADMIN_EMAIL) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[ต้องตรวจสอบมือ] คำสั่งซื้อ ${params.orderNo} เช็คสลิปอัตโนมัติไม่ผ่าน`,
    html: `
      <div style="font-family: sans-serif;">
        <p>คำสั่งซื้อ <b>${params.orderNo}</b> (${params.productTitle})
        ระบบเช็คสลิปอัตโนมัติไม่ผ่าน กรุณาเข้าไปตรวจสอบในหน้าแอดมิน</p>
        <p>เหตุผล: ${params.reason}</p>
      </div>
    `,
  });
}
