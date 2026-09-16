// Vercel serverless function. Secrets stay in Vercel environment variables.
const VOICE_ENV = {
  Japanese: "ELEVENLABS_JAPANESE_VOICE_ID",
  Mandarin: "ELEVENLABS_MANDARIN_VOICE_ID",
  Cantonese: "ELEVENLABS_CANTONESE_VOICE_ID",
  English: "ELEVENLABS_ENGLISH_VOICE_ID",
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, language = "English" } = req.body || {};
  if (!text || typeof text !== "string" || text.length > 600) {
    return res.status(400).json({ error: "Provide translation text up to 600 characters." });
  }

  const voiceId = process.env[VOICE_ENV[language]] || process.env.ELEVENLABS_VOICE_ID;
  if (!process.env.ELEVENLABS_API_KEY || !voiceId) {
    return res.status(503).json({ error: "Voice service has not been configured yet." });
  }

  try {
    const elevenResponse = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId + "/stream?output_format=mp3_44100_128",
      {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
      },
    );
    if (!elevenResponse.ok) {
      return res.status(elevenResponse.status).json({ error: "ElevenLabs could not generate audio." });
    }
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(await elevenResponse.arrayBuffer()));
  } catch {
    res.status(502).json({ error: "Voice service is unavailable." });
  }
};
