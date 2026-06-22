import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileText, Download, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Dokumen({ proposals = [] }) {
    // Only proposals that have approved certificates
    const certificates = proposals.filter(p => p.status === 'Disetujui' && p.sertifikat_path);

    const handleDownloadCert = (id) => {
        window.location.href = route('applicant.downloadSertifikat', id);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dokumen & Sertifikat Saya" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dokumen Saya</h2>
                        <p className="text-xs text-gray-500 font-medium">Unduh sertifikat kelayakan etik dan file keputusan komisi</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Certificates Issued List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                                <span>Sertifikat Kelayakan Etik (Ethical Clearance) Terbit</span>
                            </div>
                            <div className="divide-y divide-gray-100 font-medium text-xs">
                                {certificates.length > 0 ? (
                                    certificates.map((item) => (
                                        <div key={item.id} className="p-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-900">{item.nomor_surat || 'Sertifikat Layak Etik'}</p>
                                                <p className="text-xs text-gray-500">Judul Penelitian: {item.judul}</p>
                                                <p className="text-[10px] text-gray-400">Tanggal Terbit: {new Date(item.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDownloadCert(item.id)}
                                                className="px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>Download PDF</span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-400 font-bold">
                                        Belum ada sertifikat kelayakan etik yang diterbitkan untuk akun Anda.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Guidelines and templates downloads */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                <span>Formulir Pengusulan</span>
                            </h3>
                            <div className="space-y-3 text-xs font-semibold text-gray-600">
                                <button 
                                    onClick={() => handleDownload('/templates/kuesioner_self_assessment.docx', 'Kuesioner_Self_Assessment.docx')}
                                    className="w-full p-3 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 text-left"
                                >
                                    <span>Formulir Self-Assessment Etik</span>
                                    <Download className="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                    onClick={() => handleDownload('/templates/informed_consent_anak.docx', 'Informed_Consent_Anak.docx')}
                                    className="w-full p-3 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 text-left"
                                >
                                    <span>Informed Consent (Anak/Wali)</span>
                                    <Download className="w-4 h-4 text-blue-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
