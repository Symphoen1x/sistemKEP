<?php

namespace App\Policies;

use App\Models\Protokol;
use App\Models\User;

class ProtokolPolicy
{
    /**
     * Admin bypasses all checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }
        return null;
    }

    /**
     * View any proposal (Sekretariat, Reviewer, Ketua).
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Sekretariat', 'Reviewer', 'Ketua Komisi Etik']);
    }

    /**
     * View a specific proposal.
     */
    public function view(User $user, Protokol $protokol): bool
    {
        if ($user->id === $protokol->user_id) return true;
        if ($user->id === $protokol->sekretariat_id) return true;
        if ($user->id === $protokol->reviewer_id) return true;

        if ($user->hasRole('Reviewer') && $protokol->reviews()->where('reviewer_id', $user->id)->exists()) {
            return true;
        }

        if ($user->hasRole('Ketua Komisi Etik')) return true;

        return false;
    }

    /**
     * Create proposals (Applicant only).
     */
    public function create(User $user): bool
    {
        return $user->hasRole('Applicant');
    }

    /**
     * Update a proposal.
     */
    public function update(User $user, Protokol $protokol): bool
    {
        if ($user->id === $protokol->user_id) {
            return in_array($protokol->status, ['Pending', 'Pending Admin', 'Revisi', 'AWR', 'Direvisi']);
        }
        if ($user->hasRole('Sekretariat') && $user->id === $protokol->sekretariat_id) {
            return true;
        }
        return false;
    }

    /**
     * Delete a proposal (only owner while pending).
     */
    public function delete(User $user, Protokol $protokol): bool
    {
        return $user->id === $protokol->user_id
            && in_array($protokol->status, ['Pending', 'Pending Admin']);
    }

    /**
     * Classify review type (Sekretariat only).
     */
    public function classify(User $user, Protokol $protokol): bool
    {
        return $user->hasRole('Sekretariat') && $user->id === $protokol->sekretariat_id;
    }

    /**
     * Assign reviewers (Sekretariat only).
     */
    public function assignReviewers(User $user, Protokol $protokol): bool
    {
        return $user->hasRole('Sekretariat') && $user->id === $protokol->sekretariat_id;
    }

    /**
     * Make decision (Sekretariat or Ketua).
     */
    public function decide(User $user, Protokol $protokol): bool
    {
        if ($user->hasRole('Sekretariat') && $user->id === $protokol->sekretariat_id) return true;
        if ($user->hasRole('Ketua Komisi Etik') && $protokol->review_type === 'Full Board') return true;
        return false;
    }
}
