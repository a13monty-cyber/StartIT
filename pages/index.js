import { useState, useRef, useEffect } from 'react';

const PERSONAS = [
  {
    id: 'supportive',
    icon: '😊',
    title: 'תומך',
    sub: 'חם, מעודד ואופטימי',
    color: '#5BC4F0',
    prompt: 'אתה יועץ חם ומעודד. אתה מאמין ברעיונות של המשתמש ומחזק אותו. אתה שואל שאלות בונות ומוצא את הצד החיובי בכל דבר.',
  },
  {
    id: 'direct',
    icon: '🎯',
    title: 'ישיר',
    sub: 'קצר, חד ולעניין',
    color: '#6DDBA0',
    prompt: 'אתה יועץ ישיר וקצר. אתה עונה בקצרה, ללא מחמאות מיותרות. אתה מצביע על בעיות ועל חוזקות בצורה עניינית.',
  },
  {
    id: 'challenger',
    icon: '🔥',
    title: 'מאתגר',
    sub: 'שואל שאלות קשות, לא מרצה',
    color: '#FFAF7A',
    prompt: 'אתה יועץ מאתגר כמו חבר אמת. אתה לא מרצה ולא מחמיא סתם. אתה שואל שאלות קשות, מצביע על בעיות אמיתיות, ואומר את האמת גם אם היא לא נעימה לשמוע. המטרה שלך היא לעזור למשתמש להצליח, לא לגרום לו להרגיש טוב.',
  },
  {
    id: 'custom',
    icon: '✍️',
    title: 'מותאם אישית',
    sub: 'כתוב בעצמך איך אתה רוצה',
    color: '#FADA6A',
    prompt: null,
  },
];

const BASE_PROMPT = `אתה STARTIT — סוכן AI אישי בעברית שמיועד לעזור לאנשים להפוך רעיונות למציאות.

יכולות שלך:
1. ניתוח רעיונות עסקיים — שאלות הבהרה, חיזוק החזון
2. מחקר שוק — זיהוי מתחרים, ניתוח SWOT פשוט
3. הכוונה לבניית מוצר — שלבים ברורים ופשוטים
4. כתיבת קוד — כשמבקשים, עם הסברים בעברית

כשמשתמש מציג רעיון:
- תחילה שאל שאלה אחת להבנה מעמיקה יותר
- אחרי שיש לך תמונה ברורה, הצע לחפש מתחרים ולנתח
- הצג ניתוח בפורמט ברור: ✅ חיובים | ⚠️ אתגרים | 💡 הזדמנויות

ענה תמיד בעברית.`;

const STORAGE_KEY = 'startit_conversations';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

function saveConversations(convs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch (e) {}
}

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);
    if (convs.length > 0) setActiveId(convs[0].id);
    else setShowNew(true);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversations, activeId, loading]);

  const activeConv = conversations.find(c => c.id === activeId);

  function createConversation() {
    const persona = selectedPersona;
    const prompt = persona.id === 'custom' ? customPrompt : persona.prompt;
    const newConv = {
      id: generateId(),
      title: 'שיחה חדשה',
      persona: { ...persona, prompt },
      messages: [],
      createdAt: Date.now(),
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveId(newConv.id);
    setShowNew(false);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function deleteConversation(id) {
    if (!confirm('למחוק את השיחה?')) return;
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    if (activeId === id) {
      if (updated.length > 0) setActiveId(updated[0].id);
< truncated lines 124-185 >
      {blob(260, 260, '#FADA6A', undefined, -40, undefined, 100)}
      {blob(200, 200, '#FFAF7A', 200, undefined, 80, undefined)}

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(91,196,240,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>☰</button>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#3AAFD8,#4DC98A,#F09050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STARTIT</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeConv && (
            <div style={{ fontSize: 13, color: '#4A6070', background: `${activeConv.persona.color}22`, border: `1px solid ${activeConv.persona.color}55`, borderRadius: 50, padding: '4px 12px' }}>
              {activeConv.persona.icon} {activeConv.persona.title}
            </div>
          )}
          <button onClick={() => { setShowNew(true); setActiveId(null); setSidebarOpen(false); }} style={{ background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', borderRadius: 50, padding: '7px 16px', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Heebo',sans-serif" }}>+ שיחה חדשה</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 260, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(91,196,240,0.2)', zIndex: 15, display: 'flex', flexDirection: 'column', padding: 16, gap: 8, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8FA3B0', marginBottom: 4 }}>השיחות שלך</div>
            {conversations.length === 0 && <div style={{ fontSize: 14, color: '#8FA3B0', textAlign: 'center', marginTop: 20 }}>אין שיחות עדיין</div>}
            {conversations.map(c => (
              <div key={c.id} onClick={() => { setActiveId(c.id); setShowNew(false); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: activeId === c.id ? 'rgba(91,196,240,0.12)' : 'rgba(255,255,255,0.6)', border: `1px solid ${activeId === c.id ? 'rgba(91,196,240,0.3)' : 'rgba(91,196,240,0.1)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>{c.persona.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2B3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: '#8FA3B0' }}>{c.messages.length} הודעות</div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteConversation(c.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8FA3B0', padding: 2 }}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        {/* NEW CONVERSATION */}
        {showNew && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 20, position: 'relative', zIndex: 5, overflowY: 'auto' }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 12px 36px rgba(91,196,240,0.35)' }}>🚀</div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, letterSpacing: -1, color: '#1A2B3C', marginBottom: 8 }}>
                שיחה חדשה
              </h1>
              <p style={{ fontSize: 14, color: '#4A6070', lineHeight: 1.6, maxWidth: 420 }}>בחר איך אתה רוצה שהסוכן יתנהג איתך</p>
            </div>

            <div style={{ width: '100%', maxWidth: 480 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8FA3B0', marginBottom: 10 }}>אופי הסוכן</div>
              {PERSONAS.map(p => (
                <div key={p.id} onClick={() => setSelectedPersona(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: selectedPersona.id === p.id ? `${p.color}18` : 'rgba(255,255,255,0.85)', border: `1.5px solid ${selectedPersona.id === p.id ? p.color : 'rgba(91,196,240,0.2)'}`, cursor: 'pointer', marginBottom: 8, transition: 'all 0.15s' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2B3C' }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#8FA3B0', marginTop: 2 }}>{p.sub}</div>
                  </div>
                  {selectedPersona.id === p.id && <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11 }}>✓</div>}
                </div>
              ))}

              {selectedPersona.id === 'custom' && (
                <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="תאר איך אתה רוצה שהסוכן יתנהג... לדוגמה: 'דבר אליי כמו מנטור עסקי מנוסה שלא חוסך ביקורת'" style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid rgba(250,218,106,0.5)', background: 'rgba(255,255,255,0.9)', fontFamily: "'Heebo',sans-serif", fontSize: 14, color: '#1A2B3C', resize: 'none', height: 90, direction: 'rtl', outline: 'none', marginTop: 4 }} />
              )}

              <button onClick={createConversation} disabled={selectedPersona.id === 'custom' && !customPrompt.trim()} style={{ width: '100%', padding: '14px', borderRadius: 14, background: (selectedPersona.id === 'custom' && !customPrompt.trim()) ? 'rgba(91,196,240,0.3)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: (selectedPersona.id === 'custom' && !customPrompt.trim()) ? 'not-allowed' : 'pointer', fontFamily: "'Heebo',sans-serif", marginTop: 12, boxShadow: '0 4px 16px rgba(58,175,216,0.3)' }}>
                🚀 התחל שיחה
              </button>
            </div>
          </div>
        )}

        {/* CHAT */}
        {!showNew && activeConv && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', zIndex: 5 }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 780, width: '100%', margin: '0 auto' }}>
              {activeConv.messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8FA3B0', fontSize: 14, marginTop: 40 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{activeConv.persona.icon}</div>
                  <div>שלום! אני במצב <strong>{activeConv.persona.title}</strong>.</div>
                  <div style={{ marginTop: 6 }}>ספר לי על הרעיון שלך 💡</div>
                </div>
              )}
              {activeConv.messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', animation: 'fadeIn 0.3s ease both' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: m.role === 'user' ? 'linear-gradient(135deg,#FFAF7A,#FADA6A)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{m.role === 'user' ? '😊' : '🤖'}</div>
                  <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: 18, fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', ...(m.role === 'user' ? { background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', color: 'white', borderBottomLeftRadius: 4, boxShadow: '0 4px 16px rgba(58,175,216,0.3)' } : { background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(91,196,240,0.2)', color: '#1A2B3C', borderBottomRightRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }) }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
                  <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(91,196,240,0.2)', borderRadius: 18, borderBottomRightRadius: 4, padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: j===0?'#5BC4F0':j===1?'#6DDBA0':'#FFAF7A', animation: `bounce 1.2s infinite ${j*0.2}s` }} />)}
                  </div>
                </div>
              )}
            </div>

            {/* INPUT */}
            <div style={{ padding: '12px 16px 20px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(91,196,240,0.25)', borderRadius: 18, padding: '10px 10px 10px 16px', boxShadow: '0 4px 24px rgba(91,196,240,0.1)', maxWidth: 780, margin: '0 auto' }}>
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} placeholder="כתוב את הרעיון שלך כאן..." style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: "'Heebo',sans-serif", fontSize: 15, color: '#1A2B3C', lineHeight: 1.5, maxHeight: 120, direction: 'rtl', overflowY: 'auto' }} onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
                <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: loading || !input.trim() ? 'rgba(91,196,240,0.3)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: loading || !input.trim() ? 'none' : '0 4px 14px rgba(58,175,216,0.3)' }}>➤</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8FA3B0', marginTop: 8 }}>לחץ Enter לשליחה · Shift+Enter לשורה חדשה</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Heebo:wght@300;400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:rgba(91,196,240,0.3);border-radius:4px}
      `}</style>
    </div>
  );
}

