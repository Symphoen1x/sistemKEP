import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

export default function JadwalReview({ schedules = [] }) {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Jadwal Sidang Etik - Reviewer" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Jadwal Rapat & Sidang Etik</h2>
                        <p className="text-xs text-gray-500 font-medium">Jadwal pleno penelaahan bersama dengan komisi etik</p>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {schedules.length > 0 ? (
                            schedules.map((sch) => (
                                <div key={sch.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl transform translate-x-12 -translate-y-12"></div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                        Rapat Pleno Komisi
                                    </span>
                                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{sch.agenda}</h4>

                                    <div className="space-y-2 text-xs font-bold text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{new Date(sch.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{sch.waktu.substring(0, 5)} WIB s/d Selesai</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span>{sch.tempat}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400 font-medium">
                                Belum ada jadwal rapat pleno komisi terdekat.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
