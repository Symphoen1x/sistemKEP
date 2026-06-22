import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Head } from '@inertiajs/react';
import { Upload, ToggleLeft, ToggleRight, FileText, Plus, Edit2, X, Check } from 'lucide-react';

export default function Index({ templates }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const uploadForm = useForm({
        name: '',
        description: '',
        version: '1.0',
        file: null,
        published_at: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
        version: '',
        file: null,
        published_at: '',
    });

    const { patch } = useForm({});

    const handleUpload = (e) => {
        e.preventDefault();
        uploadForm.post(route('admin.templates.store'), {
            forceFormData: true,
            onSuccess: () => {
                uploadForm.reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.post(route('admin.templates.update', editTarget.id), {
            forceFormData: true,
            onSuccess: () => {
                editForm.reset();
                setEditTarget(null);
            },
        });
    };

    const openEdit = (tpl) => {
        setEditTarget(tpl);
        editForm.setData({
            name: tpl.name,
            description: tpl.description || '',
            version: tpl.version,
            file: null,
            published_at: '',
        });
    };

    const handleToggle = (tpl) => {
        const msg = tpl.is_active
            ? `Nonaktifkan template "${tpl.name}"?`
            : `Aktifkan template "${tpl.name}"?`;
        if (confirm(msg)) {
            patch(route('admin.templates.toggle', tpl.id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Manajemen Template" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Manajemen Template Dokumen</h2>
                        <p className="text-xs text-gray-500 font-medium">Kelola template yang tersedia untuk Applicant</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Template Baru
                    </button>
                </header>

                <div className="flex-1 p-8 space-y-6 max-w-5xl w-full mx-auto">
                    {flash?.success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" /> {flash.success}
                        </div>
                    )}

                    {/* Form Upload */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Upload Template Baru</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Template *</label>
                                        <input
                                            type="text"
                                            value={uploadForm.data.name}
                                            onChange={(e) => uploadForm.setData('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                            placeholder="Formulir Pengajuan EC"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Versi *</label>
                                        <input
                                            type="text"
                                            value={uploadForm.data.version}
                                            onChange={(e) => uploadForm.setData('version', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                            placeholder="1.0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi</label>
                                    <textarea
                                        value={uploadForm.data.description}
                                        onChange={(e) => uploadForm.setData('description', e.target.value)}
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Deskripsi singkat template..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">File (PDF/DOCX) *</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => uploadForm.setData('file', e.target.files[0])}
                                            className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Berlaku</label>
                                        <input
                                            type="date"
                                            value={uploadForm.data.published_at}
                                            onChange={(e) => uploadForm.setData('published_at', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploadForm.processing}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploadForm.processing ? 'Mengunggah...' : 'Simpan Template'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editTarget && (
                        <div className="bg-white rounded-2xl border border-yellow-300 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Edit Template: {editTarget.name}</h3>
                                <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama *</label>
                                        <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Versi *</label>
                                        <input type="text" value={editForm.data.version} onChange={(e) => editForm.setData('version', e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Upload File Baru (opsional)</label>
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => editForm.setData('file', e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yellow-50 file:text-yellow-700" />
                                    <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti file</p>
                                </div>
                                <button type="submit" disabled={editForm.processing} className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50">
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Tabel Template */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Template</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Versi</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Berlaku</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {templates.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            Belum ada template. Klik "Upload Template Baru" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : templates.map((tpl) => (
                                    <tr key={tpl.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{tpl.name}</p>
                                                    {tpl.description && (
                                                        <p className="text-xs text-gray-500 mt-0.5">{tpl.description}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400">{tpl.original_filename}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">v{tpl.version}</span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-gray-600">{tpl.published_at || '-'}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tpl.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {tpl.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <a href={tpl.file_path} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Unduh</a>
                                                <button onClick={() => openEdit(tpl)} className="text-yellow-600 hover:text-yellow-800">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleToggle(tpl)} title={tpl.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                                                    {tpl.is_active
                                                        ? <ToggleRight className="w-5 h-5 text-green-500 hover:text-green-700" />
                                                        : <ToggleLeft className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
