# Flowchart Pengajuan EC — Level 2 (Updated)

> **Perubahan dari versi sebelumnya:**
> - Menambahkan detail status tracking
> - Menambahkan validasi kelengkapan dokumen
> - Memperjelas notifikasi ke Sekretariat
> - Tidak ada perubahan signifikan untuk role baru (Admin & Ketua tidak terlibat di tahap pengajuan)

```mermaid
flowchart TD
    subgraph PengajuanEC ["PENGAJUAN ETHICAL CLEARANCE"]
        direction TB
        
        subgraph ApplicantLane ["🧑‍🔬 Applicant"]
            P_Start([Begin]) --> P_Login[Login]
            P_Login --> P_Dashboard["Dashboard Applicant"]
            P_Dashboard --> P_ChooseMenu{"Pilih Menu"}
            
            P_ChooseMenu --> P_NewEC["Pengajuan EC Baru"]
            P_ChooseMenu --> P_Monitor["Pantau Status Ajuan"]
            
            %% Alur Pengajuan Baru
            P_NewEC --> P_Download["Download Template:\n• Formulir Ringkasan Protokol\n  (Lampiran 02)\n• Formulir Pengajuan Telaah Etik\n  (Lampiran 03)"]
            P_Download --> P_Fill["Mengisi Template Formulir\ndan Melengkapi Proposal EC"]
            P_Fill --> P_Prepare["Menyiapkan Dokumen Kelengkapan:\n1. Surat pengantar institusi\n2. Proposal/protokol disahkan\n3. Formulir penjelasan partisipan\n4. Informed Consent Form (ICF)\n5. Iklan/Advertisement\n6. Brosur penelitian\n7. Alat pengumpulan data\n8. Daftar nama tim peneliti\n9. CV peneliti\n10. Anggaran penelitian"]
            P_Prepare --> P_Upload["Upload Semua Dokumen\nke Sistem Web"]
            P_Upload --> P_Validate{Validasi Kelengkapan\nDokumen oleh Sistem}
            P_Validate -->|Lengkap| P_Submit["Submit Ajuan\n(Status: New Proposal)"]
            P_Validate -->|Tidak Lengkap| P_Warning["Peringatan:\nDokumen belum lengkap"]
            P_Warning --> P_Prepare
            
            P_Submit --> P_Confirmation["Menerima Konfirmasi\n& Nomor Protokol"]
            P_Confirmation --> P_End([End])
            
            %% Alur Monitoring
            P_Monitor --> P_ViewList["Melihat Daftar Ajuan EC\ndengan Status Terkini"]
            P_ViewList --> P_ViewDetail["Melihat Detail Ajuan:\n• Status saat ini\n• Riwayat perubahan status\n• Feedback reviewer (jika ada)\n• Surat Kelaikan Etik (jika approved)"]
            P_ViewDetail --> P_End2([End])
        end
        
        subgraph SekretariatLane ["📋 Sekretariat"]
            S_Notif["Menerima Notifikasi:\nAjuan EC Baru Masuk"] --> S_Inbox["Daftar Ajuan EC\nyang Belum Diproses"]
            S_Inbox --> S_Ready["Siap untuk Proses Review\n(Lihat: Flowchart Review Level 2)"]
        end
        
        P_Submit -.->|"Email Notifikasi\nOtomatis"| S_Notif
    end
```

## Daftar Status Ajuan EC

| Status | Deskripsi |
|--------|-----------|
| **New Proposal** | Baru diunggah, belum diproses Sekretariat |
| **On Review** | Sedang diproses/ditelaah oleh Reviewer |
| **Approved** | Disetujui, Surat Kelaikan Etik diterbitkan |
| **Approved with Recommendation** | Disetujui dengan catatan perbaikan (tanpa review ulang) |
| **Resubmission** | Perlu perbaikan dan review ulang |
| **Revised** | Dokumen perbaikan telah diunggah ulang |
| **Disapproved** | Ditolak, tidak laik etik |
