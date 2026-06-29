import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { Eye, Check, X, Edit3, FileText, AlertTriangle } from 'lucide-react';

export default function VerifikasiPengajuan({ proposals = [] }) {
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRevisionInput, setShowRevisionInput] = useState(false);
    const [catatanRevisi, setCatatanRevisi] = useState('');

    const openVerifyModal = (item) => {
        setSelectedProposal(item);
        setCatatanRevisi(item.catatan_revisi || '');
        setShowRevisionInput(false);
        setShowModal(true);
    };

    const handleAction = (action) => {
        if (!selectedProposal) return;
        
        if (action === 'revisi' && !catatanRevisi.trim()) {
            alert('Silakan tulis catatan revisi terlebih dahulu.');
            return;
        }

        if (confirm(`Apakah Anda yakin melakukan aksi ini?`)) {
            router.post(route('sekretariat.verifikasi.aksi', selectedProposal.id), {
                action: action,
                catatan_revisi: catatanRevisi,
            }, {
                onSuccess: () => {
                    alert('Verifikasi berhasil disimpan.');
                    setShowModal(false);
                    setSelectedProposal(null);
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'Disetujui': 'bg-green-50 text-green-700 border-green-200',
            'Direview': 'bg-blue-50 text-blue-700 border-blue-200',
            'Revisi': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Ditolak': 'bg-red-50 text-red-700 border-red-200',
            'Pending': 'bg-gray-50 text-gray-700 border-gray-200',
            'Pending Admin': 'bg-purple-50 text-purple-700 border-purple-200',
            'Pending Surat': 'bg-orange-50 text-orange-700 border-orange-200',
            'Pending Ketua': 'bg-teal-50 text-teal-700 border-teal-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Pending']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Verifikasi Usulan Penelitian KEP" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Verifikasi Pengajuan</h2>
                        <p className="text-xs text-gray-500 font-medium">Validasi berkas administrasi dan usulan ethical clearance</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                            Daftar Pengajuan Masuk
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor</th>
                                        <th className="px-6 py-4">Judul Penelitian</th>
                                        <th className="px-6 py-4">Peneliti</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4 text-center">Verifikasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {proposals.length > 0 ? (
                                        proposals.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {item.nomor_pengajuan || '-'}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate">
                                                    {item.judul}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">{item.peneliti}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold">{item.institusi}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(item.status)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => openVerifyModal(item)}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-blue-500/10 inline-flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Buka</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                Belum ada pengajuan penelitian masuk.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail & Verifikasi */}
            {showModal && selectedProposal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <span className="text-xs font-extrabold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                                    {selectedProposal.nomor_pengajuan || 'Verifikasi Administrasi'}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 mt-1">Detail Proposal Kelaikan Etik</h3>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Judul Penelitian</p>
                                    <p className="font-bold text-gray-900 mt-1 leading-snug">{selectedProposal.judul}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Nama Peneliti / Pengusul</p>
                                    <p className="font-semibold text-gray-900 mt-1">{selectedProposal.peneliti} ({selectedProposal.role_peneliti})</p>
                                    <p className="text-xs text-gray-500 mt-0.5">NIDN/NIM: {selectedProposal.nidn_nim} | {selectedProposal.institusi}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Lokasi Penelitian</p>
                                    <p className="font-semibold text-gray-900 mt-1">{selectedProposal.lokasi_penelitian}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Subjek Penelitian / Partisipan</p>
                                    <p className="font-semibold text-gray-900 mt-1">{selectedProposal.subjek_penelitian}</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-b border-gray-100 pb-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Metode Penelitian</p>
                                    <p className="text-gray-700 mt-1 leading-relaxed">{selectedProposal.metode_penelitian}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Risiko Penelitian Terhadap Subjek</p>
                                    <p className="text-gray-700 mt-1 leading-relaxed">{selectedProposal.risiko_penelitian}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Deskripsi / Abstrak</p>
                                    <p className="text-gray-700 mt-1 leading-relaxed">{selectedProposal.deskripsi_penelitian}</p>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-gray-400 uppercase">Dokumen Persyaratan</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                                    {selectedProposal.proposal_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-red-500" />
                                                <span>Proposal Penelitian.pdf</span>
                                            </span>
                                            <a href={selectedProposal.proposal_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                    {selectedProposal.informed_consent_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                                <span>Informed Consent.pdf</span>
                                            </span>
                                            <a href={selectedProposal.informed_consent_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                    {selectedProposal.surat_izin_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-indigo-500" />
                                                <span>Surat Izin Tempat.pdf</span>
                                            </span>
                                            <a href={selectedProposal.surat_izin_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                    {selectedProposal.formulir_pengajuan_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-emerald-500" />
                                                <span>Formulir Pengajuan (TTD)</span>
                                            </span>
                                            <a href={selectedProposal.formulir_pengajuan_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                    {selectedProposal.ringkasan_protokol_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-teal-500" />
                                                <span>Ringkasan Protokol (TTD)</span>
                                            </span>
                                            <a href={selectedProposal.ringkasan_protokol_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                    {selectedProposal.instrumen_path && (
                                        <div className="p-3 border border-gray-100 rounded-xl flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-orange-500" />
                                                <span>Instrumen Kuesioner.pdf</span>
                                            </span>
                                            <a href={selectedProposal.instrumen_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Revision Input Box */}
                            {showRevisionInput && (
                                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl space-y-3">
                                    <label className="text-xs font-bold text-yellow-800 uppercase flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Catatan Revisi Administrasi</span>
                                    </label>
                                    <textarea
                                        value={catatanRevisi}
                                        onChange={e => setCatatanRevisi(e.target.value)}
                                        rows="3"
                                        className="w-full rounded-xl border-yellow-200 text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                                        placeholder="Tuliskan catatan perbaikan atau dokumen apa yang kurang lengkap..."
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setShowRevisionInput(false)}
                                            className="px-3 py-1.5 text-xs text-gray-500 font-bold hover:text-gray-700"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleAction('revisi')}
                                            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                                        >
                                            Kirim Permintaan Revisi
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                            <button
                                type="button"
                                onClick={() => handleAction('tolak')}
                                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-red-200/50"
                            >
                                <X className="w-4 h-4" />
                                <span>Tolak Proposal</span>
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRevisionInput(true)}
                                    className="px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-yellow-200/50"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Minta Revisi</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction('terima')}
                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-green-500/10"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Lolos Administrasi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
