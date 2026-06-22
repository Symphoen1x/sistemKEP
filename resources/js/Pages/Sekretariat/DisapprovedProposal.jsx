import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { XCircle, ArrowLeft, AlertTriangle, FileText, ShieldAlert, User, Building } from 'lucide-react';

export default function DisapprovedProposal({ proposal }) {
    const { data, setData, post, processing, errors } = useForm({
        rejection_reason: '',
        feedback_applicant: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.rejection_reason.trim() || !data.feedback_applicant.trim() || !data.notes.trim()) {
            alert('Semua kolom wajib diisi untuk keputusan Disapproved.');
            return;
        }
        if (confirm('Simpan keputusan DITOLAK (Disapproved)? Tindakan ini tidak dapat dibatalkan.')) {
            post(route('sekretariat.disapproveProposal', proposal.id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title={`Disapproved — ${proposal.nomor_pengajuan}`} />

                <header className="h-20 bg-white border-b border-red-200 flex items-center justify-between px-8 sticky top-0 z-30 bg-red-50/50">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('sekretariat.pengambilanKeputusan')}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-red-900">Keputusan: Disapproved (Ditolak)</h2>
                            <p className="text-xs text-red-600 font-medium">
                                {proposal.nomor_pengajuan} — {proposal.judul}
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Full Board Review
                    </span>
                </header>

                <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
                    {/* Warning Banner */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sm text-red-800 mb-1">Perhatian: Keputusan Penolakan</p>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    Keputusan <strong>Disapproved</strong> bersifat final dan tidak dapat diubah.
                                    Proposal ini akan berstatus <strong>Ditolak</strong> dan Applicant akan menerima notifikasi beserta alasan penolakan.
                                    Pastikan alasan penolakan ditulis dengan jelas dan konstruktif.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Summary */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Ringkasan Proposal
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase">Nomor Pengajuan</p>
                                <p className="font-bold text-gray-900">{proposal.nomor_pengajuan}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase">Tipe Review</p>
                                <p className="font-bold text-purple-700">{proposal.review_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase flex items-center gap-1">
                                    <User className="w-3 h-3" /> Peneliti
                                </p>
                                <p className="font-bold text-gray-900">{proposal.peneliti}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase flex items-center gap-1">
                                    <Building className="w-3 h-3" /> Institusi
                                </p>
                                <p className="font-bold text-gray-900">{proposal.institusi}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500 text-xs font-semibold uppercase">Judul Penelitian</p>
                                <p className="font-bold text-gray-900 leading-relaxed">{proposal.judul}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviewer Feedback Summary */}
                    {proposal.reviews && proposal.reviews.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-orange-500" />
                                Ringkasan Feedback Reviewer
                            </h4>
                            <div className="space-y-3">
                                {proposal.reviews.map((review, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-semibold text-sm text-gray-900">
                                                {review.reviewer?.name || `Reviewer ${idx + 1}`}
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
                                                "{review.feedback.substring(0, 200)}{review.feedback.length > 200 ? '...' : ''}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Disapproved Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-5">
                        <h4 className="font-semibold text-lg text-red-900 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            Form Penolakan Proposal (Disapproved)
                        </h4>

                        <div className="space-y-4">
                            {/* Rejection Reason — Internal */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Alasan Penolakan (Internal Komisi) <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Jelaskan alasan penolakan secara detail untuk dokumentasi internal komisi etik. Minimal 20 karakter.
                                </p>
                                <textarea
                                    value={data.rejection_reason}
                                    onChange={(e) => setData('rejection_reason', e.target.value)}
                                    rows="4"
                                    className="w-full border border-red-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                    placeholder="Contoh: Protokol penelitian tidak memenuhi standar etika karena: 1) Tidak ada persetujuan dari institusi mitra, 2) Risiko terhadap subjek penelitian tidak termitigasi dengan baik..."
                                    required
                                />
                                {errors.rejection_reason && <p className="text-red-500 text-xs mt-1">{errors.rejection_reason}</p>}
                            </div>

                            {/* Feedback to Applicant */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Feedback untuk Applicant <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Pesan yang akan dikirimkan kepada Applicant. Tulis dengan bahasa yang jelas dan konstruktif.
                                </p>
                                <textarea
                                    value={data.feedback_applicant}
                                    onChange={(e) => setData('feedback_applicant', e.target.value)}
                                    rows="5"
                                    className="w-full border border-orange-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                    placeholder="Contoh: Setelah melalui proses review Full Board, komisi etik memutuskan bahwa proposal Anda belum layak disetujui karena: 1) Informed consent belum memenuhi standar, 2) Metodologi berisiko tinggi terhadap subjek..."
                                    required
                                />
                                {errors.feedback_applicant && <p className="text-red-500 text-xs mt-1">{errors.feedback_applicant}</p>}
                            </div>

                            {/* Internal Notes */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                                    Catatan Tambahan <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Catatan internal untuk dokumentasi keputusan.
                                </p>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Catatan internal komisi..."
                                    required
                                />
                                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={route('sekretariat.pengambilanKeputusan')}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center text-sm hover:bg-gray-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Keputusan Disapproved'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
