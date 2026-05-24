import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { Check, X, User } from 'lucide-react';
import { useState } from 'react';

export default function PendingUsers({ pendingUsers }) {
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = (userId, role) => {
        if (!confirm(`Setujui pengguna ini sebagai ${role}?`)) return;
        setProcessingId(userId);
        router.post(route('sekretariat.users.approve', userId), { role }, {
            onFinish: () => setProcessingId(null)
        });
    };

    const handleReject = (userId) => {
        if (!confirm('Tolak pendaftaran akun ini?')) return;
        setProcessingId(userId);
        router.post(route('sekretariat.users.reject', userId), {}, {
            onFinish: () => setProcessingId(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Verifikasi Pendaftar Baru
                </h2>
            }
        >
            <Head title="Verifikasi Pengguna" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {pendingUsers.length === 0 ? (
                                <div className="text-center py-12">
                                    <User className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Tidak Ada Pendaftar</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saat ini tidak ada antrian pendaftar yang perlu diverifikasi.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                                                <th scope="col" className="px-6 py-3">Email</th>
                                                <th scope="col" className="px-6 py-3">Telepon</th>
                                                <th scope="col" className="px-6 py-3">Waktu Daftar</th>
                                                <th scope="col" className="px-6 py-3">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingUsers.map((user) => (
                                                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.phone_number || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        <button 
                                                            onClick={() => handleApprove(user.id, 'Applicant')}
                                                            disabled={processingId === user.id}
                                                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                                                        >
                                                            <Check className="w-4 h-4" /> Applicant
                                                        </button>
                                                        <button 
                                                            onClick={() => handleApprove(user.id, 'Reviewer')}
                                                            disabled={processingId === user.id}
                                                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 disabled:opacity-50"
                                                        >
                                                            <Check className="w-4 h-4" /> Reviewer
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(user.id)}
                                                            disabled={processingId === user.id}
                                                            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                                                        >
                                                            <X className="w-4 h-4" /> Tolak
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
