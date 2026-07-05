<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Protokol>
 */
class ProtokolFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'              => User::factory(),
            'judul'               => fake()->sentence(8),
            'peneliti'            => fake()->name(),
            'nidn_nim'            => (string) fake()->numerify('##########'),
            'email'               => fake()->safeEmail(),
            'no_hp'               => fake()->numerify('08##########'),
            'institusi'           => fake()->company(),
            'role_peneliti'       => 'Dosen',
            'lokasi_penelitian'   => fake()->city(),
            'anggota_tim'         => fake()->name(),
            'subjek_penelitian'   => 'Manusia',
            'metode_penelitian'   => fake()->sentence(),
            'risiko_penelitian'   => 'Minimal',
            'deskripsi_penelitian' => fake()->paragraph(),
            'proposal_path'       => 'documents/proposal.pdf',
            'informed_consent_path' => 'documents/ic.pdf',
            'surat_izin_path'     => 'documents/izin.pdf',
            'nomor_pengajuan'     => 'KEP-' . fake()->unique()->numerify('2026-####'),
            'status'              => 'Pending Admin',
        ];
    }

    /** Sudah lolos verifikasi Admin, menunggu Sekretariat. */
    public function pendingSekretariat(): static
    {
        return $this->state(fn () => ['status' => 'Pending']);
    }

    /** Sudah diklasifikasi & sedang direview. */
    public function direview(string $reviewType = 'Expedited'): static
    {
        return $this->state(fn () => [
            'status'        => 'Direview',
            'review_type'   => $reviewType,
            'review_status' => 'Assigned',
            'assigned_at'   => now(),
            'due_date'      => now()->addDays(14),
        ]);
    }

    /** Menunggu pembuatan/penandatanganan surat oleh Ketua. */
    public function pendingKetua(string $reviewType = 'Full Board'): static
    {
        return $this->state(fn () => [
            'status'      => 'Pending Ketua',
            'review_type' => $reviewType,
        ]);
    }

    /** Sudah disetujui (Disetujui). */
    public function disetujui(): static
    {
        return $this->state(fn () => [
            'status'         => 'Disetujui',
            'nomor_surat'    => '100/UN/KEP/2026',
            'sertifikat_path' => 'sertifikat/cert.pdf',
        ]);
    }
}
