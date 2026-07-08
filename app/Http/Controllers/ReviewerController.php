<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Review;
use App\Models\Amendment;
use App\Models\JadwalRapat;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class ReviewerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        $myReviews = Review::where('reviewer_id', $user->id)->get();
        $assignedProposals = $myReviews->where('status', 'Assigned')->count();
        $completedReviews = $myReviews->where('status', 'Completed')->count();
        
        $stats = [
            'waiting' => $assignedProposals,
            'reviewed' => $completedReviews,
            'deadline' => Carbon::now()->addDays(7)->translatedFormat('d F Y'),
            'new_tasks' => $assignedProposals,
        ];

        $recentReviews = Review::where('reviewer_id', $user->id)
            ->where('status', 'Assigned')
            ->with('protokol')
            ->take(5)
            ->get();

        $recentProposals = $recentReviews->map(function ($review) {
            $protokol = $review->protokol;
            return [
                'id' => $protokol->id,
                'review_id' => $review->id,
                'nomor_pengajuan' => $protokol->nomor_pengajuan,
                'judul' => $protokol->judul,
                'peneliti' => $protokol->peneliti,
                'institusi' => $protokol->institusi,
                'subjek_penelitian' => $protokol->subjek_penelitian,
            ];
        });

        return Inertia::render('Reviewer/Dashboard', [
            'stats' => $stats,
            'recentProposals' => $recentProposals,
        ]);
    }

    public function getAssignedProposals()
    {
        $user = Auth::user();
        $reviews = Review::where('reviewer_id', $user->id)
            ->where('status', 'Assigned')
            ->with('protokol')
            ->orderBy('assigned_at', 'desc')
            ->get();

        $proposals = $reviews->map(function ($review) {
            $protokol = $review->protokol;
            return [
                'id'                => $protokol->id,
                'review_id'         => $review->id,
                'nomor_pengajuan'   => $protokol->nomor_pengajuan,
                'judul'             => $protokol->judul,
                'peneliti'          => $protokol->peneliti,
                'institusi'         => $protokol->institusi,
                'subjek_penelitian' => $protokol->subjek_penelitian,
                'due_date'          => $protokol->due_date,
                'review_type'       => $protokol->review_type,
                'assigned_at'       => $review->assigned_at?->toIso8601String(),
                'is_overdue'        => $protokol->due_date && Carbon::parse($protokol->due_date)->isPast(),
            ];
        });

        return Inertia::render('Reviewer/DaftarProposal', [
            'proposals' => $proposals,
        ]);
    }

    public function proposals()
    {
        return $this->getAssignedProposals();
    }

    public function viewProposal($id)
    {
        $protocol = Protokol::findOrFail($id);
        return response()->json($protocol);
    }

    /**
     * Download a document from a proposal (Berkas Usulan).
     */
    public function downloadDocument($id, $type)
    {
        $protokol = Protokol::findOrFail($id);

        // Verify the reviewer is assigned to this protocol
        Review::where('protokol_id', $id)
            ->where('reviewer_id', Auth::id())
            ->firstOrFail();

        $fieldMap = [
            'proposal'  => 'proposal_path',
            'consent'   => 'informed_consent_path',
            'izin'      => 'surat_izin_path',
            'formulir'  => 'formulir_pengajuan_path',
            'ringkasan' => 'ringkasan_protokol_path',
            'instrumen' => 'instrumen_path',
            'sertifikat'=> 'sertifikat_path',
        ];

        if (!isset($fieldMap[$type])) {
            abort(404, 'Tipe dokumen tidak valid.');
        }

        $filePath = $protokol->{$fieldMap[$type]};

        if (!$filePath) {
            abort(404, 'Dokumen tidak ditemukan.');
        }

        $relativePath = str_replace('/storage/', '', $filePath);

        if (!Storage::disk('public')->exists($relativePath)) {
            abort(404, 'File tidak ditemukan di penyimpanan.');
        }

        $extension = pathinfo($relativePath, PATHINFO_EXTENSION);
        $filename = $type . '_' . ($protokol->nomor_pengajuan ?? 'protokol') . '.' . $extension;

        return Storage::disk('public')->download($relativePath, $filename);
    }

    /**
     * Download a specific document version.
     */
    public function downloadVersion($versionId)
    {
        $version = DocumentVersion::findOrFail($versionId);

        // Verify the reviewer is assigned to this protocol
        Review::where('protokol_id', $version->protokol_id)
            ->where('reviewer_id', Auth::id())
            ->firstOrFail();

        $filePath = $version->file_path;
        $relativePath = str_replace('/storage/', '', $filePath);

        if (!Storage::disk('public')->exists($relativePath)) {
            abort(404, 'File tidak ditemukan di penyimpanan.');
        }

        $filename = $version->original_filename ?? 'document';

        return Storage::disk('public')->download($relativePath, $filename);
    }

    public function showReviewForm($id)
    {
        $review = Review::findOrFail($id);
        $user = Auth::user();

        if ($review->reviewer_id !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('Reviewer/FormReview', [
            'review' => $review,
            'proposal' => $review->protokol,
        ]);
    }

    public function review($id)
    {
        $review = Review::where('protokol_id', $id)
            ->where('reviewer_id', Auth::id())
            ->firstOrFail();

        $protokol = $review->protokol;

        // PB27 — Load document versions for version comparison
        $documentVersions = \App\Models\DocumentVersion::where('protokol_id', $protokol->id)
            ->orderBy('document_type')
            ->orderBy('version', 'desc')
            ->get()
            ->groupBy('document_type')
            ->map(function ($versions) {
                return $versions->map(function ($v) {
                    return [
                        'id'                => $v->id,
                        'document_type'     => $v->document_type,
                        'version'           => $v->version,
                        'file_path'         => $v->file_path,
                        'original_filename' => $v->original_filename,
                        'mime_type'         => $v->mime_type,
                        'file_size'         => $v->formatted_size,
                        'upload_context'     => $v->upload_context,
                        'created_at'        => $v->created_at->toIso8601String(),
                    ];
                });
            });

        // Check if this is a resubmission (has previous versions)
        $hasMultipleVersions = $documentVersions->some(function ($versions) {
            return $versions->count() > 1;
        });

        return Inertia::render('Reviewer/ReviewProposal', [
            'proposal'          => $protokol,
            'review'            => $review,
            'documentVersions'  => $documentVersions,
            'hasMultipleVersions' => $hasMultipleVersions,
        ]);
    }

    public function submitReview(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $user = Auth::user();
        
        if ($review->reviewer_id !== $user->id) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'feedback' => 'required|string|min:10',
            'recommendation' => 'required|in:Approved,Conditionally Approved,Rejected',
        ]);

        $review->update([
            'feedback' => $request->feedback,
            'recommendation' => $request->recommendation,
            'status' => 'Completed',
            'submitted_at' => Carbon::now(),
        ]);

        // Check if all reviews for this proposal are completed
        $proposal = $review->protokol;
        $allReviewsCompleted = $proposal->reviews()->where('status', '!=', 'Completed')->count() === 0;
        
        if ($allReviewsCompleted) {
            $proposal->update(['review_status' => 'Completed']);
            
            if ($request->recommendation === 'Approved') {
                $proposal->update(['status' => 'Pending Surat']);
            } elseif ($request->recommendation === 'Conditionally Approved') {
                $proposal->update([
                    'status' => 'Revisi',
                    'catatan_revisi' => $request->feedback,
                ]);
            } else {
                $proposal->update(['status' => 'Ditolak']);
            }
        }

        return redirect()->route('reviewer.history')->with('status', 'Review berhasil disimpan.');
    }

    public function storeReview(Request $request, $id)
    {
        $protocol = Protokol::findOrFail($id);
        
        if ($protocol->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'decision' => 'required|string|in:Disetujui,Revisi,Ditolak',
            'notes' => 'required|string|min:5',
        ]);

        $protocol->status = $request->decision;
        if ($request->decision === 'Revisi') {
            $protocol->catatan_revisi = $request->notes;
        } else {
            $protocol->catatan_revisi = null;
        }
        $protocol->save();

        return redirect()->route('reviewer.proposals')->with('status', 'Hasil penelaahan kelayakan etik berhasil disimpan.');
    }

    public function getHistory()
    {
        $user = Auth::user();
        $reviews = Review::where('reviewer_id', $user->id)
            ->where('status', 'Completed')
            ->with('protokol')
            ->orderBy('submitted_at', 'desc')
            ->get();

        $proposals = $reviews->map(function ($review) {
            $protokol = $review->protokol;
            return [
                'id' => $protokol->id,
                'review_id' => $review->id,
                'nomor_pengajuan' => $protokol->nomor_pengajuan,
                'judul' => $protokol->judul,
                'peneliti' => $protokol->peneliti,
                'status' => $protokol->status,
                'updated_at' => $review->submitted_at ? $review->submitted_at->toIso8601String() : $review->updated_at->toIso8601String(),
            ];
        });

        return Inertia::render('Reviewer/RiwayatReview', [
            'proposals' => $proposals,
        ]);
    }

    public function history()
    {
        return $this->getHistory();
    }

    public function schedules()
    {
        $schedules = JadwalRapat::where('tanggal', '>=', Carbon::now()->toDateString())
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->get();

        return Inertia::render('Reviewer/JadwalReview', [
            'schedules' => $schedules,
        ]);
    }

    public function profile()
    {
        return Inertia::render('Reviewer/Profil');
    }

    /**
     * PB39 — List Major Amendments assigned to this Reviewer.
     */
    public function amendmentReviews()
    {
        $user = Auth::user();
        $amendments = Amendment::where('reviewer_id', $user->id)
            ->with(['protokol:id,judul,nomor_pengajuan,peneliti', 'documents'])
            ->orderBy('review_assigned_at', 'desc')
            ->get();

        return Inertia::render('Reviewer/DaftarAmendment', [
            'amendments' => $amendments,
        ]);
    }

    /**
     * PB39 — Show a specific Major Amendment for review.
     */
    public function showAmendmentReview($id)
    {
        $user = Auth::user();
        $amendment = Amendment::where('reviewer_id', $user->id)
            ->with(['protokol', 'documents', 'user:id,name'])
            ->findOrFail($id);

        return Inertia::render('Reviewer/ReviewAmendmentMajor', [
            'amendment' => $amendment,
            'proposal'  => $amendment->protokol,
        ]);
    }

    /**
     * PB39 — Submit review for a Major Amendment.
     */
    public function submitAmendmentReview(Request $request, $id)
    {
        $user = Auth::user();
        $amendment = Amendment::where('reviewer_id', $user->id)
            ->where('review_status', 'Assigned')
            ->findOrFail($id);

        $request->validate([
            'feedback'       => 'required|string|min:10',
            'recommendation' => 'required|in:Approved,Conditionally Approved,Rejected',
        ]);

        $amendment->update([
            'review_feedback'        => $request->feedback,
            'reviewer_recommendation' => $request->recommendation,
            'review_status'          => 'Completed',
            'review_submitted_at'    => Carbon::now(),
        ]);

        AuditLog::record('amendment_review_submitted', $amendment, null, [
            'recommendation' => $request->recommendation,
        ]);

        return redirect()->route('reviewer.amendmentReviews')
            ->with('status', 'Review Major Amendment berhasil dikirim.');
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'institution' => 'nullable|string',
            'role_type' => 'nullable|string',
            'nidn_nim' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name', 'phone_number', 'address', 'institution', 'role_type', 'nidn_nim'
        ]));

        return back()->with('status', 'Profil berhasil diperbarui.');
    }
}
