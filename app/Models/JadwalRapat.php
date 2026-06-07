<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalRapat extends Model
{
    use HasFactory;

    protected $fillable = [
        'agenda',
        'tanggal',
        'waktu',
        'tempat',
        'status',
    ];
}
