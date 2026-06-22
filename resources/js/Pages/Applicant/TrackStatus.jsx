import Sidebar from '@/Components/Sidebar';
import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Upload } from 'lucide-react';

export default function TrackStatus({ proposals }) {
    const getStatusConfig = (status) => {
        const map = {
            'Pending Admin':  { color: 'bg-gray-100 text-gray-700',    label: 'Menunggu Admin' },
            'Pending':        { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu Verifikasi' },
            'Direview':       { color: 'bg-blue-100 text-blue-800',     label: 'Sedang Direview' },
            'Revisi':         { color: 'bg-orange-100 text-orange-800', label: 'Perlu Revisi' },
            'AWR':            { color: 'bg-cyan-100 text-cyan-800',     label: 'Disetujui + Rekomendasi' },
            'Disetujui':      { color: 'bg-green-100 text-green-800',   label: 'Disetujui' },
            'Ditolak':        { color: 'bg-red-100 text-red-800',       label: 'Ditolak' },
            'Pending Surat':  { color: 'bg-purple-100 text-purple-800', label: 'Menunggu Surat' },
            'Pending Ketua':  { color: 'bg-indigo-100 text-indigo-800', label: 'Menunggu Ketua' },
            'Direvisi':       { color: 'bg-teal-100 text-teal-800',     label: 'Revisi Terkirim' },
        };
        return map[status] || { color: 'bg-gray-100 text-gray-700', label: status };
    };

    const getReviewStatusColor = (status) => {
        const map = {
            'Pending':    'bg-gray-100 text-gray-700',
            'Classified': 'bg-purple-100 text-purple-700',
            'Assigned':   'bg-blue-100 text-blue-700',
            'Completed':  'bg-green-100 text-green-700',
        };
        return map[status] || 'bg-gray-100 text-gray-700';
    };

    const timelineSteps = [
        { label: 'Pengajuan Masuk', statuses: ['Pending Admin', 'Pending', 'Direview', 'Revisi', 'AWR', 'Disetujui', 'Ditolak', 'Pending Surat', 'Pending Ketua', 'Direvisi'] },
        { label: 'Verifikasi Administrasi', statuses: ['Direview', 'Revisi', 'AWR', 'Disetujui', 'Ditolak', 'Pending Surat', 'Pending Ketua', 'Direvisi'] },
        { label: 'Review Etika', statuses: ['AWR', 'Disetujui', 'Ditolak', 'Pending Surat', 'Pending Ketua'] },
        { label: 'Keputusan Akhir', statuses: ['Disetujui', 'Ditolak', 'AWR'] },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Tracking Status Pengajuan" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Tracking Status Pengajuan</h2>
                        <p className="text-xs text-gray-500 font-medium">Pantau progress pengajuan Ethical Clearance Anda</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-5 max-w-5xl w-full mx-auto">
                    {proposals.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg font-medium">Belum ada pengajuan.</p>
                            <p className="text-gray-400 text-sm mt-2">Mulai ajukan proposal Ethical Clearance Anda.</p>
                        </div>
                    ) : (
                        proposals.map((proposal) => {
                            const statusCfg = getStatusConfig(proposal.status);
                            const canRevisi = ['Revisi', 'AWR'].includes(proposal.status);

                            return (
                                <div key={proposal.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 pr-4">
                                            <h3 className="text-base font-bold text-gray-900">{proposal.judul}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">No. Pengajuan: <span className="font-semibold text-gray-700">{proposal.nomor_pengajuan}</span></p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${statusCfg.color}`}>
                                            {statusCfg.label}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Peneliti</p>
                                            <p className="font-semibold text-gray-900 text-sm">{proposal.peneliti}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Institusi</p>
                                            <p className="font-semibold text-gray-900 text-sm">{proposal.institusi}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Tgl Diajukan</p>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {new Date(proposal.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Status Review</p>
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getReviewStatusColor(proposal.review_status)}`}>
                                                {proposal.review_status || 'Belum Dimulai'}
                                            </span>
                                        </div>
                                    </div>

                                    {proposal.review_type && (
                                        <div className="mb-3">
                                            <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                                                proposal.review_type === 'Full Board'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : proposal.review_type === 'Expedited'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                Tipe Review: {proposal.review_type}
                                            </span>
                                        </div>
                                    )}

                                    {/* Catatan Revisi */}
                                    {proposal.catatan_revisi && (
                                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                                            <p className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> Catatan Revisi dari Sekretariat
                                            </p>
                                            <p className="text-sm text-orange-700">{proposal.catatan_revisi}</p>
                                        </div>
                                    )}

                                    {/* Feedback Applicant dari Keputusan (AWR/Resubmission) */}
                                    {proposal.decision?.feedback_applicant && (
                                        <div className={`mb-4 p-4 rounded-xl border ${
                                            proposal.status === 'AWR'
                                                ? 'bg-cyan-50 border-cyan-200'
                                                : 'bg-orange-50 border-orange-200'
                                        }`}>
                                            <p className={`text-xs font-bold mb-2 flex items-center gap-1 ${
                                                proposal.status === 'AWR' ? 'text-cyan-800' : 'text-orange-800'
                                            }`}>
                                                {proposal.status === 'AWR'
                                                    ? <><CheckCircle className="w-3.5 h-3.5" /> Rekomendasi dari Komisi Etik</>
                                                    : <><RefreshCw className="w-3.5 h-3.5" /> Instruksi Perbaikan dari Komisi Etik</>
                                                }
                                            </p>
                                            <p className={`text-sm ${proposal.status === 'AWR' ? 'text-cyan-700' : 'text-orange-700'}`}>
                                                {proposal.decision.feedback_applicant}
                                            </p>
                                        </div>
                                    )}

                                    {/* Tombol Upload Revisi */}
                                    {canRevisi && (
                                        <div className="mb-4">
                                            <Link
                                                href={route('applicant.revisi.form', proposal.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Unggah Perbaikan
                                            </Link>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                        {timelineSteps.map((step, idx) => {
                                            const isActive = step.statuses.includes(proposal.status);
                                            return (
                                                <div key={idx} className="flex items-center gap-2 flex-1">
                                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                                    <span className={`text-[10px] font-medium ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                    {idx < timelineSteps.length - 1 && (
                                                        <div className={`flex-1 h-px ${isActive ? 'bg-blue-200' : 'bg-gray-200'}`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
