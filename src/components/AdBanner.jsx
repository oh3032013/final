import { useEffect, useRef } from 'react';

const AdBanner = ({ type, style = {} }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let scriptElements = [];

    if (type === 'banner728x90') {
      const optionsScript = document.createElement('script');
      optionsScript.innerHTML = `
        window.atOptions = {
          'key': 'e7c57c310497834d8a981acebb67cc51',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
      container.appendChild(optionsScript);
      scriptElements.push(optionsScript);

      const invokeScript = document.createElement('script');
      invokeScript.src = 'https://www.highperformanceformat.com/e7c57c310497834d8a981acebb67cc51/invoke.js';
      container.appendChild(invokeScript);
      scriptElements.push(invokeScript);
    } else if (type === 'smartlink') {
      const link = document.createElement('a');
      link.href = 'https://www.effectivecpmnetwork.com/pu43t9azz?key=6a01ffef8a63cd17d56f9fc93e1c02dc';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Click Here';
      link.style.cssText = 'display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#ff0055,#7000ff);color:#fff;font-weight:700;border-radius:8px;text-decoration:none;font-size:16px;';
      container.appendChild(link);
    }

    return () => {
      scriptElements.forEach(s => {
        if (s.parentNode) s.parentNode.removeChild(s);
      });
    };
  }, [type]);

  return (
    <div
      ref={containerRef}
      className="ad-banner-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        background: 'rgba(12, 6, 29, 0.3)',
        overflow: 'hidden',
        ...style
      }}
    />
  );
};

export default AdBanner;
