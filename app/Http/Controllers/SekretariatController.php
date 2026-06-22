<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\Review;
use App\Models\Decision;
use App\Models\JadwalRapat;
use App\Models\Pengumuman;
use App\Models\Message;
use App\Models\User;
use App\Models\SystemConfig;
use App\Models\AuditLog;
use App\Services\FileStorageService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class SekretariatController extends Controller
{
    public function dashboard()
    {
        $proposals = Protokol::where('sekretariat_id', Auth::id())->get();
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
        $proposals = Protokol::where('sekretariat_id', Auth::id())->orderBy('created_at', 'desc')->get();
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
            AuditLog::record('verification_revisi', $proposal, null, ['catatan' => $request->catatan_revisi]);
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
        $proposals = Protokol::where('sekretariat_id', Auth::id())
            ->with('reviewer:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id'              => $p->id,
                    'nomor_pengajuan' => $p->nomor_pengajuan,
                    'judul'           => $p->judul,
                    'peneliti'        => $p->peneliti,
                    'institusi'       => $p->institusi,
                    'status'          => $p->status,
                    'reviewer_id'     => $p->reviewer_id,
                    'reviewer'        => $p->reviewer ? ['id' => $p->reviewer->id, 'name' => $p->reviewer->name] : null,
                    'due_date'        => $p->due_date,
                    'review_type'     => $p->review_type,
                    'is_overdue'      => $p->due_date && Carbon::parse($p->due_date)->isPast() && $p->status === 'Direview',
                ];
            });

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

        Review::firstOrCreate([
            'protokol_id' => $proposal->id,
            'reviewer_id' => $reviewer->id,
        ], [
            'status' => 'Assigned',
            'assigned_at' => Carbon::now(),
        ]);

        Message::create([
            'user_id' => $proposal->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject' => "Reviewer Ditugaskan: {$proposal->nomor_pengajuan}",
            'body' => "Penelaah etik telah ditugaskan untuk proposal Anda. Peninjauan saat ini diproses oleh {$reviewer->name}.",
        ]);

        return back()->with('status', "Reviewer {$reviewer->name} berhasil ditugaskan ke proposal {$proposal->nomor_pengajuan}.");
    }

    /**
     * PB53 — Send overdue reminder to reviewer for a proposal.
     */
    public function sendReminder($id)
    {
        $proposal = Protokol::findOrFail($id);

        if (!$proposal->reviewer_id) {
            return back()->with('error', 'Proposal ini belum memiliki reviewer yang ditugaskan.');
        }

        $reviewer = User::findOrFail($proposal->reviewer_id);
        $dueDateStr = $proposal->due_date
            ? Carbon::parse($proposal->due_date)->translatedFormat('d F Y')
            : 'belum ditentukan';

        Message::create([
            'user_id'     => $reviewer->id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject'     => "Reminder Overdue: {$proposal->nomor_pengajuan}",
            'body'        => "Yth. {$reviewer->name},\n\nIni adalah pengingat bahwa review untuk proposal \"{$proposal->judul}\" (No. Pengajuan: {$proposal->nomor_pengajuan}) telah melewati tenggat waktu ({$dueDateStr}).\n\nMohon segera menyelesaikan review Anda. Terima kasih.",
        ]);

        AuditLog::record('overdue_reminder_sent', $proposal, null, [
            'reviewer_id' => $reviewer->id,
            'due_date'    => $proposal->due_date,
        ]);

        return back()->with('status', "Reminder overdue berhasil dikirim ke {$reviewer->name}.");
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
        $proposals = Protokol::where('sekretariat_id', Auth::id())->orderBy('created_at', 'desc')->get();
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
            'status' => 'Pending Ketua',
        ]);

        // Create notification for Ketua
        $ketuas = User::role('Ketua Komisi Etik')->get();
        foreach ($ketuas as $ketua) {
            Message::create([
                'user_id' => $ketua->id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject' => "Proposal Siap Dinilai: {$proposal->nomor_pengajuan}",
                'body' => "Proposal dengan judul \"{$proposal->judul}\" telah diberi nomor surat {$request->nomor_surat} dan siap untuk pengambilan keputusan akhir oleh Anda.",
            ]);
        }

        return back()->with('status', 'Nomor surat berhasil diperbarui dan diteruskan ke Ketua Komisi Etik.');
    }

    public function uploadSK(Request $request, $id)
    {
        $proposal = Protokol::findOrFail($id);
        
        if ($request->hasFile('sk_file')) {
            $sk_path = FileStorageService::store($proposal, 'sk', $request->file('sk_file'), 'sk');
        } else {
            $sk_path = '/storage/documents/mock_sk_' . uniqid() . '.pdf';
        }

        $proposal->update(['sk_path' => $sk_path]);

        return back()->with('status', 'Surat Keputusan (SK) berhasil diunggah.');
    }

    public function generateSertifikat($id)
    {
        $proposal = Protokol::findOrFail($id);

        // Gather data for certificate PDF
        $institutionName = SystemConfig::get('institution_name', 'Universitas');
        $ketua = User::role('Ketua Komisi Etik')->first();
        $ketuaName = $ketua ? $ketua->name : '';

        $data = [
            'nomor_surat'       => $proposal->nomor_surat ?? 'KEP-' . $proposal->nomor_pengajuan,
            'peneliti'          => $proposal->peneliti,
            'nidn_nim'          => $proposal->nidn_nim,
            'judul'             => $proposal->judul,
            'institusi'         => $proposal->institusi,
            'lokasi_penelitian' => $proposal->lokasi_penelitian,
            'nomor_pengajuan'   => $proposal->nomor_pengajuan,
            'review_type'       => $proposal->review_type,
            'institution_name'  => $institutionName,
            'ketua_name'        => $ketuaName,
            'tanggal_terbit'    => Carbon::now()->translatedFormat('d F Y'),
        ];

        // Generate PDF
        $pdf = Pdf::loadView('exports.sertifikat', $data);
        $pdf->setPaper('a4', 'portrait');

        // Store with organized path & version tracking
        $certificatePath = FileStorageService::storeContent($proposal, 'sertifikat', $pdf->output(), 'sertifikat');

        $proposal->update([
            'status'          => 'Disetujui',
            'sertifikat_path' => $certificatePath,
        ]);

        Message::create([
            'user_id'     => $proposal->user_id,
            'sender_name' => 'Sekretariat Komisi Etik',
            'subject'     => "Sertifikat Ethical Clearance Diterbitkan: {$proposal->nomor_pengajuan}",
            'body'        => "Selamat! Sertifikat Layak Etik (Ethical Clearance) untuk proposal Anda \"{$proposal->judul}\" telah diterbitkan dengan nomor {$data['nomor_surat']}.",
        ]);

        AuditLog::record('sertifikat_generated', $proposal, null, [
            'nomor_surat' => $data['nomor_surat'],
            'file'        => $certificatePath,
        ]);

        return back()->with('status', 'Sertifikat Ethical Clearance berhasil diterbitkan.');
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

    // Epic 13 — Export PDF Laporan
    public function exportPdf()
    {
        $proposals = Protokol::all();
        $stats = [
            'total'       => $proposals->count(),
            'disetujui'   => $proposals->where('status', 'Disetujui')->count(),
            'ditolak'     => $proposals->where('status', 'Ditolak')->count(),
            'revisi'      => $proposals->where('status', 'Revisi')->count(),
            'direview'    => $proposals->where('status', 'Direview')->count(),
            'pending'     => $proposals->where('status', 'Pending')->count(),
        ];

        $pdf = Pdf::loadView('exports.laporan', [
            'proposals' => $proposals,
            'stats'     => $stats,
            'date'      => Carbon::now()->format('d-m-Y'),
        ]);

        return $pdf->download('laporan-kep-' . Carbon::now()->format('Y-m-d') . '.pdf');
    }

    // Epic 13 — Export CSV Laporan
    public function exportCsv()
    {
        $proposals = Protokol::orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="laporan-kep-' . Carbon::now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($proposals) {
            $file = fopen('php://output', 'w');
            // BOM for Excel UTF-8
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, ['No. Pengajuan', 'Judul', 'Peneliti', 'Institusi', 'Review Type', 'Status', 'Tanggal Pengajuan']);

            foreach ($proposals as $p) {
                fputcsv($file, [
                    $p->nomor_pengajuan,
                    $p->judul,
                    $p->peneliti,
                    $p->institusi,
                    $p->review_type ?? '-',
                    $p->status,
                    $p->created_at->format('d-m-Y'),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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

        $updateData = [
            'review_type' => $request->review_type,
            'review_status' => 'Classified',
            'due_date' => $request->due_date,
        ];

        // Exempted proposals are auto-approved (no review needed)
        if ($request->review_type === 'Exempted') {
            $updateData['status'] = 'Disetujui';
            $updateData['review_status'] = 'Completed';

            Decision::create([
                'protokol_id'    => $proposal->id,
                'decided_by'     => Auth::id(),
                'status'         => 'Approved',
                'notes'          => 'Exempted review — auto-approved oleh Sekretariat.',
                'decided_at'     => Carbon::now(),
            ]);

            Message::create([
                'user_id'     => $proposal->user_id,
                'sender_name' => 'Sekretariat Komisi Etik',
                'subject'     => "Proposal Exempted (Auto-Approved): {$proposal->nomor_pengajuan}",
                'body'        => "Proposal Anda \"{$proposal->judul}\" diklasifikasikan sebagai Exempted dan otomatis disetujui. Silakan unduh sertifikat di halaman Dokumen.",
            ]);
        }

        $proposal->update($updateData);

        $msg = $request->review_type === 'Exempted'
            ? 'Proposal diklasifikasikan Exempted dan otomatis disetujui.'
            : 'Proposal berhasil diklasifikasikan.';

        return back()->with('status', $msg);
    }

    public function assignReviewers(Request $request, $id)
    {
        $proposal = Protokol::findOrFail($id);

        // Dynamic min reviewer from SystemConfig based on review_type
        $minReviewer = match ($proposal->review_type) {
            'Full Board'  => (int) SystemConfig::get('min_reviewer_full_board', 5),
            'Expedited'   => (int) SystemConfig::get('min_reviewer_expedited', 3),
            default       => 1,
        };

        $request->validate([
            'reviewer_ids'   => "required|array|min:{$minReviewer}",
            'reviewer_ids.*' => 'exists:users,id',
        ], [
            'reviewer_ids.min' => "Jumlah minimum reviewer untuk {$proposal->review_type} adalah {$minReviewer} orang.",
        ]);
        
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

        $proposal->update([
            'review_status' => 'Assigned',
            'reviewer_id' => $request->reviewer_ids[0] ?? null,
            'status' => 'Direview',
        ]);

        AuditLog::record('reviewer_assigned', $proposal, null, [
            'reviewer_ids' => $request->reviewer_ids,
            'review_type'  => $proposal->review_type,
        ]);

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
            ->where('sekretariat_id', Auth::id())
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
        $proposal = Protokol::findOrFail($id);

        $request->validate([
            'status' => 'required|in:Approved,AWR,Resubmission,Disapproved',
            'notes' => 'required|string',
            'feedback_applicant' => 'nullable|string',
        ]);

        // Disapproved hanya boleh untuk Full Board Review
        if ($request->status === 'Disapproved' && $proposal->review_type !== 'Full Board') {
            return back()->with('error', 'Status Disapproved hanya berlaku untuk Full Board Review.');
        }

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
            'status' => $request->status,
            'notes' => $request->notes,
            'feedback_applicant' => $request->feedback_applicant,
            'certificate_number' => $certificate_number,
            'decided_at' => Carbon::now(),
        ]);

        // Mapping status keputusan ke status protokol
        $statusMap = [
            'Approved'     => 'Disetujui',
            'AWR'          => 'AWR',
            'Resubmission' => 'Revisi',
            'Disapproved'  => 'Ditolak',
        ];
        $proposal->update(['status' => $statusMap[$request->status]]);

        AuditLog::record('decision_made', $proposal, null, [
            'status'  => $request->status,
            'notes'   => $request->notes,
            'decided_by' => $user->id,
        ]);

        // Notifikasi internal ke Applicant
        $subjectMap = [
            'Approved'     => "Proposal Disetujui: {$proposal->nomor_pengajuan}",
            'AWR'          => "Proposal Disetujui dengan Rekomendasi: {$proposal->nomor_pengajuan}",
            'Resubmission' => "Proposal Memerlukan Perbaikan: {$proposal->nomor_pengajuan}",
            'Disapproved'  => "Proposal Ditolak: {$proposal->nomor_pengajuan}",
        ];
        $bodyMap = [
            'Approved'     => "Selamat! Proposal Anda telah disetujui dengan nomor sertifikat: {$certificate_number}.",
            'AWR'          => "Proposal Anda disetujui dengan rekomendasi. Catatan: " . ($request->feedback_applicant ?? $request->notes),
            'Resubmission' => "Proposal Anda memerlukan perbaikan. Catatan: " . ($request->feedback_applicant ?? $request->notes),
            'Disapproved'  => "Mohon maaf, proposal Anda telah ditolak. Alasan: " . $request->notes,
        ];

        Message::create([
            'user_id'     => $proposal->user_id,
            'sender_name' => 'Komisi Etik',
            'subject'     => $subjectMap[$request->status],
            'body'        => $bodyMap[$request->status],
        ]);

        return back()->with('status', 'Keputusan berhasil disimpan.');
    }

    public function generateCertificate($id)
    {
        $decision = Decision::where('protokol_id', $id)
            ->where('status', 'Approved')
            ->firstOrFail();

        $proposal = $decision->protokol;
        $institutionName = SystemConfig::get('institution_name', 'Universitas');
        $ketua = User::role('Ketua Komisi Etik')->first();

        $data = [
            'nomor_surat'       => $proposal->nomor_surat ?? $decision->certificate_number,
            'peneliti'          => $proposal->peneliti,
            'nidn_nim'          => $proposal->nidn_nim,
            'judul'             => $proposal->judul,
            'institusi'         => $proposal->institusi,
            'lokasi_penelitian' => $proposal->lokasi_penelitian,
            'nomor_pengajuan'   => $proposal->nomor_pengajuan,
            'review_type'       => $proposal->review_type,
            'institution_name'  => $institutionName,
            'ketua_name'        => $ketua ? $ketua->name : '',
            'tanggal_terbit'    => Carbon::now()->translatedFormat('d F Y'),
        ];

        $pdf = Pdf::loadView('exports.sertifikat', $data);
        $pdf->setPaper('a4', 'portrait');

        $certificatePath = FileStorageService::storeContent($proposal, 'sertifikat', $pdf->output(), 'sertifikat');
        
        $decision->update(['letter_path' => $certificatePath]);
        $proposal->update(['sertifikat_path' => $certificatePath]);

        AuditLog::record('sertifikat_generated', $proposal, null, [
            'nomor_surat' => $data['nomor_surat'],
            'file'        => $certificatePath,
        ]);

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

    /**
     * PB35 — Show dedicated Disapproved form.
     */
    public function showDisapproveForm($id)
    {
        $proposal = Protokol::with('reviews')->findOrFail($id);

        if ($proposal->review_type !== 'Full Board') {
            return back()->with('error', 'Status Disapproved hanya berlaku untuk Full Board Review.');
        }

        return Inertia::render('Sekretariat/DisapprovedProposal', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * PB35 — Process Disapproved decision with detailed rejection reason.
     */
    public function disapproveProposal(Request $request, $id)
    {
        $proposal = Protokol::findOrFail($id);

        $request->validate([
            'rejection_reason'    => 'required|string|min:20',
            'feedback_applicant'  => 'required|string|min:10',
            'notes'               => 'required|string|min:10',
        ]);

        if ($proposal->review_type !== 'Full Board') {
            return back()->with('error', 'Status Disapproved hanya berlaku untuk Full Board Review.');
        }

        $user = Auth::user();

        Decision::create([
            'protokol_id'         => $proposal->id,
            'decided_by'          => $user->id,
            'status'              => 'Disapproved',
            'notes'               => $request->notes,
            'feedback_applicant'  => $request->feedback_applicant,
            'certificate_number'  => null,
            'decided_at'          => Carbon::now(),
        ]);

        $proposal->update(['status' => 'Ditolak']);

        AuditLog::record('proposal_disapproved', $proposal, null, [
            'rejection_reason' => $request->rejection_reason,
            'decided_by'       => $user->id,
        ]);

        // Notification to Applicant
        Message::create([
            'user_id'     => $proposal->user_id,
            'sender_name' => 'Komisi Etik',
            'subject'     => "Proposal Ditolak (Disapproved): {$proposal->nomor_pengajuan}",
            'body'        => "Mohon maaf, proposal Anda \"{$proposal->judul}\" telah ditolak oleh Komisi Etik.\n\nAlasan penolakan:\n{$request->feedback_applicant}",
        ]);

        return redirect()->route('sekretariat.pengambilanKeputusan')
            ->with('status', 'Keputusan Disapproved berhasil disimpan.');
    }
}
