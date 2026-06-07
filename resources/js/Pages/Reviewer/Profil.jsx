import { Head, useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { User, Phone, MapPin, Building, GraduationCap, Save } from 'lucide-react';

export default function Profil() {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        institution: user.institution || '',
        role_type: user.role_type || '',
        nidn_nim: user.nidn_nim || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviewer.profil.update'), {
            onSuccess: () => alert('Profil berhasil disimpan!'),
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Profil Akun - Reviewer" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Profil Saya</h2>
                        <p className="text-xs text-gray-500 font-medium">Perbarui detail keahlian dan akademis Anda</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                                {data.name ? data.name[0] : 'R'}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{data.name || 'Nama Lengkap'}</h3>
                                <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold text-gray-700">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 uppercase">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>Nama Lengkap & Gelar</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 uppercase">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>No. Handphone</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.phone_number}
                                    onChange={e => setData('phone_number', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.phone_number && <p className="text-red-500 mt-1">{errors.phone_number}</p>}
                            </div>

                            {/* Institution */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 uppercase">
                                    <Building className="w-4 h-4 text-gray-400" />
                                    <span>Fakultas / Instansi</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.institution}
                                    onChange={e => setData('institution', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* NIDN */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 uppercase">
                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                    <span>NIDN / NIP</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nidn_nim}
                                    onChange={e => setData('nidn_nim', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="flex items-center gap-1.5 uppercase">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>Alamat Lengkap</span>
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    rows="3"
                                    className="w-full rounded-xl border-gray-200 text-xs focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-50">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>Simpan Profil</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
