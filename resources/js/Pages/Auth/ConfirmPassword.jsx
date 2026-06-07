import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="text-center mb-6">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> 
                    Konfirmasi Akses
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Ini adalah area aman aplikasi. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Password" className="sr-only" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        placeholder="Kata Sandi"
                        isFocused={true}
                        icon={Lock}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton isLoading={processing}>
                        Konfirmasi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
