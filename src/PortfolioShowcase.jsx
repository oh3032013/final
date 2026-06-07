import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const PortfolioShowcase = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackProjects = useMemo(() => [
    {
      id: 'skyrush',
      title: 'SkyRush',
      tag: t('portfolio.tags.game'),
      desc: t('portfolio.projects.skyrush_desc'),
      tech: ['Three.js', 'React', 'Game Design']
    },
    {
      id: 'casio-os',
      title: 'Casio OS',
      tag: t('portfolio.tags.system'),
      desc: t('portfolio.projects.casio_desc'),
      tech: ['React', 'UI Systems', 'JavaScript']
    }
  ], [t]);

  // جلب المشاريع
  const fetchProjects = async (signal) => {
    setLoading(true);

    if (!API_BASE_URL) {
      setProjects(fallbackProjects);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/portfolio`, { signal });
      if (!response.ok) {
        throw new Error(`Portfolio request failed: ${response.status}`);
      }
      const data = await response.json();
      
      // معالجة البيانات حسب الصيغة المستلمة
      if (Array.isArray(data)) {
        setProjects(data.length > 0 ? data : fallbackProjects);
      } else if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects.length > 0 ? data.projects : fallbackProjects);
      } else if (data.success !== false && data.projects) {
        setProjects(data.projects);
      } else {
        setProjects(fallbackProjects);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('خطأ في جلب المشاريع:', error);
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  };

  // استدعاء fetchProjects عند تحميل المكون
  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);

    return () => controller.abort();
  }, [fallbackProjects]);

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
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">

        {/* عنوان السكشن */}
        <div className="portfolio-header">
          <h2 className="portfolio-title">
            {t('portfolio.section_title') || 'معرض أعمالي ومشاريعي'}
          </h2>
          <p className="portfolio-desc">
            {t('portfolio.section_desc') || 'أبرز الألعاب والأنظمة الذكية التي قمت بتطويرها وبرمجتها بأحدث التقنيات.'}
          </p>
        </div>

        {/* شبكة المشاريع الديناميكية */}
        <div className="portfolio-grid">
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center' }}>جاري تحميل المشاريع...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center' }}>لا توجد مشاريع معروضة حالياً، يمكنك إضافتها من لوحة التحكم.</p>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="portfolio-card">
                <div>
                  {/* رأس الكارت: التصنيف والعنوان */}
                  <div className="portfolio-card-top">
                    <span className="portfolio-tag">
                      {project.tag}
                    </span>
                    <h3 className="portfolio-card-title">
                      {project.title}
                    </h3>
                  </div>

                  {/* وصف المشروع */}
                  <p className="portfolio-card-desc">
                    {project.desc}
                  </p>

                  {/* التقنيات المستعملة */}
                  <div className="portfolio-tech-list">
                    {parseTech(project.tech).map((tech, i) => (
                      <span key={i} className="portfolio-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* زر استكشف المشروع */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-btn"
                  >
                    <span className="portfolio-btn-text">
                      {t('portfolio.view_project') || 'استكشف المشروع'} 🎮
                    </span>
                  </a>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default PortfolioShowcase;
