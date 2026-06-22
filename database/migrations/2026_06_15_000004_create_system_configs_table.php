<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_configs', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general'); // general, review, institution
            $table->string('label');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed default config values
        DB::table('system_configs')->insert([
            // Review params
            ['key' => 'min_reviewer_expedited',  'value' => '3',  'group' => 'review',      'label' => 'Min. Reviewer Expedited',  'description' => 'Jumlah minimum reviewer untuk Expedited Review', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'min_reviewer_full_board',  'value' => '5',  'group' => 'review',      'label' => 'Min. Reviewer Full Board',  'description' => 'Jumlah minimum reviewer untuk Full Board Review', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'default_due_days',         'value' => '14', 'group' => 'review',      'label' => 'Default Due Date (hari)',    'description' => 'Tenggat waktu review default dalam hari', 'created_at' => now(), 'updated_at' => now()],
            // Institution
            ['key' => 'institution_name',         'value' => 'Komisi Etik Penelitian', 'group' => 'institution', 'label' => 'Nama Institusi', 'description' => 'Nama institusi yang ditampilkan di sistem', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'protocol_number_format',   'value' => 'KEP-{YEAR}-{SEQ}', 'group' => 'institution', 'label' => 'Format Nomor Protokol', 'description' => 'Format auto-generate nomor protokol', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_configs');
    }
};
