import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PengambilanKeputusan({ proposals }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [selectedId, setSelectedId] = useState(null);
    const { data, setData, post, processing } = useForm({
        status: 'Approved',
        notes: '',
    });

    const selected = proposals.find(p => p.id === selectedId);

    const handleDecision = (e, proposalId) => {
        e.preventDefault();
        if (!data.notes.trim()) {
            alert('Silakan tulis catatan untuk keputusan ini.');
            return;
        }
        if (confirm('Simpan keputusan ini?')) {
            post(route('sekretariat.makeDecision', proposalId), {
                onSuccess: () => {
                    setSelectedId(null);
                    setData({ status: 'Approved', notes: '' });
                }
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengambilan Keputusan" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Pengambilan Keputusan Akhir</h2>
                        <p className="text-xs text-gray-500 font-medium">Lakukan keputusan akhir atas proposal etika</p>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {proposals.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <p className="text-gray-500 text-lg">
                                Tidak ada proposal yang siap untuk pengambilan keputusan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Proposal List */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Daftar Proposal</h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {proposals.map((proposal) => (
                                            <button
                                                key={proposal.id}
                                                onClick={() => setSelectedId(proposal.id)}
                                                className={`w-full text-left p-3 rounded-xl border transition ${
                                                    selectedId === proposal.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {proposal.nomor_pengajuan}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {proposal.judul}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {proposal.peneliti}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Detail & Decision Form */}
                            {selected && (
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Proposal Summary */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                        <h3 className="font-semibold text-lg mb-3 text-gray-900">{selected.judul}</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 font-medium">Peneliti</p>
                                                <p className="font-semibold text-gray-900">{selected.peneliti}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">Institusi</p>
                                                <p className="font-semibold text-gray-900">{selected.institusi}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">No. Pengajuan</p>
                                                <p className="font-semibold text-gray-900">{selected.nomor_pengajuan}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">Tipe Review</p>
                                                <p className="font-semibold text-gray-900">{selected.review_type || 'Full Board'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews Summary */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Ringkasan Review</h4>
                                        {selected.reviews && selected.reviews.length > 0 ? (
                                            <div className="space-y-3">
                                                {selected.reviews.map((review, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <p className="font-semibold text-sm text-gray-900">
                                                                {review.reviewer?.name || 'Reviewer'}
                                                            </p>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                                review.recommendation === 'Approved'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : review.recommendation === 'Conditionally Approved'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {review.recommendation}
                                                            </span>
                                                        </div>
                                                        {review.feedback && (
                                                            <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-3 mt-3">
                                                                "{review.feedback.substring(0, 100)}..."
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center py-4">Belum ada review</p>
                                        )}
                                    </div>

                                    {/* Decision Form */}
                                    <form onSubmit={(e) => handleDecision(e, selected.id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                        <h4 className="font-semibold text-lg text-gray-900">Buat Keputusan Akhir</h4>

                                        <div className="space-y-3">
                                            <label className="flex items-center p-4 border-2 border-green-200 rounded-xl cursor-pointer hover:bg-green-50 transition bg-green-50"
                                                onClick={() => setData('status', 'Approved')}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Approved"
                                                    checked={data.status === 'Approved'}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="mr-3 w-4 h-4"
                                                />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900">Disetujui</p>
                                                        <p className="text-xs text-gray-600">Proposal diterima dan layak etik</p>
                                                    </div>
                                                </div>
                                            </label>

                                            <label className="flex items-center p-4 border-2 border-red-200 rounded-xl cursor-pointer hover:bg-red-50 transition"
                                                onClick={() => setData('status', 'Rejected')}
                                            >
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Rejected"
                                                    checked={data.status === 'Rejected'}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                    className="mr-3 w-4 h-4"
                                                />
                                                <div className="flex items-center gap-3 flex-1">
                                                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900">Ditolak</p>
                                                        <p className="text-xs text-gray-600">Proposal tidak layak etik</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Catatan Keputusan (Wajib)
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows="5"
                                                className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Jelaskan alasan keputusan akhir Anda..."
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition ${
                                                data.status === 'Approved'
                                                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                                                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {processing ? 'Menyimpan Keputusan...' : 'Simpan Keputusan Akhir'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
