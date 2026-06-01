import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Badge from '@/Components/Badge';

export default function RiwayatReview({ proposals = [] }) {
    const statusVariant = (status) => {
        if (status === 'Disetujui') return 'success';
        if (status === 'Revisi') return 'warning';
        return 'danger';
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Riwayat Penelaahan Etik - Reviewer" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Riwayat Penelaahan</h2>
                        <p className="text-xs text-gray-500 font-medium">Rekam jejak berkas usulan kelayakan etik yang telah Anda telaah</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                            Berkas Penelitian Selesai Ditelaah
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor</th>
                                        <th className="px-6 py-4">Judul Penelitian</th>
                                        <th className="px-6 py-4">Pengusul</th>
                                        <th className="px-6 py-4">Status Hasil</th>
                                        <th className="px-6 py-4">Tanggal Review</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-semibold text-xs text-gray-700">
                                    {proposals.length > 0 ? (
                                        proposals.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-blue-600">
                                                    {item.nomor_pengajuan}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate font-bold text-gray-900">
                                                    {item.judul}
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {item.peneliti}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 font-medium">
                                                    {new Date(item.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                                Belum ada riwayat penelaahan usulan yang tercatat.
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
