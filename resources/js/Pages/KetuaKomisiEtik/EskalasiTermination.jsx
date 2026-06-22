import { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusConfig = {
    Eskalasi: { color: 'bg-red-100 text-red-700', icon: ShieldAlert },
    Approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    Rejected: { color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

export default function EskalasiTermination({ terminations }) {
    const [selectedId, setSelectedId] = useState(null);
    const { post, processing, reset } = useForm({});

    const handleReview = (id, status) => {
        if (!confirm(`Yakin ${status === 'Approved' ? 'menyetujui' : 'menolak'} eskalasi terminasi safety ini?`)) return;
        post(route('ketua.terminations.reviewEskalasi', id), {
            data: { status, notes: '' },
            onSuccess: () => { reset(); setSelectedId(null); },
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Eskalasi Terminasi Safety" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Eskalasi Terminasi (Safety)</h2>
                            <p className="text-xs text-gray-500 font-medium">Peninjauan terminasi terkait keselamatan partisipan</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 w-full max-w-5xl mx-auto space-y-6">
                    {terminations.length === 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                            Tidak ada eskalasi terminasi saat ini.
                        </div>
                    )}

                    {terminations.map((term) => {
                        const sc = statusConfig[term.status] || statusConfig.Eskalasi;
                        const StatusIcon = sc.icon;
                        const isExpanded = selectedId === term.id;

                        return (
                            <div key={term.id} className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                                <button onClick={() => setSelectedId(isExpanded ? null : term.id)}
                                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-red-50/50 transition">
                                    <StatusIcon className={`w-5 h-5 flex-shrink-0 ${sc.color.split(' ')[1]}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {term.protokol?.nomor_pengajuan} — {term.protokol?.judul}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Oleh: {term.user?.name} | Efektif: {new Date(term.effective_date).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                                        {term.status}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-red-100 pt-4 space-y-4">
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

                                        {term.safety_measures && (
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

                                        {/* Actions for Eskalasi */}
                                        {term.status === 'Eskalasi' && (
                                            <div className="flex items-center gap-3 pt-2 border-t border-red-100">
                                                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                    Menunggu keputusan Ketua Komisi Etik
                                                </p>
                                                <div className="ml-auto flex gap-2">
                                                    <button onClick={() => handleReview(term.id, 'Rejected')} disabled={processing}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                        <XCircle className="w-3.5 h-3.5" /> Tolak
                                                    </button>
                                                    <button onClick={() => handleReview(term.id, 'Approved')} disabled={processing}
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Setujui
                                                    </button>
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
