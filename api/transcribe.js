module.exports.config = { api: { bodyParser: false } };

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ELEVENLABS_API_KEY) return res.status(503).json({ error: 'Voice transcription has not been configured yet.' });

  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) return res.status(400).json({ error: 'Send recorded audio as form data.' });

  try {
    const audio = await readBody(req);
    if (!audio.length || audio.length > 25 * 1024 * 1024) return res.status(400).json({ error: 'Record a short audio message and try again.' });

    const elevenResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': contentType },
      body: audio,
    });
    const result = await elevenResponse.json();
    if (!elevenResponse.ok) return res.status(elevenResponse.status).json({ error: result?.detail?.message || result?.detail || 'Audio could not be transcribed.' });
    if (!result.text?.trim()) return res.status(422).json({ error: 'No speech was detected. Please try again.' });

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ text: result.text.trim(), languageCode: result.language_code || null });
  } catch (error) {
    console.error('ElevenLabs transcription failed', error.message);
    return res.status(502).json({ error: 'Voice transcription is unavailable.' });
  }
};
