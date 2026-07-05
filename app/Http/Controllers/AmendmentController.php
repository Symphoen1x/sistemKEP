<?php

namespace App\Http\Controllers;

use App\Models\Amendment;
use App\Models\AmendmentDocument;
use App\Models\Protokol;
use App\Models\Message;
use App\Models\User;
use App\Models\AuditLog;
use App\Services\FileStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AmendmentController extends Controller
{
    /**
     * Show amendment submission form for Applicant.
     */
    public function create($id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->where('status', 'Disetujui')
            ->findOrFail($id);

        return Inertia::render('Applicant/PengajuanAmendment', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * Store a new amendment request.
     */
    public function store(Request $request, $id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->where('status', 'Disetujui')
            ->findOrFail($id);

        $request->validate([
            'type'        => 'required|in:Minor,Major',
            'description' => 'required|string|max:2000',
            'reason'      => 'required|string|max:2000',
            'documents'   => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,doc,docx|max:10240',
        ]);

        $amendment = Amendment::create([
            'protokol_id'  => $proposal->id,
            'user_id'      => $user->id,
            'type'         => $request->type,
            'description'  => $request->description,
            'reason'       => $request->reason,
            'status'       => 'Pending',
        ]);

        // Store uploaded documents with organized path & version tracking
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $docType => $file) {
                $path = FileStorageService::store($proposal, 'amendment_' . (is_string($docType) ? $docType : 'document'), $file, 'amendment');
                AmendmentDocument::create([
                    'amendment_id'  => $amendment->id,
                    'document_type' => is_string($docType) ? $docType : 'document',
                    'file_path'     => $path,
                ]);
            }
        }

        AuditLog::record('amendment_submitted', $amendment);

        // Notify Sekretariat
        $sekretariats = User::role('Sekretariat')->get();
        foreach ($sekretariats as $sekre) {
            Message::create([
                'user_id'     => $sekre->id,
                'sender_name' => 'Sistem KEP',
                'subject'     => "Amendment Diajukan: {$proposal->nomor_pengajuan}",
                'body'        => "Peneliti {$proposal->peneliti} mengajukan amendment ({$request->type}) untuk proposal \"{$proposal->judul}\".",
            ]);
        }

        return redirect()->route('applicant.trackStatus')
            ->with('status', 'Pengajuan Amendment berhasil dikirim.');
    }

    /**
     * List amendments for Applicant's own proposals.
     */
    public function myAmendments()
    {
        $user = Auth::user();
        $amendments = Amendment::where('user_id', $user->id)
            ->with('protokol:id,judul,nomor_pengajuan')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Applicant/RiwayatAmendment', [
            'amendments' => $amendments,
        ]);
    }
}
