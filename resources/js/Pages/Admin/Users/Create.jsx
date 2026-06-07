import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

/**
 * PB09 — Admin: Form pembuatan akun internal (Sekretariat / Reviewer / Ketua Komisi Etik).
 * Akun langsung aktif setelah dibuat, email kredensial dikirim otomatis.
 */
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name:         '',
        email:        '',
        role:         '',
        phone_number: '',
        address:      '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    const roles = [
        { value: 'Sekretariat',       label: 'Sekretariat',          desc: 'Memproses dan mengevaluasi pengajuan EC' },
        { value: 'Reviewer',          label: 'Reviewer',             desc: 'Menelaah dan memberikan feedback etik' },
        { value: 'Ketua Komisi Etik', label: 'Ketua Komisi Etik',   desc: 'Memberikan persetujuan akhir & menandatangani surat' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Kembali
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Buat Akun Internal
                    </h2>
                </div>
            }
        >
            <Head title="Buat Akun Internal — Admin" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">

                        {/* Header card */}
                        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Akun yang dibuat di sini berstatus <strong>langsung aktif</strong>. Password sementara akan dikirim secara otomatis ke email yang diisi.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="divide-y divide-gray-100 dark:divide-gray-700">

                            {/* Informasi Dasar */}
                            <div className="px-6 py-5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Informasi Akun
                                </h3>

                                {/* Nama */}
                                <div>
                                    <InputLabel htmlFor="name" value="Nama Lengkap *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="contoh: Dr. Budi Santoso"
                                        autoComplete="off"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {/* Email */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email *" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="contoh: budi@institusi.ac.id"
                                        autoComplete="off"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                            </div>

                            {/* Pilih Peran */}
                            <div className="px-6 py-5 space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Peran *
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {roles.map(({ value, label, desc }) => (
                                        <label
                                            key={value}
                                            htmlFor={`role-${value}`}
                                            className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                                                data.role === value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            <input
                                                id={`role-${value}`}
                                                type="radio"
                                                name="role"
                                                value={value}
                                                checked={data.role === value}
                                                onChange={() => setData('role', value)}
                                                className="sr-only"
                                                required
                                            />
                                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{label}</span>
                                            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</span>
                                            {data.role === value && (
                                                <span className="absolute right-3 top-3">
                                                    <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            {/* Informasi Kontak (opsional) */}
                            <div className="px-6 py-5 space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    Informasi Kontak <span className="normal-case font-normal text-gray-300">(opsional)</span>
                                </h3>

                                <div>
                                    <InputLabel htmlFor="phone_number" value="Nomor Telepon" />
                                    <TextInput
                                        id="phone_number"
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="contoh: 08123456789"
                                    />
                                    <InputError message={errors.phone_number} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="address" value="Alamat" />
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={3}
                                        placeholder="Alamat lengkap..."
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
                                    />
                                    <InputError message={errors.address} className="mt-1" />
                                </div>
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-700/30">
                                <Link
                                    href={route('admin.users.index')}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    Batal
                                </Link>
                                <button
                                    id="btn-submit-create-user"
                                    type="submit"
                                    disabled={processing || !data.role}
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing && (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {processing ? 'Menyimpan...' : 'Buat Akun'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
