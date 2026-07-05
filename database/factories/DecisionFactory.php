<?php

namespace Database\Factories;

use App\Models\Protokol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Decision>
 */
class DecisionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'protokol_id'        => Protokol::factory(),
            'decided_by'         => User::factory(),
            'status'             => 'Approved',
            'notes'              => fake()->sentence(),
            'feedback_applicant' => null,
            'certificate_number' => null,
            'letter_path'        => null,
            'decided_at'         => now(),
        ];
    }
}
