import { Head, router, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function Profil({ user }) {
    const { auth } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number || '',
        address: user.address || '',
        institution: user.institution || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('ketua.profil.update'), formData, {
            onSuccess: () => {
                setIsEditing(false);
                alert('Profil berhasil diperbarui');
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Profil Ketua Komisi Etik" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Profil Saya</h2>
                        <p className="text-xs text-gray-500 font-medium">Kelola informasi profil Ketua Komisi Etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 space-y-8 max-w-4xl w-full mx-auto">
                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{user.name}</h3>
                                    <p className="text-sm text-slate-100 font-medium">Ketua Komisi Etik</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    isEditing 
                                        ? 'bg-white text-indigo-600 hover:bg-gray-100'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                {isEditing ? 'Batal' : 'Edit Profil'}
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="p-8">
                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Telepon</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900">{user.phone_number || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Institution */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institusi</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900">{user.institution || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat</label>
                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="text-sm font-medium text-gray-900">{user.address || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Email (Read-only) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nomor Telepon</label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Institution */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Institusi</label>
                                            <input
                                                type="text"
                                                name="institution"
                                                value={formData.institution}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
