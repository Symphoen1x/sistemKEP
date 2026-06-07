<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Check if user status is pending or inactive
        if ($user->status === 'pending') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors([
                'email' => 'Akun Anda sedang menunggu aktivasi oleh Sekretariat.',
            ]);
        }

        if ($user->status === 'inactive') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return back()->withErrors([
                'email' => 'Akun Anda telah dinonaktifkan. Silakan hubungi Sekretariat.',
            ]);
        }

        $request->session()->regenerate();

        // Check roles
        $roles = $user->roles;
        if ($roles->count() > 1 && empty($user->active_role_name)) {
            return redirect()->route('role.select');
        } elseif ($roles->count() === 1 && empty($user->active_role_name)) {
            $user->update(['active_role_name' => $roles->first()->name]);
        }

        return redirect()->intended($this->roleBasedRedirect($user));
    }

    /**
     * Determine the redirect URL based on the user's active role.
     *
     * [Tim B - Isa] Role yang sudah punya halaman diaktifkan di sini.
     * [Tim A - Olga & Fajar] Saat dashboard per role di Epic 3 selesai,
     * uncomment baris yang sesuai dan isi nama route-nya, lalu kabarin Isa!
     */
    private function roleBasedRedirect($user): string
    {
        return match ($user->active_role_name) {
            // ── Tim B (Isa) — Sudah aktif ──────────────────────────────────
            'Admin'             => route('admin.users.index', absolute: false),
            'Sekretariat'       => route('sekretariat.dashboard', absolute: false),
            'Applicant'         => route('applicant.dashboard', absolute: false),

            // ── Tim A (Olga & Fajar) — Uncomment saat Epic 3 selesai ───────
            'Reviewer'          => route('reviewer.dashboard', absolute: false),
            'Ketua Komisi Etik' => route('ketua.dashboard', absolute: false),

            // ── Fallback: ke /dashboard (placeholder Epic 3) ────────────────
            default             => route('dashboard', absolute: false),
        };
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
