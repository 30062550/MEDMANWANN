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
  customerEmail: string;
  slipUrl: string;
  timestamp: string;
}) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("ยังไม่ได้ตั้งค่า GOOGLE_SHEET_ID");
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "B:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [row.orderNo, row.productTitle, row.customerEmail, row.slipUrl, row.timestamp],
      ],
    },
  });
}
