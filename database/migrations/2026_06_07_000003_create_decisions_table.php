<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protokol_id')->constrained('protokols')->onDelete('cascade');
            $table->foreignId('decided_by')->constrained('users')->onDelete('cascade');
            $table->string('status')->default('Pending Decision'); // Pending Decision, Approved, Rejected
            $table->text('notes')->nullable();
            $table->string('certificate_number')->nullable();
            $table->string('letter_path')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('decisions');
    }
};
