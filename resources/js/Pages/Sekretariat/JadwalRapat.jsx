import { Head, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function JadwalRapat({ schedules = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, patch, reset, processing, errors } = useForm({
        agenda: '',
        tanggal: '',
        waktu: '',
        tempat: '',
        status: 'Terjadwal',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('sekretariat.rapat.update', editingId), {
                onSuccess: () => {
                    alert('Jadwal rapat berhasil diperbarui.');
                    handleCancelEdit();
                }
            });
        } else {
            post(route('sekretariat.rapat.store'), {
                onSuccess: () => {
                    alert('Jadwal rapat berhasil dibuat.');
                    reset();
                }
            });
        }
    };

    const handleEdit = (sch) => {
        setIsEditing(true);
        setEditingId(sch.id);
        setData({
            agenda: sch.agenda,
            tanggal: sch.tanggal,
            waktu: sch.waktu,
            tempat: sch.tempat,
            status: sch.status,
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin menghapus jadwal rapat ini?')) {
            router.delete(route('sekretariat.rapat.destroy', id), {
                onSuccess: () => {
                    alert('Jadwal rapat berhasil dihapus.');
                }
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Manajemen Jadwal Rapat Etik" />

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Jadwal Rapat & Sidang</h2>
                        <p className="text-xs text-gray-500 font-medium">Jadwal sidang pleno penetapan kelayakan etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add/Edit Calendar Form */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span>{isEditing ? 'Ubah Rapat' : 'Tambah Rapat Baru'}</span>
                            </h3>

                            <div className="space-y-4 text-xs font-semibold">
                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Agenda Rapat</label>
                                    <input 
                                        type="text" 
                                        value={data.agenda}
                                        onChange={e => setData('agenda', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Contoh: Sidang Pleno Etik Ke-15"
                                        required
                                    />
                                    {errors.agenda && <p className="text-red-500 mt-1">{errors.agenda}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Tanggal</label>
                                    <input 
                                        type="date" 
                                        value={data.tanggal}
                                        onChange={e => setData('tanggal', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.tanggal && <p className="text-red-500 mt-1">{errors.tanggal}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Waktu</label>
                                    <input 
                                        type="time" 
                                        value={data.waktu}
                                        onChange={e => setData('waktu', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {errors.waktu && <p className="text-red-500 mt-1">{errors.waktu}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-gray-700 uppercase">Tempat / Tautan Meeting</label>
                                    <input 
                                        type="text" 
                                        value={data.tempat}
                                        onChange={e => setData('tempat', e.target.value)}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nama Ruangan atau Link Zoom"
                                        required
                                    />
                                    {errors.tempat && <p className="text-red-500 mt-1">{errors.tempat}</p>}
                                </div>

                                {isEditing && (
                                    <div className="space-y-1.5">
                                        <label className="text-gray-700 uppercase">Status Rapat</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Terjadwal">Terjadwal</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Batal">Batal</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Batal</span>
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    <span>{isEditing ? 'Simpan' : 'Tambah'}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Scheduled Lists */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 font-bold text-gray-900">
                                Jadwal Sidang Terdaftar
                            </div>
                            <div className="divide-y divide-gray-100 text-xs font-semibold">
                                {schedules.length > 0 ? (
                                    schedules.map((sch) => (
                                        <div key={sch.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                        {new Date(sch.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                        sch.status === 'Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        sch.status === 'Batal' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                        {sch.status}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 leading-snug">{sch.agenda}</h4>
                                                <p className="text-xs text-gray-500 font-medium">Waktu: {sch.waktu.substring(0, 5)} WIB | Tempat: {sch.tempat}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(sch)}
                                                    className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-xl transition-colors border border-gray-200"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(sch.id)}
                                                    className="p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors border border-gray-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500 font-medium">
                                        Tidak ada jadwal rapat terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
