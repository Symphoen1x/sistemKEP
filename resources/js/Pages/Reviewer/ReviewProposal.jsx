import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileText, Download, ShieldAlert, ArrowLeft, Send, GitCompare, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const docTypeLabels = {
    proposal: { label: 'Proposal Penelitian', color: 'text-red-500' },
    informed_consent: { label: 'Informed Consent', color: 'text-blue-500' },
    surat_izin: { label: 'Surat Izin Penelitian', color: 'text-indigo-500' },
    instrumen: { label: 'Instrumen / Kuesioner', color: 'text-orange-500' },
    sertifikat_pelatihan: { label: 'Sertifikat Pelatihan', color: 'text-green-500' },
};

const contextLabels = {
    initial: { label: 'Pengajuan Awal', color: 'bg-blue-100 text-blue-700' },
    revisi: { label: 'Revisi', color: 'bg-orange-100 text-orange-700' },
    amendment: { label: 'Amendment', color: 'bg-purple-100 text-purple-700' },
    sertifikat: { label: 'Sertifikat', color: 'bg-green-100 text-green-700' },
};

export default function ReviewProposal({ proposal, review, documentVersions = {}, hasMultipleVersions = false }) {
    const [showVersionPanel, setShowVersionPanel] = useState(hasMultipleVersions);
    const [expandedDocType, setExpandedDocType] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        feedback: review?.feedback || '',
        recommendation: review?.recommendation || 'Approved',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.feedback.trim()) {
            alert('Silakan tulis feedback atau umpan balik review.');
            return;
        }

        if (confirm('Kirim rekomendasi review etik ini?')) {
            post(route('reviewer.submitReview', review?.id || proposal.id));
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

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Get version count for display
    const versionEntries = Object.entries(documentVersions);
    const totalVersions = versionEntries.reduce((sum, [, versions]) => sum + versions.length, 0);

    return (
        <AuthenticatedLayout>
            <Head title={`Review Protokol ${proposal.nomor_pengajuan}`} />

            <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Proposal Full Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Section 1: Info Umum */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs font-semibold">
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Identitas & Informasi Umum</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Nama Peneliti</p>
                                <p className="text-gray-900 text-sm font-bold">{proposal.peneliti}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">NIDN / NIM</p>
                                <p className="text-gray-900 text-sm font-bold">{proposal.nidn_nim || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Institusi / Fakultas</p>
                                <p className="text-gray-900 text-sm font-bold">{proposal.institusi || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Lokasi Penelitian</p>
                                <p className="text-gray-900 text-sm font-bold">{proposal.lokasi_penelitian || '-'}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-gray-400 uppercase text-[10px]">Judul Penelitian</p>
                                <p className="text-gray-900 text-sm font-bold leading-relaxed">{proposal.judul}</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <p className="text-gray-400 uppercase text-[10px]">Anggota Tim</p>
                                <p className="text-gray-900 text-xs font-medium leading-relaxed">{proposal.anggota_tim || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Info Metodologi & Risiko */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs font-semibold">
                        <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Deskripsi, Metodologi & Potensi Risiko</h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Ringkasan / Deskripsi Penelitian</p>
                                <p className="text-gray-900 text-xs font-medium leading-relaxed whitespace-pre-line">{proposal.deskripsi_penelitian}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Metodologi</p>
                                <p className="text-gray-900 text-xs font-medium leading-relaxed whitespace-pre-line">{proposal.metode_penelitian}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Subjek Penelitian</p>
                                <p className="text-gray-900 text-xs font-bold">{proposal.subjek_penelitian}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-400 uppercase text-[10px]">Potensi Risiko & Mitigasi</p>
                                <p className="text-gray-900 text-xs font-medium leading-relaxed whitespace-pre-line text-red-600 bg-red-50/50 p-3 rounded-xl border border-red-100">{proposal.risiko_penelitian}</p>
                            </div>
                        </div>
                    </div>

                    {/* PB27: Version Comparison Panel */}
                    {versionEntries.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setShowVersionPanel(!showVersionPanel)}
                                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${hasMultipleVersions ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                        <GitCompare className={`w-5 h-5 ${hasMultipleVersions ? 'text-orange-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-bold text-gray-900">
                                            Riwayat Versi Dokumen
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {totalVersions} versi dari {versionEntries.length} jenis dokumen
                                            {hasMultipleVersions && (
                                                <span className="ml-1 text-orange-600 font-bold">— Ada revisi dokumen</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {showVersionPanel ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>

                            {showVersionPanel && (
                                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                                    {!hasMultipleVersions && (
                                        <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 font-medium flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-gray-400" />
                                            Belum ada revisi dokumen. Semua dokumen masih versi awal.
                                        </div>
                                    )}

                                    {versionEntries.map(([docType, versions]) => {
                                        const docLabel = docTypeLabels[docType] || { label: docType, color: 'text-gray-500' };
                                        const isExpanded = expandedDocType === docType;
                                        const hasVersions = versions.length > 1;

                                        return (
                                            <div key={docType} className={`border rounded-xl overflow-hidden ${hasVersions ? 'border-orange-200' : 'border-gray-200'}`}>
                                                <button
                                                    onClick={() => setExpandedDocType(isExpanded ? null : docType)}
                                                    className={`w-full p-3 flex items-center justify-between text-xs font-bold hover:bg-gray-50 transition ${hasVersions ? 'bg-orange-50' : ''}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className={`w-4 h-4 ${docLabel.color}`} />
                                                        <span className="text-gray-900">{docLabel.label}</span>
                                                        {hasVersions && (
                                                            <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded text-[10px] font-bold">
                                                                {versions.length} versi
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </button>

                                                {isExpanded && (
                                                    <div className="p-3 space-y-2 bg-gray-50 border-t border-gray-200">
                                                        {versions.map((ver, idx) => {
                                                            const ctxLabel = contextLabels[ver.upload_context] || { label: ver.upload_context || '-', color: 'bg-gray-100 text-gray-700' };
                                                            const isLatest = idx === 0;
                                                            const isOldest = idx === versions.length - 1;

                                                            return (
                                                                <div key={ver.id} className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-semibold ${
                                                                    isLatest ? 'bg-white border-blue-200' : 'bg-white border-gray-200'
                                                                }`}>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                                isLatest ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                                            }`}>
                                                                                v{ver.version}
                                                                            </span>
                                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ctxLabel.color}`}>
                                                                                {ctxLabel.label}
                                                                            </span>
                                                                            {isLatest && (
                                                                                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                                                                                    TERBARU
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-gray-600">
                                                                            {ver.original_filename || 'Dokumen'}
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {formatDate(ver.created_at)} • {ver.file_size || '-'}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDownload(ver.file_path, `${docType}_v${ver.version}`)}
                                                                        className={`p-2 rounded-lg transition ${
                                                                            isLatest
                                                                                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}

                                                        {hasVersions && (
                                                            <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200 text-[10px] text-orange-700 font-semibold flex items-center gap-2">
                                                                <GitCompare className="w-3.5 h-3.5 flex-shrink-0" />
                                                                Dokumen ini telah direvisi {versions.length - 1}x. Bandingkan versi lama vs baru untuk melihat perubahan.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar Layout: Files Downloader & Decision Form */}
                <div className="space-y-6">
                    {/* Section 3: Berkas Usulan */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span>Berkas Usulan Lampiran</span>
                        </h4>
                        <div className="space-y-2 text-xs font-bold text-gray-700">
                            {proposal.proposal_path && (
                                <button 
                                    type="button" 
                                    onClick={() => handleDownload(proposal.proposal_path, 'Proposal')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-red-500" />
                                        <span>Proposal Penelitian</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {proposal.informed_consent_path && (
                                <button 
                                    type="button" 
                                    onClick={() => handleDownload(proposal.informed_consent_path, 'InformedConsent')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <span>Informed Consent</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {proposal.surat_izin_path && (
                                <button 
                                    type="button" 
                                    onClick={() => handleDownload(proposal.surat_izin_path, 'SuratIzin')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-indigo-500" />
                                        <span>Surat Izin Penelitian</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {proposal.formulir_pengajuan_path && (
                                <button
                                    type="button"
                                    onClick={() => handleDownload(proposal.formulir_pengajuan_path, 'FormulirPengajuan')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-emerald-500" />
                                        <span>Formulir Pengajuan (TTD)</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {proposal.ringkasan_protokol_path && (
                                <button
                                    type="button"
                                    onClick={() => handleDownload(proposal.ringkasan_protokol_path, 'RingkasanProtokol')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-teal-500" />
                                        <span>Ringkasan Protokol (TTD)</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {proposal.instrumen_path && (
                                <button
                                    type="button"
                                    onClick={() => handleDownload(proposal.instrumen_path, 'Instrumen')}
                                    className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                        <span>Instrumen / Kuesioner</span>
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Review Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-blue-600" />
                            <span>Form Review Etika</span>
                        </h4>

                        <div className="space-y-4 text-xs font-semibold">
                            <div className="space-y-1.5">
                                <label className="text-gray-700 uppercase">Rekomendasi</label>
                                <select
                                    value={data.recommendation}
                                    onChange={e => setData('recommendation', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="Approved">✓ DISETUJUI (Layak Etik)</option>
                                    <option value="Conditionally Approved">⚠ DISETUJUI BERSYARAT</option>
                                    <option value="Rejected">✗ DITOLAK (Tidak Layak)</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-gray-700 uppercase">Feedback / Catatan Review</label>
                                <textarea
                                    value={data.feedback}
                                    onChange={e => setData('feedback', e.target.value)}
                                    rows="5"
                                    className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tulis feedback detail, saran, atau alasan penolakan..."
                                    required
                                />
                                {errors.feedback && <p className="text-red-500 mt-1">{errors.feedback}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            <span>{processing ? 'Mengirim...' : 'Kirim Review'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
