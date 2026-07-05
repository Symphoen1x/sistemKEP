<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AmendmentDocument extends Model
{
    protected $fillable = [
        'amendment_id',
        'document_type',
        'file_path',
    ];

    public function amendment()
    {
        return $this->belongsTo(Amendment::class);
    }
}
