import { useState, useRef, useEffect } from 'react';

const PERSONAS = [
  { id: 'supportive', icon: '😊', title: 'תומך', sub: 'חם, מעודד ואופטימי', color: '#5BC4F0', prompt: 'אתה יועץ חם ומעודד. אתה מאמין ברעיונות של המשתמש ומחזק אותו. אתה שואל שאלות בונות ומוצא את הצד החיובי בכל דבר.' },
  { id: 'direct', icon: '🎯', title: 'ישיר', sub: 'קצר, חד ולעניין', color: '#6DDBA0', prompt: 'אתה יועץ ישיר וקצר. אתה עונה בקצרה, ללא מחמאות מיותרות. אתה מצביע על בעיות ועל חוזקות בצורה עניינית.' },
  { id: 'challenger', icon: '🔥', title: 'מאתגר', sub: 'שואל שאלות קשות, לא מרצה', color: '#FFAF7A', prompt: 'אתה יועץ מאתגר כמו חבר אמת. אתה לא מרצה ולא מחמיא סתם. אתה שואל שאלות קשות, מצביע על בעיות אמיתיות, ואומר את האמת גם אם היא לא נעימה לשמוע.' },
  { id: 'custom', icon: '✍️', title: 'מותאם אישית', sub: 'כתוב בעצמך איך אתה רוצה', color: '#FADA6A', prompt: null },
];

const BASE_PROMPT = `אתה STARTIT סוכן AI בעברית שעוזר להפוך רעיונות למציאות. ענה תמיד בעברית. כשמשתמש מציג רעיון שאל שאלה אחת להבנה, ואז הצג ניתוח: חיובים, אתגרים, הזדמנויות.`;

const STORAGE_KEY = 'startit_conversations';

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function loadConversations() { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; } catch(e) { return []; } }
function saveConversations(c) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch(e) {} }

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

  useEffect(() => { const c = loadConversations(); setConversations(c); if (c.length > 0) setActiveId(c[0].id); else setShowNew(true); }, []);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [conversations, activeId, loading]);

  const activeConv = conversations.find(c => c.id === activeId);

  function createConversation() {
    const p = selectedPersona;
    const newConv = { id: generateId(), title: 'שיחה חדשה', persona: { ...p, prompt: p.id === 'custom' ? customPrompt : p.prompt }, messages: [], createdAt: Date.now() };
    const updated = [newConv, ...conversations];
    setConversations(updated); saveConversations(updated);
    setActiveId(newConv.id); setShowNew(false); setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function deleteConversation(id) {
    if (!confirm('למחוק את השיחה?')) return;
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated); saveConversations(updated);
    if (activeId === id) { if (updated.length > 0) setActiveId(updated[0].id); else { setActiveId(null); setShowNew(true); } }
  }

  async function send(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || loading || !activeConv) return;
    setInput('');
    const newMessages = [...activeConv.messages, { role: 'user', content: trimmed }];
    const newTitle = activeConv.messages.length === 0 ? trimmed.slice(0, 30) : activeConv.title;
    const updated = conversations.map(c => c.id === activeId ? { ...c, messages: newMessages, title: newTitle } : c);
    setConversations(updated); saveConversations(updated); setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, systemPrompt: BASE_PROMPT + '\n\nסגנון: ' + (activeConv.persona.prompt || '') }) });
      const data = await res.json();
      const final = conversations.map(c => c.id === activeId ? { ...c, messages: [...newMessages, { role: 'assistant', content: data.reply }], title: newTitle } : c);
      setConversations(final); saveConversations(final);
    } catch { const final = conversations.map(c => c.id === activeId ? { ...c, messages: [...newMessages, { role: 'assistant', content: '⚠️ שגיאה. נסה שוב.' }], title: newTitle } : c); setConversations(final); saveConversations(final); }
    setLoading(false);
  }

  function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

return (
    <div dir="rtl" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', fontFamily: "'Heebo',sans-serif", background: 'linear-gradient(135deg,#EBF8FF,#F0FDF4,#FFF7ED)' }}>

      <header style={{ position: 'relative', zIndex: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(91,196,240,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>☰</button>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#3AAFD8,#4DC98A,#F09050)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STARTIT</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeConv && <div style={{ fontSize: 13, color: '#4A6070', background: `${activeConv.persona.color}22`, border: `1px solid ${activeConv.persona.color}55`, borderRadius: 50, padding: '4px 12px' }}>{activeConv.persona.icon} {activeConv.persona.title}</div>}
          <button onClick={() => { setShowNew(true); setActiveId(null); setSidebarOpen(false); }} style={{ background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', borderRadius: 50, padding: '7px 16px', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Heebo',sans-serif" }}>+ שיחה חדשה</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>

        {sidebarOpen && (
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 260, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(91,196,240,0.2)', zIndex: 15, display: 'flex', flexDirection: 'column', padding: 16, gap: 8, overflowY: 'auto' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8FA3B0', marginBottom: 4 }}>השיחות שלך</div>
            {conversations.length === 0 && <div style={{ fontSize: 14, color: '#8FA3B0', textAlign: 'center', marginTop: 20 }}>אין שיחות עדיין</div>}
            {conversations.map(c => (
              <div key={c.id} onClick={() => { setActiveId(c.id); setShowNew(false); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: activeId === c.id ? 'rgba(91,196,240,0.12)' : 'rgba(255,255,255,0.6)', border: `1px solid ${activeId === c.id ? 'rgba(91,196,240,0.3)' : 'rgba(91,196,240,0.1)'}`, cursor: 'pointer' }}>
                <div style={{ fontSize: 18 }}>{c.persona.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2B3C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: '#8FA3B0' }}>{c.messages.length} הודעות</div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteConversation(c.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#8FA3B0' }}>🗑️</button>
              </div>
            ))}
          </div>
        )}
{showNew && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 20, overflowY: 'auto', zIndex: 5 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🚀</div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, color: '#1A2B3C', marginBottom: 8 }}>שיחה חדשה</h1>
              <p style={{ fontSize: 14, color: '#4A6070', maxWidth: 420 }}>בחר איך אתה רוצה שהסוכן יתנהג איתך</p>
            </div>
            <div style={{ width: '100%', maxWidth: 480 }}>
              {PERSONAS.map(p => (
                <div key={p.id} onClick={() => setSelectedPersona(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, background: selectedPersona.id === p.id ? `${p.color}18` : 'rgba(255,255,255,0.85)', border: `1.5px solid ${selectedPersona.id === p.id ? p.color : 'rgba(91,196,240,0.2)'}`, cursor: 'pointer', marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2B3C' }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#8FA3B0' }}>{p.sub}</div>
                  </div>
                  {selectedPersona.id === p.id && <div style={{ width: 18, height: 18, borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11 }}>✓</div>}
                </div>
              ))}
              {selectedPersona.id === 'custom' && (
                <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="תאר איך אתה רוצה שהסוכן יתנהג..." style={{ width: '100%', padding: '12px 16px', borderRadius: 14, border: '1.5px solid rgba(250,218,106,0.5)', background: 'rgba(255,255,255,0.9)', fontFamily: "'Heebo',sans-serif", fontSize: 14, color: '#1A2B3C', resize: 'none', height: 90, direction: 'rtl', outline: 'none', marginTop: 4 }} />
              )}
              <button onClick={createConversation} disabled={selectedPersona.id === 'custom' && !customPrompt.trim()} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo',sans-serif", marginTop: 12 }}>🚀 התחל שיחה</button>
            </div>
          </div>
        )}
        {!showNew && activeConv && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, zIndex: 5 }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 780, width: '100%', margin: '0 auto' }}>
              {activeConv.messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8FA3B0', fontSize: 14, marginTop: 40 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{activeConv.persona.icon}</div>
                  <div>אני במצב <strong>{activeConv.persona.title}</strong> — ספר לי על הרעיון שלך 💡</div>
                </div>
              )}
              {activeConv.messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: m.role === 'user' ? 'linear-gradient(135deg,#FFAF7A,#FADA6A)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{m.role === 'user' ? '😊' : '🤖'}</div>
                  <div style={{ maxWidth: '72%', padding: '12px 16px', borderRadius: 18, fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap', ...(m.role === 'user' ? { background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', color: 'white', borderBottomLeftRadius: 4 } : { background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(91,196,240,0.2)', color: '#1A2B3C', borderBottomRightRadius: 4 }) }}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3AAFD8,#4DC98A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
                  <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(91,196,240,0.2)', borderRadius: 18, padding: '14px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: j===0?'#5BC4F0':j===1?'#6DDBA0':'#FFAF7A', animation: `bounce 1.2s infinite ${j*0.2}s` }} />)}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '12px 16px 20px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(91,196,240,0.25)', borderRadius: 18, padding: '10px 10px 10px 16px', maxWidth: 780, margin: '0 auto' }}>
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} rows={1} placeholder="כתוב את הרעיון שלך כאן..." style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: "'Heebo',sans-serif", fontSize: 15, color: '#1A2B3C', lineHeight: 1.5, maxHeight: 120, direction: 'rtl', overflowY: 'auto' }} onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
                <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: loading || !input.trim() ? 'rgba(91,196,240,0.3)' : 'linear-gradient(135deg,#3AAFD8,#4DC98A)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>➤</button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8FA3B0', marginTop: 8 }}>לחץ Enter לשליחה · Shift+Enter לשורה חדשה</div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}`}</style>
    </div>
  );
}
