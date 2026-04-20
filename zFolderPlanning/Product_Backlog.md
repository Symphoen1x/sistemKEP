# Product Backlog — Sistem KEP (Kode Etik Penelitian)

> Disusun berdasarkan flowchart yang telah di-update (Level 1, Registrasi Level 2, Pengajuan Level 2, Review Level 2, Amendment, Termination, Admin Management).
> Kolom mengikuti struktur file **Track Update Feature Product Backlog.xlsx**.

---

## Epic 1: Autentikasi & Registrasi

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB01 | Autentikasi | Sebagai **Applicant**, saya ingin mendaftarkan akun baru agar saya bisa mengajukan Ethical Clearance. | Form registrasi self-service untuk Applicant. Mengisi email, nama lengkap, alamat, dan nomor kontak. Status awal akun: **Pending**. | High | 5 | - Form registrasi dengan validasi input (email unik, field wajib terisi) tersedia di halaman publik. - Setelah submit, status akun menjadi "Pending". - Applicant menerima email konfirmasi bahwa registrasi telah dikirim dan menunggu aktivasi. |
| PB02 | Autentikasi | Sebagai **Calon Reviewer**, saya ingin mendaftarkan akun dengan informasi keahlian agar saya bisa menjadi reviewer. | Form registrasi self-service untuk Reviewer. Sama seperti Applicant + tambahan field keahlian/bidang keilmuan. | High | 5 | - Form registrasi reviewer memiliki field tambahan: keahlian/bidang keilmuan. - Setelah submit, status akun "Pending". - Email konfirmasi terkirim. |
| PB03 | Autentikasi | Sebagai **Sekretariat**, saya ingin mereview dan mengaktivasi akun pendaftar baru agar hanya akun yang valid yang bisa masuk sistem. | Halaman daftar registrasi baru yang masuk. Sekretariat bisa approve (aktifkan akun + set role) atau reject (kirim email penolakan). | High | 5 | - Daftar pending registrations tampil di dashboard Sekretariat. - Tombol Approve: akun aktif, role di-assign (Applicant atau Applicant+Reviewer), email persetujuan terkirim. - Tombol Reject: akun tetap non-aktif, email penolakan + alasan terkirim. |
| PB04 | Autentikasi | Sebagai **pengguna terdaftar**, saya ingin login ke sistem agar saya bisa mengakses fitur sesuai role saya. | Halaman login dengan email dan password. Setelah login, redirect ke dashboard sesuai role. | High | 3 | - Login form dengan email & password. - Validasi kredensial. - Redirect ke dashboard sesuai role aktif. - Pesan error jika kredensial salah atau akun belum aktif. |
| PB05 | Autentikasi | Sebagai **pengguna dengan multi-role** (misal Applicant & Reviewer), saya ingin memilih role aktif setelah login agar saya bisa mengakses fitur yang sesuai. | Halaman/modal pemilihan role setelah login jika user memiliki lebih dari satu role. | Medium | 3 | - Jika user punya >1 role, tampil pilihan role setelah login. - Dashboard yang tampil sesuai role yang dipilih. - Bisa switch role tanpa logout. |
| PB06 | Autentikasi | Sebagai **pengguna**, saya ingin mereset password saya jika lupa agar saya bisa kembali mengakses akun. | Fitur forgot password via email. | Medium | 3 | - Link "Lupa Password" di halaman login. - Kirim email reset password dengan link/token. - User bisa set password baru. |
| PB07 | Autentikasi | Sebagai **pengguna**, saya ingin logout dari sistem agar sesi saya aman. | Tombol logout yang mengakhiri sesi pengguna. | High | 1 | - Tombol logout tersedia di setiap halaman. - Setelah logout, sesi berakhir dan redirect ke halaman login. |

---

## Epic 2: Manajemen Pengguna (Admin)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB08 | Manajemen Pengguna | Sebagai **Admin**, saya ingin melihat daftar semua pengguna sistem agar saya bisa mengelola akun pengguna. | Halaman daftar pengguna dengan filter dan search (berdasarkan nama, email, role, status). | High | 5 | - Tabel daftar user dengan kolom: nama, email, role, status, tanggal registrasi. - Filter berdasarkan role dan status. - Search berdasarkan nama/email. - Pagination. |
| PB09 | Manajemen Pengguna | Sebagai **Admin**, saya ingin membuat akun internal (Sekretariat, Reviewer, Ketua Komisi Etik) agar role internal bisa mengakses sistem. | Form pembuatan akun oleh Admin. Mengisi email, nama, dan role. Akun langsung aktif. Kirim email kredensial (temporary password). | High | 5 | - Form create user dengan field: email, nama, role (Sekretariat / Reviewer / Ketua Komisi Etik). - Akun langsung aktif setelah dibuat. - Email berisi kredensial (email + temporary password) terkirim otomatis. |
| PB10 | Manajemen Pengguna | Sebagai **Admin**, saya ingin menambah atau menghapus role pengguna agar hak akses pengguna bisa disesuaikan. | Admin bisa menambah/menghapus role dari akun yang sudah ada (misal menambah role Reviewer ke akun Applicant). | Medium | 3 | - Di halaman detail user, Admin bisa menambah/menghapus role. - Perubahan tersimpan. - Email notifikasi perubahan role terkirim ke user bersangkutan. |
| PB11 | Manajemen Pengguna | Sebagai **Admin**, saya ingin menonaktifkan atau mengaktifkan kembali akun pengguna agar akun yang tidak valid bisa dibatasi aksesnya. | Toggle aktivasi/nonaktivasi akun pengguna. | Medium | 2 | - Tombol Activate/Deactivate di halaman detail user. - User yang dinonaktifkan tidak bisa login. - Email notifikasi terkirim. |

---

## Epic 3: Dashboard

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB12 | Dashboard | Sebagai **Applicant**, saya ingin melihat dashboard yang menampilkan ringkasan ajuan EC saya agar saya bisa memantau status terkini. | Dashboard Applicant: daftar ajuan EC beserta status, notifikasi terbaru, quick actions (ajukan baru, download template). | High | 5 | - Tampil daftar ajuan EC milik user dengan status terkini. - Widget ringkasan (total ajuan, per status). - Quick action: Ajukan EC Baru, Download Template. - Notifikasi/pesan terbaru. |
| PB13 | Dashboard | Sebagai **Sekretariat**, saya ingin melihat dashboard berisi daftar ajuan EC yang perlu diproses agar saya bisa mengelola antrian review. | Dashboard Sekretariat: inbox ajuan baru (New Proposal), ajuan On Review, ajuan Revised, notifikasi feedback dari reviewer. | High | 5 | - Inbox: daftar ajuan dengan status New Proposal dan Revised. - Daftar ajuan On Review yang sedang diproses. - Counter/badge jumlah per status. - Notifikasi feedback masuk dari Reviewer. |
| PB14 | Dashboard | Sebagai **Reviewer**, saya ingin melihat dashboard berisi daftar ajuan EC yang perlu saya review agar saya bisa mengerjakan review tepat waktu. | Dashboard Reviewer: daftar ajuan yang di-assign ke reviewer, due date, status feedback. | High | 5 | - Daftar ajuan yang di-assign ke reviewer ini. - Tampil due date tiap review. - Status: belum di-review / sudah submit feedback. - Indikator overdue jika melewati due date. |
| PB15 | Dashboard | Sebagai **Ketua Komisi Etik**, saya ingin melihat dashboard monitoring seluruh ajuan EC agar saya bisa memantau kinerja komite dan menandatangani surat. | Dashboard Ketua: overview statistik ajuan, daftar Full Board Review yang perlu keputusan, daftar Surat Kelaikan Etik yang perlu ditandatangani, eskalasi termination. | High | 5 | - Statistik ringkasan: total ajuan, per status, per jenis review. - Daftar Full Board Review yang pending keputusan. - Daftar Surat Kelaikan Etik yang perlu tanda tangan. - Daftar eskalasi termination safety-related. |
| PB16 | Dashboard | Sebagai **Admin**, saya ingin melihat dashboard administrasi sistem agar saya bisa mengelola pengguna, template, dan konfigurasi. | Dashboard Admin: ringkasan user, quick links ke manajemen pengguna, template, konfigurasi, laporan. | Medium | 3 | - Widget ringkasan: total user, user baru, user per role. - Quick links: Manajemen Pengguna, Template, Konfigurasi, Laporan, Audit Log. |

---

## Epic 4: Pengajuan Ethical Clearance

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB17 | Pengajuan EC | Sebagai **Applicant**, saya ingin mengunduh template formulir pengajuan EC agar saya bisa menyiapkan dokumen sesuai format yang ditentukan. | Halaman download template: Formulir Ringkasan Protokol (Lampiran 02) dan Formulir Pengajuan Telaah Etik Baru (Lampiran 03). File statis yang dikelola oleh Admin. | High | 2 | - Halaman/section download template tersedia. - Daftar template yang bisa diunduh dengan nama dan deskripsi. - File bisa didownload (PDF/DOCX). |
| PB18 | Pengajuan EC | Sebagai **Applicant**, saya ingin mengupload dokumen ajuan EC beserta kelengkapannya agar saya bisa mengajukan telaah etik secara digital. | Form upload multi-file. Checklist dokumen wajib: surat pengantar, proposal, formulir penjelasan partisipan, ICF, iklan, brosur, alat pengumpulan data, daftar tim peneliti, CV, anggaran. | High | 8 | - Form upload multi-file dengan label per jenis dokumen. - Checklist kelengkapan dokumen: minimal dokumen wajib harus terisi. - Validasi format file (PDF/DOCX) dan ukuran max. - Preview daftar file sebelum submit. |
| PB19 | Pengajuan EC | Sebagai **Applicant**, saya ingin melakukan submit ajuan EC agar ajuan saya masuk ke antrian proses Sekretariat. | Submit ajuan setelah semua dokumen diupload. Status berubah menjadi "New Proposal". Nomor protokol otomatis di-generate. | High | 3 | - Tombol Submit aktif hanya jika dokumen wajib sudah diupload. - Setelah submit, status = "New Proposal". - Nomor protokol di-generate otomatis. - Email konfirmasi terkirim ke Applicant. - Notifikasi masuk ke inbox Sekretariat. |
| PB20 | Pengajuan EC | Sebagai **Applicant**, saya ingin memantau status ajuan EC saya agar saya bisa mengetahui progres telaah etik. | Halaman daftar ajuan EC milik Applicant. Detail ajuan: status terkini, riwayat perubahan status, feedback reviewer (jika ada), link download Surat Kelaikan Etik (jika approved). | High | 5 | - Daftar semua ajuan EC milik user. - Detail ajuan: nomor protokol, judul, status, tanggal submit, tanggal update terakhir. - Timeline/riwayat perubahan status dengan timestamp. - Feedback reviewer bisa dibaca (jika status Resubmission/AWR). - Link download Surat Kelaikan Etik (jika Approved). |
| PB21 | Pengajuan EC | Sebagai **Applicant**, saya ingin mengunggah ulang dokumen perbaikan agar ajuan saya bisa direview ulang. | Upload revised documents setelah mendapat feedback Resubmission atau Approved with Recommendation. Status berubah menjadi "Revised". | High | 5 | - Tombol "Unggah Perbaikan" tersedia pada ajuan dengan status Resubmission atau AWR. - Upload dokumen revisi (bisa partial atau full). - Setelah submit, status berubah menjadi "Revised". - Notifikasi terkirim ke Sekretariat. |

---

## Epic 5: Evaluasi & Routing Dokumen (Sekretariat)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB22 | Evaluasi Dokumen | Sebagai **Sekretariat**, saya ingin melihat daftar ajuan EC yang belum diproses agar saya bisa memilih ajuan untuk dievaluasi. | Inbox Sekretariat: daftar ajuan dengan status "New Proposal" dan "Revised", diurutkan berdasarkan tanggal submit. | High | 3 | - Daftar ajuan New Proposal dan Revised tampil. - Sortable by tanggal submit, nomor protokol. - Bisa filter status. - Jumlah/badge per status. |
| PB23 | Evaluasi Dokumen | Sebagai **Sekretariat**, saya ingin melihat dan mengevaluasi dokumen ajuan EC agar saya bisa menentukan jenis review yang tepat. | Halaman detail ajuan: lihat semua dokumen yang diupload, preview/download dokumen, checklist kelengkapan. | High | 5 | - Semua dokumen yang diupload bisa di-preview atau didownload. - Checklist kelengkapan dokumen (mana yang ada, mana yang kurang). - Catatan evaluasi bisa ditambahkan. |
| PB24 | Evaluasi Dokumen | Sebagai **Sekretariat**, saya ingin menentukan jenis review (Exempted, Expedited, Full Board) agar ajuan diproses sesuai prosedur yang berlaku. | Dropdown/pilihan jenis review pada halaman detail ajuan. Jika Exempted, langsung set Approved. | High | 5 | - Pilihan jenis review: Exempted from Review, Expedited Review, Full Board Review. - Jika Exempted: status langsung menjadi Approved, flow ke penerbitan Surat. - Jika Expedited/Full Board: flow ke assignment reviewer. - Status berubah menjadi "On Review". |
| PB25 | Evaluasi Dokumen | Sebagai **Sekretariat**, saya ingin meng-assign reviewer ke ajuan EC agar dokumen bisa ditelaah oleh reviewer yang tepat. | Form assign reviewer: pilih reviewer dari daftar (min 3 untuk Expedited, min 5/semua untuk Full Board), set due date. Kirim email ke reviewer yang ditunjuk. | High | 5 | - Daftar reviewer yang tersedia (aktif) tampil. - Multi-select reviewer (min 3 Expedited, min 5 Full Board). - Set due date review. - Setelah assign, email notifikasi terkirim ke setiap reviewer. - Status ajuan: On Review. |

---

## Epic 6: Review EC (Reviewer)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB26 | Review EC | Sebagai **Reviewer**, saya ingin melihat daftar ajuan EC yang di-assign ke saya agar saya bisa mengerjakan review. | Daftar ajuan yang di-assign ke reviewer ini, dengan due date dan status (belum/sudah di-review). | High | 3 | - Daftar ajuan yang di-assign tampil. - Informasi: nomor protokol, judul, due date, status review. - Indikator overdue jika melewati due date. |
| PB27 | Review EC | Sebagai **Reviewer**, saya ingin membaca dan mereview dokumen ajuan EC agar saya bisa memberikan penilaian etik. | Halaman review: bisa baca/download semua dokumen ajuan, histori feedback sebelumnya (jika resubmission). | High | 5 | - Semua dokumen ajuan bisa dibaca/didownload. - Jika revised/resubmission, feedback sebelumnya tampil. - Bisa membandingkan dokumen versi lama vs baru (jika revised). |
| PB28 | Review EC | Sebagai **Reviewer**, saya ingin memberikan feedback/catatan atas ajuan EC agar Sekretariat bisa membuat keputusan. | Form feedback: textarea untuk catatan, rekomendasi (Approved/AWR/Resubmission), lampiran catatan (opsional). | High | 5 | - Form feedback dengan textarea (catatan lengkap). - Pilihan rekomendasi: Approved, Approved with Recommendation, Resubmission. - Bisa lampirkan file catatan (opsional). - Tombol Submit Feedback. |
| PB29 | Review EC | Sebagai **Reviewer**, saya ingin mensubmit feedback saya agar Sekretariat mendapat notifikasi dan bisa membuat keputusan. | Submit feedback. Notifikasi dikirim ke Sekretariat. | High | 2 | - Setelah submit, feedback tersimpan dan tidak bisa diedit. - Notifikasi terkirim ke Sekretariat. - Status review untuk reviewer ini berubah menjadi "Sudah Submit". |

---

## Epic 7: Keputusan & Post-Decision

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB30 | Keputusan | Sebagai **Sekretariat**, saya ingin membuat keputusan atas ajuan EC berdasarkan feedback reviewer agar proses review bisa diselesaikan. | Halaman keputusan: kompilasi semua feedback reviewer, pilihan keputusan (Approved, AWR, Resubmission, Disapproved), form alasan/catatan keputusan. Disapproved hanya tersedia untuk Full Board. | High | 8 | - Semua feedback reviewer terkompilasi dan bisa dibaca. - Pilihan keputusan: Approved, Approved with Recommendation, Resubmission. - Disapproved hanya muncul jika jenis review = Full Board. - Form wajib diisi: catatan keputusan. - Setelah submit, status ajuan berubah. |
| PB31 | Keputusan | Sebagai **Ketua Komisi Etik**, saya ingin memimpin dan memberikan persetujuan akhir pada Full Board Review agar keputusan panel sah. | Pada Full Board Review, Ketua Komisi Etik harus memberikan persetujuan akhir. Halaman khusus untuk Ketua melihat resume feedback + membuat keputusan bersama Sekretariat. | High | 5 | - Untuk Full Board: keputusan memerlukan approval Ketua Komisi Etik. - Ketua bisa melihat semua feedback reviewer. - Ketua bisa menambahkan catatan. - Keputusan final tercatat atas nama Sekretariat + Ketua. |
| PB32 | Keputusan | Sebagai **Sekretariat**, saya ingin menambahkan detail feedback dan mengirim notifikasi ke Applicant setelah keputusan dibuat agar Applicant mengetahui hasil review. | Setelah keputusan dibuat, Sekretariat menambahkan detail feedback untuk Applicant (catatan perbaikan, instruksi, dll). Email otomatis terkirim. | High | 3 | - Form detail feedback untuk Applicant (khusus AWR dan Resubmission). - Email notifikasi terkirim ke Applicant berisi status + ringkasan feedback. - Applicant bisa melihat detail feedback di sistem. |
| PB33 | Keputusan | Sebagai **Sekretariat**, saya ingin membuat dan mengupload Surat Kelaikan Etik agar Applicant yang disetujui mendapatkan surat resmi. | Form pembuatan Surat Kelaikan Etik: generate surat berdasarkan data ajuan, upload surat (PDF), link ke Ketua untuk tanda tangan. | High | 5 | - Form/template Surat Kelaikan Etik dengan data otomatis dari ajuan. - Upload surat yang sudah di-generate (PDF). - Status surat: Menunggu Tanda Tangan Ketua. |
| PB34 | Keputusan | Sebagai **Ketua Komisi Etik**, saya ingin menandatangani Surat Kelaikan Etik secara digital agar surat bisa diterbitkan ke Applicant. | Halaman daftar surat yang perlu ditandatangani. Ketua bisa preview surat dan menandatangani (digital signature atau approval). | High | 5 | - Daftar Surat Kelaikan Etik yang menunggu tanda tangan tampil di dashboard Ketua. - Preview surat bisa dilakukan. - Tombol "Tandatangani" mengubah status surat menjadi "Diterbitkan". - Email notifikasi + link download terkirim ke Applicant. |
| PB35 | Keputusan | Sebagai **Sekretariat**, saya ingin membuat alasan penolakan dan mengirim notifikasi untuk ajuan yang Disapproved agar Applicant mengetahui alasan ditolaknya ajuan. | Form alasan penolakan (wajib diisi). Email penolakan + alasan terkirim ke Applicant. | Medium | 3 | - Form alasan penolakan wajib isi sebelum finalisasi Disapproved. - Email penolakan berisi alasan lengkap terkirim ke Applicant. - Status final: Disapproved (tidak bisa diubah). |
| PB36 | Keputusan | Sebagai **Applicant**, saya ingin mengunduh Surat Kelaikan Etik agar saya memiliki bukti persetujuan etik penelitian. | Halaman download Surat Kelaikan Etik di detail ajuan yang sudah Approved. | High | 2 | - Link download Surat Kelaikan Etik tampil di detail ajuan (status Approved). - File yang didownload berupa PDF yang sudah ditandatangani. |

---

## Epic 8: Amendment (Pengajuan Perubahan Protokol)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB37 | Amendment | Sebagai **Applicant**, saya ingin mengajukan amendment pada protokol yang sudah approved agar perubahan penelitian tercatat dan ditinjau secara etik. | Menu "Ajukan Amendment" pada ajuan yang sudah Approved. Form: deskripsi perubahan, alasan perubahan, bagian yang berubah. Upload protokol revisi. | Medium | 5 | - Tombol "Ajukan Amendment" tersedia hanya pada ajuan status Approved/Certificate Issued. - Form amendment: deskripsi, alasan, bagian yang berubah. - Upload protokol revisi (highlight perubahan). - Upload dokumen pendukung baru (opsional). - Setelah submit, status: "Amendment Submitted". |
| PB38 | Amendment | Sebagai **Sekretariat**, saya ingin mereview dan mengklasifikasikan amendment agar bisa diproses sesuai tingkat perubahannya. | Halaman review amendment: klasifikasi Minor vs Major. Minor: approve langsung. Major: routing ke Expedited/Full Board. | Medium | 5 | - Daftar amendment yang masuk tampil di inbox Sekretariat. - Sekretariat bisa klasifikasi: Minor Amendment atau Major Amendment. - Minor: bisa langsung approve. - Major: routing ke Expedited Review atau Full Board Review. |
| PB39 | Amendment | Sebagai **Reviewer**, saya ingin mereview perubahan protokol (Major Amendment) agar risiko etik dari perubahan bisa dievaluasi. | Review amendment: bandingkan protokol awal vs revisi, berikan feedback. | Medium | 5 | - Dokumen protokol awal dan revisi bisa dibandingkan. - Form feedback amendment. - Submit feedback + notifikasi ke Sekretariat. |
| PB40 | Amendment | Sebagai **Sekretariat/Ketua**, saya ingin membuat keputusan atas amendment agar status amendment bisa difinalisasi. | Keputusan amendment: Approved, Revision Required, atau Rejected. Jika Approved, Surat Kelaikan Etik di-update/addendum. | Medium | 5 | - Pilihan keputusan: Amendment Approved, Revision Required, Amendment Rejected. - Jika Approved: Surat Kelaikan Etik diperbarui (addendum). - Jika Revision Required: Applicant diminta perbaiki dan upload ulang. - Jika Rejected: protokol awal tetap berlaku, email notifikasi terkirim. |

---

## Epic 9: Termination (Penghentian Dini Protokol)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB41 | Termination | Sebagai **Applicant**, saya ingin mengajukan penghentian dini (termination) protokol penelitian agar penghentian tercatat secara resmi. | Menu "Ajukan Termination" pada ajuan yang sudah Approved. Form: tanggal efektif, kategori alasan, deskripsi detail, status partisipan, langkah pengamanan. | Medium | 5 | - Tombol "Ajukan Termination" tersedia pada ajuan Approved/Certificate Issued. - Form termination: tanggal efektif, kategori alasan (dropdown), deskripsi, status partisipan, langkah pengamanan. - Upload dokumen pendukung (laporan interim, bukti). - Setelah submit, status: "Termination Submitted". |
| PB42 | Termination | Sebagai **Sekretariat**, saya ingin mereview dan memproses permintaan termination agar penghentian protokol tercatat dan terarsipkan. | Review termination: verifikasi kelengkapan, klasifikasi (Safety-Related / Non-Safety). Non-Safety: proses langsung. Safety: eskalasi ke Ketua. | Medium | 5 | - Daftar termination request tampil di inbox Sekretariat. - Sekretariat bisa verifikasi kelengkapan informasi. - Jika kurang lengkap: minta info tambahan ke Applicant. - Klasifikasi: Safety-Related (eskalasi ke Ketua) atau Non-Safety (proses langsung). |
| PB43 | Termination | Sebagai **Ketua Komisi Etik**, saya ingin mereview eskalasi termination terkait keselamatan partisipan agar bisa diambil langkah yang tepat. | Halaman eskalasi termination: review detail, memberikan keputusan (terima / instruksikan investigasi). | Medium | 5 | - Eskalasi safety-related termination tampil di dashboard Ketua. - Ketua bisa review detail penghentian. - Pilihan: Setujui Termination (+ instruksi pengamanan) atau Minta Investigasi Lanjut. - Jika investigasi: kembali ke Sekretariat. |
| PB44 | Termination | Sebagai **Sekretariat**, saya ingin memfinalisasi termination agar status protokol dan surat kelaikan etik diperbarui. | Finalisasi termination: update status protokol menjadi "Terminated", update status Surat Kelaikan Etik (dicabut/ditutup), arsipkan dokumen. | Medium | 3 | - Status protokol berubah menjadi "Terminated". - Surat Kelaikan Etik ditandai sebagai dicabut/ditutup. - Dokumen termination tersimpan di arsip. - Email notifikasi terkirim ke Applicant dan Reviewer terkait. |

---

## Epic 10: Manajemen Template (Admin)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB45 | Manajemen Template | Sebagai **Admin**, saya ingin mengupload template dokumen baru agar Applicant bisa mengunduh template terbaru. | Upload template baru: file (PDF/DOCX), metadata (nama, versi, deskripsi, tanggal berlaku). | Medium | 3 | - Form upload template: file + metadata (nama, versi, deskripsi, tanggal berlaku). - Template yang di-publish tampil di halaman download Applicant. |
| PB46 | Manajemen Template | Sebagai **Admin**, saya ingin mengupdate template dokumen yang sudah ada agar versi terbaru tersedia dan versi lama diarsipkan. | Update template: upload versi baru, versi lama otomatis diarsipkan (tetap tersimpan). | Medium | 3 | - Upload versi baru menggantikan versi lama di halaman download. - Versi lama diarsipkan dan tetap bisa diakses oleh Admin. - Riwayat versi tercatat. |
| PB47 | Manajemen Template | Sebagai **Admin**, saya ingin menonaktifkan template agar template yang sudah tidak berlaku tidak tersedia untuk didownload. | Nonaktifkan template: template tidak muncul di halaman download, tapi tetap tersimpan di sistem. | Low | 2 | - Template yang dinonaktifkan tidak tampil di halaman download Applicant. - Template tetap tersimpan di sistem dan bisa diaktifkan kembali. |

---

## Epic 11: Konfigurasi Sistem (Admin)

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB48 | Konfigurasi Sistem | Sebagai **Admin**, saya ingin mengkonfigurasi pengaturan email agar notifikasi sistem terkirim dengan benar. | Pengaturan SMTP, template email notifikasi. | Medium | 5 | - Form konfigurasi SMTP (host, port, user, password). - Template email bisa diedit per jenis notifikasi. - Test send email berfungsi. |
| PB49 | Konfigurasi Sistem | Sebagai **Admin**, saya ingin mengkonfigurasi parameter review agar prosedur review sesuai kebijakan yang berlaku. | Pengaturan: min reviewer Expedited (default 3), min reviewer Full Board (default 5), default due date, reminder interval. | Medium | 3 | - Form konfigurasi review parameters. - Perubahan berlaku untuk ajuan baru. - Validasi input (angka positif, dll). |
| PB50 | Konfigurasi Sistem | Sebagai **Admin**, saya ingin mengkonfigurasi pengaturan umum institusi agar identitas sistem sesuai dengan institusi. | Pengaturan: nama institusi, logo, format nomor protokol, tahun akademik aktif. | Low | 3 | - Form pengaturan umum. - Logo yang diupload tampil di header sistem dan surat. - Format nomor protokol bisa dikustomisasi. |

---

## Epic 12: Notifikasi & Email

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB51 | Notifikasi | Sebagai **pengguna**, saya ingin menerima notifikasi email otomatis saat ada perubahan status atau aksi yang relevan agar saya tidak ketinggalan informasi penting. | Sistem email otomatis untuk semua event penting: registrasi, aktivasi, submit ajuan, assignment review, feedback, keputusan, penerbitan surat, amendment, termination. | High | 8 | - Email terkirim otomatis untuk event: registrasi baru, aktivasi/penolakan akun, submit ajuan, assignment review, submit feedback, keputusan review, penerbitan surat, amendment, termination. - Email berisi informasi relevan + link ke sistem. |
| PB52 | Notifikasi | Sebagai **pengguna**, saya ingin melihat notifikasi di dalam sistem (in-app notification) agar saya bisa mengetahui update tanpa perlu cek email. | In-app notification: bell icon dengan count, daftar notifikasi, mark as read. | Medium | 5 | - Icon notifikasi (bell) di header dengan badge count. - Dropdown/halaman daftar notifikasi. - Notifikasi bisa di-mark as read. - Klik notifikasi redirect ke halaman terkait. |
| PB53 | Notifikasi | Sebagai **Sekretariat**, saya ingin mengirim email reminder ke Reviewer yang belum submit feedback melewati due date agar review tidak terlambat. | Fitur reminder: otomatis atau manual. Kirim email reminder ke reviewer yang overdue. | Medium | 3 | - Reminder otomatis terkirim sesuai interval yang dikonfigurasi. - Tombol manual "Kirim Reminder" tersedia di halaman detail ajuan. - Email reminder berisi detail ajuan + due date. |

---

## Epic 13: Laporan & Statistik

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB54 | Laporan | Sebagai **Admin/Ketua Komisi Etik**, saya ingin melihat laporan ringkasan ajuan EC agar saya bisa menganalisis kinerja proses telaah etik. | Laporan ringkasan: total ajuan per periode, per status, rata-rata waktu proses, distribusi jenis review. Filter by periode. | Low | 5 | - Dashboard laporan dengan chart/grafik. - Filter berdasarkan rentang tanggal. - Metrik: total ajuan, distribusi status, avg waktu proses, distribusi jenis review. - Export ke PDF/Excel. |
| PB55 | Laporan | Sebagai **Admin/Ketua Komisi Etik**, saya ingin melihat laporan kinerja reviewer agar saya bisa mengevaluasi kontribusi reviewer. | Laporan reviewer: jumlah review per reviewer, rata-rata waktu review, ketepatan due date. | Low | 5 | - Tabel kinerja reviewer. - Metrik per reviewer: jumlah review, avg waktu review, % tepat waktu. - Filter by periode. - Export ke PDF/Excel. |
| PB56 | Laporan | Sebagai **Admin**, saya ingin melihat laporan amendment dan termination agar data perubahan dan penghentian protokol terdokumentasi. | Laporan amendment (total, minor vs major, status) dan termination (total, per kategori, safety vs non-safety). | Low | 3 | - Tabel laporan amendment dan termination. - Filter by periode dan kategori. - Export ke PDF/Excel. |

---

## Epic 14: Audit Log

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB57 | Audit Log | Sebagai **Admin**, saya ingin melihat log aktivitas sistem agar saya bisa menelusuri siapa melakukan apa dan kapan. | Halaman audit log: timestamp, user, aksi, detail perubahan, IP address. Filter by tanggal, user, jenis aksi. | Low | 5 | - Tabel audit log dengan kolom: timestamp, user, aksi, detail, IP. - Filter by rentang tanggal, user, jenis aksi. - Pagination. - Export ke CSV/PDF. |

---

## Epic 15: Penyimpanan Dokumen

| ID | Epic/Modul | User Story | Deskripsi | Prioritas | Story Point | Acceptance Criteria |
|----|-----------|------------|-----------|-----------|-------------|---------------------|
| PB58 | Penyimpanan | Sebagai **Sekretariat**, saya ingin semua berkas yang diterima tersimpan secara elektronik agar dokumen bisa diakses sewaktu-waktu jika diperlukan. | Sistem penyimpanan dokumen digital untuk semua file yang diupload (ajuan, revision, surat, amendment, termination). Terorganisir per nomor protokol. | High | 8 | - Semua file tersimpan dan terorganisir per nomor protokol. - File bisa diakses/didownload kapan saja oleh role yang berwenang. - Versioning: jika ada dokumen revisi, versi lama tetap tersimpan. - Metadata file tercatat (nama, ukuran, tanggal upload, uploader). |

---

## Ringkasan Product Backlog

| Epic | Jumlah Item | Total Story Points | Prioritas Dominan |
|------|:-----------:|:-------------------:|:-----------------:|
| 1. Autentikasi & Registrasi | 7 | 25 | High |
| 2. Manajemen Pengguna (Admin) | 4 | 15 | High-Medium |
| 3. Dashboard | 5 | 23 | High-Medium |
| 4. Pengajuan EC | 5 | 23 | High |
| 5. Evaluasi & Routing | 4 | 18 | High |
| 6. Review EC (Reviewer) | 4 | 15 | High |
| 7. Keputusan & Post-Decision | 7 | 31 | High-Medium |
| 8. Amendment | 4 | 20 | Medium |
| 9. Termination | 4 | 18 | Medium |
| 10. Manajemen Template | 3 | 8 | Medium-Low |
| 11. Konfigurasi Sistem | 3 | 11 | Medium-Low |
| 12. Notifikasi & Email | 3 | 16 | High-Medium |
| 13. Laporan & Statistik | 3 | 13 | Low |
| 14. Audit Log | 1 | 5 | Low |
| 15. Penyimpanan Dokumen | 1 | 8 | High |
| **TOTAL** | **58** | **249** | |
