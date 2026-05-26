export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, systemPrompt } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: systemPrompt,
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
