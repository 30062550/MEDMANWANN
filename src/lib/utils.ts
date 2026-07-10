// สร้างเลขที่ออเดอร์ เช่น ORD-20260617-A1B2C3
export function generateOrderNo(): string {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
}

export function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount);
}

export function formatDateTH(dateString: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(dateString));
}

export const ORDER_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "รอโอนเงิน", color: "bg-yellow-100 text-yellow-800" },
  pending_review: { label: "รอตรวจสอบสลิป", color: "bg-blue-100 text-blue-800" },
  paid: { label: "ชำระเงินสำเร็จ", color: "bg-green-100 text-green-800" },
  rejected: { label: "สลิปไม่ถูกต้อง", color: "bg-red-100 text-red-800" },
  cancelled: { label: "ยกเลิก", color: "bg-gray-100 text-gray-800" },
};
