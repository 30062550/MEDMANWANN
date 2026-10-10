import { google } from "googleapis";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("ยังไม่ได้ตั้งค่า Google Service Account environment variables");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendSlipRow(row: {
  orderNo: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  slipUrl: string;
  timestamp: string;
}) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_SHEET_ID");

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const date = new Date(row.timestamp).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Orders!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          false,        // A: สถานะ (checkbox)
          date,         // B: วันเวลา
          row.orderNo,  // C: เลขออเดอร์
          row.customerName,  // D: ชื่อลูกค้า
          row.customerEmail, // E: อีเมล
          row.productTitle,  // F: สินค้า
          row.amount,        // G: ยอดเงิน
          row.slipUrl,       // H: ลิงก์สลิป
        ],
      ],
    },
  });
}
