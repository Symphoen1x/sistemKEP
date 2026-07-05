<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PB17/Opsi A — Berkas pengesahan bertanda tangan (Peneliti + Pembimbing/Supervisor):
     * Formulir Pengajuan Telaah Etik & Ringkasan Protokol.
     */
    public function up(): void
    {
        Schema::table('protokols', function (Blueprint $table) {
            $table->string('formulir_pengajuan_path')->nullable()->after('surat_izin_path');
            $table->string('ringkasan_protokol_path')->nullable()->after('formulir_pengajuan_path');
        });
    }

    public function down(): void
    {
        Schema::table('protokols', function (Blueprint $table) {
            $table->dropColumn(['formulir_pengajuan_path', 'ringkasan_protokol_path']);
        });
    }
};
