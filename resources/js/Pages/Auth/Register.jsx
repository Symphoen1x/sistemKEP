import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="text-center mb-8">
                <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    Daftar Akun Baru
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Lengkapi formulir di bawah untuk membuat akun
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="sr-only" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        placeholder="Nama Lengkap"
                        autoComplete="name"
                        isFocused={true}
                        icon={User}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="sr-only" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        placeholder="Alamat Email"
                        autoComplete="username"
                        icon={Mail}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor Telepon" className="sr-only" />
                    <TextInput
                        id="phone_number"
                        type="text"
                        name="phone_number"
                        value={data.phone_number}
                        className="mt-1 block w-full"
                        placeholder="Nomor Telepon"
                        autoComplete="tel"
                        icon={User}
                        onChange={(e) => setData('phone_number', e.target.value)}
                    />
                    <InputError message={errors.phone_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="address" value="Alamat Lengkap" className="sr-only" />
                    <TextInput
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        placeholder="Alamat Lengkap"
                        autoComplete="street-address"
                        icon={User}
                        onChange={(e) => setData('address', e.target.value)}
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="sr-only" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        placeholder="Kata Sandi"
                        autoComplete="new-password"
                        icon={Lock}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="sr-only" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        placeholder="Konfirmasi Kata Sandi"
                        autoComplete="new-password"
                        icon={Lock}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton isLoading={processing}>
                        Daftar sebagai Peneliti
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Sudah punya akun?{' '}
                    <Link
                        href={route('login')}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors"
                    >
                        Masuk ke akun
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
