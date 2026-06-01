<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_rapats', function (Blueprint $table) {
            $table->id();
            $table->string('agenda');
            $table->date('tanggal');
            $table->time('waktu');
            $table->string('tempat');
            $table->string('status')->default('Terjadwal'); // Terjadwal, Selesai, Batal
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_rapats');
    }
};
