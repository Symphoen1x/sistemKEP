<?php

namespace App\Http\Controllers;

use App\Models\User;
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

        // Normally, send an email notification here about activation.

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

        // Normally, send an email notification here about rejection.

        return back()->with('status', "Pendaftaran akun {$user->name} telah ditolak.");
    }
}
