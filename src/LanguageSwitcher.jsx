import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button onClick={toggleLanguage} className="gaming-lang-btn">
      <span className="lang-icon">🌐</span>
      <span className="lang-text">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}

export default LanguageSwitcher;