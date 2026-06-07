import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Mail, MailOpen, Calendar, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function PesanNotifikasi({ messages = [] }) {
    const [selectedMsg, setSelectedMsg] = useState(null);

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Kotak Masuk & Notifikasi" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Pesan & Notifikasi</h2>
                        <p className="text-xs text-gray-500 font-medium">Kotak masuk untuk pemberitahuan status dan pesan khusus sekretariat</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Inbox List */}
                    <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-700">
                            Pesan Masuk ({messages.length})
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 font-semibold text-xs">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMsg(msg)}
                                        className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                                            selectedMsg?.id === msg.id 
                                                ? 'bg-blue-50/50' 
                                                : msg.is_read 
                                                    ? 'hover:bg-gray-50' 
                                                    : 'bg-blue-50/10 font-bold hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl mt-0.5 ${
                                            msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {msg.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900">{msg.sender_name}</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{msg.subject}</p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">
                                                {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400 font-medium text-sm">
                                    Kotak masuk kosong.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Detail */}
                    <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col h-[600px]">
                        {selectedMsg ? (
                            <div className="flex-1 flex flex-col space-y-6">
                                <div className="border-b border-gray-100 pb-6 space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedMsg.subject}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            Dari: {selectedMsg.sender_name}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Tanggal: {new Date(selectedMsg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 text-sm text-gray-700 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                                    {selectedMsg.body}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
                                <Mail className="w-12 h-12 text-gray-300" />
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Pilih Pesan</p>
                                    <p className="text-xs text-gray-500">Klik salah satu pesan di daftar sebelah kiri untuk membacanya.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
