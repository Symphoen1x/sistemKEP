<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'protokol_id',
        'reviewer_id',
        'feedback',
        'recommendation',
        'status',
        'assigned_at',
        'submitted_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function protokol()
    {
        return $this->belongsTo(Protokol::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

