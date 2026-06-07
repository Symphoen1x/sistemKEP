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
        Schema::table('protokols', function (Blueprint $table) {
            $table->string('review_type')->nullable()->after('status'); // Exempted, Expedited, Full Board
            $table->string('review_status')->nullable()->after('review_type'); // Pending, Assigned, Completed
            $table->timestamp('assigned_at')->nullable()->after('review_status');
            $table->timestamp('due_date')->nullable()->after('assigned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('protokols', function (Blueprint $table) {
            $table->dropColumn(['review_type', 'review_status', 'assigned_at', 'due_date']);
        });
    }
};
