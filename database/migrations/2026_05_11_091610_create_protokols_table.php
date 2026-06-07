<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('protokols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Peneliti
            $table->string('peneliti');
            $table->string('nidn_nim')->nullable();
            $table->string('email')->nullable();
            $table->string('no_hp')->nullable();
            $table->string('institusi')->nullable();
            $table->string('role_peneliti')->default('Mahasiswa');

            // Info Penelitian
            $table->string('judul');
            $table->string('lokasi_penelitian')->nullable();
            $table->text('anggota_tim')->nullable();
            $table->string('subjek_penelitian')->nullable();

            // Metodologi & Deskripsi
            $table->text('metode_penelitian')->nullable();
            $table->text('risiko_penelitian')->nullable();
            $table->text('deskripsi_penelitian')->nullable();

            // File paths
            $table->string('proposal_path')->nullable();
            $table->string('informed_consent_path')->nullable();
            $table->string('surat_izin_path')->nullable();
            $table->string('instrumen_path')->nullable();
            $table->string('sertifikat_path')->nullable();
            $table->string('sk_path')->nullable();

            // Numbers & Status
            $table->string('nomor_pengajuan')->nullable();
            $table->string('nomor_surat')->nullable();
            $table->string('status')->default('Pending'); // Pending, Direview, Revisi, Disetujui, Ditolak
            $table->text('catatan_revisi')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('protokols');
    }
};
