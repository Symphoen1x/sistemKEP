import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { Award, FileText, CheckCircle, Upload, PenTool } from 'lucide-react';

export default function SuratSertifikat({ proposals = [] }) {
    const [selectedId, setSelectedId] = useState(null);
    const [nomorSurat, setNomorSurat] = useState('');
    const [showNomorModal, setShowNomorModal] = useState(false);

    // Filter proposals that have been verified ('Direview' or 'Disetujui')
    const certProposals = proposals.filter(p => p.status === 'Direview' || p.status === 'Disetujui');

    const handleSaveNomor = (e) => {
        e.preventDefault();
        if (!nomorSurat.trim()) return;

        router.post(route('sekretariat.surat.nomor', selectedId), {
            nomor_surat: nomorSurat,
        }, {
            onSuccess: () => {
                alert('Nomor Surat berhasil diperbarui.');
                setShowNomorModal(false);
                setNomorSurat('');
            }
        });
    };

    const handleUploadSK = (proposalId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('sk_file', file);

        router.post(route('sekretariat.surat.sk', proposalId), formData, {
            forceFormData: true,
            onSuccess: () => {
                alert('Surat Keputusan (SK) berhasil diunggah.');
            }
        });
    };

    const handleGenerateCert = (proposalId) => {
        const proposal = proposals.find(p => p.id === proposalId);
        if (!proposal?.nomor_surat) {
            alert('Silakan isi Nomor Surat terlebih dahulu sebelum menerbitkan sertifikat.');
            return;
        }

        if (confirm('Apakah Anda yakin menerbitkan sertifikat Ethical Clearance untuk usulan ini?')) {
            router.post(route('sekretariat.surat.sertifikat', proposalId), {}, {
                onSuccess: () => {
                    alert('Sertifikat Layak Etik berhasil diterbitkan.');
                }
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Manajemen Surat & Sertifikat KEP" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Surat & Sertifikat</h2>
                        <p className="text-xs text-gray-500 font-medium">Penerbitan surat keterangan layak etik dan surat keputusan komisi</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                            Penerbitan Sertifikat Kelayakan Etik (Ethical Clearance)
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor Pengajuan</th>
                                        <th className="px-6 py-4">Judul & Peneliti</th>
                                        <th className="px-6 py-4">Nomor Surat Etik</th>
                                        <th className="px-6 py-4 text-center">SK Penugasan</th>
                                        <th className="px-6 py-4 text-center">Sertifikat</th>
                                        <th className="px-6 py-4 text-center">Aksi Penerbitan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {certProposals.length > 0 ? (
                                        certProposals.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {item.nomor_pengajuan}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs text-xs">
                                                    <div className="font-bold text-gray-900 leading-snug truncate">{item.judul}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">Peneliti: {item.peneliti}</div>
                                                </td>
                                                
                                                {/* Nomor Surat */}
                                                <td className="px-6 py-4 text-gray-700">
                                                    {item.nomor_surat ? (
                                                        <div className="flex items-center gap-1.5 font-bold text-xs">
                                                            <span>{item.nomor_surat}</span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setSelectedId(item.id); setNomorSurat(item.nomor_surat); setShowNomorModal(true); }}
                                                                className="text-blue-600 hover:underline text-[10px]"
                                                            >
                                                                Ubah
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            type="button"
                                                            onClick={() => { setSelectedId(item.id); setNomorSurat(''); setShowNomorModal(true); }}
                                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                        >
                                                            <PenTool className="w-3.5 h-3.5" />
                                                            <span>Input Nomor</span>
                                                        </button>
                                                    )}
                                                </td>

                                                {/* SK Document */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.sk_path ? (
                                                        <span className="text-xs font-bold text-green-600 flex items-center justify-center gap-1">
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Terunggah</span>
                                                        </span>
                                                    ) : (
                                                        <label className="cursor-pointer px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <span>Upload SK</span>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                onChange={e => handleUploadSK(item.id, e.target.files[0])}
                                                            />
                                                        </label>
                                                    )}
                                                </td>

                                                {/* Sertifikat Path */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.sertifikat_path ? (
                                                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center justify-center gap-1 w-max mx-auto">
                                                            <Award className="w-4 h-4 text-green-600" />
                                                            <span>Terbit</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-bold">Belum Terbit</span>
                                                    )}
                                                </td>

                                                {/* Issue Certificate Action */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.status === 'Disetujui' ? (
                                                        <span className="text-xs text-green-600 font-bold">Selesai</span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleGenerateCert(item.id)}
                                                            className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 inline-flex"
                                                        >
                                                            <Award className="w-3.5 h-3.5" />
                                                            <span>Terbitkan</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                Tidak ada usulan berstatus Review/Verifikasi yang siap diterbitkan sertifikat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Nomor Surat Modal */}
            {showNomorModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 text-base">Input Nomor Surat Etik</h3>
                            <button onClick={() => setShowNomorModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                        </div>
                        <form onSubmit={handleSaveNomor} className="space-y-4 text-xs font-semibold">
                            <div className="space-y-1.5">
                                <label className="text-gray-700 uppercase">Format Nomor Surat</label>
                                <input 
                                    type="text" 
                                    value={nomorSurat}
                                    onChange={e => setNomorSurat(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contoh: 102/UN2.F1/KEP/2026"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowNomorModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
