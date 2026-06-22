import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserPlus, User, Mail, Lock, BookOpen } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        registration_role: 'Applicant',
        expertise: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const isReviewer = data.registration_role === 'Reviewer';

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
                {/* Pilihan tipe pendaftar */}
                <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Daftar sebagai</p>
                    <div className="grid grid-cols-2 gap-3">
                        <label
                            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
                                !isReviewer
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                            onClick={() => setData('registration_role', 'Applicant')}
                        >
                            <input
                                type="radio"
                                name="registration_role"
                                value="Applicant"
                                checked={!isReviewer}
                                onChange={() => setData('registration_role', 'Applicant')}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Peneliti</p>
                                <p className="text-xs text-slate-500">Pengajuan Ethical Clearance</p>
                            </div>
                        </label>
                        <label
                            className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
                                isReviewer
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                            onClick={() => setData('registration_role', 'Reviewer')}
                        >
                            <input
                                type="radio"
                                name="registration_role"
                                value="Reviewer"
                                checked={isReviewer}
                                onChange={() => setData('registration_role', 'Reviewer')}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Reviewer</p>
                                <p className="text-xs text-slate-500">Penelaah Etik</p>
                            </div>
                        </label>
                    </div>
                    <InputError message={errors.registration_role} className="mt-2" />
                </div>

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

                {/* Field Keahlian — hanya untuk Reviewer */}
                {isReviewer && (
                    <div>
                        <label htmlFor="expertise" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Bidang Keahlian / Spesialisasi <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <textarea
                                id="expertise"
                                name="expertise"
                                value={data.expertise}
                                onChange={(e) => setData('expertise', e.target.value)}
                                rows={3}
                                placeholder="Contoh: Bioetika Penelitian, Farmakologi Klinis, Kesehatan Masyarakat..."
                                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                required
                            />
                        </div>
                        <InputError message={errors.expertise} className="mt-2" />
                    </div>
                )}

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
                        Daftar sebagai {isReviewer ? 'Reviewer' : 'Peneliti'}
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
