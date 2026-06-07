import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="text-center mb-6">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    <MailCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> 
                    Verifikasi Email Anda
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan ke email Anda. Jika Anda tidak menerima email tersebut, kami akan dengan senang hati mengirimkan tautan baru.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg text-center">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit} className="mt-8">
                <div className="flex flex-col space-y-4">
                    <PrimaryButton isLoading={processing}>
                        Kirim Ulang Email Verifikasi
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline font-medium transition-colors w-full text-center"
                    >
                        Keluar
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
