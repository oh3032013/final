import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * مكون SEO قابل لإعادة الاستخدام لكل صفحة
 * يدعم العنوان والوصف و Open Graph و Twitter Cards
 */
const SEOHead = ({ 
  title = 'OmarXGaming | عالم الألعاب والإثارة اللامتناهية 🎮',
  description = 'محفظة أعمال صانع المحتوى واليوتيوبر الأسطوري OmarXGaming. استكشف أحدث الفيديوهات، الإحصائيات، وأدوات الجيمينج الاحترافية.',
  canonical = '/',
  ogType = 'website',
  ogImage = '/omarxgaming-logo-512.jpg',
  lang = 'ar',
  keywords = [],
  schema = []
}) => {
  const siteUrl = 'https://omarxgaming.com';
  const fullUrl = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const fullImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  const alternateLang = lang === 'ar' ? 'en' : 'ar';

  return (
    <Helmet>
      {/* Basic Meta */}
      <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" hrefLang={lang} href={fullUrl} />
      <link rel="alternate" hrefLang={alternateLang} href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content="OmarXGaming logo" />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_AR' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      {schema.map((schemaItem, index) => (
        <script type="application/ld+json" key={`schema-${index}`}>
          {JSON.stringify(schemaItem)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
