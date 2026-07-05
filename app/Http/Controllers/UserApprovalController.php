<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserApprovalController extends Controller
{
    /**
     * Display a listing of the pending users.
     */
    public function index(): Response
    {
        $pendingUsers = User::where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Sekretariat/PendingUsers', [
            'pendingUsers' => $pendingUsers,
        ]);
    }

    /**
     * Approve a pending user.
     */
    public function approve(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'role' => 'required|string|in:Applicant,Reviewer',
        ]);

        if ($user->status !== 'pending') {
            return back()->with('error', 'Akun tidak berstatus pending.');
        }

        $user->update(['status' => 'active']);
        $user->assignRole($request->role);
        
        AuditLog::record('user_approved', $user, null, ['role' => $request->role]);
        
        // Send email notification here about activation.
        Message::create([
            'user_id' => $user->id,
            'sender_name' => 'Sekretariat KEP',
            'subject' => 'Pendaftaran Akun Disetujui',
            'body' => "Selamat! Pendaftaran akun Anda di Sistem KEP telah disetujui sebagai {$request->role}. Silakan masuk ke sistem menggunakan kredensial Anda.",
        ]);

        return back()->with('status', "Akun {$user->name} berhasil diaktivasi sebagai {$request->role}.");
    }

    /**
     * Reject a pending user.
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        if ($user->status !== 'pending') {
            return back()->with('error', 'Akun tidak berstatus pending.');
        }

        $user->update(['status' => 'inactive']);
        
        AuditLog::record('user_rejected', $user);
        
        // Send email notification here about rejection.
        Message::create([
            'user_id' => $user->id,
            'sender_name' => 'Sekretariat KEP',
            'subject' => 'Pendaftaran Akun Ditolak',
            'body' => "Mohon maaf, pendaftaran akun Anda di Sistem KEP ditolak oleh Sekretariat. Silakan hubungi kami untuk informasi lebih lanjut.",
        ]);

        return back()->with('status', "Pendaftaran akun {$user->name} telah ditolak.");
    }
}
