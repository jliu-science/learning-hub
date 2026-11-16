/* ===== Daily flashcards: 5 cards a day (biology 1, chemistry 1-2, physics 2-3), for the projector =====
   Modes: recall (say or write, then reveal), gaps, match, sort, gut (label the diagram).
   Cards marked "Not yet" come back first on the next day. */
(function(){
  const E = window.Engine, ALL = (window.FC.cards||[]).slice();
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const SUBJ = { bio:{name:'Biology',c:'#0f9d76',soft:'#e3f4ee'}, chem:{name:'Chemistry',c:'#ea580c',soft:'#fdeee3'}, phys:{name:'Physics',c:'#2563eb',soft:'#e6eefd'} };
  const MODE = { recall:'Say it or write it', gaps:'Fill the gaps', match:'Match the words', sort:'Sort them', gut:'Label the diagram', label:'Label the diagram' };
  const BIG_TIME = 5*60;

  /* ---------- the labelled digestive system (same picture and points as the Digestion page) ---------- */
  const GUT = [ ['mouth',120,155,155],['gullet',182,355,355],['stomach',238,458,440],['small intestine',175,640,640],['large intestine',274,580,540],['rectum',160,752,740],['anus',163,792,810] ];
  ALL.push({ id:'b-gut-label', s:'bio', code:'8.4.4', topic:'Digestive system', mode:'gut', q:'Drag each part of the digestive system into its box.',
    n:'Order: <b>mouth → gullet → stomach → small intestine → large intestine → rectum → anus</b>.' });

  /* ---------- storage ---------- */
  const KEY='dora-flashcards-v1';
  const load=()=>{ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } };
  const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} };
  const S = Object.assign({seen:{},plans:{}}, load());
  const pad=n=>String(n).padStart(2,'0');
  const now=new Date(), TODAY=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

  /* ---------- choose today's cards ---------- */
  function lessonOrder(list){ // round robin across lessons, so new cards move through every lesson
    const by={}; list.forEach(c=>(by[c.code]=by[c.code]||[]).push(c)); const keys=Object.keys(by).sort(); const out=[];
    for(let i=0;out.length<list.length;i++) keys.forEach(k=>{ if(by[k][i]) out.push(by[k][i]); }); return out; }
  function pick(subj,k,used){
    const deck=lessonOrder(ALL.filter(c=>c.s===subj)), seen=S.seen;
    const notYet=deck.filter(c=>seen[c.id]&&seen[c.id].ok===false).sort((a,b)=>seen[a.id].t-seen[b.id].t);
    const fresh=deck.filter(c=>!seen[c.id]);
    const old=deck.filter(c=>seen[c.id]&&seen[c.id].ok!==false).sort((a,b)=>seen[a.id].t-seen[b.id].t);
    const order=[...notYet,...fresh,...old], out=[];
    const ok=c=>!used.has(c.id)&&!out.some(o=>o.code===c.code)&&!out.some(o=>o.mode===c.mode&&c.mode!=='recall');
    for(const c of order){ if(out.length>=k) break; if(ok(c)) out.push(c); }
    for(const c of order){ if(out.length>=k) break; if(!used.has(c.id)&&!out.includes(c)) out.push(c); }
    out.forEach(c=>used.add(c.id)); return out;
  }
  function makePlan(skip){
    const n=Object.keys(S.plans).length, chem=n%2===0?2:1, used=new Set(skip||[]);
    const ph=pick('phys',4-chem,used), ch=pick('chem',chem,used), bi=pick('bio',1,used);
    const seq=[ph[0],ch[0],bi[0],ph[1],ch[1],ph[2]].filter(Boolean);
    for(let i=1;i<seq.length;i++) if(seq[i].mode===seq[i-1].mode){ const j=seq.findIndex((c,x)=>x>i&&c.mode!==seq[i].mode&&c.mode!==seq[i-1].mode); if(j>0) [seq[i],seq[j]]=[seq[j],seq[i]]; }
    return seq.map(c=>c.id);
  }
  if(!S.plans[TODAY]||!S.plans[TODAY].every(id=>ALL.some(c=>c.id===id))){ S.plans[TODAY]=makePlan(); save(); }
  let cards=S.plans[TODAY].map(id=>ALL.find(c=>c.id===id));
  let at=-1, results={}, timer=null, left=BIG_TIME;

  /* ---------- shell ---------- */
  const root=$('#fc');
  const dayNo=Object.keys(S.plans).sort().indexOf(TODAY)+1;
  const dateTxt=now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  function frame(){
    root.innerHTML=`<div class="fc-head">
        <div class="fc-day"><span class="fc-eyebrow">Day ${dayNo}</span><b>${dateTxt}</b></div>
        <div class="fc-dots">${cards.map((c,i)=>`<button class="fc-dot" data-i="${i}" style="--c:${SUBJ[c.s].c}" aria-label="Card ${i+1}">${i+1}</button>`).join('')}</div>
        <div class="fc-tools"><span class="fc-time" id="fctime">5:00</span><button class="fc-icon" id="fcfull" title="Full screen" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button></div>
      </div><div class="fc-stage" id="fcstage"></div>`;
    root.querySelectorAll('.fc-dot').forEach(d=>d.onclick=()=>{ if(at>=0) go(+d.dataset.i); });
    $('#fcfull').onclick=()=>{ const d=document; if(d.fullscreenElement) d.exitFullscreen(); else d.documentElement.requestFullscreen&&d.documentElement.requestFullscreen(); };
  }
  function tick(){ left--; const t=$('#fctime'); if(!t) return; const m=Math.max(0,left);
    t.textContent=`${Math.floor(m/60)}:${pad(m%60)}`; t.classList.toggle('warn',left<=60&&left>0); t.classList.toggle('over',left<=0); }
  function dots(){ root.querySelectorAll('.fc-dot').forEach((d,i)=>{ d.classList.toggle('on',i===at); d.classList.toggle('ok',results[cards[i].id]===true); d.classList.toggle('no',results[cards[i].id]===false); }); }

  /* ---------- start screen ---------- */
  /* ---------- card backs: redrawn from Dora's own hand-made cards (block creature, or squiggles), with coloured dots ---------- */
  function rnd(seed){ let x=seed*9301+49297; return ()=>((x=(x*9301+49297)%233280)/233280); }
  const INK='#1b1a17', DOTC=['#f2c230','#e8457a','#5b3fa8','#1f9aa8','#2e9a4e','#e2372f'];
  function dotsArt(r){ let o=''; for(let k=0;k<26;k++){ let x,y; do{ x=14+r()*272; y=12+r()*166; }while(x>72&&x<228&&y>24&&y<168);
      o+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.6" ry="3.6" transform="rotate(${(r()*80-40).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${DOTC[Math.floor(r()*6)]}"/>`; } return o; }
  const S3=`stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"`;
  function creature(t){ return `<g transform="translate(150 95) rotate(${t}) scale(1.3) translate(-55 -48)">
      <rect x="-12" y="10" width="40" height="9" fill="#e2372f" ${S3} transform="rotate(38 8 14)"/>
      <rect x="2" y="74" width="34" height="9" fill="#e2372f" ${S3} transform="rotate(-35 20 78)"/>
      <rect x="34" y="86" width="38" height="9" fill="#ef4f86" ${S3} transform="rotate(-30 52 90)"/>
      <rect x="0" y="30" width="10" height="11" fill="#e2372f" ${S3}/><rect x="0" y="52" width="10" height="11" fill="#e2372f" ${S3}/>
      <rect x="68" y="-6" width="18" height="12" fill="#f2c230" ${S3} transform="rotate(-25 77 0)"/>
      <rect x="9" y="22" width="44" height="46" fill="#2f8a43" ${S3}/>
      <rect x="54" y="2" width="44" height="42" fill="#4b2fa0" ${S3} transform="rotate(-6 76 23)"/>
      <rect x="40" y="40" width="44" height="44" fill="#2394b4" ${S3} transform="rotate(6 62 62)"/>
      <circle cx="31" cy="46" r="2.4" fill="${INK}"/><circle cx="66" cy="27" r="2.4" fill="${INK}"/><path d="M78 24q3-4 6 0t6 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="56" cy="62" r="2.2" fill="${INK}"/><path d="M63 62h9" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>`; }
  function squiggles(){ return `<path d="M200 30c25-10 40 0 32 20s-28 10-14-8 34 8 20 40-22 50-26 80" fill="none" stroke="#e2372f" stroke-width="7" stroke-linecap="round"/>
      <path d="M40 132c10-12 28-8 22 6s-18 4-8-6 26 2 22 18 22 12 50 22" fill="none" stroke="#2e9a4e" stroke-width="6" stroke-linecap="round"/>
      <path d="M118 88c8-14 34-10 44-24s16-30 32-26 10 26-6 34-22 14-50 22-26 2-20-6z" fill="#f2c230" ${S3}/>
      <ellipse cx="118" cy="118" rx="27" ry="8" transform="rotate(20 118 118)" fill="#1f9aa8" ${S3}/>
      <circle cx="100" cy="94" r="5" fill="#2b2160"/><circle cx="84" cy="104" r="4.5" fill="#e8457a" ${S3}/>
      <g transform="translate(44 18)"><path d="M0 22a16 16 0 0 1 32 0z" fill="#fff" ${S3}/><path d="M4 22a12 12 0 0 1 12-12v12z" fill="#e8457a"/><circle cx="28" cy="4" r="2" fill="${INK}"/><path d="M34 0l2 8M30 14l8 4" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></g>
      <g transform="translate(250 150) rotate(-20)"><path d="M0 0a16 16 0 0 1 0 30z" fill="#e2372f" ${S3}/><path d="M0 0a16 16 0 0 0 0 30" fill="#fff" ${S3}/><path d="M22 -2l4 8 4-8M18 18q6 6 0 12" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></g>`; }
  function cardArt(kind,seed){ return `<svg viewBox="0 0 300 190" aria-hidden="true"><rect width="300" height="190" fill="#fffefa"/>${dotsArt(rnd(seed))}${kind==='sq'?squiggles():creature(-18+(seed%4)*6)}</svg>`; }

  const fly=m=>window.FCCreature&&window.FCCreature.mode(m);
  function intro(){
    at=-1; dots(); fly('roam'); const st=$('#fcstage'), sq=(dayNo*3)%5;
    st.innerHTML=`<section class="fc-card fc-intro">
      <h1>Five cards for today</h1>
      <p class="fc-lead">Pick a card. Think first, then <b>say</b> or <b>write</b> your answer.</p>
      <div class="fc-deck">${cards.map((c,i)=>{ const r=results[c.id]; return `<button class="fc-pc" data-i="${i}" style="--c:${SUBJ[c.s].c};--rot:${[-3,2,-1.5,3,-2][i]}deg" aria-label="Card ${i+1}: ${SUBJ[c.s].name}, ${esc(c.topic)}">
        ${cardArt(i===sq?'sq':'cr',dayNo*7+i+1)}<span class="fc-pcn">${i+1}</span><span class="fc-pcs">${SUBJ[c.s].name}</span>${r!==undefined?`<span class="fc-pcr ${r?'ok':'no'}">${r?'Got it':'Not yet'}</span>`:''}</button>`; }).join('')}</div>
      <div class="fc-row"><button class="btn ghost" id="fcnew">Different cards</button></div>
    </section>`;
    st.querySelectorAll('.fc-pc').forEach(b=>b.onclick=()=>{ if(!timer) timer=setInterval(tick,1000); go(+b.dataset.i); });
    $('#fcnew').onclick=()=>{ const old=S.plans[TODAY]; delete S.plans[TODAY]; S.plans[TODAY]=makePlan(old); save(); cards=S.plans[TODAY].map(id=>ALL.find(c=>c.id===id)); results={}; frame(); intro(); };
  }
  function start(){ if(!timer) timer=setInterval(tick,1000); go(0); }

  /* ---------- one card ---------- */
  function go(i){
    stopMic(); at=i; dots(); fly('perch'); const c=cards[i], sj=SUBJ[c.s], st=$('#fcstage');
    st.innerHTML=`<section class="fc-card fc-${c.mode}${c.img?' has-img':''}" style="--c:${sj.c};--cs:${sj.soft}">
      <div class="fc-top"><span class="fc-tag">${sj.name}</span><span class="fc-lt">${c.code} ${esc(c.topic)}</span><span class="fc-md">${MODE[c.mode]}</span><span class="fc-n">${i+1} / ${cards.length}</span></div>
      <h2 class="fc-q">${c.q}</h2>
      <div class="fc-body" id="fcbody"></div>
      <div class="fc-foot" id="fcfoot"></div>${window.FCChars?FCChars.strip(i):''}
    </section>`;
    ({recall,gaps,match,sort,gut,label})[c.mode](c,$('#fcbody'));
  }
  function foot(c,revealed,auto,msg){
    const f=$('#fcfoot'); const r=results[c.id]; if(revealed&&auto===true&&window.FCChars) FCChars.win();
    if(!revealed){ f.innerHTML=`<button class="btn fc-go" id="fcshow">Show answer <span class="fc-k">Space</span></button>`; $('#fcshow').onclick=()=>reveal(); return; }
    f.innerHTML=`<span class="fc-ask">${msg?msg:auto===true?'All correct first time.':auto===false?'Some mistakes on the way.':'How did you do?'}</span>
      <button class="btn ghost fc-rate${r===false?' sel':''}" data-v="0">Not yet <span class="fc-k">N</span></button>
      <button class="btn ghost fc-rate${r===true?' sel':''}" data-v="1">Got it <span class="fc-k">G</span></button>
      <span class="spacer"></span><button class="btn fc-go" id="fcnext">${at<cards.length-1?'Next card':'Finish'} <span class="fc-k">→</span></button>`;
    if(auto!==undefined&&r===undefined) rate(c,auto,true);
    f.querySelectorAll('.fc-rate').forEach(b=>b.onclick=()=>rate(c,b.dataset.v==='1'));
    $('#fcnext').onclick=next;
  }
  function rate(c,ok,quiet){ if(ok&&results[c.id]!==true) setTimeout(()=>fly('cheer'),250); results[c.id]=ok; S.seen[c.id]={ok,t:Date.now()}; save(); dots();
    document.querySelectorAll('.fc-rate').forEach(b=>b.classList.toggle('sel',(b.dataset.v==='1')===ok)); }
  let reveal=()=>{};
  function next(){ const c=cards[at]; if(results[c.id]===undefined) rate(c,true); if(at<cards.length-1) go(at+1); else finish(); }

  /* ---------- marking a written or spoken answer: a point counts if one of its stems is there,
     at the start of a word, not straight after "not / no / n't", allowing one spelling slip in longer words ---------- */
  const TICK='<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  const CROSS='<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const NEG=/(\bnot|n't|\bno|\bnever)\s+(\w+\s+)?$/;
  const lev=(a,b)=>{ const D=[...Array(a.length+1)].map((_,i)=>[i,...Array(b.length).fill(0)]); for(let j=1;j<=b.length;j++) D[0][j]=j;
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++){ D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1]) D[i][j]=Math.min(D[i][j],D[i-2][j-2]+1); } return D[a.length][b.length]; };
  function find(low,stem){ stem=stem.toLowerCase().trim(); if(!stem) return null; const negOK=/^(not|no|non|un)\b/.test(stem);
    const ok=i=>(i===0||!/[a-z]/.test(low[i-1]))&&(negOK||!NEG.test(low.slice(Math.max(0,i-24),i)));
    for(let i=low.indexOf(stem);i>=0;i=low.indexOf(stem,i+1)) if(ok(i)) return [i,i+stem.length];
    if(stem.length>=5&&/^[a-z]+$/.test(stem)){ const re=/[a-z]+/g; let m; while((m=re.exec(low))){ const w=m[0]; if(w.length>=stem.length-1&&lev(w.slice(0,stem.length),stem)<=1&&ok(m.index)) return [m.index,m.index+Math.min(w.length,stem.length)]; } }
    return null; }
  function marked(txt,spans){ spans=spans.sort((x,y)=>x[0]-y[0]); let out='',at=0; spans.forEach(([a,b])=>{ if(a<at) return; while(b<txt.length&&/[a-z]/i.test(txt[b])) b++; out+=esc(txt.slice(at,a))+'<mark>'+esc(txt.slice(a,b))+'</mark>'; at=b; }); return out+esc(txt.slice(at)); }

  /* ---------- recall: say it / write it, then reveal ---------- */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition; let rec=null;
  function stopMic(){ if(rec){ try{ rec.stop(); }catch(e){} rec=null; } }
  function recall(c,el){
    el.innerHTML=`${c.img?`<figure class="fc-img"><img src="${c.img}" alt=""></figure>`:''}
      <div class="fc-say">
        <div class="fc-input"><textarea id="fctext" placeholder="Write it here, or press Speak and say it."></textarea><div class="fc-interim" id="fcint"></div>
          ${SR?`<button class="fc-mic" id="fcmic" aria-label="Speak"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg><span>Speak</span></button>`:''}</div>
        <div class="fc-ans" id="fcans" hidden></div>
      </div>`;
    const ta=$('#fctext');
    if(SR) $('#fcmic').onclick=()=>{ const b=$('#fcmic'); if(rec){ stopMic(); return; }
      rec=new SR(); rec.lang='en-GB'; rec.continuous=true; rec.interimResults=true; const base=ta.value?ta.value.trim()+' ':''; let fin='';
      rec.onresult=e=>{ let int=''; for(let k=e.resultIndex;k<e.results.length;k++){ const t=e.results[k][0].transcript; if(e.results[k].isFinal) fin+=t.trim()+' '; else int+=t; } ta.value=base+fin; $('#fcint').textContent=int; };
      rec.onerror=e=>{ $('#fcint').textContent=e.error==='not-allowed'?'The microphone is blocked in this browser.':'Could not hear that. Try again.'; };
      rec.onend=()=>{ rec=null; b.classList.remove('on'); b.querySelector('span').textContent='Speak'; $('#fcint').textContent=''; };
      rec.start(); b.classList.add('on'); b.querySelector('span').textContent='Stop'; };
    const pts=c.pts||(c.keys||[]).map(k=>({t:k[0],k}));
    const btn=()=>{ const b=$('#fcshow'); if(b) b.firstChild.textContent=ta.value.trim()&&pts.length?'Submit ':'Show answer '; };
    ta.addEventListener('input',btn);
    let tries=0;
    const score=said=>{ const low=said.toLowerCase(), spans=[]; const hit=pts.map(p=>{ const m=p.k.map(w=>find(low,w)).find(Boolean); if(m) spans.push(m); return !!m; }); return {hit,spans,n:hit.filter(Boolean).length}; };
    // half right: a character gives a hint for one missing idea, and she tries once more before the answer is shown
    const hintStep=r=>{ tries++; const a=$('#fcans'), miss=pts.filter((p,k)=>!r.hit[k]), p=miss[0];
      const tip=p.h||'One more idea is still missing. Read the question again: what else does it ask?';
      a.innerHTML=`<div class="fc-mark"><div class="fc-score"><b>${r.n} / ${pts.length}</b> key ideas so far</div><ul>${pts.map((q,k)=>r.hit[k]?`<li class="y">${TICK}${esc(q.t)}</li>`:`<li class="n">${CROSS}One more idea&hellip;</li>`).join('')}</ul></div>
        ${window.FCChars?FCChars.coach(tip):`<p class="fc-note">${tip}</p>`}`; a.hidden=false;
      $('#fcfoot').innerHTML=`<button class="btn fc-go" id="fcshow">Submit again <span class="fc-k">Space</span></button><button class="btn ghost" id="fcgive">Show answer</button><span class="fc-ask">Add to your answer, then submit again.</span>`;
      $('#fcshow').onclick=()=>reveal(); $('#fcgive').onclick=()=>reveal(true); ta.focus(); };
    reveal=(give)=>{ stopMic(); const a=$('#fcans'), said=ta.value.trim(); let res='', auto, r=null, coach='';
      if(said&&pts.length){ r=score(said); if(!give&&tries===0&&r.n>0&&r.n<pts.length) return hintStep(r); }
      el.closest('.fc-card').classList.add('shown'); if(!said) $('.fc-input',el).remove();
      if(r){ const {hit,spans,n}=r; auto=n===pts.length;
        ta.replaceWith(Object.assign(document.createElement('div'),{className:'fc-said',innerHTML:`<span class="fc-albl">Your answer</span><div>${marked(said,spans)}</div>`}));
        res=`<div class="fc-mark"><div class="fc-score ${auto?'ok':''}"><b>${n} / ${pts.length}</b> ${auto?'All the key ideas. Well done.':'key ideas'}</div><ul>${pts.map((p,k)=>`<li class="${hit[k]?'y':'n'}">${hit[k]?TICK:CROSS}${esc(p.t)}</li>`).join('')}</ul></div>`;
        if(!auto&&n>0&&window.FCChars) coach=FCChars.coach('Good try. Read the answer and spot the idea you missed.'); }
      a.innerHTML=`${res}${coach}<span class="fc-albl">Correct answer</span><div class="fc-a">${c.a}</div>${c.n?`<p class="fc-note">${c.n}</p>`:''}`; a.hidden=false;
      if(r&&r.n===0&&window.FCChars) FCChars.lose();
      const m=$('#fcmic'); if(m) m.remove(); foot(c,true,auto,auto===undefined?undefined:auto?'All key ideas found.':'Some key ideas missing.'); };
    foot(c,false); btn();
  }

  /* ---------- drag helpers ---------- */
  function wrong(target,chip){ if(window.FCChars) FCChars.lose(); chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake');
    target.classList.remove('fc-bad'); void target.getBoundingClientRect(); target.classList.add('fc-bad'); setTimeout(()=>target.classList.remove('fc-bad'),700); }
  function pool(words){ return `<div class="fc-pool" id="fcpool"><span class="fc-hint"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5-2.7L4 14.5a1.6 1.6 0 0 1 2.6-1.8L9 15"/></svg>Drag</span>${E.shuffle(words.map((w,i)=>({w,i}))).map(o=>`<span class="chip fc-chip" data-w="${esc(o.w)}">${o.w}</span>`).join('')}</div>`; }
  function finishDrag(c,miss,fillAll){ reveal=()=>{ fillAll(); foot(c,true,false); }; return ()=>{ reveal=()=>{}; foot(c,true,miss()===0); }; }
  function cueFirst(target){ const ch=$('#fcpool .fc-chip'); if(!ch||!target) return; ch.classList.add('fc-wiggle'); target.classList.add('fc-pulse');
    $('#fcpool').addEventListener('pointerdown',()=>{ document.querySelectorAll('.fc-wiggle,.fc-pulse').forEach(x=>x.classList.remove('fc-wiggle','fc-pulse')); },{once:true}); }

  /* ---------- fill the gaps ---------- */
  function gaps(c,el){
    const ans=[]; const html=c.text.replace(/\{([^}]+)\}/g,(m,w)=>{ ans.push(w); return `<span class="fc-gap" data-w="${esc(w)}"><i>${'&nbsp;'.repeat(6)}</i></span>`; });
    el.innerHTML=`<p class="fc-sent">${html}</p>${pool(ans.concat(c.extra||[]))}`;
    let left=ans.length, miss=0;
    const put=(g,ch)=>{ g.classList.add('done'); g.innerHTML=`<b>${g.dataset.w}</b>`; if(ch){ ch.classList.add('ok'); ch.remove(); } };
    const done=finishDrag(c,()=>miss,()=>el.querySelectorAll('.fc-gap:not(.done)').forEach(g=>{ put(g,[...el.querySelectorAll('.fc-chip')].find(x=>x.dataset.w===g.dataset.w)); }));
    el.querySelectorAll('.fc-chip').forEach(ch=>E.drag(ch,{targets:'.fc-gap:not(.done)',onDrop:(chip,g)=>{
      if(g.dataset.w===chip.dataset.w){ put(g,chip); if(--left===0) done(); return true; } miss++; wrong(g,chip); return false; }}));
    cueFirst($('.fc-gap')); foot(c,false);
  }

  /* ---------- match key words to meanings ---------- */
  function match(c,el){
    const rows=E.shuffle(c.pairs.map((p,i)=>({p,i})));
    el.innerHTML=`<div class="fc-rows">${rows.map(o=>`<div class="fc-mrow" data-w="${esc(o.p[0])}"><span class="fc-drop"></span><span class="fc-def">${o.p[1]}</span></div>`).join('')}</div>${pool(c.pairs.map(p=>p[0]))}`;
    let left=c.pairs.length, miss=0;
    const put=(r,ch)=>{ r.classList.add('done'); r.querySelector('.fc-drop').innerHTML=`<b>${r.dataset.w}</b>`; if(ch) ch.remove(); };
    const done=finishDrag(c,()=>miss,()=>el.querySelectorAll('.fc-mrow:not(.done)').forEach(r=>put(r,[...el.querySelectorAll('.fc-chip')].find(x=>x.dataset.w===r.dataset.w))));
    el.querySelectorAll('.fc-chip').forEach(ch=>E.drag(ch,{targets:'.fc-mrow:not(.done)',onDrop:(chip,r)=>{
      if(r.dataset.w===chip.dataset.w){ put(r,chip); if(--left===0) done(); return true; } miss++; wrong(r,chip); return false; }}));
    cueFirst($('.fc-mrow .fc-drop')); foot(c,false);
  }

  /* ---------- sort into two boxes ---------- */
  function sort(c,el){
    el.innerHTML=`<div class="fc-bins">${c.bins.map((b,i)=>`<div class="fc-bin" data-b="${i}"><h3>${b}</h3><div class="fc-in"></div></div>`).join('')}</div>${pool(c.items.map(x=>x[0]))}`;
    const bin=w=>c.items.find(x=>x[0]===w)[1]; let left=c.items.length, miss=0;
    const put=(b,ch)=>{ const s=document.createElement('span'); s.className='fc-put'; s.textContent=ch.dataset.w; b.querySelector('.fc-in').appendChild(s); ch.remove(); };
    const done=finishDrag(c,()=>miss,()=>el.querySelectorAll('.fc-chip').forEach(ch=>put(el.querySelector(`.fc-bin[data-b="${bin(ch.dataset.w)}"]`),ch)));
    el.querySelectorAll('.fc-chip').forEach(ch=>E.drag(ch,{targets:'.fc-bin',onDrop:(chip,b)=>{
      if(+b.dataset.b===bin(chip.dataset.w)){ put(b,chip); if(--left===0) done(); return true; } miss++; wrong(b,chip); return false; }}));
    cueFirst($('.fc-bin')); foot(c,false);
  }

  /* ---------- label a drawn diagram (energy level diagrams) ---------- */
  function energyDiagram(kind){ const exo=kind==='exo', yR=exo?150:300, yP=exo?300:150, ax='#1d1b16';
    return `<defs><marker id="fcar" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${ax}"/></marker>
        <marker id="fcar2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--c)"/></marker></defs>
      <path d="M160 390V30" stroke="${ax}" stroke-width="3" marker-end="url(#fcar)"/><path d="M160 390H690" stroke="${ax}" stroke-width="3" marker-end="url(#fcar)"/>
      <path d="M180 ${yR}H330" stroke="${ax}" stroke-width="6"/><path d="M480 ${yP}H640" stroke="${ax}" stroke-width="6"/>
      <path d="M330 ${yR}H410" stroke="${ax}" stroke-width="2" stroke-dasharray="7 6"/><path d="M410 ${yP}H480" stroke="${ax}" stroke-width="2" stroke-dasharray="7 6"/>
      <path d="M410 ${yR}V${yP+(exo?-8:8)}" stroke="var(--c)" stroke-width="5" marker-end="url(#fcar2)"/>`; }
  function label(c,el){
    const pic=c.diagram?energyDiagram(c.diagram):'';
    const slots=c.slots.map(([w,x,y,sw,sh])=>`<g class="fc-slot" data-w="${esc(w)}" transform="translate(${x} ${y})"><rect width="${sw}" height="${sh}" rx="3"/><text x="${sw/2}" y="${sh/2+9}" text-anchor="middle"></text></g>`).join('');
    el.innerHTML=`<svg class="fc-labsvg" viewBox="0 0 700 460" role="img" aria-label="Diagram to label">${pic}${slots}</svg>${pool(c.slots.map(s=>s[0]).concat(c.extra||[]))}`;
    let left=c.slots.length, miss=0;
    const put=(s,ch)=>{ s.classList.add('done'); s.querySelector('text').textContent=s.dataset.w; if(ch) ch.remove(); };
    const done=finishDrag(c,()=>miss,()=>{ el.querySelectorAll('.fc-slot:not(.done)').forEach(s=>put(s,[...el.querySelectorAll('.fc-chip')].find(x=>x.dataset.w===s.dataset.w))); note(); });
    const note=()=>{ if(c.n&&!$('.fc-labnote',el)) $('#fcpool',el).insertAdjacentHTML('beforeend',`<p class="fc-note fc-labnote">${c.n}</p>`); };
    el.querySelectorAll('.fc-chip').forEach(ch=>E.drag(ch,{targets:'.fc-slot:not(.done)',onDrop:(chip,s)=>{
      if(s.dataset.w===chip.dataset.w){ put(s,chip); if(--left===0){ note(); done(); } return true; } miss++; wrong(s,chip); return false; }}));
    cueFirst($('.fc-slot',el)); foot(c,false);
  }

  /* ---------- label the digestive system ---------- */
  function gut(c,el){
    const lines=GUT.map(([,x,y,ly])=>`<path d="M${x+8} ${y} L404 ${ly}" stroke="#222" stroke-width="1.6" fill="none"/>`).join('');
    const marks=GUT.map(([,x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="#222" stroke-width="2"/>`).join('');
    const slots=GUT.map(([w,,,ly])=>`<g class="fc-slot" data-w="${w}" transform="translate(410 ${ly-24})"><rect width="250" height="48" rx="3"/><text x="16" y="32"></text></g>`).join('');
    el.innerHTML=`<svg class="fc-gutsvg" viewBox="0 0 670 852" role="img" aria-label="Diagram of the digestive system"><image href="../biology/img/digestive-system.svg" width="390" height="847"/>${lines}${marks}${slots}</svg>${pool(GUT.map(g=>g[0]))}`;
    let left=GUT.length, miss=0;
    const put=(s,ch)=>{ s.classList.add('done'); s.querySelector('text').textContent=s.dataset.w; if(ch) ch.remove(); };
    const done=finishDrag(c,()=>miss,()=>el.querySelectorAll('.fc-slot:not(.done)').forEach(s=>put(s,[...el.querySelectorAll('.fc-chip')].find(x=>x.dataset.w===s.dataset.w))));
    el.querySelectorAll('.fc-chip').forEach(ch=>E.drag(ch,{targets:'.fc-slot:not(.done)',onDrop:(chip,s)=>{
      if(s.dataset.w===chip.dataset.w){ put(s,chip); if(--left===0) done(); return true; } miss++; wrong(s,chip); return false; }}));
    cueFirst($('.fc-slot')); foot(c,false);
  }

  /* ---------- end ---------- */
  function finish(){
    stopMic(); clearInterval(timer); timer=null; at=cards.length; dots(); fly('roam');
    const got=cards.filter(c=>results[c.id]===true).length;
    $('#fcstage').innerHTML=`<section class="fc-card fc-intro">
      <h1>${got} of ${cards.length} got</h1>
      <p class="fc-lead">${got===cards.length?'All five. Well done.':'The <b>Not yet</b> cards come back first next time.'}</p>
      <ol class="fc-list">${cards.map((c,i)=>`<li style="--c:${SUBJ[c.s].c};--cs:${SUBJ[c.s].soft}"><span class="fc-tag">${SUBJ[c.s].name}</span><span class="fc-lt">${c.code} ${esc(c.topic)}</span><span class="fc-res ${results[c.id]?'ok':'no'}">${results[c.id]?'Got it':'Not yet'}</span><button class="fc-again" data-i="${i}">Look again</button></li>`).join('')}</ol>
      <div class="fc-row"><a class="btn ghost" href="../index.html">Back to Learning Hub</a></div>
    </section>`;
    document.querySelectorAll('.fc-again').forEach(b=>b.onclick=()=>go(+b.dataset.i));
  }

  /* ---------- keys: Space = start / show answer, → next, ← back, G / N rate ---------- */
  document.addEventListener('keydown',e=>{
    if(e.target.closest&&e.target.closest('textarea,input')) return;
    const c=cards[at];
    if(e.key===' '||e.key==='Enter'){ e.preventDefault(); if(at<0) start(); else if($('#fcshow')) $('#fcshow').click(); else if($('#fcnext')) next(); }
    else if(e.key==='ArrowRight'&&at>=0&&$('#fcnext')) next();
    else if(e.key==='ArrowLeft'&&at>0) go(at-1);
    else if((e.key==='g'||e.key==='n')&&c&&$('#fcnext')) rate(c,e.key==='g');
  });

  frame(); intro();
  window.FC.debug={ALL,S,makePlan};
})();
