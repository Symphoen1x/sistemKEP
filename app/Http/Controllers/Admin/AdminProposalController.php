<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Protokol;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminProposalController extends Controller
{
    /**
     * Display list of proposals waiting for admin assignment.
     */
    public function index(Request $request): Response
    {
        $proposals = Protokol::where('status', 'Pending Admin')
            ->orderBy('created_at', 'desc')
            ->get();

        $sekretariats = User::role('Sekretariat')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
        });

        return Inertia::render('Admin/Proposals/Index', [
            'proposals' => $proposals,
            'sekretariats' => $sekretariats,
        ]);
    }

    /**
     * Assign a Secretariat to oversee a proposal.
     */
    public function assignSekretariat(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'sekretariat_id' => 'required|exists:users,id',
        ]);

        $proposal = Protokol::findOrFail($id);
        $sekretariat = User::findOrFail($request->sekretariat_id);

        if (!$sekretariat->hasRole('Sekretariat')) {
            return back()->with('error', 'User terpilih bukan anggota Sekretariat.');
        }

        $proposal->update([
            'sekretariat_id' => $sekretariat->id,
            'status' => 'Pending', // Move to Pending, which means waiting for Sekretariat verification
        ]);

        // Create message/notification for the Secretariat user
        Message::create([
            'user_id' => $sekretariat->id,
            'sender_name' => 'Sistem KEP',
            'subject' => "Pengawasan Alur Proposal Baru: {$proposal->nomor_pengajuan}",
            'body' => "Anda telah ditugaskan oleh Admin untuk mengawasi alur proposal \"{$proposal->judul}\" oleh peneliti {$proposal->peneliti}. Silakan verifikasi proposal ini di dashboard Anda.",
        ]);

        return back()->with('success', "Sekretariat {$sekretariat->name} berhasil ditugaskan untuk mengawasi proposal ini.");
    }
}
