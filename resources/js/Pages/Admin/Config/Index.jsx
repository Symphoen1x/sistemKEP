import { useState } from 'react';
import { usePage, Head, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Settings, Save, Check } from 'lucide-react';

const groupLabels = {
    review:      'Parameter Review',
    institution: 'Informasi Institusi',
    general:     'Konfigurasi Umum',
};

export default function Index({ configs }) {
    const { flash } = usePage().props;
    const [localConfigs, setLocalConfigs] = useState(() => {
        const flat = {};
        Object.values(configs).forEach(group => {
            group.forEach(item => { flat[item.key] = item.value || ''; });
        });
        return flat;
    });

    const [processing, setProcessing] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        const configsArray = Object.entries(localConfigs).map(([key, value]) => ({ key, value }));
        
        router.post(route('admin.config.update'), { configs: configsArray }, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Konfigurasi Sistem" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-gray-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Konfigurasi Sistem</h2>
                            <p className="text-xs text-gray-500 font-medium">Atur parameter review dan informasi institusi</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                    {flash?.success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" /> {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        {Object.entries(configs).map(([group, items]) => (
                            <div key={group} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                    {groupLabels[group] || group}
                                </h3>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.key}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                {item.label}
                                            </label>
                                            {item.description && (
                                                <p className="text-xs text-gray-400 mb-1.5">{item.description}</p>
                                            )}
                                            <input
                                                type="text"
                                                value={localConfigs[item.key] ?? ''}
                                                onChange={(e) => setLocalConfigs(prev => ({ ...prev, [item.key]: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Konfigurasi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
