import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locale/en.json' with { type: 'json' };
import translationAR from './locale/ar.json' with { type: 'json' };

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR }
};

i18n
  .use(LanguageDetector) // بيكتشف لغة المتصفح
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // 👈 ضيف السطر ده عشان يجبر الموقع يفتح عربي كملف أساسي
    fallbackLng: 'ar', // 👈 غير دي كمان لـ ar عشان لو حصلت مشكلة يرجع للعربي
    interpolation: { escapeValue: false }
  });

export default i18n;