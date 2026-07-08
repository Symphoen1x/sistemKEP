import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Check, X, User } from 'lucide-react';
import { useState } from 'react';

export default function PendingUsers({ pendingUsers = [] }) {
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = (userId, role) => {
        if (!confirm(`Setujui pengguna ini sebagai ${role}?`)) return;
        setProcessingId(userId);
        router.post(route('admin.users.approve', userId), { role }, {
            onFinish: () => setProcessingId(null),
            onSuccess: () => alert('Pengguna berhasil disetujui.')
        });
    };

    const handleReject = (userId) => {
        if (!confirm('Tolak pendaftaran akun ini?')) return;
        setProcessingId(userId);
        router.post(route('admin.users.reject', userId), {}, {
            onFinish: () => setProcessingId(null),
            onSuccess: () => alert('Pengguna berhasil ditolak.')
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Verifikasi Pendaftaran Pengguna Baru" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Verifikasi Pendaftar Baru</h2>
                        <p className="text-xs text-gray-500 font-medium">Verifikasi dan aktifkan akun peneliti yang baru mendaftar</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                            Antrian Persetujuan Akun
                        </div>
                        <div className="overflow-x-auto text-xs font-semibold">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Nama Lengkap</th>
                                        <th scope="col" className="px-6 py-4">Email</th>
                                        <th scope="col" className="px-6 py-4">Telepon</th>
                                        <th scope="col" className="px-6 py-4">Waktu Daftar</th>
                                        <th scope="col" className="px-6 py-4 text-center">Tindakan Persetujuan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {pendingUsers.length > 0 ? (
                                        pendingUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {user.phone_number || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex gap-2 text-xs font-bold justify-center">
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleApprove(user.id, 'Applicant')}
                                                            disabled={processingId === user.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-500/10 disabled:opacity-50"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            <span>Setujui Peneliti</span>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleReject(user.id)}
                                                            disabled={processingId === user.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200/50 transition-all disabled:opacity-50"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            <span>Tolak</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <User className="w-8 h-8 text-gray-300" />
                                                    <p className="font-bold text-gray-900 text-sm">Tidak Ada Antrian</p>
                                                    <p className="text-xs text-gray-400">Saat ini tidak ada pendaftar baru yang menunggu persetujuan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
