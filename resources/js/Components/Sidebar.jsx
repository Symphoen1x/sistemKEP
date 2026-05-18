// File: resources/js/Components/Sidebar.jsx
import { Link } from '@inertiajs/react';

export default function Sidebar() {
    // Fungsi bantuan untuk menandai menu mana yang sedang aktif (opsional tapi disarankan)
    const isActive = (path) => route().current(path) ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white flex flex-col shadow-lg z-50">
            {/* Logo / Judul Aplikasi */}
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <span className="text-xl font-bold uppercase tracking-wider">Sistem KEP</span>
            </div>

            {/* Menu Navigasi */}
            <div className="overflow-y-auto overflow-x-hidden flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5">
                        <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-500">Menu Utama</div>
                        </div>
                    </li>

                    {/* Link Dashboard */}
                    <li>
                        <Link href={route('dashboard')} className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-300 hover:text-white border-l-4 border-transparent hover:border-purple-500 pr-6 pl-4 transition-colors ${isActive('dashboard')}`}>
                            <span className="inline-flex justify-center items-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Dashboard</span>
                        </Link>
                    </li>

                    {/* Link Data User (Contoh rute lain, sesuaikan nama rutenya dengan di web.php) */}
                    <li>
                        <Link href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-300 hover:text-white border-l-4 border-transparent hover:border-purple-500 pr-6 pl-4 transition-colors">
                            <span className="inline-flex justify-center items-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Data Peneliti</span>
                        </Link>
                    </li>

                    {/* Link Data Protokol */}
                    <li>
                        <Link href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-300 hover:text-white border-l-4 border-transparent hover:border-purple-500 pr-6 pl-4 transition-colors">
                            <span className="inline-flex justify-center items-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </span>
                            <span className="ml-2 text-sm tracking-wide truncate">Data Protokol</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Bagian Bawah Sidebar (Misal: Logout) */}
            <div className="border-t border-gray-700 p-4">
                <Link href={route('logout')} method="post" as="button" className="w-full flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span className="ml-2 text-sm font-medium">Log Out</span>
                </Link>
            </div>
        </aside>
    );
}
