<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Protokol extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewer_id',
        'sekretariat_id',
        'judul',
        'peneliti',
        'nidn_nim',
        'email',
        'no_hp',
        'institusi',
        'role_peneliti',
        'lokasi_penelitian',
        'anggota_tim',
        'subjek_penelitian',
        'metode_penelitian',
        'risiko_penelitian',
        'deskripsi_penelitian',
        'proposal_path',
        'informed_consent_path',
        'surat_izin_path',
        'instrumen_path',
        'sertifikat_path',
        'sk_path',
        'nomor_pengajuan',
        'nomor_surat',
        'status',
        'catatan_revisi',
        'review_type',
        'review_status',
        'assigned_at',
        'due_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function sekretariat()
    {
        return $this->belongsTo(User::class, 'sekretariat_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function decision()
    {
        return $this->hasOne(Decision::class);
    }

    public function documentVersions()
    {
        return $this->hasMany(DocumentVersion::class);
    }
}
