import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileText, Download, ShieldAlert, ArrowLeft, Send } from 'lucide-react';

export default function ReviewProposal({ proposal }) {
    const { data, setData, post, processing, errors } = useForm({
        decision: 'Disetujui',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.notes.trim()) {
            alert('Silakan tulis catatan atau umpan balik review.');
            return;
        }

        if (confirm('Kirim keputusan penelaahan etik ini?')) {
            post(route('reviewer.review.store', proposal.id));
        }
    };

    const handleDownload = (path, name) => {
        alert(`Mengunduh berkas "${name}" ... (Simulasi Unduhan File: ${path})`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title={`Telaah Protokol ${proposal.nomor_pengajuan}`} />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Link href={route('reviewer.proposals')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold text-gray-900 leading-none">Telaah Kelayakan Etik</h2>
                            <p className="text-xs text-gray-500 font-medium mt-1">Nomor Pengajuan: {proposal.nomor_pengajuan}</p>
                        </div>
                    </div>
                </header>

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
                    </div>

                    {/* Left Sidebar Layout: Files Downloader & Decision Form */}
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

                        {/* Section 4: Decision Form */}
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-blue-600" />
                                <span>Hasil Keputusan Etik</span>
                            </h4>

                            <div className="space-y-4 text-xs font-semibold">
                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Keputusan Akhir</label>
                                    <select
                                        value={data.decision}
                                        onChange={e => setData('decision', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Disetujui">DISETUJUI (Layak Etik)</option>
                                        <option value="Revisi">REVISI (Perlu Perbaikan)</option>
                                        <option value="Ditolak">DITOLAK (Tidak Layak)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Umpan Balik / Catatan Penelaah</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        rows="4"
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tulis ulasan detail, komentar konstruktif, atau alasan revisi/penolakan..."
                                        required
                                    />
                                    {errors.notes && <p className="text-red-500 mt-1">{errors.notes}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>Kirim Rekomendasi</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
