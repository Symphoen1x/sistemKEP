<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protokol_id')->constrained()->onDelete('cascade');
            $table->string('document_type'); // proposal, informed_consent, surat_izin, instrumen, sertifikat, sk, amendment
            $table->unsignedInteger('version')->default(1);
            $table->string('file_path');
            $table->string('original_filename')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable(); // bytes
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('upload_context')->nullable(); // initial, revisi, amendment, sertifikat, sk
            $table->timestamps();

            $table->index(['protokol_id', 'document_type', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_versions');
    }
};
