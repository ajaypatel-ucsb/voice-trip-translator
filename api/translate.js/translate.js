const ALLOWED_LANGUAGES = new Set(['Japanese', 'Mandarin', 'Cantonese']);

const responseText = (payload) => {
  if (typeof payload.output_text === 'string') return payload.output_text;
  return (payload.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text)
    .join('');
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, selectedLanguage } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length > 1000) {
    return res.status(400).json({ error: 'Provide text up to 1,000 characters.' });
  }
  if (!ALLOWED_LANGUAGES.has(selectedLanguage)) {
    return res.status(400).json({ error: 'Choose Japanese, Mandarin, or Cantonese.' });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'Translation service has not been configured yet.' });
  }

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      translation: { type: 'string' },
      source_language: { type: 'string' },
      target_language: { type: 'string' },
      direction: { type: 'string', enum: ['from_english', 'to_english'] },
    },
    required: ['translation', 'source_language', 'target_language', 'direction'],
  };

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-5.5',
        instructions: `You are a precise travel translator. Detect the input language. If the input is English, translate it naturally into ${selectedLanguage}. If the input is any language other than English, translate it naturally into English. Preserve names, numbers, politeness, and intent. Return only the requested JSON.`,
        input: text.trim(),
        text: {
          format: { type: 'json_schema', name: 'travel_translation', strict: true, schema },
        },
      }),
    });

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({ error: 'Translation service could not complete the request.' });
    }

    const result = JSON.parse(responseText(await openaiResponse.json()));
    if (!result.translation || !result.direction) throw new Error('Invalid translation response');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(result);
  } catch {
    return res.status(502).json({ error: 'Translation service is unavailable.' });
  }
};
