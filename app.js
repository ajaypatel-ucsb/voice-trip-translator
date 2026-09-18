const data = {
  Japanese: { flag: '🇯🇵', code: 'ja-JP', city: 'Japan', phrases: [
    ['A table for two, please.', '二人です。', 'Futari desu.'], ['Could I see the menu, please?', 'メニューをお願いします。', 'Menyū o onegaishimasu.'], ['What do you recommend?', 'おすすめは何ですか？', 'Osusume wa nan desu ka?'], ['Is this dish spicy?', 'これは辛いですか？', 'Kore wa karai desu ka?'], ['I have a food allergy.', '食べ物のアレルギーがあります。', 'Tabemono no arerugī ga arimasu.'], ['No meat, please.', '肉なしでお願いします。', 'Niku nashi de onegaishimasu.'], ['This is delicious!', 'とてもおいしいです！', 'Totemo oishii desu!'], ['Could we have the bill, please?', 'お会計をお願いします。', 'Okaikei o onegaishimasu.'], ['Can I pay by card?', 'カードで払えますか？', 'Kādo de haraemasu ka?'], ['Thank you for the meal.', 'ごちそうさまでした。', 'Gochisōsama deshita.'] ] },
  Mandarin: { flag: '🇨🇳', code: 'zh-CN', city: 'Shanghai', phrases: [
    ['A table for two, please.', '两位，谢谢。', 'Liǎng wèi, xièxie.'], ['Could I see the menu?', '可以看看菜单吗？', 'Kěyǐ kànkan càidān ma?'], ['What do you recommend?', '你推荐什么？', 'Nǐ tuījiàn shénme?'], ['Is this spicy?', '这个辣吗？', 'Zhège là ma?'], ['I am allergic to peanuts.', '我对花生过敏。', 'Wǒ duì huāshēng guòmǐn.'], ['No cilantro, please.', '不要香菜，谢谢。', 'Bú yào xiāngcài, xièxie.'], ['This is very delicious!', '这个非常好吃！', 'Zhège fēicháng hǎochī!'], ['Could we get the bill?', '请买单。', 'Qǐng mǎidān.'], ['Can I pay with Alipay?', '可以用支付宝吗？', 'Kěyǐ yòng Zhīfùbǎo ma?'], ['Thank you, goodbye.', '谢谢，再见。', 'Xièxie, zàijiàn.'] ] },
  Cantonese: { flag: '🇭🇰', code: 'zh-HK', city: 'Hong Kong', phrases: [
    ['A table for two, please.', '唔該，兩位。', 'M̀h gōi, léuhng wai.'], ['Could I see the menu?', '唔該，可唔可以睇吓餐牌？', 'M̀h gōi, hó m̀h hó yí tái há chāan páai?'], ['What do you recommend?', '你有咩推介？', 'Néih yáuh mē tuī gāai?'], ['Is this spicy?', '呢個辣唔辣？', 'Nī go lát m̀h lát?'], ['No MSG, please.', '唔該，唔要味精。', 'M̀h gōi, m̀h yiu meih jīng.'], ['This is so delicious!', '呢個真係好好食！', 'Nī go jān hai hóu hóu sihk!'], ['Could we have the bill?', '唔該，埋單。', 'M̀h gōi, màai dāan.'], ['Can I pay by card?', '可唔可以用信用卡？', 'Hó m̀h hó yí yuhng seun yuhng kāat?'], ['Keep the change.', '唔使找。', 'M̀h sái jáau.'], ['Thank you, goodbye.', '唔該，拜拜。', 'M̀h gōi, báai báai.'] ], family: [
    ['It is lovely to meet you.', '好開心認識你。', 'Hóu hōi sām yihng sīk néih.'], ['Thank you for having me.', '多謝你哋招呼我。', 'Dō jeh néih deih jīu fū ngóh.'], ['The food is amazing.', '啲餸真係好好食。', 'Dī sung jān hai hóu hóu sihk.'], ['How was your week?', '你呢個禮拜點呀？', 'Néih nī go láih baai dím a?'], ['I have heard so much about you.', '我聽過好多關於你嘅嘢。', 'Ngóh tēng gwo hóu dō gwaan yū néih ge yéh.'], ['Can I help with anything?', '有冇嘢我幫到手？', 'Yáuh móuh yéh ngóh bōng dóu sáu?'], ['Your home is beautiful.', '你哋屋企好靚。', 'Néih deih ūk kēi hóu léhng.'], ['I am very happy to be here.', '我好開心嚟到呢度。', 'Ngóh hóu hōi sām lèih dóu nī dou.'], ['Please teach me Cantonese.', '請教我講廣東話。', 'Chéng gāau ngóh góng Gwóng dūng wá.'], ['I hope to see you again soon.', '希望好快再見到你。', 'Hēi mohng hóu faai joi gin dóu néih.'] ] }
};
let current = 'Japanese', reversed = false, listening = false, recognition, lastInput = '';
const $ = s => document.querySelector(s);
function currentList(category='dining'){ return category === 'family' ? data.Cantonese.family : data[current].phrases; }
function updateDirection(){ $('#directionLabel').textContent=reversed ? `${current} → English` : `English → ${current}`; $('#inputLabel').textContent=reversed ? current.toUpperCase() : 'SAY SOMETHING'; $('#outputLabel').textContent=reversed ? 'ENGLISH' : current.toUpperCase(); }
function updateLanguage(autoPlay = false){ const d=data[current]; $('#targetName').textContent=d.city === 'Japan' ? 'Japanese' : current; $('#targetFlag').textContent=d.flag; updateDirection(); $('#phraseTitle').textContent=current==='Cantonese'?'Dining in Hong Kong':`Dining in ${d.city}`; renderPhrases(); if(lastInput) { translate(lastInput, autoPlay); } else { setTranslation(...d.phrases[0]); if(autoPlay) speak(); } }
function renderPhrases(category='dining'){ const chips=$('#categoryChips'); chips.innerHTML=`<button class="chip active" data-category="dining">Dining essentials</button>${current==='Cantonese'?'<button class="chip" data-category="family">Meeting family</button>':''}`; chips.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{chips.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active'); renderList(b.dataset.category)}); renderList(category); }
function playPhrase(phrase){ reversed=false; updateDirection(); setTranslation(...phrase); speak(); }
function renderList(category){ const list=$('#phraseList'); list.innerHTML=currentList(category).slice(0,3).map((p,i)=>`<button class="phrase" data-index="${i}" data-category="${category}" aria-label="Play ${p[0]}"><span class="phrase-number">0${i+1}</span><span class="phrase-copy"><strong>${p[0]}</strong><span>${p[1]} · ${p[2]}</span></span><span class="play-mini">▶ <b>Play</b></span></button>`).join(''); list.querySelectorAll('.phrase').forEach(b=>b.onclick=()=>playPhrase(currentList(b.dataset.category)[b.dataset.index])); }
function setTranslation(english, foreign, pronunciation){ const input=reversed?foreign:english, output=reversed?english:foreign; $('#transcript').textContent=input; $('#transcript').classList.remove('empty'); $('#translation').textContent=output; $('#romanization').textContent=reversed?'English translation':pronunciation; }
function translate(text){ if(!text.trim()) return; const detectedForeign=/[\u3040-\u30ff\u3400-\u9fff\uff00-\uffef]/.test(text); if(detectedForeign!==reversed){ reversed=detectedForeign; updateDirection(); } const all=[...data[current].phrases,...(data[current].family||[])]; const match=reversed?all.find(p=>p[1].includes(text)||p[2].toLowerCase().includes(text.toLowerCase())):all.find(p=>p[0].toLowerCase().includes(text.toLowerCase())||text.toLowerCase().includes(p[0].toLowerCase())); if(match) setTranslation(...match); else { $('#transcript').textContent=text; $('#transcript').classList.remove('empty'); $('#translation').textContent=reversed?'I understand.':'了解しました'; $('#romanization').textContent=reversed?'English translation':'Ryōkai shimashita'; } }
async function speak(){ const text=$('#translation').textContent, language=reversed?'English':current; try { const response=await fetch('/api/speak',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,language})}); if(!response.ok) throw new Error('Voice unavailable'); const url=URL.createObjectURL(await response.blob()); const audio=new Audio(url); audio.onended=()=>URL.revokeObjectURL(url); await audio.play(); } catch { const u=new SpeechSynthesisUtterance(text); u.lang=reversed?'en-US':data[current].code; speechSynthesis.cancel(); speechSynthesis.speak(u); } }
function startListening(){ const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SpeechRecognition){ $('#micCaption').textContent='VOICE INPUT NEEDS CHROME OR SAFARI'; return; } recognition=new SpeechRecognition(); recognition.lang=reversed?data[current].code:'en-US'; recognition.interimResults=true; recognition.onresult=e=>{let t=Array.from(e.results).map(r=>r[0].transcript).join('');$('#transcript').textContent=t;$('#transcript').classList.remove('empty');if(e.results[e.results.length-1].isFinal) translate(t)}; recognition.onend=stopListening; recognition.start(); listening=true; $('#recordButton').classList.add('recording'); $('#micCaption').textContent='LISTENING… TAP TO STOP'; }
function stopListening(){ if(recognition)recognition.stop(); listening=false;$('#recordButton').classList.remove('recording');$('#micCaption').textContent='TAP TO SPEAK'; }
function selectLanguage(language){ current=language; document.querySelectorAll('.destination').forEach(d=>d.classList.toggle('selected',d.dataset.lang===language)); document.querySelectorAll('.quick-destination').forEach(d=>{const active=d.dataset.quickLang===language;d.classList.toggle('selected',active);d.querySelector('b').textContent=active?'Selected':'Select'}); updateLanguage(true); }
$('#recordButton').onclick=()=>listening?stopListening():startListening(); $('#speakTranslation').onclick=speak; $('#swapLanguages').onclick=()=>{reversed=!reversed;updateDirection()}; $('#clearTranscript').onclick=()=>{$('#transcript').textContent='Press the microphone and start speaking';$('#transcript').classList.add('empty')}; $('#typeButton').onclick=()=>$('#typeModal').classList.add('open'); $('#closeType').onclick=()=>$('#typeModal').classList.remove('open'); $('#translateTyped').onclick=()=>{translate($('#typeInput').value);$('#typeModal').classList.remove('open')}; $('#openLanguages').onclick=()=>{$('#languageSheet').classList.add('open');$('#sheetBackdrop').classList.add('open')}; $('#closeSheet').onclick=$('#sheetBackdrop').onclick=()=>{$('#languageSheet').classList.remove('open');$('#sheetBackdrop').classList.remove('open')}; document.querySelectorAll('.destination').forEach(x=>x.onclick=()=>{selectLanguage(x.dataset.lang);$('#closeSheet').click()}); document.querySelectorAll('.quick-destination').forEach(x=>x.onclick=()=>selectLanguage(x.dataset.quickLang)); $('#seeAll').onclick=()=>{document.querySelector('.phrase-section').scrollIntoView({behavior:'smooth'}); const category=document.querySelector('.chip.active').dataset.category; $('#phraseList').innerHTML=currentList(category).map((p,i)=>`<button class="phrase" data-index="${i}" data-category="${category}" aria-label="Play ${p[0]}"><span class="phrase-number">${String(i+1).padStart(2,'0')}</span><span class="phrase-copy"><strong>${p[0]}</strong><span>${p[1]} · ${p[2]}</span></span><span class="play-mini">▶ <b>Play</b></span></button>`).join('');document.querySelectorAll('.phrase').forEach(b=>b.onclick=()=>playPhrase(currentList(b.dataset.category)[b.dataset.index]))}; updateLanguage();


let playAfterRelease = false, receivedFinalResult = false;
function startListening(){ const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SpeechRecognition){ $('#micCaption').textContent='VOICE INPUT NEEDS CHROME OR SAFARI'; return; } recognition=new SpeechRecognition(); recognition.lang=reversed?data[current].code:'en-US'; recognition.interimResults=true; recognition.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join('');$('#transcript').textContent=t;$('#transcript').classList.remove('empty');if(e.results[e.results.length-1].isFinal){receivedFinalResult=true;translate(t)}}; recognition.onend=()=>{const shouldPlay=playAfterRelease&&receivedFinalResult;stopListening();playAfterRelease=false;if(shouldPlay)speak()}; recognition.start(); listening=true; $('#recordButton').classList.add('recording'); $('#micCaption').textContent='LISTENING… RELEASE TO TRANSLATE'; }
function stopListening(){ if(recognition)recognition.stop(); listening=false;$('#recordButton').classList.remove('recording');$('#micCaption').textContent='HOLD TO SPEAK'; }
const holdRecordButton=$('#recordButton'); holdRecordButton.onclick=null; holdRecordButton.onpointerdown=e=>{e.preventDefault();if(listening)return;playAfterRelease=true;receivedFinalResult=false;holdRecordButton.setPointerCapture?.(e.pointerId);startListening()}; holdRecordButton.onpointerup=holdRecordButton.onpointercancel=()=>{if(listening)stopListening()};
function renderList(category){ const list=$('#phraseList'); list.innerHTML=currentList(category).slice(0,3).map((p,i)=>'<button class="phrase" data-index="'+i+'" data-category="'+category+'" aria-label="Play '+p[0]+'"><span class="phrase-number">0'+(i+1)+'</span><span class="phrase-copy"><strong>'+p[0]+'</strong><span>'+p[1]+' · '+p[2]+'</span></span><span class="play-mini" aria-hidden="true">▶</span></button>').join(''); list.querySelectorAll('.phrase').forEach(b=>b.onclick=()=>playPhrase(currentList(b.dataset.category)[b.dataset.index])); }
$('#clearTranscript').onclick=()=>{$('#transcript').textContent='Hold the microphone and speak';$('#transcript').classList.add('empty')}; $('#speakTranslation').innerHTML='<span>▶</span>'; $('#speakTranslation').setAttribute('aria-label','Play translation'); $('#recordButton').setAttribute('aria-label','Hold to record'); $('#micCaption').textContent='HOLD TO SPEAK'; $('#seeAll').onclick=()=>{document.querySelector('.phrase-section').scrollIntoView({behavior:'smooth'}); const category=document.querySelector('.chip.active').dataset.category; $('#phraseList').innerHTML=currentList(category).map((p,i)=>'<button class="phrase" data-index="'+i+'" data-category="'+category+'" aria-label="Play '+p[0]+'"><span class="phrase-number">'+String(i+1).padStart(2,'0')+'</span><span class="phrase-copy"><strong>'+p[0]+'</strong><span>'+p[1]+' · '+p[2]+'</span></span><span class="play-mini" aria-hidden="true">▶</span></button>').join('');document.querySelectorAll('.phrase').forEach(b=>b.onclick=()=>playPhrase(currentList(b.dataset.category)[b.dataset.index]))}; renderPhrases();


let releasedHold = false;
function startListening(){ const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SpeechRecognition){ $('#micCaption').textContent='VOICE INPUT NEEDS CHROME OR SAFARI'; return; } recognition=new SpeechRecognition(); recognition.lang=reversed?data[current].code:'en-US'; recognition.interimResults=true; recognition.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join('');$('#transcript').textContent=t;$('#transcript').classList.remove('empty');if(e.results[e.results.length-1].isFinal){receivedFinalResult=true;translate(t)}}; recognition.onend=()=>{const shouldPlay=releasedHold&&receivedFinalResult;stopListening();releasedHold=false;receivedFinalResult=false;if(shouldPlay)speak()}; recognition.start(); listening=true; $('#recordButton').classList.add('recording'); $('#micCaption').textContent='LISTENING… RELEASE TO TRANSLATE'; }
function stopListening(){ if(recognition)recognition.stop(); listening=false;$('#recordButton').classList.remove('recording');$('#micCaption').textContent='HOLD TO SPEAK'; }
holdRecordButton.onpointerdown=e=>{e.preventDefault();if(listening)return;releasedHold=false;receivedFinalResult=false;holdRecordButton.setPointerCapture?.(e.pointerId);startListening()}; holdRecordButton.onpointerup=holdRecordButton.onpointercancel=()=>{releasedHold=true;if(listening)stopListening();else if(receivedFinalResult){releasedHold=false;receivedFinalResult=false;speak()}};


function translate(text){
  if(!text.trim()) return;
  const detectedForeign=/[\u3040-\u30ff\u3400-\u9fff\uff00-\uffef]/.test(text);
  if(detectedForeign!==reversed){ reversed=detectedForeign; updateDirection(); }
  const all=[...data[current].phrases,...(data[current].family||[])];
  const match=reversed
    ? all.find(p=>p[1].includes(text)||p[2].toLowerCase().includes(text.toLowerCase()))
    : all.find(p=>p[0].toLowerCase().includes(text.toLowerCase())||text.toLowerCase().includes(p[0].toLowerCase()));
  if(match){ setTranslation(...match); return; }
  $('#transcript').textContent=text;
  $('#transcript').classList.remove('empty');
  if(reversed){ $('#translation').textContent='I understand.'; $('#romanization').textContent='English translation'; return; }
  const fallback={
    Japanese:['了解しました。','Ryōkai shimashita.'],
    Mandarin:['我明白了。','Wǒ míngbai le.'],
    Cantonese:['我明白喇。','Ngóh mìhngbaahk laa.']
  }[current];
  $('#translation').textContent=fallback[0];
  $('#romanization').textContent=fallback[1];
}


let finalTranscript = '';
async function translate(text, autoPlay = false){
  if(!text.trim()) return false;
  lastInput = text;
  $('#transcript').textContent=text;
  $('#transcript').classList.remove('empty');
  $('#translation').textContent='Translating…';
  $('#romanization').textContent='';
  try {
    const response=await fetch('/api/translate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,selectedLanguage:current})});
    const result=await response.json();
    if(!response.ok) throw new Error(result.error||'Translation unavailable');
    reversed=result.direction==='to_english';
    updateDirection();
    $('#transcript').textContent=text;
    $('#translation').textContent=result.translation;
    $('#romanization').textContent=result.source_language+' → '+result.target_language;
    if(autoPlay) await speak();
    return true;
  } catch(error) {
    $('#translation').textContent='Translation unavailable.';
    $('#romanization').textContent='Check your connection and try again.';
    return false;
  }
}
function startListening(){ const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SpeechRecognition){ $('#micCaption').textContent='VOICE INPUT NEEDS CHROME OR SAFARI'; return; } recognition=new SpeechRecognition(); recognition.lang=reversed?data[current].code:'en-US'; recognition.interimResults=true; recognition.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join('');$('#transcript').textContent=t;$('#transcript').classList.remove('empty');if(e.results[e.results.length-1].isFinal){receivedFinalResult=true;finalTranscript=t}}; recognition.onend=()=>{const shouldPlay=releasedHold&&receivedFinalResult;stopListening();releasedHold=false;if(receivedFinalResult)translate(finalTranscript,shouldPlay);receivedFinalResult=false;finalTranscript=''}; recognition.start(); listening=true; $('#recordButton').classList.add('recording'); $('#micCaption').textContent='LISTENING… RELEASE TO TRANSLATE'; }
holdRecordButton.onpointerdown=e=>{e.preventDefault();if(listening)return;releasedHold=false;receivedFinalResult=false;finalTranscript='';holdRecordButton.setPointerCapture?.(e.pointerId);startListening()};
holdRecordButton.onpointerup=holdRecordButton.onpointercancel=()=>{releasedHold=true;if(listening)stopListening();else if(receivedFinalResult){receivedFinalResult=false;translate(finalTranscript,true);finalTranscript=''}};
