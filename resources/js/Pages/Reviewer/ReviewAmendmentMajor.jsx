import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileEdit, Download, ArrowLeft, Send, AlertTriangle, FileText, User, Calendar } from 'lucide-react';

export default function ReviewAmendmentMajor({ amendment, proposal }) {
    const { data, setData, post, processing, errors } = useForm({
        feedback: '',
        recommendation: 'Approved',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.feedback.trim()) {
            alert('Silakan tulis feedback review amendment.');
            return;
        }
        if (confirm('Kirim hasil review Major Amendment ini?')) {
            post(route('reviewer.amendmentReview.submit', amendment.id));
        }
    };

    const handleDownload = (path, name) => {
        const link = document.createElement('a');
        link.href = path;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title={`Review Amendment ${proposal?.nomor_pengajuan}`} />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('reviewer.amendmentReviews')}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Review Major Amendment</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                {proposal?.nomor_pengajuan} — {proposal?.judul}
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-bold">
                        Major Amendment
                    </span>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Amendment Details + Protocol Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Protocol Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Informasi Protokol Asal
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px]">Nomor Pengajuan</p>
                                    <p className="text-gray-900 font-bold">{proposal?.nomor_pengajuan}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px]">Peneliti</p>
                                    <p className="text-gray-900 font-bold">{proposal?.peneliti}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px]">Institusi</p>
                                    <p className="text-gray-900 font-bold">{proposal?.institusi || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px]">Judul</p>
                                    <p className="text-gray-900 font-bold leading-relaxed">{proposal?.judul}</p>
                                </div>
                            </div>
                        </div>

                        {/* Amendment Details */}
                        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                                <FileEdit className="w-4 h-4 text-purple-600" />
                                Detail Perubahan (Amendment)
                            </h4>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 uppercase text-[10px] font-semibold">Diajukan Oleh</p>
                                        <p className="text-gray-900 text-sm font-bold flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-gray-400" />
                                            {amendment.user?.name || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 uppercase text-[10px] font-semibold">Tanggal Pengajuan</p>
                                        <p className="text-gray-900 text-sm font-bold flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            {new Date(amendment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Deskripsi Perubahan</p>
                                    <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">{amendment.description}</p>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Alasan Perubahan</p>
                                    <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">{amendment.reason}</p>
                                </div>

                                {amendment.changed_sections && amendment.changed_sections.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Bagian yang Diubah</p>
                                        <div className="flex flex-wrap gap-2">
                                            {amendment.changed_sections.map((section, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                                    {section}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Supporting Documents */}
                        {amendment.documents?.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Dokumen Pendukung Amendment
                                </h4>
                                <div className="space-y-2">
                                    {amendment.documents.map(doc => (
                                        <button
                                            key={doc.id}
                                            type="button"
                                            onClick={() => handleDownload(doc.file_path, doc.document_type)}
                                            className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold text-gray-700"
                                        >
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-purple-500" />
                                                <span>{doc.document_type}</span>
                                            </span>
                                            <Download className="w-4 h-4 text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Protocol Original Documents */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-600" />
                                Dokumen Protokol Asli (Referensi)
                            </h4>
                            <div className="space-y-2 text-xs font-bold text-gray-700">
                                {proposal?.proposal_path && (
                                    <button type="button" onClick={() => handleDownload(proposal.proposal_path, 'Proposal')}
                                        className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-red-500" />
                                            <span>Proposal Penelitian</span>
                                        </span>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                                {proposal?.informed_consent_path && (
                                    <button type="button" onClick={() => handleDownload(proposal.informed_consent_path, 'InformedConsent')}
                                        className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span>Informed Consent</span>
                                        </span>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                                {proposal?.surat_izin_path && (
                                    <button type="button" onClick={() => handleDownload(proposal.surat_izin_path, 'SuratIzin')}
                                        className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-indigo-500" />
                                            <span>Surat Izin Penelitian</span>
                                        </span>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                                {proposal?.instrumen_path && (
                                    <button type="button" onClick={() => handleDownload(proposal.instrumen_path, 'Instrumen')}
                                        className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <span className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-orange-500" />
                                            <span>Instrumen / Kuesioner</span>
                                        </span>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Review Form */}
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-sm text-amber-800 mb-1">Major Amendment</p>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Perubahan besar (Major) memerlukan review etika menyeluruh.
                                        Berikan rekomendasi apakah perubahan ini layak disetujui atau perlu perbaikan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sticky top-24">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <FileEdit className="w-5 h-5 text-purple-600" />
                                Form Review Amendment
                            </h4>

                            <div className="space-y-4 text-xs font-semibold">
                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Rekomendasi</label>
                                    <select
                                        value={data.recommendation}
                                        onChange={e => setData('recommendation', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    >
                                        <option value="Approved">✓ DISETUJUI (Perubahan Layak)</option>
                                        <option value="Conditionally Approved">⚠ DISETUJUI BERSYARAT</option>
                                        <option value="Rejected">✗ DITOLAK (Perubahan Tidak Layak)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Feedback / Catatan Review</label>
                                    <textarea
                                        value={data.feedback}
                                        onChange={e => setData('feedback', e.target.value)}
                                        rows="6"
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Tulis catatan review, saran perbaikan, atau alasan penolakan perubahan..."
                                        required
                                    />
                                    {errors.feedback && <p className="text-red-500 mt-1">{errors.feedback}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Mengirim...' : 'Kirim Review Amendment'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
