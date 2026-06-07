import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="gaming-lang-btn"
      aria-label={i18n.language === 'ar' ? 'Switch language to English' : 'تغيير اللغة إلى العربية'}
    >
      <span className="lang-icon" aria-hidden="true">🌐</span>
      <span className="lang-text">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}

export default LanguageSwitcher;
