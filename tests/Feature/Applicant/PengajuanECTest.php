<?php

use App\Models\Protokol;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Alur Pengajuan Ethical Clearance — halaman "Pengajuan Penelitian Baru"
 * (route: applicant.pengajuan / applicant.pengajuan.store -> storePengajuan).
 */

function validProposalPayload(array $overrides = []): array
{
    return array_merge([
        'nama'                 => 'Dr. Andi',
        'nidn_nim'             => '0412088501',
        'email'                => 'andi@example.com',
        'no_hp'                => '08123456789',
        'institusi'            => 'Fakultas Kedokteran',
        'role_peneliti'        => 'Dosen',
        'judul'                => 'Penelitian Uji Etik Contoh',
        'lokasi_penelitian'    => 'RSUD Kota',
        'anggota_tim'          => 'Tim A',
        'subjek_penelitian'    => 'Manusia',
        'metode_penelitian'    => 'RCT',
        'risiko_penelitian'    => 'Minimal',
        'deskripsi_penelitian' => 'Deskripsi singkat penelitian.',
        'proposal'             => UploadedFile::fake()->create('proposal.pdf', 100, 'application/pdf'),
        'informed_consent'     => UploadedFile::fake()->create('ic.pdf', 100, 'application/pdf'),
        'surat_izin'           => UploadedFile::fake()->create('izin.pdf', 100, 'application/pdf'),
        'formulir_pengajuan'   => UploadedFile::fake()->create('formulir.pdf', 100, 'application/pdf'),
        'ringkasan_protokol'   => UploadedFile::fake()->create('ringkasan.pdf', 100, 'application/pdf'),
    ], $overrides);
}

test('applicant dapat submit pengajuan dengan seluruh dokumen wajib', function () {
    Storage::fake('public');
    $applicant = userWithRole('Applicant');

    $response = $this->actingAs($applicant)
        ->post(route('applicant.pengajuan.store'), validProposalPayload());

    $response->assertRedirect(route('applicant.riwayat'));
    $response->assertSessionHas('status');

    $protokol = Protokol::first();
    expect($protokol)->not->toBeNull();
    expect($protokol->user_id)->toBe($applicant->id);
    expect($protokol->status)->toBe('Pending Admin');
    expect($protokol->nomor_pengajuan)->toStartWith('KEP-');
    expect($protokol->proposal_path)->not->toBeNull();
    expect($protokol->formulir_pengajuan_path)->not->toBeNull();
    expect($protokol->ringkasan_protokol_path)->not->toBeNull();
});

test('pengajuan gagal tanpa dokumen proposal wajib', function () {
    Storage::fake('public');
    $applicant = userWithRole('Applicant');

    $payload = validProposalPayload();
    unset($payload['proposal']);

    $response = $this->actingAs($applicant)
        ->from(route('applicant.pengajuan'))
        ->post(route('applicant.pengajuan.store'), $payload);

    $response->assertSessionHasErrors('proposal');
    $this->assertDatabaseCount('protokols', 0);
});

test('pengajuan gagal tanpa berkas Formulir Pengajuan & Ringkasan Protokol bertanda tangan', function () {
    Storage::fake('public');
    $applicant = userWithRole('Applicant');

    $payload = validProposalPayload();
    unset($payload['formulir_pengajuan'], $payload['ringkasan_protokol']);

    $response = $this->actingAs($applicant)
        ->from(route('applicant.pengajuan'))
        ->post(route('applicant.pengajuan.store'), $payload);

    $response->assertSessionHasErrors(['formulir_pengajuan', 'ringkasan_protokol']);
    $this->assertDatabaseCount('protokols', 0);
});

test('nomor pengajuan ter-generate unik dan berurutan', function () {
    Storage::fake('public');
    $applicant = userWithRole('Applicant');

    $this->actingAs($applicant)->post(route('applicant.pengajuan.store'), validProposalPayload());
    $this->actingAs($applicant)->post(route('applicant.pengajuan.store'), validProposalPayload([
        'judul' => 'Penelitian Kedua',
    ]));

    $nomors = Protokol::pluck('nomor_pengajuan');
    expect($nomors)->toHaveCount(2);
    expect($nomors->unique())->toHaveCount(2);
});

test('non-applicant tidak bisa mengakses form pengajuan', function () {
    $reviewer = userWithRole('Reviewer');

    $this->actingAs($reviewer)
        ->get(route('applicant.pengajuan'))
        ->assertForbidden();
});
