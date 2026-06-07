<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Decision;
use App\Models\JadwalRapat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class KetuaKomisiEtikController extends Controller
{
    public function dashboard()
    {
        $proposals = Protokol::all();
        $schedules = JadwalRapat::orderBy('tanggal', 'asc')->limit(5)->get();

        // Calculate statistics for Ketua dashboard
        $stats = [
            'total' => $proposals->count(),
            'pending' => $proposals->where('status', 'Pending')->count(),
            'direview' => $proposals->where('status', 'Direview')->count(),
            'revisi' => $proposals->where('status', 'Revisi')->count(),
            'disetujui' => $proposals->where('status', 'Disetujui')->count(),
            'ditolak' => $proposals->where('status', 'Ditolak')->count(),
        ];

        // Get recent proposals with reviewer info
        $recentProposals = $proposals->sortByDesc('updated_at')->take(5)->map(function ($p) {
            return [
                'id' => $p->id,
                'nomor_pengajuan' => $p->nomor_pengajuan,
                'judul' => $p->judul,
                'peneliti' => $p->peneliti,
                'institusi' => $p->institusi,
                'status' => $p->status,
                'reviewer' => $p->reviewer ? $p->reviewer->name : 'Belum ditugaskan',
                'updated_at' => $p->updated_at->diffForHumans(),
            ];
        })->values();

        // Prepare activity feed based on recent proposals
        $activities = [];
        foreach ($proposals->sortByDesc('updated_at')->take(5) as $p) {
            $time = $p->updated_at->diffForHumans();
            if ($p->status === 'Pending') {
                $activities[] = [
                    'text' => "Proposal baru masuk: \"{$p->judul}\" dari {$p->peneliti}",
                    'time' => $time,
                    'type' => 'info'
                ];
            } elseif ($p->status === 'Direview') {
                $reviewerName = $p->reviewer ? $p->reviewer->name : 'Reviewer';
                $activities[] = [
                    'text' => "Proposal KEP \"{$p->nomor_pengajuan}\" ditugaskan ke {$reviewerName}",
                    'time' => $time,
                    'type' => 'purple'
                ];
            } elseif ($p->status === 'Revisi') {
                $activities[] = [
                    'text' => "Proposal \"{$p->nomor_pengajuan}\" memerlukan revisi dari peneliti",
                    'time' => $time,
                    'type' => 'warning'
                ];
            } elseif ($p->status === 'Disetujui') {
                $activities[] = [
                    'text' => "Proposal \"{$p->nomor_pengajuan}\" telah disetujui",
                    'time' => $time,
                    'type' => 'success'
                ];
            } elseif ($p->status === 'Ditolak') {
                $activities[] = [
                    'text' => "Proposal \"{$p->nomor_pengajuan}\" telah ditolak",
                    'time' => $time,
                    'type' => 'danger'
                ];
            }
        }

        return Inertia::render('KetuaKomisiEtik/Dashboard', [
            'stats' => $stats,
            'recentProposals' => $recentProposals,
            'activities' => $activities,
            'schedules' => $schedules,
        ]);
    }

    public function profil()
    {
        $user = Auth::user();
        return Inertia::render('KetuaKomisiEtik/Profil', [
            'user' => $user,
        ]);
    }

    public function updateProfil(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'institution' => 'nullable|string|max:255',
        ]);

        $user->update($request->only('name', 'phone_number', 'address', 'institution'));

        return redirect()->route('ketua.profil')->with('success', 'Profil berhasil diperbarui');
    }

    // Decision methods for EPIC 7
    public function getProposalsForDecision()
    {
        $proposals = Protokol::where('review_status', 'Completed')
            ->whereDoesntHave('decision')
            ->with('reviews')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('KetuaKomisiEtik/PengambilanKeputusan', [
            'proposals' => $proposals,
        ]);
    }

    public function showDecisionForm($id)
    {
        $proposal = Protokol::with('reviews')->findOrFail($id);
        $reviews = $proposal->reviews;

        return Inertia::render('KetuaKomisiEtik/FormKeputusan', [
            'proposal' => $proposal,
            'reviews' => $reviews,
        ]);
    }

    public function makeDecision(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'notes' => 'nullable|string',
        ]);

        $proposal = Protokol::findOrFail($id);
        $user = Auth::user();

        $certificate_number = null;
        if ($request->status === 'Approved') {
            $certificate_number = 'SERTIF-' . Carbon::now()->year . '-' . str_pad(
                Decision::where('status', 'Approved')->count() + 1,
                4,
                '0',
                STR_PAD_LEFT
            );
        }

        Decision::create([
            'protokol_id' => $proposal->id,
            'decided_by' => $user->id,
            'status' => $request->status === 'Approved' ? 'Approved' : 'Rejected',
            'notes' => $request->notes,
            'certificate_number' => $certificate_number,
            'decided_at' => Carbon::now(),
        ]);

        $proposal->update(['status' => $request->status === 'Approved' ? 'Disetujui' : 'Ditolak']);

        Message::create([
            'user_id' => $proposal->user_id,
            'sender_name' => 'Komisi Etik',
            'subject' => $request->status === 'Approved' 
                ? "Proposal Disetujui: {$proposal->nomor_pengajuan}"
                : "Proposal Ditolak: {$proposal->nomor_pengajuan}",
            'body' => $request->status === 'Approved'
                ? "Proposal Anda telah disetujui dengan nomor sertifikat: {$certificate_number}"
                : "Proposal Anda telah ditolak. Catatan: " . ($request->notes ?? 'Tidak ada catatan'),
        ]);

        return back()->with('status', 'Keputusan berhasil disimpan.');
    }
}
