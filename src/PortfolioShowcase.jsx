import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const PortfolioShowcase = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المشاريع
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/public/portfolio');
      const data = await response.json();
      console.log('البيانات المستلمة:', data);
      
      // معالجة البيانات حسب الصيغة المستلمة
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else if (data.success !== false && data.projects) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('خطأ في جلب المشاريع:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء fetchProjects عند تحميل المكون
  useEffect(() => {
    fetchProjects();
  }, []);

  // دالة لتحويل التقنيات إلى مصفوفة
  const parseTech = (tech) => {
    if (!tech) return [];
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') {
      return tech.split(',').map(t => t.trim());
    }
    return [];
  };

  return (
    <section id="portfolio" style={{ backgroundColor: 'var(--bg-primary, #06020f)', padding: '80px 24px', borderTop: '1px solid var(--bg-tertiary, #160c2e)' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

        {/* عنوان السكشن */}
        <div style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{
            color: 'var(--color-accent, #00f0ff)',
            fontSize: '2.5rem',
            fontWeight: '900',
            marginBottom: '15px',
            textShadow: 'var(--glow-accent, 0 0 12px var(--color-accent))',
            transition: 'all 0.3s ease'
          }}>
            {t('portfolio.section_title') || 'معرض أعمالي ومشاريعي'}
          </h2>
          <p style={{ color: 'var(--text-secondary, #9ea4cd)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', textAlign: 'center' }}>
            {t('portfolio.section_desc') || 'أبرز الألعاب والأنظمة الذكية التي قمت بتطويرها وبرمجتها بأحدث التقنيات.'}
          </p>
        </div>

        {/* شبكة المشاريع الديناميكية */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', width: '100%', marginTop: '40px' }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>جاري تحميل المشاريع...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>لا توجد مشاريع معروضة حالياً، يمكنك إضافتها من لوحة التحكم.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: 'var(--bg-secondary, #0c061d)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  padding: '30px',
                  flex: '1 1 450px',
                  maxWidth: '540px',
                  minHeight: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  textAlign: 'right',
                  direction: 'rtl',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.boxShadow = 'var(--glow-accent-hover, 0 0 20px var(--color-accent))';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* رأس الكارت: التصنيف والعنوان */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%', flexDirection: 'row-reverse' }}>
                    <span style={{
                      border: '1px solid var(--color-accent)',
                      color: 'var(--color-accent)',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}>
                      {project.tag}
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff', margin: 0, fontFamily: "var(--font-digital, 'Orbitron', sans-serif)" }}>
                      {project.title}
                    </h3>
                  </div>

                  {/* وصف المشروع */}
                  <p style={{ color: 'var(--text-secondary, #9ea4cd)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '25px', textAlign: 'right' }}>
                    {project.desc}
                  </p>

                  {/* التقنيات المستعملة */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px', justifyContent: 'flex-start', direction: 'ltr' }}>
                    {parseTech(project.tech).map((tech, i) => (
                      <span key={i} style={{ backgroundColor: 'var(--bg-tertiary, #160c2e)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '5px 11px', borderRadius: '4px', fontWeight: '600' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* زر استكشف المشروع */}
                <a
                  href={project.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-accent)',
                    boxShadow: 'var(--glow-accent)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    marginTop: 'auto'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <span style={{ color: '#000000', fontWeight: '900', fontSize: '0.95rem', display: 'block', textAlign: 'center' }}>
                    {t('portfolio.view_project') || 'استكشف المشروع'} 🎮
                  </span>
                </a>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default PortfolioShowcase;
