-- ============================================================
-- EXAM SHOP - Supabase Database Schema
-- วิธีใช้: ไปที่ Supabase Dashboard > SQL Editor > New query
-- copy ทั้งไฟล์นี้ไปวาง แล้วกด Run
-- ============================================================

-- ----------------------------------------------------------
-- 1. PROFILES (ข้อมูลผู้ใช้เพิ่มเติม + บอกว่าใครเป็นแอดมิน)
-- ----------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- เมื่อมี user สมัครใหม่ผ่าน auth ให้สร้างแถวใน profiles อัตโนมัติ
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------
-- 2. PRODUCTS (ไฟล์ข้อสอบที่ขาย)
-- ----------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text,            -- วิชา/หมวดหมู่ เช่น "คณิตศาสตร์ ม.6"
  price numeric(10,2) not null check (price >= 0),
  cover_image_url text,    -- รูปหน้าปก (เก็บใน storage bucket "covers")
  file_path text not null, -- path ไฟล์จริงใน storage bucket "exam-files" (private)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active on public.products(is_active);

-- ----------------------------------------------------------
-- 3. ORDERS (คำสั่งซื้อ)
-- ----------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique,           -- เลขที่อ้างอิง เช่น ORD-20260617-0001
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id),
  amount numeric(10,2) not null,
  status text not null default 'pending_payment'
    check (status in (
      'pending_payment',   -- รอลูกค้าโอนเงิน/แจ้งสลิป
      'pending_review',    -- แจ้งสลิปแล้ว รอตรวจสอบ (กรณี API เช็คไม่ผ่านอัตโนมัติ)
      'paid',               -- จ่ายเงินสำเร็จ โหลดไฟล์ได้
      'rejected',          -- สลิปไม่ถูกต้อง/ปฏิเสธ
      'cancelled'
    )),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);

-- ----------------------------------------------------------
-- 4. PAYMENT SLIPS (สลิปที่แนบ + ผลเช็คจาก SlipOK)
-- ----------------------------------------------------------
create table if not exists public.payment_slips (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  slip_image_path text not null,   -- path ใน storage bucket "slips" (private)
  slipok_response jsonb,           -- raw response จาก SlipOK เก็บไว้ตรวจสอบย้อนหลัง
  verified boolean not null default false,
  verify_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_slips_order on public.payment_slips(order_id);

-- ----------------------------------------------------------
-- 5. DOWNLOAD LOGS (เผื่ออยากดูสถิติ/ตรวจสอบการโหลด)
-- ----------------------------------------------------------
create table if not exists public.download_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  downloaded_at timestamptz not null default now()
);

-- ----------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) -- สำคัญมาก ห้ามลืมเปิด
-- ----------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.payment_slips enable row level security;
alter table public.download_logs enable row level security;

-- helper: เช็คว่า user ปัจจุบันเป็นแอดมินไหม
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- PROFILES: ดูได้แค่ของตัวเอง, แอดมินดูได้ทุกคน
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- PRODUCTS: ทุกคน (รวมคนไม่ login) เห็นสินค้าที่ active ได้, แอดมินจัดการได้หมด
create policy "products_select_active" on public.products
  for select using (is_active = true or public.is_admin());
create policy "products_admin_all" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ORDERS: ลูกค้าเห็น/สร้างได้แค่ของตัวเอง, แอดมินเห็นหมดและแก้สถานะได้
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin());

-- PAYMENT_SLIPS: ลูกค้าจัดการสลิปของออเดอร์ตัวเองได้, แอดมินเห็นหมด
create policy "slips_select_own_or_admin" on public.payment_slips
  for select using (
    public.is_admin() or
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "slips_insert_own" on public.payment_slips
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "slips_admin_update" on public.payment_slips
  for update using (public.is_admin());

-- DOWNLOAD_LOGS: เห็นแค่ของตัวเอง, แอดมินเห็นหมด
create policy "downloads_select_own_or_admin" on public.download_logs
  for select using (auth.uid() = user_id or public.is_admin());
create policy "downloads_insert_own" on public.download_logs
  for insert with check (auth.uid() = user_id);

-- ----------------------------------------------------------
-- 7. STORAGE BUCKETS (รันส่วนนี้แยก หรือสร้างผ่าน Dashboard ก็ได้)
-- ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('exam-files', 'exam-files', false),  -- ไฟล์ข้อสอบจริง ห้าม public
  ('slips', 'slips', false),            -- สลิปลูกค้า ห้าม public
  ('covers', 'covers', true)            -- รูปหน้าปกสินค้า public ได้
on conflict (id) do nothing;

-- Storage policy: เฉพาะแอดมินอัปโหลด/แก้ไฟล์ข้อสอบและรูปปก
create policy "exam_files_admin_write" on storage.objects
  for all using (bucket_id = 'exam-files' and public.is_admin())
  with check (bucket_id = 'exam-files' and public.is_admin());

create policy "covers_public_read" on storage.objects
  for select using (bucket_id = 'covers');
create policy "covers_admin_write" on storage.objects
  for insert with check (bucket_id = 'covers' and public.is_admin());
create policy "covers_admin_update" on storage.objects
  for update using (bucket_id = 'covers' and public.is_admin());

-- Storage policy: ลูกค้าอัปโหลดสลิปของตัวเองได้ (path ต้องขึ้นต้นด้วย user id ของตัวเอง)
create policy "slips_own_upload" on storage.objects
  for insert with check (
    bucket_id = 'slips' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "slips_own_or_admin_read" on storage.objects
  for select using (
    bucket_id = 'slips' and (
      (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
    )
  );

-- ============================================================
-- เสร็จแล้ว! ขั้นต่อไป: สร้างบัญชีแอดมินคนแรก
-- 1. ไปสมัครสมาชิกในเว็บตามปกติ 1 บัญชี
-- 2. กลับมาที่ SQL Editor รันคำสั่งนี้ (เปลี่ยนอีเมลเป็นของคุณ):
--
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'your-admin-email@example.com');
-- ============================================================
