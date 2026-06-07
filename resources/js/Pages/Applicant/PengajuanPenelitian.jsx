import { Head, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { useState } from 'react';
import { User, FileText, Settings, Upload, CheckCircle, ArrowLeft, ArrowRight, Save } from 'lucide-react';

export default function PengajuanPenelitian() {
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        // Step 1: Peneliti
        nama: '',
        nidn_nim: '',
        email: '',
        no_hp: '',
        institusi: '',
        role_peneliti: 'Mahasiswa',
        // Step 2: Info Penelitian
        judul: '',
        lokasi_penelitian: '',
        anggota_tim: '',
        subjek_penelitian: '',
        // Step 3: Metodologi
        metode_penelitian: '',
        risiko_penelitian: '',
        deskripsi_penelitian: '',
        // Step 4: Dokumen
        proposal: null,
        informed_consent: null,
        surat_izin: null,
        instrumen: null,
    });

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFileChange = (field, file) => {
        setData(field, file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('applicant.pengajuan.store'), {
            forceFormData: true,
            onSuccess: () => {
                alert('Pengajuan proposal berhasil dikirim!');
            }
        });
    };

    const steps = [
        { id: 1, name: 'Data Peneliti', icon: User },
        { id: 2, name: 'Informasi Penelitian', icon: FileText },
        { id: 3, name: 'Metodologi', icon: Settings },
        { id: 4, name: 'Upload Dokumen', icon: Upload },
        { id: 5, name: 'Review & Submit', icon: CheckCircle },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Pengajuan Usulan Kelaikan Etik" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Pengajuan Penelitian Baru</h2>
                        <p className="text-xs text-gray-500 font-medium">Lengkapi 5 tahap formulir kelayakan etik penelitian</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-4xl w-full mx-auto space-y-8">
                    {/* Stepper Progress */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            {steps.map((s, idx) => {
                                const Icon = s.icon;
                                const isActive = step === s.id;
                                const isCompleted = step > s.id;
                                return (
                                    <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                                isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                                isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[10px] font-bold hidden md:inline text-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {s.name}
                                            </span>
                                        </div>
                                        {idx !== steps.length - 1 && (
                                            <div className={`h-1 flex-1 mx-4 rounded ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Forms */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 space-y-6">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 text-base">Tahap 1: Data Identitas Peneliti</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Nama Lengkap</label>
                                            <input 
                                                type="text" 
                                                value={data.nama} 
                                                onChange={e => setData('nama', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">NIDN / NIM</label>
                                            <input 
                                                type="text" 
                                                value={data.nidn_nim} 
                                                onChange={e => setData('nidn_nim', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Email Utama</label>
                                            <input 
                                                type="email" 
                                                value={data.email} 
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Nomor HP / WhatsApp</label>
                                            <input 
                                                type="text" 
                                                value={data.no_hp} 
                                                onChange={e => setData('no_hp', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Institusi / Universitas</label>
                                            <input 
                                                type="text" 
                                                value={data.institusi} 
                                                onChange={e => setData('institusi', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Peran Peneliti</label>
                                            <select 
                                                value={data.role_peneliti} 
                                                onChange={e => setData('role_peneliti', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500"
                                            >
                                                <option value="Mahasiswa">Mahasiswa</option>
                                                <option value="Dosen">Dosen</option>
                                                <option value="Peneliti">Peneliti Utama</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 text-base">Tahap 2: Informasi Penelitian</h3>
                                    <div className="grid grid-cols-1 gap-6 text-xs font-semibold">
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Judul Penelitian</label>
                                            <input 
                                                type="text" 
                                                value={data.judul} 
                                                onChange={e => setData('judul', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-gray-700">Lokasi Penelitian</label>
                                                <input 
                                                    type="text" 
                                                    value={data.lokasi_penelitian} 
                                                    onChange={e => setData('lokasi_penelitian', e.target.value)}
                                                    className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-gray-700">Subjek Penelitian (Partisipan)</label>
                                                <input 
                                                    type="text" 
                                                    value={data.subjek_penelitian} 
                                                    onChange={e => setData('subjek_penelitian', e.target.value)}
                                                    className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                    placeholder="Contoh: Pasien, Mahasiswa, Hewan Coba"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Anggota Tim (Opsional)</label>
                                            <textarea 
                                                value={data.anggota_tim} 
                                                onChange={e => setData('anggota_tim', e.target.value)}
                                                rows="3"
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                placeholder="Tuliskan nama anggota tim dipisahkan dengan koma..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 text-base">Tahap 3: Metodologi & Risiko</h3>
                                    <div className="grid grid-cols-1 gap-6 text-xs font-semibold">
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Metode Penelitian</label>
                                            <textarea 
                                                value={data.metode_penelitian} 
                                                onChange={e => setData('metode_penelitian', e.target.value)}
                                                rows="3"
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                placeholder="Deskripsikan pendekatan, desain riset, dan analisis data..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Risiko Penelitian Terhadap Subjek</label>
                                            <textarea 
                                                value={data.risiko_penelitian} 
                                                onChange={e => setData('risiko_penelitian', e.target.value)}
                                                rows="3"
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                placeholder="Tuliskan risiko fisik/psikologis/sosial serta cara mitigasinya..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-gray-700">Deskripsi / Abstrak Singkat</label>
                                            <textarea 
                                                value={data.deskripsi_penelitian} 
                                                onChange={e => setData('deskripsi_penelitian', e.target.value)}
                                                rows="4"
                                                className="w-full rounded-xl border-gray-200 text-sm focus:ring-blue-500" 
                                                placeholder="Tuliskan intisari latar belakang dan tujuan riset..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 text-base">Tahap 4: Unggah Dokumen Syarat</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                                        <div className="p-5 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center space-y-2">
                                            <FileText className="w-8 h-8 text-red-500" />
                                            <div>
                                                <p className="font-bold text-gray-900">Proposal Penelitian</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Wajib | PDF maks. 5MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                onChange={e => handleFileChange('proposal', e.target.files[0])}
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="p-5 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center space-y-2">
                                            <FileText className="w-8 h-8 text-blue-500" />
                                            <div>
                                                <p className="font-bold text-gray-900">Informed Consent</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Wajib | PDF maks. 5MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                onChange={e => handleFileChange('informed_consent', e.target.files[0])}
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="p-5 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center space-y-2">
                                            <FileText className="w-8 h-8 text-indigo-500" />
                                            <div>
                                                <p className="font-bold text-gray-900">Surat Izin Tempat Penelitian</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Wajib | PDF maks. 5MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                onChange={e => handleFileChange('surat_izin', e.target.files[0])}
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="p-5 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center space-y-2">
                                            <FileText className="w-8 h-8 text-orange-500" />
                                            <div>
                                                <p className="font-bold text-gray-900">Instrumen Kuesioner (Opsional)</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">PDF maks. 5MB</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                onChange={e => handleFileChange('instrumen', e.target.files[0])}
                                                className="text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 text-base">Tahap 5: Tinjau dan Kirim</h3>
                                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4 text-xs font-semibold">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400">Judul Penelitian</p>
                                                <p className="font-bold text-gray-900 mt-0.5 text-sm">{data.judul || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Peneliti Utama</p>
                                                <p className="font-bold text-gray-900 mt-0.5">{data.nama || '-'} ({data.role_peneliti})</p>
                                                <p className="text-[10px] text-gray-500">NIDN/NIM: {data.nidn_nim} | {data.institusi}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Lokasi & Subjek</p>
                                                <p className="font-bold text-gray-900 mt-0.5">{data.lokasi_penelitian || '-'} / {data.subjek_penelitian || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Dokumen Siap Unggah</p>
                                                <ul className="list-disc pl-4 text-gray-950 mt-1 space-y-0.5">
                                                    <li>Proposal: {data.proposal ? data.proposal.name : 'Simulasi Mock Proposal'}</li>
                                                    <li>Informed Consent: {data.informed_consent ? data.informed_consent.name : 'Simulasi Mock Consent'}</li>
                                                    <li>Surat Izin: {data.surat_izin ? data.surat_izin.name : 'Simulasi Mock Surat Izin'}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200 flex items-center gap-1.5"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Sebelumnya</span>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 5 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                                >
                                    <span>Berikutnya</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-green-500/10 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Kirim Pengajuan</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
