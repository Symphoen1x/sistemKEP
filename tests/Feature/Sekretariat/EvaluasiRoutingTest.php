<?php

use App\Models\Decision;
use App\Models\Protokol;
use App\Models\Review;

test('sekretariat dapat mengklasifikasikan review sebagai Expedited', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->pendingSekretariat()->create();

    $response = $this->actingAs($sekre)->post(route('sekretariat.classifyReview', $protokol->id), [
        'review_type' => 'Expedited',
        'due_date'    => now()->addDays(14)->toDateString(),
    ]);

    $response->assertSessionHas('status');
    expect($protokol->fresh()->review_type)->toBe('Expedited');
    expect($protokol->fresh()->review_status)->toBe('Classified');
});

test('klasifikasi Exempted otomatis menyetujui proposal dan membuat Decision', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->pendingSekretariat()->create();

    $this->actingAs($sekre)->post(route('sekretariat.classifyReview', $protokol->id), [
        'review_type' => 'Exempted',
        'due_date'    => now()->addDays(7)->toDateString(),
    ]);

    expect($protokol->fresh()->status)->toBe('Disetujui');
    $this->assertDatabaseHas('decisions', [
        'protokol_id' => $protokol->id,
        'status'      => 'Approved',
    ]);
});

test('klasifikasi menolak due_date di masa lampau', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->pendingSekretariat()->create();

    $response = $this->actingAs($sekre)
        ->from(route('sekretariat.evaluateProposal', $protokol->id))
        ->post(route('sekretariat.classifyReview', $protokol->id), [
            'review_type' => 'Expedited',
            'due_date'    => now()->subDay()->toDateString(),
        ]);

    $response->assertSessionHasErrors('due_date');
});

test('sekretariat dapat assign reviewer untuk Expedited (min 3)', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $reviewers = collect(range(1, 3))->map(fn () => userWithRole('Reviewer'));

    $response = $this->actingAs($sekre)->post(route('sekretariat.assignReviewers', $protokol->id), [
        'reviewer_ids' => $reviewers->pluck('id')->all(),
    ]);

    $response->assertSessionHas('status');
    expect(Review::where('protokol_id', $protokol->id)->count())->toBe(3);
    expect($protokol->fresh()->status)->toBe('Direview');
    expect($protokol->fresh()->review_status)->toBe('Assigned');
});

test('assign reviewer Expedited gagal jika kurang dari minimum', function () {
    $sekre = userWithRole('Sekretariat');
    $protokol = Protokol::factory()->direview('Expedited')->create();
    $reviewers = collect(range(1, 2))->map(fn () => userWithRole('Reviewer'));

    $response = $this->actingAs($sekre)
        ->from(route('sekretariat.evaluateProposal', $protokol->id))
        ->post(route('sekretariat.assignReviewers', $protokol->id), [
            'reviewer_ids' => $reviewers->pluck('id')->all(),
        ]);

    $response->assertSessionHasErrors('reviewer_ids');
    expect(Review::count())->toBe(0);
});

test('applicant tidak bisa mengakses aksi evaluasi sekretariat', function () {
    $applicant = userWithRole('Applicant');
    $protokol = Protokol::factory()->pendingSekretariat()->create();

    $this->actingAs($applicant)
        ->post(route('sekretariat.classifyReview', $protokol->id), [
            'review_type' => 'Expedited',
            'due_date'    => now()->addDays(7)->toDateString(),
        ])
        ->assertForbidden();
});
