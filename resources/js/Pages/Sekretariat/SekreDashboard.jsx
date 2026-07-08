import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { 
    Layers, 
    CheckSquare, 
    AlertTriangle, 
    Clock, 
    CheckCircle,
    Calendar,
    Activity
} from 'lucide-react';

export default function SekreDashboard({ stats, activities = [], schedules = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dashboard Sekretariat KEP" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Sekretariat</h2>
                        <p className="text-xs text-gray-500 font-medium">Selamat datang kembali, Tim Administrasi Komisi Etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-xs font-semibold">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Total Masuk</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Pending</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-yellow-600">{stats.revisi}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Perlu Revisi</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-purple-600">{stats.direview}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Direview</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-2xl font-bold text-green-600">{stats.selesai}</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Selesai</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Middle Column: Activities & Pending Registration */}
                        <div className="lg:col-span-2 space-y-8">
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
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span>Jadwal Rapat & Sidang Etik</span>
                                </h3>
                                <div className="space-y-4">
                                    {schedules.length > 0 ? (
                                        schedules.map((sch) => (
                                            <div key={sch.id} className="border-l-4 border-blue-500 pl-4 py-1 space-y-1">
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
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
                                <Link 
                                    href={route('sekretariat.rapat')}
                                    className="w-full flex items-center justify-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors"
                                >
                                    Kelola Jadwal Rapat
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
