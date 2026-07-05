<?php

namespace App\Http\Controllers;

use App\Models\Termination;
use App\Models\Protokol;
use App\Models\Message;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TerminationController extends Controller
{
    /**
     * Show termination submission form for Applicant.
     */
    public function create($id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->where('status', 'Disetujui')
            ->findOrFail($id);

        return Inertia::render('Applicant/PengajuanTermination', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * Store a new termination request.
     */
    public function store(Request $request, $id)
    {
        $user = Auth::user();
        $proposal = Protokol::where('user_id', $user->id)
            ->where('status', 'Disetujui')
            ->findOrFail($id);

        $request->validate([
            'effective_date'     => 'required|date|after_or_equal:today',
            'reason_category'    => 'required|in:Safety,Non-Safety,Administrative',
            'description'        => 'required|string|max:2000',
            'participant_status' => 'nullable|string|max:500',
            'safety_measures'    => 'nullable|string|max:1000',
        ]);

        $isSafety = $request->reason_category === 'Safety';

        $termination = Termination::create([
            'protokol_id'        => $proposal->id,
            'user_id'            => $user->id,
            'effective_date'     => $request->effective_date,
            'reason_category'    => $request->reason_category,
            'description'        => $request->description,
            'participant_status' => $request->participant_status,
            'safety_measures'    => $request->safety_measures,
            'is_safety_related'  => $isSafety,
            'status'             => $isSafety ? 'Eskalasi' : 'Pending',
        ]);

        AuditLog::record('termination_submitted', $termination);

        // Notify Sekretariat (and Ketua if safety-related)
        $notifyRoles = ['Sekretariat'];
        if ($isSafety) {
            $notifyRoles[] = 'Ketua Komisi Etik';
        }

        foreach ($notifyRoles as $role) {
            $users = User::role($role)->get();
            foreach ($users as $u) {
                Message::create([
                    'user_id'     => $u->id,
                    'sender_name' => 'Sistem KEP',
                    'subject'     => $isSafety
                        ? "⚠️ TERMINATION SAFETY: {$proposal->nomor_pengajuan}"
                        : "Pengajuan Terminasi: {$proposal->nomor_pengajuan}",
                    'body'        => "Peneliti {$proposal->peneliti} mengajukan terminasi ({$request->reason_category}) untuk proposal \"{$proposal->judul}\"."
                        . ($isSafety ? " Ini adalah terminasi terkait keselamatan dan memerlukan eskalasi." : ''),
                ]);
            }
        }

        return redirect()->route('applicant.trackStatus')
            ->with('status', 'Pengajuan Terminasi berhasil dikirim.');
    }

    /**
     * List terminations for Applicant's own proposals.
     */
    public function myTerminations()
    {
        $user = Auth::user();
        $terminations = Termination::where('user_id', $user->id)
            ->with('protokol:id,judul,nomor_pengajuan')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Applicant/RiwayatTermination', [
            'terminations' => $terminations,
        ]);
    }
}
