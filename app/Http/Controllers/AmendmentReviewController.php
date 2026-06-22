<?php

namespace App\Http\Controllers;

use App\Models\Amendment;
use App\Models\Message;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AmendmentReviewController extends Controller
{
    /**
     * List all pending amendments for Sekretariat review.
     */
    public function index()
    {
        $amendments = Amendment::with(['protokol:id,judul,nomor_pengajuan,peneliti', 'user:id,name', 'documents', 'reviewer:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Load available reviewers for assignment UI
        $reviewers = User::role('Reviewer')->where('status', 'active')->get(['id', 'name', 'expertise']);

        return Inertia::render('Sekretariat/ReviewAmendment', [
            'amendments' => $amendments,
            'reviewers'  => $reviewers,
        ]);
    }

    /**
     * Classify an amendment as Minor or Major (Sekretariat).
     */
    public function classify(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|in:Minor,Major',
        ]);

        $amendment = Amendment::findOrFail($id);
        $amendment->update(['type' => $request->type]);

        AuditLog::record('amendment_classified', $amendment, null, ['type' => $request->type]);

        return back()->with('status', 'Amendment berhasil diklasifikasikan.');
    }

    /**
     * PB39 — Assign a Reviewer to a Major Amendment.
     */
    public function assignReviewer(Request $request, $id)
    {
        $request->validate([
            'reviewer_id' => 'required|exists:users,id',
        ]);

        $amendment = Amendment::with('protokol:id,judul,nomor_pengajuan')->findOrFail($id);

        if ($amendment->type !== 'Major') {
            return back()->with('error', 'Hanya Major Amendment yang perlu review oleh Reviewer.');
        }

        $amendment->update([
            'reviewer_id'        => $request->reviewer_id,
            'review_status'      => 'Assigned',
            'review_assigned_at' => Carbon::now(),
        ]);

        AuditLog::record('amendment_reviewer_assigned', $amendment, null, [
            'reviewer_id' => $request->reviewer_id,
        ]);

        // Internal notification to Reviewer
        $reviewer = User::find($request->reviewer_id);
        Message::create([
            'user_id'     => $reviewer->id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject'     => "Penugasan Review Amendment: {$amendment->protokol->nomor_pengajuan}",
            'body'        => "Anda ditugaskan untuk mereview Major Amendment proposal \"{$amendment->protokol->judul}\". Silakan review perubahan yang diajukan.",
        ]);

        return back()->with('status', 'Reviewer berhasil ditugaskan untuk Major Amendment.');
    }

    /**
     * Decide on an amendment (Approve/Reject).
     */
    public function decide(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'notes'  => 'nullable|string|max:1000',
        ]);

        $amendment = Amendment::with('protokol')->findOrFail($id);

        $amendment->update([
            'status'     => $request->status,
            'decided_by' => Auth::id(),
            'decided_at' => Carbon::now(),
            'notes'      => $request->notes,
        ]);

        AuditLog::record('amendment_decided', $amendment, null, [
            'status' => $request->status,
            'notes'  => $request->notes,
        ]);

        // Notify Applicant
        $subjectMap = [
            'Approved' => "Amendment Disetujui: {$amendment->protokol->nomor_pengajuan}",
            'Rejected' => "Amendment Ditolak: {$amendment->protokol->nomor_pengajuan}",
        ];
        $bodyMap = [
            'Approved' => "Amendment Anda untuk proposal \"{$amendment->protokol->judul}\" telah disetujui. " . ($request->notes ?? ''),
            'Rejected' => "Amendment Anda untuk proposal \"{$amendment->protokol->judul}\" ditolak. " . ($request->notes ?? ''),
        ];

        Message::create([
            'user_id'     => $amendment->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject'     => $subjectMap[$request->status],
            'body'        => $bodyMap[$request->status],
        ]);

        return back()->with('status', 'Keputusan amendment berhasil disimpan.');
    }
}
