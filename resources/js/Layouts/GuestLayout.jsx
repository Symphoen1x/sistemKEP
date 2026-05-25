import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 pt-6 sm:pt-0 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-800 dark:text-slate-200 px-4">
            <div className="mb-8">
                <Link href="/" className="flex flex-col items-center gap-3">
                    {/* Placeholder Logo yang bisa diganti nanti */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700">
                        <ShieldCheck className="h-12 w-12 text-indigo-700 dark:text-indigo-400" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sistem KEP</span>
                </Link>
            </div>

            <div className="w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full overflow-hidden bg-white px-8 py-10 shadow-xl sm:rounded-2xl dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    {children}
                </div>
            </div>
        </div>
    );
}
