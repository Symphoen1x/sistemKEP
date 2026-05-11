import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function Index({ auth, dataProtokol = [] }) {

    const updateStatus = (id, newStatus) => {
        router.patch(route('protokol.updateStatus', id), {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => alert('Status berhasil diperbarui!'),
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar tetap di sisi kiri */}
            <Sidebar />

            {/* Konten utama dengan margin kiri agar tidak tertutup sidebar */}
            <div className="flex-1 ml-64">
                    <Head title="Dashboard" />

                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Judul</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Peneliti</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dataProtokol.length > 0 ? (
                                            dataProtokol.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm">{item.judul}</td>
                                                    <td className="px-6 py-4 text-sm">{item.peneliti}</td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => updateStatus(item.id, e.target.value)}
                                                            className="rounded border-gray-300 text-sm focus:ring-purple-500"
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Proses">Proses</option>
                                                            <option value="Disetujui">Disetujui</option>
                                                            <option value="Ditolak">Ditolak</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                                    Data belum ada. Silakan jalankan seeder.
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
