import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { ClipboardList, UserCheck, Shield, BookOpen, AlertCircle } from 'lucide-react';

export default function Index({ proposals, sekretariats }) {
    const { flash } = usePage().props;
    const [selectedProposal, setSelectedProposal] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        sekretariat_id: '',
    });

    const handleAssign = (e, proposalId) => {
        e.preventDefault();
        if (!data.sekretariat_id) {
            alert('Silakan pilih Sekretariat terlebih dahulu.');
            return;
        }

        post(route('admin.proposals.assign', proposalId), {
            onSuccess: () => {
                alert('Sekretariat berhasil ditugaskan.');
                setSelectedProposal(null);
                reset();
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengawasan Proposal — Admin" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Alur & Pengawasan Proposal</h2>
                        <p className="text-xs text-gray-500 font-medium">Tugaskan anggota Sekretariat untuk mengawasi alur proposal masuk</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
                    
                    {/* Success/Error Alerts */}
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            <UserCheck className="h-5 w-5 text-emerald-600" />
                            <span className="font-semibold">{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="font-semibold">{flash.error}</span>
                        </div>
                    )}

                    {proposals.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                            <ClipboardList className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                                Tidak ada proposal baru yang menunggu penugasan Sekretariat.
                            </p>
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                Semua proposal masuk telah ditugaskan atau belum diajukan oleh peneliti.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                                    <span>Daftar Proposal Menunggu Penugasan</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Nomor Pengajuan</th>
                                                <th className="px-6 py-4">Judul Penelitian</th>
                                                <th className="px-6 py-4">Peneliti & Institusi</th>
                                                <th className="px-6 py-4">Status Alur</th>
                                                <th className="px-6 py-4 text-center">Tugaskan Sekretariat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
                                            {proposals.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                        {item.nomor_pengajuan || 'BELUM GENERATE'}
                                                    </td>
                                                    <td className="px-6 py-4 max-w-md text-xs font-semibold text-gray-900 dark:text-gray-200">
                                                        <div className="line-clamp-2 leading-relaxed">{item.judul}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs">
                                                        <div className="text-gray-900 dark:text-white font-bold">{item.peneliti}</div>
                                                        <div className="text-gray-400 dark:text-gray-500 font-bold mt-0.5">{item.institusi}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg text-xs font-bold">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {selectedProposal === item.id ? (
                                                            <form onSubmit={(e) => handleAssign(e, item.id)} className="flex items-center justify-center gap-2">
                                                                <select
                                                                    value={data.sekretariat_id}
                                                                    onChange={e => setData('sekretariat_id', e.target.value)}
                                                                    className="rounded-lg border-gray-300 py-1 px-2 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                                    required
                                                                >
                                                                    <option value="">-- Pilih Sekretariat --</option>
                                                                    {sekretariats.map(sekre => (
                                                                        <option key={sekre.id} value={sekre.id}>
                                                                            {sekre.name} ({sekre.email})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    type="submit"
                                                                    disabled={processing}
                                                                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                                >
                                                                    Simpan
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setSelectedProposal(null); reset(); }}
                                                                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg text-xs font-bold transition-all"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </form>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => { setSelectedProposal(item.id); setData('sekretariat_id', ''); }}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 rounded-lg text-xs font-bold transition-all"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                                <span>Tugaskan</span>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
