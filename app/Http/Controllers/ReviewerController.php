<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
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
        
        $myProposals = Protokol::where('reviewer_id', $user->id)->get();
        
        $stats = [
            'waiting' => $myProposals->where('status', 'Direview')->count(),
            'reviewed' => $myProposals->whereIn('status', ['Disetujui', 'Ditolak', 'Revisi'])->count(),
            'deadline' => Carbon::now()->addDays(7)->translatedFormat('d F Y'),
            'new_tasks' => $myProposals->where('status', 'Direview')->count(),
        ];

        return Inertia::render('Reviewer/Dashboard', [
            'stats' => $stats,
            'recentProposals' => $myProposals->where('status', 'Direview')->take(5)->values(),
        ]);
    }

    public function proposals()
    {
        $user = Auth::user();
        $proposals = Protokol::where('reviewer_id', $user->id)
            ->where('status', 'Direview')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Reviewer/DaftarProposal', [
            'proposals' => $proposals,
        ]);
    }

    public function review($id)
    {
        $proposal = Protokol::findOrFail($id);
        
        // Ensure reviewer owns this assignment
        if ($proposal->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render('Reviewer/ReviewProposal', [
            'proposal' => $proposal,
        ]);
    }

    public function storeReview(Request $request, $id)
    {
        $proposal = Protokol::findOrFail($id);
        
        if ($proposal->reviewer_id !== Auth::id()) {
            abort(403, 'Unauthorized access.');
        }

        $request->validate([
            'decision' => 'required|string|in:Disetujui,Revisi,Ditolak',
            'notes' => 'required|string|min:5',
        ]);

        $proposal->status = $request->decision;
        if ($request->decision === 'Revisi') {
            $proposal->catatan_revisi = $request->notes;
        } else {
            $proposal->catatan_revisi = null;
        }
        $proposal->save();

        return redirect()->route('reviewer.proposals')->with('status', 'Hasil penelaahan kelayakan etik berhasil disimpan.');
    }

    public function history()
    {
        $user = Auth::user();
        $proposals = Protokol::where('reviewer_id', $user->id)
            ->whereIn('status', ['Disetujui', 'Ditolak', 'Revisi'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Reviewer/RiwayatReview', [
            'proposals' => $proposals,
        ]);
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
