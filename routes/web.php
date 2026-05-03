<?php

use App\Http\Controllers\ProfileController;
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
        // Route khusus Sekretariat
    });

    // Route Group untuk Role: Ketua Komisi Etik
    Route::middleware('role:Ketua Komisi Etik')->prefix('ketua')->name('ketua.')->group(function () {
        // Route khusus Ketua Komisi Etik
    });

    // Route Group untuk Role: Admin
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        // Route khusus Admin
    });
});

require __DIR__.'/auth.php';
