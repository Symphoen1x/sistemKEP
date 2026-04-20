import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import anime from 'animejs';
import { ShieldCheck, TrendingUp, Scale, FileText, ChevronRight, Moon, Sun } from 'lucide-react';

export default function Welcome({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Refs for animations
    const svgPathRef = useRef(null);
    const statsRef = useRef(null);
    const stat1Ref = useRef(null);
    const stat2Ref = useRef(null);
    const stat3Ref = useRef(null);
    const principlesRef = useRef(null);
    
    useEffect(() => {
        // Init theme from OS or localStorage
        if (window.matchMedia && document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleSvgHover = () => {
        if (!svgPathRef.current) return;
        anime.remove(svgPathRef.current);
        
        anime({
            targets: svgPathRef.current,
            scale: 1.05,
            translateY: -10,
            duration: 500,
            easing: 'easeOutBack'
        });
    };

    const handleSvgLeave = () => {
        if (!svgPathRef.current) return;
        anime.remove(svgPathRef.current);
        
        anime({
            targets: svgPathRef.current,
            scale: 1,
            translateY: 0,
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });
    };

    useEffect(() => {
        // 1. Staggering Reveal untuk Teks Hero
        anime({
            targets: '.hero-element',
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(150),
            easing: 'easeOutQuad',
            duration: 800
        });

        // 2. SVG Line Drawing (Hero)
        if (svgPathRef.current) {
            anime({
                targets: svgPathRef.current.querySelectorAll('path, circle:not(.fill-current), rect'),
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 2000,
                delay: function(el, i) { return i * 150 },
                direction: 'alternate',
                loop: false
            });
        }

        // Setup Intersection Observers untuk animasi on-scroll
        const observerOptions = { threshold: 0.2 };
        
        // 3. Scroll-triggered Count-Up untuk Statistik
        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                
                anime({
                    targets: stat1Ref.current,
                    innerHTML: [0, 1500],
                    round: 1,
                    easing: 'easeOutExpo',
                    duration: 2000
                });
                anime({
                    targets: stat2Ref.current,
                    innerHTML: [0, 120],
                    round: 1,
                    easing: 'easeOutExpo',
                    duration: 2000,
                    delay: 200
                });
                anime({
                    targets: stat3Ref.current,
                    innerHTML: [0, 14],
                    round: 1,
                    easing: 'easeOutExpo',
                    duration: 2000,
                    delay: 400
                });
            }
        }, observerOptions);
        
        if (statsRef.current) statsObserver.observe(statsRef.current);

        // 4. Staggered Card Fade-Up (Prinsip Etik)
        let cardsAnimated = false;
        const cardsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !cardsAnimated) {
                cardsAnimated = true;
                anime({
                    targets: '.principle-card',
                    translateY: [40, 0],
                    opacity: [0, 1],
                    delay: anime.stagger(200),
                    easing: 'spring(1, 80, 10, 0)',
                });
            }
        }, observerOptions);

        if (principlesRef.current) cardsObserver.observe(principlesRef.current);

        return () => {
            statsObserver.disconnect();
            cardsObserver.disconnect();
        };
    }, []);

    return (
        <>
            <Head title="Sistem KEP | Komisi Etik Penelitian" />
            
            {/* Wrapper utama dengan transisi dark mode */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-800 dark:text-slate-200">
                
                {/* --- NAVBAR --- */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-indigo-700 dark:text-indigo-400" />
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Sistem KEP</span>
                        </div>
                        
                        <nav className="hidden md:flex gap-6 font-medium text-sm">
                            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Beranda</a>
                            <a href="#alur" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Alur Pengajuan</a>
                            <a href="#prinsip" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Tentang Etik</a>
                            <a href="#download" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Template</a>
                        </nav>
                        
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Toggle Dark Mode">
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-700" />}
                            </button>
                            
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-md text-sm font-semibold transition shadow-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">Log in</Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-md text-sm font-semibold transition shadow-sm"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- HERO SECTION --- */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="text-center lg:text-left lg:w-1/2">
                            <h1 className="hero-element opacity-0 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                Sistem Pengajuan <br/>
                                <span className="text-indigo-700 dark:text-indigo-400">Kode Etik Penelitian</span> Digital
                            </h1>
                            <p className="hero-element opacity-0 mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
                                Memfasilitasi penelitian yang berintegritas, melindungi hak manusia dan hewan coba, dengan proses telaah yang transparan dan terstandarisasi.
                            </p>
                            <div className="hero-element opacity-0 mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                                        Pergi ke Dashboard <ChevronRight className="w-5 h-5"/>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('register')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-lg transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                                            Ajukan Proposal Sekarang <ChevronRight className="w-5 h-5"/>
                                        </Link>
                                        <a href="#alur" className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 dark:border-slate-700 hover:dark:border-indigo-400 text-slate-800 dark:text-white rounded-lg font-bold text-lg transition flex items-center justify-center">
                                            Pelajari Alur Telaah
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual SVG Animation */}
                        <div className="lg:w-1/2 flex justify-center">
                            <div 
                                className="w-full max-w-md relative cursor-pointer" 
                                ref={svgPathRef}
                                onMouseEnter={handleSvgHover}
                                onMouseLeave={handleSvgLeave}
                            >
                                {/* Abstract Node/Document Graphic */}
                                <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Lingkaran Luar */}
                                    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-slate-300 dark:text-slate-700" />
                                    
                                    {/* Garis Abstrak Penghubung */}
                                    <path d="M120 280 L200 120 L280 280 Z" stroke="currentColor" strokeWidth="4" className="text-indigo-400/50 dark:text-indigo-500/50" />
                                    <path d="M160 200 L240 200" stroke="currentColor" strokeWidth="4" className="text-emerald-400 dark:text-emerald-500" />
                                    <path d="M140 240 L260 240" stroke="currentColor" strokeWidth="4" className="text-indigo-500 dark:text-indigo-400" />
                                    
                                    {/* Nodes */}
                                    <circle cx="200" cy="120" r="12" className="fill-current text-emerald-500 dark:text-emerald-400" />
                                    <circle cx="120" cy="280" r="12" className="fill-current text-indigo-600 dark:text-indigo-500" />
                                    <circle cx="280" cy="280" r="12" className="fill-current text-indigo-600 dark:text-indigo-500" />
                                    
                                    {/* Elemen Dokumen Abstrak */}
                                    <rect x="250" y="80" width="80" height="100" rx="8" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-500" />
                                    <path d="M265 100 L315 100" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" />
                                    <path d="M265 120 L315 120" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" />
                                    <path d="M265 140 L295 140" stroke="currentColor" strokeWidth="4" className="text-slate-400 dark:text-slate-500" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- STATISTIK --- */}
                <section ref={statsRef} className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
                                    <span ref={stat1Ref}>0</span>+
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Proposal Direview</p>
                            </div>
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
                                    <span ref={stat2Ref}>0</span>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Reviewer Ahli Aktif</p>
                            </div>
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-emerald-500 mb-2">
                                    &lt;<span ref={stat3Ref}>0</span> Hari
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Rata-rata Waktu Proses</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PRINSIP ETIK --- */}
                <section id="prinsip" ref={principlesRef} className="py-24 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Prinsip Etik Penelitian</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Komitmen kami untuk menjaga kualitas dan integritas sains melalui 3 pilar utama.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-indigo-700 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Menghormati Partisipan (Autonomy)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Menghargai otonomi partisipan, menjamin persetujuan yang disadari (Informed Consent), dan melindungi kelompok rentan.</p>
                            </div>
                            
                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center mb-6">
                                    <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Kemanfaatan (Beneficence)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Memaksimalkan manfaat yang dapat diperoleh dan meminimalkan kerugian/risiko bagi partisipan penelitian.</p>
                            </div>

                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-6">
                                    <Scale className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Keadilan (Justice)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Memastikan distribusi yang merata atas beban dan keuntungan penelitian tanpa diskriminasi.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ALUR PENGAJUAN --- */}
                <section id="alur" className="py-24 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Alur Pengajuan yang Efisien</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Proses digital penuh dengan jejak rekam yang jelas dan transparan.</p>
                        </div>
                        
                        <div className="relative mt-20">
                            {/* Line connecting steps */}
                            <div className="absolute top-8 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-700 hidden lg:block z-0"></div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
                                {[
                                    { step: '1', title: 'Registrasi Akun', desc: 'Pembuatan akun dan verifikasi oleh sekretariat KEP.' },
                                    { step: '2', title: 'Unggah Protokol', desc: 'Melengkapi template form dan unggah dokumen syarat.' },
                                    { step: '3', title: 'Proses Telaah', desc: 'Evaluasi Excemted, Expedited, atau Full Board.' },
                                    { step: '4', title: 'Keputusan', desc: 'Penerbitan Surat Kelaikan Etik jika disetujui.' }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-indigo-700 dark:bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-700/30 ring-8 ring-white dark:ring-slate-800 relative z-10 transition-transform hover:scale-110">
                                            {item.step}
                                        </div>
                                        <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                        <p className="mt-2 text-slate-600 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- DOWNLOAD HUB --- */}
                <section id="download" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Pusat Unduhan Template</h2>
                                <p className="mb-8 text-indigo-100 max-w-2xl mx-auto">Persiapkan dokumen administrasi sebelum mengajukan Ethical Clearance dengan mengunduh template resmi kami.</p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="px-6 py-3 bg-white text-indigo-700 hover:bg-slate-100 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg">
                                        <FileText className="w-5 h-5"/> Ringkasan Protokol
                                    </button>
                                    <button className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 border border-indigo-400/30 shadow-lg">
                                        <FileText className="w-5 h-5"/> Formulir Pengajuan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-6 h-6 text-indigo-700 dark:text-indigo-400" />
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Sistem KEP Digital</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Sistem Informasi Komisi Etik Penelitian, memanajemen alur pendaftaran, review, dan keputusan kelayakan etik secara aman dan efisien.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Tentang Komisi Etik</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Panduan Peneliti</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Kontak Sekretariat</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>Email: kep@institusi.ac.id</li>
                                <li>Telp: (021) 1234567</li>
                                <li>Gedung Rektorat Lt.3, Kampus Utama</li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} Komisi Etik Penelitian. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
