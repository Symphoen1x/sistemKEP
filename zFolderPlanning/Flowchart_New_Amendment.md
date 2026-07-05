# Flowchart Amendment (Pengajuan Perubahan Protokol) — NEW

> **Fitur baru** yang belum ada di flowchart sebelumnya.
> Berdasarkan ruang lingkup di KEP REQUIREMENT: "*Pengajuan protokol dengan perubahan (amendment)*"
> 
> Amendment diajukan ketika peneliti ingin melakukan perubahan pada protokol penelitian yang **sudah disetujui** (sudah mendapat Surat Kelaikan Etik).

---

## Alur Amendment

```mermaid
flowchart TD
    subgraph AmendmentFlow ["PENGAJUAN AMENDMENT (PERUBAHAN PROTOKOL)"]
        direction TB
        
        subgraph ApplicantAmend ["🧑‍🔬 Applicant"]
            AM_Start([Begin]) --> AM_Login[Login]
            AM_Login --> AM_Dashboard[Dashboard Applicant]
            AM_Dashboard --> AM_SelectEC["Pilih Ajuan EC\nyang Sudah Approved"]
            AM_SelectEC --> AM_ChooseAmend["Pilih Menu:\nAjukan Amendment"]
            AM_ChooseAmend --> AM_FillForm["Mengisi Formulir Amendment:\n• Nomor Protokol Awal\n• Deskripsi Perubahan\n• Alasan Perubahan\n• Bagian yang Berubah"]
            AM_FillForm --> AM_Upload["Upload Dokumen:\n• Protokol Revisi (highlight perubahan)\n• Dokumen Pendukung Baru\n  (jika ada)"]
            AM_Upload --> AM_Submit["Submit Amendment\n(Status: Amendment Submitted)"]
        end
        
        subgraph SekAmend ["📋 Sekretariat"]
            SA_Receive["Menerima Notifikasi\nAmendment Baru"] --> SA_Review["Review Dokumen Amendment:\n• Kelengkapan formulir\n• Dokumen perubahan"]
            SA_Review --> SA_Eval{Evaluasi Tingkat\nPerubahan}
            
            SA_Eval -->|Minor\nAmendment| SA_Minor["Perubahan Minor\n(tidak mempengaruhi risiko\netik secara signifikan)"]
            SA_Minor --> SA_ApproveMinor["Sekretariat\nMenyetujui Langsung"]
            
            SA_Eval -->|Major\nAmendment| SA_Major["Perubahan Major\n(mempengaruhi risiko etik,\nmetodologi, atau partisipan)"]
            SA_Major --> SA_Route{Routing Review}
            
            SA_Route -->|Expedited| SA_AssignExp["Assign ke Reviewer\n(min 3 reviewer)"]
            SA_Route -->|Full Board| SA_AssignFB["Assign ke Semua Komite"]
        end
        
        subgraph ReviewerAmend ["🔍 Reviewer"]
            RA_Receive["Menerima Assignment\nReview Amendment"] --> RA_Review["Review Perubahan:\n• Bandingkan dengan versi awal\n• Evaluasi dampak etik"]
            RA_Review --> RA_Feedback["Submit Feedback Amendment"]
        end
        
        subgraph KeputusanAmend ["📋 Sekretariat + 👑 Ketua (jika Full Board)"]
            KA_Compile["Kompilasi Feedback"] --> KA_Decision{Keputusan\nAmendment?}
            
            KA_Decision -->|Approved| KA_Approved["Amendment Disetujui\n(Status: Amendment Approved)"]
            KA_Decision -->|Revision Required| KA_Revision["Perlu Revisi\n(Status: Amendment Revision)"]
            KA_Decision -->|Rejected| KA_Rejected["Amendment Ditolak\n(Status: Amendment Rejected)"]
        end
        
        AM_Submit -.->|"Email Notifikasi"| SA_Receive
        SA_AssignExp -.-> RA_Receive
        SA_AssignFB -.-> RA_Receive
        RA_Feedback -.-> KA_Compile
        SA_ApproveMinor --> KA_Approved
        
        %% Post Decision
        KA_Approved --> PD_UpdateSK["Update Surat Kelaikan Etik\n(versi amendment)"]
        PD_UpdateSK --> PD_SignAmend["Ketua Komisi Etik:\nTanda Tangan"]
        PD_SignAmend --> PD_EmailApproved["Kirim Email ke Applicant:\nAmendment Disetujui +\nSurat Update"]
        PD_EmailApproved --> PD_End1([End])
        
        KA_Revision --> PD_EmailRevision["Kirim Feedback\nke Applicant"]
        PD_EmailRevision --> PD_Fix["Applicant:\nPerbaiki & Upload Ulang"]
        PD_Fix --> SA_Review
        
        KA_Rejected --> PD_EmailRejected["Kirim Email Penolakan\nAmendment ke Applicant\n(Protokol awal tetap berlaku)"]
        PD_EmailRejected --> PD_End2([End])
    end
```

---

## Status Lifecycle Amendment

```mermaid
stateDiagram-v2
    [*] --> AmendmentSubmitted : Applicant submit amendment
    AmendmentSubmitted --> UnderReviewAmend : Sekretariat mulai review
    
    UnderReviewAmend --> AmendmentApproved : Disetujui (minor/major)
    UnderReviewAmend --> AmendmentRevision : Perlu revisi
    UnderReviewAmend --> AmendmentRejected : Ditolak
    
    AmendmentRevision --> AmendmentResubmitted : Applicant upload revisi
    AmendmentResubmitted --> UnderReviewAmend : Sekretariat review ulang
    
    AmendmentApproved --> [*]
    AmendmentRejected --> [*]
```

## Catatan Penting Amendment

| Aspek | Keterangan |
|-------|-----------|
| **Siapa yang bisa ajukan?** | Hanya Applicant yang protokolnya sudah berstatus **Approved** |
| **Minor Amendment** | Perubahan kecil yang tidak mempengaruhi risiko etik secara signifikan. Contoh: perubahan jadwal, penambahan lokasi minor |
| **Major Amendment** | Perubahan besar pada metodologi, partisipan, atau hal yang mempengaruhi risiko etik. Perlu review ulang |
| **Protokol awal** | Jika amendment ditolak, protokol awal (yang sudah approved) **tetap berlaku** |
| **Surat Kelaikan Etik** | Jika amendment disetujui, Surat Kelaikan Etik di-update/addendum |
