import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();

      if (data.success) {
        // تخزين التوكن التوثيقي
        localStorage.setItem('omar_admin_token', data.token);
        
        // التوجيه للوحة التحكم
        navigate('/admin');
      } else {
        setError(data.message || 'كلمة المرور غير صحيحة!');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم. يرجى التأكد من تشغيل السيرفر!');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
      {/* الخلفية والأضواء */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>
      
      {/* زر الرجوع للموقع الرئيسي */}
      <Link 
        to="/" 
        className="btn-neon-cyan"
        style={{ position: 'absolute', top: '24px', left: '24px', padding: '8px 16px', fontSize: '13px', borderRadius: '4px', gap: '6px' }}
      >
        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
        الرجوع للموقع
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* رأس صفحة تسجيل الدخول */}
        <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div className="float-animation" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--color-purple)', overflow: 'hidden', boxShadow: '0 0 20px rgba(189,0,255,0.4)' }}>
            <img src={logoImg} alt="OmarXGaming Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="digital-font gradient-text-cyber" style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px' }}>
            OMAR X GAMING
          </h1>
          <div className="badge-tag" style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)', color: 'var(--color-cyan)', fontSize: '12px' }}>
            <ShieldCheck size={14} />
            بوابة الإدارة الآمنة
          </div>
        </div>

        {/* كرت تسجيل الدخول السايبربانك */}
        <div className="cyber-card purple-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>تسجيل الدخول للنظام 🔐</h2>
            <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.5' }}>يرجى إدخال كلمة المرور السرية للولوج إلى لوحة تحكم الإدارة.</p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="form-group">
              <label className="form-label">كلمة المرور *</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input text-left"
                  style={{ paddingRight: '48px', fontFamily: 'monospace', letterSpacing: '4px' }}
                />
                <div style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <KeyRound size={18} />
                </div>
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div style={{ padding: '12px', borderRadius: '6px', background: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* زر الدخول */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-cyber-solid"
              style={{ width: '100%', padding: '14px 0', justifyContent: 'center' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }}></span>
                  جاري التحقق...
                </span>
              ) : (
                'تأكيد الدخول الآمن 🚀'
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}


export default Login;
