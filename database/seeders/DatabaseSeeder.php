<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Protokol;
use App\Models\JadwalRapat;
use App\Models\Pengumuman;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles
        $roles = ['Applicant', 'Reviewer', 'Sekretariat', 'Ketua Komisi Etik', 'Admin'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 2. Create Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'active_role_name' => 'Admin',
                'status' => 'active',
            ]
        );
        $admin->assignRole('Admin');

        $sekre = User::firstOrCreate(
            ['email' => 'sekre@example.com'],
            [
                'name' => 'Budi Raharjo, M.Kom.',
                'password' => Hash::make('password'),
                'active_role_name' => 'Sekretariat',
                'status' => 'active',
                'phone_number' => '081234567890',
                'address' => 'Gedung Rektorat Lt. 2, Kampus Pusat',
                'institution' => 'Komisi Etik Universitas',
            ]
        );
        $sekre->assignRole('Sekretariat');

        $peneliti = User::firstOrCreate(
            ['email' => 'peneliti@example.com'],
            [
                'name' => 'Dr. Andi Wijaya',
                'password' => Hash::make('password'),
                'active_role_name' => 'Applicant',
                'status' => 'active',
                'phone_number' => '087890123456',
                'address' => 'Jl. Pendidikan No. 45, Kota Baru',
                'institution' => 'Fakultas Kedokteran',
                'role_type' => 'Dosen',
                'nidn_nim' => '0412088501',
            ]
        );
        $peneliti->assignRole('Applicant');

        $reviewer1 = User::firstOrCreate(
            ['email' => 'reviewer1@example.com'],
            [
                'name' => 'Prof. Dr. H. Ahmad Fauzi',
                'password' => Hash::make('password'),
                'active_role_name' => 'Reviewer',
                'status' => 'active',
                'phone_number' => '085234567812',
                'address' => 'Perum Dosen Blok A/10',
                'institution' => 'Lembaga Penelitian',
                'role_type' => 'Peneliti',
                'nidn_nim' => '0011026002',
            ]
        );
        $reviewer1->assignRole('Reviewer');

        $reviewer2 = User::firstOrCreate(
            ['email' => 'reviewer2@example.com'],
            [
                'name' => 'Dr. Sri Wahyuni, M.Si.',
                'password' => Hash::make('password'),
                'active_role_name' => 'Reviewer',
                'status' => 'active',
                'phone_number' => '082134567888',
                'address' => 'Komp. Asri Indah C/4',
                'institution' => 'Fakultas Farmasi',
                'role_type' => 'Dosen',
                'nidn_nim' => '0322057901',
            ]
        );
        $reviewer2->assignRole('Reviewer');

        // Create a pending applicant for Sekretariat dashboard verification demo
        User::firstOrCreate(
            ['email' => 'pendaftar@example.com'],
            [
                'name' => 'Rina Kartika',
                'password' => Hash::make('password'),
                'active_role_name' => 'Applicant',
                'status' => 'pending',
                'phone_number' => '081298765432',
                'address' => 'Gg. Swadaya No. 8',
                'institution' => 'Fakultas Kesehatan Masyarakat',
                'role_type' => 'Mahasiswa',
                'nidn_nim' => '101911233005',
            ]
        );

        // 3. Create Protokols (Proposals)
        Protokol::create([
            'user_id' => $peneliti->id,
            'reviewer_id' => $reviewer1->id,
            'nomor_pengajuan' => 'KEP-2026-0001',
            'judul' => 'Analisis Efektivitas Terapi Ekstrak Daun Kelor Terhadap Kadar Gula Darah Pasien Diabetes Tipe 2',
            'peneliti' => 'Dr. Andi Wijaya',
            'nidn_nim' => '0412088501',
            'email' => 'peneliti@example.com',
            'no_hp' => '087890123456',
            'institusi' => 'Fakultas Kedokteran',
            'role_peneliti' => 'Dosen',
            'lokasi_penelitian' => 'RSUD Kota Sehat',
            'anggota_tim' => 'Dr. Budi Utomo, Sp.PD., Riska Amelia, S.Kep.',
            'subjek_penelitian' => 'Manusia (Pasien Diabetes)',
            'metode_penelitian' => 'Randomized Controlled Trial (RCT) dengan pre and post test design.',
            'risiko_penelitian' => 'Minimal (pengambilan sampel darah kapiler secara berkala). Mitigasi: dilakukan oleh tenaga perawat ahli.',
            'deskripsi_penelitian' => 'Penelitian ini bertujuan menguji efektivitas ekstrak daun kelor sebagai terapi komplementer bagi pasien diabetes tipe 2 yang rutin mengonsumsi metformin.',
            'proposal_path' => '/storage/uploads/proposal_daun_kelor.pdf',
            'informed_consent_path' => '/storage/uploads/informed_consent_kelor.pdf',
            'surat_izin_path' => '/storage/uploads/izin_rsud_sehat.pdf',
            'nomor_surat' => '102/UN2.F1/KEP/2026',
            'status' => 'Disetujui',
            'sertifikat_path' => '/storage/sertifikat/KEP-2026-0001.pdf',
        ]);

        Protokol::create([
            'user_id' => $peneliti->id,
            'reviewer_id' => $reviewer2->id,
            'nomor_pengajuan' => 'KEP-2026-0002',
            'judul' => 'Uji Toksisitas Akut Formulasi Serum Anti-Aging Berbasis Kolagen Kulit Ikan Patin pada Mencit Putih',
            'peneliti' => 'Dr. Andi Wijaya',
            'nidn_nim' => '0412088501',
            'email' => 'peneliti@example.com',
            'no_hp' => '087890123456',
            'institusi' => 'Fakultas Kedokteran',
            'role_peneliti' => 'Dosen',
            'lokasi_penelitian' => 'Laboratorium Farmakologi Kedokteran',
            'anggota_tim' => 'Novianti, S.Farm.',
            'subjek_penelitian' => 'Hewan Coba (Mencit Balb/c)',
            'metode_penelitian' => 'Metode uji OECD 423 untuk penentuan tingkat toksisitas akut dermal.',
            'risiko_penelitian' => 'Sedang (potensi iritasi kulit mencit). Mitigasi: aplikasi dihentikan jika terjadi eritema parah.',
            'deskripsi_penelitian' => 'Riset ini mengevaluasi keamanan sediaan kolagen kulit ikan patin lokal yang dirancang untuk produk kecantikan medis.',
            'proposal_path' => '/storage/uploads/proposal_toksisitas_patin.pdf',
            'informed_consent_path' => '/storage/uploads/consent_patin.pdf',
            'surat_izin_path' => '/storage/uploads/izin_lab_farmako.pdf',
            'status' => 'Direview',
        ]);

        Protokol::create([
            'user_id' => $peneliti->id,
            'nomor_pengajuan' => 'KEP-2026-0003',
            'judul' => 'Survei Kepatuhan Protokol Kesehatan dan Status Imunitas Lansia Pasca Vaksinasi Booster Kedua',
            'peneliti' => 'Dr. Andi Wijaya',
            'nidn_nim' => '0412088501',
            'email' => 'peneliti@example.com',
            'no_hp' => '087890123456',
            'institusi' => 'Fakultas Kedokteran',
            'role_peneliti' => 'Dosen',
            'lokasi_penelitian' => 'Kecamatan Sukamaju',
            'anggota_tim' => 'Yusuf Hermawan',
            'subjek_penelitian' => 'Manusia (Lansia > 60 tahun)',
            'metode_penelitian' => 'Cross-sectional survey dengan wawancara terstruktur dan pemeriksaan titer antibodi kuantitatif.',
            'risiko_penelitian' => 'Minimal (pengambilan darah vena).',
            'deskripsi_penelitian' => 'Mengevaluasi korelasi kepatuhan lansia dalam menjaga prokes terhadap titer antibodi pasca booster.',
            'proposal_path' => '/storage/uploads/proposal_survei_lansia.pdf',
            'informed_consent_path' => '/storage/uploads/consent_lansia.pdf',
            'surat_izin_path' => '/storage/uploads/izin_sukamaju.pdf',
            'status' => 'Revisi',
            'catatan_revisi' => 'Mohon lampirkan kuesioner wawancara pada kolom berkas instrumen.',
        ]);

        // 4. Create Rapat Schedules
        JadwalRapat::create([
            'agenda' => 'Sidang Pleno Etik Ke-12: Penetapan Protokol Farmasi & Kedokteran',
            'tanggal' => Carbon::now()->addDays(5)->toDateString(),
            'waktu' => '09:00:00',
            'tempat' => 'Ruang Rapat Senat Gedung A / Zoom Meeting',
            'status' => 'Terjadwal',
        ]);

        JadwalRapat::create([
            'agenda' => 'Sidang Pleno Etik Ke-13: Protokol Kesehatan Masyarakat & Kedokteran Gigi',
            'tanggal' => Carbon::now()->addDays(12)->toDateString(),
            'waktu' => '13:00:00',
            'tempat' => 'Aula Komisi Etik Lt. 3',
            'status' => 'Terjadwal',
        ]);

        // 5. Create Announcements
        Pengumuman::create([
            'judul' => 'Penyesuaian Biaya Administrasi Pengusulan Etik Peneliti Luar',
            'konten' => 'Diberitahukan mulai tanggal 1 Juni 2026, terdapat penyesuaian tarif pengusulan Ethical Clearance bagi pengusul dari luar institusi universitas sebesar Rp. 350.000,- per usulan.',
            'tanggal' => Carbon::now()->subDays(2)->toDateString(),
        ]);

        Pengumuman::create([
            'judul' => 'Template Baru Informed Consent Komisi Etik Penelitian Kesehatan',
            'konten' => 'Telah diunggah template lembar persetujuan setelah penjelasan (Informed Consent) versi 2026. Peneliti wajib menggunakan format baru ini mulai pengusulan berikutnya.',
            'tanggal' => Carbon::now()->subDays(10)->toDateString(),
        ]);

        // 6. Create Messages
        Message::create([
            'user_id' => $peneliti->id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject' => 'Catatan Revisi Administrasi: KEP-2026-0003',
            'body' => "Yth. Dr. Andi Wijaya,\n\nBerdasarkan verifikasi administrasi untuk proposal Anda berjudul \"Survei Kepatuhan Protokol Kesehatan dan Status Imunitas Lansia Pasca Vaksinasi Booster Kedua\", terdapat kekurangan berkas. Mohon segera mengunggah kuesioner instrumen penelitian pada formulir revisi agar usulan dapat diteruskan ke penelaah.\n\nSalam,\nSekretariat Komisi Etik",
            'is_read' => false,
        ]);

        Message::create([
            'user_id' => $peneliti->id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject' => 'Sertifikat Kelayakan Etik Diterbitkan: KEP-2026-0001',
            'body' => "Yth. Dr. Andi Wijaya,\n\nSelamat! Sertifikat Layak Etik (Ethical Clearance) untuk proposal Anda berjudul \"Analisis Efektivitas Terapi Ekstrak Daun Kelor Terhadap Kadar Gula Darah Pasien Diabetes Tipe 2\" telah diterbitkan dengan Nomor Surat 102/UN2.F1/KEP/2026. Anda dapat mengunduh berkas sertifikat di menu Dokumen.\n\nSalam,\nSekretariat Komisi Etik",
            'is_read' => true,
        ]);
    }
}
