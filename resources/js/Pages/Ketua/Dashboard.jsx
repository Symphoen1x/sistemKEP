import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { 
    Layers, 
    CheckSquare, 
    AlertTriangle, 
    Clock, 
    CheckCircle,
    Calendar,
    Activity,
    ThumbsUp,
    ThumbsDown,
    BarChart3
} from 'lucide-react';

export default function Dashboard({ auth, stats, recentProposals = [], activities = [], schedules = [] }) {
    const user = auth.user;

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dashboard Ketua Komisi Etik" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Ketua Komisi Etik</h2>
                        <p className="text-xs text-gray-500 font-medium">Selamat datang kembali, Ketua Komisi Etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
                        <div className="space-y-3 z-10">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                                Kepemimpinan Komisi Etik
                            </span>
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{user.name}</h3>
                            <p className="text-sm text-slate-100 font-medium leading-relaxed max-w-xl">
                                Sebagai Ketua Komisi Etik, Anda memiliki tanggung jawab mengelola dan mengawasi semua proses telaah etik penelitian kesehatan.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-xs font-semibold">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Total Proposal</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Pending</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-orange-600">{stats.direview}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Direview</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-yellow-600">{stats.revisi}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Perlu Revisi</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-green-600">{stats.disetujui}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Disetujui</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-red-600">{stats.ditolak}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Ditolak</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Middle Column: Activities & Recent Proposals */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Recent Proposals */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                    <span>Proposal Terbaru</span>
                                </h3>
                                <div className="space-y-4">
                                    {recentProposals.length > 0 ? (
                                        recentProposals.map((prop) => (
                                            <div key={prop.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                                                {prop.nomor_pengajuan}
                                                            </span>
                                                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                                prop.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                                                                prop.status === 'Direview' ? 'bg-orange-50 text-orange-600' :
                                                                prop.status === 'Revisi' ? 'bg-yellow-50 text-yellow-600' :
                                                                prop.status === 'Disetujui' ? 'bg-green-50 text-green-600' :
                                                                'bg-red-50 text-red-600'
                                                            }`}>
                                                                {prop.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900">{prop.judul}</p>
                                                        <p className="text-xs text-gray-500 font-semibold">
                                                            {prop.peneliti} | {prop.institusi}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Reviewer: {prop.reviewer}
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-xs text-gray-400 font-medium">
                                                        {prop.updated_at}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 font-medium italic">Tidak ada proposal untuk ditampilkan.</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activities Feed */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-600" />
                                    <span>Log Aktivitas Sistem Terbaru</span>
                                </h3>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {activities.length > 0 ? (
                                            activities.map((act, actIdx) => (
                                                <li key={actIdx}>
                                                    <div className="relative pb-8">
                                                        {actIdx !== activities.length - 1 ? (
                                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                        ) : null}
                                                        <div className="relative flex space-x-3">
                                                            <div>
                                                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                                    act.type === 'success' ? 'bg-green-50 text-green-600' :
                                                                    act.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
                                                                    act.type === 'danger' ? 'bg-red-50 text-red-600' :
                                                                    act.type === 'purple' ? 'bg-purple-50 text-purple-600' :
                                                                    'bg-blue-50 text-blue-600'
                                                                }`}>
                                                                    <Activity className="w-4 h-4" />
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">{act.text}</p>
                                                                </div>
                                                                <div className="text-right text-xs whitespace-nowrap text-gray-400 font-medium">
                                                                    <time>{act.time}</time>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400 font-medium">Belum ada log aktivitas.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right/Sidebar Column: Upcoming Meetings */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                    <span>Jadwal Rapat Komisi</span>
                                </h3>
                                <div className="space-y-4">
                                    {schedules.length > 0 ? (
                                        schedules.map((sch) => (
                                            <div key={sch.id} className="border-l-4 border-indigo-500 pl-4 py-1 space-y-1">
                                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                                                    {new Date(sch.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} — {sch.waktu.substring(0, 5)} WIB
                                                </p>
                                                <p className="text-xs font-bold text-gray-900 leading-snug">{sch.agenda}</p>
                                                <p className="text-[10px] text-gray-500 font-semibold">{sch.tempat}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-400 font-medium">Belum ada agenda rapat terdaftar.</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                <h3 className="font-bold text-gray-900 text-sm">Menu Cepat</h3>
                                <div className="space-y-2">
                                    <Link 
                                        href={route('ketua.profil')}
                                        className="w-full block px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
                                    >
                                        Profil Saya
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
