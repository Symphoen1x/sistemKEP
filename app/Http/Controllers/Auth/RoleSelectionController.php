<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RoleSelectionController extends Controller
{
    /**
     * Display the role selection view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $user = Auth::user();
        $roles = $user->roles;

        // If user has less than 2 roles, they don't need to select a role.
        if ($roles->count() < 2) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('Auth/SelectRole', [
            'availableRoles' => $roles->pluck('name'),
        ]);
    }

    /**
     * Handle the role selection.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'role' => 'required|string',
        ]);

        $user = Auth::user();

        // Check if the selected role is one of the user's assigned roles
        if (!$user->hasRole($request->role)) {
            return back()->withErrors(['role' => 'Peran yang dipilih tidak valid.']);
        }

        $user->update(['active_role_name' => $request->role]);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
