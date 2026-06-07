import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TrackStatus({ proposals }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Direview':
                return 'bg-blue-100 text-blue-800';
            case 'Revisi':
                return 'bg-orange-100 text-orange-800';
            case 'Disetujui':
                return 'bg-green-100 text-green-800';
            case 'Ditolak':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getReviewStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-gray-100 text-gray-800';
            case 'Classified':
                return 'bg-purple-100 text-purple-800';
            case 'Assigned':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tracking Status Pengajuan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Status Pengajuan Ethical Clearance</h2>

                            {proposals.length === 0 ? (
                                <p className="text-gray-500">Anda belum memiliki pengajuan apapun.</p>
                            ) : (
                                <div className="space-y-4">
                                    {proposals.map((proposal) => (
                                        <div
                                            key={proposal.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {proposal.judul}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        No. Pengajuan: {proposal.nomor_pengajuan}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(proposal.status)}`}>
                                                        {proposal.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-sm">
                                                    <p className="text-gray-600">Peneliti</p>
                                                    <p className="font-semibold">{proposal.peneliti}</p>
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-gray-600">Institusi</p>
                                                    <p className="font-semibold">{proposal.institusi}</p>
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-gray-600">Diajukan</p>
                                                    <p className="font-semibold">
                                                        {new Date(proposal.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="text-sm">
                                                    <p className="text-gray-600">Status Review</p>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getReviewStatusColor(proposal.review_status)}`}>
                                                        {proposal.review_status || 'Belum Dimulai'}
                                                    </span>
                                                </div>
                                            </div>

                                            {proposal.review_type && (
                                                <div className="mb-4 text-sm">
                                                    <p className="text-gray-600">Tipe Review: <span className="font-semibold">{proposal.review_type}</span></p>
                                                </div>
                                            )}

                                            {proposal.due_date && (
                                                <div className="text-sm text-gray-600">
                                                    Tenggat Waktu: {new Date(proposal.due_date).toLocaleDateString('id-ID')}
                                                </div>
                                            )}

                                            {proposal.catatan_revisi && (
                                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                                    <p className="text-sm font-semibold text-yellow-800 mb-1">Catatan Revisi:</p>
                                                    <p className="text-sm text-yellow-700">{proposal.catatan_revisi}</p>
                                                </div>
                                            )}

                                            {/* Timeline */}
                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${proposal.status ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs text-gray-600">Pengajuan Masuk</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${['Direview', 'Revisi', 'Disetujui', 'Ditolak'].includes(proposal.status) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs text-gray-600">Verifikasi Administrasi</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${['Direview', 'Disetujui', 'Ditolak'].includes(proposal.status) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs text-gray-600">Review Etika</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${['Disetujui', 'Ditolak'].includes(proposal.status) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs text-gray-600">Keputusan Akhir</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
