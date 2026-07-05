<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RoleSelectionController;
use App\Http\Controllers\UserApprovalController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\SekretariatController;
use App\Http\Controllers\AmendmentController;
use App\Http\Controllers\AmendmentReviewController;
use App\Http\Controllers\TerminationController;
use App\Http\Controllers\TerminationReviewController;
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
        return redirect()->route('admin.dashboard');
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
    return redirect()->route('admin.dashboard');
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
        
        Route::get('/download-template', [ApplicantController::class, 'downloadTemplate'])->name('downloadTemplate');
        Route::get('/track-status', [ApplicantController::class, 'trackStatus'])->name('trackStatus');
        
        // PB21 — Upload Revisi Dokumen
        Route::get('/revisi/{id}', [ApplicantController::class, 'showRevisiForm'])->name('revisi.form');
        Route::post('/revisi/{id}', [ApplicantController::class, 'storeRevisi'])->name('revisi.store');
        
        Route::get('/riwayat', [ApplicantController::class, 'riwayat'])->name('riwayat');
        Route::get('/dokumen', [ApplicantController::class, 'dokumen'])->name('dokumen');
        Route::get('/dokumen/{id}/download-sertifikat', [ApplicantController::class, 'downloadSertifikat'])->name('downloadSertifikat');
        Route::get('/pesan', [ApplicantController::class, 'pesan'])->name('pesan');
        Route::get('/profil', [ApplicantController::class, 'profil'])->name('profil');
        Route::post('/profil', [ApplicantController::class, 'updateProfil'])->name('profil.update');
        Route::get('/bantuan', [ApplicantController::class, 'bantuan'])->name('bantuan');

        // Epic 8 — Amendment
        Route::get('/amendment/{id}', [AmendmentController::class, 'create'])->name('amendment.create');
        Route::post('/amendment/{id}', [AmendmentController::class, 'store'])->name('amendment.store');
        Route::get('/amendments', [AmendmentController::class, 'myAmendments'])->name('amendments.mine');

        // Epic 9 — Termination
        Route::get('/termination/{id}', [TerminationController::class, 'create'])->name('termination.create');
        Route::post('/termination/{id}', [TerminationController::class, 'store'])->name('termination.store');
        Route::get('/terminations', [TerminationController::class, 'myTerminations'])->name('terminations.mine');
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
        Route::post('/reviewer/{id}/reminder', [SekretariatController::class, 'sendReminder'])->name('reviewer.reminder');
        
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

        // PB35 — Disapproved (separate form)
        Route::get('/keputusan/{id}/disapprove', [SekretariatController::class, 'showDisapproveForm'])->name('showDisapproveForm');
        Route::post('/keputusan/{id}/disapprove', [SekretariatController::class, 'disapproveProposal'])->name('disapproveProposal');
        
        // Laporan & Profil
        Route::get('/laporan', [\App\Http\Controllers\ReportController::class, 'index'])->name('laporan');
        Route::get('/laporan/export-pdf', [\App\Http\Controllers\ReportController::class, 'exportPdf'])->name('laporan.exportPdf');
        Route::get('/laporan/export-csv', [\App\Http\Controllers\ReportController::class, 'exportCsv'])->name('laporan.exportCsv');
        Route::get('/profil', [SekretariatController::class, 'profil'])->name('profil');
        Route::post('/profil', [SekretariatController::class, 'updateProfil'])->name('profil.update');

        // Epic 8 — Amendment Review
        Route::get('/amendments', [AmendmentReviewController::class, 'index'])->name('amendments.index');
        Route::post('/amendments/{id}/classify', [AmendmentReviewController::class, 'classify'])->name('amendments.classify');
        Route::post('/amendments/{id}/decide', [AmendmentReviewController::class, 'decide'])->name('amendments.decide');
        // PB39 — Assign Reviewer to Major Amendment
        Route::post('/amendments/{id}/assign-reviewer', [AmendmentReviewController::class, 'assignReviewer'])->name('amendments.assignReviewer');

        // Epic 9 — Termination Review
        Route::get('/terminations', [TerminationReviewController::class, 'index'])->name('terminations.index');
        Route::post('/terminations/{id}/classify', [TerminationReviewController::class, 'classify'])->name('terminations.classify');
        Route::post('/terminations/{id}/finalize', [TerminationReviewController::class, 'finalize'])->name('terminations.finalize');
    });

    // Route Group untuk Role: Admin
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        // PB16 — Admin Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/roles', [UserManagementController::class, 'updateRoles'])->name('users.roles');
        Route::patch('/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggle-status');

        // Proposals routing & assignment
        Route::get('/proposals', [\App\Http\Controllers\Admin\AdminProposalController::class, 'index'])->name('proposals.index');
        Route::post('/proposals/{id}/assign', [\App\Http\Controllers\Admin\AdminProposalController::class, 'assignSekretariat'])->name('proposals.assign');

        // PB48-50 — Konfigurasi Sistem
        Route::get('/config', [\App\Http\Controllers\Admin\SystemConfigController::class, 'index'])->name('config.index');
        Route::post('/config', [\App\Http\Controllers\Admin\SystemConfigController::class, 'update'])->name('config.update');

        // PB45-47 — Manajemen Template
        Route::get('/templates', [\App\Http\Controllers\Admin\TemplateController::class, 'index'])->name('templates.index');
        Route::post('/templates', [\App\Http\Controllers\Admin\TemplateController::class, 'store'])->name('templates.store');
        Route::post('/templates/{template}', [\App\Http\Controllers\Admin\TemplateController::class, 'update'])->name('templates.update');
        Route::patch('/templates/{template}/toggle', [\App\Http\Controllers\Admin\TemplateController::class, 'toggleActive'])->name('templates.toggle');

        // Epic 13 — Laporan & Statistik
        Route::get('/laporan', [\App\Http\Controllers\ReportController::class, 'index'])->name('laporan');
        Route::get('/laporan/export-pdf', [\App\Http\Controllers\ReportController::class, 'exportPdf'])->name('laporan.exportPdf');
        Route::get('/laporan/export-csv', [\App\Http\Controllers\ReportController::class, 'exportCsv'])->name('laporan.exportCsv');

        // Epic 14 — Audit Log
        Route::get('/audit-log', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])->name('audit-log.index');
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

        // PB39 — Major Amendment Review by Reviewer
        Route::get('/amendment-reviews', [ReviewerController::class, 'amendmentReviews'])->name('amendmentReviews');
        Route::get('/amendment-reviews/{id}', [ReviewerController::class, 'showAmendmentReview'])->name('amendmentReview.show');
        Route::post('/amendment-reviews/{id}/submit', [ReviewerController::class, 'submitAmendmentReview'])->name('amendmentReview.submit');
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
        
        // PB34 — Daftar Surat Menunggu TTD
        Route::get('/surat-ttd', [KetuaKomisiEtikController::class, 'getDaftarSuratTTD'])->name('suratTTD');
        Route::post('/surat-ttd/{id}/sign', [KetuaKomisiEtikController::class, 'signSurat'])->name('signSurat');

        // Epic 9 — Termination Eskalasi (Ketua)
        Route::get('/terminations-eskalasi', [KetuaKomisiEtikController::class, 'getTerminationEskalasi'])->name('terminations.eskalasi');
        Route::post('/terminations-eskalasi/{id}', [KetuaKomisiEtikController::class, 'reviewEskalasi'])->name('terminations.reviewEskalasi');

        // Epic 8 — Amendment (Ketua view)
        Route::get('/amendments', [AmendmentController::class, 'myAmendments'])->name('amendments.mine');

        // Epic 13 — Laporan & Statistik
        Route::get('/laporan', [\App\Http\Controllers\ReportController::class, 'index'])->name('laporan');
        Route::get('/laporan/export-pdf', [\App\Http\Controllers\ReportController::class, 'exportPdf'])->name('laporan.exportPdf');
        Route::get('/laporan/export-csv', [\App\Http\Controllers\ReportController::class, 'exportCsv'])->name('laporan.exportCsv');
    });

    // Epic 9 — Termination (Applicant)
    Route::middleware('role:Applicant')->prefix('applicant')->name('applicant.')->group(function () {
        Route::get('/termination/{id}', [TerminationController::class, 'create'])->name('termination.create');
        Route::post('/termination/{id}', [TerminationController::class, 'store'])->name('termination.store');
        Route::get('/terminations', [TerminationController::class, 'myTerminations'])->name('terminations.mine');
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/protokol', [ProtokolController::class, 'index'])->name('protokol.index');
    Route::patch('/protokol/{id}/status', [ProtokolController::class, 'updateStatus'])->name('protokol.updateStatus');
});

require __DIR__.'/auth.php';
