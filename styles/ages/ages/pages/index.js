import { useState, useRef, useEffect } from 'react';

const QUICK_STARTS = [
  { icon: '💡', title: 'יש לי רעיון לאפליקציה', sub: 'בוא נבדוק אם יש לו שוק', color: '#5BC4F0', msg: 'יש לי רעיון לאפליקציה ואני רוצה לבדוק אותו' },
  { icon: '🔍', title: 'מי המתחרים שלי?', sub: 'נחפש מוצרים דומים ונשווה', color: '#6DDBA0', msg: 'אני רוצה לדעת אם הרעיון שלי כבר קיים בשוק ומי המתחרים שלי' },
  { icon: '🗺️', title: 'לא יודע מאיפה להתחיל', sub: 'ניצור ביחד תוכנית פעולה', color: '#FADA6A', msg: 'אני לא יודע מאיפה להתחיל עם הרעיון שלי, אני צריך הכוונה' },
  { icon: '🛠️', title: 'עזור לי בקוד', sub: 'נכתוב ביחד קוד מותאם אישית', color: '#FFAF7A', msg: 'אני רוצה לבנות משהו אבל צריך עזרה בקוד' },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [started]);

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

      {/* HEADER */}
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
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(109,219,160,0.12)', border: '1px solid rgba(91,196,240,0.2)',
          borderRadius: 50, padding: '6px 16px', fontSize: 13, color: '#4A6070', fontWeight: 500,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6DDBA0', animation: 'pulse 2s infinite' }} />
          הסוכן פעיל
        </div>
      </header>

      {/* WELCOME */}
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
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${q.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>{q.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2B3C' }}>{q.title}</div>
                  <div style={{ fontSize: 12, color: '#8FA3B0', marginTop: 2 }}>{q.sub}</div>
                </div>
                <div style={{ color: '#8FA3B0', fontSize: 14 }}>←</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT */}
      {started && (
        <div ref={chatRef} style={{
          flex: 1, overflowY: 'auto', padding: '20px 16px',
          display: 'flex', flexDirection: 'column', gap: 14,
          position: 'relative', zIndex: 5, minHeight: 0,
          maxWidth: 780, width: '100%', margin: '0 auto',
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              animation: 'fadeIn 0.3s ease both',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: m.role === 'user'
                  ? 'linear-gradient(135deg,#FFAF7A,#FADA6A)'
                  : 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>{m.role === 'user' ? '😊' : '🤖'}</div>
              <div style={{
                maxWidth: '72%', padding: '12px 16px', borderRadius: 18,
                fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap',
                ...(m.role === 'user' ? {
                  background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
                  color: 'white', borderBottomLeftRadius: 4,
                  boxShadow: '0 4px 16px rgba(58,175,216,0.3)',
                } : {
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(91,196,240,0.2)',
                  color: '#1A2B3C', borderBottomRightRadius: 4,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }),
              }}>{m.content}</div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
              }}>🤖</div>
              <div style={{
                background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(91,196,240,0.2)',
                borderRadius: 18, borderBottomRightRadius: 4,
                padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: j === 0 ? '#5BC4F0' : j === 1 ? '#6DDBA0' : '#FFAF7A',
                    animation: `bounce 1.2s infinite ${j * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* INPUT */}
      <div style={{ position: 'relative', zIndex: 10, padding: '12px 16px 20px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(91,196,240,0.25)',
          borderRadius: 18, padding: '10px 10px 10px 16px',
          boxShadow: '0 4px 24px rgba(91,196,240,0.1)',
          maxWidth: 780, margin: '0 auto',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="כתוב את הרעיון שלך כאן..."
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              background: 'transparent', fontFamily: "'Heebo',sans-serif",
              fontSize: 15, color: '#1A2B3C', lineHeight: 1.5,
              maxHeight: 120, direction: 'rtl', overflowY: 'auto',
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: loading || !input.trim() ? 'rgba(91,196,240,0.3)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)',
            border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, transition: 'all 0.2s',
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 14px rgba(58,175,216,0.3)',
          }}>➤</button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8FA3B0', marginTop: 8 }}>
          לחץ Enter לשליחה · Shift+Enter לשורה חדשה
        </div>
      </div>
    </div>
  );
}
