<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Roles Standar (PBF02)
        $roles = [
            'Applicant',
            'Reviewer',
            'Sekretariat',
            'Ketua Komisi Etik',
            'Admin'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 2. Buat Akun Admin Default
        // Menggunakan kredensial dari .env agar tidak hardcoded.
        // Jika belum diset di .env, akan fallback ke nilai default yang aman untuk testing awal.
        $adminEmail = env('ADMIN_DEFAULT_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_DEFAULT_PASSWORD', 'admin12345');

        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name'             => 'System Admin',
                'password'         => Hash::make($adminPassword),
                'active_role_name' => 'Admin',
                'status'           => 'active', // Admin langsung aktif
            ]
        );

        // Pastikan Admin yang sudah ada juga berstatus active
        if ($admin->status !== 'active') {
            $admin->update(['status' => 'active']);
        }

        // Assign role Admin ke akun tersebut
        if (!$admin->hasRole('Admin')) {
            $admin->assignRole('Admin');
        }

    }
}


