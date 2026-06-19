export type OrderStatus =
  | "pending_payment"
  | "pending_review"
  | "paid"
  | "rejected"
  | "cancelled";

export interface Product {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  price: number;
  cover_image_url: string | null;
  file_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_no: string;
  user_id: string;
  product_id: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
  // joined fields (optional, ใส่เวลา query แบบ join)
  product?: Product;
}

export interface PaymentSlip {
  id: string;
  order_id: string;
  slip_image_path: string;
  slipok_response: Record<string, unknown> | null;
  verified: boolean;
  verify_message: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
}
