import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="text-center mb-6">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    <KeyRound className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> 
                    Lupa Kata Sandi
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        placeholder="Alamat Email"
                        autoComplete="username"
                        isFocused={true}
                        icon={Mail}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-6">
                    <PrimaryButton isLoading={processing}>
                        Kirim Tautan Reset
                    </PrimaryButton>
                </div>
                
                <div className="mt-6 text-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Masuk
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
