import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileEdit, CheckCircle, XCircle, Clock, AlertCircle, Filter, UserCheck, ShieldCheck } from 'lucide-react';

const statusConfig = {
    Pending:  { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    Approved: { color: 'bg-green-100 text-green-700',   icon: CheckCircle },
    Rejected: { color: 'bg-red-100 text-red-700',       icon: XCircle },
};

const typeConfig = {
    Minor: 'bg-blue-100 text-blue-700',
    Major: 'bg-purple-100 text-purple-700',
};

export default function ReviewAmendment({ amendments, reviewers = [] }) {
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const [processing, setProcessing] = useState(false);

    const filtered = filter === 'all' ? amendments : amendments.filter(a => a.status === filter);

    const handleDecide = (id, status) => {
        if (!confirm(`Yakin ${status === 'Approved' ? 'menyetujui' : 'menolak'} amendment ini?`)) return;
        router.post(route('sekretariat.amendments.decide', id), { status, notes: '' }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setSelectedId(null),
        });
    };

    const handleClassify = (id, type) => {
        router.post(route('sekretariat.amendments.classify', id), { type }, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const handleAssignReviewer = (id) => {
        if (!selectedReviewer) {
            alert('Pilih reviewer terlebih dahulu.');
            return;
        }
        router.post(route('sekretariat.amendments.assignReviewer', id), { reviewer_id: selectedReviewer }, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setSelectedReviewer(''),
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Review Amendment" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <FileEdit className="w-6 h-6 text-gray-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Review Amendment</h2>
                            <p className="text-xs text-gray-500 font-medium">Kelola pengajuan perubahan protokol</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 w-full max-w-5xl mx-auto space-y-6">
                    {/* Filter tabs */}
                    <div className="flex gap-2">
                        {['all', 'Pending', 'Approved', 'Rejected'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                                    filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}>
                                {f === 'all' ? 'Semua' : f} ({f === 'all' ? amendments.length : amendments.filter(a => a.status === f).length})
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    {filtered.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                            Tidak ada amendment ditemukan.
                        </div>
                    )}

                    {filtered.map((amendment) => {
                        const sc = statusConfig[amendment.status] || statusConfig.Pending;
                        const StatusIcon = sc.icon;
                        const isExpanded = selectedId === amendment.id;
                        const isMajor = amendment.type === 'Major';
                        const isPending = amendment.status === 'Pending';
                        const hasReviewer = amendment.reviewer_id && amendment.reviewer;
                        const reviewCompleted = amendment.review_status === 'Completed';
                        const reviewAssigned = amendment.review_status === 'Assigned';

                        return (
                            <div key={amendment.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Header row */}
                                <button onClick={() => setSelectedId(isExpanded ? null : amendment.id)}
                                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition">
                                    <StatusIcon className={`w-5 h-5 flex-shrink-0 ${sc.color.split(' ')[1]}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {amendment.protokol?.nomor_pengajuan} — {amendment.protokol?.judul}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Oleh: {amendment.user?.name} | {new Date(amendment.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${typeConfig[amendment.type]}`}>
                                        {amendment.type}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                        {amendment.status}
                                    </span>
                                </button>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Deskripsi Perubahan</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-line">{amendment.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Alasan</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-line">{amendment.reason}</p>
                                            </div>
                                        </div>

                                        {amendment.documents?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 mb-2">Dokumen Pendukung</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {amendment.documents.map(doc => (
                                                        <a key={doc.id} href={doc.file_path} target="_blank"
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition">
                                                            {doc.document_type}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {amendment.notes && (
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Catatan Keputusan</p>
                                                <p className="text-sm text-gray-700">{amendment.notes}</p>
                                            </div>
                                        )}

                                        {/* PB39: Major Amendment — Reviewer Assignment */}
                                        {isMajor && isPending && (
                                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 space-y-3">
                                                <p className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Major Amendment — Perlu Review oleh Reviewer
                                                </p>

                                                {hasReviewer ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-purple-200">
                                                            <UserCheck className="w-4 h-4 text-purple-600" />
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    Reviewer: {amendment.reviewer?.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Status: {amendment.review_status || 'Belum ditugaskan'}
                                                                    {amendment.reviewer_recommendation && (
                                                                        <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                            amendment.reviewer_recommendation === 'Approved' ? 'bg-green-100 text-green-700' :
                                                                            amendment.reviewer_recommendation === 'Conditionally Approved' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-red-100 text-red-700'
                                                                        }`}>
                                                                            {amendment.reviewer_recommendation}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {reviewCompleted && amendment.review_feedback && (
                                                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                                                                <p className="text-xs font-bold text-purple-700 mb-1">Feedback Reviewer:</p>
                                                                <p className="text-sm text-gray-700 whitespace-pre-line">{amendment.review_feedback}</p>
                                                            </div>
                                                        )}

                                                        {reviewAssigned && (
                                                            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Menunggu reviewer menyelesaikan review.
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <select
                                                            value={selectedReviewer}
                                                            onChange={(e) => setSelectedReviewer(e.target.value)}
                                                            className="flex-1 rounded-xl border-purple-200 text-sm focus:ring-purple-500 focus:border-purple-500"
                                                        >
                                                            <option value="">— Pilih Reviewer —</option>
                                                            {reviewers.map(r => (
                                                                <option key={r.id} value={r.id}>
                                                                    {r.name}{r.expertise ? ` (${r.expertise})` : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAssignReviewer(amendment.id)}
                                                            disabled={processing || !selectedReviewer}
                                                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
                                                        >
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            Tugaskan
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions for Pending */}
                                        {isPending && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleClassify(amendment.id, 'Minor')}
                                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition">
                                                        Set Minor
                                                    </button>
                                                    <button onClick={() => handleClassify(amendment.id, 'Major')}
                                                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-200 transition">
                                                        Set Major
                                                    </button>
                                                </div>
                                                <div className="ml-auto flex gap-2">
                                                    {/* For Major: only show Decide buttons if reviewer completed or not assigned to reviewer */}
                                                    {(!isMajor || reviewCompleted || !hasReviewer) && (
                                                        <>
                                                            <button onClick={() => handleDecide(amendment.id, 'Rejected')} disabled={processing}
                                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                                <XCircle className="w-3.5 h-3.5" /> Tolak
                                                            </button>
                                                            <button onClick={() => handleDecide(amendment.id, 'Approved')} disabled={processing}
                                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                                <CheckCircle className="w-3.5 h-3.5" /> Setujui
                                                            </button>
                                                        </>
                                                    )}
                                                    {isMajor && hasReviewer && !reviewCompleted && (
                                                        <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Menunggu Review
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
