import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileText, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function DaftarProposal({ proposals = [] }) {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Daftar Usulan Protokol - Reviewer" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Daftar Usulan Penelitian</h2>
                        <p className="text-xs text-gray-500 font-medium">Berkas penelaahan layak etik yang sedang ditugaskan kepada Anda</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                            Usulan Dalam Proses Review
                        </div>
                        <div className="divide-y divide-gray-100 font-semibold text-xs">
                            {proposals.length > 0 ? (
                                proposals.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {item.nomor_pengajuan}
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-orange-50 text-orange-700 border-orange-200">
                                                    Perlu Review
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-900 leading-snug">{item.judul}</h4>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Pengusul: {item.peneliti} | {item.institusi} | Subjek: {item.subjek_penelitian}
                                            </p>
                                        </div>
                                        <Link 
                                            href={route('reviewer.review', item.id)}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>Buka Berkas & Nilai</span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-500 font-medium">
                                    Tidak ada usulan penelitian yang ditugaskan untuk direview saat ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
