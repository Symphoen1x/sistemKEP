<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Decision;
use App\Models\JadwalRapat;
use App\Models\Message;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Termination;
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

    // Task 1.5 — Daftar Surat Menunggu Tanda Tangan (PB34)
    public function getDaftarSuratTTD()
    {
        $proposals = Protokol::where('status', 'Pending Ketua')
            ->whereNotNull('nomor_surat')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('KetuaKomisiEtik/DaftarSuratTTD', [
            'proposals' => $proposals,
        ]);
    }

    public function signSurat($id)
    {
        $proposal = Protokol::where('status', 'Pending Ketua')
            ->whereNotNull('nomor_surat')
            ->findOrFail($id);

        $proposal->update(['status' => 'Disetujui']);

        AuditLog::record('surat_signed', $proposal);

        Message::create([
            'user_id'     => $proposal->user_id,
            'sender_name' => 'Ketua Komisi Etik',
            'subject'     => "Surat Kelaikan Etik Diterbitkan: {$proposal->nomor_pengajuan}",
            'body'        => "Selamat! Surat Kelaikan Etik untuk proposal Anda \"{$proposal->judul}\" dengan nomor surat {$proposal->nomor_surat} telah resmi ditandatangani dan diterbitkan. Silakan unduh sertifikat di menu Dokumen.",
        ]);

        return back()->with('status', 'Surat Kelaikan Etik berhasil ditandatangani dan diterbitkan.');
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
        // Ketua hanya bertanggung jawab atas Full Board Review
        $proposals = Protokol::where('status', 'Pending Ketua')
            ->where('review_type', 'Full Board')
            ->whereDoesntHave('decision')
            ->with(['reviews.reviewer'])
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
        $proposal = Protokol::findOrFail($id);

        // Pastikan hanya Full Board yang bisa diputuskan oleh Ketua
        if ($proposal->review_type !== 'Full Board') {
            return back()->with('error', 'Ketua Komisi Etik hanya berwenang memutuskan Full Board Review.');
        }

        $request->validate([
            'status' => 'required|in:Approved,AWR,Resubmission,Disapproved',
            'notes' => 'required|string',
            'feedback_applicant' => 'nullable|string',
        ]);

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
            'protokol_id'      => $proposal->id,
            'decided_by'       => $user->id,
            'status'           => $request->status,
            'notes'            => $request->notes,
            'feedback_applicant' => $request->feedback_applicant,
            'certificate_number' => $certificate_number,
            'decided_at'       => Carbon::now(),
        ]);

        $statusMap = [
            'Approved'     => 'Disetujui',
            'AWR'          => 'AWR',
            'Resubmission' => 'Revisi',
            'Disapproved'  => 'Ditolak',
        ];
        $proposal->update(['status' => $statusMap[$request->status]]);

        AuditLog::record('decision_made_ketua', $proposal, null, [
            'status'  => $request->status,
            'notes'   => $request->notes,
            'decided_by' => $user->id,
        ]);

        $subjectMap = [
            'Approved'     => "Proposal Disetujui: {$proposal->nomor_pengajuan}",
            'AWR'          => "Proposal Disetujui dengan Rekomendasi: {$proposal->nomor_pengajuan}",
            'Resubmission' => "Proposal Memerlukan Perbaikan: {$proposal->nomor_pengajuan}",
            'Disapproved'  => "Proposal Ditolak: {$proposal->nomor_pengajuan}",
        ];
        $bodyMap = [
            'Approved'     => "Selamat! Proposal Anda telah disetujui dengan nomor sertifikat: {$certificate_number}.",
            'AWR'          => "Proposal Anda disetujui dengan rekomendasi dari Ketua Komisi Etik. Catatan: " . ($request->feedback_applicant ?? $request->notes),
            'Resubmission' => "Proposal Anda memerlukan perbaikan. Instruksi: " . ($request->feedback_applicant ?? $request->notes),
            'Disapproved'  => "Mohon maaf, proposal Anda tidak disetujui oleh Ketua Komisi Etik. Alasan: " . $request->notes,
        ];

        Message::create([
            'user_id'     => $proposal->user_id,
            'sender_name' => 'Ketua Komisi Etik',
            'subject'     => $subjectMap[$request->status],
            'body'        => $bodyMap[$request->status],
        ]);

        return back()->with('status', 'Keputusan berhasil disimpan.');
    }

    // Epic 9 — Termination Eskalasi (Safety-related)
    public function getTerminationEskalasi()
    {
        $terminations = Termination::where('is_safety_related', true)
            ->with(['protokol:id,judul,nomor_pengajuan,peneliti', 'user:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('KetuaKomisiEtik/EskalasiTermination', [
            'terminations' => $terminations,
        ]);
    }

    public function reviewEskalasi(Request $request, $id)
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

        AuditLog::record('termination_eskalasi_reviewed', $termination, null, [
            'status' => $request->status,
            'notes'  => $request->notes,
        ]);

        // Notify Applicant
        $subject = $request->status === 'Approved'
            ? "Terminasi Safety Disetujui Ketua: {$termination->protokol->nomor_pengajuan}"
            : "Terminasi Safety Ditolak Ketua: {$termination->protokol->nomor_pengajuan}";
        $body = $request->status === 'Approved'
            ? "Pengajuan terminasi safety untuk proposal \"{$termination->protokol->judul}\" telah disetujui oleh Ketua Komisi Etik. " . ($request->notes ?? '')
            : "Pengajuan terminasi safety untuk proposal \"{$termination->protokol->judul}\" ditolak oleh Ketua Komisi Etik. " . ($request->notes ?? '');

        Message::create([
            'user_id'     => $termination->user_id,
            'sender_name' => 'Ketua Komisi Etik',
            'subject'     => $subject,
            'body'        => $body,
        ]);

        return back()->with('status', 'Eskalasi terminasi berhasil diproses.');
    }
}
