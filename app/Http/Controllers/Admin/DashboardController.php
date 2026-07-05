<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Protokol;
use App\Models\AuditLog;
use App\Models\Amendment;
use App\Models\Termination;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * PB16 — Admin Dashboard dengan widget ringkasan.
     */
    public function index(): Response
    {
        // User stats by role
        $usersByRole = DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->select('roles.name as role', DB::raw('count(*) as count'))
            ->groupBy('roles.name')
            ->get()
            ->pluck('count', 'role')
            ->toArray();

        $totalUsers = User::count();
        $pendingUsers = User::where('status', 'pending')->count();
        $activeUsers = User::where('status', 'active')->count();

        // Proposal stats by status
        $proposalsByStatus = Protokol::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        $totalProposals = Protokol::count();

        // Recent audit logs (last 10)
        $recentLogs = AuditLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($log) => [
                'id'         => $log->id,
                'action'     => $log->action,
                'user_name'  => $log->user?->name ?? 'System',
                'model_type' => $log->model_type,
                'created_at' => $log->created_at->diffForHumans(),
            ]);

        // Amendment & Termination stats
        $amendmentCount = Amendment::count();
        $terminationCount = Termination::count();
        $pendingAmendments = Amendment::where('status', 'Pending')->count();
        $pendingTerminations = Termination::where('status', 'Pending')->count();

        // Monthly proposal submissions (last 6 months)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Protokol::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $monthlyData[] = [
                'name'  => $month->format('M'),
                'count' => $count,
            ];
        }

        $stats = [
            'totalUsers'        => $totalUsers,
            'activeUsers'       => $activeUsers,
            'pendingUsers'      => $pendingUsers,
            'totalProposals'    => $totalProposals,
            'amendmentCount'    => $amendmentCount,
            'terminationCount'  => $terminationCount,
            'pendingAmendments' => $pendingAmendments,
            'pendingTerminations' => $pendingTerminations,
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats'             => $stats,
            'usersByRole'       => $usersByRole,
            'proposalsByStatus' => $proposalsByStatus,
            'recentLogs'        => $recentLogs,
            'monthlyData'       => $monthlyData,
        ]);
    }
}
