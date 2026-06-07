<?php

namespace App\Http\Controllers;

use App\Models\Protokol; // Pastikan Model sudah ada
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProtokolController extends Controller
{
    /**
     * Menampilkan daftar protokol ke halaman React
     */
    public function index()
    {
        // Mengambil semua data dari tabel protokols
        $dataProtokol = Protokol::latest()->get();

        // Mengirim data ke file resources/js/Pages/Protokol/Index.jsx
        return Inertia::render('Protokol/Index', [
            'dataProtokol' => $dataProtokol // Harus 'dataProtokol', bukan 'data' atau lainnya
        ]);
    }

    /**
     * Memperbarui status protokol (Data Asli yang diubah)
     */
    public function updateStatus(Request $request, $id)
    {
        // Validasi input
        $request->validate([
            'status' => 'required|in:Pending,Proses,Disetujui,Ditolak',
        ]);

        // Cari data berdasarkan ID dan update statusnya
        $protokol = Protokol::findOrFail($id);
        $protokol->update([
            'status' => $request->status
        ]);

        // Kembali ke halaman sebelumnya dengan pesan sukses (opsional)
        return redirect()->back()->with('message', 'Status berhasil diperbarui!');
    }
}


