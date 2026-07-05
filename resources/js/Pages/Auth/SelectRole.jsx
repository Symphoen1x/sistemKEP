import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router } from '@inertiajs/react';
import { Users, ChevronRight } from 'lucide-react';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function SelectRole({ availableRoles }) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const selectRole = (role) => {
        setProcessing(true);
        router.post(route('role.select.store'), { role: role }, {
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false)
        });
    };

    // Format role names for display
    const formatRoleName = (role) => {
        return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <GuestLayout>
            <Head title="Pilih Peran" />

            <div className="text-center mb-8">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> 
                    Pilih Peran Anda
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Akun Anda memiliki lebih dari satu peran. Silakan pilih peran yang ingin Anda gunakan untuk sesi ini.
                </p>
            </div>

            <div className="space-y-4">
                {availableRoles.map((role) => (
                    <button
                        key={role}
                        onClick={() => selectRole(role)}
                        disabled={processing}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {formatRoleName(role)}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Masuk sebagai {formatRoleName(role)}
                            </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </button>
                ))}
            </div>

            <InputError message={errors.role} className="mt-4 text-center" />
        </GuestLayout>
    );
}
