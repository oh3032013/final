import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import SEOHead from '../components/SEOHead';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '60px 16px', overflow: 'hidden' }}>
      <SEOHead 
        title="شروط الخدمة | OmarXGaming"
        description="اطلع على شروط استخدام موقع OmarXGaming. قواعد الاستخدام المقبول وحقوق الملكية الفكرية والروابط الخارجية والإعلانات."
        canonical="/terms"
      />
      {/* الخلفية المضيئة للسايبربانك */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>
      
      {/* زر الرجوع للرئيسية */}
      <Link 
        to="/" 
        className="btn-neon-cyan"
        style={{ position: 'absolute', top: '24px', right: '24px', padding: '8px 16px', fontSize: '13px', borderRadius: '4px', gap: '6px', direction: 'rtl' }}
      >
        الرجوع للموقع
        <ArrowLeft size={16} />
      </Link>

      <div className="container" style={{ maxWidth: '800px', marginTop: '40px', direction: 'rtl', textAlign: 'right' }}>
        
        {/* الهيدر */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--color-primary)', overflow: 'hidden', boxShadow: '0 0 20px rgba(189,0,255,0.4)' }}>
            <img src={logoImg} alt="OmarXGaming Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="digital-font gradient-text-cyber" style={{ fontSize: '32px', fontWeight: '900' }}>
            شروط الخدمة | Terms of Service
          </h1>
          <div className="badge-tag" style={{ background: 'rgba(189,0,255,0.1)', border: '1px solid rgba(189,0,255,0.3)', color: 'var(--color-primary)', fontSize: '12px' }}>
            <BookOpen size={14} />
            شروط وقواعد استخدام المنصة
          </div>
        </div>

        {/* محتوى شروط الاستخدام داخل كارت سايبربانك */}
        <div className="cyber-card cyan-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.8' }}>
          
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} />
              1. قبول الشروط والقواعد
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              من خلال استخدام أو تصفح موقع <strong>OmarXGaming</strong>، فإنك توافق على الالتزام بشروط الخدمة هذه وبجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيرجى التوقف عن استخدام هذا الموقع.
            </p>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>
              2. حقوق الملكية الفكرية
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              جميع المواد المعروضة على هذا الموقع بما في ذلك التصاميم، النصوص، البرمجيات، الفيديوهات، الشعارات، والمؤثرات الصوتية هي ملك حصري لقناة <strong>OmarXGaming</strong> أو الجهات المرخصة لها، وهي محمية بقوانين حقوق النشر وحماية الملكية الفكرية الدولية. لا يجوز إعادة إنتاج أو نسخ أي جزء دون إذن كتابي مسبق.
            </p>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} />
              3. شروط الاستخدام المقبولة
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              يتعهد المستخدم باستخدام الموقع للأغراض المشروعة والترفيهية فقط، ويمتنع عن:
            </p>
            <ul style={{ paddingRight: '20px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>محاولة اختراق الموقع أو التلاعب بالبرمجيات الخاصة بلوحة التحكم أو قواعد البيانات.</li>
              <li>استخدام أي وسيلة آلية (مثل البوتات أو السكربتات) لجمع البيانات أو الفيديوهات بشكل غير مصرح به.</li>
              <li>إرسال رسائل غير مرغوب فيها (Spam) أو محتوى خبيث عبر نموذج التواصل.</li>
            </ul>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>
              4. الروابط الخارجية والإعلانات
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              قد يحتوي موقعنا على روابط لمواقع خارجية (مثل روابط الفيديوهات على YouTube أو منصات الرعاية الرسمية). نحن لسنا مسؤولين عن محتوى هذه المواقع أو سياسات الخصوصية الخاصة بها. يتم تفعيل الإعلانات المعروضة عبر Google AdSense وفقاً لقواعد الإعلانات الخاصة بجوجل.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>
              5. إخلاء المسؤولية القانونية
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              يتم تقديم الخدمات والمحتوى في موقع <strong>OmarXGaming</strong> "كما هي" دون أي ضمانات من أي نوع، صريحة أو ضمنية. نحن لا نضمن عدم انقطاع الخدمة أو خلوها من الأخطاء التقنية، ولكننا نسعى دائماً لتقديم أفضل تجربة تصفح آمنة وممتعة.
            </p>
          </div>

        </div>

        {/* الفوتر الصغير للصفحة */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
          آخر تحديث: يونيو {new Date().getFullYear()} | جميع الحقوق محفوظة لـ OmarXGaming
        </div>

      </div>
    </div>
  );
}

export default TermsOfService;
