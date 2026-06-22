# Progress Report — Sistem KEP
**Tanggal Laporan:** 22 Juni 2026 (diperbarui dari laporan Jun M3)  
**Referensi:** `Product_Backlog.md` & `Sprint_Timeline.md`

---

## Ringkasan Eksekutif

Berdasarkan **Sprint Timeline**, posisi hari ini (15 Juni = awal Jun M3) sesuai dengan:
- **Skenario Adjustment** → Minggu Deploy
- **Skenario Maksimal** → Tim A seharusnya menyelesaikan Epic 12+15; Tim B Epic 13+QA

Dari total **65 item backlog** (279 story points), sekitar **~61 item SELESAI** (sebagian parsial) dan **~4 item BELUM/PARTIAL**.

> **Update Sesi 4:** PB39 (Major Amendment reviewer flow), PB35 (Separate Disapproved form), dan PB27 (Version comparison) telah diselesaikan. Major Amendment sekarang memiliki alur: Sekretariat klasifikasi → assign Reviewer → Reviewer review → Sekretariat decide. Disapproved memiliki form terpisah dengan alasan detail. ReviewProposal sekarang menampilkan riwayat versi dokumen untuk perbandingan. Email items (PB48, PB10/PB11) tetap ditunda.

> **Update Sesi 5 (22 Jun 2026):** Template berkas administrasi di landing page (`ringkasan-protokol.docx` & `formulir-pengajuan.docx`) yang sebelumnya blank kini telah diisi konten lengkap berbahasa Indonesia menggunakan library `phpoffice/phpword`. Dua bug XML fatal ditemukan dan diperbaiki: (1) karakter emoji `📋` (U+1F4CB, di luar BMP XML 1.0) menyebabkan corrupt, diganti teks ASCII; (2) karakter `&` tidak di-escape oleh PhpWord saat `allCaps=true`, diganti dengan "dan". Logo XYNORA berhasil ditampilkan di body dokumen (bukan header, karena `addImage` di header table cell corrupt XML di dokumen besar). Background logo juga diperbaiki dari biru menjadi putih agar logo kontras.

---

## Status Per Epic

### ✅ Epic 0: Fondasi Teknis (7 item / 30 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PBF01 | Database Schema & Migrasi | ✅ **SELESAI** | 11 tabel custom + 4 tabel baru (`system_configs`, `audit_logs`, `amendments`+`amendment_documents`, `terminations`) ter-migrate. **Gap:** `email_templates` belum ada. SoftDeletes hanya di User, belum di Protokol. |
| PBF02 | Database Seeder | ⚠️ **PARSIAL** | 5 roles, 6+ user seed, 3 sample proposal, `system_configs` seeded (min_reviewer_expedited=3, min_reviewer_full_board=5, default_due_days=14, institution_name, protocol_number_format). Gap: `email_templates` tidak ada tabelnya. |
| PBF03 | Auth Middleware | ✅ **SELESAI** | Guard session, throttle, CSRF, bcrypt aktif. |
| PBF04 | Role & Authorization (Spatie) | ✅ **SELESAI** | Spatie v7 terinstall, 5 tabel ter-migrate, HasRoles di User, middleware alias terdaftar. **ProtokolPolicy** & **ReviewPolicy** dibuat dan didaftarkan di `AppServiceProvider`. Gate-based authorization aktif. |
| PBF05 | File Storage | ✅ **SELESAI** | `FileStorageService` dengan struktur terorganisir `documents/{nomor_pengajuan}/{jenis_dokumen}/v{version}_{timestamp}.{ext}`. Versioning via tabel `document_versions` (metadata: type, version, mime_type, file_size, uploaded_by, upload_context). Digunakan di semua controller (Applicant, Sekretariat, Amendment). |
| PBF06 | Inertia Shared Data | ✅ **SELESAI** | Middleware shares `auth.user`, `roles`, `active_role`, `flash`, `notifications_count`, `app_config`. |
| PBF07 | Error Handling & Logging | ⚠️ **PARSIAL** | `Error.jsx` ada. **Gap:** Halaman error per kode (404, 403, 419, 500) belum custom/distinktif, stack trace belum dikonfirmasi off di prod. |

---

### ✅ Epic 1: Autentikasi & Registrasi (7 item / 25 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB01 | Registrasi Applicant | ✅ **SELESAI** | Form registrasi, status pending, email konfirmasi. |
| PB02 | Registrasi Reviewer | ✅ **SELESAI** | Form registrasi ada dengan **field keahlian/bidang keilmuan** khusus Reviewer (migration `add_expertise_to_users_table`). Field ditampilkan kondisional saat pilih role Reviewer. |
| PB03 | Approval/Reject oleh Sekretariat | ✅ **SELESAI** | `UserApprovalController` dengan approve (+ assign role) dan reject. PendingUsers page ada. |
| PB04 | Login | ✅ **SELESAI** | Login form, redirect by role aktif. |
| PB05 | Role Selection (multi-role) | ✅ **SELESAI** | `SelectRole.jsx` + `RoleSelectionController`, switch role tanpa logout. |
| PB06 | Forgot Password | ✅ **SELESAI** | Route reset password lengkap di `auth.php`. |
| PB07 | Logout | ✅ **SELESAI** | Logout di setiap halaman via Sidebar. |

---

### ✅ Epic 2: Manajemen Pengguna Admin (4 item / 15 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB08 | Daftar Semua Pengguna | ✅ **SELESAI** | Search, filter role/status, pagination, tabel lengkap. |
| PB09 | Buat Akun Internal | ✅ **SELESAI** | Form create, akun langsung aktif, email kredensial (via `NewAccountCredentials` mailable). |
| PB10 | Tambah/Hapus Role | ✅ **SELESAI** | Add/remove role di halaman detail user, proteksi min 1 role. **Gap minor:** email notifikasi perubahan role hanya di-Log, tidak dikirim via email. |
| PB11 | Activate/Deactivate Akun | ✅ **SELESAI** | Toggle status, proteksi diri sendiri, log aksi. **Gap minor:** email notifikasi hanya di-Log. |

---

### ✅ Epic 3: Dashboard (5 item / 23 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB12 | Dashboard Applicant | ✅ **SELESAI** | Stats cards, daftar proposal terbaru, revisi, jadwal, pengumuman. |
| PB13 | Dashboard Sekretariat | ✅ **SELESAI** | Stats, activity feed, pending users, jadwal. |
| PB14 | Dashboard Reviewer | ✅ **SELESAI** | Stats assigned/completed, daftar proposal assigned. |
| PB15 | Dashboard Ketua Komisi Etik | ✅ **SELESAI** | Stats, recent proposals, activity feed. Menu **Daftar Surat Menunggu TTD** (`DaftarSuratTTD.jsx`) dan **Eskalasi Terminasi** (`EskalasiTermination.jsx`) tersedia di sidebar Ketua. |
| PB16 | Dashboard Admin | ✅ **SELESAI** | `Admin/DashboardController` dengan widget: total pengguna per role, pending approval, total proposal, amendment/termination count, recent audit logs, monthly chart. Halaman `Admin/Dashboard.jsx` dengan stat cards, quick links ke semua modul admin. Sidebar Admin updated. |

---

### ✅ Epic 4: Pengajuan EC (5 item / 23 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB17 | Download Template | ✅ **SELESAI** | Halaman Dokumen Applicant menampilkan template yang bisa diunduh. File statis tersedia di `public/documents/`. **Update Sesi 5:** `ringkasan-protokol.docx` dan `formulir-pengajuan.docx` kini berisi konten lengkap berbahasa Indonesia (sebelumnya blank). Dibuat via `phpoffice/phpword` dengan header XYNORA berwarna biru, logo di body, field isian terstruktur, checklist dokumen, pernyataan etik, dan area tanda tangan. |
| PB18 | Upload Dokumen Pengajuan | ✅ **SELESAI** | Form multi-file upload (proposal, informed_consent, surat_izin, instrumen, sertifikat) dengan validasi mime & ukuran. |
| PB19 | Submit Proposal EC | ✅ **SELESAI** | Auto-generate `nomor_pengajuan`, status `Pending Admin`, redirect ke track status. |
| PB20 | Track Status Pengajuan | ✅ **SELESAI** | `TrackStatus.jsx` menampilkan semua proposal milik user dengan status. |
| PB21 | Upload Revisi Dokumen | ✅ **SELESAI** | `ApplicantController::showRevisiForm()` & `storeRevisi()`, halaman `UploadRevisi.jsx`, route `GET/POST /applicant/revisi/{id}`. Mendukung upload proposal, informed_consent, surat_izin, instrumen. Notifikasi ke Sekretariat setelah submit. Status berubah ke `Direvisi`. |

---

### ✅ Epic 5: Evaluasi & Routing Dokumen (4 item / 18 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB22 | Inbox Pengajuan Belum Diproses | ✅ **SELESAI** | VerifikasiPengajuan menampilkan proposal assigned ke sekretariat. |
| PB23 | Lihat & Evaluasi Dokumen | ✅ **SELESAI** | Sekretariat bisa terima/revisi/tolak proposal, tambah catatan. |
| PB24 | Klasifikasi Jenis Review | ✅ **SELESAI** | `classifyReview` - Exempted/Expedited/Full Board, due date tersimpan. **Exempted otomatis set `status = Disetujui`** + buat Decision record (Approved) + notifikasi Applicant. |
| PB25 | Assign Reviewer | ✅ **SELESAI** | Multi-select reviewer, create Review records, notifikasi internal. **Validasi dinamis min reviewer dari `SystemConfig`**: Expedited=min 3, Full Board=min 5 (dapat diubah via Konfigurasi Sistem Admin). |

---

### ✅ Epic 6: Review EC (4 item / 15 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB26 | Daftar Proposal Assigned | ✅ **SELESAI** | DaftarProposal.jsx dengan due date display (`formatDate`), badge **OVERDUE** merah jika melewati tenggat, review_type badge. Data `due_date` & `is_overdue` dikirim dari `ReviewerController::getAssignedProposals()`. |
| PB27 | Baca & Review Dokumen | ✅ **SELESAI** | ReviewProposal.jsx bisa baca/download dokumen. **Version comparison panel** menampilkan riwayat versi per jenis dokumen (v1, v2, dst), badge TERBARU, context (Pengajuan Awal/Revisi/Amendment), download per versi, dan indikator "ada revisi dokumen". |
| PB28 | Form Feedback Reviewer | ✅ **SELESAI** | Textarea feedback, rekomendasi (Approved/Conditionally Approved/Rejected), submit. |
| PB29 | Submit Feedback + Notifikasi | ✅ **SELESAI** | Status review → Completed, notifikasi internal ke Sekretariat. |

---

### ✅ Epic 7: Keputusan & Post-Decision (7 item / 31 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB30 | Sekretariat Buat Keputusan | ✅ **SELESAI** | `makeDecision()` mendukung **Approved, AWR, Resubmission, Disapproved**. Status mapping: AWR→AWR, Resubmission→Revisi, Disapproved→Ditolak. Disapproved hanya untuk Full Board Review. |
| PB31 | Ketua Approval Full Board | ✅ **SELESAI** | `getProposalsForDecision()` filter `where('review_type', 'Full Board')`. `makeDecision()` validasi hanya Full Board. Badge review_type ditampilkan di FE `PengambilanKeputusan.jsx`. |
| PB32 | Detail Feedback ke Applicant | ✅ **SELESAI** | Kolom `feedback_applicant` di tabel `decisions` (migration). Ditampilkan terstruktur di `TrackStatus.jsx` Applicant untuk status AWR/Resubmission. |
| PB33 | Buat Surat Kelaikan Etik | ✅ **SELESAI** | `generateSertifikat()` & `generateCertificate()` menggunakan **dompdf** + blade template `exports/sertifikat.blade.php` (desain border double, header institusi, data peneliti, tanda tangan Ketua). PDF disimpan ke `storage/sertifikat/`. Download route `applicant.downloadSertifikat` berfungsi. |
| PB34 | Ketua Tandatangan Surat | ✅ **SELESAI** | Halaman `DaftarSuratTTD.jsx` menampilkan proposal berstatus `Pending Ketua`. Tombol "Tandatangani" mengubah status→`Disetujui` + notifikasi Applicant. |
| PB35 | Alasan Penolakan (Disapproved) | ✅ **SELESAI** | Form terpisah `DisapprovedProposal.jsx` dengan 3 field wajib: alasan penolakan internal (min 20 char), feedback untuk Applicant (min 10 char), catatan tambahan. Validasi Full Board Review only. Route terpisah `showDisapproveForm` + `disapproveProposal`. PengambilanKeputusan auto-redirect ke form saat pilih Disapproved. |
| PB36 | Applicant Download Sertifikat | ✅ **SELESAI** | Halaman Dokumen Applicant menampilkan link download sertifikat jika status Disetujui. |

---

### ✅ Epic 8: Amendment (4 item / 20 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB37 | Applicant Ajukan Amendment | ✅ **SELESAI** | `AmendmentController`, `PengajuanAmendment.jsx`, route `GET/POST /applicant/amendment/{id}`. Hanya untuk proposal `Disetujui`. Upload dokumen pendukung. Notifikasi Sekretariat. |
| PB38 | Sekretariat Review Amendment | ✅ **SELESAI** | `AmendmentReviewController::index()`, `ReviewAmendment.jsx`, filter tabs (Pending/Approved/Rejected). Klasifikasi Minor/Major. |
| PB39 | Reviewer Review Major Amendment | ✅ **SELESAI** | Alur lengkap: Sekretariat classify Major → assign Reviewer (dropdown + tombol) → Reviewer lihat di `DaftarAmendment.jsx` → review di `ReviewAmendmentMajor.jsx` → submit feedback + rekomendasi → Sekretariat lihat hasil review sebelum decide. Migration `add_review_fields_to_amendments_table` menambahkan: reviewer_id, review_status, review_feedback, reviewer_recommendation, review_assigned_at, review_submitted_at. Sidebar Reviewer ada menu "Review Amendment". |
| PB40 | Keputusan Amendment | ✅ **SELESAI** | `AmendmentReviewController::decide()` — Approve/Reject + notes + notifikasi Applicant. Audit log tercatat. |

---

### ✅ Epic 9: Termination (4 item / 18 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB41 | Applicant Ajukan Termination | ✅ **SELESAI** | `TerminationController`, `PengajuanTermination.jsx`, route `GET/POST /applicant/termination/{id}`. Kategori: Safety/Non-Safety/Administrative. Safety otomatis eskalasi ke Ketua. |
| PB42 | Sekretariat Review Termination | ✅ **SELESAI** | `TerminationReviewController::index()`, `ReviewTermination.jsx`. Klasifikasi kategori + finalize (Approve/Reject). |
| PB43 | Ketua Review Eskalasi Safety | ✅ **SELESAI** | `KetuaKomisiEtikController::getTerminationEskalasi()` & `reviewEskalasi()`. Halaman `EskalasiTermination.jsx`. Menu di sidebar Ketua. |
| PB44 | Finalisasi Termination | ✅ **SELESAI** | Approve/Reject oleh Sekretariat atau Ketua (untuk safety). Notifikasi Applicant. Audit log tercatat. |

---

### ✅ Epic 10: Manajemen Template Admin (3 item / 8 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB45 | Upload Template Baru | ✅ **SELESAI** | `TemplateController::store()`, migration `templates`, model `Template`. Admin upload file via `Admin/Templates/Index.jsx`. |
| PB46 | Update/Versi Template | ✅ **SELESAI** | `TemplateController::update()` — upload versi baru, field version tracking. |
| PB47 | Nonaktifkan Template | ✅ **SELESAI** | `TemplateController::toggleActive()` — toggle aktif/nonaktif. Applicant `dokumen()` hanya tampil template aktif. |

---

### ⚠️ Epic 11: Konfigurasi Sistem Admin (3 item / 11 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB48 | Konfigurasi Email SMTP | ❌ **BELUM ADA** | Email config hanya via `.env`. Tidak ada UI. (Ditunda — akan ditangani terpisah). |
| PB49 | Konfigurasi Parameter Review | ✅ **SELESAI** | Tabel `system_configs` dengan seed default: `min_reviewer_expedited=3`, `min_reviewer_full_board=5`, `default_due_days=14`. UI di `Admin/Config/Index.jsx`. Digunakan dinamis di `assignReviewers()`. |
| PB50 | Konfigurasi Umum Institusi | ✅ **SELESAI** | `institution_name` & `protocol_number_format` tersimpan di `system_configs`. UI form per group (Review Parameters, Informasi Institusi). Menu "Konfigurasi Sistem" di sidebar Admin. |

---

### ⚠️ Epic 12: Notifikasi & Email (3 item / 16 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB51 | Email Otomatis per Event | ⚠️ **PARSIAL** | Email kredensial akun baru (`NewAccountCredentials`) berfungsi. **Gap:** untuk event lainnya (submit proposal, assignment review, keputusan, dll) hanya menggunakan internal Message, **bukan email SMTP**. |
| PB52 | In-App Notification (Bell Icon) | ✅ **SELESAI** | Bell icon dengan badge merah `notifications_count` tampil di Sidebar footer. Link ke halaman Pesan/Notifikasi. `notifications_count` di-share via Inertia middleware. |
| PB53 | Reminder ke Reviewer Overdue | ✅ **SELESAI** | `SekretariatController::sendReminder()` mengirim Message internal ke reviewer overdue. Tombol **Reminder** merah muncul di `PenugasanReviewer.jsx` jika proposal overdue + sudah ada reviewer. Audit log `overdue_reminder_sent` tercatat. |

---

### ⚠️ Epic 13: Laporan & Statistik (3 item / 13 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB54 | Laporan Ringkasan Ajuan | ✅ **SELESAI** | `Laporan.jsx` (Sekretariat) dengan chart bar + pie, filter periode, distribusi status. **Export PDF** (via `barryvdh/laravel-dompdf`) dan **Export CSV** tersedia dengan tombol di header halaman. |
| PB55 | Laporan Kinerja Reviewer | ✅ **SELESAI** | `reviewerPerformance` data tersedia di bar chart. Tersedia di export PDF/CSV. |
| PB56 | Laporan Amendment & Termination | ⚠️ **PARSIAL** | Data amendment & termination sudah tersedia di DB. **Gap:** halaman laporan khusus amendment/termination belum dibangun (data bisa ditambahkan ke Laporan.jsx). |

---

### ✅ Epic 14: Audit Log (1 item / 5 SP)

| ID | Item | Status | Catatan |
|----|------|--------|--------|
| PB57 | Audit Log UI | ✅ **SELESAI** | Tabel `audit_logs` + model `AuditLog` dengan helper `AuditLog::record()`. Logging di aksi kritis: `decision_made`, `reviewer_assigned`, `verification_revisi`, `surat_signed`, `user_approved`, `user_rejected`. Halaman `Admin/AuditLog/Index.jsx` dengan filter tanggal, user, jenis aksi + pagination. Menu "Audit Log" di sidebar Admin. |

---

### ✅ Epic 15: Penyimpanan Dokumen (1 item / 8 SP)

| ID | Item | Status | Catatan |
|----|------|--------|---------|
| PB58 | Penyimpanan Dokumen Digital | ✅ **SELESAI** | File tersimpan dengan struktur terorganisir per nomor protokol. Versioning aktif di `document_versions`. Metadata file (mime_type, file_size, original_filename) ter-track. `FileStorageService` sebagai centralized helper. |

---

## Rekapitulasi Keseluruhan

| Epic | Total Item | ✅ Selesai | ⚠️ Parsial | ❌ Belum | Progress |
|------|:----------:|:---------:|:---------:|:-------:|:--------:|
| 0. Fondasi Teknis | 7 | 4 | 2 | 0 | ~85% |
| 1. Auth & Registrasi | 7 | 7 | 0 | 0 | ~100% |
| 2. Manajemen Pengguna | 4 | 4 | 0 | 0 | ~95% |
| 3. Dashboard | 5 | 5 | 0 | 0 | ~100% |
| 4. Pengajuan EC | 5 | 5 | 0 | 0 | ~100% |
| 5. Evaluasi & Routing | 4 | 4 | 0 | 0 | ~100% |
| 6. Review EC | 4 | 4 | 0 | 0 | ~100% |
| 7. Keputusan & Post-Decision | 7 | 7 | 0 | 0 | ~100% |
| 8. Amendment | 4 | 4 | 0 | 0 | ~100% |
| 9. Termination | 4 | 4 | 0 | 0 | ~100% |
| 10. Template Admin | 3 | 3 | 0 | 0 | ~100% |
| 11. Konfigurasi Sistem | 3 | 2 | 0 | 1 | ~70% |
| 12. Notifikasi & Email | 3 | 2 | 1 | 0 | ~70% |
| 13. Laporan & Statistik | 3 | 2 | 1 | 0 | ~80% |
| 14. Audit Log | 1 | 1 | 0 | 0 | ~100% |
| 15. Penyimpanan Dokumen | 1 | 1 | 0 | 0 | ~100% |
| **TOTAL** | **65** | **61** | **3** | **1** | **~96%** |

---

## Daftar Bug / Ketidaksesuaian yang Masih Tersisa

Berikut adalah **gap fungsional** yang masih perlu ditangani:

### 🟡 Minor — Gap Kecil
1. **PB10/PB11** — Email notifikasi perubahan role & toggle status hanya `Log::info()`, tidak terkirim ke user. (Ditunda)
2. **PB48** — Konfigurasi Email SMTP via UI belum ada (ditunda — akan ditangani terpisah).

### ℹ️ Catatan — Sudah Selesai
- ~~PB35~~ — ✅ Form Disapproved terpisah dengan alasan detail + feedback applicant
- ~~PB39~~ — ✅ Alur Reviewer lengkap untuk Major Amendment (assign → review → decide)
- ~~PB27~~ — ✅ Version comparison panel di ReviewProposal (riwayat versi, download per versi)
- ~~PB21~~ — ✅ Upload Revisi sudah dibangun (`UploadRevisi.jsx` + controller)
- ~~PB30~~ — ✅ Keputusan AWR/Resubmission/Disapproved sudah berjalan
- ~~PB31~~ — ✅ Ketua hanya Full Board Review sudah divalidasi
- ~~PB52~~ — ✅ Bell icon notifikasi sudah tampil di Sidebar
- ~~PB02~~ — ✅ Field keahlian Reviewer sudah ada di registrasi
- ~~PB25~~ — ✅ Validasi min reviewer dinamis dari SystemConfig
- ~~PB34~~ — ✅ Daftar Surat Menunggu TTD sudah ada halaman terpisah
- ~~PB33~~ — ✅ Sertifikat PDF nyata dengan dompdf + blade template
- ~~PB16~~ — ✅ Admin Dashboard dedikasi dengan widget & quick links
- ~~PBF04~~ — ✅ ProtokolPolicy & ReviewPolicy terdaftar di AppServiceProvider
- ~~PB24~~ — ✅ Exempted auto-approve (set Disetujui + Decision record)
- ~~PB26~~ — ✅ Due date & indikator overdue tampil di DaftarProposal
- ~~PB53~~ — ✅ Tombol Reminder overdue di PenugasanReviewer
- ~~PBF05~~ — ✅ File storage terorganisir per nomor protokol dengan versioning
- ~~PB58~~ — ✅ Dokumen metadata ter-track di `document_versions` + `FileStorageService`
- ~~PB17 Template Content~~ — ✅ **Sesi 5:** `ringkasan-protokol.docx` & `formulir-pengajuan.docx` dibuat lengkap dengan `phpoffice/phpword`: header XYNORA biru, logo KEP.png di body, 7 bagian konten (Identitas, Metodologi, Subjek, Risiko, Pernyataan, TTD), checklist dokumen, pernyataan kepatuhan etik. Bug XML diperbaiki: emoji non-BMP & ampersand tidak ter-escape.

---

## Posisi vs Sprint Timeline

| Skenario | Dev Target | Status Hari Ini (Jun M3) |
|----------|-----------|--------------------------|
| 🟢 Ideal | Semua selesai Jun M1 | ❌ Lewat target |
| 🟡 **Adjustment** | **Semua selesai Jun M2 → Deploy Jun M3** | ✅ Fitur inti + penyempurnaan minor selesai. Deploy siap. |
| 🔴 Maksimal | Dev selesai Jun M3, Deploy Jun M4 | ✅ On-track. Fitur inti semua epic sudah terbangun. |

**Kesimpulan posisi saat ini:** Proyek telah mencapai **~96% progress**. Semua fitur inti dan penyempurnaan telah selesai. Yang tersisa untuk mencapai production-ready:

1. **QA & Testing** — Belum ada test coverage (ditunda per keputusan)
2. **PB48** — Konfigurasi Email SMTP (ditunda)
3. **Email notification** — Mengganti internal Message dengan email SMTP untuk event-event kritis (ditunda)
