import { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Badge, { statusVariant, roleVariant } from '@/Components/Badge';
import ConfirmModal from '@/Components/ConfirmModal';
import { Lock } from 'lucide-react';

/**
 * PB10 + PB11 — Admin: Detail pengguna, kelola peran, dan toggle status aktif/nonaktif.
 */
export default function Show({ user, availableRoles }) {
    const { flash } = usePage().props;

    // State untuk modals
    const [toggleModal, setToggleModal]   = useState(false);
    const [removeModal, setRemoveModal]   = useState({ open: false, role: '' });
    const [selectedRole, setSelectedRole] = useState('');

    const statusLabel = { active: 'Aktif', pending: 'Pending', inactive: 'Nonaktif' };
    const isActive = user.status === 'active';

    // --- Toggle Status (PB11) ---
    const handleToggleStatus = () => {
        router.patch(route('admin.users.toggle-status', user.id), {}, {
            preserveScroll: true,
        });
    };

    // --- Tambah Role (PB10) ---
    const { post: postRole, processing: addingRole } = useForm({});

    const handleAddRole = () => {
        if (!selectedRole) return;
        router.patch(route('admin.users.roles', user.id), { action: 'add', role: selectedRole }, {
            preserveScroll: true,
            onSuccess: () => setSelectedRole(''),
        });
    };

    // --- Hapus Role (PB10) ---
    const handleRemoveRole = (role) => {
        router.patch(route('admin.users.roles', user.id), { action: 'remove', role }, {
            preserveScroll: true,
        });
    };

    // --- Ubah Kata Sandi ---
    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.patch(route('admin.users.password', user.id), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title={`${user.name} — Detail Pengguna`} />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-bold"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Manajemen Pengguna
                        </Link>
                        <span className="text-gray-300">/</span>
                        <h2 className="text-xl font-bold text-gray-900">Detail Pengguna</h2>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <svg className="h-5 w-5 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            {flash.error}
                        </div>
                    )}

                    {/* ── Card: Profil Pengguna ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Informasi Profil</h3>
                            <Badge variant={statusVariant(user.status)}>
                                {statusLabel[user.status] ?? user.status}
                            </Badge>
                        </div>

                        <div className="px-6 py-5">
                            {/* Avatar placeholder + nama */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                                    <span className="text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                <div>
                                    <span className="text-gray-400 dark:text-gray-500">No. Telepon</span>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                                        {user.phone_number ?? <span className="text-gray-300 dark:text-gray-600">—</span>}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400 dark:text-gray-500">Tgl. Registrasi</span>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 mt-0.5">{user.created_at}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-400 dark:text-gray-500">Alamat</span>
                                    <p className="font-medium text-gray-700 dark:text-gray-200 mt-0.5">
                                        {user.address ?? <span className="text-gray-300 dark:text-gray-600">—</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card: Kelola Peran (PB10) ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Kelola Peran</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Pengguna harus memiliki minimal satu peran aktif.</p>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {/* Daftar role yang dimiliki */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Peran Saat Ini</p>
                                {user.roles.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">Tidak ada peran.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {user.roles.map((role) => (
                                            <div
                                                key={role}
                                                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700/30"
                                            >
                                                <Badge variant={roleVariant(role)}>{role}</Badge>
                                                <button
                                                    id={`btn-remove-role-${role.replace(/\s+/g, '-').toLowerCase()}`}
                                                    onClick={() => setRemoveModal({ open: true, role })}
                                                    disabled={user.roles.length <= 1}
                                                    title={user.roles.length <= 1 ? 'Tidak dapat menghapus peran terakhir' : `Hapus peran ${role}`}
                                                    className="text-xs font-medium text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tambah role baru */}
                            {availableRoles.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Tambah Peran</p>
                                    <div className="flex gap-2">
                                        <select
                                            id="select-add-role"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="flex-1 rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        >
                                            <option value="">— Pilih peran —</option>
                                            {availableRoles.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <button
                                            id="btn-add-role"
                                            onClick={handleAddRole}
                                            disabled={!selectedRole || addingRole}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Tambah
                                        </button>
                                    </div>
                                </div>
                            )}

                            {availableRoles.length === 0 && (
                                <p className="text-sm text-gray-400 italic dark:text-gray-500">
                                    Pengguna ini sudah memiliki semua peran yang tersedia.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Card: Status Akun (PB11) ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Status Akun</h3>
                        </div>
                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {isActive
                                        ? 'Akun ini aktif dan dapat digunakan untuk login.'
                                        : 'Akun ini dinonaktifkan. Pengguna tidak dapat login saat ini.'}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {isActive ? 'Online / Dapat Login' : 'Offline / Diblokir'}
                                    </span>
                                </div>
                            </div>
                            <button
                                id="btn-toggle-status"
                                onClick={() => setToggleModal(true)}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                    isActive
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                                }`}
                            >
                                {isActive ? (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                        Nonaktifkan Akun
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Aktifkan Akun
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ── Card: Ubah Kata Sandi ── */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                <Lock className="w-5 h-5 text-gray-400" />
                                Ubah Kata Sandi
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Setel kata sandi baru untuk pengguna ini.</p>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Kata Sandi Baru
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    placeholder="Minimal 8 karakter"
                                    autoComplete="new-password"
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Konfirmasi Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    placeholder="Ulangi kata sandi"
                                    autoComplete="new-password"
                                    required
                                />
                                {passwordForm.errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing || !passwordForm.data.password}
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Lock className="w-4 h-4" />
                                    {passwordForm.processing ? 'Menyimpan...' : 'Ubah Kata Sandi'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            {/* Modal: Konfirmasi Toggle Status */}
            <ConfirmModal
                isOpen={toggleModal}
                onClose={() => setToggleModal(false)}
                onConfirm={handleToggleStatus}
                title={isActive ? 'Nonaktifkan Akun?' : 'Aktifkan Akun?'}
                message={
                    isActive
                        ? `Akun ${user.name} akan dinonaktifkan. Pengguna tidak akan bisa login hingga diaktifkan kembali.`
                        : `Akun ${user.name} akan diaktifkan kembali. Pengguna dapat login ke sistem.`
                }
                confirmLabel={isActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
                confirmVariant={isActive ? 'danger' : 'primary'}
            />

            {/* Modal: Konfirmasi Hapus Role */}
            <ConfirmModal
                isOpen={removeModal.open}
                onClose={() => setRemoveModal({ open: false, role: '' })}
                onConfirm={() => handleRemoveRole(removeModal.role)}
                title={`Hapus Peran "${removeModal.role}"?`}
                message={`Peran ${removeModal.role} akan dihapus dari akun ${user.name}. Pastikan pengguna masih memiliki peran lain.`}
                confirmLabel="Ya, Hapus Peran"
                confirmVariant="danger"
            />
        </div>
    );
}
