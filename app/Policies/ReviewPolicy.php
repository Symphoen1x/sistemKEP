<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
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
     * View any reviews (Sekretariat, Ketua).
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Sekretariat', 'Ketua Komisi Etik']);
    }

    /**
     * View a specific review.
     */
    public function view(User $user, Review $review): bool
    {
        if ($user->id === $review->reviewer_id) return true;
        if ($user->hasRole('Sekretariat') && $review->protokol->sekretariat_id === $user->id) return true;
        if ($user->hasRole('Ketua Komisi Etik')) return true;
        return false;
    }

    /**
     * Submit a review (only assigned reviewer).
     */
    public function submit(User $user, Review $review): bool
    {
        return $user->id === $review->reviewer_id && $review->status === 'Assigned';
    }

    /**
     * Create reviews (Sekretariat assigns reviewers).
     */
    public function create(User $user): bool
    {
        return $user->hasRole('Sekretariat');
    }
}
