<?php

use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('admin dapat membuat akun internal yang langsung aktif', function () {
    Mail::fake();
    $admin = userWithRole('Admin');

    $response = $this->actingAs($admin)->post(route('admin.users.store'), [
        'name'  => 'Sekre Baru',
        'email' => 'sekre.baru@example.com',
        'role'  => 'Sekretariat',
    ]);

    $response->assertRedirect(route('admin.users.index'));

    $user = User::where('email', 'sekre.baru@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->status)->toBe('active');
    expect($user->hasRole('Sekretariat'))->toBeTrue();
});

test('buat akun internal menolak role yang tidak diizinkan', function () {
    $admin = userWithRole('Admin');

    $this->actingAs($admin)
        ->from(route('admin.users.create'))
        ->post(route('admin.users.store'), [
            'name'  => 'Coba Applicant',
            'email' => 'applicant.internal@example.com',
            'role'  => 'Applicant',
        ])
        ->assertSessionHasErrors('role');
});

test('admin dapat menambah role ke user', function () {
    $admin = userWithRole('Admin');
    $target = userWithRole('Applicant');

    $this->actingAs($admin)->patch(route('admin.users.roles', $target->id), [
        'action' => 'add',
        'role'   => 'Reviewer',
    ]);

    expect($target->fresh()->hasRole('Reviewer'))->toBeTrue();
});

test('admin tidak bisa menghapus role terakhir user', function () {
    $admin = userWithRole('Admin');
    $target = userWithRole('Applicant');

    $response = $this->actingAs($admin)->patch(route('admin.users.roles', $target->id), [
        'action' => 'remove',
        'role'   => 'Applicant',
    ]);

    $response->assertSessionHas('error');
    expect($target->fresh()->hasRole('Applicant'))->toBeTrue();
});

test('admin dapat menonaktifkan akun user lain', function () {
    $admin = userWithRole('Admin');
    $target = userWithRole('Reviewer');

    $this->actingAs($admin)->patch(route('admin.users.toggle-status', $target->id));

    expect($target->fresh()->status)->toBe('inactive');
});

test('admin tidak bisa menonaktifkan akun sendiri', function () {
    $admin = userWithRole('Admin');

    $response = $this->actingAs($admin)->patch(route('admin.users.toggle-status', $admin->id));

    $response->assertSessionHas('error');
    expect($admin->fresh()->status)->toBe('active');
});

test('non-admin tidak bisa mengakses manajemen user', function () {
    $sekre = userWithRole('Sekretariat');

    $this->actingAs($sekre)->get(route('admin.users.index'))->assertForbidden();
});
