import React, { useEffect, useRef, useState } from 'react';
import { Megaphone, AlertCircle } from 'lucide-react';

/**
 * AdSenseAd component
 * @param {string} client - Google AdSense Publisher ID (e.g. ca-pub-XXXXXXXXXXXXXXXX)
 * @param {string} slot - Ad Slot ID (e.g. 1234567890)
 * @param {string} format - Ad format, defaults to 'auto'
 * @param {boolean} fullWidthResponsive - Defaults to true
 */
const AdSenseAd = ({ 
  client = 'ca-pub-XXXXXXXXXXXXXXXX', 
  slot = '1234567890', 
  format = 'auto', 
  fullWidthResponsive = 'true' 
}) => {
  const [adError, setAdError] = useState(false);
  const [shouldLoadAd, setShouldLoadAd] = useState(false);
  const adRef = useRef(null);
  
  // Check if we are using the placeholder Publisher ID or Slot ID
  const isPlaceholder = client === 'ca-pub-XXXXXXXXXXXXXXXX' || slot === '1234567890';

  useEffect(() => {
    if (isPlaceholder) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadAd(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadAd(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaceholder]);

  useEffect(() => {
    // Only attempt to load the ad if it is NOT a placeholder
    if (!isPlaceholder && shouldLoadAd) {
      // Check after 2.5 seconds if the adsbygoogle script has loaded.
      // If not, it means an AdBlocker has blocked the script from downloading.
      const timer = setTimeout(() => {
        if (!window.adsbygoogle || window.adsbygoogle.length === 0) {
          setAdError(true);
        }
      }, 2500);

      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.warn('AdSense block execution error (normal on localhost/AdBlock):', err);
        setAdError(true);
      }

      return () => clearTimeout(timer);
    }
  }, [client, slot, isPlaceholder, shouldLoadAd]);

  // If it's a placeholder, display a beautiful themed gaming placeholder banner
  if (isPlaceholder) {
    return (
      <div className="adsense-placeholder-container container animate-scale-in">
        <div className="adsense-placeholder-card">
          <div className="adsense-glow-line"></div>
          
          <div className="adsense-icon-wrapper">
            <Megaphone size={28} className="adsense-pulse-icon" />
          </div>

          <div className="adsense-info">
            <h4 className="adsense-title">
              <span>مساحة إعلانية نشطة | Google AdSense Slot</span>
            </h4>
            <p className="adsense-subtitle">
              هذه المساحة مجهزة وجاهزة لعرض إعلانات جوجل أدسينس. لتفعيل الإعلان الحقيقي، يرجى استبدال معرف الناشر <code>client</code> ومعرف الإعلان <code>slot</code> في الكود المصدري.
            </p>
            <div className="adsense-code-hint">
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>
                الملف: <code>src/pages/Home.jsx</code> | 
                المعرف الحالي: <code>{client}</code>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the ad failed to load (blocked by AdBlock or failed on localhost)
  if (adError) {
    return (
      <div className="adsense-placeholder-container container animate-scale-in">
        <div className="adsense-placeholder-card" style={{ borderColor: 'rgba(255, 59, 48, 0.25)', boxShadow: 'inset 0 0 15px rgba(255, 59, 48, 0.05)' }}>
          <div className="adsense-glow-line" style={{ background: 'linear-gradient(90deg, transparent, var(--color-red), transparent)' }}></div>
          
          <div className="adsense-icon-wrapper" style={{ borderColor: 'rgba(255, 59, 48, 0.2)', color: 'var(--color-red)', background: 'rgba(255, 59, 48, 0.05)' }}>
            <AlertCircle size={28} className="adsense-pulse-icon" />
          </div>

          <div className="adsense-info">
            <h4 className="adsense-title">
              <span style={{ background: 'linear-gradient(90deg, var(--color-red), var(--color-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                مساحة إعلانية | Advertisement Space
              </span>
            </h4>
            <p className="adsense-subtitle" style={{ color: 'var(--text-secondary)' }}>
              تم حجب الإعلان بواسطة مانع الإعلانات (AdBlock) أو بسبب التشغيل محلياً (Localhost). نرجو تعطيل مانع الإعلانات لدعم صانع محتوى الألعاب! 🎮
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Real AdSense element
  return (
    <div className="adsense-real-container container" style={{ margin: '30px auto', overflow: 'hidden' }}>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', margin: '0 auto', textAlign: 'center' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  );
};

export default AdSenseAd;
