<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RoleSelectionController;
use App\Http\Controllers\UserApprovalController;
use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/role/select', [RoleSelectionController::class, 'create'])->name('role.select');
    Route::post('/role/select', [RoleSelectionController::class, 'store'])->name('role.select.store');

    // Route Group untuk Role: Applicant
    Route::middleware('role:Applicant')->prefix('applicant')->name('applicant.')->group(function () {
        // Route khusus Applicant
    });

    // Route Group untuk Role: Reviewer
    Route::middleware('role:Reviewer')->prefix('reviewer')->name('reviewer.')->group(function () {
        // Route khusus Reviewer
    });

    // Route Group untuk Role: Sekretariat
    Route::middleware('role:Sekretariat')->prefix('sekretariat')->name('sekretariat.')->group(function () {
        Route::get('/pending-users', [UserApprovalController::class, 'index'])->name('users.pending');
        Route::post('/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('users.reject');
    });

    // Route Group untuk Role: Ketua Komisi Etik
    Route::middleware('role:Ketua Komisi Etik')->prefix('ketua')->name('ketua.')->group(function () {
        // Route khusus Ketua Komisi Etik
    });

    // Route Group untuk Role: Admin
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        // PB08: Daftar semua user
        // PB09: Buat akun internal
        // PB10: Kelola role user
        // PB11: Toggle status aktif/nonaktif
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/roles', [UserManagementController::class, 'updateRoles'])->name('users.roles');
        Route::patch('/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
    });
});

require __DIR__.'/auth.php';
