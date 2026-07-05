import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { 
    Clock, 
    CheckCircle, 
    Calendar, 
    Bell, 
    ArrowRight, 
    ShieldAlert, 
    FileText 
} from 'lucide-react';

export default function Dashboard({ stats, recentProposals = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dashboard Penelaah Etik (Reviewer)" />

                {/* Top Navbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Reviewer</h2>
                        <p className="text-xs text-gray-500 font-medium">Panel Penilai Kelayakan Etik Penelitian Kesehatan</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
                        <div className="space-y-3 z-10">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-500/20">
                                Penelaah Ahli (Reviewer)
                            </span>
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{user.name}</h3>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                                Selamat datang kembali di sistem komisi etik. Mohon periksa usulan layak etik yang ditugaskan kepada Anda secara berkala demi menjamin objektivitas penelitian.
                            </p>
                        </div>
                    </div>

                    {/* Stats Dashboard Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Waiting Review */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.waiting}</p>
                                <p className="text-xs font-semibold text-gray-500">Menunggu Review</p>
                            </div>
                        </div>

                        {/* Completed Reviews */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
                                <p className="text-xs font-semibold text-gray-500">Telah Direview</p>
                            </div>
                        </div>

                        {/* Next Plenary/Deadline */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-tight">{stats.deadline}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1">Deadline Review Terdekat</p>
                            </div>
                        </div>

                        {/* New Tasks Notifications Count */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.new_tasks}</p>
                                <p className="text-xs font-semibold text-gray-500">Notifikasi Tugas Baru</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Assignments */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-orange-500" />
                                <span>Daftar Usulan Perlu Ditelaah Segera</span>
                            </h4>
                            <Link href={route('reviewer.proposals')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5">
                                <span>Lihat Semua</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100 font-semibold text-xs">
                            {recentProposals.length > 0 ? (
                                recentProposals.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    {item.nomor_pengajuan}
                                                </span>
                                            </div>
                                            <h5 className="font-bold text-gray-900 leading-snug">{item.judul}</h5>
                                            <p className="text-xs text-gray-500 font-semibold">Pengusul: {item.peneliti} | {item.institusi}</p>
                                        </div>
                                        <Link 
                                            href={route('reviewer.review', item.id)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>Mulai Telaah</span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-500 font-medium">
                                    Luar biasa! Tidak ada usulan penelitian yang tertunda untuk ditinjau saat ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
