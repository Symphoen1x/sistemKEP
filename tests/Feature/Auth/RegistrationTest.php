<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new applicants can register and land in pending status', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'registration_role' => 'Applicant',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('login'));
    $response->assertSessionHas('status', 'Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi dari Sekretariat.');

    $this->assertDatabaseHas('users', [
        'email'             => 'test@example.com',
        'registration_role' => 'Applicant',
        'status'            => 'pending',
    ]);
});

test('reviewer registration requires expertise field', function () {
    $response = $this->from('/register')->post('/register', [
        'name' => 'Calon Reviewer',
        'email' => 'reviewer-baru@example.com',
        'registration_role' => 'Reviewer',
        // expertise sengaja dikosongkan
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('expertise');
    $this->assertDatabaseMissing('users', ['email' => 'reviewer-baru@example.com']);
});

test('registration role is required', function () {
    $response = $this->from('/register')->post('/register', [
        'name' => 'Tanpa Role',
        'email' => 'norole@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('registration_role');
});
