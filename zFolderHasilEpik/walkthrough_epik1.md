# Walkthrough: Penyelesaian Epic 1 (Logika & Alur Autentikasi)

Semua tugas Backend dan Logika *Flow* yang direncanakan untuk menyelesaikan **Epic 1** kini telah berhasil dieksekusi. Berikut adalah apa saja yang telah dibangun di balik layar:

## 1. Modifikasi Basis Data & Model (Users)
- Menambahkan kolom `status` pada tabel `users` yang secara bawaan (default) akan bernilai `pending`. Ini memastikan setiap akun baru harus melewati tahap verifikasi.
- Menambahkan kolom `phone_number` dan `address` di database, dan juga mendaftarkannya ke dalam properti `$fillable` di model `User.php`.

## 2. Alur Registrasi Diperbarui
- **[Register.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Auth/Register.jsx)**: Kini menampilkan dua *input* tambahan secara mulus di antara Email dan Password, yaitu **Nomor Telepon** dan **Alamat Lengkap**, dengan mempertahankan desain yang konsisten dengan halaman lainnya.
- **[RegisteredUserController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Auth/RegisteredUserController.php)**: Saat form disubmit, sistem akan menyimpan profil beserta penanda status *Pending*. **Fitur Auto-Login telah dimatikan**, sehingga setelah mendaftar, pengguna akan dilempar kembali ke halaman Login dengan pesan keberhasilan *"Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi dari Sekretariat."*

## 3. Alur Login & Multi-Role Guard
- **Pencegah Login Pending:** Jika pengguna yang statusnya masih `pending` atau `inactive` mencoba memaksakan masuk melalui **[AuthenticatedSessionController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Auth/AuthenticatedSessionController.php)**, sesi mereka akan otomatis dibatalkan, *logout* dilakukan secara senyap, dan mereka akan melihat peringatan di atas *form* bahwa akun belum diverifikasi/dinonaktifkan.
- **Role Selection:** Jika kredensial valid dan berstatus `active`, sistem akan memeriksa *Role* lewat *Spatie*:
  - Jika punya **lebih dari satu role** dan belum memilih *role* aktif, sistem melempar ke *route* baru: `/role/select`.
  - Jika cuma punya satu role, sistem otomatis merekam *role* tersebut ke `active_role_name` dan mengizinkan lewat ke Dashboard.

## 4. UI Pilih Peran (Select Role)
- **[SelectRole.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Auth/SelectRole.jsx)**: Halaman khusus yang cantik (menggunakan basis `GuestLayout`) tempat pengguna multi-peran dapat memilih identitas yang akan mereka gunakan di sesi ini (misalnya masuk sebagai **Applicant** vs masuk sebagai **Reviewer**). Pilihan mereka dikirim menggunakan *Inertia router* yang terjamin keamanannya ke **[RoleSelectionController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/Auth/RoleSelectionController.php)**.

## 5. UI Verifikasi Pengguna Baru (Sekretariat)
- **[PendingUsers.jsx](file:///c:/Users/User/sistemKEP/resources/js/Pages/Sekretariat/PendingUsers.jsx)**: Walau tata letak Dashboard utama masih menyusul di Epic 3 (oleh Tim A), saya telah membuat halaman spesifik untuk Sekretariat agar tak memblokir *flow* aplikasi kita. Halaman ini menggunakan `AuthenticatedLayout` dan menampilkan tabel berisi nama, email, telepon, dan waktu pendaftaran.
- **[UserApprovalController.php](file:///c:/Users/User/sistemKEP/app/Http/Controllers/UserApprovalController.php)**: Sekretariat dapat menggunakan tombol yang ada di tabel tadi untuk mengaktivasi pendaftar sebagai **Applicant** (tombol warna biru indigo), sebagai **Reviewer** (tombol warna hijau zamrud), atau menolak pendaftaran (tombol merah).

> [!TIP]
> **Cara Menguji Keseluruhan Alur Epic 1 Ini:**
> 1. Buka `http://localhost:8000/register`, isi data, klik daftar. Anda akan dilempar kembali ke Login dengan pesan "Menunggu verifikasi".
> 2. Coba login menggunakan kredensial yang sama. Sistem harus menolak dengan pesan error validasi (Pending).
> 3. Jika Anda memiliki *seeder* Admin/Sekretariat, masuk dan kunjungi `/sekretariat/pending-users` (Anda bisa mencoba mengubah secara manual dari *database* atau Tinker terlebih dahulu jika *seeder* belum ada) untuk menekan tombol **Setujui**.
> 4. Login kembali dengan akun yang didaftarkan. Kali ini harus berhasil masuk!

Semua prasyarat Epic 1 kini sudah rampung dan secara teknis telah siap mendukung kelancaran pembuatan Dashboard oleh Tim A nanti.
