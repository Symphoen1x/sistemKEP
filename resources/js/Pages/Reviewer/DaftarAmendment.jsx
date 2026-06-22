import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { FileEdit, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
    Assigned:  { color: 'bg-yellow-100 text-yellow-700', label: 'Perlu Review', icon: Clock },
    Completed: { color: 'bg-green-100 text-green-700',   label: 'Selesai',      icon: CheckCircle },
};

export default function DaftarAmendment({ amendments = [] }) {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Review Major Amendment" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <FileEdit className="w-6 h-6 text-purple-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Review Major Amendment</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                Penugasan review perubahan besar (Major) pada protokol yang telah disetujui
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
                    {amendments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <FileEdit className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                                Belum ada Major Amendment yang ditugaskan kepada Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                                Daftar Major Amendment
                                <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {amendments.length} item
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100 font-semibold text-xs">
                                {amendments.map((item) => {
                                    const sc = statusConfig[item.review_status] || statusConfig.Assigned;
                                    const StatusIcon = sc.icon;

                                    return (
                                        <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                                        {item.protokol?.nomor_pengajuan}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        item.review_status === 'Completed'
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    } flex items-center gap-1`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {sc.label}
                                                    </span>
                                                    {item.reviewer_recommendation && (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                            item.reviewer_recommendation === 'Approved'
                                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                                : item.reviewer_recommendation === 'Conditionally Approved'
                                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                            {item.reviewer_recommendation}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-gray-900 leading-snug">
                                                    {item.protokol?.judul}
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Deskripsi: {item.description?.substring(0, 100)}{item.description?.length > 100 ? '...' : ''}
                                                </p>
                                                <p className="text-[10px] text-gray-400">
                                                    Ditugaskan: {new Date(item.review_assigned_at).toLocaleDateString('id-ID')}
                                                    {item.review_submitted_at && (
                                                        <> • Diselesaikan: {new Date(item.review_submitted_at).toLocaleDateString('id-ID')}</>
                                                    )}
                                                </p>
                                            </div>

                                            {item.review_status === 'Assigned' ? (
                                                <Link
                                                    href={route('reviewer.amendmentReview.show', item.id)}
                                                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                                >
                                                    <FileEdit className="w-4 h-4" />
                                                    <span>Buka & Review</span>
                                                </Link>
                                            ) : (
                                                <span className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Sudah Direview</span>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
