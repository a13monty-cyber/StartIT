import { useState, useRef, useEffect } from 'react';

const QUICK_STARTS = [
  { icon: '💡', title: 'יש לי רעיון לאפליקציה', sub: 'בוא נבדוק אם יש לו שוק', color: '#5BC4F0', msg: 'יש לי רעיון לאפליקציה ואני רוצה לבדוק אותו' },
  { icon: '🔍', title: 'מי המתחרים שלי?', sub: 'נחפש מוצרים דומים ונשווה', color: '#6DDBA0', msg: 'אני רוצה לדעת אם הרעיון שלי כבר קיים בשוק ומי המתחרים שלי' },
  { icon: '🗺️', title: 'לא יודע מאיפה להתחיל', sub: 'ניצור ביחד תוכנית פעולה', color: '#FADA6A', msg: 'אני לא יודע מאיפה להתחיל עם הרעיון שלי, אני צריך הכוונה' },
  { icon: '🛠️', title: 'עזור לי בקוד', sub: 'נכתוב ביחד קוד מותאם אישית', color: '#FFAF7A', msg: 'אני רוצה לבנות משהו אבל צריך עזרה בקוד' },
];

const STORAGE_KEY = 'startit_messages';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) { setMessages(parsed); setStarted(true); }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      if (messages.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [started]);

  function clearChat() {
    if (confirm('האם למחוק את כל השיחה ולהתחיל מחדש?')) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
      setStarted(false);
    }
  }

  async function send(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setStarted(true);

    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ הייתה בעיה בחיבור. נסה שוב.' }]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const blob = (w, h, bg, top, bottom, left, right) => (
    <div style={{
      position: 'fixed', borderRadius: '50%',
      width: w, height: h, background: bg,
      top, bottom, left, right,
      filter: 'blur(80px)', opacity: 0.22, pointerEvents: 'none', zIndex: 0,
    }} />
  );

  return (
    <div dir="rtl" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {blob(400, 400, '#5BC4F0', -80, undefined, undefined, -80)}
      {blob(320, 320, '#6DDBA0', undefined, 60, -60, undefined)}
      {blob(260, 260, '#FADA6A', undefined, -40, undefined, 100)}
      {blob(200, 200, '#FFAF7A', 200, undefined, 80, undefined)}

      <header style={{
        position: 'relative', zIndex: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px',
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(91,196,240,0.2)',
      }}>
        <div style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800,
          background: 'linear-gradient(135deg,#3AAFD8,#4DC98A,#F09050)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>STARTIT</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {started && (
            <button onClick={clearChat} style={{
              background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(91,196,240,0.3)',
              borderRadius: 50, padding: '6px 14px', fontSize: 13, color: '#4A6070',
              cursor: 'pointer', fontFamily: "'Heebo',sans-serif", fontWeight: 500,
            }}>🗑️ שיחה חדשה</button>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(109,219,160,0.12)', border: '1px solid rgba(91,196,240,0.2)',
            borderRadius: 50, padding: '6px 16px', fontSize: 13, color: '#4A6070', fontWeight: 500,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6DDBA0', animation: 'pulse 2s infinite' }} />
            הסוכן פעיל
          </div>
        </div>
      </header>

      {!started && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px', gap: 24, position: 'relative', zIndex: 5, overflowY: 'auto',
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22,
            background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, boxShadow: '0 12px 36px rgba(91,196,240,0.35)',
          }}>🚀</div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(24px,4vw,38px)',
              fontWeight: 800, letterSpacing: -1, lineHeight: 1.2, color: '#1A2B3C', marginBottom: 10,
            }}>
              שלום! 👋<br />
              <span style={{
                background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>מה הרעיון שלך היום?</span>
            </h1>
            <p style={{ fontSize: 15, color: '#4A6070', lineHeight: 1.7, maxWidth: 460 }}>
              ספר לי על רעיון — ואני אעזור לך לנתח אותו, למצוא מתחרים, ולהבין אם יש לו עתיד. 💡
            </p>
          </div>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', color: '#8FA3B0', marginBottom: 12,
            }}>התחל מכאן</div>
            {QUICK_STARTS.map((q, i) => (
              <div key={i} onClick={() => send(q.msg)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(91,196,240,0.2)',
                borderRadius: 14, padding: '13px 16px', cursor: 'pointer', marginBottom: 10,
                transition: 'all 0.2s', animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#5BC4F0'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(91,196,240,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(91,196,240,0.2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 38, he
