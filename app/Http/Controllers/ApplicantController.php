<?php

namespace App\Http\Controllers;

use App\Models\Protokol;
use App\Models\JadwalRapat;
use App\Models\Pengumuman;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function submitProposal()
    {
        return Inertia::render('Applicant/PengajuanEC');
    }

    public function storeProposal(Request $request)
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
            'instrumen' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'sertifikat' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $user = Auth::user();

        // Generate nomor pengajuan
        $count = Protokol::count() + 1;
        $nomor_pengajuan = 'KEP-' . Carbon::now()->year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        // File upload
        $proposal_path = $request->file('proposal')->store('uploads/proposals', 'public');
        $informed_consent_path = $request->file('informed_consent')->store('uploads/informed_consent', 'public');
        $surat_izin_path = $request->file('surat_izin')->store('uploads/surat_izin', 'public');
        $instrumen_path = $request->hasFile('instrumen') ? $request->file('instrumen')->store('uploads/instrumen', 'public') : null;
        $sertifikat_path = $request->hasFile('sertifikat') ? $request->file('sertifikat')->store('uploads/sertifikat', 'public') : null;

        Protokol::create([
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
            'proposal_path' => $proposal_path,
            'informed_consent_path' => $informed_consent_path,
            'surat_izin_path' => $surat_izin_path,
            'instrumen_path' => $instrumen_path,
            'sertifikat_path' => $sertifikat_path,
            'nomor_pengajuan' => $nomor_pengajuan,
            'status' => 'Pending',
            'review_status' => 'Pending',
        ]);

        return redirect()->route('applicant.trackStatus')->with('status', 'Proposal Ethical Clearance berhasil diajukan!');
    }

    public function downloadTemplate()
    {
        return response()->download(storage_path('app/public/templates/template_proposal.docx'));
    }

    public function trackStatus()
    {
        $user = Auth::user();
        $proposals = Protokol::where('user_id', $user->id)->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Applicant/TrackStatus', [
            'proposals' => $proposals,
        ]);
    }

    public function storePengajuan(Request $request)
    {
        $user = Auth::user();

        // Generate nomor pengajuan
        $count = Protokol::count() + 1;
        $nomor_pengajuan = 'KEP-' . Carbon::now()->year . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        // Files - simulated or stored
        $proposal_path = null;
        $informed_consent_path = null;
        $surat_izin_path = null;
        $instrumen_path = null;

        if ($request->hasFile('proposal')) {
            $proposal_path = '/' . $request->file('proposal')->store('uploads', 'public');
        } else {
            $proposal_path = '/storage/uploads/mock_proposal_' . uniqid() . '.pdf';
        }

        if ($request->hasFile('informed_consent')) {
            $informed_consent_path = '/' . $request->file('informed_consent')->store('uploads', 'public');
        } else {
            $informed_consent_path = '/storage/uploads/mock_consent_' . uniqid() . '.pdf';
        }

        if ($request->hasFile('surat_izin')) {
            $surat_izin_path = '/' . $request->file('surat_izin')->store('uploads', 'public');
        } else {
            $surat_izin_path = '/storage/uploads/mock_izin_' . uniqid() . '.pdf';
        }

        if ($request->hasFile('instrumen')) {
            $instrumen_path = '/' . $request->file('instrumen')->store('uploads', 'public');
        }

        Protokol::create([
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
            'proposal_path' => $proposal_path,
            'informed_consent_path' => $informed_consent_path,
            'surat_izin_path' => $surat_izin_path,
            'instrumen_path' => $instrumen_path,
            'nomor_pengajuan' => $nomor_pengajuan,
            'status' => 'Pending',
        ]);

        return redirect()->route('applicant.riwayat')->with('status', 'Proposal Penelitian Berhasil Diajukan!');
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
        return Inertia::render('Applicant/Dokumen', [
            'proposals' => $proposals,
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
}
