<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Protokol;
use App\Models\User;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Route;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $proposals = Protokol::all();
        
        // Data for Area Chart (Volume per month)
        $monthly = $proposals->groupBy(function($val) {
            return Carbon::parse($val->created_at)->format('M Y');
        });
        
        $chartData = [];
        foreach ($monthly as $month => $items) {
            $chartData[] = [
                'name' => $month,
                'Total' => $items->count(),
                'Disetujui' => $items->where('status', 'Disetujui')->count(),
            ];
        }

        // Data for Pie Chart (Distribution by Status)
        $distribution = [
            ['name' => 'Disetujui', 'value' => $proposals->where('status', 'Disetujui')->count()],
            ['name' => 'Ditolak', 'value' => $proposals->where('status', 'Ditolak')->count()],
            ['name' => 'Revisi', 'value' => $proposals->where('status', 'Revisi')->count()],
            ['name' => 'Direview', 'value' => $proposals->where('status', 'Direview')->count()],
            ['name' => 'Menunggu', 'value' => $proposals->whereIn('status', ['Pending', 'New Proposal'])->count()],
        ];

        // Data for Reviewer Performance
        $reviewers = User::role('Reviewer')->get();
        $reviewerPerformance = [];
        foreach ($reviewers as $rev) {
            $revProposals = $proposals->where('reviewer_id', $rev->id);
            $reviewerPerformance[] = [
                'name' => $rev->name,
                'Proposals' => $revProposals->count(),
                'Selesai' => $revProposals->where('status', 'Disetujui')->count(),
            ];
        }

        // Map current laporan route to its export routes
        $routeMap = [
            'admin.laporan'       => 'admin',
            'ketua.laporan'       => 'ketua',
            'sekretariat.laporan' => 'sekretariat',
        ];
        $currentRouteName = $request->route()->getName();
        $prefix = $routeMap[$currentRouteName] ?? 'sekretariat';

        return Inertia::render('Sekretariat/Laporan', [
            'chartData' => $chartData,
            'distribution' => $distribution,
            'reviewerPerformance' => $reviewerPerformance,
            'exportPdfRoute' => route($prefix . '.laporan.exportPdf'),
            'exportCsvRoute' => route($prefix . '.laporan.exportCsv'),
        ]);

    }

    public function exportPdf()
    {
        $proposals = Protokol::all();
        $stats = [
            'total'       => $proposals->count(),
            'disetujui'   => $proposals->where('status', 'Disetujui')->count(),
            'ditolak'     => $proposals->where('status', 'Ditolak')->count(),
            'revisi'      => $proposals->where('status', 'Revisi')->count(),
            'direview'    => $proposals->where('status', 'Direview')->count(),
            'pending'     => $proposals->whereIn('status', ['Pending', 'New Proposal'])->count(),
        ];

        $pdf = Pdf::loadView('exports.laporan', [
            'proposals' => $proposals,
            'stats'     => $stats,
            'date'      => Carbon::now()->format('d-m-Y'),
        ]);

        return $pdf->download('laporan-kep-' . Carbon::now()->format('Y-m-d') . '.pdf');
    }

    public function exportCsv()
    {
        $proposals = Protokol::orderBy('created_at', 'desc')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="laporan-kep-' . Carbon::now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($proposals) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, ['No. Pengajuan', 'Judul', 'Peneliti', 'Institusi', 'Review Type', 'Status', 'Tanggal Pengajuan']);

            foreach ($proposals as $p) {
                fputcsv($file, [
                    $p->nomor_pengajuan,
                    $p->judul,
                    $p->peneliti,
                    $p->institusi,
                    $p->review_type ?? '-',
                    $p->status,
                    Carbon::parse($p->created_at)->format('d M Y')
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
