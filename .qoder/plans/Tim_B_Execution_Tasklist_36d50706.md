# Tim B — Urutan Eksekusi Tugas

## Fase 1: Selesaikan Epic 7 (Unblock Epic 8 & 9) [BLOCKER]

> File utama: `app/Http/Controllers/SekretariatController.php`, `app/Http/Controllers/KetuaKomisiEtikController.php`, `resources/js/Pages/Sekretariat/`, `resources/js/Pages/KetuaKomisiEtik/`

### Task 1.1 — Tambah opsi keputusan AWR & Resubmission di Sekretariat (PB30)
- Di `SekretariatController::makeDecision()`: ubah validasi `status` dari `in:Approved,Rejected` menjadi `in:Approved,AWR,Resubmission,Disapproved`
- Logika: jika AWR/Resubmission → status protokol berubah ke `Revisi` atau status baru; jika Disapproved → hanya untuk `review_type = Full Board`
- Update `FormKeputusan` FE (Sekretariat): tambah pilihan AWR, Resubmission, dan Disapproved (Disapproved disable kecuali Full Board)

### Task 1.2 — Pisahkan workflow Ketua: hanya Full Board (PB31)
- Di `KetuaKomisiEtikController::getProposalsForDecision()`: filter `where('review_type', 'Full Board')` — saat ini tidak ada filter
- Di FE `KetuaKomisiEtik/PengambilanKeputusan.jsx`: tampilkan label/badge `review_type` pada setiap proposal

### Task 1.3 — Form detail feedback ke Applicant untuk AWR/Resubmission (PB32)
- Tambah kolom `feedback_applicant` pada tabel `decisions` via migration baru
- Di `makeDecision()`: simpan feedback terstruktur yang bisa dibaca Applicant
- Di `TrackStatus.jsx` atau detail proposal Applicant: tampilkan `feedback_applicant` jika status AWR/Resubmission

### Task 1.4 — Form "Upload Perbaikan" untuk Applicant (PB21)
- Di `ApplicantController`: tambah method `showRevisiForm($id)` dan `storeRevisi($id)`
- Validasi: hanya proposal dengan `status = Revisi` yang bisa direvisi
- FE: tambah halaman baru `Applicant/UploadRevisi.jsx` atau section di `TrackStatus.jsx`
- Route: `GET /applicant/revisi/{id}` dan `POST /applicant/revisi/{id}`
- Setelah submit: ubah `status` ke `Revisi Terkirim` / `On Review` dan kirim notifikasi ke Sekretariat

### Task 1.5 — Tambah halaman "Daftar Surat Menunggu TTD" untuk Ketua (PB34)
- Buat query baru di `KetuaKomisiEtikController`: proposal dengan `status = Pending Ketua`
- FE: tambah menu/halaman `KetuaKomisiEtik/DaftarSuratTTD.jsx`
- Tombol "Tandatangani/Setujui" mengubah status → `Disetujui` dan trigger notifikasi Applicant

---

## Fase 2: Penyempurnaan Epic 1 & 2

### Task 2.1 — Field keahlian untuk registrasi Reviewer (PB02)
- Di `database/migrations`: migration baru tambah kolom `expertise` ke tabel `users`
- Di `resources/js/Pages/Auth/Register.jsx`: tampilkan field keahlian secara kondisional jika user pilih role Reviewer
- Di `RegisteredUserController::store()`: simpan `expertise` ke User

### Task 2.2 — Bell icon notifikasi di Sidebar (PB52)
- Di `resources/js/Components/Sidebar.jsx`: tampilkan badge merah dengan angka `notifications_count` yang sudah di-share via Inertia (data sudah ada, hanya belum dirender)
- Tambah link ke halaman Pesan/Notifikasi dari bell icon tersebut

---

## Fase 3: Epic 10 — Manajemen Template Admin

> New files: migration, model, controller, 2 frontend pages

### Task 3.1 — Database & Model
- Migration: tabel `templates` (id, name, description, version, file_path, is_active, published_at, timestamps)
- Model: `app/Models/Template.php` dengan `fillable` lengkap

### Task 3.2 — Backend Controller & Routes
- Controller: `app/Http/Controllers/Admin/TemplateController.php` — methods: `index`, `create`, `store`, `update`, `toggleActive`
- Routes di `web.php` under `role:Admin`: `GET/POST /admin/templates`, `PATCH /admin/templates/{id}`, `PATCH /admin/templates/{id}/toggle`

### Task 3.3 — Frontend Admin Template
- `resources/js/Pages/Admin/Templates/Index.jsx`: daftar template dengan status, tombol upload versi baru, toggle aktif/nonaktif
- Update `resources/js/Components/Sidebar.jsx`: tambah menu "Manajemen Template" untuk role Admin

### Task 3.4 — Update halaman Dokumen Applicant
- `ApplicantController::dokumen()`: ubah dari file statis ke `Template::where('is_active', true)->get()`
- Update `resources/js/Pages/Applicant/Dokumen.jsx`: render list dari DB

---

## Fase 4: Epic 11 — Konfigurasi Sistem Admin

### Task 4.1 — Database & Model
- Migration: tabel `system_configs` (id, key, value, group, description, timestamps) — seed default: `min_reviewer_expedited=3`, `min_reviewer_full_board=5`
- Model: `app/Models/SystemConfig.php` dengan helper static `get(key)` dan `set(key, value)`

### Task 4.2 — Backend Controller & Routes
- Controller: `app/Http/Controllers/Admin/SystemConfigController.php` — methods: `index`, `update`
- Routes: `GET /admin/config`, `POST /admin/config`

### Task 4.3 — Frontend Admin Config
- `resources/js/Pages/Admin/Config/Index.jsx`: form section per group (Review Parameters, Konfigurasi Institusi)
- Update Sidebar Admin: tambah menu "Konfigurasi Sistem"

### Task 4.4 — Pakai config dinamis di logika yang ada
- Di `SekretariatController::assignReviewers()`: replace hardcoded min reviewer dengan `SystemConfig::get('min_reviewer_expedited')`

---

## Fase 5: Epic 14 — Audit Log

### Task 5.1 — Database & Model
- Migration: tabel `audit_logs` (id, user_id, action, model_type, model_id, old_values, new_values, ip_address, timestamps)
- Model: `app/Models/AuditLog.php`

### Task 5.2 — Logging di Controller
- Buat `AuditLog::record(action, model, old, new)` static helper
- Tambahkan logging di aksi-aksi kritis: user approve/reject, decision made, reviewer assigned, role changed

### Task 5.3 — Frontend Audit Log Admin
- `resources/js/Pages/Admin/AuditLog/Index.jsx`: tabel dengan filter tanggal, user, jenis aksi + pagination
- Route: `GET /admin/audit-log`
- Update Sidebar Admin

---

## Fase 6: Epic 8 — Amendment (setelah Epic 7 selesai)

### Task 6.1 — Database & Model
- Migration: tabel `amendments` (id, protokol_id, user_id, type (Minor/Major), description, reason, changed_sections, status, decided_by, decided_at, notes, timestamps)
- Migration: tabel `amendment_documents` (id, amendment_id, document_type, file_path, timestamps)
- Model: `Amendment` dan `AmendmentDocument` dengan relasi ke Protokol dan User

### Task 6.2 — Backend Controller & Routes
- `AmendmentController` untuk Applicant: `create`, `store` (hanya untuk protokol berstatus `Disetujui`)
- `SekretariatController` atau `AmendmentReviewController`: `index`, `classify` (Minor/Major), `decide`
- Routes di semua role group yang relevan

### Task 6.3 — Frontend
- `Applicant/PengajuanAmendment.jsx`: form deskripsi perubahan + upload dokumen revisi
- `Sekretariat/ReviewAmendment.jsx`: daftar amendment masuk, klasifikasi, keputusan
- Update Dashboard Applicant: tampilkan status amendment

---

## Fase 7: Epic 9 — Termination (setelah Epic 7 selesai)

### Task 7.1 — Database & Model
- Migration: tabel `terminations` (id, protokol_id, user_id, effective_date, reason_category, description, participant_status, safety_measures, is_safety_related, status, decided_by, timestamps)
- Model: `Termination` dengan relasi ke Protokol dan User

### Task 7.2 — Backend Controller & Routes
- `TerminationController` untuk Applicant: `create`, `store` (hanya protokol `Disetujui`)
- `SekretariatController` atau `TerminationReviewController`: `index`, `classify` (Safety/Non-Safety), `finalize`
- `KetuaKomisiEtikController`: method `reviewEskalasi` untuk safety-related termination

### Task 7.3 — Frontend
- `Applicant/PengajuanTermination.jsx`
- `Sekretariat/ReviewTermination.jsx`
- `KetuaKomisiEtik/EskaalasiTermination.jsx`
- Update Dashboard Ketua: tampilkan eskalasi termination

---

## Fase 8: Epic 13 — Completion (Export)

### Task 8.1 — Export PDF/Excel di Laporan
- Install `barryvdh/laravel-dompdf` (PDF) atau `maatwebsite/excel` (Excel)
- Di `SekretariatController::laporan()`: tambah route/action export
- Update `Laporan.jsx`: tambah tombol "Export PDF" dan "Export Excel"

---

## Ringkasan Urutan & Estimasi

| Fase | Epic/Item | Ketergantungan | Prioritas |
|------|-----------|----------------|-----------|
| 1 | Fix Epic 7 (PB30,31,32,21,34) | Blocker untuk Fase 6 & 7 | KRITIS |
| 2 | Fix Epic 1 & 2 (PB02, PB52) | Tidak ada | Tinggi |
| 3 | Epic 10 — Template Admin | Tidak ada | Sedang |
| 4 | Epic 11 — Config Sistem | Tidak ada | Sedang |
| 5 | Epic 14 — Audit Log | Tidak ada | Rendah |
| 6 | Epic 8 — Amendment | Fase 1 harus selesai | Sedang |
| 7 | Epic 9 — Termination | Fase 1 harus selesai | Sedang |
| 8 | Epic 13 — Export Laporan | Tidak ada | Rendah |
* Note: terkait backlog yang berhubungan dengan email/set up email, skip dulu itu akan saya eksekusi dan pertimbangkan terakhir termasuk dalam tahap perbaikan/penyempurnaan!