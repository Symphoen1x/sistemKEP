# Catatan Arsitektur Sistem: React x Laravel (Inertia.js)
*File ini adalah hasil rangkuman sesi pembelajaran mengenai konsep dasar arsitektur Monolith Modern menggunakan Laravel, React, dan Inertia.js*

---

## 1. Perbedaan Mendasar dengan Murni Laravel & React Terpisah
- **Struktur Backend Sama:** Folder inti Laravel (`app/Models`, `database`, konfigurasi relasi) 100% sama dengan pengembangan Laravel biasa.
- **Output Controller Berbeda:** Controller tidak lagi mengembalikan file Blade (`view('index')`) atau API Token berupa JSON (`response()->json()`), melainkan me-return format respons Inertia: `return Inertia::render('NamaKomponen', ['data' => $data]);`.
- **Rute Frontend & Backend Menyatu:** Keduanya dikendalikan oleh file spesifik di Laravel yakni `routes/web.php`. Pengembang tidak harus repot membangun API JWT yang terpisah dari UI SPA.
- **Data Langsung Turun sebagai Props:** Berkat Inertia, React tidak lagi membutuhkan layar "Loading" dengan `useEffect` untuk nge-fetch data saat halaman pertama dimuat. Data sudah masuk secara instan via *Props*!

## 2. Kemana Hilangnya `index.html` dan `<div id="root">`?
Dalam React murni, `index.html` selalu ada di luar untuk memanggil React. Dalam arsitektur ini:
- Tempat memanggil React digantikan oleh file `resources/views/app.blade.php`.
- Directive Laravel `@inertia` tertulis di bagian `<body />`. Saat aplikasi dimuat, *directive* ini otomatis diganti menjadi elemen tag HTML dengan id "app" lengkap dengan data komponen JSON awal.
- File konfigurasi `resources/js/app.jsx` kemudian memanggil dan me-*mount* keseluruhan aplikasi React ke elemen tersebut.

## 3. Pengeksporan Komponen: Default vs Const (Pisah)
- `export default function NamaKomponen()`: Cara tercepat dan dominan digunakan. Digunakan apabila fitur tersebut berdiri sendiri (sederhana) dan statis. 
- `export default` secara terpisah di bagian paling bawah: Digunakan secara spesifik untuk pola perancangan bernama **Compound Component Pattern** (contoh: `Dropdown.jsx`). Karena pengembang ingin memanggil atau menambahkan komponen *anak* secara bersarang (misal `Dropdown.Content`, `Dropdown.Trigger`), mereka mendefinisikan komponen sebagai varibel `const` dulu sebelum diekspor.

## 4. Apakah Ini Tetap Disebut SPA (Single Page Application)?
**Ya, 100% SPA.** 
Inertia menukar beban rendering HTML Laravel penuh menjadi transfer JSON ringan lintas request tanpa mematikan arsitektur SPA itu sendiri. Syarat utamanya: Gunakan komponen pemanggil bawaan Inertia yakni `<Link href="">` alih-alih formattag HTML reguler `<a href="">`. `<Link>` akan mencegat (intercept) perintah reload halaman yang default pada peramban (browser), lalu hanya meminta paket JSON dari Laravel untuk menyegarkan tampilan tanpa kedipan.

## 5. Konsep React Apa Saja yang "Nihil" atau Digantikan?
Terutama adalah konsep perutean (`react-router-dom`), yang mana keseluruhan posisinya diambil alih oleh kapabilitas Laravel Backend:

| Fungsi React Router | Mekanisme Penggantinya di Inertia.js (Project ini) | Penjelasan |
| :--- | :--- | :--- |
| **`react-router-dom`** | `web.php` (Laravel Route) | Pemetaan keseluruhan alur navigasi halaman sekarang dilakukan oleh rute aplikasi backend Laravel. Developer React tidak perlu pusing membuat deklarasi *browser router* baru. |
| **`useParams()`** | *Direct Component Props* | Argumen jalur ID atau data terikat (Route Model Binding) seperti di rute `/users/15` akan langsung dilerai (parse) oleh Controller dan dikirim utuh ke Props *React Router* secara gaib ketika halamannya ter-*load*. |
| **`useSearchParams()`**| `router.get()` (Inertia HTTP) | Untuk memanipulasi *Query Param* di URL web guna mencari spesifikasi tertentu tanpa melakukan muat ulang, developer tinggal memanggil `router.get('/path', { search: 'keyword' })`. |
| **`useNavigate()`** | `router.post/get/delete` | Proses redirect maupun navigasi terprogram (programatically) kini bisa dijalankan lewat parameter object `router` sembari sekalian mengirim operasi HTTP berdasar metode yang diinginkan (GET, POST). |

## 6. Haruskah Memakai Class Component Dibanding Functional Component?
**SANGAT DISARANKAN TIDAK MELIBATKAN CLASS COMPONENT SAMA SEKALI.** 

Template *Laravel Breeze* modern dibangun sepenuhnya secara fungsional berdasarkan *React Hooks*. Mengapa dilarang?
- Hook unggulan Inertia (`usePage`, `useForm`) untuk navigasi dan penanganan *form submit* **hanya didukung** pada spesifikasi Functional Component.
- Menulis logika dengan *Class Component* berarti melawan arus framework, mempersulit pengembangan dengan kode pembungkus eksentrik (Higher Order Component/HOC) ekstra tak perlu hanya demi memanggil fungsionalitas dasar Inertia.
- Pedoman menulis dari tim inti React hanya merujuk untuk merawat kode dasar tua (Legacy Project), alih-alih diterapkan pada basis kode (Boilerplate) yang seluruhnya terkonstruksi baru.
