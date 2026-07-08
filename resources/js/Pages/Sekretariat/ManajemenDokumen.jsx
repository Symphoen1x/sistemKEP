import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { Search, FileText } from 'lucide-react';

export default function ManajemenDokumen({ proposals = [] }) {
    const [search, setSearch] = useState('');

    const filtered = proposals.filter(p => 
        p.judul.toLowerCase().includes(search.toLowerCase()) || 
        p.peneliti.toLowerCase().includes(search.toLowerCase()) ||
        (p.nomor_pengajuan && p.nomor_pengajuan.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Manajemen Dokumen KEP" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Manajemen Dokumen</h2>
                        <p className="text-xs text-gray-500 font-medium">Arsip terpusat berkas usulan dan persetujuan layak etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    {/* Filter and Search */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Cari nomor, judul, peneliti..."
                            />
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Nomor</th>
                                        <th className="px-6 py-4">Judul & Peneliti</th>
                                        <th className="px-6 py-4 text-center">Proposal</th>
                                        <th className="px-6 py-4 text-center">Informed Consent</th>
                                        <th className="px-6 py-4 text-center">Surat Izin</th>
                                        <th className="px-6 py-4 text-center">Instrumen</th>
                                        <th className="px-6 py-4 text-center">Sertifikat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {filtered.length > 0 ? (
                                        filtered.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors text-xs">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {item.nomor_pengajuan || '-'}
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <div className="font-bold text-gray-900 leading-snug truncate">{item.judul}</div>
                                                    <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Peneliti: {item.peneliti}</div>
                                                </td>
                                                
                                                {/* Proposal */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.proposal_path ? (
                                                        <a 
                                                            href={route('sekretariat.dokumen.download', [item.id, 'proposal'])}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded inline-block"
                                                        >
                                                            <FileText className="w-5 h-5 mx-auto" />
                                                        </a>
                                                    ) : '-'}
                                                </td>

                                                {/* Consent */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.informed_consent_path ? (
                                                        <a 
                                                            href={route('sekretariat.dokumen.download', [item.id, 'consent'])}
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded inline-block"
                                                        >
                                                            <FileText className="w-5 h-5 mx-auto" />
                                                        </a>
                                                    ) : '-'}
                                                </td>

                                                {/* Izin */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.surat_izin_path ? (
                                                        <a 
                                                            href={route('sekretariat.dokumen.download', [item.id, 'izin'])}
                                                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded inline-block"
                                                        >
                                                            <FileText className="w-5 h-5 mx-auto" />
                                                        </a>
                                                    ) : '-'}
                                                </td>

                                                {/* Instrumen */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.instrumen_path ? (
                                                        <a 
                                                            href={route('sekretariat.dokumen.download', [item.id, 'instrumen'])}
                                                            className="p-1 text-orange-600 hover:bg-orange-50 rounded inline-block"
                                                        >
                                                            <FileText className="w-5 h-5 mx-auto" />
                                                        </a>
                                                    ) : '-'}
                                                </td>

                                                {/* Sertifikat */}
                                                <td className="px-6 py-4 text-center">
                                                    {item.sertifikat_path ? (
                                                        <a 
                                                            href={route('sekretariat.dokumen.download', [item.id, 'sertifikat'])}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded inline-block"
                                                        >
                                                            <FileText className="w-5 h-5 mx-auto" />
                                                        </a>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                Tidak ada dokumen ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
