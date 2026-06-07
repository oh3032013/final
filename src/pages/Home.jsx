import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Cpu, Monitor, Mic, Gamepad2, Send,
  Menu, X, Youtube, Disc, MessageSquare, Twitter, Instagram, Settings,
  Search, Calendar, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher'; // تأكد من صحة المسار حسب مكان الملف عندك
import PortfolioShowcase from '../PortfolioShowcase';
import AdSenseAd from '../components/AdSenseAd';
import SEOHead from '../components/SEOHead';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const SITE_URL = 'https://omarxgaming.com';
const logoImg = '/omarxgaming-logo-512.jpg';
const compactLogoImg = '/omarxgaming-logo-256.jpg';

const defaultStats = { subscribers: 150000, views: 12450000, videos: 382 };

const defaultFaqs = [
  {
    id: 'sponsorship',
    question: 'كيف أتواصل مع OmarXGaming للرعاية أو الإعلان؟',
    answer: 'يمكنك استخدام نموذج التواصل في آخر الصفحة مع كتابة تفاصيل العرض والبريد الإلكتروني، وسيتم الرد عليك في أقرب وقت.'
  },
  {
    id: 'content',
    question: 'ما نوع المحتوى الذي تقدمه القناة؟',
    answer: 'تقدم القناة تحديات ألعاب، بث مباشر، مراجعات وتجارب ترفيهية موجهة لمحبي الجيمينج.'
  },
  {
    id: 'videos',
    question: 'أين أجد أحدث الفيديوهات؟',
    answer: 'قسم الفيديوهات يعرض أحدث المقاطع المتاحة من لوحة التحكم، ويمكنك أيضا زيارة قناة OmarXGaming على YouTube.'
  }
];

const getYouTubeThumbnail = (youtubeId, quality = 'hqdefault') =>
  `https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`;

// مكون العداد المتحرك للأرقام
const AnimatedCounter = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (end === 0) return;

    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  return (
    <div className="text-center" style={{ padding: '24px' }}>
      <div className="digital-font gradient-text-cyber mb-2" style={{ fontSize: '38px', fontWeight: '900' }}>
        {formatNumber(count)}{suffix}
      </div>
      <div className="text-muted" style={{ fontSize: '15px', fontWeight: '700' }}>{label}</div>
    </div>
  );
};

function Home() {
  // الحالات (States)
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(defaultStats);
  const [videos, setVideos] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true); // لودر التحميل الأسطوري
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [embedInline, setEmbedInline] = useState(false);

  // إعدادات الـ CMS والديناميكية المضافة
  const [settings, setSettings] = useState({
    channelHandle: "@omarxgaming123",
    heroTitle: "مرحباً بك في عالم OmarXGaming",
    heroSubtitle: "حيث للألعاب متعة أخرى! 🎮",
    heroDescription: "أهلاً بك يا بطل! أنا عمر، صانع محتوى وبث مباشر متخصص...",
    themeColor: "cyberpunk",
    soundEnabled: true,
    customCursorEnabled: false
  });

  const [socials, setSocials] = useState({
    youtube: "https://www.youtube.com/@omarxgaming123",
    discord: "https://discord.gg/omarxgaming",
    tiktok: "https://tiktok.com/@omarxgaming",
    twitter: "https://twitter.com/omarxgaming",
    instagram: "https://instagram.com/omarxgaming"
  });

  const [faqs, setFaqs] = useState(defaultFaqs);
  const [schedule, setSchedule] = useState([]);
  const [gear, setGear] = useState([]);

  // ميزات الفلترة والبحث والصوت ومؤشر الفأرة
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const audioContextRef = useRef(null);

  // نموذج الاتصال
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  // 1. توليد نغمات الويب (Web Audio Synthesis) لأصوات الجيمينج
  const playSynthSound = (frequency = 600, type = 'sine', duration = 0.08) => {
    if (audioMuted || !settings.soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioCtx = audioContextRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn('Web Audio not allowed yet:', err);
    }
  };

  const playHoverSound = () => playSynthSound(800, 'sine', 0.05);
  const playClickSound = () => playSynthSound(450, 'triangle', 0.12);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePointerMode = () => {
      setIsFinePointer(pointerQuery.matches && !motionQuery.matches);
    };

    updatePointerMode();
    pointerQuery.addEventListener('change', updatePointerMode);
    motionQuery.addEventListener('change', updatePointerMode);

    return () => {
      pointerQuery.removeEventListener('change', updatePointerMode);
      motionQuery.removeEventListener('change', updatePointerMode);
    };
  }, []);

  // Testing helper: allow forcing a mobile layout via ?mobile=1
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mobile') === '1') {
        document.body.classList.add('force-mobile');
      }
    } catch (err) {
      // ignore (e.g., SSR)
    }

    return () => {
      try { document.body.classList.remove('force-mobile'); } catch (e) { }
    };
  }, []);

  useEffect(() => {
    const themeClasses = ['theme-toxic', 'theme-ruby', 'custom-cursor-active'];
    document.body.classList.remove(...themeClasses);

    if (settings.themeColor && settings.themeColor !== 'cyberpunk') {
      document.body.classList.add(`theme-${settings.themeColor}`);
    }

    if (settings.customCursorEnabled && isFinePointer) {
      document.body.classList.add('custom-cursor-active');
    }

    return () => {
      document.body.classList.remove(...themeClasses);
    };
  }, [settings.themeColor, settings.customCursorEnabled, isFinePointer]);

  // تتبع حركة الفأرة والتمرير لتحديث المؤثرات
  useEffect(() => {
    let mouseFrame = 0;
    let scrollFrame = 0;

    const handleMouseMove = (e) => {
      if (!isFinePointer || !settings.customCursorEnabled) return;
      const nextPos = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(mouseFrame);
      mouseFrame = requestAnimationFrame(() => setCursorPos(nextPos));
    };

    const handleScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0);
      });
    };

    handleScroll();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(mouseFrame);
      cancelAnimationFrame(scrollFrame);
    };
  }, [isFinePointer, settings.customCursorEnabled]);

  // جلب البيانات بالكامل دفعة واحدة دفعة /all
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const finishLoading = () => {
      if (!isMounted) return;
      setLoadingVideos(false);
      window.setTimeout(() => {
        if (isMounted) setLoadingApp(false);
      }, 450);
    };

    if (!API_BASE_URL) {
      finishLoading();
      return () => {
        isMounted = false;
      };
    }

    fetch(`${API_BASE_URL}/api/public/all`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Public data request failed: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (data?.success) {
          setStats(data.stats || defaultStats);
          setVideos(Array.isArray(data.videos) ? data.videos : []);
          setSettings(prev => ({ ...prev, ...(data.settings || {}) }));
          setSocials(prev => ({ ...prev, ...(data.socials || {}) }));
          setFaqs(Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : defaultFaqs);
          setSchedule(Array.isArray(data.schedule) ? data.schedule : []);
          setGear(Array.isArray(data.gear) ? data.gear : []);
        }
        finishLoading();
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        console.error('Error fetching dynamic site data:', err);
        finishLoading();
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // معالجة إرسال نموذج التواصل
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setFormStatus({ loading: true, success: false, error: null });

    if (!API_BASE_URL) {
      setFormStatus({
        loading: false,
        success: false,
        error: 'نموذج التواصل يحتاج تفعيل رابط السيرفر في إعدادات النشر.'
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setFormStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', company: '', message: '' });
        playSynthSound(900, 'sine', 0.25); // نغمة نجاح أطول
        setTimeout(() => {
          setFormStatus(prev => ({ ...prev, success: false }));
        }, 5000);
      } else {
        setFormStatus({ loading: false, success: false, error: data.message });
      }
    } catch (err) {
      setFormStatus({ loading: false, success: false, error: 'تعذر الاتصال بالخادم. يرجى التثبت من تشغيل السيرفر!' });
    }
  };

  const scrollToSection = (id) => {
    playClickSound();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // تصفية وقراءة الفيديوهات المبحوث عنها
  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return videos;

    return videos.filter(vid => {
      const title = (vid.title || '').toLowerCase();
      const description = (vid.description || '').toLowerCase();
      return title.includes(query) || description.includes(query);
    });
  }, [videos, searchQuery]);

  // اختيار أول فيديو كـ "فيديو مميز" كأولوية بصرياً
  const spotlightVideo = useMemo(() => videos[0] || null, [videos]);
  // باقي الفيديوهات تعرض في الشبكة
  const gridVideos = useMemo(() => (
    spotlightVideo ? filteredVideos.filter(v => v.id !== spotlightVideo.id) : filteredVideos
  ), [filteredVideos, spotlightVideo]);

  const seoSchemas = useMemo(() => {
    const sameAs = Object.values(socials).filter(Boolean);
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'OmarXGaming',
        alternateName: 'عمر اكس جيمينج',
        url: SITE_URL,
        image: `${SITE_URL}${logoImg}`,
        jobTitle: 'صانع محتوى ألعاب',
        description: 'صانع محتوى ألعاب ويوتيوبر متخصص في الجيمينج والبث المباشر.',
        sameAs
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'OmarXGaming',
        url: SITE_URL,
        inLanguage: ['ar', 'en'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ];

    if (faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.slice(0, 8).map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }

    const videoItems = videos
      .filter(video => video.youtubeId && video.title)
      .slice(0, 6)
      .map((video, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: video.title,
          description: video.description || 'فيديو من قناة OmarXGaming',
          thumbnailUrl: getYouTubeThumbnail(video.youtubeId),
          embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
          url: `https://www.youtube.com/watch?v=${video.youtubeId}`
        }
      }));

    if (videoItems.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: videoItems
      });
    }

    return schemas;
  }, [socials, faqs, videos]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* 🔎 SEO Dynamic Meta Tags */}
      <SEOHead
        title="OmarXGaming | عالم الألعاب والإثارة اللامتناهية 🎮"
        description="محفظة أعمال صانع المحتوى واليوتيوبر الأسطوري OmarXGaming. استكشف أحدث الفيديوهات، الإحصائيات، وأدوات الجيمينج الاحترافية وتواصل معنا للرعاية والشراكات."
        canonical="/"
        ogImage={logoImg}
        schema={seoSchemas}
        keywords={[
          'OmarXGaming',
          'ألعاب',
          'جيمينج',
          'يوتيوبر ألعاب',
          'بث مباشر',
          'مراجعات ألعاب',
          'gaming creator'
        ]}
      />
      {/* 🔴 لودر التحميل الأسطوري (Gaming Loader Screen) */}
      {loadingApp && (
        <div className="loader-screen-overlay">
          <div className="loader-logo-holder">
            <img src={compactLogoImg} alt="OmarXGaming Loading..." width="120" height="120" decoding="async" />
          </div>
          <div className="loader-text">{t('hero.initializing', 'OMARXGAMING IS INITIALIZING...')}</div>
          <div className="loader-bar-bg">
            <div className="loader-bar-fill"></div>
          </div>
        </div>
      )}

      {/* 🔴 مؤشر الفأرة التفاعلي الشبكي Crosshair (عند التفعيل) */}
      {settings.customCursorEnabled && isFinePointer && !loadingApp && (
        <>
          <div className="custom-crosshair" style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>
          <div className="custom-crosshair-ring" style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}></div>
        </>
      )}

      {/* 🔴 مؤشر تمرير الصفحة النيوني (Scroll Progress) */}
      <div className="scroll-progress-line" style={{ width: `${scrollProgress}%` }}></div>

      {/* المؤثرات الضوئية في الخلفية */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* 1. شريط التنقل (Navbar) */}
      <nav className="navbar" onMouseEnter={playHoverSound} aria-label="التنقل الرئيسي">
        <div className="container navbar-container">

          {/* الشعار والاسم */}
          <div className="navbar-brand" onClick={() => scrollToSection('hero')}>
            <div className="brand-logo-wrapper">
              <img src={compactLogoImg} alt="OmarXGaming Logo" width="42" height="42" decoding="async" />
            </div>
            <span className="digital-font gradient-text-cyber brand-text">
              {settings.channelHandle.replace('@', '')}
            </span>
          </div>

          {/* الروابط لنسخة الديسكتوب */}
          <div className="nav-menu-desktop">
            <ul className="nav-links">
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('hero')}>{t('navbar.home', 'الرئيسية')}</li>
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('about')}>{t('navbar.about', 'نبذة عني')}</li>
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('videos')}>{t('navbar.videos', 'الفيديوهات')}</li>
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('gear')}>{t('navbar.gear', 'عتاد الجيمينج')}</li>
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('faqs')}>{t('navbar.faqs', 'الأسئلة الشائعة')}</li>
              <li className="nav-link-item" onMouseEnter={playHoverSound} onClick={() => scrollToSection('contact')}>{t('navbar.contact', 'تواصل معي')}</li>
            </ul>
          </div>

          {/* أزرار الصوت والاشتراك */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* زر كتم وتفعيل أصوات الموقع */}
            {settings.soundEnabled && (
              <button
                type="button"
                onClick={() => {
                  setAudioMuted(!audioMuted);
                  playSynthSound(700, 'sine', 0.05);
                }}
                className="soundwave-btn"
                aria-label={audioMuted ? t('navbar.unmute_sound', 'تشغيل أصوات النظام') : t('navbar.mute_sound', 'كتم الأصوات')}
                title={audioMuted ? t('navbar.unmute_sound', 'تشغيل أصوات النظام') : t('navbar.mute_sound', 'كتم الأصوات')}
              >
                <div className={`soundwave-waves ${!audioMuted ? 'active' : ''}`}>
                  <div className="soundwave-bar"></div>
                  <div className="soundwave-bar"></div>
                  <div className="soundwave-bar"></div>
                  <div className="soundwave-bar"></div>
                </div>
              </button>
            )}

            <LanguageSwitcher />

            <div className="navbar-cta-desktop">
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="btn-neon-red pulse-neon-animation"
                style={{ padding: '10px 24px', fontSize: '13px' }}
              >
                {t('navbar.subscribe_btn', 'اشترك في القناة')}
              </a>
            </div>

            {/* زر القائمة للموبايل */}
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>

          {/* قائمة الموبايل المنسدلة */}
          {mobileMenuOpen && (
            <div className="mobile-dropdown">
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('hero')}>{t('navbar.home', 'الرئيسية')}</span>
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('about')}>{t('navbar.about', 'نبذة عني')}</span>
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('videos')}>{t('navbar.videos', 'الفيديوهات')}</span>
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('gear')}>{t('navbar.gear', 'عتاد الجيمينج')}</span>
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('faqs')}>{t('navbar.faqs', 'الأسئلة الشائعة')}</span>
              <span className="mobile-dropdown-item" onClick={() => scrollToSection('contact')}>{t('navbar.contact', 'تواصل معي')}</span>
              <LanguageSwitcher />
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="btn-neon-red"
                style={{ padding: '14px 0', display: 'flex', justifyContent: 'center' }}
              >
                {t('navbar.subscribe_btn', 'اشترك في القناة')}
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* 2. الواجهة الرئيسية (Hero Section) */}
      <header id="hero" className="hero-section">
        <div className="container">
          <div className="hero-grid">

            {/* النصوص التوضيحية والـ CTA */}
            <div className="hero-content">
              <div className="badge-tag mb-6" onMouseEnter={playHoverSound}>
                <Gamepad2 size={16} />
                {t('hero.platform_badge', 'المنصة الرسمية للاعبين')}
              </div>

              <h1 className="hero-title mb-6">
                {settings.heroTitle.split(' ').map((word, i) => (
                  word.toLowerCase().includes('omarxgaming')
                    ? <span key={i} className="gradient-text-cyber digital-font title-glow">{word} </span>
                    : <span key={i}>{word} </span>
                ))}
                <br />
                <span className="gradient-text-cyan">{settings.heroSubtitle}</span>
              </h1>

              <p className="hero-desc mb-8">
                {settings.heroDescription || t('hero.description')}
              </p>

              <div className="hero-actions">
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="btn-cyber-solid"
                >
                  <Youtube size={20} />
                  {t('hero.subscribe_now_btn', 'اشترك في القناة الآن')}
                </a>
                <button
                  type="button"
                  onClick={() => scrollToSection('videos')}
                  className="btn-neon-cyan"
                >
                  <Play size={20} />
                  {t('hero.watch_videos_btn', 'شاهد الفيديوهات')}
                </button>
              </div>
            </div>

            {/* لوجو القناة المتحرك الضخم */}
            <div className="hero-logo-container">
              <div className="hero-logo-glow-wrapper float-animation">
                <div className="logo-ambient-glow"></div>
                <div className="logo-neon-ring-1"></div>
                <div className="logo-neon-ring-2"></div>

                <div className="logo-image-holder">
                  <img
                    src={logoImg}
                    alt="OmarXGaming Logo"
                    width="512"
                    height="512"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 🔴 إعلان جوجل أدسينس الأول - بانر علوي (Top_Banner_Home) */}
      <AdSenseAd
        client="ca-pub-1482790042335653"
        slot="6611042352"
      />

      {/* 🔴 شريط الشركات الراعية (Brand sponsors carousel) */}
      <div className="brand-carousel-container">
        <div className="brand-carousel-track">
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>ASUS ROG</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>NVIDIA GEFORCE</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>STEELSERIES</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>SONY PLAYSTATION</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>LOGITECH G</div>
          {/* كرر العناصر للدوران اللا نهائي */}
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>ASUS ROG</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>NVIDIA GEFORCE</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>STEELSERIES</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>SONY PLAYSTATION</div>
          <div className="brand-logo-item" onMouseEnter={playHoverSound}>LOGITECH G</div>
        </div>
      </div>

      {/* 3. نبذة عني والإحصائيات (About & Stats & Stream Schedule) */}
      <section id="about" className="section-padding" style={{ background: 'rgba(12, 6, 29, 0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">

          <div className="text-center mb-16">
            <h2 className="gradient-text-primary" style={{ fontSize: '36px', fontWeight: '900' }}>{t('about.section_title', 'نبذة عن القناة 🌐')}</h2>
            <div className="neon-divider"></div>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {t('about.section_desc', 'تعرّف على عمر صانع محتوى الألعاب الشغوف وإحصائيات رحلته وجدول بثه المباشر.')}
            </p>
          </div>

          <div className="about-grid">

            <div className="about-bio">
              <h3 className="about-bio-title" style={{ fontWeight: '800' }}>{t('about.bio_title', 'شغف، لعب، ومشاركتكم المتعة! 🎮')}</h3>
              <p className="about-bio-text">
                {t('about.bio_text', 'بدأت رحلتي في صناعة المحتوى على اليوتيوب بدافع حب الألعاب ومشاركتها مع مجتمع رائع. أركز في قناتي على تقديم محتوى مميز يتسم بالنشاط العالي والاحترافية والترفيه وتحديات الرعب الأقوى.')}
              </p>

              <div className="stats-grid">
                <div className="cyber-card cyan-glow">
                  <AnimatedCounter value={stats.subscribers} label={t('about.counter_subscribers', 'المشتركين')} suffix="+" />
                </div>
                <div className="cyber-card purple-glow">
                  <AnimatedCounter value={stats.views} label={t('about.counter_views', 'المشاهدات')} suffix="+" />
                </div>
                <div className="cyber-card cyan-glow">
                  <AnimatedCounter value={stats.videos} label={t('about.counter_videos', 'الفيديوهات')} />
                </div>
              </div>
            </div>

            {/* 🔴 جدول البث المباشر المضيء (Weekly Schedule) */}
            <div>
              {schedule && schedule.length > 0 && (
                <div className="schedule-board">
                  <div className="schedule-header">
                    <Calendar size={20} />
                    {t('schedule.board_title', 'جدول البث والألعاب الأسبوعية')}
                  </div>
                  <div className="schedule-body">
                    {schedule.map((sch, i) => (
                      <div key={i} className="schedule-row" onMouseEnter={playHoverSound}>
                        <span className="schedule-day">{sch.day}</span>
                        <span className="schedule-game">{sch.game}</span>
                        <span className="schedule-time">{sch.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>
      <PortfolioShowcase />

      {/* 🔴 إعلان جوجل أدسينس الثاني - بانر أوسط (Middle_Banner_Home) */}
      <AdSenseAd
        client="ca-pub-1482790042335653"
        slot="9026138464"
      />

      {/* 4. أحدث الفيديوهات (Latest Videos Grid with Search & Spotlight Video) */}
      <section id="videos" className="section-padding">
        <div className="container">

          <div className="text-center mb-12">
            <h2 className="gradient-text-accent" style={{ fontSize: '36px', fontWeight: '900' }}>{t('videos.section_title', 'أحدث الفيديوهات 🔥')}</h2>
            <div className="neon-divider"></div>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '24px' }}>
              {t('videos.section_desc', 'شاهد أحدث التحديات ومراجعات الألعاب المميزة في قناتي. انقر على أي فيديو لتشغيله بسينما الموقع!')}
            </p>

            {/* 🔴 شريط البحث الذكي بالفيديوهات */}
            <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder={t('videos.search_placeholder', 'ابحث عن فيديوهات (تحدي، مراجعة، رعب...)')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  playHoverSound();
                }}
                className="cyber-input"
                style={{ paddingRight: '48px', paddingLeft: '16px' }}
              />
              <div style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={18} />
              </div>
            </div>
          </div>

          {loadingVideos ? (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <div className="w-12 h-12 animate-spin" style={{ margin: '0 auto 20px auto', width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(0,240,255,0.1)', borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite' }}></div>
              <span className="digital-font" style={{ color: 'var(--color-accent)', fontWeight: '800' }}>{t('videos.loading_text', 'LOADING MISSIONS...')}</span>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: '64px 0' }}>
              {t('videos.no_videos', 'لا توجد فيديوهات مطابقة لبحثك أو مضافة حالياً.')}
            </div>
          ) : (
            <>
              {/* 🔴 كارت الفيديو السينمائي المميز (Cinema Spotlight Video) */}
              {spotlightVideo && !searchQuery && (
                <div className="spotlight-video-banner animate-scale-in" onMouseEnter={playHoverSound}>
                  <div
                    className="spotlight-thumb-side"
                    role="button"
                    tabIndex={0}
                    aria-label={`تشغيل فيديو ${spotlightVideo.title}`}
                    onClick={() => { playClickSound(); setActiveVideoId(spotlightVideo.youtubeId); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        playClickSound();
                        setActiveVideoId(spotlightVideo.youtubeId);
                      }
                    }}
                  >
                    <img
                      src={getYouTubeThumbnail(spotlightVideo.youtubeId)}
                      alt={spotlightVideo.title}
                      width="800"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.target.src = 'https://placehold.co/800x450/black/purple?text=Spotlight+Video'; }}
                    />
                    <div className="video-overlay-play" style={{ opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)', width: '70px', height: '70px' }}>
                      <Play size={32} fill="currentColor" style={{ marginRight: '-2px' }} />
                    </div>
                  </div>
                  <div className="spotlight-content-side">
                    <div className="spotlight-tag">
                      <Sparkles size={12} className="animate-spin" />
                      {t('videos.spotlight_tag', 'فيديو الأسبوع المميز')}
                    </div>
                    <h3 className="spotlight-title">{spotlightVideo.title}</h3>
                    <p className="spotlight-desc">{spotlightVideo.description || t('videos.spotlight_default_desc', 'شاهد أقوى بث وأمتع مغامرة جيمينج على الإطلاق على القناة!')}</p>
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setActiveVideoId(spotlightVideo.youtubeId); }}
                      className="btn-cyber-solid"
                      style={{ padding: '10px 24px', fontSize: '13px', marginTop: '8px' }}
                    >
                      {t('videos.play_now_btn', 'شغل العرض الآن 🎮')}
                    </button>
                  </div>
                </div>
              )}

              {/* شبكة باقي الفيديوهات */}
              <div className="videos-grid">
                {gridVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="cyber-card purple-glow video-card-hover"
                    role="button"
                    tabIndex={0}
                    aria-label={`تشغيل فيديو ${vid.title}`}
                    onClick={() => { playClickSound(); setActiveVideoId(vid.youtubeId); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        playClickSound();
                        setActiveVideoId(vid.youtubeId);
                      }
                    }}
                    onMouseEnter={playHoverSound}
                  >
                    <div className="video-thumb-container">
                      <img
                        src={getYouTubeThumbnail(vid.youtubeId)}
                        alt={vid.title}
                        width="480"
                        height="270"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/black/purple?text=OmarXGaming'; }}
                      />
                      <div className="video-overlay-play">
                        <Play size={26} fill="currentColor" style={{ marginRight: '-2px' }} />
                      </div>
                    </div>
                    <div className="video-card-content">
                      <h3 className="video-card-title">{vid.title}</h3>
                      <p className="video-card-desc">{vid.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>

      {/* 5. أدوات الجيمينج (My Gear - Fully Dynamic!) */}
      {gear && gear.length > 0 && (
        <section id="gear" className="section-padding" style={{ background: 'rgba(12, 6, 29, 0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">

            <div className="text-center mb-16">
              <h2 className="gradient-text-primary" style={{ fontSize: '36px', fontWeight: '900' }}>{t('gear.section_title', 'مواصفات عتادي 🚀')}</h2>
              <div className="neon-divider"></div>
              <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {t('gear.section_desc', 'المعدات والأجهزة التي أستخدمها في اللعب، البث المباشر، وتعديل الفيديوهات بأقصى كفاءة.')}
              </p>
            </div>

            <div className="gear-grid">
              {gear.map((g, idx) => (
                <div key={g.id || idx} className={`cyber-card ${idx % 2 === 0 ? 'cyan-glow' : 'purple-glow'}`} style={{ padding: '24px' }} onMouseEnter={playHoverSound}>
                  <div className={`gear-card-icon ${idx % 2 === 0 ? 'cyan-theme' : 'purple-theme'} mb-6`}>
                    {g.icon === 'cpu' && <Cpu size={24} />}
                    {g.icon === 'monitor' && <Monitor size={24} />}
                    {g.icon === 'mic' && <Mic size={24} />}
                    {g.icon === 'gamepad' && <Gamepad2 size={24} />}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{g.title}</h3>
                  <ul className="gear-list">
                    {g.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 🔴 6. قسم الأسئلة الشائعة (FAQ Accordion) */}
      {faqs && faqs.length > 0 && (
        <section id="faqs" className="section-padding">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="gradient-text-accent" style={{ fontSize: '36px', fontWeight: '900' }}>{t('faqs.section_title', 'الأسئلة الشائعة ❓')}</h2>
              <div className="neon-divider"></div>
              <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                {t('faqs.section_desc', 'أجوبة سريعة على أهم استفساراتكم بخصوص مواعيد اللعب والبث والمواصفات.')}
              </p>
            </div>

            <div className="faq-wrapper">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`faq-item ${activeFaqId === faq.id ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveFaqId(activeFaqId === faq.id ? null : faq.id);
                    }}
                    className="faq-question"
                    onMouseEnter={playHoverSound}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle-icon">+</span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 7. تواصل معي والشركات (Contact Form) */}
      <section id="contact" className="section-padding" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container">

          <div className="text-center mb-16">
            <h2 className="gradient-text-cyan" style={{ fontSize: '36px', fontWeight: '900' }}>{t('contact.section_title', 'رعاية وإعلان؟ تواصل معي! ✉️')}</h2>
            <div className="neon-divider"></div>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {t('contact.section_desc', 'إذا كنت شركة، معلن، أو تود فتح باب شراكة وعمل، يرجى ملء النموذج وسأتواصل معك في أقرب وقت.')}
            </p>
          </div>

          <div className="contact-card-wrapper">
            <div className="cyber-card purple-glow" style={{ padding: '32px' }} onMouseEnter={playHoverSound}>
              {formStatus.success ? (
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <div className="w-16 h-16 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(0,255,102,0.2)]" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,102,0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', margin: '0 auto 24px auto' }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>{t('contact.success_title', 'تم الإرسال بنجاح!')}</h3>
                  <p className="text-muted" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {t('contact.success_desc', 'شكراً لتواصلك يا بطل. تم حفظ رسالتك في صندوق بريد عمر وسيتم الرد عليك قريباً عبر بريدك الإلكتروني!')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">{t('contact.label_name', 'الاسم الكامل *')}</label>
                      <input
                        type="text"
                        required
                        placeholder={t('contact.placeholder_name', 'أدخل اسمك هنا')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="cyber-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('contact.label_email', 'البريد الإلكتروني *')}</label>
                      <input
                        type="email"
                        required
                        placeholder={t('contact.placeholder_email', 'business@example.com')}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="cyber-input text-left"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('contact.label_company', 'اسم الشركة أو المنصة (اختياري)')}</label>
                    <input
                      type="text"
                      placeholder={t('contact.placeholder_company', 'مثال: شركة سوني للألعاب')}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="cyber-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('contact.label_message', 'تفاصيل العرض / الرسالة *')}</label>
                    <textarea
                      rows="6"
                      required
                      placeholder={t('contact.placeholder_message', 'اكتب هنا تفاصيل مشروعك أو فكرة الرعاية التي ترغب بطرحها...')}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="cyber-input"
                      style={{ resize: 'none', height: '150px' }}
                    ></textarea>
                  </div>

                  {formStatus.error && (
                    <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', fontSize: '14px', fontWeight: '700' }}>
                      {formStatus.error}
                    </div>
                  )}

                  <div className="text-center" style={{ paddingTop: '8px' }}>
                    <button
                      type="submit"
                      disabled={formStatus.loading}
                      className="btn-cyber-solid"
                      style={{ width: '100%', maxWidth: '240px', padding: '16px 32px' }}
                    >
                      {formStatus.loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }}></span>
                          جاري الإرسال...
                        </span>
                      ) : (
                        <>
                          <Send size={18} />
                          إرسال رسالتك الآن
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 8. الفوتر وروابط التواصل (Footer & Socials - Fully dynamic URLs!) */}
      <footer style={{ background: '#04010a', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '64px', paddingBottom: '32px' }} onMouseEnter={playHoverSound}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <div className="social-links-container">
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                onClick={playClickSound}
                className="social-link-circle yt-hover"
              >
                <Youtube size={22} />
              </a>
            )}
            {socials.discord && (
              <a
                href={socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                onClick={playClickSound}
                className="social-link-circle discord-hover"
              >
                <Disc size={22} />
              </a>
            )}
            {socials.tiktok && (
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                onClick={playClickSound}
                className="social-link-circle tiktok-hover"
              >
                <MessageSquare size={22} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                onClick={playClickSound}
                className="social-link-circle x-hover"
              >
                <Twitter size={22} />
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onClick={playClickSound}
                className="social-link-circle insta-hover"
              >
                <Instagram size={22} />
              </a>
            )}
          </div>

          <div className="footer-bottom-grid">
            <p className="text-muted" style={{ fontSize: '14px' }}>
              جميع الحقوق محفوظة © {new Date().getFullYear()} - <span className="text-cyan-400 digital-font">OmarXGaming</span>
            </p>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', alignItems: 'center' }}>
              <Link to="/privacy" onClick={playClickSound} className="nav-link-item" style={{ textDecoration: 'none' }}>
                سياسة الخصوصية
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
              <Link to="/terms" onClick={playClickSound} className="nav-link-item" style={{ textDecoration: 'none' }}>
                شروط الخدمة
              </Link>
            </div>

            <Link
              to="/admin"
              onClick={playClickSound}
              className="btn-neon-purple"
              style={{ padding: '8px 18px', fontSize: '12px', gap: '6px', borderRadius: '4px' }}
            >
              <Settings size={14} />
              لوحة تحكم الإدارة ⚙️
            </Link>
          </div>

        </div>
      </footer>

      {/* 🎬 9. صندوق عرض الفيديوهات المنبثق السينمائي (Cinema Lightbox Modal) */}
      {activeVideoId && (
        <div style={{ position: 'fixed', inset: '0', zIndex: '100', background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 3vw, 16px)', backdropFilter: 'blur(4px)' }}>
          <button
            type="button"
            aria-label="إغلاق الفيديو"
            onClick={() => { playClickSound(); setActiveVideoId(null); setEmbedInline(false); }}
            style={{ position: 'absolute', top: 'clamp(12px, 3vw, 24px)', right: 'clamp(12px, 3vw, 24px)', border: 'none', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', zIndex: '101' }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
          >
            <X size={24} />
          </button>

          <div className="animate-scale-in" style={{ position: 'relative', width: '100%', maxWidth: '850px', aspectRatio: '16/9', borderRadius: 'clamp(8px, 2vw, 16px)', overflow: 'hidden', border: '2px solid var(--color-accent)', boxShadow: '0 0 40px rgba(0,240,255,0.3)', background: '#000' }}>
            {embedInline ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
              ></iframe>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                <img
                  src={getYouTubeThumbnail(activeVideoId, 'maxresdefault')}
                  alt="Video preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = getYouTubeThumbnail(activeVideoId); }}
                />
                <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber-solid"
                    onClick={() => { playClickSound(); setEmbedInline(false); }}
                    style={{ padding: '10px 18px' }}
                  >
                    {t('videos.open_on_youtube', 'فتح على يوتيوب')}
                  </a>
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setEmbedInline(true); }}
                    className="btn-neon-cyan"
                    style={{ padding: '10px 18px' }}
                  >
                    {t('videos.play_inline', 'تشغيل داخل الصفحة')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'absolute', inset: '0', zIndex: '-10' }} onClick={() => { playClickSound(); setActiveVideoId(null); }}></div>
        </div>
      )}

    </div>
  );
}

export default Home;
