<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action type
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        $logs = $query->paginate(25)->withQueryString();

        // Distinct actions for filter dropdown
        $actions = AuditLog::distinct()->pluck('action')->sort()->values();

        // Distinct users for filter dropdown
        $users = \App\Models\User::select('id', 'name')
            ->whereIn('id', AuditLog::select('user_id')->distinct())
            ->get();

        return Inertia::render('Admin/AuditLog/Index', [
            'logs'    => $logs,
            'actions' => $actions,
            'users'   => $users,
            'filters' => $request->only(['date_from', 'date_to', 'user_id', 'action']),
        ]);
    }
}
