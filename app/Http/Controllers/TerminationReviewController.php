<?php

namespace App\Http\Controllers;

use App\Models\Termination;
use App\Models\Message;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TerminationReviewController extends Controller
{
    /**
     * List all terminations for Sekretariat review.
     */
    public function index()
    {
        $terminations = Termination::with(['protokol:id,judul,nomor_pengajuan,peneliti', 'user:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Sekretariat/ReviewTermination', [
            'terminations' => $terminations,
        ]);
    }

    /**
     * Classify a termination (Safety / Non-Safety / Administrative).
     */
    public function classify(Request $request, $id)
    {
        $request->validate([
            'reason_category' => 'required|in:Safety,Non-Safety,Administrative',
        ]);

        $termination = Termination::findOrFail($id);
        $isSafety = $request->reason_category === 'Safety';

        $termination->update([
            'reason_category'   => $request->reason_category,
            'is_safety_related' => $isSafety,
            'status'            => $isSafety ? 'Eskalasi' : $termination->status,
        ]);

        AuditLog::record('termination_classified', $termination, null, [
            'reason_category' => $request->reason_category,
        ]);

        return back()->with('status', 'Terminasi berhasil diklasifikasikan.');
    }

    /**
     * Finalize a termination (Approve/Reject).
     */
    public function finalize(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $termination = Termination::with('protokol')->findOrFail($id);

        $termination->update([
            'status'     => $request->status,
            'decided_by' => Auth::id(),
            'decided_at' => Carbon::now(),
            'notes'      => $request->notes,
        ]);

        AuditLog::record('termination_finalized', $termination, null, [
            'status' => $request->status,
            'notes'  => $request->notes,
        ]);

        // Notify Applicant
        $subject = $request->status === 'Approved'
            ? "Terminasi Disetujui: {$termination->protokol->nomor_pengajuan}"
            : "Terminasi Ditolak: {$termination->protokol->nomor_pengajuan}";
        $body = $request->status === 'Approved'
            ? "Pengajuan terminasi Anda untuk proposal \"{$termination->protokol->judul}\" telah disetujui. " . ($request->notes ?? '')
            : "Pengajuan terminasi Anda untuk proposal \"{$termination->protokol->judul}\" ditolak. " . ($request->notes ?? '');

        Message::create([
            'user_id'     => $termination->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject'     => $subject,
            'body'        => $body,
        ]);

        return back()->with('status', 'Terminasi berhasil diproses.');
    }
}
