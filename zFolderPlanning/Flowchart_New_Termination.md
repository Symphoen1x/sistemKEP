# Flowchart Termination (Penghentian Dini Protokol) — NEW

> **Fitur baru** yang belum ada di flowchart sebelumnya.
> Berdasarkan ruang lingkup di KEP REQUIREMENT: "*Protokol dengan penghentian dini (Termination)*"
> 
> Termination dilakukan ketika peneliti menghentikan penelitian **sebelum selesai** setelah protokol sudah disetujui. Bisa karena alasan keamanan partisipan, temuan tak terduga, kendala teknis/pendanaan, atau alasan lainnya.

---

## Alur Termination

```mermaid
flowchart TD
    subgraph TerminationFlow ["PENGAJUAN TERMINATION (PENGHENTIAN DINI)"]
        direction TB
        
        subgraph ApplicantTerm ["🧑‍🔬 Applicant"]
            TM_Start([Begin]) --> TM_Login[Login]
            TM_Login --> TM_Dashboard[Dashboard Applicant]
            TM_Dashboard --> TM_SelectEC["Pilih Ajuan EC\nyang Sudah Approved /\nSedang Berjalan"]
            TM_SelectEC --> TM_ChooseTerm["Pilih Menu:\nAjukan Termination"]
            TM_ChooseTerm --> TM_FillForm["Mengisi Formulir Termination:\n• Nomor Protokol\n• Tanggal Efektif Penghentian\n• Kategori Alasan Penghentian\n• Deskripsi Detail Alasan\n• Status Partisipan Saat Ini\n• Data yang Sudah Dikumpulkan\n• Langkah Pengamanan Partisipan"]
            TM_FillForm --> TM_Upload["Upload Dokumen Pendukung:\n• Laporan Interim (jika ada)\n• Bukti Pendukung"]
            TM_Upload --> TM_Submit["Submit Termination Request\n(Status: Termination Submitted)"]
        end
        
        subgraph SekTerm ["📋 Sekretariat"]
            ST_Receive["Menerima Notifikasi\nTermination Request"] --> ST_Review["Review Formulir\n& Dokumen Termination"]
            ST_Review --> ST_Verify["Verifikasi:\n• Kelengkapan informasi\n• Kejelasan alasan\n• Status partisipan"]
            ST_Verify --> ST_NeedInfo{Informasi\nLengkap?}
            
            ST_NeedInfo -->|Tidak| ST_RequestInfo["Minta Informasi\nTambahan ke Applicant"]
            ST_RequestInfo -.->|"Email"| TM_FillForm
            
            ST_NeedInfo -->|Ya| ST_Classify{Klasifikasi\nTermination}
            
            ST_Classify -->|Safety-Related\nTermination| ST_Urgent["Penghentian Terkait\nKeselamatan Partisipan\n⚠️ Prioritas Tinggi"]
            ST_Urgent --> ST_EscalateKetua["Eskalasi ke\nKetua Komisi Etik"]
            
            ST_Classify -->|Non-Safety\nTermination| ST_Normal["Penghentian Karena:\n• Kendala Teknis\n• Kendala Pendanaan\n• Alasan Pribadi\n• Lainnya"]
            ST_Normal --> ST_Process["Proses Termination\noleh Sekretariat"]
        end
        
        subgraph KetuaTerm ["👑 Ketua Komisi Etik"]
            KT_Receive["Menerima Eskalasi\nSafety Termination"] --> KT_Review["Review Detail\nPenghentian"]
            KT_Review --> KT_Decision{Keputusan}
            
            KT_Decision -->|Terima| KT_Approve["Setujui Termination\n+ Tambahan Instruksi\nPengamanan Partisipan"]
            KT_Decision -->|Perlu\nInvestigasi| KT_Investigate["Instruksikan\nInvestigasi Lebih Lanjut"]
        end
        
        TM_Submit -.->|"Email Notifikasi"| ST_Receive
        ST_EscalateKetua -.-> KT_Receive
        KT_Investigate -.-> ST_Review
        
        %% Final Flow
        ST_Process --> FinalTerm["Finalisasi Termination"]
        KT_Approve --> FinalTerm
        
        FinalTerm --> UpdateStatus["Update Status Protokol:\nTerminated"]
        UpdateStatus --> UpdateSK["Update Status\nSurat Kelaikan Etik:\nTerminated / Dicabut"]
        UpdateSK --> Archives["Arsipkan Dokumen:\n• Formulir Termination\n• Laporan Final\n• Surat Pencabutan"]
        Archives --> NotifyAll["Kirim Notifikasi ke:\n• Applicant (konfirmasi)\n• Reviewer terkait (info)"]
        NotifyAll --> TM_End([End])
    end
```

---

## Status Lifecycle Termination

```mermaid
stateDiagram-v2
    [*] --> TerminationSubmitted : Applicant submit request
    
    TerminationSubmitted --> UnderReviewTerm : Sekretariat review
    
    UnderReviewTerm --> NeedMoreInfo : Informasi kurang
    NeedMoreInfo --> TerminationSubmitted : Applicant lengkapi
    
    UnderReviewTerm --> EscalatedToKetua : Safety-related (eskalasi)
    EscalatedToKetua --> UnderInvestigation : Ketua minta investigasi
    UnderInvestigation --> UnderReviewTerm : Hasil investigasi
    
    UnderReviewTerm --> Terminated : Non-safety (diproses langsung)
    EscalatedToKetua --> Terminated : Ketua setujui
    
    Terminated --> [*]
    
    note right of Terminated
        Surat Kelaikan Etik
        dicabut / ditutup
    end note
```

---

## Kategori Alasan Termination

| Kategori | Contoh | Prioritas | Alur |
|----------|--------|-----------|------|
| **Safety-Related** | Efek samping tak terduga pada partisipan, risiko keselamatan baru ditemukan | 🔴 Tinggi | Eskalasi ke Ketua Komisi Etik |
| **Kendala Teknis** | Metodologi tidak dapat dilanjutkan, alat/perangkat tidak tersedia | 🟡 Normal | Diproses Sekretariat |
| **Kendala Pendanaan** | Dana penelitian habis/ditarik | 🟡 Normal | Diproses Sekretariat |
| **Alasan Pribadi** | Peneliti utama berhalangan, pindah institusi | 🟡 Normal | Diproses Sekretariat |
| **Temuan Penelitian** | Tujuan penelitian sudah tercapai lebih awal | 🟡 Normal | Diproses Sekretariat |
| **Permintaan Sponsor** | Sponsor menarik dukungan | 🟡 Normal | Diproses Sekretariat |

## Dampak Termination

| Aspek | Dampak |
|-------|--------|
| **Status Protokol** | Berubah menjadi **Terminated** |
| **Surat Kelaikan Etik** | Ditutup / Dicabut (tanggal efektif tercatat) |
| **Data Penelitian** | Harus diamankan sesuai prosedur etik |
| **Partisipan** | Harus diinformasikan dan mendapat perlindungan |
| **Arsip** | Seluruh dokumen tetap tersimpan di sistem |
