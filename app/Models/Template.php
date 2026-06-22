<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'version',
        'file_path',
        'original_filename',
        'is_active',
        'published_at',
        'uploaded_by',
    ];

    protected $casts = [
        'is_active'    => 'boolean',
        'published_at' => 'date',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
