<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Bidang keahlian untuk Reviewer (PB02)
            $table->text('expertise')->nullable()->after('nidn_nim');
            // Tipe pendaftaran: Applicant atau Applicant+Reviewer
            $table->string('registration_role')->nullable()->default('Applicant')->after('expertise');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['expertise', 'registration_role']);
        });
    }
};
