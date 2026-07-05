# Spesifikasi Landing Page Sistem KEP (Kode Etik Penelitian)

Dokumen ini berisi rancangan struktur, tema warna, dan efek animasi untuk halaman utama (Landing Page) Sistem KEP yang akan diimplementasikan pada `resources/js/Pages/Welcome.jsx`. Tujuan desain adalah menciptakan kesan modern, bersih (clean), profesional, dan sangat relevan untuk kalangan akademisi serta peneliti.

---

## 1. Tema & Palet Warna (Dual Mode)

Untuk menghindari kesan kaku namun tetap menjaga wibawa akademik, kita akan menggunakan kombinasi warna berbasis **"Indigo & Slate"** dipadukan dengan **"Emerald"** sebagai aksen keberhasilan (approval). Tema ini sangat populer di web modern (seperti yang sering digunakan oleh ekosistem Tailwind CSS atau spesifikasi web universitas kelas dunia).

### A. Light Mode (Mode Terang)
Kesan: Bersih, profesional, mudah dibaca untuk teks panjang.
*   **Background Utama:** `Off-White` / `Slate-50` (`#F8FAFC`) - Menghindari putih murni agar mata tidak cepat lelah saat membaca teks panjang.
*   **Teks Utama:** `Dark Slate` (`#0F172A`) - Hitam keabu-abuan gelap untuk kontras yang sangat baik namun lebih lembut dari `#000000`.
*   **Warna Primer (Branding & Header):** `Deep Indigo` (`#3730A3` atau `#1E3A8A`) - Representasi kecerdasan, integritas, dan institusi pendidikan.
*   **Warna Aksen / Call-to-Action:** `Emerald Green` (`#10B981`) - Untuk tombol "Ajukan Ethical Clearance" (memberi kesan aman dan positif).

### B. Dark Mode (Mode Gelap)
Kesan: Elegan, canggih (hi-tech), fokus tinggi.
*   **Background Utama:** `Deep Space` / `Slate-900` (`#0F172A`) - Tidak menggunakan hitam murni (`#000`), melainkan biru-abu sangat gelap untuk kesan premium (mirip tampilan IDE atau web modern Github/Vercel).
*   **Card Background:** `Slate-800` (`#1E293B`) - Untuk memberikan kedalaman (elevasi) pada Card.
*   **Teks Utama:** `Light Slate` (`#F1F5F9`) - Putih pudar untuk keterbacaan optimal di latar gelap.
*   **Warna Primer (Branding):** `Soft Indigo` / `Sky Blue` (`#818CF8` atau `#38BDF8`) - Versi yang lebih terang dan cerah dari warna primer agar kontras dengan latar gelap.
*   **Warna Aksen / Call-to-Action:** `Teal / Light Emerald` (`#34D399`) - Tetap hijau namun dioptimalkan untuk dark mode.

---

## 2. Struktur Konten (Sections)

Berikut adalah susunan bagian-bagian dari urutan paling atas hingga bawah:

### A. Header / Navbar (Sticky)
*   **Kiri:** Logo Institusi + Teks elegan "Sistem KEP".
*   **Menu Tengah:** Beranda | Tentang Etik | Alur Pengajuan | Panduan & Template | Cek Status EC | Kontak.
*   **Kanan:** Toggle Light/Dark Mode (Icon Sun/Moon) & CTA Button "Masuk / Daftar".

### B. Hero Section (Kesan Pertama)
*   **Headline:** "Sistem Pengajuan Kode Etik Penelitian Digital" (Huruf tebal, tipografi modern seperti *Inter* atau *Roboto*).
*   **Sub-headline:** "Memfasilitasi penelitian yang berintegritas, melindungi hak manusia dan hewan coba, dengan proses telaah yang transparan dan terstandarisasi."
*   **Tombol Dual CTA:**
    *   **Utama:** "Ajukan Proposal Sekarang" (Warna Aksen).
    *   **Sekunder:** "Pelajari Alur Telaah" (Ghost button / Outline).
*   **Visual Graphic:** Ilustrasi atau vektor abstrak di sebelah kanan (misal 3D node network, simbol DNA minimalis, atau grafis dokumen berpadu dengan *checkmark*).

### C. Statistik / Angka Kepercayaan (Trust Builder)
Disejajarkan horizontal (tiga kolom):
1.  **XXX+** Proposal Direview
2.  **XX** Reviewer Ahli / Anggota Komite
3.  **X Hari** Rata-rata Waktu Proses

### D. Prinsip Dasar Etik (3 Pillars Cards)
Desain Card minimalis:
1.  **Menghormati Partisipan (Autonomy)** - Ikon orang / pelindung.
2.  **Kemanfaatan (Beneficence)** - Ikon grafik naik / positif.
3.  **Keadilan (Justice)** - Ikon timbangan etik.

### E. Alur Pengajuan (Roadmap / Timeline)
Menampilkan 4 langkah sederhana agar peneliti tidak terintimidasi oleh birokrasi:
1.  Buat Akun & Registrasi
2.  Lengkapi Protokol & Unggah Syarat
3.  Proses Telaah (Exempted / Expedited / Full Board)
4.  Penerbitan Surat Kelaikan Etik

### F. Pusat Unduhan (Quick Resources)
Tabel atau list sederhana untuk mendownload:
*   Buku Pedoman KEP Nasional Nasional (PDF).
*   Template Formulir Protokol.

### G. Footer
*   Alamat lengkap kantor Sekretariat Komisi Etik.
*   Tautan penting (Kebijakan Privasi, Syarat Ketentuan).
*   Informasi Kontak (Email/Bantuan).

---

## 3. Integrasi Animasi (menggunakan `animejs`)

Animasi difokuskan untuk interaksi mikro (*micro-interactions*) dan observasi *scroll*, menjaga kesan akademik yang serius namun memberikan *feel* aplikasi mahal.

1. **Hero SVG Line Drawing Animation:**
   *   Menganimasikan properti `stroke-dashoffset` pada file SVG utama (di Hero Section). Saat layar pertama kali dimuat, garis-garis ilustrasi akan "menggambar" dirinya sendiri dengan perlahan (duration: 1500ms - 2000ms, easing: `easeInOutSine`), memberi kesan analitis dan presisi sains.

2. **Staggering Reveal untuk Teks dan Tombol (Hero):**
   *   Saat *page load*, Headline, Sub-headline, dan Tombol CTA akan muncul satu per satu dari bawah ke atas (*translateY* dari 20px ke 0px) dan *opacity* perlahan penuh dengan jeda antar elemen (misalnya `delay: anime.stagger(100)`).

3. **Scroll-triggered Count-Up (Statistik):**
   *   Menggunakan konfigurasi objek referensi pada `anime.js` (misalnya memanipulasi `innerHTML` dari angka `0` menuju `500`). Animasi hanya akan berjalan (*play()*) ketika pengguna melakukan scroll dan mencapai section statistik (dipadukan dengan `IntersectionObserver` milik browser).

4. **Staggered Card Fade-Up (Bagian Prinsip Etik):**
   *   Ketiga pilar akan dirantai ke dalam satu animasi. Jika user scroll ke bagian ini, kartu kiri akan muncul lebih dulu, disusul tengah, dan terakhir kanan. Easing yang digunakan sebaiknya `spring(1, 80, 10, 0)` agar gerakan terlihat organik tapi tidak berlebihan.

5. **Path Tracing (Alur Pengajuan Timeline):**
   *   Jika alur dibuat menggunakan SVG garis yang menghubungkan angka 1, 2, 3, dan 4. Terdapat sebuah titik (atau *fill* warna) yang berjalan di atas garis tersebut bersamaan dengan user men-scroll halaman, menggunakan `anime.path('.line')`.

---

*Catatan: Dokumen ini disusun sebagai panduan konseptual (planning) sebelum penulisan kode komponen UI sebenarnya pada `Welcome.jsx` atau konfigurasi CSS/Tailwind.*
