<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Mail\NewAccountCredentials;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    /**
     * PB08: Display a paginated list of all users with filters and search.
     */
    public function index(Request $request): Response
    {
        $query = User::with('roles')
            ->orderBy('created_at', 'desc');

        // Search berdasarkan nama atau email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Filter berdasarkan role (menggunakan Spatie whereHasRole)
        if ($role = $request->input('role')) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        $users = $query->paginate(15)->withQueryString();

        // Format data user untuk frontend
        $users->through(function ($user) {
            return [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'status'       => $user->status,
                'phone_number' => $user->phone_number,
                'address'      => $user->address,
                'roles'        => $user->roles->pluck('name'),
                'created_at'   => $user->created_at->format('d M Y'),
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'status', 'role']),
        ]);
    }

    /**
     * PB09: Show the form to create a new internal account.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * PB09: Store a newly created internal user account.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name'             => $request->name,
            'email'            => $request->email,
            'password'         => Hash::make($request->password),
            'status'           => 'active', // Akun internal langsung aktif
            'active_role_name' => $request->role,
            'phone_number'     => $request->phone_number,
            'address'          => $request->address,
        ]);

        $user->assignRole($request->role);

        // Kirim email kredensial (via log driver sementara; SMTP dikonfigurasi di Epic 11)
        try {
            Mail::to($user->email)->send(new NewAccountCredentials($user, $request->password, $request->role));
        } catch (\Exception $e) {
            Log::warning("Gagal mengirim email kredensial ke {$user->email}: " . $e->getMessage());
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', "Akun untuk {$user->name} berhasil dibuat sebagai {$request->role}. Email kredensial telah dikirim.");
    }

    /**
     * PB10 + PB11: Show detail of a specific user.
     */
    public function show(User $user): Response
    {
        $userRoles = $user->roles->pluck('name');

        // Semua role yang tersedia di sistem
        $allRoles = Role::all()->pluck('name');

        // Role yang belum dimiliki user (untuk dropdown tambah role)
        $availableRoles = $allRoles->diff($userRoles)->values();

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'status'         => $user->status,
                'phone_number'   => $user->phone_number,
                'address'        => $user->address,
                'active_role'    => $user->active_role_name,
                'roles'          => $userRoles,
                'created_at'     => $user->created_at->format('d M Y, H:i'),
                'created_at_raw' => $user->created_at->toISOString(),
            ],
            'availableRoles' => $availableRoles,
        ]);
    }

    /**
     * PB10: Add or remove a role from a user.
     */
    public function updateRoles(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'action' => ['required', 'string', 'in:add,remove'],
            'role'   => ['required', 'string', 'exists:roles,name'],
        ]);

        if ($request->action === 'add') {
            if ($user->hasRole($request->role)) {
                return back()->with('error', "Pengguna sudah memiliki peran {$request->role}.");
            }
            $user->assignRole($request->role);
            $message = "Peran {$request->role} berhasil ditambahkan ke akun {$user->name}.";
        } else {
            // Jangan hapus semua role — minimal harus ada 1
            if ($user->roles->count() <= 1) {
                return back()->with('error', 'Pengguna harus memiliki minimal satu peran. Hapus role gagal.');
            }
            $user->removeRole($request->role);

            // Jika role yang dihapus adalah active_role_name, reset ke null
            if ($user->active_role_name === $request->role) {
                $user->update(['active_role_name' => $user->roles()->first()?->name]);
            }

            $message = "Peran {$request->role} berhasil dihapus dari akun {$user->name}.";
        }

        // Notifikasi perubahan role (via log sementara)
        Log::info("Role update for user [{$user->id}] {$user->name}: action={$request->action}, role={$request->role}, by admin=" . auth()->id());

        return back()->with('success', $message);
    }

    /**
     * PB11: Toggle user account status between active and inactive.
     */
    public function toggleStatus(User $user): RedirectResponse
    {
        // Jangan biarkan Admin menonaktifkan dirinya sendiri
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        $statusLabel = $newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan';

        // Log aksi toggle status
        Log::info("User status toggled: user [{$user->id}] {$user->name} => {$newStatus}, by admin=" . auth()->id());

        return back()->with('success', "Akun {$user->name} berhasil {$statusLabel}.");
    }

    /**
     * Change a user's password (admin-set).
     */
    public function updatePassword(Request $request, User $user): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        Log::info("Password changed for user [{$user->id}] {$user->name} by admin=" . auth()->id());

        return back()->with('success', "Kata sandi untuk {$user->name} berhasil diubah.");
    }
}
