import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Eye, Video, LogOut, Save, Trash2, Plus,
  Mail, Calendar, Building, MessageSquare, AlertCircle, CheckCircle, RefreshCw,
  Cpu, Monitor, Mic, Gamepad2, Settings, HelpCircle, Link as LinkIcon, Download, Search,
  Youtube, Image as ImageIcon, Upload, FileVideo
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';
import axios from 'axios';

const PortfolioManager = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    desc: '',
    tech: '',
    link: ''
  });
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'youtube'

  // جلب المشاريع الحالية
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('omar_admin_token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('خطأ في جلب المشاريع:', err);
      try {
        const res2 = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/projects`);
        setProjects(res2.data);
      } catch (err2) {
        console.error('خطأ في جلب المشاريع من المسار العام:', err2);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // معالجة اختيار الملف (صورة أو فيديو)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // استخراج ID الفيديو من رابط يوتيوب
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // معالجة رابط يوتيوب
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    const videoId = getYoutubeId(url);
    if (videoId) {
      setMediaPreview(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
      setMediaPreview('');
    }
  };

  // إرسال مشروع جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem('omar_admin_token');

      // تجربة إرسال كـ JSON أولاً (بدون صورة)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          tag: formData.tag,
          desc: formData.desc,
          tech: formData.tech,
          link: formData.link,
          mediaType: 'image'
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('تم إضافة المشروع بنجاح! 🎉');
        setFormData({ title: '', tag: '', desc: '', tech: '', link: '' });
        fetchProjects();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'حدث خطأ أثناء الإضافة ❌');
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('حدث خطأ في الاتصال بالخادم ❌');
    } finally {
      setUploading(false);
    }
  };

  // حذف مشروع
  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المشروع نهائياً؟')) {
      try {
        const token = localStorage.getItem('omar_admin_token');
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/projects/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.data.success) {
          setMessage('تم حذف المشروع بنجاح! 🗑️');
          fetchProjects();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (err) {
        console.error('خطأ في الحذف:', err);
        setMessage('حدث خطأ أثناء الحذف ❌');
      }
    }
  };

  // عرض الوسائط (صورة أو فيديو)
  const renderMedia = (project) => {
    if (project.youtubeId) {
      return (
        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#000', position: 'relative' }}>
          <img
            src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.7)', fontSize: '8px', color: '#fff', textAlign: 'center' }}>
            ▶️ يوتيوب
          </div>
        </div>
      );
    } else if (project.mediaUrl && project.mediaType === 'video') {
      return (
        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#000', position: 'relative' }}>
          <video style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted>
            <source src={`${import.meta.env.VITE_API_URL}${project.mediaUrl}`} />
          </video>
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.7)', fontSize: '8px', color: '#fff', textAlign: 'center' }}>
            🎬 فيديو
          </div>
        </div>
      );
    } else if (project.image || project.mediaUrl) {
      return (
        <img
          src={`${import.meta.env.VITE_API_URL}${project.image || project.mediaUrl}`}
          alt={project.title}
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
        />
      );
    }
    return (
      <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  };

  return (
    <div className="cyber-card cyan-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Save size={20} style={{ color: 'var(--color-accent)' }} />
          إدارة معرض الأعمال والمشاريع
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          يمكنك إضافة صور أو فيديوهات (رفع ملف أو رابط يوتيوب)
        </p>
      </div>

      {message && (
        <div className="animate-scale-in" style={{ padding: '16px', borderRadius: '8px', background: message.includes('نجاح') ? 'rgba(0,255,102,0.1)' : 'rgba(255,59,48,0.1)', border: message.includes('نجاح') ? '1px solid var(--color-success)' : '1px solid var(--color-red)', color: message.includes('نجاح') ? 'var(--color-success)' : 'var(--color-red)', fontWeight: '700' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="admin-stats-inputs-grid">
          <div className="form-group">
            <label className="form-label">اسم المشروع *</label>
            <input type="text" className="cyber-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="مثال: SkyRush V2" required style={{ background: 'var(--bg-secondary)', width: '100%' }} />
          </div>

          <div className="form-group">
            <label className="form-label">تصنيف المشروع (Tag) *</label>
            <input type="text" className="cyber-input" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="مثال: تطوير ألعاب" required style={{ background: 'var(--bg-secondary)', width: '100%' }} />
          </div>
        </div>

        <div className="admin-stats-inputs-grid">
          <div className="form-group">
            <label className="form-label">التقنيات المستخدمة *</label>
            <input type="text" className="cyber-input" value={formData.tech} onChange={e => setFormData({ ...formData, tech: e.target.value })} placeholder="مثال: Python, React" required style={{ background: 'var(--bg-secondary)', width: '100%' }} />
          </div>

          <div className="form-group">
            <label className="form-label">رابط المشروع (GitHub/Website)</label>
            <input type="text" className="cyber-input" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." style={{ background: 'var(--bg-secondary)', width: '100%' }} />
          </div>
        </div>

        {/* اختيار نوع الوسائط */}
        <div className="form-group">
          <label className="form-label">نوع الوسائط</label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { setMediaType('image'); setMediaFile(null); setMediaPreview(''); setYoutubeUrl(''); }}
              style={{
                padding: '8px 16px',
                background: mediaType === 'image' ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
                color: mediaType === 'image' ? '#000' : '#fff',
                border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <ImageIcon size={16} /> صورة
            </button>
            <button
              type="button"
              onClick={() => { setMediaType('video'); setMediaFile(null); setMediaPreview(''); setYoutubeUrl(''); }}
              style={{
                padding: '8px 16px',
                background: mediaType === 'video' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                color: mediaType === 'video' ? '#000' : '#fff',
                border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <FileVideo size={16} /> فيديو (رفع ملف)
            </button>
            <button
              type="button"
              onClick={() => { setMediaType('youtube'); setMediaFile(null); setMediaPreview(''); }}
              style={{
                padding: '8px 16px',
                background: mediaType === 'youtube' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                color: mediaType === 'youtube' ? '#000' : '#fff',
                border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Youtube size={16} /> فيديو يوتيوب
            </button>
          </div>
        </div>

        {/* رفع ملف (صورة أو فيديو) */}
        {(mediaType === 'image' || mediaType === 'video') && (
          <div className="form-group">
            <label className="form-label">
              {mediaType === 'image' ? 'صورة المشروع' : 'فيديو المشروع'}
            </label>
            <input
              type="file"
              className="cyber-input"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleMediaChange}
              style={{ background: 'var(--bg-secondary)', width: '100%', padding: '8px' }}
            />
            {mediaPreview && (
              <div style={{ marginTop: '10px' }}>
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <video src={mediaPreview} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} controls muted />
                )}
              </div>
            )}
          </div>
        )}

        {/* رابط يوتيوب */}
        {mediaType === 'youtube' && (
          <div className="form-group">
            <label className="form-label">رابط فيديو يوتيوب</label>
            <input
              type="text"
              className="cyber-input"
              value={youtubeUrl}
              onChange={handleYoutubeUrlChange}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ background: 'var(--bg-secondary)', width: '100%', direction: 'ltr' }}
            />
            {mediaPreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={mediaPreview} alt="YouTube Preview" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>معاينة من يوتيوب</p>
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">وصف المشروع *</label>
          <textarea className="cyber-input" value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} placeholder="اكتب تفاصيل المشروع وميزاته..." required rows="3" style={{ background: 'var(--bg-secondary)', width: '100%', resize: 'none' }}></textarea>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'left' }}>
          <button type="submit" disabled={uploading} className="btn-cyber-solid">
            <Upload size={18} />
            {uploading ? 'جاري الرفع...' : 'حفظ وإضافة المشروع للمعرض'}
          </button>
        </div>
      </form>

      {/* قائمة المشاريع الحالية */}
      <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--color-accent)', fontWeight: '800' }}>
            📁 المشاريع المدرجة بالبورتفوليو حالياً ({projects.length})
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              لا توجد مشاريع مضافة حتى الآن. أضف أول مشروع لك! 🚀
            </div>
          ) : (
            projects.map((proj, index) => (
              <div key={proj.id || index} className="admin-video-edit-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
                  <div className="digital-font" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-accent)', width: '30px' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {renderMedia(proj)}

                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{proj.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '2px' }}>{proj.tag}</div>
                    {proj.youtubeId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${proj.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '10px', color: 'var(--color-accent)', textDecoration: 'none' }}
                      >
                        مشاهدة على يوتيوب ▶️
                      </a>
                    )}
                  </div>
                </div>

                <button onClick={() => handleDelete(proj.id)} className="btn-neon-red" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '4px', gap: '4px' }}>
                  <Trash2 size={12} /> حذف 🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();

  // التبويب النشط: 'stats' | 'videos' | 'gear' | 'faqs' | 'settings' | 'messages' | 'portfolio'
  const [activeTab, setActiveTab] = useState('stats');

  // البيانات الحالية
  const [stats, setStats] = useState({ subscribers: 0, views: 0, videos: 0 });
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);

  // الإعدادات الديناميكية والـ CMS
  const [settings, setSettings] = useState({
    channelHandle: "@omarxgaming123",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    themeColor: "cyberpunk",
    soundEnabled: true,
    customCursorEnabled: true
  });

  const [socials, setSocials] = useState({
    youtube: "",
    discord: "",
    tiktok: "",
    twitter: "",
    instagram: ""
  });

  const [faqs, setFaqs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [gear, setGear] = useState([]);

  // حالات التحكم
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // حالات الرسائل والبحث والتصدير
  const [activeMessage, setActiveMessage] = useState(null);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');

  // إضافة فيديو جديد يدوياً
  const [newVideoForm, setNewVideoForm] = useState({ youtubeId: '', title: '', description: '' });
  const [showAddVideo, setShowAddVideo] = useState(false);

  // الحصول على التوكن
  const getToken = () => localStorage.getItem('omar_admin_token');

  // جلب البيانات بالكامل دفعة واحدة
  const fetchAllData = async () => {
    setLoading(true);
    setErrorMessage(null);
    const token = getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. جلب الإحصائيات
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      } else if (statsRes.status === 403 || statsRes.status === 401) {
        handleLogout();
        return;
      }

      // 2. جلب الفيديوهات
      const videosRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/videos`, { headers });
      const videosData = await videosRes.json();
      if (videosData.success) {
        setVideos(videosData.videos);
      }

      // 3. جلب بقية الإعدادات
      const settingsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/all-settings`, { headers });
      const settingsData = await settingsRes.json();
      if (settingsData.success) {
        setSettings(settingsData.settings);
        setSocials(settingsData.socials);
        setFaqs(settingsData.faqs);
        setSchedule(settingsData.schedule);
        setGear(settingsData.gear);
      }

      // 4. جلب الرسائل
      const messagesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messages`, { headers });
      const messagesData = await messagesRes.json();
      if (messagesData.success) {
        setMessages(messagesData.messages);
      }
    } catch (err) {
      setErrorMessage('خطأ في جلب البيانات من الخادم. يرجى التحقق من اتصال السيرفر.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('omar_admin_token');
    navigate('/login');
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 1. حفظ الإحصائيات
  const handleStatsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(stats)
      });
      const data = await response.json();
      if (data.success) showSuccess(data.message);
      else setErrorMessage(data.message);
    } catch (err) {
      setErrorMessage('تعذر حفظ الإحصائيات.');
    } finally {
      setSaving(false);
    }
  };

  // 2. مزامنة أحدث فيديوهات مع يوتيوب تلقائياً
  const handleYoutubeSync = async () => {
    if (!window.confirm('هل تود مزامنة فيديوهات قناتك تلقائياً؟ سيؤدي هذا لتحديث القائمة الحالية بأحدث فيديوهات نشرتها.')) return;
    setSyncing(true);
    setErrorMessage(null);
    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/youtube/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
        showSuccess(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage('حدث خطأ أثناء محاولة الاتصال بالخادم لمزامنة الفيديوهات.');
    } finally {
      setSyncing(false);
    }
  };

  // 3. إضافة فيديو يدوياً (Dynamic CRUD)
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoForm.youtubeId || !newVideoForm.title) return;
    setSaving(true);
    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newVideoForm)
      });
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
        setNewVideoForm({ youtubeId: '', title: '', description: '' });
        setShowAddVideo(false);
        showSuccess(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage('تعذر إضافة الفيديو.');
    } finally {
      setSaving(false);
    }
  };

  // 4. حذف فيديو معين (Dynamic CRUD)
  const handleVideoDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الفيديو نهائياً؟')) return;
    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
        showSuccess(data.message);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage('تعذر حذف الفيديو.');
    }
  };

  // 5. تعديل عتاد الجيمينج ديناميكياً
  const handleGearFieldChange = (cardIdx, field, val) => {
    const updatedGear = [...gear];
    updatedGear[cardIdx] = { ...updatedGear[cardIdx], [field]: val };
    setGear(updatedGear);
  };

  const handleGearItemChange = (cardIdx, itemIdx, val) => {
    const updatedGear = [...gear];
    const updatedItems = [...updatedGear[cardIdx].items];
    updatedItems[itemIdx] = val;
    updatedGear[cardIdx] = { ...updatedGear[cardIdx], items: updatedItems };
    setGear(updatedGear);
  };

  const handleGearSave = async () => {
    setSaving(true);
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/gear`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ gear })
      });
      const data = await response.json();
      if (data.success) showSuccess(data.message);
      else setErrorMessage(data.message);
    } catch (err) {
      setErrorMessage('تعذر حفظ مواصفات العتاد.');
    } finally {
      setSaving(false);
    }
  };

  // 6. تعديل الجدول والأسئلة الشائعة
  const handleScheduleFieldChange = (idx, field, val) => {
    const updatedSch = [...schedule];
    updatedSch[idx] = { ...updatedSch[idx], [field]: val };
    setSchedule(updatedSch);
  };

  const handleFAQFieldChange = (idx, field, val) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[idx] = { ...updatedFaqs[idx], [field]: val };
    setFaqs(updatedFaqs);
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { id: Date.now(), question: 'سؤال جديد؟', answer: 'إجابة جديدة.' }]);
  };

  const handleRemoveFAQ = (idx) => {
    const updated = [...faqs];
    updated.splice(idx, 1);
    setFaqs(updated);
  };

  const handleScheduleAndFAQSave = async () => {
    setSaving(true);
    const token = getToken();
    try {
      // حفظ الجدول
      const resSch = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ schedule })
      });

      // حفظ الأسئلة
      const resFaq = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/faqs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ faqs })
      });

      const dataSch = await resSch.json();
      const dataFaq = await resFaq.json();

      if (dataSch.success && dataFaq.success) {
        showSuccess('تم حفظ جدول البث والأسئلة الشائعة بنجاح! 📅❓');
      } else {
        setErrorMessage('حدث خطأ أثناء محاولة حفظ البيانات.');
      }
    } catch (err) {
      setErrorMessage('تعذر حفظ التغييرات.');
    } finally {
      setSaving(false);
    }
  };

  // 7. حفظ إعدادات الواجهة وروابط التواصل
  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = getToken();
    try {
      // حفظ الإعدادات
      const resSet = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(settings)
      });

      // حفظ روابط التواصل
      const resSoc = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/socials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(socials)
      });

      const dataSet = await resSet.json();
      const dataSoc = await resSoc.json();

      if (dataSet.success && dataSoc.success) {
        showSuccess('تم تحديث الإعدادات العامة وروابط التواصل بنجاح! ⚙️🔗');
      } else {
        setErrorMessage('حدث خطأ أثناء محاولة حفظ الإعدادات.');
      }
    } catch (err) {
      setErrorMessage('تعذر حفظ الإعدادات.');
    } finally {
      setSaving(false);
    }
  };

  // 8. قراءة الرسالة ووضع شارة مقروءة
  const handleSelectMessage = async (msg) => {
    setActiveMessage(msg);
    if (msg.read) return;

    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messages/${msg.id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // 9. حذف رسالة
  const handleMessageDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) return;
    const token = getToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.filter(m => m.id !== id));
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage(null);
        }
        showSuccess('تم حذف الرسالة بنجاح! 🗑️');
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage('تعذر حذف الرسالة.');
    }
  };

  // 10. تصدير جميع الرسائل
  const handleExportMessages = () => {
    if (messages.length === 0) return;

    let content = `==================================================\n`;
    content += `📬 أرشيف رسائل الرعاية والشراكات - OmarXGaming\n`;
    content += `تاريخ التصدير: ${new Date().toLocaleString('ar-EG')}\n`;
    content += `عدد الرسائل الإجمالي: ${messages.length}\n`;
    content += `==================================================\n\n`;

    messages.forEach((msg, idx) => {
      content += `رسالة رقم [${idx + 1}]:\n`;
      content += `الاسم الكامل: ${msg.name}\n`;
      content += `البريد الإلكتروني: ${msg.email}\n`;
      content += `الشركة / القناة: ${msg.company}\n`;
      content += `تاريخ الإرسال: ${new Date(msg.createdAt).toLocaleString('ar-EG')}\n`;
      content += `تفاصيل العرض:\n${msg.message}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmarXGaming_Inquiries_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('تم تصدير وأرشفة الرسائل بنجاح! 📥');
  };

  // تصفية الرسائل حسب البحث
  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    msg.company.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    (msg.message || '').toLowerCase().includes(messageSearchQuery.toLowerCase())
  );

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: '#fff' }}>

      {/* رأس لوحة التحكم */}
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '100%', padding: '0' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--color-primary)', overflow: 'hidden' }}>
              <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="digital-font gradient-text-cyber" style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.5px' }}>
                OmarXGaming Hub
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-primary)', fontWeight: '800' }}>
                <span>نظام إدارة محتوى الجيمينج (Gaming CMS)</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', display: 'inline-block', boxShadow: '0 0 8px #00ff66' }}></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={fetchAllData}
              title="تحديث البيانات"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ccd2e3', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}
            >
              <RefreshCw size={16} />
            </button>
            <button onClick={handleLogout} className="btn-neon-purple" style={{ padding: '8px 18px', fontSize: '12px', borderRadius: '4px', gap: '6px' }}>
              <LogOut size={14} />
              تسجيل الخروج
            </button>
          </div>

        </div>
      </header>

      {/* منطقة المحتوى */}
      <div className="container" style={{ padding: '40px 24px' }}>

        {errorMessage && (
          <div className="mb-6 animate-scale-in" style={{ padding: '16px', borderRadius: '8px', background: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 animate-scale-in" style={{ padding: '16px', borderRadius: '8px', background: 'rgba(0,255,102,0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 15px rgba(0,255,102,0.1)' }}>
            <CheckCircle size={18} />
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center" style={{ padding: '120px 0' }}>
            <div style={{ margin: '0 auto 20px auto', width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(0,240,255,0.1)', borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite' }}></div>
            <span className="digital-font" style={{ color: 'var(--color-accent)', fontWeight: '800' }}>SYNCHRONIZING CMS DATA...</span>
          </div>
        ) : (
          <div className="admin-dashboard-grid">

            {/* القائمة الجانبية */}
            <aside className="admin-sidebar">
              <button onClick={() => setActiveTab('stats')} className="admin-tab-btn" style={{ background: activeTab === 'stats' ? 'rgba(0,240,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'stats' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'stats' ? 'var(--color-accent)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Users size={18} />
                  إدارة الإحصائيات
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#01</span>
              </button>

              <button onClick={() => setActiveTab('videos')} className="admin-tab-btn" style={{ background: activeTab === 'videos' ? 'rgba(189,0,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'videos' ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'videos' ? 'var(--color-primary)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Video size={18} />
                  إدارة وفلترة الفيديوهات
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#02</span>
              </button>

              <button onClick={() => setActiveTab('gear')} className="admin-tab-btn" style={{ background: activeTab === 'gear' ? 'rgba(0,240,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'gear' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'gear' ? 'var(--color-accent)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Cpu size={18} />
                  عتاد الجيمينج 🚀
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#03</span>
              </button>

              <button onClick={() => setActiveTab('faqs')} className="admin-tab-btn" style={{ background: activeTab === 'faqs' ? 'rgba(189,0,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'faqs' ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'faqs' ? 'var(--color-primary)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HelpCircle size={18} />
                  الجدول والأسئلة الشائعة
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#04</span>
              </button>

              <button onClick={() => setActiveTab('settings')} className="admin-tab-btn" style={{ background: activeTab === 'settings' ? 'rgba(0,240,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'settings' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'settings' ? 'var(--color-accent)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Settings size={18} />
                  الإعدادات والروابط ⚙️
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#05</span>
              </button>

              <button onClick={() => setActiveTab('messages')} className="admin-tab-btn" style={{ background: activeTab === 'messages' ? 'rgba(189,0,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'messages' ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'messages' ? 'var(--color-primary)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} />
                  صندوق بريد الرعاة
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {unreadMessagesCount > 0 && (
                    <span className="badge-glow-unread" style={{ borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', fontSize: '10px' }}>
                      {unreadMessagesCount}
                    </span>
                  )}
                  <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#06</span>
                </div>
              </button>

              {/* القسم السابع - معرض الأعمال والمشاريع */}
              <button onClick={() => setActiveTab('portfolio')} className="admin-tab-btn" style={{ background: activeTab === 'portfolio' ? 'rgba(0,240,255,0.06)' : 'var(--bg-secondary)', border: activeTab === 'portfolio' ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.05)', color: activeTab === 'portfolio' ? 'var(--color-accent)' : '#ccd2e3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Save size={18} />
                  معرض الأعمال والمشاريع 📁
                </span>
                <span className="digital-font" style={{ fontSize: '10px', opacity: '0.6' }}>#07</span>
              </button>
            </aside>

            {/* محتوى القسم النشط */}
            <main style={{ minWidth: '0' }}>

              {/* 1. تبويب الإحصائيات */}
              {activeTab === 'stats' && (
                <div className="cyber-card cyan-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Users size={20} style={{ color: 'var(--color-accent)' }} />
                      تحديث إحصائيات القناة الحية
                    </h2>
                  </div>

                  <form onSubmit={handleStatsSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="admin-stats-inputs-grid">
                      <div className="form-group">
                        <label className="form-label">المشتركين (Subscribers)</label>
                        <input
                          type="number"
                          required
                          value={stats.subscribers}
                          onChange={(e) => setStats({ ...stats, subscribers: e.target.value })}
                          className="cyber-input text-left font-mono"
                          style={{ fontSize: '16px', fontWeight: 'bold' }}
                        />
                        <div className="quick-inc-btns">
                          <button type="button" onClick={() => setStats({ ...stats, subscribers: parseInt(stats.subscribers, 10) + 1000 })} className="quick-inc-btn">+1K</button>
                          <button type="button" onClick={() => setStats({ ...stats, subscribers: parseInt(stats.subscribers, 10) + 10000 })} className="quick-inc-btn">+10K</button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">المشاهدات (Views)</label>
                        <input
                          type="number"
                          required
                          value={stats.views}
                          onChange={(e) => setStats({ ...stats, views: e.target.value })}
                          className="cyber-input text-left font-mono"
                          style={{ fontSize: '16px', fontWeight: 'bold' }}
                        />
                        <div className="quick-inc-btns">
                          <button type="button" onClick={() => setStats({ ...stats, views: parseInt(stats.views, 10) + 50000 })} className="quick-inc-btn">+50K</button>
                          <button type="button" onClick={() => setStats({ ...stats, views: parseInt(stats.views, 10) + 200000 })} className="quick-inc-btn">+200K</button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">الفيديوهات (Videos)</label>
                        <input
                          type="number"
                          required
                          value={stats.videos}
                          onChange={(e) => setStats({ ...stats, videos: e.target.value })}
                          className="cyber-input text-left font-mono"
                          style={{ fontSize: '16px', fontWeight: 'bold' }}
                        />
                        <div className="quick-inc-btns">
                          <button type="button" onClick={() => setStats({ ...stats, videos: parseInt(stats.videos, 10) + 1 })} className="quick-inc-btn">+1 فيديو</button>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'left' }}>
                      <button type="submit" disabled={saving} className="btn-cyber-solid">
                        <Save size={18} />
                        حفظ الإحصائيات 🎯
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. تبويب منظم الفيديوهات */}
              {activeTab === 'videos' && (
                <div className="cyber-card purple-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Video size={20} style={{ color: 'var(--color-primary)' }} />
                        منظم الفيديوهات التفاعلي (CRUD)
                      </h2>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setShowAddVideo(!showAddVideo)} className="btn-neon-cyan" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '30px' }}>
                        <Plus size={14} />
                        {showAddVideo ? 'إغلاق النموذج' : 'إضافة فيديو جديد'}
                      </button>
                      <button onClick={handleYoutubeSync} disabled={syncing} className="btn-neon-red" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '30px' }}>
                        {syncing ? 'جاري السحب...' : 'مزامنة مع يوتيوب 🔴'}
                      </button>
                    </div>
                  </div>

                  {showAddVideo && (
                    <form onSubmit={handleAddVideo} className="animate-scale-in" style={{ padding: '24px', background: 'rgba(0,240,255,0.03)', border: '1px solid var(--color-accent)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-accent)' }}>إضافة فيديو جديد لمكتبتك 🎬</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">معرف فيديو يوتيوب (Video ID) *</label>
                          <input type="text" required placeholder="مثال: dQw4w9WgXcQ" value={newVideoForm.youtubeId} onChange={(e) => setNewVideoForm({ ...newVideoForm, youtubeId: e.target.value })} className="cyber-input text-left font-mono" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الجذاب *</label>
                          <input type="text" required placeholder="عنوان غلاف الفيديو" value={newVideoForm.title} onChange={(e) => setNewVideoForm({ ...newVideoForm, title: e.target.value })} className="cyber-input" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">وصف مشوق وقصير للفيديو</label>
                        <input type="text" placeholder="مثال: تحدي لقطات Warzone الأقوى..." value={newVideoForm.description} onChange={(e) => setNewVideoForm({ ...newVideoForm, description: e.target.value })} className="cyber-input" />
                      </div>
                      <button type="submit" disabled={saving} className="btn-cyber-solid" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '13px' }}>
                        إدراج الفيديو للموقع 💾
                      </button>
                    </form>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                    {videos.map((vid, index) => (
                      <div key={vid.id || index} className="admin-video-edit-card" style={{ position: 'relative' }}>
                        <div className="digital-font" style={{ fontSize: '28px', fontWeight: '900', color: 'var(--color-primary)', textAlign: 'center' }}>
                          {index + 1}
                        </div>
                        <div className="admin-video-edit-grid">
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: '12px' }}>معرف يوتيوب *</label>
                              <input type="text" required value={vid.youtubeId} className="cyber-input text-left font-mono" style={{ fontSize: '13px', padding: '10px' }} disabled />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: '12px' }}>العنوان *</label>
                              <input type="text" value={vid.title} className="cyber-input" style={{ fontSize: '13px', padding: '10px' }} disabled />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '12px' }}>الوصف</label>
                            <input type="text" value={vid.description} className="cyber-input" style={{ fontSize: '13px', padding: '10px' }} disabled />
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div className="video-preview-box" style={{ width: '130px' }}>
                            <img src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`} alt="preview" onError={(e) => { e.target.src = 'https://placehold.co/400x300/black/purple?text=Video'; }} />
                          </div>
                          <button onClick={() => handleVideoDelete(vid.id)} className="btn-neon-red" style={{ padding: '6px 12px', fontSize: '11px', gap: '4px', borderRadius: '4px' }}>
                            <Trash2 size={12} /> حذف الفيديو 🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. تبويب عتاد الجيمينج */}
              {activeTab === 'gear' && (
                <div className="cyber-card cyan-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Cpu size={20} style={{ color: 'var(--color-accent)' }} />
                        منظم مواصفات عتاد الجيمينج 🚀
                      </h2>
                    </div>
                    <button onClick={handleGearSave} disabled={saving} className="btn-cyber-solid" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      <Save size={14} /> حفظ مواصفات العتاد
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                    {gear.map((g, cardIdx) => (
                      <div key={g.id || cardIdx} className="admin-video-edit-card" style={{ gridTemplateColumns: '1fr' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                          <div className="form-group">
                            <label className="form-label">عنوان البطاقة الجيمينج *</label>
                            <input type="text" value={g.title} onChange={(e) => handleGearFieldChange(cardIdx, 'title', e.target.value)} className="cyber-input" />
                          </div>
                          <div className="form-group">
                            <label className="form-label">الأيقونة المفضلة</label>
                            <select value={g.icon} onChange={(e) => handleGearFieldChange(cardIdx, 'icon', e.target.value)} className="cyber-input" style={{ background: 'var(--bg-secondary)' }}>
                              <option value="cpu">معالج (CPU)</option>
                              <option value="monitor">شاشة (Monitor)</option>
                              <option value="mic">ميكروفون (Mic)</option>
                              <option value="gamepad">يد تحكم (Gamepad)</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <label className="form-label" style={{ fontSize: '13px' }}>خطوط مواصفات العتاد (4 أسطر):</label>
                          {g.items.map((item, itemIdx) => (
                            <input key={itemIdx} type="text" value={item} onChange={(e) => handleGearItemChange(cardIdx, itemIdx, e.target.value)} className="cyber-input" style={{ padding: '10px', fontSize: '13px' }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'left' }}>
                    <button onClick={handleGearSave} disabled={saving} className="btn-cyber-solid">
                      <Save size={18} />
                      تحديث وحفظ العتاد 🚀
                    </button>
                  </div>
                </div>
              )}

              {/* 4. تبويب الجدول والأسئلة الشائعة */}
              {activeTab === 'faqs' && (
                <div className="cyber-card purple-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
                        مواعيد البث والأسئلة الشائعة
                      </h2>
                    </div>
                    <button onClick={handleScheduleAndFAQSave} disabled={saving} className="btn-cyber-solid" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      <Save size={14} /> حفظ جدول البث والأسئلة
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>📅 جدول البث المباشر الأسبوعي (3 أيام):</h3>
                      {schedule.map((sch, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>اليوم</label>
                            <input type="text" value={sch.day} onChange={(e) => handleScheduleFieldChange(idx, 'day', e.target.value)} className="cyber-input" style={{ padding: '8px' }} />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>اللعبة المستهدفة</label>
                            <input type="text" value={sch.game} onChange={(e) => handleScheduleFieldChange(idx, 'game', e.target.value)} className="cyber-input" style={{ padding: '8px' }} />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>التوقيت</label>
                            <input type="text" value={sch.time} onChange={(e) => handleScheduleFieldChange(idx, 'time', e.target.value)} className="cyber-input" style={{ padding: '8px' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)' }}>❓ الأسئلة الشائعة المطروحة (FAQ):</h3>
                        <button type="button" onClick={handleAddFAQ} className="btn-neon-cyan" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px' }}>+ إضافة سؤال</button>
                      </div>

                      {faqs.map((faq, idx) => (
                        <div key={faq.id || idx} className="admin-video-edit-card" style={{ gridTemplateColumns: '1fr', position: 'relative', padding: '16px' }}>
                          <button type="button" onClick={() => handleRemoveFAQ(idx)} style={{ position: 'absolute', top: '12px', left: '12px', background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                          <div className="form-group" style={{ paddingLeft: '24px' }}>
                            <label className="form-label" style={{ fontSize: '12px' }}>السؤال الشائع</label>
                            <input type="text" value={faq.question} onChange={(e) => handleFAQFieldChange(idx, 'question', e.target.value)} className="cyber-input" style={{ padding: '10px' }} />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '12px' }}>الجواب الشافي</label>
                            <textarea rows="3" value={faq.answer} onChange={(e) => handleFAQFieldChange(idx, 'answer', e.target.value)} className="cyber-input" style={{ padding: '10px', resize: 'none' }}></textarea>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. تبويب الإعدادات العامة والروابط */}
              {activeTab === 'settings' && (
                <div className="cyber-card cyan-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Settings size={20} style={{ color: 'var(--color-accent)' }} />
                      إعدادات الموقع وتخصيص السوشيال ميديا ⚙️🔗
                    </h2>
                    <button onClick={handleSettingsSave} disabled={saving} className="btn-cyber-solid" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      <Save size={14} /> حفظ كامل التغييرات
                    </button>
                  </div>

                  <form onSubmit={handleSettingsSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxHeight: '520px', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-accent)' }}>🎯 نصوص واجهة الموقع الرئيسية (Hero Section):</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">مقبض قناة يوتيوب (YouTube Handle) *</label>
                          <input type="text" value={settings.channelHandle} onChange={(e) => setSettings({ ...settings, channelHandle: e.target.value })} className="cyber-input" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الترحيبي الأول (Hero Title) *</label>
                          <input type="text" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} className="cyber-input" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">السطر الثاني الملون (Hero Subtitle) *</label>
                        <input type="text" value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} className="cyber-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">النص التعريفي للواجهة (Hero Description) *</label>
                        <textarea rows="4" value={settings.heroDescription} onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })} className="cyber-input" style={{ resize: 'none' }}></textarea>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-accent)' }}>🎨 المظهر والأصوات والميزات الحركية:</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">ثيم ألوان النيون المتوهج</label>
                          <select value={settings.themeColor} onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })} className="cyber-input" style={{ background: 'var(--bg-secondary)' }}>
                            <option value="cyberpunk">بنفسجي وسيان (Cyberpunk Neon)</option>
                            <option value="toxic">أخضر ليموني وبرتقالي (Toxic Vibe)</option>
                            <option value="ruby">أحمر ناري وذهبي (Ruby Flame)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">المؤثرات الصوتية (Sound FX)</label>
                          <select value={settings.soundEnabled} onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.value === 'true' })} className="cyber-input" style={{ background: 'var(--bg-secondary)' }}>
                            <option value="true">تفعيل نغمات الواجهة (مستحسن)</option>
                            <option value="false">تعطيل الأصوات تماماً</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">مؤشر الفأرة الشبكي (Crosshair)</label>
                          <select value={settings.customCursorEnabled} onChange={(e) => setSettings({ ...settings, customCursorEnabled: e.target.value === 'true' })} className="cyber-input" style={{ background: 'var(--bg-secondary)' }}>
                            <option value="true">تفعيل مؤشر الجيمينج Crosshair</option>
                            <option value="false">المؤشر الافتراضي للويندوز</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-accent)' }}>🔗 مخصص روابط قنواتك وتواصلك (Social Media Manager):</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">رابط يوتيوب (YouTube Channel URL)</label>
                          <input type="text" value={socials.youtube} onChange={(e) => setSocials({ ...socials, youtube: e.target.value })} className="cyber-input text-left" style={{ direction: 'ltr' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">رابط دعوة ديسكورد (Discord Invite URL)</label>
                          <input type="text" value={socials.discord} onChange={(e) => setSocials({ ...socials, discord: e.target.value })} className="cyber-input text-left" style={{ direction: 'ltr' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                          <label className="form-label">رابط تيك توك (TikTok URL)</label>
                          <input type="text" value={socials.tiktok} onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })} className="cyber-input text-left" style={{ direction: 'ltr', fontSize: '12.5px' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">رابط تويتر / X</label>
                          <input type="text" value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="cyber-input text-left" style={{ direction: 'ltr', fontSize: '12.5px' }} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">رابط انستقرام (Instagram URL)</label>
                          <input type="text" value={socials.instagram} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} className="cyber-input text-left" style={{ direction: 'ltr', fontSize: '12.5px' }} />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* 6. تبويب صندوق رسائل الرعاة والشركات */}
              {activeTab === 'messages' && (
                <div className="cyber-card purple-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Mail size={20} style={{ color: 'var(--color-primary)' }} />
                        صندوق عروض الرعاية والتعاون المالي ({messages.length})
                      </h2>
                    </div>
                    <button onClick={handleExportMessages} disabled={messages.length === 0} className="btn-neon-cyan" style={{ padding: '10px 20px', fontSize: '12px', gap: '6px', borderRadius: '4px' }}>
                      <Download size={14} /> تصدير وأرشفة الرسائل خارجياً (.txt)
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input type="text" placeholder="ابحث في الرسائل عن طريق اسم الشركة أو محتوى العرض أو اسم المرسل..." value={messageSearchQuery} onChange={(e) => setMessageSearchQuery(e.target.value)} className="cyber-input" style={{ paddingRight: '40px', fontSize: '13px' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', minHeight: '400px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto', paddingLeft: '4px' }}>
                      {filteredMessages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '12px' }}>لا توجد رسائل مطابقة للبحث حالياً.</div>
                      ) : (
                        filteredMessages.map((msg) => (
                          <div key={msg.id} onClick={() => handleSelectMessage(msg)} style={{ padding: '12px 16px', background: activeMessage?.id === msg.id ? 'rgba(189,0,255,0.06)' : 'rgba(255,255,255,0.02)', border: activeMessage?.id === msg.id ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease' }}>
                            {!msg.read && <span style={{ position: 'absolute', top: '12px', left: '12px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 8px var(--color-primary)' }} />}
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', paddingLeft: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.company}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', textAlign: 'left' }}>{new Date(msg.createdAt).toLocaleDateString('ar-EG')}</div>
                          </div>
                        ))
                      )}
                    </div>

                    {activeMessage ? (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{activeMessage.name}</h3>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={12} /> {activeMessage.company}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {activeMessage.email}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{new Date(activeMessage.createdAt).toLocaleString('ar-EG')}</span>
                            <button onClick={() => handleMessageDelete(activeMessage.id)} style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div style={{ flex: '1', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', color: '#d8dee9', fontSize: '13.5px', lineHeight: '1.6', minHeight: '140px', whiteSpace: 'pre-wrap' }}>
                          {activeMessage.message}
                        </div>
                        <div style={{ textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                          <a href={`mailto:${activeMessage.email}?subject=رد على طلب رعاية OmarXGaming&body=أهلاً بك، أشكرك على تواصلك وعرضك المميز...`} className="btn-neon-cyan" style={{ padding: '8px 16px', fontSize: '13px', gap: '6px', textDecoration: 'none' }}>
                            <MessageSquare size={14} />
                            الرد عبر البريد
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px', padding: '48px', color: 'var(--text-muted)', fontSize: '13.5px', fontWeight: 'bold', width: '100%' }}>
                        اختر رسالة من القائمة لعرض تفاصيلها وقراءتها بالكامل
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. تبويب معرض الأعمال والمشاريع */}
              {activeTab === 'portfolio' && (
                <PortfolioManager />
              )}

            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;