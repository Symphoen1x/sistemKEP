<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amendment extends Model
{
    protected $fillable = [
        'protokol_id',
        'user_id',
        'type',
        'description',
        'reason',
        'changed_sections',
        'status',
        'reviewer_id',
        'review_status',
        'review_feedback',
        'reviewer_recommendation',
        'review_assigned_at',
        'review_submitted_at',
        'decided_by',
        'decided_at',
        'notes',
    ];

    protected $casts = [
        'changed_sections' => 'array',
        'decided_at'       => 'datetime',
        'review_assigned_at'  => 'datetime',
        'review_submitted_at' => 'datetime',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function protokol()
    {
        return $this->belongsTo(Protokol::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function decidedBy()
    {
        return $this->belongsTo(User::class, 'decided_by');
    }

    public function documents()
    {
        return $this->hasMany(AmendmentDocument::class);
    }
}
