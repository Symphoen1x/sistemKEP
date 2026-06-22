<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('terminations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protokol_id')->constrained('protokols')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('effective_date');
            $table->string('reason_category'); // e.g. "Safety", "Non-Safety", "Administrative"
            $table->text('description');
            $table->string('participant_status')->nullable(); // status of research participants
            $table->text('safety_measures')->nullable();
            $table->boolean('is_safety_related')->default(false);
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected, Eskalasi
            $table->foreignId('decided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('decided_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('terminations');
    }
};
