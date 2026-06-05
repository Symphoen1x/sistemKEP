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

    // Canvas & Mouse coordinates tracking for Torii Studio interactive visualizer
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

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

    // 3.5. Canvas Particle & Noise Animation Loop for Torii Studio Hero Visualizer
    useEffect(() => {
        if (showLandingGate) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            }
        };
        window.addEventListener('resize', handleResize);

        // Particles settings
        const particleCount = 60;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.6 + 0.2
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Grid lines
            ctx.strokeStyle = isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.09)';
            ctx.lineWidth = 1;
            const gridSize = 45;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Glow backdrops
            const time = Date.now() * 0.001;
            const circleColor1 = isDarkMode ? 'rgba(59, 130, 246, 0.16)' : 'rgba(59, 130, 246, 0.1)';
            const circleColor2 = isDarkMode ? 'rgba(14, 165, 233, 0.14)' : 'rgba(14, 165, 233, 0.08)';

            ctx.save();
            ctx.filter = 'blur(45px)';

            const c1x = width / 2 + Math.cos(time * 0.4) * 50;
            const c1y = height / 2 + Math.sin(time * 0.3) * 50;
            ctx.fillStyle = circleColor1;
            ctx.beginPath();
            ctx.arc(c1x, c1y, 80, 0, Math.PI * 2);
            ctx.fill();

            const c2x = width / 2 + Math.sin(time * 0.35) * 70;
            const c2y = height / 2 + Math.cos(time * 0.5) * 30;
            ctx.fillStyle = circleColor2;
            ctx.beginPath();
            ctx.arc(c2x, c2y, 60, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Particles
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse gravity attraction
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.x += (dx / dist) * force * 0.35;
                    p.y += (dy / dist) * force * 0.35;
                }

                ctx.fillStyle = isDarkMode
                    ? `rgba(96, 165, 250, ${p.alpha})`
                    : `rgba(29, 78, 216, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Links
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const ldx = p.x - p2.x;
                    const ldy = p.y - p2.y;
                    const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

                    if (ldist < 80) {
                        ctx.strokeStyle = isDarkMode
                            ? `rgba(96, 165, 250, ${(1 - ldist / 80) * 0.15})`
                            : `rgba(29, 78, 216, ${(1 - ldist / 80) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            // Modern vector cards inspired by Torii Studio UI layout
            ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';
            ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 1;

            const rectWidth = 120 + Math.sin(time) * 10;
            const rectHeight = 36;
            const rx = width / 2 - rectWidth / 2 + Math.cos(time * 0.15) * 20;
            const ry = height / 2 - rectHeight / 2 + Math.sin(time * 0.2) * 20;

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(rx, ry, rectWidth, rectHeight, 6);
            } else {
                ctx.rect(rx, ry, rectWidth, rectHeight);
            }
            ctx.fill();
            ctx.stroke();

            // Action dots/blocks inside
            ctx.fillStyle = isDarkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(37, 99, 235, 0.6)';
            const r2x = rx - 30;
            const r2y = ry + 8;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(r2x, r2y, 22, 20, 4);
            } else {
                ctx.rect(r2x, r2y, 22, 20);
            }
            ctx.fill();

            ctx.fillStyle = isDarkMode ? 'rgba(244, 63, 94, 0.6)' : 'rgba(225, 29, 72, 0.6)';
            const r3x = rx + rectWidth + 8;
            const r3y = ry + 8;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(r3x, r3y, 22, 20, 4);
            } else {
                ctx.rect(r3x, r3y, 22, 20);
            }
            ctx.fill();

            animationId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (canvas) canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [showLandingGate, isDarkMode]);

    const handleEnterPortal = () => {
        if (isEnteringRef.current) return;
        isEnteringRef.current = true;

        const gateTimeline = anime.timeline({
            complete: () => {
                setShowLandingGate(false);
                document.body.style.overflow = 'unset';

                triggerMainHeroAnimation();

                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 50);
            }
        });

        gateTimeline
        .add({
            targets: gateContentRef.current,
            opacity: 0,
            scale: 1.3,
            duration: 800,
            easing: 'easeInQuad'
        })
        .add({
            targets: gateDoorRef.current,
            scale: 4,
            opacity: [1, 0],
            duration: 1200,
            easing: 'easeInOutExpo'
        }, '-=400')
        .add({
            targets: landingGateRef.current,
            opacity: 0,
            duration: 600,
            easing: 'linear'
        }, '-=600');
    };

    useEffect(() => {
        if (!showLandingGate) return;

        const handleGateWheel = (e) => {
            if (e.deltaY > 10) {
                handleEnterPortal();
            }
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const touchEndY = e.touches[0].clientY;
            if (touchStartY - touchEndY > 30) {
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

    // Smooth navigation scrolling
    const handleNavClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // General card scroll slide-in transition observer
    useEffect(() => {
        if (showLandingGate) return;

        const animElements = document.querySelectorAll('.scroll-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        animElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [showLandingGate]);

    // Cursor glitter trail effect (Top section only)
    useEffect(() => {
        if (showLandingGate) return;

        const handleMouseMoveGlitter = (e) => {
            if (window.scrollY > 400) return;

            const container = document.getElementById('glitter-container');
            if (!container) return;

            for (let i = 0; i < 2; i++) {
                const sparkle = document.createElement('div');
                const size = Math.random() * 5 + 3; // size between 3px and 8px

                sparkle.className = 'pointer-events-none fixed rounded-full transition-all duration-700 ease-out z-[9999]';
                sparkle.style.left = `${e.clientX}px`;
                sparkle.style.top = `${e.clientY}px`;
                sparkle.style.width = `${size}px`;
                sparkle.style.height = `${size}px`;

                const colors = [
                    'rgba(59, 130, 246, 0.85)', // blue-500
                    'rgba(14, 165, 233, 0.85)', // sky-500
                    'rgba(96, 165, 250, 0.7)',  // blue-400
                ];
                sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                sparkle.style.boxShadow = '0 0 6px rgba(59, 130, 246, 0.7)';

                const vx = (Math.random() - 0.5) * 2;
                const vy = (Math.random() - 0.5) * 2 + 0.8;

                container.appendChild(sparkle);

                requestAnimationFrame(() => {
                    sparkle.style.transform = `translate(${vx * 24}px, ${vy * 24}px) scale(0)`;
                    sparkle.style.opacity = '0';
                });

                setTimeout(() => {
                    sparkle.remove();
                }, 700);
            }
        };

        window.addEventListener('mousemove', handleMouseMoveGlitter);
        return () => window.removeEventListener('mousemove', handleMouseMoveGlitter);
    }, [showLandingGate]);

    return (
        <>
            {/* Glitter particle container */}
            <div id="glitter-container" className="fixed inset-0 pointer-events-none z-[9999]" />

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
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1648291881755-f984c18e16cb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
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
                        <div className="text-lg font-black tracking-widest font-black text-white uppercase">KODE ETIK PENELITIAN</div>
                        <div className="text-xs border-b border-white/40 pb-0.5 cursor-pointer hover:text-white transition">AKTUALITAS ◆</div>
                    </div>

                    {/* Bagian Tengah: Judul Besar & Pintu Misterius */}
                    <div className="relative flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl flex-1">

                        {/* Pintu Gerbang */}
                        <div
                            ref={gateDoorRef}
                            className="absolute w-72 h-96 sm:w-80 sm:h-[420px] bg-blue-200 border-4 border-slate-900/40 rounded-t-xl shadow-2xl flex flex-col items-center justify-start p-4 bg-cover bg-blend-multiply will-change-transform z-0 gate-fade-in opacity-0"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1700581182740-dd9d3ad180cc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                                boxShadow: '0 0 80px rgba(0,0,0,0.8) inset'
                            }}
                        >
                            <div className="border border-blue-500/20 px-3 py-1 rounded text-[10px] tracking-widest text-blue-200/80 uppercase font-mono mt-6 bg-black/40">
                                Go To Menu
                            </div>
                        </div>

                        {/* Konten Teks & Tombol utama */}
                        <div ref={gateContentRef} className="relative z-10 flex flex-col items-center gate-fade-in opacity-0 will-change-transform">
                            <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-white uppercase font-serif drop-shadow-lg mb-6 selection:bg-blue-500">
                                WELCOME REASERCHERS
                            </h1>

                            <button
                                onClick={handleEnterPortal}
                                className="mt-24 px-8 py-4 bg-slate-955/90 hover:bg-white hover:text-black text-white border border-white/30 rounded font-serif tracking-widest text-xs drop-shadow-lg uppercase transition-all duration-300 shadow-2xl backdrop-blur-sm flex items-center gap-3 group"
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

            {/* --- 3. HALAMAN UTAMA: TORII STUDIO LAYOUT & AESTHETIC --- */}
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-300 overflow-x-hidden selection:bg-blue-600 selection:text-white">

                {/* --- HEADER NAVBAR --- */}
                <header className="sticky top-0 z-50 bg-slate-50/10 dark:bg-slate-955/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 sm:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">

                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="images/KEP.png" alt="Logo KEP" className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-black tracking-[0.3em] uppercase text-slate-900 dark:text-white">SISTEM KEP</span>
                        </div>

                        {/* Navigation Links (torii.studio style with smooth scroll) */}
                        <nav className="hidden md:flex gap-8 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-black dark:text-white">
                            <a href="#prinsip" onClick={(e) => handleNavClick(e, 'prinsip')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Layanan KEP</a>
                            <a href="#alur" onClick={(e) => handleNavClick(e, 'alur')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Alur Telaah</a>
                            <a href="#download" onClick={(e) => handleNavClick(e, 'download')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Template</a>
                            <a href="#kontak" onClick={(e) => handleNavClick(e, 'kontak')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">Tentang Kami</a>
                        </nav>

                        {/* CTA Buttons / Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                            </button>

                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-mono text-[10px] font-bold tracking-wider uppercase transition shadow-lg shadow-blue-500/25 flex items-center gap-2 group"
                                >
                                    Dashboard <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition hidden sm:inline"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-mono text-[10px] font-bold tracking-wider uppercase transition shadow-lg shadow-blue-500/25 flex items-center gap-1.5 group"
                                    >
                                        Ajukan Proposal <span className="group-hover:translate-x-0.5 transition-transform duration-300">↗</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- HERO SECTION: TORII STUDIO INSPIRED SIDE-BY-SIDE --- */}
                <section ref={heroSectionRef} className="relative min-h-[calc(100vh-80px)] flex items-center px-4 sm:px-8 lg:px-16 py-16 max-w-7xl mx-auto">

                    {/* Parallax Background Grid / Dots */}
                    <div
                        ref={parallaxBgRef}
                        className="absolute inset-0 pointer-events-none opacity-20 transition-transform duration-75 ease-out will-change-transform bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]"
                    ></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10">

                        {/* Left Side: Headline Copy */}
                        <div ref={parallaxContentRef} className="lg:col-span-7 flex flex-col items-start text-left transition-transform duration-75 will-change-transform">
                            <h1 className="hero-element opacity-0 text-5xl sm:text-6xl lg:text-[76px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
                                Start Your <br/>
                                <span className="text-transparent bg-clip-text bg-blue-600 dark:bg-blue-400">Research</span>
                            </h1>
                            <p className="hero-element opacity-0 text-slate-600 dark:text-slate-400 text-lg sm:text-xl font-light leading-relaxed max-w-xl mb-12">
                                Kami membantu akademisi dan praktisi mempercepat penelaahan etik proposal riset melalui platform digital yang aman, transparan, dan berstandar internasional.
                            </p>

                            {/* Interactive Rotating CTA Button */}
                            <div className="hero-element opacity-0 flex items-center gap-6">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center cursor-pointer group"
                                >
                                    {/* Rotating Text path */}
                                    <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-spin" style={{ animationDuration: '12s' }}>
                                        <defs>
                                            <path
                                                id="circlePath"
                                                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                            />
                                        </defs>
                                        <text className="font-mono text-[6.5px] font-bold tracking-[0.24em] fill-slate-500 dark:fill-slate-400 uppercase">
                                            <textPath href="#circlePath">
                                                AJUKAN SEKARANG ◆ LAIK ETIK ◆ MULAI PROPOSAL ◆ KEP DIGITAL ◆
                                            </textPath>
                                        </text>
                                    </svg>

                                    {/* Center Arrow Circle */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center shadow-xl shadow-blue-600/30 group-hover:scale-105 transition-all duration-300 z-10">
                                        <span className="text-white text-2xl font-bold group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </div>
                                </Link>

                                <div className="hidden sm:block">
                                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 block mb-1">PROSES PENGAJUAN</span>
                                    <a href="#alur" onClick={(e) => handleNavClick(e, 'alur')} className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium border-b border-slate-300 dark:border-white/10 pb-0.5">
                                        Pelajari detail 4 langkah telaah →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Masked Interactive Canvas Particle Visualizer */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end hero-element opacity-0 relative">

                            {/* Decorative blueprint grids in background */}
                            <div
                                ref={parallaxOfficeLayerRef}
                                className="absolute -top-10 -left-10 w-48 h-48 border border-slate-200 dark:border-white/5 rounded-full pointer-events-none transition-transform duration-75 will-change-transform hidden lg:block"
                                style={{
                                    backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                                    backgroundSize: '16px 16px'
                                }}
                            ></div>

                            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900/60 backdrop-blur-sm group cursor-crosshair">

                                {/* Live interactive canvas */}
                                <canvas
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full block z-10"
                                />

                                {/* Glass overlay ring */}
                                <div className="absolute inset-0 border-2 border-slate-200 dark:border-white/10 rounded-full pointer-events-none z-20 group-hover:border-blue-500/20 transition-colors duration-500"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- STATISTIK --- */}
                <section ref={statsRef} className="py-20 border-y border-slate-200 dark:border-white/5 bg-slate-55 dark:bg-slate-950/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-4">
                            <p className="text-5xl lg:text-6xl font-black text-blue-600 dark:text-blue-500 mb-3 tracking-tight">
                                <span ref={stat1Ref}>0</span>+
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs tracking-widest uppercase">Proposal Riset Direview</p>
                        </div>
                        <div className="p-4">
                            <p className="text-5xl lg:text-6xl font-black text-blue-600 dark:text-blue-500 mb-3 tracking-tight">
                                <span ref={stat2Ref}>0</span>
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs tracking-widest uppercase">Reviewer Ahli Aktif</p>
                        </div>
                        <div className="p-4">
                            <p className="text-5xl lg:text-6xl font-black text-sky-500 dark:text-sky-400 mb-3 tracking-tight">
                                &lt;<span ref={stat3Ref}>0</span> Hari
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs tracking-widest uppercase">Rata-rata Waktu Proses</p>
                        </div>
                    </div>
                </section>

                {/* --- OUR PILLARS (TORII STUDIO PILLARS COPY & STYLE) --- */}
                <section id="prinsip" ref={principlesRef} className="py-32 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
                        <div className="lg:w-1/2">
                            <span className="font-mono text-[10px] font-black tracking-[0.35em] text-blue-600 dark:text-blue-500 uppercase block mb-3">LAYANAN UTAMA</span>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                Pilar Integritas <br/>Penelitian KEP Digital
                            </h2>
                        </div>
                        <p className="lg:w-1/2 text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed">
                            Kami menggabungkan inovasi teknologi sistem telaah, kerangka kerja terstandarisasi, serta kepatuhan hukum untuk melahirkan penelitian berintegritas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Pillar 01 */}
                        <div className="principle-card scroll-animate transform transition duration-700 ease-out opacity-0 translate-y-10 border-t border-slate-200 dark:border-white/10 pt-10 group hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-500">
                            <span className="text-5xl font-black text-slate-200 dark:text-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-500 font-mono transition-colors duration-500 block mb-8">01</span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Telaah Cepat &amp; Akurat
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                Evaluasi berkas pengajuan secara digital oleh komite etik internal dan penelaah independen (Exempted, Expedited, maupun Full Board).
                            </p>
                        </div>

                        {/* Pillar 02 */}
                        <div className="principle-card scroll-animate transform transition duration-700 ease-out opacity-0 translate-y-10 border-t border-slate-200 dark:border-white/10 pt-10 group hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-500">
                            <span className="text-5xl font-black text-slate-200 dark:text-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-500 font-mono transition-colors duration-500 block mb-8">02</span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Perlindungan Subjek Riset
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                Menjamin penerapan informed consent secara eksplisit, asas kebermanfaatan subjek manusia, serta standarisasi kesejahteraan hewan coba.
                            </p>
                        </div>

                        {/* Pillar 03 */}
                        <div className="principle-card scroll-animate transform transition duration-700 ease-out opacity-0 translate-y-10 border-t border-slate-200 dark:border-white/10 pt-10 group hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-500">
                            <span className="text-5xl font-black text-slate-200 dark:text-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-500 font-mono transition-colors duration-500 block mb-8">03</span>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Standarisasi CIOMS &amp; WHO
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                Seluruh instrumen penelaahan disinkronisasikan langsung dengan regulasi nasional KEPK dan panduan etika riset global.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- CASE STUDIES / WORK: PORTFOLIO GRID --- */}
                <section id="alur" className="py-32 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 px-4 sm:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto">

                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div>
                                <span className="font-mono text-[10px] font-black tracking-[0.35em] text-blue-600 dark:text-blue-500 uppercase block mb-3">ALUR TELAAH</span>
                                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">4 Langkah Digital</h2>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-mono uppercase tracking-wider">
                                Proses Online Penuh Tanpa Kertas
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { step: '01', title: 'Registrasi & Akun', desc: 'Peneliti mendaftarkan akun dan memverifikasi institusi asal secara online.' },
                                { step: '02', title: 'Unggah Protokol', desc: 'Mengisi form protokol riset digital dan mengunggah dokumen informed consent.' },
                                { step: '03', title: 'Evaluasi Komite', desc: 'Proses penelaahan berkas oleh tim penelaah ahli secara transparan.' },
                                { step: '04', title: 'Kelayakan Etik', desc: 'Penerbitan surat keterangan laik etik (Ethical Clearance) berformat digital.' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-8 hover:border-blue-600/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 group shadow-sm dark:shadow-none scroll-animate transform transition duration-700 ease-out opacity-0 translate-y-10">
                                    <span className="text-3xl font-black text-blue-600/20 dark:text-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors font-mono block mb-6">{item.step}</span>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- DOWNLOAD TEMPLATE HUB --- */}
                <section id="download" className="py-32 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
                    <div className="bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-white/15 rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-sm dark:shadow-none scroll-animate transform transition duration-700 ease-out opacity-0 translate-y-10">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <span className="font-mono text-[10px] font-black tracking-[0.35em] text-blue-600 dark:text-blue-500 block mb-3">PUSAT UNDUHAN</span>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Template Berkas Administrasi</h2>
                            <p className="mb-10 text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                Persiapkan berkas kelengkapan protokol riset Anda sebelum mendaftar agar mempercepat proses review oleh komite kami.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded font-semibold transition flex items-center justify-center gap-2 shadow-sm">
                                    <FileText className="w-5 h-5 text-blue-600"/> Ringkasan Protokol
                                </button>
                                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition flex items-center justify-center gap-2 shadow-lg">
                                    <FileText className="w-5 h-5 text-white"/> Formulir Pengajuan
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FOOTER GET IN TOUCH (TORII STUDIO EMAIL/PHONE LAYOUT) --- */}
                <footer id="kontak" className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 py-24 px-4 sm:px-8 lg:px-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Left Side: Large Get in Touch */}
                        <div className="lg:col-span-6">
                            <span className="font-mono text-[10px] font-black tracking-[0.35em] text-blue-600 dark:text-blue-500 uppercase block mb-3">CONTACT US</span>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Hubungi Kami</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed max-w-md mb-8">
                                Butuh panduan pengajuan atau memiliki pertanyaan terkait regulasi etik penelitian? Hubungi sekretariat KEP kami.
                            </p>

                            {/* Contact Links */}
                            <div className="space-y-4">
                                <a href="mailto:kep@institusi.ac.id" className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition tracking-tight">
                                    kep@institusi.ac.id
                                </a>
                                <a href="tel:0211234567" className="block text-xl font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition font-mono">
                                    (021) 1234567
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Quick Links & Location */}
                        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:pl-12">
                            <div>
                                <h4 className="font-mono text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">Tautan Cepat</h4>
                                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-light">
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Tentang Komisi Etik</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Panduan Peneliti</a></li>
                                    <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition">FAQ &amp; Bantuan</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-mono text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6">Sekretariat KEP</h4>
                                <address className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed not-italic">
                                    Gedung Rektorat Lt. 3,<br/>
                                    Kampus Utama Universitas,<br/>
                                    Jakarta, Indonesia
                                </address>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 font-light gap-4">
                        <div>
                            &copy; {new Date().getFullYear()} Komisi Etik Penelitian. All rights reserved.
                        </div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-500">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-500">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
