

Git-connected deployment enabled.# Lingua travel translator


Mobile-first travel voice translator for Japan, Shanghai, and Hong Kong.

## Run it

Open `index.html` in a modern browser. Microphone transcription uses the browser Web Speech API in this prototype; playback uses browser speech synthesis. Chrome and Safari provide the best microphone support.

## Production ElevenLabs flow

Do not put an `ELEVENLABS_API_KEY` in `app.js` or any browser bundle.

1. Stream microphone audio to a server-side `/api/translate` endpoint.
2. Send it to ElevenLabs Scribe v2 Realtime with language detection enabled.
3. Use the returned detected source language to select `English → chosen language` or `chosen language → English`.
4. Translate the transcript in the server layer, then use ElevenLabs multilingual TTS with a language-appropriate voice. Return the audio stream to the app.

For short, non-realtime recordings, ElevenLabs' speech-to-text endpoint accepts a multipart audio file and can automatically detect the input language. Keep the key in the server environment. Configure the voice IDs per destination, never in the UI.

### Vercel setup

The app includes `api/speak.js`, a Vercel serverless function that proxies text-to-speech. In addition to the API key already configured, add one shared `ELEVENLABS_VOICE_ID` as a fallback or add dedicated `ELEVENLABS_JAPANESE_VOICE_ID`, `ELEVENLABS_MANDARIN_VOICE_ID`, `ELEVENLABS_CANTONESE_VOICE_ID`, and `ELEVENLABS_ENGLISH_VOICE_ID` variables. All should be available to the Production environment.

## Content

- 10 dining phrases each for Japanese, Mandarin, and Cantonese
- 10 additional Cantonese phrases for meeting a partner's family
- Native text and readable romanization

The app's `translate()` function demonstrates automatic direction inference when the transcript contains Japanese, Chinese, or Cantonese characters. In production, prefer Scribe's returned language metadata rather than script heuristics.
