import { useState, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge, { statusVariant, roleVariant } from '@/Components/Badge';

/**
 * PB08 — Admin: Daftar semua pengguna sistem dengan filter, search, dan pagination.
 */
export default function Index({ users, filters }) {
    const { flash } = usePage().props;

    const [search, setSearch]   = useState(filters?.search ?? '');
    const [status, setStatus]   = useState(filters?.status ?? '');
    const [role, setRole]       = useState(filters?.role ?? '');
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Kirim filter ke server dengan debounce 400ms untuk search
    const applyFilters = useCallback((newFilters) => {
        router.get(route('admin.users.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    }, []);

    const handleSearch = (value) => {
        setSearch(value);
        if (debounceTimer) clearTimeout(debounceTimer);
        const timer = setTimeout(() => {
            applyFilters({ search: value, status, role });
        }, 400);
        setDebounceTimer(timer);
    };

    const handleFilterChange = (key, value) => {
        const updated = { search, status, role, [key]: value };
        if (key === 'status') setStatus(value);
        if (key === 'role') setRole(value);
        applyFilters(updated);
    };

    const resetFilters = () => {
        setSearch(''); setStatus(''); setRole('');
        applyFilters({});
    };

    const statusLabel = { active: 'Aktif', pending: 'Pending', inactive: 'Nonaktif' };
    const roles = ['Applicant', 'Reviewer', 'Sekretariat', 'Ketua Komisi Etik', 'Admin'];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Manajemen Pengguna
                        </h2>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            Kelola semua akun pengguna sistem KEP
                        </p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        id="btn-create-user"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Buat Akun Internal
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Pengguna — Admin" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <svg className="h-5 w-5 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {flash.error}
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex flex-wrap gap-3">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px]">
                                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    id="filter-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Cari nama atau email..."
                                    className="w-full rounded-lg border-gray-300 py-2 pl-9 pr-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                                />
                            </div>

                            {/* Filter Status */}
                            <select
                                id="filter-status"
                                value={status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="rounded-lg border-gray-300 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="pending">Pending</option>
                                <option value="inactive">Nonaktif</option>
                            </select>

                            {/* Filter Role */}
                            <select
                                id="filter-role"
                                value={role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="rounded-lg border-gray-300 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="">Semua Peran</option>
                                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>

                            {/* Reset */}
                            {(search || status || role) && (
                                <button
                                    id="btn-reset-filters"
                                    onClick={resetFilters}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        {['Nama', 'Email', 'Peran', 'Status', 'Tgl. Daftar', 'Aksi'].map((h) => (
                                            <th
                                                key={h}
                                                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                                                <svg className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                                Tidak ada pengguna yang sesuai filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.length === 0
                                                            ? <span className="text-xs text-gray-400">—</span>
                                                            : user.roles.map((r) => (
                                                                <Badge key={r} variant={roleVariant(r)}>{r}</Badge>
                                                            ))
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <Badge variant={statusVariant(user.status)}>
                                                        {statusLabel[user.status] ?? user.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {user.created_at}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <Link
                                                        href={route('admin.users.show', user.id)}
                                                        id={`btn-detail-user-${user.id}`}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-700/30">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan {users.from}–{users.to} dari {users.total} pengguna
                                </p>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        <button
                                            key={i}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`min-w-[32px] rounded px-2.5 py-1 text-sm transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white font-semibold'
                                                    : link.url
                                                        ? 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                                                        : 'cursor-default text-gray-300 dark:text-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
