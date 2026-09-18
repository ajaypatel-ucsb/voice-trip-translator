const data = {  Japanese: { flag: '🇯🇵', code: 'ja-JP', city: 'Japan', phrases: [    ['A table for two, please.', '二人です。', 'Futari desu.'], ['Could I see the menu, please?', 'メニューをお願いします。', 'Menyū o onegaishimasu.'], ['What do you recommend?', 'おすすめは何ですか？', 'Osusume wa nan desu ka?'], ['Is this dish spicy?', 'これは辛いですか？', 'Kore wa karai desu ka?'], ['I have a food allergy.', '食べ物のアレルギーがあります。', 'Tabemono no arerugī ga arimasu.'], ['No meat, please.', '肉なしでお願いします。', 'Niku nashi de onegaishimasu.'], ['This is delicious!', 'とてもおいしいです！', 'Totemo oishii desu!'], ['Could we have the bill, please?', 'お会計をお願いします。', 'Okaikei o onegaishimasu.'], ['Can I pay by card?', 'カードで払えますか？', 'Kādo de haraemasu ka?'], ['Thank you for the meal.', 'ごちそうさまでした。', 'Gochisōsama deshita.'] ] },  Mandarin: { flag: '🇨🇳', code: 'zh-CN', city: 'Shanghai', phrases: [    ['A table for two, please.', '两位，谢谢。', 'Liǎng wèi, xièxie.'], ['Could I see the menu?', '可以看看菜单吗？', 'Kěyǐ kànkan càidān ma?'], ['What do you recommend?', '你推荐什么？', 'Nǐ tuījiàn shénme?'], ['Is this spicy?', '这个辣吗？', 'Zhège là ma?'], ['I am allergic to peanuts.', '我对花生过敏。', 'Wǒ duì huāshēng guòmǐn.'], ['No cilantro, please.', '不要香菜，谢谢。', 'Bú yào xiāngcài, xièxie.'], ['This is very delicious!', '这个非常好吃！', 'Zhège fēicháng hǎochī!'], ['Could we get the bill?', '请买单。', 'Qǐng mǎidān.'], ['Can I pay with Alipay?', '可以用支付宝吗？', 'Kěyǐ yòng Zhīfùbǎo ma?'], ['Thank you, goodbye.', '谢谢，再见。', 'Xièxie, zàijiàn.'] ] },  Cantonese: { flag: '🇭🇰', code: 'zh-HK', city: 'Hong Kong', phrases: [    ['A table for two, please.', '唔該，兩位。', 'M̀h gōi, léuhng wai.'], ['Could I see the menu?', '唔該，可唔可以睇吓餐牌？', 'M̀h gōi, hó m̀h hó yí tái há chāan páai?'], ['What do you recommend?', '你有咩推介？', 'Néih yáuh mē tuī gāai?'], ['Is this spicy?', '呢個辣唔辣？', 'Nī go lát m̀h lát?'], ['No MSG, please.', '唔該，唔要味精。', 'M̀h gōi, m̀h yiu meih jīng.'], ['This is so delicious!', '呢個真係好好食！', 'Nī go jān hai hóu hóu sihk!'], ['Could we have the bill?', '唔該，埋單。', 'M̀h gōi, màai dāan.'], ['Can I pay by card?', '可唔可以用信用卡？', 'Hó m̀h hó yí yuhng seun yuhng kāat?'], ['Keep the change.', '唔使找。', 'M̀h sái jáau.'

let finalTranscript = '';
async function translate(text, autoPlay = false) {
  if (!text.trim()) return false;
  $('#transcript').textContent = text;
  $('#transcript').classList.remove('empty');
  $('#translation').textContent = 'Translating…';
  $('#romanization').textContent = '';
  try {
    const response = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, selectedLanguage: current }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Translation unavailable');
    reversed = result.direction === 'to_english';
    updateDirection();
    $('#translation').textContent = result.translation;
    $('#romanization').textContent = `${result.source_language} → ${result.target_language}`;
    if (autoPlay) await speak();
    return true;
  } catch (error) {
    $('#translation').textContent = 'Translation unavailable.';
    $('#romanization').textContent = error.message || 'Check your connection and try again.';
    return false;
  }
}
function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { $('#micCaption').textContent = 'VOICE INPUT NEEDS CHROME OR SAFARI'; return; }
  recognition = new SpeechRecognition();
  recognition.lang = reversed ? data[current].code : 'en-US';
  recognition.interimResults = true;
  recognition.onresult = event => {
    const text = Array.from(event.results).map(result => result[0].transcript).join('');
    $('#transcript').textContent = text;
    $('#transcript').classList.remove('empty');
    if (event.results[event.results.length - 1].isFinal) { receivedFinalResult = true; finalTranscript = text; }
  };
  recognition.onend = () => {
    const shouldPlay = releasedHold && receivedFinalResult;
    stopListening(); releasedHold = false;
    if (receivedFinalResult) translate(finalTranscript, shouldPlay);
    receivedFinalResult = false; finalTranscript = '';
  };
  recognition.start(); listening = true;
  $('#recordButton').classList.add('recording');
  $('#micCaption').textContent = 'LISTENING… RELEASE TO TRANSLATE';
}
holdRecordButton.onpointerdown = event => { event.preventDefault(); if (listening) return; releasedHold = false; receivedFinalResult = false; finalTranscript = ''; holdRecordButton.setPointerCapture?.(event.pointerId); startListening(); };
holdRecordButton.onpointerup = holdRecordButton.onpointercancel = () => { releasedHold = true; if (listening) stopListening(); else if (receivedFinalResult) { receivedFinalResult = false; translate(finalTranscript, true); finalTranscript = ''; } };
