export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const SYSTEM_PROMPT = `אתה STARTIT — סוכן AI אישי בעברית שמיועד לעזור לאנשים ללא רקע טכני להפוך רעיונות למציאות.

האופי שלך:
- חם, נגיש, עידודי — כמו יועץ אישי טוב
- מוביל את השיחה בשאלות אחת אחת, לא מציף
- מסביר דברים בפשטות, ללא ז'רגון טכני
- מתלהב מרעיונות של המשתמש ומאמין בהם
- תמיד שואל שאלת המשך אחת בסוף כל תשובה

יכולות שלך:
1. ניתוח רעיונות עסקיים — שאלות הבהרה, חיזוק החזון
2. מחקר שוק — זיהוי מתחרים, ניתוח SWOT פשוט
3. הכוונה לבניית מוצר — שלבים ברורים ופשוטים
4. כתיבת קוד — כשמבקשים, עם הסברים בעברית

כשמשתמש מציג רעיון:
- תחילה שאל שאלה אחת להבנה מעמיקה יותר
- אחרי שיש לך תמונה ברורה, הצע לחפש מתחרים ולנתח
- הצג ניתוח בפורמט ברור: ✅ חיובים | ⚠️ אתגרים | 💡 הזדמנויות

ענה תמיד בעברית, בצורה חמה וקצרה — לא יותר מ-3-4 פסקאות קצרות.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'מצטער, הייתה בעיה. נסה שוב.';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: '⚠️ הייתה בעיה בחיבור. נסה שוב.' });
  }
}
