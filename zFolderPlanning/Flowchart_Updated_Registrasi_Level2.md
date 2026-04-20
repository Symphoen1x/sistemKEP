# Flowchart Registrasi Akun — Level 2 (Updated)

> **Perubahan dari versi sebelumnya:**
> - Menambahkan alur registrasi yang dipicu **Admin** (pembuatan akun internal: Sekretariat, Reviewer, Ketua Komisi Etik)
> - Membedakan 2 skenario besar: **Self-Registration (Applicant)** vs **Admin-Created Account (Internal)**
> - Mempertegas peran Admin dalam pengelolaan akun

---

## A. Registrasi Akun Applicant (Self-Registration)

Alur ini sama dengan versi sebelumnya. Applicant mendaftar sendiri, lalu Sekretariat mengaktivasi.

```mermaid
flowchart TD
    subgraph RegistrasiApplicant ["REGISTRASI AKUN - EC APPLICANT"]
        direction TB
        
        subgraph Applicant ["🧑‍🔬 Applicant"]
            A_Start([Begin]) --> A_HasAccount{Sudah punya akun?}
            A_HasAccount -->|Ya| A_Login[Login]
            A_HasAccount -->|Tidak| A_Register["Mengisi Form Registrasi\n(Email, Nama, Alamat, No. Kontak)"]
            A_Register --> A_Submit[Submit Form Registrasi]
            A_Submit --> A_Wait["Menunggu Aktivasi Akun\n(Status: Pending)"]
        end
        
        subgraph Sekretariat ["📋 Sekretariat"]
            S_Receive["Menerima Notifikasi\nRegistrasi Baru"] --> S_Review[Review Data Pendaftar]
            S_Review --> S_Approve{Disetujui?}
            S_Approve -->|Ya| S_Activate["Aktivasi Akun\n+ Tambah Role: Applicant"]
            S_Activate --> S_EmailApprove[Kirim Email Persetujuan]
            S_Approve -->|Tidak| S_Reject[Kirim Email Penolakan\ndengan Alasan]
        end
        
        A_Submit -.-> S_Receive
        S_EmailApprove -.-> A_Login
        S_Reject -.-> A_End1([End - Ditolak])
        
        A_Login --> A_Dashboard["Dashboard Applicant"]
        A_Dashboard --> A_End2([End])
    end
```

---

## B. Registrasi Akun Reviewer (Self-Registration + Approval)

Reviewer mendaftar sendiri, Sekretariat memverifikasi dan memberikan role Applicant **& Reviewer**.

```mermaid
flowchart TD
    subgraph RegistrasiReviewer ["REGISTRASI AKUN - EC REVIEWER"]
        direction TB
        
        subgraph Applicant2 ["🧑‍🔬 Calon Reviewer"]
            R_Start([Begin]) --> R_HasAccount{Sudah punya akun?}
            R_HasAccount -->|Ya| R_Login[Login]
            R_HasAccount -->|Tidak| R_Register["Mengisi Form Registrasi\n(Email, Nama, Alamat, No. Kontak,\nKeahlian/Bidang Keilmuan)"]
            R_Register --> R_Submit[Submit Form Registrasi]
            R_Submit --> R_Wait["Menunggu Aktivasi Akun\n(Status: Pending)"]
        end
        
        subgraph Sekretariat2 ["📋 Sekretariat"]
            RS_Receive["Menerima Notifikasi\nRegistrasi Reviewer Baru"] --> RS_Review["Review Data &\nKualifikasi Pendaftar"]
            RS_Review --> RS_Approve{Disetujui?}
            RS_Approve -->|Ya| RS_Activate["Aktivasi Akun\n+ Tambah Role: Applicant & Reviewer"]
            RS_Activate --> RS_Email[Kirim Email Persetujuan]
            RS_Approve -->|Tidak| RS_Reject[Kirim Email Penolakan]
        end
        
        R_Submit -.-> RS_Receive
        RS_Email -.-> R_Login
        RS_Reject -.-> R_End1([End - Ditolak])
        
        R_Login --> R_Dashboard["Dashboard\n(Pilih Role: Applicant / Reviewer)"]
        R_Dashboard --> R_End2([End])
    end
```

---

## C. Pembuatan Akun Internal oleh Admin (Sekretariat, Reviewer, Ketua Komisi Etik)

Akun untuk role internal **tidak self-register**, melainkan dibuat oleh **Admin**.

```mermaid
flowchart TD
    subgraph CreateInternal ["PEMBUATAN AKUN INTERNAL - OLEH ADMIN"]
        direction TB
        
        subgraph AdminLane ["🔧 Admin"]
            AD_Start([Begin]) --> AD_Login[Login sebagai Admin]
            AD_Login --> AD_Dashboard[Dashboard Admin]
            AD_Dashboard --> AD_UserMgmt[Menu Manajemen Pengguna]
            AD_UserMgmt --> AD_CreateUser["Buat Akun Baru\n(Isi: Email, Nama, Role)"]
            AD_CreateUser --> AD_SelectRole{Pilih Role}
            
            AD_SelectRole -->|Sekretariat| AD_RoleSekretariat["Set Role: Sekretariat"]
            AD_SelectRole -->|Reviewer| AD_RoleReviewer["Set Role: Applicant & Reviewer"]
            AD_SelectRole -->|Ketua Komisi Etik| AD_RoleKetua["Set Role: Ketua Komisi Etik"]
            
            AD_RoleSekretariat --> AD_Save[Simpan & Aktivasi Akun]
            AD_RoleReviewer --> AD_Save
            AD_RoleKetua --> AD_Save
            
            AD_Save --> AD_SendCredential["Kirim Email Kredensial\n(Email + Temporary Password)"]
            AD_SendCredential --> AD_End([End])
        end
        
        subgraph UserBaru ["👤 User Baru (Internal)"]
            UB_Receive["Menerima Email Kredensial"] --> UB_Login[Login Pertama Kali]
            UB_Login --> UB_ChangePass[Ubah Password]
            UB_ChangePass --> UB_Dashboard[Dashboard Sesuai Role]
            UB_Dashboard --> UB_End([End])
        end
        
        AD_SendCredential -.-> UB_Receive
    end
```

---

## D. Manajemen Role oleh Admin (Update Role Existing User)

```mermaid
flowchart TD
    subgraph ManageRole ["MANAJEMEN ROLE - OLEH ADMIN"]
        MR_Start([Begin]) --> MR_Login[Login sebagai Admin]
        MR_Login --> MR_Dashboard[Dashboard Admin]
        MR_Dashboard --> MR_UserList[Daftar Pengguna]
        MR_UserList --> MR_SelectUser[Pilih User yang akan diubah]
        MR_SelectUser --> MR_Action{Aksi?}
        
        MR_Action -->|Tambah Role| MR_AddRole["Tambah Role\n(Reviewer / Sekretariat / Ketua)"]
        MR_Action -->|Hapus Role| MR_RemoveRole["Hapus Role"]
        MR_Action -->|Nonaktifkan Akun| MR_Deactivate["Nonaktifkan Akun"]
        MR_Action -->|Aktifkan Akun| MR_Activate["Aktifkan Kembali Akun"]
        
        MR_AddRole --> MR_Save[Simpan Perubahan]
        MR_RemoveRole --> MR_Save
        MR_Deactivate --> MR_Save
        MR_Activate --> MR_Save
        
        MR_Save --> MR_Notify[Kirim Email Notifikasi\nPerubahan ke User]
        MR_Notify --> MR_End([End])
    end
```

## Ringkasan Role & Hak Akses pada Registrasi

| Role | Cara Registrasi | Siapa yang Mengaktivasi | Role yang Diberikan |
|------|----------------|------------------------|---------------------|
| **Applicant** | Self-register via web | Sekretariat | Applicant |
| **Reviewer** | Self-register via web | Sekretariat | Applicant & Reviewer |
| **Sekretariat** | Dibuat oleh Admin | Admin (aktif langsung) | Sekretariat |
| **Ketua Komisi Etik** | Dibuat oleh Admin | Admin (aktif langsung) | Ketua Komisi Etik |
| **Admin** | Pre-configured / Seed | Sistem | Admin (Super User) |
