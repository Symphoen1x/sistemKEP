import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { HelpCircle, FileText, Phone, Mail, Clock, Download } from 'lucide-react';
import { useState } from 'react';

export default function Bantuan() {
    const faqs = [
        {
            q: 'Apa itu Ethical Clearance (Kelaikan Etik)?',
            a: 'Kelaikan Etik (Ethical Clearance) adalah pernyataan tertulis yang diberikan oleh Komisi Etik Penelitian untuk menyatakan bahwa suatu proposal penelitian layak dilaksanakan setelah memenuhi syarat perlindungan terhadap hak, keselamatan, dan kesejahteraan subjek penelitian.'
        },
        {
            q: 'Berapa lama proses review protokol penelitian?',
            a: 'Proses verifikasi administrasi oleh Sekretariat memakan waktu 1-3 hari kerja. Proses telaah oleh Reviewer (penelaah etik) membutuhkan waktu 7-14 hari kerja tergantung dari risiko penelitian.'
        },
        {
            q: 'Bagaimana jika proposal saya berstatus "Revisi"?',
            a: 'Status "Revisi" berarti penelaah etik memberikan catatan perbaikan. Anda dapat melihat rincian catatan revisi di menu Riwayat Pengajuan atau Kotak Masuk, lalu melakukan perbaikan dan submit kembali proposal Anda.'
        },
        {
            q: 'Format file apa saja yang diperbolehkan untuk diunggah?',
            a: 'Semua dokumen (Proposal, Informed Consent, Surat Izin, dll) wajib diunggah dalam format PDF dengan ukuran maksimal masing-masing file sebesar 5 Megabyte (5MB).'
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    const handleDownloadTemplate = (name) => {
        alert(`Mengunduh berkas template "${name}" ... (Simulasi Unduhan Berhasil)`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Bantuan & Panduan Layanan" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Bantuan & Panduan</h2>
                        <p className="text-xs text-gray-500 font-medium">Panduan pengoperasian sistem, template berkas, dan FAQ</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
                            </h3>
                            <div className="space-y-3">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full p-4 bg-gray-50/50 hover:bg-gray-50 text-left font-semibold text-sm text-gray-950 flex justify-between items-center transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            <span>{openIndex === idx ? '−' : '+'}</span>
                                        </button>
                                        {openIndex === idx && (
                                            <div className="p-4 text-xs text-gray-600 leading-relaxed font-medium bg-white border-t border-gray-100">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar templates & contacts */}
                    <div className="space-y-8">
                        {/* Contacts Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <span>Hubungi Kami</span>
                            </h3>
                            <div className="space-y-4 text-xs font-semibold text-gray-600">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-gray-400">Telepon / WhatsApp</p>
                                        <p className="text-gray-900">+62 823-4567-8901</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-gray-400">Email Sekretariat</p>
                                        <p className="text-gray-900">komisi.etik@univ.ac.id</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-gray-400">Jam Operasional Layanan</p>
                                        <p className="text-gray-900">Senin - Jumat | 08:00 - 16:00 WIB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
