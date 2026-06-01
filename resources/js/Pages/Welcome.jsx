import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import anime from 'animejs';
import { ShieldCheck, TrendingUp, Scale, FileText, ChevronRight, Moon, Sun, Music, Volume2, VolumeX } from 'lucide-react';

const LOFI_TRACKS = [
    { url: 'https://stream.chillhop.com/mp3/9476', title: 'Apple Juice' },
    { url: 'https://stream.chillhop.com/mp3/8448', title: 'Tôzen' },
    { url: 'https://stream.chillhop.com/mp3/8878', title: 'Swiss' },
    { url: 'https://stream.chillhop.com/mp3/8603', title: 'Like This One, & Then Some' },
    { url: 'https://stream.chillhop.com/mp3/8598', title: 'Secret Meetings' },
    { url: 'https://stream.chillhop.com/mp3/8596', title: 'Fluid Dynamics' },
    { url: 'https://stream.chillhop.com/mp3/8562', title: 'Theme From Endless Sunset' },
    { url: 'https://stream.chillhop.com/mp3/8591', title: 'Outskirts' },
    { url: 'https://stream.chillhop.com/mp3/8587', title: 'Squba' }
];

export default function Welcome({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showLandingGate, setShowLandingGate] = useState(true); // State untuk mengontrol gerbang utama

    // Refs baru untuk Gerbang Sinematik
    const inkPreloaderRef = useRef(null);
    const landingGateRef = useRef(null);
    const gateDoorRef = useRef(null);
    const gateContentRef = useRef(null);

    // Refs bawaan lama
    const heroSectionRef = useRef(null);
    const parallaxBgRef = useRef(null);
    const parallaxContentRef = useRef(null);
    const parallaxOfficeLayerRef = useRef(null);
    const svgPathRef = useRef(null);
    const statsRef = useRef(null);
    const stat1Ref = useRef(null);
    const stat2Ref = useRef(null);
    const stat3Ref = useRef(null);
    const principlesRef = useRef(null);

    // Refs untuk mencegah double trigger
    const isEnteringRef = useRef(false);

    // State untuk Lofi Music
    const [showMusicMenu, setShowMusicMenu] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const audioRef = useRef(null);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) {
            const randomTrack = LOFI_TRACKS[Math.floor(Math.random() * LOFI_TRACKS.length)];
            setCurrentTrack(randomTrack);
            const audio = new Audio(randomTrack.url);
            audio.loop = true;
            audioRef.current = audio;
        }

        if (isMusicPlaying) {
            audioRef.current.pause();
            setIsMusicPlaying(false);
        } else {
            audioRef.current.play().catch(err => console.log('Audio playback error:', err));
            setIsMusicPlaying(true);
        }
    };

    const changeTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const randomTrack = LOFI_TRACKS[Math.floor(Math.random() * LOFI_TRACKS.length)];
        setCurrentTrack(randomTrack);
        const audio = new Audio(randomTrack.url);
        audio.loop = true;
        audioRef.current = audio;
        if (isMusicPlaying) {
            audio.play().catch(err => console.log('Audio playback error:', err));
        }
    };

    // 1. Logika Theme (Dark/Light)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // 2. Efek Parallax via Scroll Event (Hanya berjalan jika Gerbang sudah terbuka)
    useEffect(() => {
        const handleScroll = () => {
            if (showLandingGate || !heroSectionRef.current) return;
            const scrolled = window.scrollY;

            if (parallaxBgRef.current) {
                parallaxBgRef.current.style.transform = `translateY(${scrolled * 0.35}px) scale(${1 + scrolled * 0.0004})`;
            }
            if (parallaxContentRef.current) {
                parallaxContentRef.current.style.transform = `translateY(${scrolled * 0.12}px)`;
                parallaxContentRef.current.style.opacity = `${1 - scrolled / 700}`;
            }
            if (parallaxOfficeLayerRef.current) {
                parallaxOfficeLayerRef.current.style.transform = `translateY(${-scrolled * 0.15}px) rotate(${scrolled * 0.02}deg)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showLandingGate]);

    // 3. Efek Animasi Pertama: Bercakan Cat Memudar ke Layar Gerbang
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Kunci scroll di awal

        // Animasi bercak cat menghilang menggunakan efek lingkaran bertingkat / clipPath organik
        anime({
            targets: inkPreloaderRef.current,
            clipPath: ['circle(100% at 50% 50%)', 'circle(0% at 50% 50%)'],
            duration: 1600,
            delay: 500,
            easing: 'easeInOutQuint',
            complete: () => {
                if (inkPreloaderRef.current) inkPreloaderRef.current.style.display = 'none';
            }
        });

        // Efek masuk elemen teks di Gerbang Utama (Simulasi Thorgal)
        anime({
            targets: '.gate-fade-in',
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.95, 1],
            delay: anime.stagger(150, { start: 1000 }),
            duration: 1200,
            easing: 'easeOutExpo'
        });
    }, []);

    // 4. Tombol "Masuk Pintu" Diklik (Transisi Sinematik Menembus Portal)
    const handleEnterPortal = () => {
        if (isEnteringRef.current) return;
        isEnteringRef.current = true;

        const gateTimeline = anime.timeline({
            complete: () => {
                setShowLandingGate(false);
                document.body.style.overflow = 'unset'; // Aktifkan scroll kembali

                // Triger animasi halaman utama bawaan setelah masuk pintu
                triggerMainHeroAnimation();

                // Smooth scroll ke landing page
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 50);
            }
        });

        gateTimeline
        // Konten teks membesar dan memudar dramatis
        .add({
            targets: gateContentRef.current,
            opacity: 0,
            scale: 1.3,
            duration: 800,
            easing: 'easeInQuad'
        })
        // Efek kamera maju menembus pintu (Pintu membesar raksasa seolah dilewati)
        .add({
            targets: gateDoorRef.current,
            scale: 4,
            opacity: [1, 0],
            duration: 1200,
            easing: 'easeInOutExpo'
        }, '-=400')
        // Layar gerbang menutup secara transparan penuh
        .add({
            targets: landingGateRef.current,
            opacity: 0,
            duration: 600,
            easing: 'linear'
        }, '-=600');
    };

    // 4.5. Efek Scroll / Swipe untuk Masuk Portal
    useEffect(() => {
        if (!showLandingGate) return;

        const handleGateWheel = (e) => {
            if (e.deltaY > 10) { // User scrolled down
                handleEnterPortal();
            }
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const touchEndY = e.touches[0].clientY;
            if (touchStartY - touchEndY > 30) { // Swiped up (scrolled down)
                handleEnterPortal();
            }
        };

        window.addEventListener('wheel', handleGateWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleGateWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [showLandingGate]);


    // Fungsi Trigger Animasi Main Content bawaan
    const triggerMainHeroAnimation = () => {
        anime({
            targets: '.hero-element',
            translateY: [40, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutBack',
            duration: 800
        });

        if (svgPathRef.current) {
            anime({
                targets: svgPathRef.current.querySelectorAll('path, circle:not(.fill-current), rect'),
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 2000,
                delay: function(el, i) { return i * 150 }
            });
        }

        // Intersection Observers untuk statistik & cards
        const observerOptions = { threshold: 0.2 };
        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                anime({ targets: stat1Ref.current, innerHTML: [0, 1500], round: 1, easing: 'easeOutExpo', duration: 2000 });
                anime({ targets: stat2Ref.current, innerHTML: [0, 120], round: 1, easing: 'easeOutExpo', duration: 2000, delay: 200 });
                anime({ targets: stat3Ref.current, innerHTML: [0, 14], round: 1, easing: 'easeOutExpo', duration: 2000, delay: 400 });
            }
        }, observerOptions);
        if (statsRef.current) statsObserver.observe(statsRef.current);

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
    };

    // Hover effect untuk SVG Utama
    const handleSvgHover = () => {
        if (!svgPathRef.current) return;
        anime.remove(svgPathRef.current);
        anime({ targets: svgPathRef.current, scale: 1.05, translateY: -10, duration: 500, easing: 'easeOutBack' });
    };

    const handleSvgLeave = () => {
        if (!svgPathRef.current) return;
        anime.remove(svgPathRef.current);
        anime({ targets: svgPathRef.current, scale: 1, translateY: 0, duration: 600, easing: 'easeOutElastic(1, .8)' });
    };
    return (
        <>
            <Head title="Komisi Etik Penelitian" />

            {/* --- 1. FASE PRELOADER: BERCAK CAT MEMUDAR --- */}
            <div
                ref={inkPreloaderRef}
                className="fixed inset-0 z-[200] flex bg-slate-950 text-white pointer-events-none items-center justify-center"
                style={{ clipPath: 'circle(100% at 50% 50%)' }}
            >
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-12 h-12 text-blue-400 animate-pulse" />
                    <span className="text-xs font-mono tracking-widest uppercase opacity-60">Initializing Portal...</span>
                </div>
            </div>

            {/* --- 2. FASE GERBANG UTAMA (STYLE SCREENSHOT THORGAL) --- */}
            {showLandingGate && (
                <div
                    ref={landingGateRef}
                    className="fixed inset-0 z-[100] flex flex-col justify-between items-center bg-cover bg-center select-none"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')`
                    }}
                >
                    {/* Header Atas Gerbang */}
                    <div className="w-full max-w-7xl px-8 py-6 flex justify-between items-center text-white/80 font-medium text-sm tracking-widest gate-fade-in opacity-0">
                        <div className="relative">
                            <button
                                onClick={() => setShowMusicMenu(!showMusicMenu)}
                                className="flex items-center gap-2 border border-white/20 px-3 py-1 rounded backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition text-white font-medium text-xs tracking-widest"
                            >
                                <span className={`w-2 h-2 rounded-full ${isMusicPlaying ? 'bg-blue-400 animate-ping' : 'bg-slate-400'}`}></span>
                                <span>MENU</span>
                            </button>

                            {/* Dropdown Menu */}
                            {showMusicMenu && (
                                <div className="absolute left-0 mt-2 w-48 bg-slate-955/95 border border-white/15 rounded shadow-lg py-2 z-50 backdrop-blur-md">
                                    <button
                                        onClick={() => {
                                            toggleMusic();
                                            setShowMusicMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider text-slate-200 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                                    >
                                        {isMusicPlaying ? (
                                            <>
                                                <VolumeX className="w-3.5 h-3.5 text-blue-400" />
                                                <span>Matikan Musik</span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                                                <span>Aktifkan Musik</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {isMusicPlaying && (
                                        <button
                                            onClick={() => {
                                                changeTrack();
                                            }}
                                            className="w-full text-left px-4 py-2 text-[9px] uppercase tracking-wider text-slate-400 hover:bg-white/10 hover:text-white transition flex items-center gap-2 border-t border-white/5"
                                        >
                                            <Music className="w-3 h-3 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                                            <span>Ganti Lagu Lofi</span>
                                        </button>
                                    )}

                                    {currentTrack && isMusicPlaying && (
                                        <div className="px-4 py-1 text-[8px] text-blue-400/80 font-mono tracking-normal truncate border-t border-white/5">
                                            Playing: {currentTrack.title}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-lg font-black tracking-widest font-serif text-white uppercase">WELCOME</div>
                        <div className="text-xs border-b border-white/40 pb-0.5 cursor-pointer hover:text-white transition">AKTUALITAS ◆</div>
                    </div>

                    {/* Bagian Tengah: Judul Besar & Pintu Misterius */}
                    <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl flex-1">

                        {/* Ilustrasi Kotak Pintu di Tengah Background */}
                        <div
                            ref={gateDoorRef}
                            className="absolute w-72 h-96 sm:w-80 sm:h-[420px] bg-slate-900/90 border-4 border-blue-900/40 rounded-t-xl shadow-2xl flex flex-col items-center justify-start p-4 bg-cover bg-blend-multiply will-change-transform z-0 gate-fade-in opacity-0"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80')`,
                                boxShadow: '0 0 80px rgba(0,0,0,0.8) inset'
                            }}
                        >
                            <div className="border border-blue-500/20 px-3 py-1 rounded text-[10px] tracking-widest text-blue-200/80 uppercase font-mono mt-6 bg-black/40">
                                PORTAL / KEP
                            </div>
                        </div>

                        {/* Konten Teks & Tombol utama */}
                        <div ref={gateContentRef} className="relative z-10 flex flex-col items-center gate-fade-in opacity-0 will-change-transform">
                            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-widest text-white uppercase font-serif drop-shadow-lg mb-6 selection:bg-blue-500">
                                KODE ETIK PENELITIAN
                            </h1>

                            <button
                                onClick={handleEnterPortal}
                                className="mt-24 px-8 py-4 bg-slate-955/90 hover:bg-white hover:text-slate-950 text-white border border-white/30 rounded font-serif tracking-widest text-xs uppercase transition-all duration-300 shadow-2xl backdrop-blur-sm flex items-center gap-3 group"
                            >
                                JELAJAHI KODE ETIK
                            </button>
                        </div>
                    </div>

                    {/* Footer Bawah Gerbang */}
                    <div 
                        onClick={handleEnterPortal}
                        className="pb-8 text-[11px] text-white/50 tracking-[0.3em] uppercase animate-bounce gate-fade-in opacity-0 cursor-pointer hover:text-white transition"
                    >
                        SCROLL UNTUK MENJELAJAH ↓
                    </div>
                </div>
            )}


            {/* --- 3. HALAMAN UTAMA DENGAN PARALLAX ESTETIK --- */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-800 dark:text-slate-200 overflow-x-hidden">

                {/* --- NAVBAR --- */}
                <header className="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-transparent dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-blue-700 dark:text-blue-400" />
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Sistem KEP</span>
                        </div>

                        <nav className="hidden md:flex gap-6 font-medium text-sm">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Beranda</a>
                            <a href="#alur" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Alur Pengajuan</a>
                            <a href="#prinsip" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Tentang Etik</a>
                            <a href="#download" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Template</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" aria-label="Toggle Dark Mode">
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-700" />}
                            </button>

                            {auth.user ? (
                                <Link href={route('dashboard')} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md text-sm font-semibold transition shadow-sm">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400">Log in</Link>
                                    <Link href={route('register')} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md text-sm font-semibold transition shadow-sm">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- HERO SECTION WITH ADVANCED PARALLAX --- */}
                <section ref={heroSectionRef} className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 h-[90vh] flex items-center">
                    {/* Parallax Background Layer */}
                    <div
                        ref={parallaxBgRef}
                        className="absolute inset-0 pointer-events-none transition-transform duration-75 ease-out will-change-transform opacity-15 dark:opacity-5 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80')`,
                        }}
                    ></div>
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 dark:opacity-10"></div>
                        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500 rounded-full blur-3xl opacity-20 dark:opacity-10"></div>
                    </div>

                    {/* Floating Parallax Office Blueprint / Geometric Layer */}
                    <div
                        ref={parallaxOfficeLayerRef}
                        className="absolute right-10 top-1/4 w-72 h-72 border border-blue-500/20 rounded-lg pointer-events-none transition-transform duration-75 ease-out will-change-transform opacity-35 dark:opacity-15 hidden lg:block"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                            backgroundSize: '20px 20px',
                        }}
                    >
                        <div className="absolute inset-2 border border-dashed border-blue-400/30 rounded-md"></div>
                        <div className="absolute -top-3 -left-3 text-[10px] font-mono text-blue-500/50">OFFICE_FACILITY_LAYOUT_V2.0</div>
                    </div>

                    {/* Parallax Content Layer */}
                    <div
                        ref={parallaxContentRef}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col-reverse lg:flex-row items-center gap-12 w-full transition-all duration-75 ease-out will-change-transform"
                    >
                        {/* Text Content */}
                        <div className="text-center lg:text-left lg:w-1/2">
                            <h1 className="hero-element opacity-0 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                Sistem Pengajuan <br/>
                                <span className="text-blue-700 dark:text-blue-400">Kode Etik Penelitian</span> Digital
                            </h1>
                            <p className="hero-element opacity-0 mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
                                Memfasilitasi penelitian yang berintegritas, melindungi hak manusia dan hewan coba, dengan proses telaah yang transparan dan terstandarisasi.
                            </p>
                            <div className="hero-element opacity-0 mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                                        Pergi ke Dashboard <ChevronRight className="w-5 h-5"/>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('register')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                                            Ajukan Proposal Sekarang <ChevronRight className="w-5 h-5"/>
                                        </Link>
                                        <a href="#alur" className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 text-slate-800 dark:text-white rounded-lg font-bold text-lg transition flex items-center justify-center">
                                            Pelajari Alur Telaah
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual SVG Animation */}
                        <div className="lg:w-1/2 flex justify-center hero-element opacity-0">
                            <div
                                className="w-full max-w-md relative cursor-pointer"
                                ref={svgPathRef}
                                onMouseEnter={handleSvgHover}
                                onMouseLeave={handleSvgLeave}
                            >
                                <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-slate-300 dark:text-slate-700" />
                                    <path d="M120 280 L200 120 L280 280 Z" stroke="currentColor" strokeWidth="4" className="text-blue-400/50 dark:text-blue-500/50" />
                                    <path d="M160 200 L240 200" stroke="currentColor" strokeWidth="4" className="text-sky-400 dark:text-sky-500" />
                                    <path d="M140 240 L260 240" stroke="currentColor" strokeWidth="4" className="text-blue-500 dark:text-blue-400" />
                                    <circle cx="200" cy="120" r="12" className="fill-current text-sky-500 dark:text-sky-400" />
                                    <circle cx="120" cy="280" r="12" className="fill-current text-blue-600 dark:text-blue-500" />
                                    <circle cx="280" cy="280" r="12" className="fill-current text-blue-600 dark:text-blue-500" />
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
                <section ref={statsRef} className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
                                    <span ref={stat1Ref}>0</span>+
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Proposal Direview</p>
                            </div>
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-2">
                                    <span ref={stat2Ref}>0</span>
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Reviewer Ahli Aktif</p>
                            </div>
                            <div className="p-4">
                                <p className="text-4xl md:text-5xl font-extrabold text-sky-500 mb-2">
                                    &lt;<span ref={stat3Ref}>0</span> Hari
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide uppercase">Rata-rata Waktu Proses</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PRINSIP ETIK --- */}
                <section id="prinsip" ref={principlesRef} className="py-24 bg-slate-50 dark:bg-slate-900 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Prinsip Etik Penelitian</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Komitmen kami untuk menjaga kualitas dan integritas sains melalui 3 pilar utama.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-blue-700 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Menghormati Partisipan (Autonomy)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Menghargai otonomi partisipan, menjamin persetujuan yang disadari (Informed Consent), dan melindungi kelompok rentan.</p>
                            </div>

                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/50 rounded-xl flex items-center justify-center mb-6">
                                    <TrendingUp className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Kemanfaatan (Beneficence)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Memaksimalkan manfaat yang dapat diperoleh dan meminimalkan kerugian/risiko bagi partisipan penelitian.</p>
                            </div>

                            <div className="principle-card opacity-0 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mb-6">
                                    <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Keadilan (Justice)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Memastikan distribusi yang merata atas beban dan keuntungan penelitian tanpa diskriminasi.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ALUR PENGAJUAN --- */}
                <section id="alur" className="py-24 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Alur Pengajuan yang Efisien</h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Proses digital penuh dengan jejak rekam yang jelas dan transparan.</p>
                        </div>

                        <div className="relative mt-20">
                            <div className="absolute top-8 left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-700 hidden lg:block z-0"></div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
                                {[
                                    { step: '1', title: 'Registrasi Akun', desc: 'Pembuatan akun dan verifikasi oleh sekretariat KEP.' },
                                    { step: '2', title: 'Unggah Protokol', desc: 'Melengkapi template form dan unggah dokumen syarat.' },
                                    { step: '3', title: 'Proses Telaah', desc: 'Evaluasi Excemted, Expedited, atau Full Board.' },
                                    { step: '4', title: 'Keputusan', desc: 'Penerbitan Surat Kelaikan Etik jika disetujui.' }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/30 ring-8 ring-white dark:ring-slate-800 relative z-10 transition-transform hover:scale-110">
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
                <section id="download" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 relative z-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Pusat Unduhan Template</h2>
                                <p className="mb-8 text-blue-100 max-w-2xl mx-auto">Persiapkan dokumen administrasi sebelum mengajukan Ethical Clearance dengan mengunduh template resmi kami.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="px-6 py-3 bg-white text-blue-700 hover:bg-slate-100 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg">
                                        <FileText className="w-5 h-5"/> Ringkasan Protokol
                                    </button>
                                    <button className="px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 border border-blue-400/30 shadow-lg">
                                        <FileText className="w-5 h-5"/> Formulir Pengajuan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                                <span className="text-lg font-bold text-slate-900 dark:text-white">Sistem KEP Digital</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Sistem Informasi Komisi Etik Penelitian, memanajemen alur pendaftaran, review, dan keputusan kelayakan etik secara aman dan efisien.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Tautan Cepat</h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Tentang Komisi Etik</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Panduan Peneliti</a></li>
                                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">FAQ</a></li>
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
