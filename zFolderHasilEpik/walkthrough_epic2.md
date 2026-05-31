# Walkthrough: Epic 2 — Manajemen Pengguna (Admin)

Epic 2 mencakup **4 User Story (PB08–PB11)** dengan total **15 Story Points**, dikerjakan oleh Isa (Fullstack) sesuai Sprint Timeline Tim B Mei M3.

---

## Ringkasan Fitur yang Dibangun

### PB08 — Daftar Semua Pengguna
**Route:** `GET /admin/users` → `admin.users.index`

Halaman tabel pengguna sistem dengan:
- **Search bar** (debounced 400ms) berdasarkan nama atau email
- **Filter Role** — dropdown semua 5 role sistem
- **Filter Status** — Aktif / Pending / Nonaktif
- Tombol **Reset** filter muncul otomatis jika ada filter aktif
- **Pagination** 15 per halaman (native Inertia `withQueryString`)
- **Badge** berwarna untuk status dan role di setiap baris
- Tombol **Detail** per baris → menuju halaman Show

### PB09 — Buat Akun Internal
**Route:** `GET /admin/users/create` → `admin.users.create`  
**Route:** `POST /admin/users` → `admin.users.store`

Form pembuatan akun untuk staf internal (Sekretariat / Reviewer / Ketua Komisi Etik):
- Field: Nama, Email, Nomor Telepon (opsional), Alamat (opsional) — **tidak ada field password di form**
- **Pemilihan role menggunakan radio card** — lebih intuitif dari dropdown biasa
- Akun langsung berstatus `active` (beda dengan Applicant/Reviewer self-register yang pending)
- **Password sementara di-generate otomatis** oleh sistem (`Str::random(12)`), di-hash, lalu dikirim via email
- Admin tidak perlu tahu password — user menerimanya di inbox dan diharapkan segera menggantinya lewat halaman Profil

### PB10 — Tambah / Hapus Role
**Route:** `PATCH /admin/users/{user}/roles` → `admin.users.roles`

Di halaman detail pengguna:
- Daftar role yang dimiliki user ditampilkan dengan badge + tombol **Hapus** per baris
- Tombol Hapus di-disable jika user hanya punya 1 role (guard keamanan)
- Dropdown **Tambah Peran** hanya menampilkan role yang belum dimiliki user
- Jika role yang dihapus adalah `active_role_name`, sistem otomatis reset ke role pertama yang tersisa

### PB11 — Aktifkan / Nonaktifkan Akun
**Route:** `PATCH /admin/users/{user}/toggle-status` → `admin.users.toggle-status`

- Toggle sederhana antara `status: active` dan `status: inactive`
- Aksi dilindungi **ConfirmModal** untuk mencegah klik tidak sengaja
- Guard keamanan: Admin tidak bisa menonaktifkan dirinya sendiri
- User yang nonaktif tidak bisa login (sudah dihandle oleh `AuthenticatedSessionController` dari Epic 1)

---

## File yang Dibuat / Dimodifikasi

### Backend (PHP / Laravel)
| File | Keterangan |
|------|-----------|
| [StoreUserRequest.php](file:///c:/Users/User/sistemKEP/app/Http/Requests/Admin/StoreUserRequest.php) | FormRequest validasi buat akun internal |
| [UserManagementController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Admin/UserManagementController.php) | Controller utama 6 method (index, create, store, show, updateRoles, toggleStatus) |
| [NewAccountCredentials.php](file:///c:/Users/User/sistemKEP/app/Mail/NewAccountCredentials.php) | Mailable email kredensial akun baru |
| [new_account_credentials.blade.php](file:///c:/Users/User/sistemKEP/resources/views/emails/new_account_credentials.blade.php) | Template Blade Markdown email |
| [web.php](file:///c:/Users/User/sistemKEP/routes/web.php) | +6 route di grup `admin.` yang sebelumnya kosong |
| [DatabaseSeeder.php](file:///c:/Users/User/sistemKEP/database/seeders/DatabaseSeeder.php) | Fix: akun Admin sekarang dibuat dengan `status: active` |
| [AuthenticatedSessionController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Auth/AuthenticatedSessionController.php) | Tambahan post-Epic 2: role-based redirect setelah login (lihat bagian Tambahan di bawah) |

### Frontend (React / Inertia)
| File | Keterangan |
|------|-----------|
| [Badge.jsx](file:///c:/Users/User/sistemKEP/resources/js/Components/Badge.jsx) | Komponen badge reusable + helper `statusVariant` dan `roleVariant` |
| [ConfirmModal.jsx](file:///c:/Users/User/sistemKEP/resources/js/Components/ConfirmModal.jsx) | Modal konfirmasi aksesibel (Escape key, focus trap) |
| [Admin/Users/Index.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Admin/Users/Index.jsx) | PB08: Tabel pengguna dengan filter, search, pagination |
| [Admin/Users/Create.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Admin/Users/Create.jsx) | PB09: Form buat akun internal dengan radio card role |
| [Admin/Users/Show.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Admin/Users/Show.jsx) | PB10+PB11: Detail, kelola role, toggle status |

---

## Cara Menguji Alur Epic 2

**Prasyarat:** Login sebagai Admin (`admin@example.com` / password dari `.env` atau `admin12345`)

> Setelah login, Admin akan **otomatis diarahkan** ke `/admin/users` (tidak perlu navigasi manual).

1. **PB08 — Daftar Pengguna**
   - Setelah login, halaman `/admin/users` langsung terbuka
   - Coba filter role → hanya user dengan role tersebut muncul
   - Coba search nama/email → tabel berubah dinamis dengan debounce
   - Klik Reset → semua filter kembali ke default

2. **PB09 — Buat Akun Internal**
   - Klik tombol "Buat Akun Internal" di pojok kanan atas
   - Isi nama, email, pilih role (misalnya Sekretariat) — **tidak ada field password**, sistem generate otomatis
   - Klik "Buat Akun" → redirect ke daftar dengan flash success
   - Cek di daftar: user baru muncul dengan badge **Aktif**
   - Untuk melihat temporary password: buka `storage/logs/laravel.log`, cari `"Subject: Kredensial Akun Sistem KEP"`
   - Akun tersebut langsung bisa digunakan login dengan email + temporary password dari log

3. **PB10 — Kelola Role**
   - Klik "Detail" salah satu user
   - Di section "Kelola Peran": tambah role dari dropdown → role baru muncul di daftar
   - Klik "Hapus" di salah satu role → muncul ConfirmModal → konfirmasi → role terhapus
   - Coba hapus role terakhir → tombol Hapus ter-disable (tidak bisa)

4. **PB11 — Toggle Status**
   - Di halaman Detail user: klik "Nonaktifkan Akun" → muncul ConfirmModal
   - Konfirmasi → status berubah menjadi **Nonaktif** (badge merah)
   - Coba login dengan akun tersebut → harus gagal (ditolak sistem dari Epic 1)
   - Kembali ke Detail → klik "Aktifkan Akun" → status kembali **Aktif**

---

## Tambahan Pasca-Epic 2

Dua perbaikan tambahan dilakukan setelah Epic 2 selesai, keduanya masih dalam scope Tim B dan tidak konflik dengan pekerjaan Tim A:

### 1. Role-Based Redirect Setelah Login
**File:** [AuthenticatedSessionController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Auth/AuthenticatedSessionController.php) — method `roleBasedRedirect()`

Sebelumnya semua role diarahkan ke `/dashboard` (blank page). Sekarang:

| Role | Diarahkan Ke | Status |
|------|-------------|--------|
| **Admin** | `/admin/users` | ✅ Aktif |
| **Sekretariat** | `/sekretariat/pending-users` | ✅ Aktif |
| **Applicant** | `/dashboard` (komen, tunggu Epic 3) | ⏳ Tim A |
| **Reviewer** | `/dashboard` (komen, tunggu Epic 3) | ⏳ Tim A |
| **Ketua Komisi Etik** | `/dashboard` (komen, tunggu Epic 3) | ⏳ Tim A |

**Untuk Tim A (Olga & Fajar):** Saat dashboard per role di Epic 3 selesai, uncomment baris yang sesuai di method `roleBasedRedirect()` dan isi nama route-nya. Tidak ada perubahan di tempat lain.

### 2. Klarifikasi Alur Password Akun Internal (PB09)

Form buat akun internal **tidak memiliki field password** — ini by design:
- Sistem men-*generate* password acak 12 karakter secara otomatis (`Str::random(12)`)
- Password di-hash dan disimpan ke database
- Password dikirim ke email user via `NewAccountCredentials` mailable
- Admin tidak pernah melihat password — hanya user yang menerimanya
- User diharapkan mengganti password setelah login pertama melalui halaman Profil

---

## Catatan Penting

> [!NOTE]
> **Email Notifikasi (PB09, PB10, PB11)**
>
> Acceptance criteria menyebutkan email harus terkirim saat buat akun, perubahan role, dan toggle status. Saat ini implementasi menggunakan **`MAIL_MAILER=log`** — email "terkirim" ke `storage/logs/laravel.log`, bukan ke inbox email nyata.
>
> Konfigurasi SMTP sesungguhnya akan dilakukan di **Epic 11 (Konfigurasi Sistem)** saat `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, dll. dikonfigurasi melalui UI Admin.
>
> Untuk PB10 dan PB11, notifikasi role/status hanya di-`Log::info()` saat ini (tidak ada email terpisah). Jika email notifikasi untuk perubahan role dan toggle status juga diperlukan, bisa ditambahkan di Epic 11 bersamaan dengan konfigurasi SMTP.

> [!TIP]
> **Melihat temporary password akun internal yang baru dibuat:**
>
> Buka `storage/logs/laravel.log` dan cari baris yang mengandung `"Subject: Kredensial Akun Sistem KEP"`. Di bawahnya akan tertera email dan temporary password yang bisa langsung digunakan untuk login.
