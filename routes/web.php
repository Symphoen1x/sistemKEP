<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RoleSelectionController;
use App\Http\Controllers\UserApprovalController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\SekretariatController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProtokolController;
use App\Http\Controllers\ReviewerController;
use App\Http\Controllers\KetuaKomisiEtikController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Role-based dashboard redirection
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasRole('Admin')) {
        return redirect()->route('admin.users.index');
    }
    if ($user->hasRole('Sekretariat')) {
        return redirect()->route('sekretariat.dashboard');
    }
    if ($user->hasRole('Reviewer')) {
        return redirect()->route('reviewer.dashboard');
    }
    if ($user->hasRole('Ketua Komisi Etik')) {
        return redirect()->route('ketua.dashboard');
    }
    if ($user->hasRole('Applicant')) {
        return redirect()->route('applicant.dashboard');
    }
    return redirect()->route('profile.edit');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/admin', function () {
    return redirect()->route('admin.users.index');
})->middleware(['auth', 'role:Admin']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/role/select', [RoleSelectionController::class, 'create'])->name('role.select');
    Route::post('/role/select', [RoleSelectionController::class, 'store'])->name('role.select.store');

    // Route Group untuk Role: Applicant (Peneliti)
    Route::middleware('role:Applicant')->prefix('applicant')->name('applicant.')->group(function () {
        Route::get('/dashboard', [ApplicantController::class, 'dashboard'])->name('dashboard');
        Route::get('/pengajuan', [ApplicantController::class, 'pengajuan'])->name('pengajuan');
        Route::post('/pengajuan', [ApplicantController::class, 'storePengajuan'])->name('pengajuan.store');
        
        // EPIC 4: Pengajuan Ethical Clearance
        Route::get('/pengajuan-ec', [ApplicantController::class, 'submitProposal'])->name('submitProposal');
        Route::post('/pengajuan-ec', [ApplicantController::class, 'storeProposal'])->name('storeProposal');
        Route::get('/download-template', [ApplicantController::class, 'downloadTemplate'])->name('downloadTemplate');
        Route::get('/track-status', [ApplicantController::class, 'trackStatus'])->name('trackStatus');
        
        Route::get('/riwayat', [ApplicantController::class, 'riwayat'])->name('riwayat');
        Route::get('/dokumen', [ApplicantController::class, 'dokumen'])->name('dokumen');
        Route::get('/pesan', [ApplicantController::class, 'pesan'])->name('pesan');
        Route::get('/profil', [ApplicantController::class, 'profil'])->name('profil');
        Route::post('/profil', [ApplicantController::class, 'updateProfil'])->name('profil.update');
        Route::get('/bantuan', [ApplicantController::class, 'bantuan'])->name('bantuan');
    });

    // Route Group untuk Role: Sekretariat
    Route::middleware('role:Sekretariat')->prefix('sekretariat')->name('sekretariat.')->group(function () {
        Route::get('/dashboard', [SekretariatController::class, 'dashboard'])->name('dashboard');
        
        // Verifikasi & Kelola pendaftaran akun
        Route::get('/pending-users', [UserApprovalController::class, 'index'])->name('users.pending');
        Route::post('/users/{user}/approve', [UserApprovalController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject', [UserApprovalController::class, 'reject'])->name('users.reject');
        
        // Verifikasi Usulan Protokol
        Route::get('/verifikasi', [SekretariatController::class, 'verifikasi'])->name('verifikasi');
        Route::post('/verifikasi/{id}/aksi', [SekretariatController::class, 'verifikasiAksi'])->name('verifikasi.aksi');
        
        // Dokumen & Unduhan
        Route::get('/dokumen', [SekretariatController::class, 'dokumen'])->name('dokumen');
        
        // Penunjukan Reviewer
        Route::get('/reviewer', [SekretariatController::class, 'reviewer'])->name('reviewer');
        Route::post('/reviewer/{id}/assign', [SekretariatController::class, 'assignReviewer'])->name('reviewer.assign');
        
        // Jadwal Rapat
        Route::get('/rapat', [SekretariatController::class, 'rapat'])->name('rapat');
        Route::post('/rapat', [SekretariatController::class, 'storeRapat'])->name('rapat.store');
        Route::patch('/rapat/{id}', [SekretariatController::class, 'updateRapat'])->name('rapat.update');
        Route::delete('/rapat/{id}', [SekretariatController::class, 'destroyRapat'])->name('rapat.destroy');
        
        // Nomor Surat & SK & Sertifikat
        Route::get('/surat', [SekretariatController::class, 'surat'])->name('surat');
        Route::post('/surat/{id}/nomor', [SekretariatController::class, 'generateNomorSurat'])->name('surat.nomor');
        Route::post('/surat/{id}/sk', [SekretariatController::class, 'uploadSK'])->name('surat.sk');
        Route::post('/surat/{id}/sertifikat', [SekretariatController::class, 'generateSertifikat'])->name('surat.sertifikat');
        
        // EPIC 5: Evaluasi & Routing Dokumen
        Route::get('/evaluasi/{id}', [SekretariatController::class, 'evaluateProposal'])->name('evaluateProposal');
        Route::post('/evaluasi/{id}/classify', [SekretariatController::class, 'classifyReview'])->name('classifyReview');
        Route::post('/evaluasi/{id}/assign', [SekretariatController::class, 'assignReviewers'])->name('assignReviewers');
        Route::post('/evaluasi/{id}/due-date', [SekretariatController::class, 'setDueDate'])->name('setDueDate');
        
        // EPIC 7: Keputusan & Post-Decision
        Route::get('/pengambilan-keputusan', [SekretariatController::class, 'getProposalsForDecision'])->name('pengambilanKeputusan');
        Route::get('/keputusan/{id}', [SekretariatController::class, 'showDecisionForm'])->name('showDecisionForm');
        Route::post('/keputusan/{id}', [SekretariatController::class, 'makeDecision'])->name('makeDecision');
        Route::post('/keputusan/{id}/sertifikat', [SekretariatController::class, 'generateCertificate'])->name('generateCertificate');
        Route::post('/keputusan/{id}/notifikasi', [SekretariatController::class, 'sendNotification'])->name('sendNotification');
        
        // Laporan & Profil
        Route::get('/laporan', [SekretariatController::class, 'laporan'])->name('laporan');
        Route::get('/profil', [SekretariatController::class, 'profil'])->name('profil');
        Route::post('/profil', [SekretariatController::class, 'updateProfil'])->name('profil.update');
    });

    // Route Group untuk Role: Admin
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/roles', [UserManagementController::class, 'updateRoles'])->name('users.roles');
        Route::patch('/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');
    });

    // Route Group untuk Role: Reviewer
    Route::middleware('role:Reviewer')->prefix('reviewer')->name('reviewer.')->group(function () {
        Route::get('/dashboard', [ReviewerController::class, 'dashboard'])->name('dashboard');
        Route::get('/proposals', [ReviewerController::class, 'proposals'])->name('proposals');
        
        // EPIC 6: Review EC
        Route::get('/assigned', [ReviewerController::class, 'getAssignedProposals'])->name('assigned');
        Route::get('/proposals/{id}/view', [ReviewerController::class, 'viewProposal'])->name('viewProposal');
        Route::get('/proposals/{id}/form', [ReviewerController::class, 'showReviewForm'])->name('showReviewForm');
        Route::get('/proposals/{id}/review', [ReviewerController::class, 'review'])->name('review');
        Route::post('/proposals/{id}/submit', [ReviewerController::class, 'submitReview'])->name('submitReview');
        Route::post('/proposals/{id}/review', [ReviewerController::class, 'storeReview'])->name('review.store');
        
        Route::get('/history', [ReviewerController::class, 'history'])->name('history');
        Route::get('/schedules', [ReviewerController::class, 'schedules'])->name('schedules');
        Route::get('/profil', [ReviewerController::class, 'profile'])->name('profil');
        Route::post('/profil', [ReviewerController::class, 'updateProfile'])->name('profil.update');
    });

    // Route Group untuk Role: Ketua Komisi Etik
    Route::middleware('role:Ketua Komisi Etik')->prefix('ketua')->name('ketua.')->group(function () {
        Route::get('/dashboard', [KetuaKomisiEtikController::class, 'dashboard'])->name('dashboard');
        
        // EPIC 7: Decision making by Ketua
        Route::get('/pengambilan-keputusan', [KetuaKomisiEtikController::class, 'getProposalsForDecision'])->name('pengambilanKeputusan');
        Route::get('/keputusan/{id}', [KetuaKomisiEtikController::class, 'showDecisionForm'])->name('showDecisionForm');
        Route::post('/keputusan/{id}', [KetuaKomisiEtikController::class, 'makeDecision'])->name('makeDecision');
        
        Route::get('/profil', [KetuaKomisiEtikController::class, 'profil'])->name('profil');
        Route::post('/profil', [KetuaKomisiEtikController::class, 'updateProfil'])->name('profil.update');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/protokol', [ProtokolController::class, 'index'])->name('protokol.index');
    Route::patch('/protokol/{id}/status', [ProtokolController::class, 'updateStatus'])->name('protokol.updateStatus');
});

require __DIR__.'/auth.php';
