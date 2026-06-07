<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Review;
use App\Models\JadwalRapat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Reviewer/Dashboard', [
            'stats' => $stats,
            'recentProposals' => $recentReviews,
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

        return Inertia::render('Reviewer/DaftarProposal', [
            'reviews' => $reviews,
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
        
        return Inertia::render('Reviewer/ReviewProposal', [
            'proposal' => $review->protokol,
            'review' => $review,
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

        return Inertia::render('Reviewer/RiwayatReview', [
            'reviews' => $reviews,
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
