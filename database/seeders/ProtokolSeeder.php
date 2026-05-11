<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProtokolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Protokol::create([
            'judul' => 'Uji Klinis Vaksin Tahap 3',
            'peneliti' => 'Dr. Aris Setiawan',
            'status' => 'Pending'
        ]);

        \App\Models\Protokol::create([
            'judul' => 'Studi Kasus Gizi Anak Balita',
            'peneliti' => 'Prof. Siti Maryam',
            'status' => 'Proses'
        ]);
    }
}
