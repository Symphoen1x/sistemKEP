<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('decisions', function (Blueprint $table) {
            // Feedback detail yang ditujukan ke Applicant (untuk AWR & Resubmission)
            $table->text('feedback_applicant')->nullable()->after('notes');
        });
    }

    public function down(): void
    {
        Schema::table('decisions', function (Blueprint $table) {
            $table->dropColumn('feedback_applicant');
        });
    }
};
