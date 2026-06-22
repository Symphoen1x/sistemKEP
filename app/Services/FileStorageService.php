<?php

namespace App\Services;

use App\Models\DocumentVersion;
use App\Models\Protokol;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    /**
     * Store a file with organized path and version tracking.
     * 
     * Structure: documents/{nomor_pengajuan}/{document_type}/v{version}_{timestamp}.{ext}
     *
     * @param Protokol $protokol
     * @param string $documentType  (proposal, informed_consent, surat_izin, instrumen, sk, sertifikat, amendment)
     * @param UploadedFile $file
     * @param string $context       (initial, revisi, amendment, sertifikat, sk)
     * @return string  The public-facing path (e.g., /storage/documents/KEP-2026-0001/proposal/v1_20260615.pdf)
     */
    public static function store(Protokol $protokol, string $documentType, UploadedFile $file, string $context = 'initial'): string
    {
        $nomorPengajuan = $protokol->nomor_pengajuan ?? 'UNKNOWN';
        
        // Determine next version number
        $lastVersion = DocumentVersion::where('protokol_id', $protokol->id)
            ->where('document_type', $documentType)
            ->max('version') ?? 0;
        $nextVersion = $lastVersion + 1;

        // Build organized path
        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $filename = "v{$nextVersion}_" . Carbon::now()->format('Ymd_His') . ".{$extension}";
        $relativePath = "documents/{$nomorPengajuan}/{$documentType}/{$filename}";

        // Store file on public disk
        $storedPath = $file->storeAs("documents/{$nomorPengajuan}/{$documentType}", $filename, 'public');

        // Record version in database
        DocumentVersion::create([
            'protokol_id'       => $protokol->id,
            'document_type'     => $documentType,
            'version'           => $nextVersion,
            'file_path'         => '/storage/' . $storedPath,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type'         => $file->getMimeType(),
            'file_size'         => $file->getSize(),
            'uploaded_by'       => Auth::id(),
            'upload_context'    => $context,
        ]);

        return '/storage/' . $storedPath;
    }

    /**
     * Store raw content (e.g., generated PDF) with organized path and version tracking.
     *
     * @param Protokol $protokol
     * @param string $documentType
     * @param string $content  Raw PDF/string content
     * @param string $context
     * @param string $extension
     * @return string  The public-facing path
     */
    public static function storeContent(Protokol $protokol, string $documentType, string $content, string $context = 'generated', string $extension = 'pdf'): string
    {
        $nomorPengajuan = $protokol->nomor_pengajuan ?? 'UNKNOWN';

        $lastVersion = DocumentVersion::where('protokol_id', $protokol->id)
            ->where('document_type', $documentType)
            ->max('version') ?? 0;
        $nextVersion = $lastVersion + 1;

        $filename = "v{$nextVersion}_" . Carbon::now()->format('Ymd_His') . ".{$extension}";
        $relativePath = "documents/{$nomorPengajuan}/{$documentType}/{$filename}";

        Storage::put("public/{$relativePath}", $content);

        DocumentVersion::create([
            'protokol_id'       => $protokol->id,
            'document_type'     => $documentType,
            'version'           => $nextVersion,
            'file_path'         => '/storage/' . $relativePath,
            'original_filename' => "{$documentType}_{$nomorPengajuan}_v{$nextVersion}.{$extension}",
            'mime_type'         => $extension === 'pdf' ? 'application/pdf' : 'application/octet-stream',
            'file_size'         => strlen($content),
            'uploaded_by'       => Auth::id(),
            'upload_context'    => $context,
        ]);

        return '/storage/' . $relativePath;
    }

    /**
     * Get all versions for a specific document type of a proposal.
     */
    public static function getVersions(int $protokolId, string $documentType)
    {
        return DocumentVersion::where('protokol_id', $protokolId)
            ->where('document_type', $documentType)
            ->orderBy('version', 'desc')
            ->get();
    }

    /**
     * Get the latest version for a specific document type.
     */
    public static function getLatestVersion(int $protokolId, string $documentType): ?DocumentVersion
    {
        return DocumentVersion::where('protokol_id', $protokolId)
            ->where('document_type', $documentType)
            ->orderBy('version', 'desc')
            ->first();
    }

    /**
     * Get all document versions for a proposal (all types).
     */
    public static function getAllVersions(int $protokolId)
    {
        return DocumentVersion::where('protokol_id', $protokolId)
            ->orderBy('document_type')
            ->orderBy('version', 'desc')
            ->get()
            ->groupBy('document_type');
    }
}
