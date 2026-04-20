# Flowchart Level 1 — Alur Utama Sistem KEP (Updated)

> **Perubahan dari versi sebelumnya:**
> - Menambahkan role **Admin** (manajemen sistem & pengguna)
> - Menambahkan role **Ketua Komisi Etik** (persetujuan akhir & tanda tangan Surat Kelaikan Etik pada Full Board Review)
> - Menambahkan jalur **Amendment** (pengajuan perubahan protokol setelah approval)
> - Menambahkan jalur **Termination** (penghentian dini protokol)

```mermaid
flowchart TD
    Start([Begin]) --> HasAccount{Sudah punya akun?}
    
    HasAccount -->|Tidak| Register[Registrasi Akun]
    Register --> WaitApproval[Menunggu Aktivasi oleh Sekretariat]
    WaitApproval --> Login[Login]
    
    HasAccount -->|Ya| Login
    
    Login --> Dashboard[Dashboard Peneliti]
    Dashboard --> ChooseAction{Pilih Aksi}
    
    ChooseAction --> NewSubmission[Pengajuan EC Baru]
    ChooseAction --> AmendmentAction[Pengajuan Amendment]
    ChooseAction --> TerminationAction[Pengajuan Termination]
    ChooseAction --> MonitorStatus[Memantau Status Ajuan]
    
    %% === ALUR PENGAJUAN EC BARU ===
    NewSubmission --> DownloadTemplate[Download Template]
    DownloadTemplate --> FillTemplate[Mengisi Template]
    FillTemplate --> UploadDoc[Unggah Dokumen Ajuan EC & Kelengkapan]
    UploadDoc --> StatusNew["Status: New Proposal"]
    StatusNew --> ReviewProcess
    
    %% === SUBPROSES REVIEW ===
    subgraph ReviewProcess [Proses Review - Sekretariat & Reviewer & Ketua]
        EvalDoc[Evaluasi Dokumen oleh Sekretariat] --> ReviewType{Jenis Review?}
        
        ReviewType -->|Exempted from Review| ExemptApprove["Approved secara langsung"]
        
        ReviewType -->|Expedited Review| AssignReview["Assign ke Reviewer\n(min 3 reviewer)"]
        AssignReview --> ReviewerFeedback1[Reviewer memberikan Feedback]
        ReviewerFeedback1 --> SecDecision1[Keputusan Sekretariat]
        
        ReviewType -->|Full Board Review| AssignFullBoard["Assign ke Semua Komite\n(min 5 reviewer/semua)"]
        AssignFullBoard --> ReviewerFeedback2[Reviewer memberikan Feedback]
        ReviewerFeedback2 --> FullBoardMeeting["Rapat Panel\n(dipimpin Ketua Komisi Etik)"]
        FullBoardMeeting --> SecDecision2[Keputusan Sekretariat\n+ Ketua Komisi Etik]
    end
    
    %% === KEPUTUSAN EXPEDITED ===
    SecDecision1 --> Decision1{Hasil Review?}
    Decision1 -->|Approved| ApprovedState1
    Decision1 -->|Approved with\nRecommendation| AWR1[Approved with Recommendation]
    Decision1 -->|Resubmission| Resub1[Resubmission]
    
    %% === KEPUTUSAN FULL BOARD ===
    SecDecision2 --> Decision2{Hasil Review?}
    Decision2 -->|Approved| ApprovedState1
    Decision2 -->|Approved with\nRecommendation| AWR1
    Decision2 -->|Resubmission| Resub1
    Decision2 -->|Disapproved| Disapproved1[Ajuan Ditolak]
    
    %% === EXEMPTED ===
    ExemptApprove --> ApprovedState1
    
    %% === FLOW AFTER DECISION ===
    ApprovedState1["Status: Approved"] --> GenerateSK["Ketua Komisi Etik\nmenandatangani\nSurat Kelaikan Etik"]
    GenerateSK --> GetSK[Peneliti mendapatkan\nSurat Kelaikan Etik]
    GetSK --> End1([End])
    
    AWR1 --> SendFeedback1[Kirim Email Feedback ke Peneliti]
    SendFeedback1 --> Perbaikan1[Peneliti Melakukan Perbaikan]
    Perbaikan1 --> UploadRevised1[Unggah Perbaikan]
    UploadRevised1 --> GetSK
    
    Resub1 --> SendFeedback2[Kirim Email Feedback ke Peneliti]
    SendFeedback2 --> Perbaikan2[Peneliti Melakukan Perbaikan]
    Perbaikan2 --> UploadRevised2["Unggah Ulang\n(Status: Revised)"]
    UploadRevised2 --> EvalDoc
    
    Disapproved1 --> SendRejection[Kirim Email Penolakan\ndengan Alasan]
    SendRejection --> End2([End])
    
    %% === ALUR AMENDMENT ===
    AmendmentAction --> AmendmentProcess["Lihat Detail di\nFlowchart Amendment"]
    
    %% === ALUR TERMINATION ===
    TerminationAction --> TerminationProcess["Lihat Detail di\nFlowchart Termination"]
    
    %% === MONITOR ===
    MonitorStatus --> ViewStatus[Melihat Status & Riwayat Ajuan]
    ViewStatus --> End3([End])
```

## Catatan Perubahan Role

### Ketua Komisi Etik
- Memimpin **Rapat Panel** pada Full Board Review
- Memberikan persetujuan akhir bersama Sekretariat pada Full Board Review
- Menandatangani **Surat Kelaikan Etik** (untuk semua jalur review)
- Memiliki akses untuk monitoring seluruh ajuan

### Admin
- Tidak terlibat langsung dalam alur review EC
- Workflow terpisah: manajemen user, template, dan konfigurasi sistem
- Detail di flowchart terpisah (Admin Management)
