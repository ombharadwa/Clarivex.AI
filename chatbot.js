/* Clarivex.AI — next-level AI assistant client */
(function () {
  const history = [];
  const API = window.CLARIVEX_CHAT_API || '/api/chat';
  let controller = null;
  let lastUserPrompt = '';\n
  function loadProfessionalStyles() {
    if (document.getElementById('clarivex-professional-css')) return;
    const link = document.createElement('link'); link.id='clarivex-professional-css'; link.rel='stylesheet'; link.href='/professional.css'; document.head.appendChild(link);
  }
  function escapeHtml(text) { return String(text).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c])); }
  function renderMarkdown(text) {
    let s=escapeHtml(text);\n    s=s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/^### (.*)$/gm,'<h4>$1</h4>').replace(/^## (.*)$/gm,'<h3>$1</h3>').replace(/^- (.*)$/gm,'<li>$1</li>').replace(/\n/g,'<br>');
    return s;
  }
  function addMessage(text,type) {
    const box=document.getElementById('chat-msgs'); if(!box)return;
    const el=document.createElement('div'); el.className='cmsg '+type; el.dataset.raw=text;
    if(type==='bot'){el.innerHTML=renderMarkdown(text); addActions(el,text);} else el.textContent=text;\n    box.appendChild(el); box.scrollTop=box.scrollHeight;
  }
  function addActions(el,text) {
    const a=document.createElement('div'); a.className='cx-msg-actions';\n    a.innerHTML='<button type="button">Copy</button><button type="button">Speak</button>';\n    a.children[0].onclick=async()=>{try{await navigator.clipboard.writeText(text);a.children[0].textContent='Copied';setTimeout(()=>a.children[0].textContent='Copy',1200)}catch{}};\n    a.children[1].onclick=()=>speak(text); el.appendChild(a);
  }
  function showTyping(){if(typeof window.cTyping==='function')return window.cTyping(); addMessage('Thinking…','bot typing');}
  function hideTyping(){if(typeof window.cHideTyping==='function')return window.cHideTyping();const t=document.querySelector('.cmsg.typing');if(t)t.remove();}
  async function ask(message){
    const text=String(message||'').trim(); if(!text)return '';\n    history.push({role:'user',content:text}); controller=new AbortController();
    const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history}),signal:controller.signal});
    const data=await response.json().catch(()=>({})); if(!response.ok)throw new Error(data.error||'Chat request failed');
    const reply=data.reply||'I could not generate a response. Please try again.'; history.push({role:'assistant',content:reply}); return reply;
  }
  async function sendChat(){
    const input=document.getElementById('chat-inp'); if(!input)return; const text=input.value.trim(); if(!text)return; lastUserPrompt=text; input.value='';
    const suggestions=document.getElementById('chat-sugs'); if(suggestions)suggestions.style.display='none'; addMessage(text,'user'); showTyping();
    try{const reply=await ask(text);hideTyping();addMessage(reply,'bot');}catch(e){hideTyping();if(e.name!=='AbortError')addMessage('I’m having trouble connecting right now. Please try again in a moment.','bot');}finally{controller=null;}
  }
  function stop(){if(controller)controller.abort();hideTyping();controller=null;}
  function reset(){history.splice(0);lastUserPrompt='';const box=document.getElementById('chat-msgs');if(box)box.innerHTML='';const s=document.getElementById('chat-sugs');if(s)s.style.display='';}
  function speak(text){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));}
  function startVoice(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){addMessage('Voice input is not supported by this browser. Try Chrome or Edge.','bot');return;}
    const r=new SR();r.lang='en-IN';r.interimResults=false;r.maxAlternatives=1;r.onresult=e=>{const i=document.getElementById('chat-inp');if(i){i.value=e.results[0][0].transcript;i.focus();}};r.start();
  }
  function installControls(){
    const row=document.querySelector('.chat-input-row');if(!row||row.dataset.cxEnhanced)return;row.dataset.cxEnhanced='1';
    const style=document.createElement('style');style.textContent='.cx-msg-actions{display:flex;gap:6px;margin-top:8px;opacity:.75}.cx-msg-actions button{border:0;background:transparent;color:#9aa6bf;font-size:10px;cursor:pointer;padding:2px 4px}.cx-msg-actions button:hover{color:#fff}.chat-input-row{align-items:center}.cx-tool{width:30px;height:30px;border:0;border-radius:7px;background:rgba(124,92,255,.08);color:#a48bff;cursor:pointer}.cx-tool:hover{background:rgba(124,92,255,.18)}.cmsg.bot code{padding:2px 5px;border-radius:4px;background:rgba(0,0,0,.25);font-family:monospace}.cmsg.bot h3,.cmsg.bot h4{margin:4px 0}.cmsg.bot li{margin-left:18px}';document.head.appendChild(style);
    const voice=document.createElement('button');voice.className='cx-tool';voice.type='button';voice.title='Voice input';voice.textContent='🎙';voice.onclick=startVoice;
    const clear=document.createElement('button');clear.className='cx-tool';clear.type='button';clear.title='New conversation';clear.textContent='↻';clear.onclick=reset;row.insertBefore(voice,row.firstChild);row.insertBefore(clear,row.firstChild);
  }\n  loadProfessionalStyles(); window.ClarivexChat={ask,sendChat,reset,stop,speak,startVoice}; window.sendChat=sendChat; window.addEventListener('load',installControls); setTimeout(installControls,500);
})();\n