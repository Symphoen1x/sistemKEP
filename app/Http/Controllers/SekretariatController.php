<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Review;
use App\Models\Decision;
use App\Models\JadwalRapat;
use App\Models\Pengumuman;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class SekretariatController extends Controller
{
    public function dashboard()
    {
        $proposals = Protokol::all();
        $pendingUsers = User::where('status', 'pending')->orderBy('created_at', 'desc')->get();
        $schedules = JadwalRapat::orderBy('tanggal', 'asc')->get();

        // Calculate statistics
        $stats = [
            'total' => $proposals->count(),
            'pending' => $proposals->where('status', 'Pending')->count(),
            'revisi' => $proposals->where('status', 'Revisi')->count(),
            'direview' => $proposals->where('status', 'Direview')->count(),
            'selesai' => $proposals->whereIn('status', ['Disetujui', 'Ditolak'])->count(),
        ];

        // Prepare a mock activity feed based on actual database data
        $activities = [];
        foreach ($proposals->sortByDesc('updated_at')->take(5) as $p) {
            $time = $p->updated_at->diffForHumans();
            if ($p->status === 'Pending') {
                $activities[] = [
                    'text' => "Proposal baru masuk: \"{$p->judul}\" oleh {$p->peneliti}",
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
                    'text' => "Revisi administrasi diajukan untuk \"{$p->nomor_pengajuan}\"",
                    'time' => $time,
                    'type' => 'warning'
                ];
            } elseif ($p->status === 'Disetujui') {
                $activities[] = [
                    'text' => "Sertifikat Ethical Clearance diterbitkan untuk \"{$p->nomor_pengajuan}\"",
                    'time' => $time,
                    'type' => 'success'
                ];
            } elseif ($p->status === 'Ditolak') {
                $activities[] = [
                    'text' => "Proposal KEP \"{$p->nomor_pengajuan}\" ditolak",
                    'time' => $time,
                    'type' => 'danger'
                ];
            }
        }

        return Inertia::render('Sekretariat/SekreDashboard', [
            'stats' => $stats,
            'activities' => $activities,
            'schedules' => $schedules,
            'pendingUsers' => $pendingUsers,
        ]);
    }

    public function verifikasi()
    {
        $proposals = Protokol::orderBy('created_at', 'desc')->get();
        return Inertia::render('Sekretariat/VerifikasiPengajuan', [
            'proposals' => $proposals,
        ]);
    }

    public function verifikasiAksi(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:terima,revisi,tolak',
            'catatan_revisi' => 'nullable|string',
        ]);

        $proposal = Protokol::findOrFail($id);

        if ($request->action === 'terima') {
            $proposal->update(['status' => 'Direview']);
            // Create notification message for the user
            Message::create([
                'user_id' => $proposal->user_id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject' => "Proposal Diterima Administrasi: {$proposal->nomor_pengajuan}",
                'body' => "Proposal Anda dengan judul \"{$proposal->judul}\" telah lolos verifikasi administrasi dan sedang ditugaskan ke reviewer.",
            ]);
            $statusMsg = "Proposal berhasil disetujui administrasi dan dialihkan ke tahap review.";
        } elseif ($request->action === 'revisi') {
            $proposal->update([
                'status' => 'Revisi',
                'catatan_revisi' => $request->catatan_revisi,
            ]);
            Message::create([
                'user_id' => $proposal->user_id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject' => "Permintaan Revisi Administrasi: {$proposal->nomor_pengajuan}",
                'body' => "Anda diminta melakukan revisi proposal \"{$proposal->judul}\". Catatan: " . $request->catatan_revisi,
            ]);
            $statusMsg = "Proposal dikembalikan ke peneliti untuk direvisi.";
        } else {
            $proposal->update(['status' => 'Ditolak']);
            Message::create([
                'user_id' => $proposal->user_id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject' => "Proposal Ditolak: {$proposal->nomor_pengajuan}",
                'body' => "Mohon maaf, proposal Anda dengan judul \"{$proposal->judul}\" telah ditolak oleh Komisi Etik.",
            ]);
            $statusMsg = "Proposal telah ditolak.";
        }

        return back()->with('status', $statusMsg);
    }

    public function dokumen()
    {
        $proposals = Protokol::whereNotNull('nomor_pengajuan')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Sekretariat/ManajemenDokumen', [
            'proposals' => $proposals,
        ]);
    }

    public function reviewer()
    {
        // Get all users who have the role "Reviewer"
        $reviewers = User::role('Reviewer')->get();
        $proposals = Protokol::orderBy('created_at', 'desc')->get();

        return Inertia::render('Sekretariat/PenugasanReviewer', [
            'reviewers' => $reviewers,
            'proposals' => $proposals,
        ]);
    }

    public function assignReviewer(Request $request, $id)
    {
        $request->validate([
            'reviewer_id' => 'required|exists:users,id',
        ]);

        $proposal = Protokol::findOrFail($id);
        $reviewer = User::findOrFail($request->reviewer_id);

        $proposal->update([
            'reviewer_id' => $reviewer->id,
            'status' => 'Direview',
        ]);

        Message::create([
            'user_id' => $proposal->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject' => "Reviewer Ditugaskan: {$proposal->nomor_pengajuan}",
            'body' => "Penelaah etik telah ditugaskan untuk proposal Anda. Peninjauan saat ini diproses oleh {$reviewer->name}.",
        ]);

        return back()->with('status', "Reviewer {$reviewer->name} berhasil ditugaskan ke proposal {$proposal->nomor_pengajuan}.");
    }

    public function rapat()
    {
        $schedules = JadwalRapat::orderBy('tanggal', 'asc')->get();
        return Inertia::render('Sekretariat/JadwalRapat', [
            'schedules' => $schedules,
        ]);
    }

    public function storeRapat(Request $request)
    {
        $request->validate([
            'agenda' => 'required|string',
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'tempat' => 'required|string',
        ]);

        JadwalRapat::create($request->all());

        return back()->with('status', 'Jadwal Rapat berhasil ditambahkan.');
    }

    public function updateRapat(Request $request, $id)
    {
        $request->validate([
            'agenda' => 'required|string',
            'tanggal' => 'required|date',
            'waktu' => 'required',
            'tempat' => 'required|string',
            'status' => 'required|string',
        ]);

        $rapat = JadwalRapat::findOrFail($id);
        $rapat->update($request->all());

        return back()->with('status', 'Jadwal Rapat berhasil diperbarui.');
    }

    public function destroyRapat($id)
    {
        $rapat = JadwalRapat::findOrFail($id);
        $rapat->delete();

        return back()->with('status', 'Jadwal Rapat berhasil dihapus.');
    }

    public function surat()
    {
        $proposals = Protokol::orderBy('created_at', 'desc')->get();
        return Inertia::render('Sekretariat/SuratSertifikat', [
            'proposals' => $proposals,
        ]);
    }

    public function generateNomorSurat(Request $request, $id)
    {
        $request->validate([
            'nomor_surat' => 'required|string',
        ]);

        $proposal = Protokol::findOrFail($id);
        $proposal->update([
            'nomor_surat' => $request->nomor_surat,
        ]);

        return back()->with('status', 'Nomor surat berhasil diperbarui.');
    }

    public function uploadSK(Request $request, $id)
    {
        $proposal = Protokol::findOrFail($id);
        
        $sk_path = null;
        if ($request->hasFile('sk_file')) {
            $sk_path = '/' . $request->file('sk_file')->store('uploads', 'public');
        } else {
            $sk_path = '/storage/uploads/mock_sk_' . uniqid() . '.pdf';
        }

        $proposal->update([
            'sk_path' => $sk_path,
        ]);

        return back()->with('status', 'Surat Keputusan (SK) berhasil diunggah.');
    }

    public function generateSertifikat($id)
    {
        $proposal = Protokol::findOrFail($id);

        // Update status to approved if it isn't yet, and save mock cert path
        $proposal->update([
            'status' => 'Disetujui',
            'sertifikat_path' => '/storage/sertifikat/' . $proposal->nomor_pengajuan . '.pdf',
        ]);

        Message::create([
            'user_id' => $proposal->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject' => "Sertifikat Ethical Clearance Diterbitkan: {$proposal->nomor_pengajuan}",
            'body' => "Selamat! Sertifikat Layak Etik (Ethical Clearance) untuk proposal Anda \"{$proposal->judul}\" telah diterbitkan dengan nomor {$proposal->nomor_surat}.",
        ]);

        return back()->with('status', 'Ethical Clearance berhasil diterbitkan.');
    }

    public function laporan()
    {
        $proposals = Protokol::all();
        
        // Group by months for Recharts (last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthName = $month->format('M');
            $yearMonth = $month->format('Y-m');

            $monthlyProposals = $proposals->filter(function ($p) use ($yearMonth) {
                return $p->created_at->format('Y-m') === $yearMonth;
            });

            $chartData[] = [
                'name' => $monthName,
                'Total' => $monthlyProposals->count(),
                'Disetujui' => $monthlyProposals->where('status', 'Disetujui')->count(),
                'Ditolak' => $monthlyProposals->where('status', 'Ditolak')->count(),
            ];
        }

        // Stats for pie charts
        $distribution = [
            ['name' => 'Disetujui', 'value' => $proposals->where('status', 'Disetujui')->count()],
            ['name' => 'Ditolak', 'value' => $proposals->where('status', 'Ditolak')->count()],
            ['name' => 'Revisi', 'value' => $proposals->where('status', 'Revisi')->count()],
            ['name' => 'Sedang Direview', 'value' => $proposals->where('status', 'Direview')->count()],
            ['name' => 'Pending', 'value' => $proposals->where('status', 'Pending')->count()],
        ];

        // Reviewer performance workload
        $reviewers = User::role('Reviewer')->get();
        $reviewerPerformance = [];
        foreach ($reviewers as $rev) {
            $revProposals = $proposals->where('reviewer_id', $rev->id);
            $reviewerPerformance[] = [
                'name' => $rev->name,
                'Proposals' => $revProposals->count(),
                'Selesai' => $revProposals->where('status', 'Disetujui')->count(),
            ];
        }

        return Inertia::render('Sekretariat/Laporan', [
            'chartData' => $chartData,
            'distribution' => $distribution,
            'reviewerPerformance' => $reviewerPerformance,
        ]);
    }

    public function profil()
    {
        return Inertia::render('Sekretariat/Profil');
    }

    public function updateProfil(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'institution' => 'nullable|string',
            'role_type' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name', 'phone_number', 'address', 'institution', 'role_type'
        ]));

        return back()->with('status', 'Profil berhasil diperbarui.');
    }

    // EPIC 5 - Evaluasi & Routing Dokumen
    public function evaluateProposal($id)
    {
        $proposal = Protokol::findOrFail($id);
        $reviewers = User::role('Reviewer')->get();

        return Inertia::render('Sekretariat/EvaluasiProposal', [
            'proposal' => $proposal,
            'reviewers' => $reviewers,
        ]);
    }

    public function classifyReview(Request $request, $id)
    {
        $request->validate([
            'review_type' => 'required|in:Exempted,Expedited,Full Board',
            'due_date' => 'required|date|after:today',
        ]);

        $proposal = Protokol::findOrFail($id);
        $proposal->update([
            'review_type' => $request->review_type,
            'review_status' => 'Classified',
            'due_date' => $request->due_date,
        ]);

        return back()->with('status', 'Proposal berhasil diklasifikasikan.');
    }

    public function assignReviewers(Request $request, $id)
    {
        $request->validate([
            'reviewer_ids' => 'required|array|min:1',
            'reviewer_ids.*' => 'exists:users,id',
        ]);

        $proposal = Protokol::findOrFail($id);
        
        foreach ($request->reviewer_ids as $reviewer_id) {
            $reviewer = User::findOrFail($reviewer_id);
            
            Review::create([
                'protokol_id' => $proposal->id,
                'reviewer_id' => $reviewer_id,
                'status' => 'Assigned',
                'assigned_at' => Carbon::now(),
            ]);

            Message::create([
                'user_id' => $reviewer_id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject' => "Proposal Baru Ditugaskan: {$proposal->nomor_pengajuan}",
                'body' => "Proposal etika dengan judul \"{$proposal->judul}\" telah ditugaskan untuk review Anda.",
            ]);
        }

        $proposal->update(['review_status' => 'Assigned']);

        return back()->with('status', 'Reviewer berhasil ditugaskan.');
    }

    public function setDueDate(Request $request, $id)
    {
        $request->validate([
            'due_date' => 'required|date|after:today',
        ]);

        $proposal = Protokol::findOrFail($id);
        $proposal->update(['due_date' => $request->due_date]);

        return back()->with('status', 'Tenggat waktu berhasil diperbarui.');
    }

    // EPIC 7 - Keputusan & Post-Decision
    public function getProposalsForDecision()
    {
        $proposals = Protokol::where('review_status', 'Completed')
            ->whereDoesntHave('decision')
            ->with('reviews')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Sekretariat/PengambilanKeputusan', [
            'proposals' => $proposals,
        ]);
    }

    public function showDecisionForm($id)
    {
        $proposal = Protokol::with('reviews')->findOrFail($id);
        $reviews = $proposal->reviews;

        return Inertia::render('Sekretariat/FormKeputusan', [
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

    public function generateCertificate($id)
    {
        $decision = Decision::where('protokol_id', $id)
            ->where('status', 'Approved')
            ->firstOrFail();

        $proposal = $decision->protokol;

        // Generate certificate path
        $certificate_path = '/storage/sertifikat/' . $decision->certificate_number . '.pdf';
        
        $decision->update(['letter_path' => $certificate_path]);
        $proposal->update(['sertifikat_path' => $certificate_path]);

        return back()->with('status', 'Sertifikat berhasil dibuat.');
    }

    public function sendNotification($id)
    {
        $proposal = Protokol::findOrFail($id);
        $decision = $proposal->decision;

        if (!$decision) {
            return back()->with('error', 'Keputusan tidak ditemukan.');
        }

        Message::create([
            'user_id' => $proposal->user_id,
            'sender_name' => 'Komisi Etik',
            'subject' => $decision->status === 'Approved'
                ? "Sertifikat Ethical Clearance Diterbitkan"
                : "Notifikasi Keputusan Proposal",
            'body' => $decision->status === 'Approved'
                ? "Selamat! Sertifikat Ethical Clearance Anda telah diterbitkan dengan nomor {$decision->certificate_number}."
                : "Mohon maaf, proposal Anda telah ditolak.",
        ]);

        return back()->with('status', 'Notifikasi berhasil dikirim.');
    }
}
