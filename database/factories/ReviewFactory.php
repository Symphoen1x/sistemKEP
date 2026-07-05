<?php

namespace Database\Factories;

use App\Models\Protokol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'protokol_id'    => Protokol::factory(),
            'reviewer_id'    => User::factory(),
            'feedback'       => null,
            'recommendation' => null,
            'status'         => 'Assigned',
            'assigned_at'    => now(),
            'submitted_at'   => null,
        ];
    }

    /** Review yang sudah disubmit reviewer. */
    public function completed(string $recommendation = 'Approved'): static
    {
        return $this->state(fn () => [
            'status'         => 'Completed',
            'feedback'       => fake()->paragraph(),
            'recommendation' => $recommendation,
            'submitted_at'   => now(),
        ]);
    }
}
