import React, { useEffect } from 'react'; // تـم تصـحيح الاسـتدعاء هنا
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useTranslation } from 'react-i18next';

// مكون لحماية مسار لوحة التحكم (Route Guard)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('omar_admin_token');

  if (!token) {
    // إذا لم يكن هناك توكن، قم بالتوجيه لصفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // الكود ده بيغير اتجاه الـ body بالكامل بناءً على اللغة
    const currentLang = i18n.language || 'en';
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  // تـم حذف الـ return الفاضية الزيادة وترك الـ return الصحيحة فقط
  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية العامة للجمهور */}
        <Route path="/" element={<Home />} />

        {/* صفحة تسجيل الدخول للأدمن */}
        <Route path="/login" element={<Login />} />

        {/* لوحة تحكم الأدمن المحمية */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* التوجيه التلقائي للمسارات غير المعروفة */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;