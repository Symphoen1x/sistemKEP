import { useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Upload, ShieldAlert } from 'lucide-react';

export default function PengajuanTermination({ proposal }) {
    const { data, setData, post, processing, errors } = useForm({
        effective_date: '',
        reason_category: 'Non-Safety',
        description: '',
        participant_status: '',
        safety_measures: '',
    });

    const isSafety = data.reason_category === 'Safety';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (confirm('Kirim pengajuan Terminasi?')) {
            post(route('applicant.termination.store', proposal.id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengajuan Terminasi" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <Link href={route('applicant.trackStatus')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Pengajuan Terminasi Penelitian</h2>
                            <p className="text-xs text-gray-500 font-medium">
                                {proposal.nomor_pengajuan} — {proposal.judul}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                    {/* Warning */}
                    <div className={`rounded-2xl p-5 border ${isSafety ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-start gap-3">
                            {isSafety
                                ? <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                : <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            }
                            <div>
                                <p className={`font-bold text-sm mb-1 ${isSafety ? 'text-red-800' : 'text-amber-800'}`}>
                                    {isSafety ? 'Terminasi Terkait Keselamatan (Safety)' : 'Pengajuan Terminasi Protokol'}
                                </p>
                                <p className={`text-sm ${isSafety ? 'text-red-700' : 'text-amber-700'}`}>
                                    {isSafety
                                        ? 'Terminasi safety akan dieskalasi ke Ketua Komisi Etik untuk peninjauan langsung.'
                                        : 'Terminasi akan ditinjau oleh Sekretariat Komisi Etik sebelum disetujui.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        {/* Effective Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Tanggal Efektif Terminasi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.effective_date}
                                onChange={(e) => setData('effective_date', e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.effective_date && <p className="text-red-500 text-xs mt-1">{errors.effective_date}</p>}
                        </div>

                        {/* Reason Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kategori Alasan <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'Non-Safety',    label: 'Non-Safety',    desc: 'Alasan non-keselamatan' },
                                    { value: 'Safety',        label: 'Safety',        desc: 'Terkait keselamatan' },
                                    { value: 'Administrative', label: 'Administratif', desc: 'Alasan administratif' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setData('reason_category', opt.value)}
                                        className={`p-3 rounded-xl border-2 text-left transition ${
                                            data.reason_category === opt.value
                                                ? opt.value === 'Safety' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <p className={`font-bold text-xs ${
                                            data.reason_category === opt.value
                                                ? opt.value === 'Safety' ? 'text-red-700' : 'text-blue-700'
                                                : 'text-gray-700'
                                        }`}>{opt.label}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                            {errors.reason_category && <p className="text-red-500 text-xs mt-1">{errors.reason_category}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Deskripsi & Alasan Terminasi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan alasan terminasi secara detail..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Participant Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Status Partisipan Penelitian
                            </label>
                            <input
                                type="text"
                                value={data.participant_status}
                                onChange={(e) => setData('participant_status', e.target.value)}
                                placeholder="Mis: Semua partisipan telah selesai, Belum ada partisipan, dsb."
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.participant_status && <p className="text-red-500 text-xs mt-1">{errors.participant_status}</p>}
                        </div>

                        {/* Safety Measures - only shown if Safety */}
                        {isSafety && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Tindakan Keselamatan yang Diambil
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.safety_measures}
                                    onChange={(e) => setData('safety_measures', e.target.value)}
                                    placeholder="Jelaskan tindakan keselamatan yang telah atau akan dilakukan..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                />
                                {errors.safety_measures && <p className="text-red-500 text-xs mt-1">{errors.safety_measures}</p>}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={route('applicant.trackStatus')}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center text-sm hover:bg-gray-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 ${
                                    isSafety ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                <Upload className="w-4 h-4" />
                                {processing ? 'Mengirim...' : 'Kirim Terminasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
