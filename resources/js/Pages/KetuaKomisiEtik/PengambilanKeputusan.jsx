import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function PengambilanKeputusan({ proposals }) {
    const [selectedId, setSelectedId] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        status: 'Approved',
        notes: '',
        feedback_applicant: '',
    });

    const selected = proposals.find(p => p.id === selectedId);
    const needsFeedback = ['AWR', 'Resubmission'].includes(data.status);

    const handleDecision = (e, proposalId) => {
        e.preventDefault();
        if (!data.notes.trim()) {
            alert('Silakan tulis catatan keputusan.');
            return;
        }
        if (confirm('Simpan keputusan akhir ini? Tindakan ini tidak dapat diubah.')) {
            post(route('ketua.makeDecision', proposalId), {
                onSuccess: () => {
                    setSelectedId(null);
                    setData({ status: 'Approved', notes: '', feedback_applicant: '' });
                }
            });
        }
    };

    const decisionOptions = [
        {
            value: 'Approved',
            label: 'Disetujui',
            desc: 'Proposal layak etik — sertifikat akan diterbitkan',
            icon: CheckCircle2,
            active: 'border-green-500 bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            value: 'AWR',
            label: 'Disetujui dengan Rekomendasi (AWR)',
            desc: 'Disetujui namun ada rekomendasi perbaikan untuk Applicant',
            icon: AlertCircle,
            active: 'border-yellow-500 bg-yellow-50',
            iconColor: 'text-yellow-600',
        },
        {
            value: 'Resubmission',
            label: 'Resubmission (Revisi)',
            desc: 'Applicant diminta memperbaiki dan mengajukan ulang',
            icon: RefreshCw,
            active: 'border-orange-500 bg-orange-50',
            iconColor: 'text-orange-600',
        },
        {
            value: 'Disapproved',
            label: 'Ditolak (Disapproved)',
            desc: 'Proposal tidak layak etik secara menyeluruh',
            icon: XCircle,
            active: 'border-red-500 bg-red-50',
            iconColor: 'text-red-600',
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengambilan Keputusan — Ketua" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Pengambilan Keputusan Akhir</h2>
                            <p className="text-xs text-gray-500 font-medium">Khusus Full Board Review — keputusan Ketua Komisi Etik</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
                    {proposals.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg font-medium">Tidak ada Full Board Review yang menunggu keputusan.</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Proposal Full Board akan muncul setelah semua reviewer menyelesaikan feedback.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Daftar Proposal */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="text-base font-semibold mb-4 text-gray-900">
                                        Full Board Review
                                        <span className="ml-2 text-xs font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                            {proposals.length} proposal
                                        </span>
                                    </h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {proposals.map((proposal) => (
                                            <button
                                                key={proposal.id}
                                                onClick={() => {
                                                    setSelectedId(proposal.id);
                                                    setData({ status: 'Approved', notes: '', feedback_applicant: '' });
                                                }}
                                                className={`w-full text-left p-3 rounded-xl border transition ${
                                                    selectedId === proposal.id
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <p className="font-semibold text-sm text-gray-900">
                                                    {proposal.nomor_pengajuan}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {proposal.judul}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{proposal.peneliti}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detail & Form Keputusan */}
                            {selected ? (
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Ringkasan Proposal */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-4">{selected.judul}</h3>
                                            <span className="text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap bg-purple-100 text-purple-800">
                                                Full Board Review
                                            </span>
                                        </div>
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
                                                <p className="text-gray-600 font-medium">Jumlah Reviewer</p>
                                                <p className="font-semibold text-gray-900">{selected.reviews?.length || 0} reviewer</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ringkasan Review */}
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Feedback dari Reviewer</h4>
                                        {selected.reviews && selected.reviews.length > 0 ? (
                                            <div className="space-y-3">
                                                {selected.reviews.map((review, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">
                                                                    {review.reviewer?.name || `Reviewer ${idx + 1}`}
                                                                </p>
                                                                <p className="text-xs text-gray-400">{review.reviewer?.email}</p>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
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
                                                            <p className="text-sm text-gray-700 border-t border-gray-200 pt-3 mt-3">
                                                                {review.feedback.substring(0, 200)}
                                                                {review.feedback.length > 200 ? '...' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm text-center py-4">Belum ada feedback reviewer</p>
                                        )}
                                    </div>

                                    {/* Form Keputusan */}
                                    <form onSubmit={(e) => handleDecision(e, selected.id)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                                        <h4 className="font-semibold text-lg text-gray-900">Keputusan Ketua Komisi Etik</h4>

                                        <div className="space-y-3">
                                            {decisionOptions.map((opt) => {
                                                const Icon = opt.icon;
                                                const isSelected = data.status === opt.value;
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                                                            isSelected ? opt.active : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => setData('status', opt.value)}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            value={opt.value}
                                                            checked={isSelected}
                                                            onChange={(e) => setData('status', e.target.value)}
                                                            className="mr-3 w-4 h-4"
                                                        />
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <Icon className={`w-5 h-5 flex-shrink-0 ${opt.iconColor}`} />
                                                            <div>
                                                                <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                                                                <p className="text-xs text-gray-500">{opt.desc}</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>

                                        {needsFeedback && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 mb-1">
                                                    Instruksi / Feedback untuk Applicant <span className="text-orange-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.feedback_applicant}
                                                    onChange={(e) => setData('feedback_applicant', e.target.value)}
                                                    rows="4"
                                                    className="w-full border border-orange-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-400"
                                                    placeholder="Tuliskan instruksi perbaikan yang perlu dilakukan Applicant..."
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                                Catatan Resmi Ketua (Wajib)
                                            </label>
                                            <textarea
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows="4"
                                                className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-500"
                                                placeholder="Catatan resmi keputusan Ketua Komisi Etik..."
                                                required
                                            />
                                            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${
                                                data.status === 'Approved'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : data.status === 'AWR'
                                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                                    : data.status === 'Resubmission'
                                                    ? 'bg-orange-500 hover:bg-orange-600'
                                                    : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Keputusan Akhir'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="lg:col-span-2 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm min-h-48">
                                    <p className="text-gray-400 text-sm">Pilih proposal dari daftar untuk membuat keputusan.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
