<?php

use App\Models\Decision;
use App\Models\Protokol;
use App\Models\Review;

test('reviewer dapat submit feedback pada review yang ditugaskan', function () {
    $reviewer = userWithRole('Reviewer');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $review = Review::factory()->create([
        'protokol_id' => $protokol->id,
        'reviewer_id' => $reviewer->id,
    ]);

    $response = $this->actingAs($reviewer)->post(route('reviewer.submitReview', $review->id), [
        'feedback'       => 'Catatan review yang cukup panjang untuk lolos validasi.',
        'recommendation' => 'Approved',
    ]);

    $response->assertRedirect(route('reviewer.history'));
    expect($review->fresh()->status)->toBe('Completed');
    expect($review->fresh()->recommendation)->toBe('Approved');
});

test('reviewer lain tidak bisa submit review milik orang lain', function () {
    $reviewerA = userWithRole('Reviewer');
    $reviewerB = userWithRole('Reviewer');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $review = Review::factory()->create([
        'protokol_id' => $protokol->id,
        'reviewer_id' => $reviewerA->id,
    ]);

    $this->actingAs($reviewerB)->post(route('reviewer.submitReview', $review->id), [
        'feedback'       => 'Mencoba menyusup ke review orang lain.',
        'recommendation' => 'Approved',
    ])->assertForbidden();
});

test('proposal pindah ke Pending Surat saat semua reviewer Approved', function () {
    $reviewer = userWithRole('Reviewer');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $review = Review::factory()->create([
        'protokol_id' => $protokol->id,
        'reviewer_id' => $reviewer->id,
    ]);

    $this->actingAs($reviewer)->post(route('reviewer.submitReview', $review->id), [
        'feedback'       => 'Semua aspek etik telah terpenuhi dengan baik.',
        'recommendation' => 'Approved',
    ]);

    expect($protokol->fresh()->status)->toBe('Pending Surat');
    expect($protokol->fresh()->review_status)->toBe('Completed');
});

test('submit review menolak rekomendasi tidak valid', function () {
    $reviewer = userWithRole('Reviewer');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $review = Review::factory()->create([
        'protokol_id' => $protokol->id,
        'reviewer_id' => $reviewer->id,
    ]);

    $this->actingAs($reviewer)
        ->from(route('reviewer.showReviewForm', $review->id))
        ->post(route('reviewer.submitReview', $review->id), [
            'feedback'       => 'Feedback valid panjangnya.',
            'recommendation' => 'Maybe',
        ])
        ->assertSessionHasErrors('recommendation');
});

test('sekretariat dapat membuat keputusan Approved', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->direview('Expedited')->create([
        'review_status'  => 'Completed',
        'sekretariat_id' => $sekre->id,
    ]);

    $response = $this->actingAs($sekre)->post(route('sekretariat.makeDecision', $protokol->id), [
        'status' => 'Approved',
        'notes'  => 'Disetujui berdasarkan rekomendasi reviewer.',
    ]);

    $response->assertSessionHas('status');
    expect($protokol->fresh()->status)->toBe('Disetujui');

    $decision = Decision::where('protokol_id', $protokol->id)->first();
    expect($decision->status)->toBe('Approved');
    expect($decision->certificate_number)->toStartWith('SERTIF-');
});

test('keputusan Disapproved ditolak untuk review non Full Board', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->direview('Expedited')->create([
        'review_status'  => 'Completed',
        'sekretariat_id' => $sekre->id,
    ]);

    $response = $this->actingAs($sekre)->post(route('sekretariat.makeDecision', $protokol->id), [
        'status' => 'Disapproved',
        'notes'  => 'Mencoba menolak proposal expedited.',
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseCount('decisions', 0);
    expect($protokol->fresh()->status)->not->toBe('Ditolak');
});

test('ketua dapat menandatangani surat untuk proposal Pending Ketua', function () {
    $ketua = userWithRole('Ketua Komisi Etik');
    $protokol = Protokol::factory()->pendingKetua()->create([
        'nomor_surat' => '101/UN/KEP/2026',
    ]);

    $response = $this->actingAs($ketua)->post(route('ketua.signSurat', $protokol->id));

    $response->assertSessionHas('status');
    expect($protokol->fresh()->status)->toBe('Disetujui');
});
