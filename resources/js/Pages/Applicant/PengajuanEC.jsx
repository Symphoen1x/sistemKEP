import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PengajuanEC() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        nidn_nim: '',
        email: '',
        no_hp: '',
        institusi: '',
        role_peneliti: '',
        judul: '',
        lokasi_penelitian: '',
        anggota_tim: '',
        subjek_penelitian: '',
        metode_penelitian: '',
        risiko_penelitian: '',
        deskripsi_penelitian: '',
        proposal: null,
        informed_consent: null,
        surat_izin: null,
        instrumen: null,
        sertifikat: null,
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setData(name, files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('applicant.storeProposal'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengajuan Ethical Clearance" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6">Pengajuan Ethical Clearance</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Informasi Peneliti */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Informasi Peneliti</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama
                                            </label>
                                            <input
                                                type="text"
                                                name="nama"
                                                value={data.nama}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.nama && <span className="text-red-500 text-sm">{errors.nama}</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    NIDN/NIM
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nidn_nim"
                                                    value={data.nidn_nim}
                                                    onChange={handleInputChange}
                                                    className="block w-full border border-gray-300 rounded-lg p-2"
                                                    required
                                                />
                                                {errors.nidn_nim && (
                                                    <span className="text-red-500 text-sm">{errors.nidn_nim}</span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={data.email}
                                                    onChange={handleInputChange}
                                                    className="block w-full border border-gray-300 rounded-lg p-2"
                                                    required
                                                />
                                                {errors.email && (
                                                    <span className="text-red-500 text-sm">{errors.email}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    No. HP
                                                </label>
                                                <input
                                                    type="text"
                                                    name="no_hp"
                                                    value={data.no_hp}
                                                    onChange={handleInputChange}
                                                    className="block w-full border border-gray-300 rounded-lg p-2"
                                                    required
                                                />
                                                {errors.no_hp && (
                                                    <span className="text-red-500 text-sm">{errors.no_hp}</span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Institusi
                                                </label>
                                                <input
                                                    type="text"
                                                    name="institusi"
                                                    value={data.institusi}
                                                    onChange={handleInputChange}
                                                    className="block w-full border border-gray-300 rounded-lg p-2"
                                                    required
                                                />
                                                {errors.institusi && (
                                                    <span className="text-red-500 text-sm">{errors.institusi}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Peran Peneliti
                                            </label>
                                            <select
                                                name="role_peneliti"
                                                value={data.role_peneliti}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            >
                                                <option value="">Pilih Peran</option>
                                                <option value="Mahasiswa">Mahasiswa</option>
                                                <option value="Dosen">Dosen</option>
                                                <option value="Peneliti">Peneliti</option>
                                            </select>
                                            {errors.role_peneliti && (
                                                <span className="text-red-500 text-sm">{errors.role_peneliti}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Informasi Penelitian */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Informasi Penelitian</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Judul Penelitian
                                            </label>
                                            <input
                                                type="text"
                                                name="judul"
                                                value={data.judul}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.judul && (
                                                <span className="text-red-500 text-sm">{errors.judul}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Lokasi Penelitian
                                            </label>
                                            <input
                                                type="text"
                                                name="lokasi_penelitian"
                                                value={data.lokasi_penelitian}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.lokasi_penelitian && (
                                                <span className="text-red-500 text-sm">
                                                    {errors.lokasi_penelitian}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Anggota Tim Penelitian
                                            </label>
                                            <textarea
                                                name="anggota_tim"
                                                value={data.anggota_tim}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                rows="3"
                                            ></textarea>
                                            {errors.anggota_tim && (
                                                <span className="text-red-500 text-sm">{errors.anggota_tim}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Subjek Penelitian
                                            </label>
                                            <input
                                                type="text"
                                                name="subjek_penelitian"
                                                value={data.subjek_penelitian}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.subjek_penelitian && (
                                                <span className="text-red-500 text-sm">{errors.subjek_penelitian}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Metodologi Penelitian */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Metodologi Penelitian</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Metode Penelitian
                                            </label>
                                            <textarea
                                                name="metode_penelitian"
                                                value={data.metode_penelitian}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                rows="3"
                                                required
                                            ></textarea>
                                            {errors.metode_penelitian && (
                                                <span className="text-red-500 text-sm">{errors.metode_penelitian}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Risiko Penelitian
                                            </label>
                                            <textarea
                                                name="risiko_penelitian"
                                                value={data.risiko_penelitian}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                rows="3"
                                                required
                                            ></textarea>
                                            {errors.risiko_penelitian && (
                                                <span className="text-red-500 text-sm">{errors.risiko_penelitian}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Deskripsi Penelitian
                                            </label>
                                            <textarea
                                                name="deskripsi_penelitian"
                                                value={data.deskripsi_penelitian}
                                                onChange={handleInputChange}
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                rows="4"
                                                required
                                            ></textarea>
                                            {errors.deskripsi_penelitian && (
                                                <span className="text-red-500 text-sm">{errors.deskripsi_penelitian}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Upload File */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold mb-4">Upload Dokumen</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Proposal Penelitian *
                                            </label>
                                            <input
                                                type="file"
                                                name="proposal"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.proposal && (
                                                <span className="text-red-500 text-sm">{errors.proposal}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Informed Consent *
                                            </label>
                                            <input
                                                type="file"
                                                name="informed_consent"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.informed_consent && (
                                                <span className="text-red-500 text-sm">{errors.informed_consent}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Surat Izin Dari Institusi *
                                            </label>
                                            <input
                                                type="file"
                                                name="surat_izin"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                                required
                                            />
                                            {errors.surat_izin && (
                                                <span className="text-red-500 text-sm">{errors.surat_izin}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Instrumen Penelitian
                                            </label>
                                            <input
                                                type="file"
                                                name="instrumen"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                            />
                                            {errors.instrumen && (
                                                <span className="text-red-500 text-sm">{errors.instrumen}</span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sertifikat Etika Terdahulu
                                            </label>
                                            <input
                                                type="file"
                                                name="sertifikat"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="block w-full border border-gray-300 rounded-lg p-2"
                                            />
                                            {errors.sertifikat && (
                                                <span className="text-red-500 text-sm">{errors.sertifikat}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={step === 1}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50"
                                    >
                                        Sebelumnya
                                    </button>

                                    <div className="text-sm text-gray-600">
                                        Step {step} of 4
                                    </div>

                                    {step < 4 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        >
                                            Berikutnya
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                                        >
                                            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
