# Sprint Timeline — Sistem KEP (Kode Etik Penelitian)

> Dibuat: 17 Mei 2026  
> Tanggal Efektif Mulai: Minggu ke-2 Mei 2026 (11–17 Mei)  
> Kedua tim diasumsikan sudah berjalan paralel sejak ±1 minggu lalu.

---

## Pembagian Tim & Epik

| Tim | Anggota | Epik yang Dikerjakan (Urutan) |
|-----|---------|-------------------------------|
| **Tim A** | Olga (FE) + Fajar (BE) | Epic 3 → 4 → 5 → 6 → 7 → 12 → 15 |
| **Tim B** | Isa (Fullstack) + Faiz (FE, kadang aktif) | Epic 1 → 2 → 10 → 11 → 8 → 9 → 13 → 14 |

> **Catatan:** Urutan Epic 8 & 9 di Tim B digeser setelah Epic 10 & 11 karena bergantung pada selesainya Epic 7 (Tim A).

---

## Cross-Team Dependencies

| ID | Tim yang Menunggu | Menunggu | Dari Tim | Tingkat Kritis |
|----|------------------|----------|----------|----------------|
| **D1** | Tim A — Epic 3 (Dashboard) | Epic 1 (Auth & Login) minimal API login selesai | Tim B | 🔴 Sangat Kritis |
| **D2** | Tim B — Epic 8 & 9 (Amendment & Termination) | Epic 7 (Keputusan) selesai — status `Approved` harus tersedia | Tim A | 🟠 Kritis |
| **D3** | Tim B — Epic 13 (Laporan) | Data dari hampir semua epik kedua tim sudah ada | Kedua Tim | 🟡 Sedang |

---

## Legenda Minggu

| Label | Periode |
|-------|---------|
| Mei M2 | 11 – 17 Mei 2026 |
| Mei M3 | 18 – 24 Mei 2026 |
| Mei M4 | 25 – 31 Mei 2026 |
| Jun M1 | 1 – 7 Juni 2026 |
| Jun M2 | 8 – 14 Juni 2026 |
| Jun M3 | 15 – 21 Juni 2026 |
| Jun M4 | 22 – 28 Juni 2026 |

---

---

## 🟢 Skenario 1: Ideal

> **Target Selesai Keseluruhan:** Pertengahan Juni (Minggu 8–14 Juni)  
> **Periode Pengerjaan Dev:** Mei M2 → Juni M1 *(4 minggu)*  
> **Periode Deploy/Hosting:** Juni M2 (8–14 Juni) — *reserved 1 minggu*  
> **Karakteristik:** Agresif. Memerlukan paralelisasi FE/BE penuh, tidak ada delay, dan Faiz aktif di Tim B.

### Tim A — Olga & Fajar

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 3:** Dashboard | 23 | 🔴 **D1:** API login dari Epic 1 (Tim B) harus sudah tersedia di minggu ini |
| Mei M3 | **Epic 4:** Pengajuan EC | 23 | Epic 3 selesai di M2 |
| Mei M4 | **Epic 5:** Evaluasi & Routing  +  **Epic 6:** Review EC | 18 + 15 | Fajar BE / Olga FE dikerjakan paralel. Epic 4 selesai di M3 |
| Jun M1 | **Epic 7:** Keputusan  +  **Epic 12:** Notifikasi  +  **Epic 15:** Penyimpanan Dok. | 31 + 16 + 8 | Epic 5 & 6 selesai. Sangat padat — prioritas penuh. ⚠️ Harus selesai agar Tim B bisa lanjut Epic 8 & 9 |
| Jun M2 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim A selesai |

### Tim B — Isa & Faiz

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 1:** Autentikasi & Registrasi | 25 | 🔴 **D1:** API login harus siap secepat mungkin di minggu ini untuk membuka blokir Tim A |
| Mei M3 | **Epic 2:** Manajemen Pengguna | 15 | Epic 1 selesai di M2 |
| Mei M4 | **Epic 10:** Manajemen Template  +  **Epic 11:** Konfigurasi Sistem | 8 + 11 | Epic 2 selesai. Epik ringan — dikerjakan sambil menunggu Epic 7 dari Tim A |
| Jun M1 | **Epic 8:** Amendment  +  **Epic 9:** Termination  +  **Epic 13:** Laporan  +  **Epic 14:** Audit Log | 20 + 18 + 13 + 5 | 🟠 **D2:** Epic 7 dari Tim A harus selesai. ⚠️ Sangat padat (4 epik, 56 SP dalam 1 minggu) — risiko tinggi, butuh Faiz aktif penuh |
| Jun M2 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim B selesai |

> ⚠️ **Risiko Utama Skenario Ideal:**  
> - Jun M1 adalah titik paling kritis — kedua tim harus menyelesaikan epik terberat secara bersamaan.  
> - Epic 13 & 14 (Low priority) bisa dicicil saat deploy jika tidak sempat di Jun M1.  
> - Skenario ini **hanya realistis** jika tidak ada hambatan teknis signifikan dan Faiz aktif di Tim B.

---

---

## 🟡 Skenario 2: Adjustment

> **Target Selesai Keseluruhan:** Antara Pertengahan – Akhir Juni (Minggu 15–21 Juni)  
> **Periode Pengerjaan Dev:** Mei M2 → Juni M2 *(5 minggu)*  
> **Periode Deploy/Hosting:** Juni M3 (15–21 Juni) — *reserved 1 minggu*  
> **Karakteristik:** Moderat. Ada ruang lebih untuk epik berat. Risiko lebih terkendali.

### Tim A — Olga & Fajar

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 3:** Dashboard | 23 | 🔴 **D1:** API login dari Epic 1 (Tim B) harus sudah tersedia di minggu ini |
| Mei M3 | **Epic 4:** Pengajuan EC | 23 | Epic 3 selesai di M2 |
| Mei M4 | **Epic 5:** Evaluasi & Routing | 18 | Epic 4 selesai di M3 |
| Jun M1 | **Epic 6:** Review EC  +  **Epic 7:** Keputusan *(mulai)* | 15 + 31 | Fajar fokus BE Epic 7, Olga FE Epic 6 lalu lanjut FE Epic 7 |
| Jun M2 | **Epic 7:** Keputusan *(selesai)*  +  **Epic 12:** Notifikasi  +  **Epic 15:** Penyimpanan Dok. | — + 16 + 8 | Epic 7 diselesaikan di awal minggu. ⚠️ Harus tuntas agar Tim B bisa lanjut Epic 8 & 9 |
| Jun M3 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim A selesai |

### Tim B — Isa & Faiz

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 1:** Autentikasi & Registrasi | 25 | 🔴 **D1:** API login harus siap secepat mungkin untuk membuka blokir Tim A |
| Mei M3 | **Epic 2:** Manajemen Pengguna | 15 | Epic 1 selesai di M2 |
| Mei M4 | **Epic 10:** Manajemen Template  +  **Epic 11:** Konfigurasi Sistem | 8 + 11 | Epic 2 selesai. Dikerjakan sambil menunggu Epic 7 dari Tim A |
| Jun M1 | **Epic 14:** Audit Log  +  *Persiapan FE Epic 8 & 9 (scaffolding UI)* | 5 | 🟠 **D2:** Epic 7 belum selesai — Isa bisa mulai struktur BE/FE Epic 8 & 9 tanpa integrasi penuh |
| Jun M2 | **Epic 8:** Amendment  +  **Epic 9:** Termination  +  **Epic 13:** Laporan & Statistik | 20 + 18 + 13 | 🟠 **D2:** Butuh Epic 7 selesai (dari awal Jun M2). Lebih realistis dibanding Skenario Ideal |
| Jun M3 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim B selesai |

> ✅ **Keunggulan Skenario Adjustment:**  
> - Epic 7 (terberat, 31 SP) mendapat alokasi 2 minggu (Jun M1–M2).  
> - Tim B punya buffer di Jun M1 untuk persiapan Epic 8 & 9 (UI scaffolding) tanpa menunggu pasif.  
> - Epic 13 & 14 (Low priority) bisa diselesaikan lebih tenang.  
> - Skenario ini merupakan **rekomendasi paling realistis** untuk kondisi tim saat ini.

---

---

## 🔴 Skenario 3: Maksimal

> **Target Selesai Keseluruhan:** Akhir Juni (Minggu 22–28 Juni)  
> **Periode Pengerjaan Dev:** Mei M2 → Juni M3 *(6 minggu)*  
> **Periode Deploy/Hosting:** Juni M4 (22–28 Juni) — *reserved 1 minggu*  
> **Karakteristik:** Nyaman. Setiap epik mendapat alokasi waktu yang proporsional. Risiko rendah.

### Tim A — Olga & Fajar

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 3:** Dashboard | 23 | 🔴 **D1:** API login dari Epic 1 (Tim B) harus sudah tersedia di minggu ini |
| Mei M3 | **Epic 4:** Pengajuan EC | 23 | Epic 3 selesai di M2 |
| Mei M4 | **Epic 5:** Evaluasi & Routing | 18 | Epic 4 selesai di M3 |
| Jun M1 | **Epic 6:** Review EC | 15 | Epic 5 selesai di M4 |
| Jun M2 | **Epic 7:** Keputusan | 31 | Epic 6 selesai di Jun M1. Fokus penuh di epic terberat. ⚠️ Harus selesai agar Tim B bisa lanjut Epic 8 & 9 |
| Jun M3 | **Epic 12:** Notifikasi  +  **Epic 15:** Penyimpanan Dok. | 16 + 8 | Epic 7 selesai di Jun M2. Waktu cukup untuk integrasi dan QA |
| Jun M4 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim A selesai |

### Tim B — Isa & Faiz

| Periode | Epik yang Dikerjakan | Story Points | Syarat / Dependency |
|---------|----------------------|:------------:|---------------------|
| Mei M2 | **Epic 1:** Autentikasi & Registrasi | 25 | 🔴 **D1:** API login harus siap di minggu ini untuk membuka blokir Tim A |
| Mei M3 | **Epic 2:** Manajemen Pengguna | 15 | Epic 1 selesai di M2 |
| Mei M4 | **Epic 10:** Manajemen Template  +  **Epic 11:** Konfigurasi Sistem | 8 + 11 | Epic 2 selesai. Bobot ringan, diselesaikan dalam 1 minggu |
| Jun M1 | **Epic 14:** Audit Log  +  *Persiapan & UI scaffolding Epic 8 & 9* | 5 | 🟠 **D2:** Epic 7 belum tersedia — Isa fokus persiapan arsitektur Epic 8 & 9, Faiz bantu polishing sebelumnya |
| Jun M2 | **Epic 8:** Amendment  +  **Epic 9:** Termination | 20 + 18 | 🟠 **D2:** Epic 7 dari Tim A selesai di awal Jun M2. Isa bisa langsung integrasi BE+FE |
| Jun M3 | **Epic 13:** Laporan & Statistik  +  *Integrasi & QA keseluruhan* | 13 | 🟡 **D3:** Data dari semua epik sudah tersedia. Waktu cukup untuk polish dan testing menyeluruh |
| Jun M4 | 🚀 **DEPLOY / HOSTING** | — | Semua epik Tim B selesai |

> ✅ **Keunggulan Skenario Maksimal:**  
> - Setiap epik (termasuk yang berat seperti Epic 7, 31 SP) mendapat 1 minggu penuh.  
> - Tim B tidak menunggu pasif — Jun M1 dimanfaatkan produktif untuk Audit Log & persiapan.  
> - Epic 13 (Laporan) di Jun M3 mendapat waktu cukup sehingga kualitas data lebih lengkap.  
> - Ada ruang untuk QA dan integrasi antar epik sebelum deploy.

---

---

## Ringkasan Ketiga Skenario

| Skenario | Dev Selesai | Deploy | Project Selesai | Minggu Dev | Tingkat Risiko |
|----------|-------------|--------|-----------------|:----------:|:--------------:|
| 🟢 **Ideal** | Juni M1 (1–7 Jun) | Juni M2 (8–14 Jun) | Pertengahan Juni | 4 minggu | 🔴 Tinggi |
| 🟡 **Adjustment** | Juni M2 (8–14 Jun) | Juni M3 (15–21 Jun) | Pertengahan–Akhir Juni | 5 minggu | 🟡 Sedang |
| 🔴 **Maksimal** | Juni M3 (15–21 Jun) | Juni M4 (22–28 Jun) | Akhir Juni | 6 minggu | 🟢 Rendah |

---

## Catatan Umum

1. **Prioritas D1 (Auth API):** Tim B harus memastikan endpoint login minimal tersedia di Mei M2 agar Tim A tidak terhambat memulai Epic 3 Dashboard.
2. **Bottleneck D2 (Epic 7 → Epic 8 & 9):** Epic 7 adalah epik terberat (31 SP) sekaligus gerbang untuk Tim B mengerjakan Amendment & Termination. Pantau progres Epic 7 secara aktif.
3. **Epic 13 & 14 (Low Priority):** Jika timeline mepet, kedua epik ini paling aman untuk "digeser" karena prioritasnya rendah dan tidak memblokir alur utama sistem.
4. **Faiz (FE, kadang aktif):** Di titik-titik kritis (terutama Jun M1 di Skenario Ideal dan Jun M2 di Skenario Adjustment), keaktifan Faiz sangat berpengaruh pada kecepatan penyelesaian Tim B.
5. **Rekomendasi:** Skenario **Adjustment** adalah titik tengah paling realistis — cukup ambisius tapi tidak berisiko tinggi seperti Skenario Ideal.
