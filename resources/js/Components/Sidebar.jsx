import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    History,
    FolderOpen,
    MessageSquare,
    User,
    HelpCircle,
    LogOut,
    UserCheck,
    ClipboardCheck,
    Users,
    Calendar,
    Award,
    TrendingUp,
    ShieldCheck,
    UserPlus,
    CheckSquare,
    FileSignature,
    Bell,
    Settings,
    ClipboardList,
    ShieldOff,
    ShieldAlert,
    FileEdit
} from 'lucide-react';

export default function Sidebar() {
    const { auth, notifications_count } = usePage().props;
    const activeRole = auth?.active_role || 'Applicant';

    const isActive = (routeName) => {
        return route().current(routeName) || route().current(routeName + '.*')
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white';
    };

    // Define sidebar menu items based on role
    const getMenuItems = () => {
        if (activeRole === 'Admin') {
            return [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    route: 'admin.dashboard',
                },
                {
                    label: 'Manajemen Pengguna',
                    icon: Users,
                    route: 'admin.users.index',
                },
                {
                    label: 'Buat Akun Internal',
                    icon: UserPlus,
                    route: 'admin.users.create',
                },
                {
                    label: 'Alur Proposal',
                    icon: FileText,
                    route: 'admin.proposals.index',
                },
                {
                    label: 'Manajemen Template',
                    icon: FolderOpen,
                    route: 'admin.templates.index',
                },
                {
                    label: 'Konfigurasi Sistem',
                    icon: Settings,
                    route: 'admin.config.index',
                },
                {
                    label: 'Laporan & Statistik',
                    icon: TrendingUp,
                    route: 'admin.laporan',
                },
                {
                    label: 'Audit Log',
                    icon: ClipboardList,
                    route: 'admin.audit-log.index',
                }
            ];
        } else if (activeRole === 'Sekretariat') {
            return [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    route: 'sekretariat.dashboard',
                },
                {
                    label: 'Verifikasi Pendaftar',
                    icon: UserCheck,
                    route: 'sekretariat.users.pending',
                },
                {
                    label: 'Verifikasi Pengajuan',
                    icon: ClipboardCheck,
                    route: 'sekretariat.verifikasi',
                },
                {
                    label: 'Penugasan Reviewer',
                    icon: ShieldCheck,
                    route: 'sekretariat.reviewer',
                },
                {
                    label: 'Pengambilan Keputusan',
                    icon: CheckSquare,
                    route: 'sekretariat.pengambilanKeputusan',
                },
                {
                    label: 'Review Amendment',
                    icon: FileEdit,
                    route: 'sekretariat.amendments.index',
                },
                {
                    label: 'Review Terminasi',
                    icon: ShieldOff,
                    route: 'sekretariat.terminations.index',
                },
                {
                    label: 'Jadwal Rapat',
                    icon: Calendar,
                    route: 'sekretariat.rapat',
                },
                {
                    label: 'Surat & Sertifikat',
                    icon: Award,
                    route: 'sekretariat.surat',
                },
                {
                    label: 'Manajemen Dokumen',
                    icon: FolderOpen,
                    route: 'sekretariat.dokumen',
                },
                {
                    label: 'Laporan & Statistik',
                    icon: TrendingUp,
                    route: 'sekretariat.laporan',
                },
                {
                    label: 'Profil Akun',
                    icon: User,
                    route: 'sekretariat.profil',
                }
            ];
        } else if (activeRole === 'Reviewer') {
            return [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    route: 'reviewer.dashboard',
                },
                {
                    label: 'Daftar Proposal',
                    icon: FileText,
                    route: 'reviewer.proposals',
                },
                {
                    label: 'Review Amendment',
                    icon: FileEdit,
                    route: 'reviewer.amendmentReviews',
                },
                {
                    label: 'Riwayat Review',
                    icon: History,
                    route: 'reviewer.history',
                },
                {
                    label: 'Jadwal Review',
                    icon: Calendar,
                    route: 'reviewer.schedules',
                },
                {
                    label: 'Profil Akun',
                    icon: User,
                    route: 'reviewer.profil',
                }
            ];
        } else if (activeRole === 'Ketua Komisi Etik') {
            return [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    route: 'ketua.dashboard',
                },
                {
                    label: 'Pengambilan Keputusan',
                    icon: CheckSquare,
                    route: 'ketua.pengambilanKeputusan',
                },
                {
                    label: 'Surat Menunggu TTD',
                    icon: FileSignature,
                    route: 'ketua.suratTTD',
                },
                {
                    label: 'Eskalasi Terminasi',
                    icon: ShieldAlert,
                    route: 'ketua.terminations.eskalasi',
                },
                {
                    label: 'Laporan & Statistik',
                    icon: TrendingUp,
                    route: 'ketua.laporan',
                },
                {
                    label: 'Profil Akun',
                    icon: User,
                    route: 'ketua.profil',
                }
            ];
        } else {
            // Default to Applicant (Peneliti)
            return [
                {
                    label: 'Dashboard',
                    icon: LayoutDashboard,
                    route: 'applicant.dashboard',
                },
                {
                    label: 'Pengajuan Penelitian',
                    icon: FileText,
                    route: 'applicant.pengajuan',
                },
                {
                    label: 'Status & Riwayat',
                    icon: History,
                    route: 'applicant.trackStatus',
                },
                {
                    label: 'Unduh Dokumen',
                    icon: FolderOpen,
                    route: 'applicant.dokumen',
                },
                {
                    label: 'Pesan & Notifikasi',
                    icon: MessageSquare,
                    route: 'applicant.pesan',
                },
                {
                    label: 'Profil Akun',
                    icon: User,
                    route: 'applicant.profil',
                },
                {
                    label: 'Bantuan & Panduan',
                    icon: HelpCircle,
                    route: 'applicant.bantuan',
                }
            ];
        }
    };

    const menuItems = getMenuItems();

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-[#0f172a] text-white flex flex-col z-50 border-r border-slate-800">
            {/* Header / Logo */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3">
                    <img src="../images/KEP.png" alt="Logo KEP" className="w-9 h-9 rounded-full" />
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wide uppercase leading-none">XYNORA</span>
                    <span className="text-[10px] text-gray-500 font-semibold mt-0.5 uppercase tracking-wider">{activeRole} Portal</span>
                </div>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                    Menu Utama
                </div>
                <nav className="space-y-1">
                    {menuItems.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={route(item.route)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive(item.route)}`}
                            >
                                <IconComponent className="w-4 h-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800 space-y-1">
                {/* Bell icon notifikasi */}
                {notifications_count > 0 && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-blue-600/10 text-blue-400 text-xs font-semibold">
                        <Bell className="w-4 h-4 flex-shrink-0" />
                        <span>{notifications_count} notifikasi baru</span>
                        <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {notifications_count}
                        </span>
                    </div>
                )}
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Keluar Akun</span>
                </Link>
            </div>
        </aside>
    );
}
