import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Users, FileText, ShieldCheck, Settings, ClipboardList, FolderOpen, UserPlus, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export default function Dashboard({ stats, usersByRole, proposalsByStatus, recentLogs, monthlyData }) {
    const statCards = [
        { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
        { label: 'Pengguna Aktif', value: stats.activeUsers, icon: ShieldCheck, color: 'bg-green-500' },
        { label: 'Pending Approval', value: stats.pendingUsers, icon: UserPlus, color: 'bg-yellow-500' },
        { label: 'Total Proposal', value: stats.totalProposals, icon: FileText, color: 'bg-indigo-500' },
        { label: 'Amendment', value: stats.amendmentCount, icon: FileText, color: 'bg-purple-500', badge: stats.pendingAmendments > 0 ? stats.pendingAmendments : null },
        { label: 'Terminasi', value: stats.terminationCount, icon: AlertTriangle, color: 'bg-red-500', badge: stats.pendingTerminations > 0 ? stats.pendingTerminations : null },
    ];

    const quickLinks = [
        { label: 'Manajemen Pengguna', route: 'admin.users.index', icon: Users, desc: 'Kelola akun pengguna' },
        { label: 'Alur Proposal', route: 'admin.proposals.index', icon: FileText, desc: 'Assign sekretariat' },
        { label: 'Manajemen Template', route: 'admin.templates.index', icon: FolderOpen, desc: 'Upload & kelola template' },
        { label: 'Konfigurasi Sistem', route: 'admin.config.index', icon: Settings, desc: 'Parameter review & institusi' },
        { label: 'Audit Log', route: 'admin.audit-log.index', icon: ClipboardList, desc: 'Log aktivitas sistem' },
    ];

    const statusColors = {
        'Pending': 'bg-gray-100 text-gray-700',
        'Direview': 'bg-blue-100 text-blue-700',
        'Revisi': 'bg-yellow-100 text-yellow-700',
        'Disetujui': 'bg-green-100 text-green-700',
        'Ditolak': 'bg-red-100 text-red-700',
        'AWR': 'bg-orange-100 text-orange-700',
        'Pending Ketua': 'bg-purple-100 text-purple-700',
    };

    const roleColors = {
        'Admin': 'bg-red-100 text-red-700',
        'Sekretariat': 'bg-blue-100 text-blue-700',
        'Reviewer': 'bg-green-100 text-green-700',
        'Ketua Komisi Etik': 'bg-purple-100 text-purple-700',
        'Applicant': 'bg-yellow-100 text-yellow-700',
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dashboard Admin" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Admin</h2>
                        <p className="text-xs text-gray-500 font-medium">Ringkasan sistem Komisi Etik Penelitian</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {statCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
                                    <div className={`${card.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                        <p className="text-[10px] text-gray-500 font-semibold">{card.label}</p>
                                    </div>
                                    {card.badge && (
                                        <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full w-fit">
                                            {card.badge} pending
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Users by Role */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                Pengguna per Role
                            </div>
                            <div className="p-4 space-y-2">
                                {Object.entries(usersByRole).map(([role, count]) => (
                                    <div key={role} className="flex items-center justify-between">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleColors[role] || 'bg-gray-100 text-gray-700'}`}>
                                            {role}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Proposals by Status */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                Proposal per Status
                            </div>
                            <div className="p-4 space-y-2">
                                {Object.entries(proposalsByStatus).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                                            {status}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monthly Submissions */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                Pengajuan per Bulan
                            </div>
                            <div className="p-4 flex items-end gap-2 h-36">
                                {monthlyData.map((m, idx) => {
                                    const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
                                    const height = Math.max((m.count / maxCount) * 100, 4);
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-gray-500">{m.count}</span>
                                            <div className="w-full bg-blue-500 rounded-t-md" style={{ height: `${height}%` }} />
                                            <span className="text-[10px] text-gray-400 font-semibold">{m.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Audit Logs */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4 text-orange-600" />
                                    Aktivitas Terbaru (Audit Log)
                                </div>
                                <Link href={route('admin.audit-log.index')} className="text-xs text-blue-600 hover:underline font-semibold">
                                    Lihat Semua →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentLogs.length > 0 ? recentLogs.map(log => (
                                    <div key={log.id} className="px-4 py-3 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 truncate">{log.action}</p>
                                            <p className="text-[10px] text-gray-400">{log.user_name} · {log.created_at}</p>
                                        </div>
                                        {log.model_type && (
                                            <span className="text-[10px] text-gray-400 font-mono shrink-0">
                                                {log.model_type.split('\\').pop()}
                                            </span>
                                        )}
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-gray-400 text-xs font-medium">
                                        Belum ada aktivitas tercatat.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-gray-600" />
                                Akses Cepat
                            </div>
                            <div className="p-4 grid grid-cols-1 gap-2">
                                {quickLinks.map((link, idx) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={idx}
                                            href={route(link.route)}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Icon className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">{link.label}</p>
                                                <p className="text-[10px] text-gray-400">{link.desc}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
