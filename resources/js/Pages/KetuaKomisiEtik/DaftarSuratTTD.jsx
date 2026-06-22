import { useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';
import { FileSignature, CheckCircle2, FileText, Building, User } from 'lucide-react';

export default function DaftarSuratTTD({ proposals }) {
    const { post, processing } = useForm({});

    const handleSign = (proposalId) => {
        if (confirm('Tandatangani dan setujui penerbitan Surat Kelaikan Etik ini?')) {
            post(route('ketua.signSurat', proposalId));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Daftar Surat Menunggu TTD" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <FileSignature className="w-6 h-6 text-indigo-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Surat Menunggu Tanda Tangan</h2>
                            <p className="text-xs text-gray-500 font-medium">Daftar Surat Kelaikan Etik yang perlu ditandatangani</p>
                        </div>
                    </div>
                    {proposals.length > 0 && (
                        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                            {proposals.length} menunggu
                        </span>
                    )}
                </header>

                <div className="flex-1 p-8 space-y-4 max-w-5xl w-full mx-auto">
                    {proposals.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <FileSignature className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg font-medium">Tidak ada surat yang menunggu tanda tangan.</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Surat Kelaikan Etik akan muncul di sini setelah Sekretariat memberi nomor surat.
                            </p>
                        </div>
                    ) : (
                        proposals.map((proposal) => (
                            <div key={proposal.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                {proposal.nomor_pengajuan}
                                            </span>
                                            {proposal.review_type && (
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                                    proposal.review_type === 'Full Board'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {proposal.review_type}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-3">{proposal.judul}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Peneliti</p>
                                                    <p className="font-semibold text-gray-900">{proposal.peneliti}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Institusi</p>
                                                    <p className="font-semibold text-gray-900">{proposal.institusi || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Nomor Surat</p>
                                                    <p className="font-semibold text-gray-900">{proposal.nomor_surat || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 flex-shrink-0">
                                        {proposal.sk_path && (
                                            <a
                                                href={proposal.sk_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-xl hover:bg-indigo-50 transition"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Preview Surat
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleSign(proposal.id)}
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {processing ? 'Memproses...' : 'Tandatangani & Terbitkan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
