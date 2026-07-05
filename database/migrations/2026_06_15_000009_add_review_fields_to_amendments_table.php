<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('amendments', function (Blueprint $table) {
            // Reviewer assignment for Major Amendment review flow
            $table->foreignId('reviewer_id')
                ->nullable()
                ->after('status')
                ->constrained('users')
                ->nullOnDelete();

            // Review status: null (Minor/not assigned), Assigned, Completed
            $table->string('review_status')
                ->nullable()
                ->after('reviewer_id');

            // Reviewer's feedback on Major Amendment
            $table->text('review_feedback')
                ->nullable()
                ->after('review_status');

            // Reviewer's recommendation: Approved, Conditionally Approved, Rejected
            $table->string('reviewer_recommendation')
                ->nullable()
                ->after('review_feedback');

            // Timestamps for review assignment and submission
            $table->timestamp('review_assigned_at')
                ->nullable()
                ->after('reviewer_recommendation');

            $table->timestamp('review_submitted_at')
                ->nullable()
                ->after('review_assigned_at');
        });
    }

    public function down(): void
    {
        Schema::table('amendments', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->dropColumn([
                'reviewer_id',
                'review_status',
                'review_feedback',
                'reviewer_recommendation',
                'review_assigned_at',
                'review_submitted_at',
            ]);
        });
    }
};
