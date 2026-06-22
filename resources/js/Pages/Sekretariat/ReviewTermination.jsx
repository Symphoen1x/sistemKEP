import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { ShieldOff, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

const statusConfig = {
    Pending:  { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    Eskalasi: { color: 'bg-red-100 text-red-700',       icon: ShieldAlert },
    Approved: { color: 'bg-green-100 text-green-700',   icon: CheckCircle },
    Rejected: { color: 'bg-gray-100 text-gray-700',     icon: XCircle },
};

const reasonColors = {
    'Safety':        'bg-red-100 text-red-700',
    'Non-Safety':    'bg-blue-100 text-blue-700',
    'Administrative': 'bg-purple-100 text-purple-700',
};

export default function ReviewTermination({ terminations }) {
    const [selectedId, setSelectedId] = useState(null);
    const [filter, setFilter] = useState('all');
    const { post, processing, reset } = useForm({ status: '', notes: '' });

    const filtered = filter === 'all' ? terminations : terminations.filter(t => t.status === filter);

    const handleFinalize = (id, status) => {
        if (!confirm(`Yakin ${status === 'Approved' ? 'menyetujui' : 'menolak'} terminasi ini?`)) return;
        post(route('sekretariat.terminations.finalize', id), {
            data: { status, notes: '' },
            onSuccess: () => { reset(); setSelectedId(null); },
        });
    };

    const handleClassify = (id, category) => {
        post(route('sekretariat.terminations.classify', id), {
            data: { reason_category: category },
            preserveScroll: true,
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Review Terminasi" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <ShieldOff className="w-6 h-6 text-gray-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Review Terminasi</h2>
                            <p className="text-xs text-gray-500 font-medium">Kelola pengajuan terminasi protokol penelitian</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 w-full max-w-5xl mx-auto space-y-6">
                    {/* Filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'Pending', 'Eskalasi', 'Approved', 'Rejected'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                                    filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}>
                                {f === 'all' ? 'Semua' : f} ({f === 'all' ? terminations.length : terminations.filter(t => t.status === f).length})
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                            Tidak ada terminasi ditemukan.
                        </div>
                    )}

                    {filtered.map((term) => {
                        const sc = statusConfig[term.status] || statusConfig.Pending;
                        const StatusIcon = sc.icon;
                        const isExpanded = selectedId === term.id;

                        return (
                            <div key={term.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <button onClick={() => setSelectedId(isExpanded ? null : term.id)}
                                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition">
                                    <StatusIcon className={`w-5 h-5 flex-shrink-0 ${sc.color.split(' ')[1]}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {term.protokol?.nomor_pengajuan} — {term.protokol?.judul}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Oleh: {term.user?.name} | Efektif: {new Date(term.effective_date).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${reasonColors[term.reason_category] || 'bg-gray-100 text-gray-600'}`}>
                                        {term.reason_category}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                        {term.status}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Deskripsi</p>
                                                <p className="text-sm text-gray-700 whitespace-pre-line">{term.description}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Status Partisipan</p>
                                                <p className="text-sm text-gray-700">{term.participant_status || '-'}</p>
                                            </div>
                                        </div>

                                        {term.is_safety_related && term.safety_measures && (
                                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                                    <ShieldAlert className="w-3.5 h-3.5" /> Tindakan Keselamatan
                                                </p>
                                                <p className="text-sm text-red-700 whitespace-pre-line">{term.safety_measures}</p>
                                            </div>
                                        )}

                                        {term.notes && (
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="text-xs font-semibold text-gray-500 mb-1">Catatan</p>
                                                <p className="text-sm text-gray-700">{term.notes}</p>
                                            </div>
                                        )}

                                        {/* Actions for Pending (non-eskalasi) */}
                                        {term.status === 'Pending' && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                                                <div className="flex gap-2">
                                                    {['Safety', 'Non-Safety', 'Administrative'].map(cat => (
                                                        <button key={cat} onClick={() => handleClassify(term.id, cat)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${reasonColors[cat]} hover:opacity-80`}>
                                                            Set {cat}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="ml-auto flex gap-2">
                                                    <button onClick={() => handleFinalize(term.id, 'Rejected')} disabled={processing}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                        <XCircle className="w-3.5 h-3.5" /> Tolak
                                                    </button>
                                                    <button onClick={() => handleFinalize(term.id, 'Approved')} disabled={processing}
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Setujui
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {term.status === 'Eskalasi' && (
                                            <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-sm text-red-700 font-medium">
                                                Terminasi ini telah dieskalasi ke Ketua Komisi Etik untuk peninjauan.
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
