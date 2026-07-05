# Flowchart Admin Management — NEW

> **Fitur baru** — Workflow khusus untuk role **Admin** yang mengelola sistem.
> Admin bukan bagian dari alur review EC, melainkan mengelola infrastruktur & pengguna sistem.

---

## A. Dashboard Admin — Overview

```mermaid
flowchart TD
    AD_Start([Begin]) --> AD_Login[Login sebagai Admin]
    AD_Login --> AD_Dashboard["Dashboard Admin"]
    AD_Dashboard --> AD_Menu{Pilih Menu}
    
    AD_Menu --> AD_UserMgmt["👥 Manajemen Pengguna"]
    AD_Menu --> AD_TemplateMgmt["📄 Manajemen Template"]
    AD_Menu --> AD_SystemConfig["⚙️ Konfigurasi Sistem"]
    AD_Menu --> AD_Reports["📊 Laporan & Statistik"]
    AD_Menu --> AD_AuditLog["📋 Audit Log"]
    
    AD_UserMgmt --> AD_UserDetail["Lihat Detail\ndi Flowchart Registrasi"]
    AD_TemplateMgmt --> AD_TemplateDetail["Lihat Detail di Bawah"]
    AD_SystemConfig --> AD_ConfigDetail["Lihat Detail di Bawah"]
    AD_Reports --> AD_ReportDetail["Lihat Detail di Bawah"]
    AD_AuditLog --> AD_AuditDetail["Lihat Detail di Bawah"]
```

---

## B. Manajemen Template Dokumen

```mermaid
flowchart TD
    subgraph TemplateMgmt ["MANAJEMEN TEMPLATE"]
        TM_Start(["Menu: Manajemen Template"]) --> TM_List["Daftar Template:\n• Formulir Ringkasan Protokol\n• Formulir Pengajuan Telaah Etik\n• Template Surat Kelaikan Etik\n• Template Laporan Amendment\n• Template Laporan Termination"]
        
        TM_List --> TM_Action{Aksi?}
        
        TM_Action -->|Upload Template Baru| TM_Upload["Upload File Template\n(Format: PDF/DOCX)"]
        TM_Upload --> TM_SetMeta["Set Metadata:\n• Nama Template\n• Versi\n• Deskripsi\n• Tanggal Berlaku"]
        TM_SetMeta --> TM_Publish["Publish Template\n(Tersedia untuk download\noleh Applicant)"]
        
        TM_Action -->|Update Template| TM_Select["Pilih Template\nyang akan di-update"]
        TM_Select --> TM_UploadNew["Upload Versi Baru"]
        TM_UploadNew --> TM_Archive["Versi Lama Diarsipkan\n(tetap tersimpan)"]
        TM_Archive --> TM_Publish
        
        TM_Action -->|Nonaktifkan Template| TM_Deactivate["Nonaktifkan Template\n(tidak tersedia untuk\ndownload baru)"]
        
        TM_Publish --> TM_End([End])
        TM_Deactivate --> TM_End
    end
```

---

## C. Konfigurasi Sistem

```mermaid
flowchart TD
    subgraph SystemConfig ["KONFIGURASI SISTEM"]
        SC_Start(["Menu: Konfigurasi Sistem"]) --> SC_Options{Pilih Konfigurasi}
        
        SC_Options --> SC_Email["📧 Konfigurasi Email\n• SMTP Settings\n• Template Email Notifikasi\n• Daftar Penerima Default"]
        
        SC_Options --> SC_Review["🔍 Konfigurasi Review\n• Min. Reviewer Expedited (default: 3)\n• Min. Reviewer Full Board (default: 5)\n• Default Due Date (hari)\n• Reminder Interval"]
        
        SC_Options --> SC_Status["📋 Konfigurasi Status\n• Daftar Status EC\n• Transisi Status yang Diizinkan\n• Warna/Label Status"]
        
        SC_Options --> SC_General["⚙️ Pengaturan Umum\n• Nama Institusi\n• Logo Institusi\n• Format Nomor Protokol\n• Tahun Akademik Aktif"]
        
        SC_Email --> SC_Save[Simpan Konfigurasi]
        SC_Review --> SC_Save
        SC_Status --> SC_Save
        SC_General --> SC_Save
        
        SC_Save --> SC_End([End])
    end
```

---

## D. Laporan & Statistik

```mermaid
flowchart TD
    subgraph Reports ["LAPORAN & STATISTIK"]
        RP_Start(["Menu: Laporan & Statistik"]) --> RP_Type{Jenis Laporan}
        
        RP_Type --> RP_Summary["📊 Ringkasan Ajuan EC\n• Total ajuan per periode\n• Jumlah per status\n• Rata-rata waktu proses\n• Distribusi jenis review"]
        
        RP_Type --> RP_Reviewer["🔍 Kinerja Reviewer\n• Jumlah review per reviewer\n• Rata-rata waktu review\n• Rating feedback"]
        
        RP_Type --> RP_User["👥 Statistik Pengguna\n• Total user per role\n• User aktif vs non-aktif\n• Registrasi baru per periode"]
        
        RP_Type --> RP_Amendment["📝 Laporan Amendment\n• Total amendment per periode\n• Minor vs Major\n• Status amendment"]
        
        RP_Type --> RP_Termination["⛔ Laporan Termination\n• Total termination per periode\n• Per kategori alasan\n• Safety vs Non-safety"]
        
        RP_Summary --> RP_Export["Export Laporan\n(PDF / Excel)"]
        RP_Reviewer --> RP_Export
        RP_User --> RP_Export
        RP_Amendment --> RP_Export
        RP_Termination --> RP_Export
        
        RP_Export --> RP_End([End])
    end
```

---

## E. Audit Log

```mermaid
flowchart TD
    subgraph AuditLog ["AUDIT LOG"]
        AL_Start(["Menu: Audit Log"]) --> AL_Filter["Filter Log:\n• Rentang Tanggal\n• Jenis Aktivitas\n• User Tertentu\n• Module Tertentu"]
        
        AL_Filter --> AL_View["Tampilkan Log:\n• Timestamp\n• User\n• Aksi\n• Detail Perubahan\n• IP Address"]
        
        AL_View --> AL_Action{Aksi?}
        
        AL_Action --> AL_Detail["Lihat Detail\nPerubahan Lengkap"]
        AL_Action --> AL_Export["Export Log\n(CSV / PDF)"]
        
        AL_Detail --> AL_End([End])
        AL_Export --> AL_End
    end
```

---

## Ringkasan Fitur Admin

| Modul | Deskripsi | Akses |
|-------|-----------|-------|
| **Manajemen Pengguna** | CRUD user, assign/remove role, aktivasi/nonaktifkan akun | Admin only |
| **Manajemen Template** | Upload, update, arsipkan template dokumen | Admin only |
| **Konfigurasi Sistem** | Email, review settings, status, pengaturan umum | Admin only |
| **Laporan & Statistik** | Dashboard analytics, export laporan | Admin, Ketua Komisi Etik |
| **Audit Log** | Tracking semua aktivitas sistem | Admin only |
