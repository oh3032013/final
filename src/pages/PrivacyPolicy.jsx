import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import SEOHead from '../components/SEOHead';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '60px 16px', overflow: 'hidden' }}>
      <SEOHead 
        title="سياسة الخصوصية | OmarXGaming"
        description="اطلع على سياسة الخصوصية الخاصة بموقع OmarXGaming. نحترم خصوصيتك ونلتزم بسياسات Google AdSense ومعايير حماية البيانات."
        canonical="/privacy"
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
          <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--color-accent)', overflow: 'hidden', boxShadow: 'var(--glow-accent)' }}>
            <img src={logoImg} alt="OmarXGaming Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="digital-font gradient-text-cyber" style={{ fontSize: '32px', fontWeight: '900' }}>
            سياسة الخصوصية | Privacy Policy
          </h1>
          <div className="badge-tag" style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)', color: 'var(--color-accent)', fontSize: '12px' }}>
            <Shield size={14} />
            متوافقة مع شروط Google AdSense
          </div>
        </div>

        {/* محتوى سياسة الخصوصية داخل كارت سايبربانك */}
        <div className="cyber-card purple-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.8' }}>
          
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} />
              1. مقدمة وتمهيد
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              نحن في <strong>OmarXGaming</strong> نولي خصوصية زوارنا أهمية بالغة. توضح هذه الوثيقة أنواع المعلومات الشخصية التي يتم جمعها وحفظها وكيف نستخدمها لتقديم خدمة أفضل.
            </p>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} />
              2. إعلانات Google AdSense وملفات تعريف الارتباط (Cookies)
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              يستخدم هذا الموقع برنامج <strong>Google AdSense</strong> لعرض الإعلانات المخصصة. تلتزم سياسة خصوصيتنا بالبنود القانونية التالية الخاصة بجوجل:
            </p>
            <ul style={{ paddingRight: '20px', marginTop: '8px', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>تستخدم Google جهات خارجية لعرض الإعلانات على موقعنا.</li>
              <li>يؤدي استخدام Google لملفات تعريف الارتباط الخاصة بالإعلانات (مثل ملفات تعريف الارتباط DART) إلى تمكينها هي وشركائها من عرض الإعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا أو مواقع أخرى على الإنترنت.</li>
              <li>يمكن للمستخدمين اختيار إلغاء استخدام ملفات تعريف الارتباط للإعلانات المخصصة عن طريق زيارة <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>إعدادات الإعلانات من Google</a>.</li>
            </ul>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} />
              3. ملفات السجل (Log Files)
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              شأنها شأن معظم المواقع الأخرى، يستخدم موقعنا ملفات السجل. تشمل المعلومات الموجودة داخل ملفات السجل: عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، تواريخ وأوقات الزيارة، والصفحات التي تمت زيارتها لتحليل الاتجاهات وإدارة الموقع.
            </p>
          </div>

          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>
              4. نموذج التواصل وحماية البيانات
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              عند ملء نموذج "تواصل معي" على موقعنا، فإن البيانات التي تقدمها (الاسم، البريد الإلكتروني، اسم الشركة، الرسالة) يتم حفظها بأمان تام لمراجعتها والرد عليك، ولن يتم بيعها أو مشاركتها مع أي جهة خارجية دون إذنك المسبق.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-accent)' }}>
              5. الموافقة والتحديثات
            </h2>
            <p className="text-muted" style={{ fontSize: '14.5px', marginTop: '8px' }}>
              باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية الخاصة بنا وتوافق على شروطها. قد نقوم بتحديث هذه السياسة من وقت لآخر للتكيف مع السياسات القانونية وإرشادات Google AdSense.
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

export default PrivacyPolicy;
