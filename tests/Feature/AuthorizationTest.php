<?php

test('guest diarahkan ke login saat akses dashboard', function () {
    $this->get('/dashboard')->assertRedirect(route('login'));
});

dataset('dashboard per role', [
    'Applicant'         => ['Applicant', 'applicant.dashboard'],
    'Sekretariat'       => ['Sekretariat', 'sekretariat.dashboard'],
    'Reviewer'          => ['Reviewer', 'reviewer.dashboard'],
    'Ketua Komisi Etik' => ['Ketua Komisi Etik', 'ketua.dashboard'],
    'Admin'             => ['Admin', 'admin.dashboard'],
]);

test('user diarahkan ke dashboard sesuai role aktif', function (string $role, string $routeName) {
    $user = userWithRole($role);

    $this->actingAs($user)->get('/dashboard')->assertRedirect(route($routeName));
})->with('dashboard per role');

dataset('akses lintas role terlarang', [
    'Applicant ke sekretariat' => ['Applicant', 'sekretariat.dashboard'],
    'Reviewer ke admin'        => ['Reviewer', 'admin.dashboard'],
    'Sekretariat ke ketua'     => ['Sekretariat', 'ketua.dashboard'],
    'Applicant ke reviewer'    => ['Applicant', 'reviewer.dashboard'],
]);

test('role tidak dapat mengakses area role lain', function (string $role, string $forbiddenRoute) {
    $user = userWithRole($role);

    $this->actingAs($user)->get(route($forbiddenRoute))->assertForbidden();
})->with('akses lintas role terlarang');

test('user nonaktif tidak dapat login', function () {
    $user = userWithRole('Applicant', ['status' => 'inactive']);

    $response = $this->from('/login')->post('/login', [
        'email'    => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});
