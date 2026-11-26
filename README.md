# KALARA DISTRO — E-Commerce Web Platform

> "WEAR YOUR STYLE, SHOW YOUR IDENTITY."  
> *Karya Lokal, Rasa Anak Muda.*

KALARA DISTRO adalah platform e-commerce fashion streetwear lokal berbasis React, Vite, TypeScript, Tailwind CSS, dan Supabase PostgreSQL. Didesain dengan estetika modern editorial streetwear bernuansa monokrom (black & white), typography presisi, dan arsitektur atomic checkout yang aman.

---

## 🌟 FITUR UTAMA

### 1. Customer Storefront
- **Homepage Editorial**: Hero section modern, value proposition, kategori showcase, featured streetwear, dan drop new arrivals.
- **Shop / Product Catalog**: Multi-filtering berdasarkan kategori, range harga (IDR), search realtime, dan multi-sorting (harga terendah, harga tertinggi, terbaru, nama).
- **Product Detail**: Galeri multi-foto, selector varian interaktif (Size & Color), stok realtime checker, deskripsi material 240+ GSM, dan jaminan authentic.
- **Shopping Cart Drawer & Dedicated Cart Page**: Kelola kuantitas, validasi batas stok otomatis, subtotal akurat.
- **Guest Checkout**: Pelanggan dapat berbelanja langsung tanpa wajib membuat akun terlebih dahulu.
- **Atomic Stock Check & Pricing**: Harga dan stok diverifikasi langsung di server/database PostgreSQL melalui Supabase RPC Function (`create_order_atomic`), mencegah race condition dan manipulasi harga dari client-side.
- **Order Confirmation & Realtime Order Tracking**: Lacak progres status pesanan (`pending` → `confirmed` → `processing` → `shipped` → `completed`) dan nomor resi kurir via nomor pesanan dan email.
- **About Us & Contact Page**: Brand story filosofi Bandung, Google Map storefront, email support, dan direct WhatsApp customer service.

### 2. Admin Management Dashboard
- **Admin Authentication**: Akses portal terproteksi (Demo Passcode: `kalara2026`).
- **Dashboard Overview**: Metrik total pendapatan (lifetime revenue), jumlah pesanan aktif, total produk katalog, dan peringatan stok menipis (Low Stock Alert).
- **Order Management & Dispatch**: Kelola status pesanan, verifikasi status pembayaran manual, dan update nomor resi pengiriman kurir (JNE / J&T / SiCepat).
- **Product Management (CRUD)**: Tambah, edit, dan hapus artikel streetwear lengkap dengan varian ukuran dan harga.
- **Category Management (CRUD)**: Kelola taksonomi kategori streetwear.
- **Customer Directory**: Database direktori pelanggan beserta riwayat transaksi belanja.
- **Store Settings**: Konfigurasi nama rekening bank, nomor rekening BCA, flat tarif ongkos kirim, dan kontak resmi toko.

---

## 🛠️ TEKNOLOGI YANG DIGUNAKAN

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State & Routing**: React Router v7, React Context API (Cart & Auth)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Atomic RPC Stored Procedure)
- **Deployment Ready**: Vercel SPA (`vercel.json`)

---

## 🚀 PANDUAN MENJALANKAN SECARA LOKAL

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Website_Kalara
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Catatan: Aplikasi telah dilengkapi mekanisme resilient fallback otomatis sehingga tetap berfungsi optimal saat database Supabase baru dikonfigurasi).*

### 3. Migrasi & Seed Database Supabase
Jalankan file SQL yang tersedia di folder `supabase/migrations/`:
1. `supabase/migrations/01_initial_schema.sql` (Skema tabel, RLS, Indexes, & Atomic RPC `create_order_atomic`)
2. `supabase/migrations/02_seed_data.sql` (Katalog produk streetwear awal & konfigurasi KALARA)

### 4. Jalankan Server Dev
```bash
npm run dev
```
Buka browser pada `http://localhost:5173`.

---

## 🔒 KEAMANAN & INTEGRITAS DATA (SECURITY)
1. **Never Trust Client Data**: Harga unit dan kalkulasi total belanja diverifikasi dan dihitung ulang oleh stored procedure di PostgreSQL database.
2. **Anti-Oversell / Race Condition**: Pemesanan stok menggunakan row-level locking (`FOR UPDATE`) di level database engine.
3. **Anon Key Safe**: Tidak ada Supabase `service_role` key yang diekspos di frontend client.
4. **Row Level Security (RLS)**: Akses mutasi tabel dibatasi sesuai role authentication.

---

## 📦 DEPLOYMENT KE VERCEL
Proyek ini sudah memiliki konfigurasi `vercel.json` rewrite untuk Single Page Application (SPA). Untuk deploy:
1. Hubungkan repo GitHub ke dashboard Vercel.
2. Tambahkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Klik **Deploy**.
