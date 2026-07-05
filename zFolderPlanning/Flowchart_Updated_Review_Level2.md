# Flowchart Review/Pemrosesan EC — Level 2 (Updated)

> **Perubahan dari versi sebelumnya:**
> - Menambahkan **Ketua Komisi Etik** pada alur Full Board Review (memimpin rapat panel & persetujuan akhir)
> - Menambahkan proses **penandatanganan Surat Kelaikan Etik** oleh Ketua Komisi Etik
> - Memperjelas alur Disapproved dengan pembuatan alasan dan notifikasi

---

## A. Alur Pemrosesan oleh Sekretariat (Evaluasi & Routing)

```mermaid
flowchart TD
    subgraph MainReview ["PEMROSESAN EC - SEKRETARIAT"]
        S_Start([Begin]) --> S_Login[Login sebagai Sekretariat]
        S_Login --> S_Dashboard[Dashboard Sekretariat]
        S_Dashboard --> S_Inbox["Inbox: Daftar EC\nyang Belum Diproses"]
        S_Inbox --> S_Select["Pilih EC yang\nHendak Diproses"]
        S_Select --> S_ViewDoc["Melihat Proposal &\nDokumen EC"]
        S_ViewDoc --> S_Eval["Evaluasi Dokumen\n(Kelengkapan & Kesesuaian)"]
        
        S_Eval --> S_ReviewType{Tentukan Jenis Review}
        
        S_ReviewType -->|Exempted from Review| ExemptFlow["Status: Approved\n(tanpa telaah)"]
        ExemptFlow --> GenSK_Exempt

        S_ReviewType -->|Expedited Review| ExpFlow["Lihat: Alur Expedited Review"]
        
        S_ReviewType -->|Full Board Review| FBFlow["Lihat: Alur Full Board Review"]
    end
```

---

## B. Alur Expedited Review (min 3 Reviewer)

```mermaid
flowchart TD
    subgraph ExpeditedReview ["EXPEDITED REVIEW"]
        direction TB
        
        subgraph SekLane ["📋 Sekretariat"]
            E_Start(["Dari: Evaluasi Dokumen\n(Expedited Review)"]) --> E_Assign["Assign Dokumen ke Reviewer\n(min 3 reviewer)\nSet Due Date"]
            E_Assign --> E_SendEmail["Kirim Email ke Reviewer\nyang Ditunjuk"]
        end
        
        subgraph ReviewerLane ["🔍 Reviewer"]
            R_Receive["Menerima Email\nAssignment Review"] --> R_Login["Login & Pilih Role\nsebagai Reviewer"]
            R_Login --> R_Select["Pilih Ajuan EC\ndari Daftar Review"]
            R_Select --> R_Review["Review Dokumen:\n• Proposal\n• Formulir EC\n• Dokumen Pendukung"]
            R_Review --> R_Feedback["Menambahkan Feedback\n(Catatan & Rekomendasi)"]
            R_Feedback --> R_Submit["Submit Feedback\n(Notifikasi ke Sekretariat)"]
        end
        
        subgraph SekDecision ["📋 Sekretariat - Keputusan"]
            SD_Receive["Menerima Notifikasi\nFeedback Masuk"] --> SD_CheckAll{"Semua Reviewer\nSudah Submit?"}
            SD_CheckAll -->|Belum| SD_Wait["Menunggu Feedback\nReviewer Lain"]
            SD_CheckAll -->|Sudah| SD_Compile["Kompilasi Semua\nFeedback Reviewer"]
            SD_Compile --> SD_Decision["Keputusan Sekretariat"]
            SD_Decision --> SD_Result{Hasil Keputusan?}
            
            SD_Result -->|Approved| SD_Approved["Status: Approved\n(Approved=true,\nApproved with Recommendation=false,\nResubmission=false)"]
            
            SD_Result -->|Approved with\nRecommendation| SD_AWR["Status: Approved with Recommendation\n(Approved=false,\nApproved with Recommendation=true,\nResubmission=false)"]
            
            SD_Result -->|Resubmission| SD_Resub["Status: Resubmission\n(Approved=false,\nApproved with Recommendation=false,\nResubmission=true)"]
        end
        
        E_SendEmail -.-> R_Receive
        R_Submit -.-> SD_Receive
        SD_Wait -.-> SD_Receive
        
        %% Output ke alur setelah keputusan
        SD_Approved --> PostDecision["Ke: Alur Setelah Keputusan"]
        SD_AWR --> PostDecision
        SD_Resub --> PostDecision
    end
```

---

## C. Alur Full Board Review (min 5 Reviewer / Semua Komite + Ketua)

```mermaid
flowchart TD
    subgraph FullBoardReview ["FULL BOARD REVIEW"]
        direction TB
        
        subgraph SekFull ["📋 Sekretariat"]
            FB_Start(["Dari: Evaluasi Dokumen\n(Full Board Review)"]) --> FB_Assign["Assign ke Semua Komite\n(min 5 reviewer / semua anggota)"]
            FB_Assign --> FB_SendEmail["Kirim Email ke:\n• Semua Reviewer\n• Ketua Komisi Etik"]
            FB_SendEmail --> FB_Schedule["Jadwalkan Rapat Panel"]
        end
        
        subgraph ReviewerFull ["🔍 Reviewer (Semua Anggota Komite)"]
            RF_Receive["Menerima Email\n& Jadwal Rapat"] --> RF_Login["Login sebagai Reviewer"]
            RF_Login --> RF_Review["Review Dokumen\nSecara Individual"]
            RF_Review --> RF_Feedback["Submit Feedback\nIndividual"]
        end
        
        subgraph KetuaFull ["👑 Ketua Komisi Etik"]
            KF_Receive["Menerima Email\n& Jadwal Rapat"] --> KF_Login["Login sebagai\nKetua Komisi Etik"]
            KF_Login --> KF_ReviewFeedback["Review Semua Feedback\nReviewer"]
            KF_ReviewFeedback --> KF_Meeting["Memimpin Rapat Panel\n(Full Board Meeting)"]
            KF_Meeting --> KF_Decision["Keputusan Akhir\nbersama Sekretariat"]
        end
        
        subgraph SekDecisionFull ["📋 Keputusan Panel"]
            SDF_Result{Hasil Keputusan\nFull Board?}
            
            SDF_Result -->|Approved| SDF_Approved["Status: Approved"]
            
            SDF_Result -->|Approved with\nRecommendation| SDF_AWR["Status: Approved\nwith Recommendation"]
            
            SDF_Result -->|Resubmission| SDF_Resub["Status: Resubmission"]
            
            SDF_Result -->|Disapproved| SDF_Disapproved["Status: Disapproved\n(Hanya pada Full Board)"]
        end
        
        FB_SendEmail -.-> RF_Receive
        FB_SendEmail -.-> KF_Receive
        RF_Feedback -.-> KF_ReviewFeedback
        KF_Decision --> SDF_Result
        
        SDF_Approved --> PostDecisionFB["Ke: Alur Setelah Keputusan"]
        SDF_AWR --> PostDecisionFB
        SDF_Resub --> PostDecisionFB
        SDF_Disapproved --> PostDecisionFB
    end
```

---

## D. Alur Setelah Keputusan (Post-Decision Flow)

```mermaid
flowchart TD
    subgraph PostDecision ["ALUR SETELAH KEPUTUSAN"]
        direction TB
        
        PD_Start(["Dari: Hasil Keputusan"]) --> PD_Status{Status Keputusan?}
        
        %% APPROVED
        PD_Status -->|Approved| PD_GenSK["Sekretariat:\nMembuat Surat Kelaikan Etik"]
        PD_GenSK --> PD_SignSK["Ketua Komisi Etik:\nMenandatangani\nSurat Kelaikan Etik"]
        PD_SignSK --> PD_UploadSK["Upload Surat ke Sistem"]
        PD_UploadSK --> PD_EmailApproved["Kirim Email ke Applicant:\nPemberitahuan Approved +\nLink Download Surat"]
        PD_EmailApproved --> PD_Download["Applicant:\nDownload Surat Kelaikan Etik"]
        PD_Download --> PD_End1([End])
        
        %% APPROVED WITH RECOMMENDATION
        PD_Status -->|Approved with\nRecommendation| PD_DetailAWR["Sekretariat:\nMenambahkan Detail Feedback\n& Rekomendasi Perbaikan"]
        PD_DetailAWR --> PD_EmailAWR["Kirim Email ke Applicant:\nFeedback + Instruksi Perbaikan"]
        PD_EmailAWR --> PD_ApplicantAWR["Applicant:\nMenerima Feedback"]
        PD_ApplicantAWR --> PD_FixAWR["Applicant:\nMelakukan Perbaikan"]
        PD_FixAWR --> PD_UploadAWR["Applicant:\nUnggah Perbaikan (Revised)"]
        PD_UploadAWR --> PD_GenSK2["Sekretariat:\nMembuat Surat Kelaikan Etik"]
        PD_GenSK2 --> PD_SignSK2["Ketua Komisi Etik:\nMenandatangani\nSurat Kelaikan Etik"]
        PD_SignSK2 --> PD_UploadSK2["Upload Surat ke Sistem"]
        PD_UploadSK2 --> PD_EmailApproved2["Kirim Email ke Applicant:\nSurat Kelaikan Etik"]
        PD_EmailApproved2 --> PD_End2([End])
        
        %% RESUBMISSION
        PD_Status -->|Resubmission| PD_DetailResub["Sekretariat:\nMenambahkan Detail Feedback\n& Catatan Perbaikan"]
        PD_DetailResub --> PD_EmailResub["Kirim Email ke Applicant:\nFeedback + Instruksi Perbaikan"]
        PD_EmailResub --> PD_ApplicantResub["Applicant:\nMenerima Feedback"]
        PD_ApplicantResub --> PD_FixResub["Applicant:\nMelakukan Perbaikan"]
        PD_FixResub --> PD_UploadResub["Applicant:\nUnggah Ulang Dokumen\n(Status: Revised)"]
        PD_UploadResub --> PD_BackToEval["Kembali ke:\nEvaluasi Dokumen\noleh Sekretariat"]
        
        %% DISAPPROVED
        PD_Status -->|Disapproved| PD_Reason["Sekretariat:\nMembuat Alasan Penolakan"]
        PD_Reason --> PD_EmailReject["Kirim Email ke Applicant:\nPenolakan + Alasan"]
        PD_EmailReject --> PD_ApplicantReject["Applicant:\nMenerima Email Penolakan"]
        PD_ApplicantReject --> PD_End3([End])
    end
```

## Ringkasan Keterlibatan Role dalam Review

| Tahap | Sekretariat | Reviewer | Ketua Komisi Etik | Applicant |
|-------|:-----------:|:--------:|:-----------------:|:---------:|
| Evaluasi Dokumen | ✅ | - | - | - |
| Penentuan Jenis Review | ✅ | - | - | - |
| Assign Reviewer | ✅ | - | - | - |
| Review & Feedback | - | ✅ | - | - |
| Rapat Panel (Full Board) | ✅ | ✅ | ✅ Memimpin | - |
| Keputusan Expedited | ✅ | - | - | - |
| Keputusan Full Board | ✅ | - | ✅ Persetujuan | - |
| Buat Surat Kelaikan Etik | ✅ | - | ✅ Tanda tangan | - |
| Terima Surat/Feedback | - | - | - | ✅ |
| Perbaikan & Resubmit | - | - | - | ✅ |
