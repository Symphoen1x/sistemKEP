<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Termination extends Model
{
    protected $fillable = [
        'protokol_id',
        'user_id',
        'effective_date',
        'reason_category',
        'description',
        'participant_status',
        'safety_measures',
        'is_safety_related',
        'status',
        'decided_by',
        'decided_at',
        'notes',
    ];

    protected $casts = [
        'is_safety_related' => 'boolean',
        'effective_date'    => 'date',
        'decided_at'        => 'datetime',
    ];

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
}
