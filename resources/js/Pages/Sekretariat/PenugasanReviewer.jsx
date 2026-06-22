import { Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { UserCheck, ShieldCheck, HelpCircle, AlertTriangle, Clock, Bell } from 'lucide-react';

export default function PenugasanReviewer({ reviewers = [], proposals = [] }) {
    const [selectedReviewers, setSelectedReviewers] = useState({});

    const handleAssign = (proposalId) => {
        const reviewerId = selectedReviewers[proposalId];
        if (!reviewerId) {
            alert('Silakan pilih penelaah terlebih dahulu.');
            return;
        }

        if (confirm('Apakah Anda yakin menugaskan penelaah ini?')) {
            router.post(route('sekretariat.reviewer.assign', proposalId), {
                reviewer_id: reviewerId,
            }, {
                onSuccess: () => {
                    alert('Reviewer berhasil ditugaskan.');
                }
            });
        }
    };

    const handleSelectChange = (proposalId, reviewerId) => {
        setSelectedReviewers(prev => ({
            ...prev,
            [proposalId]: reviewerId
        }));
    };

    const handleReminder = (proposalId, reviewerName) => {
        if (confirm(`Kirim reminder overdue ke ${reviewerName}?`)) {
            router.post(route('sekretariat.reviewer.reminder', proposalId), {}, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Filter proposals that need reviewer assignment
    const reviewProposals = proposals.filter(p => p.status === 'Direview' || p.status === 'Pending');

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Penugasan Penelaah Etik (Reviewer)" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Penugasan Reviewer</h2>
                        <p className="text-xs text-gray-500 font-medium">Tunjuk penelaah ahli untuk meninjau kelayakan etik usulan penelitian</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Proposals Assignment List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                                Usulan Butuh Penelaah
                            </div>
                            <div className="divide-y divide-gray-100 font-semibold text-xs">
                                {reviewProposals.length > 0 ? (
                                    reviewProposals.map((item) => (
                                        <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-gray-50/50 transition-colors">
                                            <div className="space-y-1.5 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                        {item.nomor_pengajuan}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        item.status === 'Direview' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                    {item.review_type && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                                                            {item.review_type}
                                                        </span>
                                                    )}
                                                    {item.is_overdue && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            OVERDUE
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-gray-900 leading-snug">{item.judul}</h4>
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Pengusul: {item.peneliti} | {item.institusi}
                                                </p>
                                                {item.due_date && (
                                                    <p className={`text-[10px] font-bold flex items-center gap-1 ${item.is_overdue ? 'text-red-600' : 'text-gray-400'}`}>
                                                        <Clock className="w-3 h-3" />
                                                        Tenggat: {formatDate(item.due_date)}
                                                    </p>
                                                )}
                                                {item.reviewer && (
                                                    <p className="text-xs text-purple-600 font-semibold flex items-center gap-1 mt-1">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        <span>Ditugaskan ke: {item.reviewer.name}</span>
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Reviewer Selector */}
                                            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                                                <select
                                                    value={selectedReviewers[item.id] || item.reviewer_id || ''}
                                                    onChange={e => handleSelectChange(item.id, e.target.value)}
                                                    className="w-full md:w-48 rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Pilih Penelaah...</option>
                                                    {reviewers.map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAssign(item.id)}
                                                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                    <span>Tugaskan</span>
                                                </button>
                                                {item.is_overdue && item.reviewer && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReminder(item.id, item.reviewer.name)}
                                                        className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                                                        title={`Kirim reminder ke ${item.reviewer.name}`}
                                                    >
                                                        <Bell className="w-4 h-4" />
                                                        <span>Reminder</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500 font-medium">
                                        Tidak ada usulan yang membutuhkan penugasan reviewer saat ini.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviewers Directory info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                <span>Direktori Penelaah Aktif</span>
                            </h3>
                            <div className="space-y-4">
                                {reviewers.length > 0 ? (
                                    reviewers.map((rev) => (
                                        <div key={rev.id} className="p-4 border border-gray-50 rounded-xl space-y-1">
                                            <p className="text-sm font-bold text-gray-900 leading-snug">{rev.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{rev.institution}</p>
                                            <span className="inline-flex mt-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                {rev.role_type || 'Penelaah Ahli'}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 font-medium">Belum ada penelaah etis terdaftar.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
