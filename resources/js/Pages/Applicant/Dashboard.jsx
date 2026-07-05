import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { 
    FileText, 
    CheckCircle, 
    Clock, 
    AlertTriangle, 
    Calendar, 
    Megaphone,
    ArrowRight,
    MessageSquare,
    User
} from 'lucide-react';

export default function Dashboard({ stats, recentProposals = [], revisions = [], schedules = [], announcements = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const getStatusBadge = (status) => {
        const styles = {
            'Disetujui': 'bg-green-50 text-green-700 border-green-200',
            'Direview': 'bg-blue-50 text-blue-700 border-blue-200',
            'Revisi': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'Ditolak': 'bg-red-50 text-red-700 border-red-200',
            'Pending': 'bg-gray-50 text-gray-700 border-gray-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Pending']}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Dashboard Peneliti" />

                {/* Top Navbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Dashboard Peneliti</h2>
                        <p className="text-xs text-gray-500 font-medium">Selamat datang kembali di Portal Kode Etik Penelitian</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard body */}
                <div className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl shadow-blue-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
                        <div className="space-y-3 z-10">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                                Peneliti Aktif
                            </span>
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{user.name}</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    Role: {user.role_type || 'Peneliti'}
                                </span>
                                <span>•</span>
                                <span>Institusi: {user.institution || 'Universitas Indonesia'}</span>
                                {user.nidn_nim && (
                                    <>
                                        <span>•</span>
                                        <span>NIDN/NIM: {user.nidn_nim}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <Link 
                            href={route('applicant.pengajuan')}
                            className="bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md hover:shadow-lg flex items-center gap-2 z-10 shrink-0 self-stretch md:self-auto justify-center"
                        >
                            <span>Buat Pengajuan Baru</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.aktif}</p>
                                <p className="text-sm font-medium text-gray-500">Pengajuan Aktif</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.disetujui}</p>
                                <p className="text-sm font-medium text-gray-500">Disetujui</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.menunggu}</p>
                                <p className="text-sm font-medium text-gray-500">Menunggu Review</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                            <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.revisi}</p>
                                <p className="text-sm font-medium text-gray-500">Perlu Revisi</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Dashboard Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Recent Submissions & Revisions */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Table Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h4 className="font-bold text-gray-900">Status Pengajuan Terbaru</h4>
                                    <Link href={route('applicant.trackStatus')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        <span>Lihat Semua</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Judul Penelitian</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 font-medium">
                                            {recentProposals.length > 0 ? (
                                                recentProposals.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                                            {item.nomor_pengajuan || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 max-w-xs truncate">
                                                            {item.judul}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {getStatusBadge(item.status)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-medium">
                                                        Belum ada data pengajuan. Silakan buat pengajuan penelitian baru.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Revision Notifications Card */}
                            {revisions.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 text-yellow-600">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span>Perlu Revisi Segera</span>
                                    </h4>
                                    <div className="space-y-4">
                                        {revisions.map((item) => (
                                            <div key={item.id} className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-gray-900">{item.nomor_pengajuan} — {item.judul}</p>
                                                    <p className="text-xs text-gray-600 font-medium">
                                                        Catatan: <span className="italic">"{item.catatan_revisi}"</span>
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route('applicant.trackStatus')}
                                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    <span>Revisi Sekarang</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Schedules & Announcements */}
                        <div className="space-y-8">
                            {/* Jadwal Sidang Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span>Jadwal Sidang / Rapat Etik</span>
                                </h4>
                                <div className="space-y-4">
                                    {schedules.length > 0 ? (
                                        schedules.map((sch) => (
                                            <div key={sch.id} className="border-l-4 border-blue-500 pl-4 py-1 space-y-1">
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                    {new Date(sch.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} — {sch.waktu.substring(0, 5)} WIB
                                                </p>
                                                <p className="text-sm font-semibold text-gray-900 leading-snug">{sch.agenda}</p>
                                                <p className="text-xs text-gray-500 font-medium">{sch.tempat}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 font-medium">Belum ada jadwal sidang terdekat.</p>
                                    )}
                                </div>
                            </div>

                            {/* Announcements Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Megaphone className="w-5 h-5 text-indigo-600" />
                                    <span>Pengumuman Komisi Etik</span>
                                </h4>
                                <div className="space-y-6">
                                    {announcements.length > 0 ? (
                                        announcements.map((ann) => (
                                            <div key={ann.id} className="space-y-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h5 className="text-sm font-bold text-gray-900 leading-snug">{ann.judul}</h5>
                                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                                                        {new Date(ann.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 leading-relaxed font-medium line-clamp-3">
                                                    {ann.isi}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-medium">Oleh: {ann.author}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 font-medium">Belum ada pengumuman.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
