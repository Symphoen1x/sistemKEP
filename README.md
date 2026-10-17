# Sistem KEP — Komisi Etik Penelitian

Aplikasi web untuk mengelola proses **kelaikan etik penelitian** secara digital, mulai dari pengajuan protokol oleh peneliti, verifikasi oleh sekretariat, review oleh reviewer, keputusan oleh Ketua Komisi Etik, sampai terbitnya **Surat/Sertifikat Kelaikan Etik** dalam format PDF. Sistem ini juga menangani **amendment** (perubahan protokol) dan **termination** (penghentian penelitian) setelah protokol disetujui.

Dibangun dengan **Laravel 12** sebagai backend dan **React 18 + Inertia.js** sebagai frontend (monolith SPA, tanpa REST API terpisah).

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Peran Pengguna](#peran-pengguna)
- [Alur Pengajuan](#alur-pengajuan)
- [Tech Stack](#tech-stack)
- [Kebutuhan Sistem](#kebutuhan-sistem)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Akun Demo](#akun-demo)
- [Konfigurasi](#konfigurasi)
- [Struktur Project](#struktur-project)
- [Testing](#testing)
- [Status Pengembangan](#status-pengembangan)
- [Dokumentasi Tambahan](#dokumentasi-tambahan)

---

## Fitur Utama

| Modul | Deskripsi |
|-------|-----------|
| **Autentikasi & Registrasi** | Registrasi Applicant/Reviewer (dengan field keahlian), approval akun oleh Sekretariat, login, lupa password, dan **multi-role** (pindah role tanpa logout). |
| **Pengajuan Protokol** | Unduh template, unggah dokumen (proposal, informed consent, surat izin, instrumen, sertifikat), nomor pengajuan otomatis, lacak status, dan unggah revisi. |
| **Evaluasi & Routing** | Admin meneruskan pengajuan ke Sekretariat. Sekretariat memverifikasi dokumen, mengklasifikasikan jenis review (**Exempted / Expedited / Full Board**), lalu menugaskan reviewer dengan tenggat waktu. |
| **Review** | Reviewer membaca dokumen (termasuk riwayat versi), memberi feedback dan rekomendasi. Proposal yang lewat tenggat ditandai **OVERDUE** dan bisa dikirimi reminder. |
| **Keputusan** | Keputusan *Approved*, *Approved With Revision (AWR)*, *Resubmission*, atau *Disapproved* (khusus Full Board). Ketua Komisi Etik memutuskan protokol Full Board dan menandatangani surat. |
| **Sertifikat Kelaikan Etik** | Sertifikat PDF dibuat otomatis (dompdf) dan bisa diunduh Applicant setelah disetujui. |
| **Amendment** | Pengajuan perubahan protokol yang sudah disetujui. Sekretariat mengklasifikasikan *Minor/Major*; amendment Major di-review oleh Reviewer. |
| **Termination** | Pengajuan penghentian penelitian (*Safety / Non-Safety / Administrative*). Kategori Safety dieskalasi otomatis ke Ketua. |
| **Jadwal Rapat & Pengumuman** | Sekretariat mengelola jadwal rapat komisi. |
| **Notifikasi** | Notifikasi in-app (ikon lonceng) dan email via EmailJS / SMTP. |
| **Laporan & Statistik** | Grafik ringkasan pengajuan dan kinerja reviewer, ekspor **PDF** dan **CSV**. |
| **Administrasi Sistem** | Manajemen pengguna & role, manajemen template dokumen (dengan versi), konfigurasi parameter review, dan **Audit Log**. |
| **Penyimpanan Dokumen** | File tersimpan terstruktur per nomor pengajuan dengan versioning (`document_versions`). |

## Peran Pengguna

Sistem menggunakan [spatie/laravel-permission](https://spatie.be/docs/laravel-permission) dengan 5 role. Satu akun bisa memiliki lebih dari satu role.

| Role | Prefix URL | Tanggung Jawab |
|------|-----------|----------------|
| **Applicant** (Peneliti) | `/applicant` | Mengajukan protokol, revisi, amendment, termination; mengunduh sertifikat. |
| **Sekretariat** | `/sekretariat` | Menyetujui akun baru, verifikasi dokumen, klasifikasi review, menugaskan reviewer, mengambil keputusan, mengelola jadwal rapat dan surat. |
| **Reviewer** | `/reviewer` | Me-review proposal dan amendment Major yang ditugaskan. |
| **Ketua Komisi Etik** | `/ketua` | Keputusan protokol Full Board, tanda tangan surat, review eskalasi termination Safety, melihat laporan. |
| **Admin** | `/admin` | Manajemen pengguna, routing pengajuan ke Sekretariat, template, konfigurasi sistem, laporan, audit log. |

## Alur Pengajuan

```
Applicant submit protokol
        │
        ▼
Admin meneruskan ke Sekretariat ──► Sekretariat verifikasi dokumen ──(revisi)──► Applicant upload revisi
                                            │
                                            ▼
                               Klasifikasi jenis review
              ┌─────────────────────────┼─────────────────────────┐
          Exempted                  Expedited                 Full Board
       (langsung disetujui)     (min. 3 reviewer)          (min. 5 reviewer)
              │                         │                         │
              │                         ▼                         ▼
              │                 Reviewer memberi feedback & rekomendasi
              │                         │                         │
              │                         ▼                         ▼
              │               Keputusan Sekretariat       Keputusan Ketua
              │                         └────────────┬────────────┘
              ▼                                      ▼
        Surat/Sertifikat Kelaikan Etik ◄── Ketua menandatangani surat
              │
              ▼
   (opsional) Amendment / Termination
```

Jumlah minimum reviewer dan tenggat default dapat diubah Admin di menu **Konfigurasi Sistem**.

## Tech Stack

**Backend**
- PHP 8.2+, Laravel 12
- Inertia.js (Laravel adapter) + Ziggy (route Laravel di JavaScript)
- Laravel Breeze (scaffolding autentikasi), Sanctum
- spatie/laravel-permission — role & permission
- barryvdh/laravel-dompdf — sertifikat & laporan PDF
- phpoffice/phpword — pembuatan template dokumen `.docx`

**Frontend**
- React 18 (functional component + hooks)
- Inertia.js (pengganti React Router)
- Tailwind CSS 3, Headless UI
- Recharts (grafik), lucide-react (ikon), anime.js (animasi)
- Vite 6

**Database & Infrastruktur**
- SQLite (default), bisa diganti MySQL/MariaDB
- Session, cache, dan queue menggunakan driver `database`
- Pest untuk testing

## Kebutuhan Sistem

- PHP **8.2** atau lebih baru, dengan ekstensi `pdo_sqlite` (atau `pdo_mysql`), `mbstring`, `xml`, `zip`, `gd`, `fileinfo`
- Composer 2
- Node.js **18+** dan npm

## Instalasi

```bash
# 1. Clone repository
git clone <url-repository> sistemKEP
cd sistemKEP

# 2. Install dependency PHP dan JavaScript
composer install
npm install

# 3. Siapkan file environment
#    Salin .env yang sudah ada / buat dari template Laravel, lalu generate key
php artisan key:generate

# 4. Siapkan database (SQLite)
#    Buat file database jika belum ada
touch database/database.sqlite      # Windows PowerShell: New-Item database/database.sqlite
php artisan migrate --seed

# 5. Hubungkan folder storage agar dokumen yang diunggah bisa diakses
php artisan storage:link
```

> Untuk memulai dari database kosong dengan data demo: `php artisan migrate:fresh --seed`

## Menjalankan Aplikasi

Cara paling mudah — menjalankan server, queue worker, log viewer, dan Vite sekaligus:

```bash
composer run dev
```

Atau jalankan manual di terminal terpisah:

```bash
php artisan serve          # http://127.0.0.1:8000
npm run dev                # Vite dev server (hot reload)
php artisan queue:listen   # diperlukan untuk email/notifikasi yang di-queue
```

Build aset untuk produksi:

```bash
npm run build
```

## Akun Demo

Tersedia setelah menjalankan `php artisan db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin12345` |
| Sekretariat | `sekre@example.com` | `password` |
| Ketua Komisi Etik | `ketua@example.com` | `password` |
| Reviewer | `reviewer1@example.com` | `password` |
| Reviewer | `reviewer2@example.com` | `password` |
| Applicant (Dosen) | `peneliti@example.com` | `password` |
| Applicant (Mahasiswa) | `pendaftar@example.com` | `password` |

Seeder juga membuat 3 contoh protokol, jadwal rapat, pengumuman, dan pesan.

> ⚠️ Akun ini hanya untuk pengembangan. Jangan jalankan seeder di server produksi.

## Konfigurasi

Variabel penting di `.env`:

```dotenv
APP_NAME=sistemKEP
APP_URL=http://localhost:8000

# Database (default SQLite)
DB_CONNECTION=sqlite
# Untuk MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=sistem_kep
# DB_USERNAME=root
# DB_PASSWORD=

QUEUE_CONNECTION=database
FILESYSTEM_DISK=local

# Email SMTP (kredensial akun baru yang dibuat Admin)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME="${APP_NAME}"

# EmailJS (notifikasi email untuk pesan in-app)
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
```

Jika konfigurasi EmailJS kosong, notifikasi tetap tercatat sebagai pesan in-app dan peringatan ditulis ke log.

Parameter yang dapat diatur dari UI Admin (**Admin → Konfigurasi Sistem**, tabel `system_configs`):

| Key | Default | Keterangan |
|-----|---------|------------|
| `min_reviewer_expedited` | 3 | Minimum reviewer untuk review Expedited |
| `min_reviewer_full_board` | 5 | Minimum reviewer untuk review Full Board |
| `default_due_days` | 14 | Tenggat review default (hari) |
| `institution_name` | — | Nama institusi pada surat/sertifikat |
| `protocol_number_format` | — | Format nomor protokol |

## Struktur Project

```
sistemKEP/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/                 # Dashboard, user, proposal routing, template, config, audit log
│   │   ├── Auth/                  # Login, registrasi, reset password, pemilihan role
│   │   ├── ApplicantController.php
│   │   ├── SekretariatController.php
│   │   ├── ReviewerController.php
│   │   ├── KetuaKomisiEtikController.php
│   │   ├── AmendmentController.php / AmendmentReviewController.php
│   │   ├── TerminationController.php / TerminationReviewController.php
│   │   └── ReportController.php
│   ├── Models/                    # Protokol, Review, Decision, Amendment, Termination, DocumentVersion, AuditLog, ...
│   ├── Policies/                  # ProtokolPolicy, ReviewPolicy
│   ├── Services/                  # FileStorageService (versioning dokumen), EmailJsService
│   └── Mail/                      # NewAccountCredentials
├── database/
│   ├── migrations/
│   └── seeders/                   # DatabaseSeeder (role, akun demo, data contoh)
├── resources/
│   ├── js/
│   │   ├── Pages/                 # Halaman Inertia per role: Applicant, Sekretariat, Reviewer, KetuaKomisiEtik, Admin, Auth
│   │   ├── Components/            # Komponen UI yang dipakai ulang
│   │   └── Layouts/
│   └── views/
│       ├── app.blade.php          # Root view Inertia
│       ├── emails/                # Template email
│       └── exports/               # Template PDF sertifikat & laporan
├── routes/
│   ├── web.php                    # Route dikelompokkan per role (middleware role:...)
│   └── auth.php
├── public/documents/              # Template dokumen yang bisa diunduh peneliti
├── tests/                         # Feature & unit test (Pest)
├── zFolderPlanning/               # Product backlog, ERD, flowchart, sprint timeline, progress report
└── zFolderHasilEpik/              # Walkthrough hasil implementasi per epic
```

**Catatan arsitektur:** frontend memakai functional component + hooks; routing ditangani Laravel melalui Inertia (bukan React Router), dan state data dikelola di sisi Laravel (MVC) — bukan Redux. Detail ada di `zFolderPlanning/2Catatan_Arsitektur_React_Laravel_Inertia.md`.

## Testing

```bash
php artisan test
# atau
./vendor/bin/pest
```

Test tersedia untuk autentikasi, otorisasi role, serta modul Admin, Applicant, Review, dan Sekretariat (`tests/Feature`).

## Status Pengembangan

Berdasarkan progress report terakhir (Juni 2026), sekitar **61 dari 65 item backlog** sudah selesai. Yang masih tersisa:

- **PB48** — UI konfigurasi email SMTP (saat ini hanya lewat `.env`)
- **PB51** — Email otomatis untuk semua event (sebagian besar event baru berupa notifikasi in-app)
- **PB10/PB11** — Email notifikasi perubahan role dan status akun (baru dicatat di log)
- **PB56** — Halaman laporan khusus amendment & termination
- Halaman error kustom per kode HTTP (404/403/419/500)

Rincian lengkap: [`zFolderPlanning/Progress_Report_Jun15_2026.md`](zFolderPlanning/Progress_Report_Jun15_2026.md).

## Dokumentasi Tambahan

| Dokumen | Isi |
|---------|-----|
| [`Product_Backlog.md`](zFolderPlanning/Product_Backlog.md) | Daftar epic & user story beserta story point |
| [`Database_Schema_ERD.md`](zFolderPlanning/Database_Schema_ERD.md) | Skema database dan relasi antar tabel |
| [`Flowchart_INDEX.md`](zFolderPlanning/Flowchart_INDEX.md) | Indeks flowchart (registrasi, pengajuan, review, amendment, termination, admin) |
| [`Sprint_Timeline.md`](zFolderPlanning/Sprint_Timeline.md) | Rencana sprint |
| [`Landing_Page_Spec.md`](zFolderPlanning/Landing_Page_Spec.md) | Spesifikasi landing page |
| `KEP REQUIREMENT.docx` | Dokumen kebutuhan sistem |

---

## Tim Pengembang

- symphoen1x
- Olga
- Farzie

## Lisensi

Project ini dikembangkan untuk keperluan internal Komisi Etik Penelitian. Framework Laravel dirilis di bawah [lisensi MIT](https://opensource.org/licenses/MIT).
