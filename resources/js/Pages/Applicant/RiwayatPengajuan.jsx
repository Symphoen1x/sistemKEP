import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileText, CheckCircle, Clock, AlertTriangle, XCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function RiwayatPengajuan({ proposals = [] }) {
    const [search, setSearch] = useState('');

    const filtered = proposals.filter(p => 
        p.judul.toLowerCase().includes(search.toLowerCase()) || 
        (p.nomor_pengajuan && p.nomor_pengajuan.toLowerCase().includes(search.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        const styles = {
            'Disetujui': 'bg-green-50 text-green-700 border-green-200',
            'Direview': 'bg-blue-50 text-blue-700 border-blue-200',
            'Revisi': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Ditolak': 'bg-red-50 text-red-700 border-red-200',
            'Pending': 'bg-gray-50 text-gray-700 border-gray-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Pending']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Riwayat Pengajuan Kelaikan Etik" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Riwayat Pengajuan</h2>
                        <p className="text-xs text-gray-500 font-medium">Lacak status, tinjauan reviewer, dan sertifikat kelayakan etik Anda</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Filter and Search */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Cari nomor pengajuan atau judul..."
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor Pengajuan</th>
                                        <th className="px-6 py-4">Judul Penelitian</th>
                                        <th className="px-6 py-4">Subjek & Lokasi</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4">Catatan Sekretariat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {filtered.length > 0 ? (
                                        filtered.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {item.nomor_pengajuan || '-'}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate">
                                                    {item.judul}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <div>{item.subjek_penelitian}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold">{item.lokasi_penelitian}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(item.status)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                                                    {item.catatan_revisi ? (
                                                        <span className="text-yellow-600 italic">"{item.catatan_revisi}"</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                Tidak ada riwayat pengajuan ditemukan.
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
