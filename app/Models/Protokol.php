<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Protokol extends Model
{
    use HasFactory;

    // Tentukan kolom mana saja yang boleh diisi secara otomatis
    protected $fillable = [
        'judul',
        'peneliti',
        'status',
    ];
}
