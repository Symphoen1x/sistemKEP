<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVersion extends Model
{
    protected $fillable = [
        'protokol_id',
        'document_type',
        'version',
        'file_path',
        'original_filename',
        'mime_type',
        'file_size',
        'uploaded_by',
        'upload_context',
    ];

    public function protokol()
    {
        return $this->belongsTo(Protokol::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Human-readable file size.
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size ?? 0;
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }
        return $bytes . ' B';
    }

    /**
     * Get the storage path relative to the public disk.
     */
    public function getStoragePathAttribute(): string
    {
        return str_replace('/storage/', 'public/', $this->file_path);
    }
}
