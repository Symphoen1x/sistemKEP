import { Head, useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { User, Phone, MapPin, Building2, BookOpen, Fingerprint, Save } from 'lucide-react';

export default function Profil() {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        institution: user.institution || '',
        role_type: user.role_type || 'Mahasiswa',
        nidn_nim: user.nidn_nim || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('applicant.profil.update'), {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Profil Akun Peneliti" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Profil Saya</h2>
                        <p className="text-xs text-gray-500 font-medium">Ubah informasi kontak, data akademik, dan institusi Anda</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-4xl w-full mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 space-y-6">
                            <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Informasi Profil</h4>

                            {recentlySuccessful && (
                                <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold">
                                    Profil Anda berhasil diperbarui!
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span>Nama Lengkap</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500" 
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <Fingerprint className="w-4 h-4 text-gray-400" />
                                        <span>NIDN / NIM</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.nidn_nim} 
                                        onChange={e => setData('nidn_nim', e.target.value)} 
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500" 
                                    />
                                    {errors.nidn_nim && <p className="text-xs text-red-600">{errors.nidn_nim}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <span>Institusi</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.institution} 
                                        onChange={e => setData('institution', e.target.value)} 
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500" 
                                    />
                                    {errors.institution && <p className="text-xs text-red-600">{errors.institution}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                        <span>Peran Peneliti</span>
                                    </label>
                                    <select 
                                        value={data.role_type} 
                                        onChange={e => setData('role_type', e.target.value)} 
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500"
                                    >
                                        <option value="Mahasiswa">Mahasiswa</option>
                                        <option value="Dosen">Dosen</option>
                                        <option value="Peneliti">Peneliti Utama</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>Nomor Telepon</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.phone_number} 
                                        onChange={e => setData('phone_number', e.target.value)} 
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500" 
                                    />
                                    {errors.phone_number && <p className="text-xs text-red-600">{errors.phone_number}</p>}
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-gray-700 uppercase flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>Alamat Rumah/Kantor</span>
                                    </label>
                                    <textarea 
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)} 
                                        rows="3"
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500" 
                                    />
                                    {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>Simpan Perubahan</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
