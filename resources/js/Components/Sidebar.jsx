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
    CheckSquare
} from 'lucide-react';

export default function Sidebar() {
    const { auth } = usePage().props;
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
                    label: 'Riwayat Pengajuan',
                    icon: History,
                    route: 'applicant.riwayat',
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
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-500/20">
                    KEP
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-wide uppercase leading-none">Sistem KEP</span>
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
            <div className="p-4 border-t border-slate-800">
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
