<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amendments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protokol_id')->constrained('protokols')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['Minor', 'Major'])->default('Minor');
            $table->text('description');
            $table->text('reason');
            $table->json('changed_sections')->nullable();
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->foreignId('decided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('decided_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('amendment_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amendment_id')->constrained('amendments')->cascadeOnDelete();
            $table->string('document_type'); // e.g. "proposal", "informed_consent", etc.
            $table->string('file_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amendment_documents');
        Schema::dropIfExists('amendments');
    }
};
