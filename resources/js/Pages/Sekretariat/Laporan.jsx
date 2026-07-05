import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Layers, CheckCircle, TrendingUp, Users, FileDown, FileSpreadsheet } from 'lucide-react';

export default function Laporan({ chartData = [], distribution = [], reviewerPerformance = [], exportPdfRoute = '#', exportCsvRoute = '#' }) {
    const COLORS = ['#2563EB', '#EF4444', '#F59E0B', '#8B5CF6', '#6B7280'];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />

            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <Head title="Laporan Statistik KEP" />

                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Laporan & Statistik</h2>
                        <p className="text-xs text-gray-500 font-medium">Rekapitulasi berkas masuk, performa penelaah, dan status kelayakan etik</p>
                    </div>
                    <div className="flex gap-2">
                        <a href={exportPdfRoute}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition">
                            <FileDown className="w-3.5 h-3.5" /> Export PDF
                        </a>
                        <a href={exportCsvRoute}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition">
                            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                        </a>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
                    {/* Upper Charts Row: Area & Pie Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Area Chart - Volume proposal per month */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <span>Volume Usulan KEP (6 Bulan Terakhir)</span>
                            </h3>
                            <div className="h-72 w-full text-xs font-semibold">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} />
                                        <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="Total" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                                        <Area type="monotone" dataKey="Disetujui" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart - Status distribution */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                                <Layers className="w-5 h-5 text-blue-600" />
                                <span>Distribusi Status KEP</span>
                            </h3>
                            <div className="h-64 w-full flex items-center justify-center font-semibold text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={distribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {distribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-bold text-gray-600">
                                {distribution.map((entry, idx) => (
                                    <span key={idx} className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                        <span>{entry.name} ({entry.value})</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lower Chart: Reviewer workload */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span>Beban Kerja & Kinerja Penelaah Etik</span>
                        </h3>
                        <div className="h-72 w-full text-xs font-semibold">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reviewerPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} />
                                    <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Proposals" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Ditugaskan" />
                                    <Bar dataKey="Selesai" fill="#10B981" radius={[4, 4, 0, 0]} name="Selesai Telaah" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
