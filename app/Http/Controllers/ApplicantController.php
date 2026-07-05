<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\JadwalRapat;
use App\Models\Pengumuman;
use App\Models\Message;
use App\Models\User;
use App\Models\Template;
use App\Services\FileStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class ApplicantController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Load data from DB
        $proposals = Protokol::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        
        // Calculate statistics
        $stats = [
            'aktif' => $proposals->whereIn('status', ['Pending', 'Direview', 'Revisi'])->count(),
            'disetujui' => $proposals->where('status', 'Disetujui')->count(),
            'menunggu' => $proposals->where('status', 'Pending')->count(),
            'revisi' => $proposals->where('status', 'Revisi')->count(),
        ];

        $recentProposals = $proposals->take(5)->values();
        
        $revisions = $proposals->where('status', 'Revisi')->values();
        
        // Schedules: filter upcoming meetings
        $schedules = JadwalRapat::where('tanggal', '>=', Carbon::now()->toDateString())
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->get();
            
        $announcements = Pengumuman::orderBy('tanggal', 'desc')->get();

        return Inertia::render('Applicant/Dashboard', [
            'stats' => $stats,
            'recentProposals' => $recentProposals,
            'revisions' => $revisions,
            'schedules' => $schedules,
            'announcements' => $announcements,
        ]);
    }

    public function pengajuan()
    {
        return Inertia::render('Applicant/PengajuanPenelitian');
    }

    public function downloadTemplate()
    {
        return response()->download(storage_path('app/public/templates/template_proposal.docx'));
    }

    public function trackStatus()
    {
        $user = Auth::user();
        $proposals = Protokol::where('user_id', $user->id)
            ->with('decision') // untuk tampilkan feedback_applicant
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Applicant/TrackStatus', [
            'proposals' => $proposals,
        ]);
    }

    public function storePengajuan(Request $request)
    {
        $request->validate([
            'nama' => 'required|string',
            'nidn_nim' => 'required|string',
            'email' => 'required|email',
            'no_hp' => 'required|string',
            'institusi' => 'required|string',
            'role_peneliti' => 'required|string',
            'judul' => 'required|string',
            'lokasi_penelitian' => 'required|string',
            'anggota_tim' => 'nullable|string',
            'subjek_penelitian' => 'required|string',
            'metode_penelitian' => 'required|string',
            'risiko_penelitian' => 'required|string',
            'deskripsi_penelitian' => 'required|string',
            'proposal' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'informed_consent' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'surat_izin' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'formulir_pengajuan' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'ringkasan_protokol' => 'required|file|mimes:pdf,doc,docx|max:10240',
            'instrumen' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $user = Auth::user();

        // Generate nomor pengajuan
        $count = Protokol::count() + 1;
        $nomor_pengajuan = 'KEP-' . Carbon::now()->year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        // Create protocol first for organized storage path
        $protokol = Protokol::create([
            'user_id' => $user->id,
            'judul' => $request->judul,
            'peneliti' => $request->nama,
            'nidn_nim' => $request->nidn_nim,
            'email' => $request->email,
            'no_hp' => $request->no_hp,
            'institusi' => $request->institusi,
            'role_peneliti' => $request->role_peneliti,
            'lokasi_penelitian' => $request->lokasi_penelitian,
            'anggota_tim' => $request->anggota_tim,
            'subjek_penelitian' => $request->subjek_penelitian,
            'metode_penelitian' => $request->metode_penelitian,
            'risiko_penelitian' => $request->risiko_penelitian,
            'deskripsi_penelitian' => $request->deskripsi_penelitian,
            'nomor_pengajuan' => $nomor_pengajuan,
            'status' => 'Pending Admin',
        ]);

        // File upload with organized structure & version tracking
        $updatePaths = [];
        if ($request->hasFile('proposal')) {
            $updatePaths['proposal_path'] = FileStorageService::store($protokol, 'proposal', $request->file('proposal'), 'initial');
        }
        if ($request->hasFile('informed_consent')) {
            $updatePaths['informed_consent_path'] = FileStorageService::store($protokol, 'informed_consent', $request->file('informed_consent'), 'initial');
        }
        if ($request->hasFile('surat_izin')) {
            $updatePaths['surat_izin_path'] = FileStorageService::store($protokol, 'surat_izin', $request->file('surat_izin'), 'initial');
        }
        $updatePaths['formulir_pengajuan_path'] = FileStorageService::store($protokol, 'formulir_pengajuan', $request->file('formulir_pengajuan'), 'initial');
        $updatePaths['ringkasan_protokol_path'] = FileStorageService::store($protokol, 'ringkasan_protokol', $request->file('ringkasan_protokol'), 'initial');
        if ($request->hasFile('instrumen')) {
            $updatePaths['instrumen_path'] = FileStorageService::store($protokol, 'instrumen', $request->file('instrumen'), 'initial');
        }
        if (!empty($updatePaths)) {
            $protokol->update($updatePaths);
        }

        return redirect()->route('applicant.trackStatus')->with('status', 'Proposal Penelitian Berhasil Diajukan!');
    }

    public function riwayat()
    {
        $user = Auth::user();
        $proposals = Protokol::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('Applicant/RiwayatPengajuan', [
            'proposals' => $proposals,
        ]);
    }

    public function dokumen()
    {
        $user = Auth::user();
        $proposals = Protokol::where('user_id', $user->id)
            ->whereNotNull('nomor_pengajuan')
            ->orderBy('created_at', 'desc')
            ->get();

        // Template aktif dari DB
        $templates = Template::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'version', 'file_path', 'original_filename', 'published_at']);

        return Inertia::render('Applicant/Dokumen', [
            'proposals' => $proposals,
            'templates' => $templates,
        ]);
    }

    public function pesan()
    {
        $user = Auth::user();
        $messages = Message::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('Applicant/PesanNotifikasi', [
            'messages' => $messages,
        ]);
    }

    public function profil()
    {
        return Inertia::render('Applicant/Profil');
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
            'nidn_nim' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name', 'phone_number', 'address', 'institution', 'role_type', 'nidn_nim'
        ]));

        return back()->with('status', 'Profil berhasil diperbarui.');
    }

    public function bantuan()
    {
        return Inertia::render('Applicant/Bantuan');
    }

    // Task 1.4 — Upload Revisi Dokumen (PB21)
    public function showRevisiForm($id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->whereIn('status', ['Revisi', 'AWR'])
            ->with('decision')
            ->findOrFail($id);

        return Inertia::render('Applicant/UploadRevisi', [
            'proposal' => $proposal,
        ]);
    }

    public function storeRevisi(Request $request, $id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->whereIn('status', ['Revisi', 'AWR'])
            ->findOrFail($id);

        $request->validate([
            'proposal'         => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'informed_consent' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'surat_izin'       => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'instrumen'        => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'catatan_revisi_applicant' => 'nullable|string|max:1000',
        ]);

        $updateData = ['status' => 'Direvisi'];

        // Version-tracked file uploads with organized structure
        if ($request->hasFile('proposal')) {
            $updateData['proposal_path'] = FileStorageService::store($proposal, 'proposal', $request->file('proposal'), 'revisi');
        }
        if ($request->hasFile('informed_consent')) {
            $updateData['informed_consent_path'] = FileStorageService::store($proposal, 'informed_consent', $request->file('informed_consent'), 'revisi');
        }
        if ($request->hasFile('surat_izin')) {
            $updateData['surat_izin_path'] = FileStorageService::store($proposal, 'surat_izin', $request->file('surat_izin'), 'revisi');
        }
        if ($request->hasFile('instrumen')) {
            $updateData['instrumen_path'] = FileStorageService::store($proposal, 'instrumen', $request->file('instrumen'), 'revisi');
        }

        $proposal->update($updateData);

        // Notifikasi ke Sekretariat
        $sekretariats = User::role('Sekretariat')->get();
        foreach ($sekretariats as $sekre) {
            Message::create([
                'user_id'     => $sekre->id,
                'sender_name' => 'Sistem KEP',
                'subject'     => "Revisi Dikirim: {$proposal->nomor_pengajuan}",
                'body'        => "Peneliti {$proposal->peneliti} telah mengirimkan revisi untuk proposal \"{$proposal->judul}\". Silakan verifikasi kembali.",
            ]);
        }

        return redirect()->route('applicant.trackStatus')
            ->with('status', 'Revisi berhasil dikirim. Sekretariat akan memverifikasi kembali.');
    }

    /**
     * PB33 — Download sertifikat PDF asli
     */
    public function downloadSertifikat($id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)->findOrFail($id);

        if (!$proposal->sertifikat_path) {
            return back()->with('error', 'Sertifikat belum diterbitkan.');
        }

        $storagePath = str_replace('/storage/', 'public/', $proposal->sertifikat_path);

        if (!Storage::exists($storagePath)) {
            return back()->with('error', 'File sertifikat tidak ditemukan.');
        }

        return Storage::download($storagePath, 'Sertifikat_EC_' . $proposal->nomor_pengajuan . '.pdf');
    }
}