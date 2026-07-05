import { useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head, Link } from '@inertiajs/react';
import { FileEdit, ArrowLeft, Upload, AlertTriangle } from 'lucide-react';

export default function PengajuanAmendment({ proposal }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        type: 'Minor',
        description: '',
        reason: '',
        documents: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirm('Kirim pengajuan Amendment?')) {
            post(route('applicant.amendment.store', proposal.id), {
                forceFormData: true,
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengajuan Amendment" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link href={route('applicant.trackStatus')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Pengajuan Amendment</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                {proposal.nomor_pengajuan} — {proposal.judul}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                    {/* Info */}
                    <div className="rounded-2xl p-5 border bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sm text-amber-800 mb-1">Amendment Protokol Penelitian</p>
                                <p className="text-sm text-amber-700">
                                    Gunakan formulir ini untuk mengajukan perubahan pada protokol yang telah disetujui.
                                    Amendment Minor untuk perubahan administratif, Major untuk perubahan substansial.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <FileEdit className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Detail Amendment</h3>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Amendment <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Minor', 'Major'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setData('type', t)}
                                        className={`p-4 rounded-xl border-2 text-left transition ${
                                            data.type === t
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className={`font-bold text-sm ${data.type === t ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {t === 'Minor' ? 'Minor Amendment' : 'Major Amendment'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {t === 'Minor'
                                                ? 'Perubahan administratif, typo, format, dll.'
                                                : 'Perubahan metode, subjek, prosedur, dll.'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Deskripsi Perubahan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara detail perubahan yang ingin dilakukan..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Alasan Perubahan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Jelaskan alasan mengapa perubahan ini diperlukan..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                        </div>

                        {/* Documents */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Dokumen Pendukung (opsional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setData('documents', Array.from(e.target.files))}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Maksimal 10MB per file (PDF, DOC, DOCX)</p>
                        </div>

                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
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
                                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {processing ? 'Mengirim...' : 'Kirim Amendment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
