import { useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head, Link } from '@inertiajs/react';
import { Upload, ArrowLeft, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export default function UploadRevisi({ proposal }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        proposal: null,
        informed_consent: null,
        surat_izin: null,
        instrumen: null,
    });

    const isAWR = proposal.status === 'AWR';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirm('Kirim dokumen revisi? Pastikan semua berkas yang diperlukan sudah diunggah.')) {
            post(route('applicant.revisi.store', proposal.id), {
                forceFormData: true,
            });
        }
    };

    const fileFields = [
        { key: 'proposal',         label: 'Proposal Penelitian (Revisi)',        required: false },
        { key: 'informed_consent', label: 'Formulir Informed Consent (Revisi)',   required: false },
        { key: 'surat_izin',       label: 'Surat Izin Penelitian (Revisi)',       required: false },
        { key: 'instrumen',        label: 'Instrumen / Alat Ukur (Revisi)',       required: false },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Unggah Revisi Dokumen" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('applicant.trackStatus')}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Unggah Perbaikan Dokumen</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                {isAWR ? 'Approved with Recommendation' : 'Resubmission'} — {proposal.nomor_pengajuan}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                    {/* Info proposal */}
                    <div className={`rounded-2xl p-5 border ${isAWR ? 'bg-cyan-50 border-cyan-200' : 'bg-orange-50 border-orange-200'}`}>
                        <div className="flex items-start gap-3">
                            {isAWR
                                ? <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                                : <RefreshCw className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            }
                            <div>
                                <p className={`font-bold text-sm mb-1 ${isAWR ? 'text-cyan-800' : 'text-orange-800'}`}>
                                    {isAWR ? 'Proposal Anda Disetujui dengan Rekomendasi' : 'Proposal Memerlukan Perbaikan (Resubmission)'}
                                </p>
                                <p className={`text-sm font-semibold ${isAWR ? 'text-cyan-900' : 'text-orange-900'}`}>{proposal.judul}</p>
                                <p className={`text-xs mt-1 ${isAWR ? 'text-cyan-600' : 'text-orange-600'}`}>No. {proposal.nomor_pengajuan}</p>
                            </div>
                        </div>

                        {/* Feedback dari komisi */}
                        {proposal.decision?.feedback_applicant && (
                            <div className={`mt-4 pt-4 border-t ${isAWR ? 'border-cyan-200' : 'border-orange-200'}`}>
                                <p className={`text-xs font-bold mb-2 flex items-center gap-1 ${isAWR ? 'text-cyan-800' : 'text-orange-800'}`}>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {isAWR ? 'Rekomendasi dari Komisi Etik:' : 'Instruksi Perbaikan dari Komisi Etik:'}
                                </p>
                                <p className={`text-sm whitespace-pre-line ${isAWR ? 'text-cyan-700' : 'text-orange-700'}`}>
                                    {proposal.decision.feedback_applicant}
                                </p>
                            </div>
                        )}

                        {proposal.catatan_revisi && (
                            <div className={`mt-3 pt-3 border-t ${isAWR ? 'border-cyan-200' : 'border-orange-200'}`}>
                                <p className={`text-xs font-bold mb-1 ${isAWR ? 'text-cyan-800' : 'text-orange-800'}`}>Catatan dari Reviewer:</p>
                                <p className={`text-sm ${isAWR ? 'text-cyan-700' : 'text-orange-700'}`}>{proposal.catatan_revisi}</p>
                                <p className={`text-xs mt-2 ${isAWR ? 'text-cyan-600' : 'text-orange-600'} font-medium`}>
                                    Silakan unggah ulang dokumen yang perlu diperbaiki pada formulir di bawah ini.
                                </p>
                            </div>
                        )}

                        {/* Feedback dari Reviewer */}
                        {proposal.reviews && proposal.reviews.filter(r => r.status === 'Completed').length > 0 && (
                            <div className={`mt-3 pt-3 border-t ${isAWR ? 'border-cyan-200' : 'border-orange-200'}`}>
                                <p className={`text-xs font-bold mb-2 flex items-center gap-1 ${isAWR ? 'text-cyan-800' : 'text-orange-800'}`}>
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Feedback dari Reviewer:
                                </p>
                                <div className="space-y-2">
                                    {proposal.reviews.filter(r => r.status === 'Completed').map((review, idx) => (
                                        <div key={idx} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-gray-900">{review.reviewer?.name || 'Reviewer'}</span>
                                                {review.recommendation && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                        {review.recommendation}
                                                    </span>
                                                )}
                                            </div>
                                            {review.feedback && (
                                                <p className="text-sm text-gray-700 whitespace-pre-line">{review.feedback}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Upload */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <h3 className="font-semibold text-gray-900">Unggah Dokumen yang Diperbaiki</h3>
                        <p className="text-sm text-gray-500">
                            Unggah hanya dokumen yang perlu diperbaiki berdasarkan catatan reviewer di atas. Dokumen yang tidak diunggah ulang akan tetap menggunakan versi sebelumnya.
                        </p>

                        <div className="space-y-4">
                            {fileFields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setData(field.key, e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                        {data[field.key] && (
                                            <p className="text-xs text-green-600 mt-1.5 font-medium">
                                                ✓ {data[field.key].name}
                                            </p>
                                        )}
                                    </div>
                                    {errors[field.key] && (
                                        <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={route('applicant.trackStatus')}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center text-sm hover:bg-gray-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {processing ? 'Mengunggah...' : 'Kirim Revisi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
