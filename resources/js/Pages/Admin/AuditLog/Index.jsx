import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { ClipboardList, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const actionLabels = {
    decision_made:        { label: 'Keputusan Dibuat',       color: 'bg-blue-100 text-blue-700' },
    decision_made_ketua:  { label: 'Keputusan Ketua',        color: 'bg-indigo-100 text-indigo-700' },
    reviewer_assigned:    { label: 'Reviewer Ditugaskan',    color: 'bg-purple-100 text-purple-700' },
    verification_revisi:  { label: 'Revisi Diajukan',        color: 'bg-yellow-100 text-yellow-700' },
    surat_signed:         { label: 'Surat Ditandatangani',   color: 'bg-green-100 text-green-700' },
    user_approved:        { label: 'Pengguna Disetujui',     color: 'bg-emerald-100 text-emerald-700' },
    user_rejected:        { label: 'Pengguna Ditolak',       color: 'bg-red-100 text-red-700' },
    role_changed:         { label: 'Role Diubah',            color: 'bg-orange-100 text-orange-700' },
};

export default function Index({ logs, actions, users, filters }) {
    const [dateFrom, setDateFrom]   = useState(filters?.date_from || '');
    const [dateTo, setDateTo]       = useState(filters?.date_to   || '');
    const [userId, setUserId]       = useState(filters?.user_id   || '');
    const [action, setAction]       = useState(filters?.action    || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.audit-log.index'), {
            date_from: dateFrom || undefined,
            date_to:   dateTo   || undefined,
            user_id:   userId   || undefined,
            action:    action   || undefined,
        }, { preserveState: true });
    };

    const handleReset = () => {
        setDateFrom(''); setDateTo(''); setUserId(''); setAction('');
        router.get(route('admin.audit-log.index'), {}, { preserveState: true });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Audit Log" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-6 h-6 text-gray-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Audit Log</h2>
                            <p className="text-xs text-gray-500 font-medium">Riwayat aktivitas sistem</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 w-full max-w-7xl mx-auto space-y-6">

                    {/* Filter Form */}
                    <form onSubmit={handleFilter} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Filter</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Pengguna</label>
                                <select value={userId} onChange={e => setUserId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Semua</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Jenis Aksi</label>
                                <select value={action} onChange={e => setAction(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Semua</option>
                                    {actions.map(a => <option key={a} value={a}>{actionLabels[a]?.label || a}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <button type="submit"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
                                    <Search className="w-3.5 h-3.5" /> Cari
                                </button>
                                <button type="button" onClick={handleReset}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl transition">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Waktu</th>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Pengguna</th>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Aksi</th>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Model</th>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">IP</th>
                                        <th className="px-5 py-3 text-left font-semibold text-gray-600">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-10 text-center text-gray-400">Tidak ada log ditemukan.</td>
                                        </tr>
                                    )}
                                    {logs.data.map((log) => {
                                        const meta = actionLabels[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-700' };
                                        return (
                                            <tr key={log.id} className="hover:bg-gray-50 transition">
                                                <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                                                    {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-800">
                                                    {log.user?.name ?? '-'}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                                                    {log.model_type ? `${log.model_type.split('\\').pop()} #${log.model_id}` : '-'}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-400">{log.ip_address ?? '-'}</td>
                                                <td className="px-5 py-3 text-xs text-gray-500 max-w-xs truncate">
                                                    {log.new_values ? JSON.stringify(log.new_values).slice(0, 80) : '-'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {logs.links.length > 3 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Menampilkan {logs.from ?? 0}–{logs.to ?? 0} dari {logs.total} log
                                </p>
                                <div className="flex gap-1">
                                    {logs.links.map((link, i) => {
                                        if (i === 0) return (
                                            <a key={i} href={link.url || '#'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}>
                                                <ChevronLeft className="w-3.5 h-3.5 inline" />
                                            </a>
                                        );
                                        if (i === logs.links.length - 1) return (
                                            <a key={i} href={link.url || '#'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${link.active ? 'bg-blue-600 text-white' : link.url ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}>
                                                <ChevronRight className="w-3.5 h-3.5 inline" />
                                            </a>
                                        );
                                        return (
                                            <a key={i} href={link.url || '#'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                {link.label}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
