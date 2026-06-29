<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->beforeEach(function () {
        // Reset cache permission Spatie tiap test (DB di-refresh tiap test).
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        seedRoles();
    })
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Pastikan 5 role standar sistem KEP ada di database.
 */
function seedRoles(): void
{
    foreach (['Applicant', 'Reviewer', 'Sekretariat', 'Ketua Komisi Etik', 'Admin'] as $role) {
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
    }
}

/**
 * Buat user aktif dengan role tertentu.
 */
function userWithRole(string $role, array $attributes = []): \App\Models\User
{
    $user = \App\Models\User::factory()->create(array_merge([
        'active_role_name' => $role,
        'status'           => 'active',
    ], $attributes));

    $user->assignRole($role);

    return $user;
}
