/* ===== Revision engine: renders a topic (lessons → Learn / Explore / Quiz / Apply tabs) =====
   A topic data file calls Engine.start(TOPIC). Reuse for chemistry/physics. */
(function(){
  let TOPIC;
  const $ = (s, el=document) => el.querySelector(s);
  const h = (tag, attrs={}, html) => { const e=document.createElement(tag); for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k.startsWith('on')) e.addEventListener(k.slice(2),attrs[k]); else e.setAttribute(k,attrs[k]); } if(html!==undefined) e.innerHTML=html; return e; };
  const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();

  /* ---------- colour system: each concept gets a consistent colour ---------- */
  const PAL={
    enzyme:['#7c3aed','#ede9fe','#5b21b6'], bacteria:['#0d9488','#ccfbf1','#115e59'], carb:['#d97706','#fef3c7','#92400e'],
    lipid:['#ca8a04','#fef9c3','#854d0e'], protein:['#e11d48','#ffe4e6','#9f1239'], vitamin:['#ea580c','#ffedd5','#9a3412'],
    mineral:['#4f46e5','#e0e7ff','#3730a3'], water:['#0284c7','#e0f2fe','#075985'], fibre:['#16a34a','#dcfce7','#166534'],
    test:['#2563eb','#dbeafe','#1e40af'], health:['#dc2626','#fee2e2','#991b1b'], energy:['#f97316','#ffedd5','#9a3412'],
    organ:['#db2777','#fce7f3','#9d174d'], diet:['#059669','#d1fae5','#065f46'], other:['#475569','#f1f5f9','#1e293b']
  };
  const RULES=[
    ['enzyme',/(ase\b|enzyme|catalyst)/],['bacteria',/(bacteri|probiotic|yoghurt|microorganism)/],['lipid',/(bile|lipid|fat|oil|glycerol)/],
    ['test',/(test|iodine|benedict|ethanol|copper|filter|hypothesis|distilled)/],['fibre',/(fibre|constipation)/],
    ['health',/(obes|deficien|starv|malnour|rickets|night blind|underweight|overweight|disease|safety)/],['energy',/(energy|kilojoule|kj\b|joule)/],
    ['carb',/(carbohydr|starch|sugar)/],['protein',/(protein|amino)/],['vitamin',/(vitamin)/],['mineral',/(mineral|calcium|iron)/],['water',/(water)/],
    ['organ',/(mouth|gullet|stomach|intestine|rectum|anus|villi|digest|gut|teeth|order|muscle|liver|pancreas)/],['diet',/(nutrient|balanced|diet|pyramid|food)/]
  ];
  /* a topic may bring its own concept colours: TOPIC.tones = {pal:{key:[main,soft,dark]}, rules:[[key,/re/],...]} */
  function tone(text){ const t=String(text).replace(/<[^>]+>/g,'').toLowerCase().slice(0,70);
    const T=TOPIC&&TOPIC.tones; const rules=T?T.rules:RULES, pal=T?Object.assign({},PAL,T.pal):PAL;
    for(const [k,re] of rules) if(re.test(t)) return [...pal[k],k]; return [...PAL.other,'other']; }
  /* toneKey('exo') → colours for that key, if the topic (or base palette) defines it; otherwise null */
  function toneKey(k){ const pal=Object.assign({},PAL,(TOPIC&&TOPIC.tones&&TOPIC.tones.pal)||{}); return (k&&pal[k])?[...pal[k],k]:null; }
  const vars = c => `--c:${c[0]};--c-soft:${c[1]};--c-dark:${c[2]};--c-tint:${c[1]}55`;
  const icon = (e,c,cls='') => `<span class="ico ${cls}" style="${vars(c)}">${svgIcon(c[3]||'other',cls?30:20)}</span>`;
  const splitIcon = label => { const m=String(label).match(/^(\S+)\s+(.*)$/); return (m && !/[a-z0-9]/i.test(m[1])) ? [m[1],m[2]] : ['',label]; };
  const LESSON_COL=['#059669','#2563eb','#ea580c','#db2777','#7c3aed','#0d9488'];
  const shade = (hex,a) => hex+a;

  /* ---------- progress storage (safe if blocked) ---------- */
  const KEY='dora-science-progress';
  const Store = {
    all(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return Store._mem||(Store._mem={}); } },
    save(d){ try{ localStorage.setItem(KEY,JSON.stringify(d)); }catch(e){ Store._mem=d; } },
    stars(id){ return Store.all()[id]||0; },
    setStars(id,n){ const d=Store.all(); if((d[id]||0)<n){ d[id]=n; Store.save(d);} },
    total(prefix){ const d=Store.all(); return Object.keys(d).filter(k=>!prefix||k.startsWith(prefix)).reduce((s,k)=>s+d[k],0); }
  };

  /* ---------- feedback ---------- */
  function toast(msg){ let t=$('.toast'); if(!t){ t=h('div',{class:'toast'}); document.body.appendChild(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2000); }
  function confetti(){ return;  const cols=['#0f9d76','#f59e0b','#ea580c','#2563eb','#6d5ae6']; for(let i=0;i<50;i++){ const c=h('div',{class:'confetti'}); c.style.left=Math.random()*100+'vw'; c.style.background=cols[i%cols.length]; c.style.animationDuration=(1.6+Math.random()*1.4)+'s'; document.body.appendChild(c); setTimeout(()=>c.remove(),3200);} }
  const dots = n => `<span class="dots">${[0,1,2].map(i=>`<i class="${i<n?'f':''}"></i>`).join('')}</span>`;

  /* ---------- flip cards ---------- */
  function flipCards(words,wide){
    const g=h('div',{class:'flips'+(wide?' wide':'')});
    words.forEach(w=>{ const c=toneKey(w.t)||tone(w.word); const b=h('button',{class:'flip','aria-label':'Key word '+w.word,style:vars(c)},`<div class="in"><div class="f">${icon(w.e,c)}${w.word}</div><div class="b">${w.def}</div></div>`); b.onclick=()=>b.classList.toggle('flipped'); g.appendChild(b); });
    return g;
  }

  /* ---------- drag helper: pointer events, so mouse, pen and touch all work ----------
     drag(chip, {targets: selector, onDrop(chip, target) → true if accepted}) */
  function drag(chip,{targets,onDrop}){
    chip.classList.add('draggable');
    chip.addEventListener('pointerdown',e=>{
      if(chip.classList.contains('ok')||e.button>0) return;
      e.preventDefault();
      const r=chip.getBoundingClientRect(); const dx=e.clientX-r.left, dy=e.clientY-r.top;
      const ghost=chip.cloneNode(true); ghost.classList.add('ghost'); ghost.style.width=r.width+'px';
      document.body.appendChild(ghost); chip.classList.add('lifted');
      let over=null;
      let auto=null, lastY=e.clientY;
      const edge=()=>{ const z=70, v=lastY<z?-(z-lastY)/4:lastY>innerHeight-z?(lastY-innerHeight+z)/4:0; if(v) window.scrollBy(0,v); };
      const move=ev=>{ lastY=ev.clientY; if(!auto) auto=setInterval(edge,16); ghost.style.left=(ev.clientX-dx)+'px'; ghost.style.top=(ev.clientY-dy)+'px';
        const t=document.elementFromPoint(ev.clientX,ev.clientY); const tg=t&&t.closest(targets);
        if(tg!==over){ over&&over.classList.remove('over'); over=tg; over&&over.classList.add('over'); } };
      const up=ev=>{ clearInterval(auto); document.removeEventListener('pointermove',move); document.removeEventListener('pointerup',up); document.removeEventListener('pointercancel',up);
        over&&over.classList.remove('over'); chip.classList.remove('lifted');
        const ok = over ? onDrop(chip,over) : false;
        if(!ok){ const r2=chip.getBoundingClientRect(); ghost.style.transition='left .25s, top .25s'; ghost.style.left=r2.left+'px'; ghost.style.top=r2.top+'px'; setTimeout(()=>ghost.remove(),260); }
        else ghost.remove(); };
      move(e); document.addEventListener('pointermove',move); document.addEventListener('pointerup',up); document.addEventListener('pointercancel',up);
    });
  }
  const nope=c=>{ c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); };

  /* ---------- sorter: drag each item into a box ---------- */
  function sorter(el,{bins,items}){
    el.innerHTML='';
    const pool=h('div',{class:'pool'}); const binWrap=h('div',{class:'bins'});
    let left=items.length, mistakes=0;
    bins.forEach(b=>{ const [ie,lt]=splitIcon(b.label); const bc=toneKey(b.t)||tone(lt); binWrap.appendChild(h('div',{class:'bin','data-id':b.id,style:vars(bc)},`<h4>${(ie||b.t)?icon(ie,bc):''}${lt}</h4><div class="items"></div>`)); });
    shuffle(items).forEach(it=>{
      const c=h('div',{class:'chip','data-bin':it.bin},splitIcon(it.label)[1]);
      drag(c,{targets:'.bin',onDrop:(chip,bin)=>{
        if(chip.dataset.bin===bin.dataset.id){ chip.classList.add('ok'); bin.querySelector('.items').appendChild(chip); left--; status.textContent = left? `${left} left` : `All sorted (${mistakes} wrong attempt${mistakes===1?'':'s'}).`; return true; }
        mistakes++; nope(chip); toast(it.why?('Hint: '+it.why):'Not that box. Try another one.'); return false; }});
      pool.appendChild(c);
    });
    const status=h('span',{class:'hint'},`Drag each item into the right box. ${items.length} to go.`);
    const reset=h('button',{class:'btn ghost small'},'Restart'); reset.onclick=()=>sorter(el,{bins,items});
    const r=h('div',{class:'row',style:'margin-top:10px;justify-content:space-between'}); r.append(status,reset);
    el.append(pool,binWrap,r);
  }

  /* ---------- matcher: drag each description onto its word ---------- */
  function matcher(el,pairs){
    el.innerHTML='';
    const wrap=h('div',{class:'match2'}); const L=h('div',{class:'col'}), R=h('div',{class:'pool'});
    let n=0, wrong=0;
    pairs.forEach((p,i)=>L.appendChild(h('div',{class:'mrow','data-i':i,style:vars(tone(p[0]))},`<div class="term">${p[0]}</div><div class="drop">drop here</div>`)));
    shuffle(pairs.map((p,i)=>[p[1],i])).forEach(([txt,i])=>{ const c=h('div',{class:'chip','data-i':i},txt);
      drag(c,{targets:'.mrow',onDrop:(chip,row)=>{
        if(row.classList.contains('done')) return false;
        if(row.dataset.i===chip.dataset.i){ chip.classList.add('ok'); const d=row.querySelector('.drop'); d.innerHTML=''; d.appendChild(chip); row.classList.add('done'); n++; if(n===pairs.length) stat.textContent=`All matched (${wrong} wrong attempt${wrong===1?'':'s'}).`; return true; }
        wrong++; nope(chip); toast('Not a match. Try another one.'); return false; }});
      R.appendChild(c); });
    wrap.append(R,L);
    const stat=h('span',{class:'hint'},'Drag each description onto the word it matches.');
    const reset=h('button',{class:'btn ghost small'},'Restart'); reset.onclick=()=>matcher(el,pairs);
    const r=h('div',{class:'row',style:'margin-top:10px;justify-content:space-between'}); r.append(stat,reset);
    el.append(wrap,r);
  }

  /* ---------- quiz: one question at a time ---------- */
  function quiz(el,questions,id,onDone){
    let i=0, score=0; const log=[];
    const draw=()=>{
      el.innerHTML='';
      const w=h('div',{class:'qwrap'}); el.appendChild(w);
      if(i>=questions.length){ return finish(w); }
      const q=questions[i]; let answered=false;
      w.appendChild(h('div',{class:'qtop'},`<span>Question ${i+1} of ${questions.length}</span><div class="prog"><i style="width:${i/questions.length*100}%"></i></div><span>Score ${score}</span>`));
      w.appendChild(h('div',{class:'qtext'},q.q));
      const fb=h('div',{class:'fb'});
      const next=h('button',{class:'btn accent',disabled:''},i===questions.length-1?'See results':'Next →'); next.onclick=()=>{ i++; draw(); };
      const done=(ok,extra='')=>{ answered=true; if(ok) score++; log.push([q.q,ok]); fb.className='fb show '+(ok?'good':'bad'); fb.innerHTML=`<b>${ok?'Correct.':'Not quite.'}</b> ${extra}${q.explain?' '+q.explain:''}`; next.disabled=false; next.focus(); };
      if(q.type==='fill'){
        const f=h('div',{class:'fill row'}); const inp=h('input',{type:'text',placeholder:'Type your answer','aria-label':'answer'}); const go=h('button',{class:'btn'},'Check');
        const check=()=>{ if(answered) return; const v=norm(inp.value); if(!v){inp.focus();return;} const ok=q.answers.some(a=>v===norm(a)||(norm(a).length>4&&v.includes(norm(a)))); inp.classList.add(ok?'ok':'no'); inp.disabled=true; go.disabled=true; done(ok, ok?'':`Answer: <b>${q.answers[0]}</b>.`); };
        go.onclick=check; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') answered? next.click() : check(); });
        f.append(inp,go); w.appendChild(f); setTimeout(()=>inp.focus(),50);
      } else if(q.type==='order'){
        const ul=h('ol',{class:'order-list'}); let items=shuffle(q.items.map((t,k)=>({t,k}))); if(items.every((x,k)=>x.k===k)) items.reverse();
        const dr=()=>{ ul.innerHTML=''; items.forEach((it,k)=>{ const li=h('li',{},`<span>${it.t}</span>`); const up=h('button',{'aria-label':'move up'},'▲'), dn=h('button',{'aria-label':'move down'},'▼'); up.onclick=()=>{ if(k>0){[items[k-1],items[k]]=[items[k],items[k-1]]; dr();} }; dn.onclick=()=>{ if(k<items.length-1){[items[k+1],items[k]]=[items[k],items[k+1]]; dr();} }; li.append(up,dn); ul.appendChild(li); }); };
        dr(); const go=h('button',{class:'btn',style:'margin-top:10px'},'Check order');
        go.onclick=()=>{ const ok=items.every((x,k)=>x.k===k); [...ul.children].forEach((li,k)=>{ li.classList.add(items[k].k===k?'ok':'no'); li.querySelectorAll('button').forEach(b=>b.disabled=true); }); go.disabled=true; done(ok, ok?'':'Correct order: '+q.items.join(' → ')+'.'); };
        w.append(ul,go);
      } else {
        const opts=h('div',{class:'opts'}); const order=q.noShuffle?q.options.map((o,k)=>k):shuffle(q.options.map((o,k)=>k));
        order.forEach((k,pos)=>{ const b=h('button',{class:'opt'},`<span class="k">${'ABCD'[pos]}</span><span>${q.options[k]}</span>`); b.onclick=()=>{ if(answered) return; const ok=k===q.answer; opts.querySelectorAll('.opt').forEach(x=>x.disabled=true); b.classList.add(ok?'right':'wrong'); if(!ok) opts.children[order.indexOf(q.answer)].classList.add('right'); done(ok); }; opts.appendChild(b); });
        w.appendChild(opts);
      }
      w.appendChild(fb);
      const nav=h('div',{class:'qnav'}); nav.append(h('span',{class:'hint'},q.type==='fill'?'Press Enter to check':''),next); w.appendChild(nav);
    };
    const finish=w=>{
      const pct=score/questions.length; const stars= pct===1?3: pct>=.75?2: pct>=.5?1:0;
      if(id) Store.setStars(id,stars); if(stars===3) confetti();
      w.innerHTML=`<div class="result card"><div class="hint">Your score</div><div class="big">${score} / ${questions.length}</div><div class="stars">${'★'.repeat(stars)}<span style="color:#d1d5db">${'★'.repeat(3-stars)}</span></div>
        <p>${stars===3?'Every answer right.':stars===2?'Nearly there. Have another go for all three stars.':stars===1?'Look at the ones you missed below, then try again.':'Read through the Learn tab first, then come back.'}</p>
        <div class="row" style="justify-content:center"><button class="btn accent" id="again">Try again (new order)</button></div>
        <div class="review">${log.map(([t,ok])=>`<div>${ok?'✓':'✗'} &nbsp;${t}</div>`).join('')}</div></div>`;
      w.querySelector('#again').onclick=()=>quiz(el,shuffle(questions),id,onDone);
      onDone&&onDone();
    };
    draw();
  }

  /* ---------- application questions: one at a time ---------- */
  /* ---------- auto-marking: keyword groups per marking point ---------- */
  const mnorm=t=>' '+String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ';
  const esc=w=>w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  /* Match related words within one statement, rather than joining unrelated facts.
     Only verbatim copied sentences are ignored: correct answers often reuse terms
     from the question, so vocabulary overlap alone is not evidence of copying. */
  const statements=t=>String(t).split(/(?<!\d)\.|\.(?!\d)|[!?;\n]+|(?:[,\:]\s*|\b(?:but|whereas|while|and)\s+)(?=(?:the\s+)?(?:carbohydrase|amylase|protease|lipase|enzymes?|catalysts?)\b)/i).map(s=>mnorm(s).trim()).filter(Boolean);
  function dropCopied(answer,stem){
    const copied=new Set(statements(stem||''));
    return statements(answer).filter(s=>s.split(' ').length<6||!copied.has(s));
  }
  function positiveHit(text,word){
    const term=mnorm(word).trim();
    const re=new RegExp('(^|[^a-z0-9])'+esc(term),'g'); let match;
    while((match=re.exec(text))){
      const before=text.slice(0,match.index+match[1].length);
      const explicitNegative=/\b(?:not|without|never|no)\b|\b(?:aren|isn|don|doesn|can|won) t\b/.test(term);
      const negated=/\b(?:not|never|no|cannot|can t|don t|doesn t|isn t|aren t|wasn t|weren t|won t|without)\b(?:\s+[a-z0-9]+){0,3}\s*$/.test(before);
      if(explicitNegative||!negated) return word;
    }
    return null;
  }
  function markAnswer(answer,rules,stem){
    const original=dropCopied(answer,stem), whole=mnorm(answer);
    // A pronoun can continue the preceding explanation without naming the nutrient again.
    const parts=original.flatMap((part,i)=>i&&/^(?:if )?(?:they|it|these|this)\b/.test(part)?[part,original[i-1]+' '+part]:[part]);
    const matchGroups=rule=>{
      const groups=Array.isArray(rule)?rule:rule.all;
      for(const part of parts){
        const hits=groups.map(group=>group.map(w=>positiveHit(part,w)).find(Boolean));
        if(hits.every(Boolean)) return hits;
        for(const pattern of rule.patterns||[]){
          const match=part.match(pattern);
          if(match&&positiveHit(part,match[0])) return [match[0]];
        }
      }
      return null;
    };
    return rules.map(rule=>{
      const spec=Array.isArray(rule)?{all:rule}:rule;
      if(spec.check){ const ok=!!spec.check(answer,parts,positiveHit); return {ok,hits:[]}; }
      if((spec.reject||[]).some(re=>re.test(whole))) return {ok:false,hits:[]};
      if(spec.choices){
        const found=spec.choices.map(matchGroups).filter(Boolean);
        const ok=found.length>=(spec.minimum||1);
        return {ok,hits:ok?[...new Set(found.flat())]:[]};
      }
      const hits=matchGroups(spec.all);
      return {ok:!!hits,hits:hits||[]};
    });
  }
  function highlight(answer,words){
    let html=answer.replace(/&/g,'&amp;').replace(/</g,'&lt;');
    words.forEach(w=>{ const re=new RegExp('(^|[^A-Za-z0-9>])('+esc(w).replace(/ /g,'[^A-Za-z0-9]+')+'[A-Za-z]*)','gi'); html=html.replace(re,'$1<mark>$2</mark>'); });
    return html.replace(/\n/g,'<br>');
  }

  /* ---------- application questions: one at a time, auto-marked on Submit ---------- */
  function applyQs(el,list,key){
    let cur=0; const drafts={}; const rulesFor=i=>((window.MARKS||{})[key]||[])[i];
    const draw=()=>{
      el.innerHTML='';
      const pills=h('div',{class:'pills'}); list.forEach((a,i)=>{ const b=h('button',{class:i===cur?'on':''},`Problem ${i+1}`); b.onclick=()=>{ save(); cur=i; draw(); }; pills.appendChild(b); }); el.appendChild(pills);
      const a=list[cur]; const rules=rulesFor(cur); const max=a.marks||a.points.length; const d=h('div',{class:'apply card'});
      d.innerHTML=`<div class="aq-l"><div class="meta"><span class="lbl">Real-world problem ${cur+1} of ${list.length}</span><span class="marks">${max} marks</span></div>
        <div class="scn">${a.scenario}</div><p style="margin:.4em 0"><b>${a.question}</b></p>
        ${a.chain?`<div class="chain">Think it through: ${a.chain.map(c=>`<span>${c}</span>`).join('<i>→</i>')}</div>`:''}
        <textarea placeholder="Write your answer here, then press Submit to have it marked."></textarea>
        <div class="row">${(a.hints||[]).length?'<button class="btn small ghost hb">Hint</button>':''}<button class="btn small sb">Submit</button>
        <span style="flex:1"></span>${cur<list.length-1?'<button class="btn small ghost nx">Next problem →</button>':''}</div>
        <div class="hintbox">${(a.hints||[]).map(x=>'• '+x).join('<br>')}</div></div>
        <div class="markbox"></div>`;
      const ta=d.querySelector('textarea'); ta.value=drafts[cur]||'';
      const hb=d.querySelector('.hb'); hb&&(hb.onclick=()=>d.querySelector('.hintbox').classList.add('show'));
      const nx=d.querySelector('.nx'); nx&&(nx.onclick=()=>{ save(); cur++; draw(); });
      d.querySelector('.sb').onclick=()=>{
        const ans=ta.value.trim(); const box=d.querySelector('.markbox');
        if(ans.split(/\s+/).length<3){ d.classList.add('marked'); box.innerHTML='<p class="hint" style="color:var(--bad)">Write a bit more first. Aim for a full sentence for each mark.</p>'; ta.focus(); return; }
        const stem=(a.scenario+' '+a.question).replace(/<[^>]+>/g,' '); const res = rules ? markAnswer(ans,rules,stem) : a.points.map(()=>({ok:false,hits:[]}));
        const got=res.filter(r=>r.ok).length; const score=Math.round(got/a.points.length*max);
        const words=[].concat(...res.filter(r=>r.ok).map(r=>r.hits));
        box.innerHTML=`<div class="score"><span class="big">${score}<small> / ${max}</small></span><span>${score===max?'All key points found. Compare your answer with the model answer.':score>=max/2?'Some key points found. Check the suggestions below.':'Check the model answer, then add any missing explanations.'}</span></div>
          <div class="yours"><h4>Your answer</h4><p>${highlight(ans,words)}</p></div>
          ${got?`<div class="good-pts"><h4>Super — you included</h4><ul>${a.points.map((p,i)=>res[i].ok?`<li>${p}</li>`:'').join('')}</ul></div>`:''}
          ${got<a.points.length?`<div class="miss-pts"><h4>Missing — add this to your answer</h4><ul>${a.points.map((p,i)=>res[i].ok?'':`<li>${p}</li>`).join('')}</ul></div>`:''}
          <details class="model-d"><summary>Show the model answer</summary><p>${a.model}</p></details>
          <p class="hint" style="margin:8px 0 0">This is a suggested score. Check the model answer, especially if you expressed an idea differently.</p>`;
        d.querySelector('.sb').textContent='Submit again'; d.classList.add('marked');
        if(window.innerWidth<900) box.scrollIntoView({behavior:'smooth',block:'nearest'});
      };
      el.appendChild(d);
    };
    const save=()=>{ const t=el.querySelector('textarea'); if(t) drafts[cur]=t.value; };
    draw();
  }

  /* ---------- page ---------- */
  const card=(title,sub)=>{ const c=h('section',{class:'card'}); if(title) c.appendChild(h('h2',{},title)); if(sub) c.appendChild(h('p',{class:'sub'},sub)); return c; };
  function nav(cur){
    const n=$('#lessonnav'); n.innerHTML=`<div class="grp">${TOPIC.subject} · ${TOPIC.title}</div>`;
    TOPIC.lessons.forEach((l,i)=>{ const lc=l.accent||LESSON_COL[i%LESSON_COL.length]; n.appendChild(h('a',{href:'#'+l.id,class:cur===l.id?'on':'',style:`--lc:${lc};--lc-soft:${lc}1a;--lc-dark:${lc}`},`<span class="num">${l.code}</span><span class="nm">${l.short}</span>${dots(Store.stars(TOPIC.id+'-'+l.id))}`)); });
    n.appendChild(h('div',{class:'sep'}));
    n.appendChild(h('a',{href:'#final',class:cur==='final'?'on':''},`<span class="num">ALL</span><span class="nm">Final challenge</span>${dots(Store.stars(TOPIC.id+'-final'))}`));
    n.appendChild(h('a',{href:'#glossary',class:cur==='glossary'?'on':''},`<span class="num">A–Z</span><span class="nm">Key word bank</span>`));
    n.querySelectorAll('a').forEach(a=>{ if(!a.style.getPropertyValue('--lc')) a.style.cssText='--lc:#7c3aed;--lc-soft:#7c3aed1a;--lc-dark:#7c3aed'; });
    const on=n.querySelector('.on'); if(on&&window.innerWidth<900) on.scrollIntoView({inline:'center',block:'nearest'});
    $('#xp').innerHTML=`<b>★</b> ${Store.total()} stars`;
  }
  function tabs(main,defs,active,base){
    const bar=h('div',{class:'tabbar',role:'tablist'}); const panel=h('div');
    defs.forEach(t=>{ const b=h('button',{class:t.id===active?'on':'',role:'tab'},`${t.label}${t.badge?` <span class="badge">${t.badge}</span>`:''}`); b.onclick=()=>{ history.replaceState(null,'','#'+base+'/'+t.id); show(t.id); }; t.btn=b; bar.appendChild(b); });
    const show=id=>{ defs.forEach(t=>t.btn.classList.toggle('on',t.id===id)); panel.innerHTML=''; (defs.find(t=>t.id===id)||defs[0]).render(panel); };
    main.append(bar,panel); show(active);
  }
  function header(main,code,title,text,goals,prev,next,ic){
    main.appendChild(h('div',{class:'lhead'},`<div class="ttl">${ic?`<span class="ico lg">${svgIcon(ic,30)}</span>`:''}<div><div class="code">${code}</div><h1>${title}</h1>${text?`<p>${text}</p>`:''}${goals?`<div class="goals">${goals.map(g=>`<span>${g}</span>`).join('')}</div>`:''}</div></div>
      <div class="pn">${prev?`<a class="btn ghost small" href="#${prev[0]}">← ${prev[1]}</a>`:''}${next?`<a class="btn ghost small" href="#${next[0]}">${next[1]} →</a>`:''}</div>`));
  }
  function renderLesson(l,tab){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c);
    const idx=TOPIC.lessons.indexOf(l), pv=TOPIC.lessons[idx-1], nx=TOPIC.lessons[idx+1];
    setAccent(l.accent||LESSON_COL[idx%LESSON_COL.length]);
    header(c,'Lesson '+l.code,l.title,l.hook,l.goals,pv&&[pv.id,pv.short],nx?[nx.id,nx.short]:['final','Final challenge'],l.ico||['diet','test','energy','organ','enzyme','other'][idx]);
    tabs(c,[
      {id:'learn',label:'Learn',render(p){ const g=h('div',{class:'grid2'});
        const k=card('Key words','Say what each word means, then tap the card to check.'); k.appendChild(flipCards(l.keywords));
        const s=card('Summary'); const ul=h('ol',{class:'summary'}); l.summary.forEach(x=>ul.appendChild(h('li',{},`${icon(x[0],toneKey(x[0])||tone(x[1]))}<span>${x[1]}</span>`))); s.appendChild(ul);
        if(l.memory) s.appendChild(h('div',{class:'memory'},`<b>Remember</b> ${l.memory}`));
        if(l.fact) s.appendChild(h('div',{class:'foul'},l.fact[1]));
        g.append(k,s); p.appendChild(g); }},
      {id:'explore',label:'Explore',badge:(l.widgets||[]).length,render(p){ const pills=h('div',{class:'pills'}); const box=card(); p.append(pills,box);
        const show=i=>{ pills.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('on',i===j)); const w=l.widgets[i]; box.innerHTML=`<h2>${w.title}</h2>${w.intro?`<p class="sub">${w.intro}</p>`:''}`; const d=h('div'); box.appendChild(d); w.render(d,{sorter,matcher,toast,confetti,h,shuffle}); };
        l.widgets.forEach((w,i)=>{ const b=h('button',{},w.title); b.onclick=()=>show(i); pills.appendChild(b); }); show(0); }},
      {id:'quiz',label:'Quiz',badge:l.quiz.length,render(p){ const d=card(); p.appendChild(d); quiz(d,l.quiz,TOPIC.id+'-'+l.id,()=>nav(l.id)); }},
      {id:'apply',label:'Apply it',badge:l.apply.length,render(p){ p.appendChild(h('p',{class:'hint',style:'margin-top:-6px'},'You don\'t need to have memorised these. Work them out from what you know, write your answer, then press Submit.')); const d=h('div'); p.appendChild(d); applyQs(d,l.apply,l.id); }}
    ],tab||'learn',l.id);
  }
  function renderFinal(tab){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c); const F=TOPIC.final;
    const last=TOPIC.lessons[TOPIC.lessons.length-1];
    setAccent('#7c3aed'); header(c,'Whole topic','Final challenge',F.intro,null,[last.id,last.short],['glossary','Key word bank'],'trophy');
    const pool=[]; TOPIC.lessons.forEach(l=>l.quiz.forEach(q=>{ if(q.type!=='order') pool.push(q); }));
    tabs(c,[
      {id:'exam',label:'Exam technique',render(p){ const d=card('Command words','The first word of a question tells you what kind of answer is needed.'); d.appendChild(h('div',{class:'cmd'},F.commandWords.map(w=>`<div><b>${w[0]}</b>${w[1]}</div>`).join(''))); p.appendChild(d); }},
      {id:'quiz',label:'Mixed quiz',badge:15,render(p){ const d=card(); p.appendChild(d); quiz(d,shuffle(pool).slice(0,15),TOPIC.id+'-final',()=>nav('final')); }},
      {id:'apply',label:'Big questions',badge:F.apply.length,render(p){ const d=h('div'); p.appendChild(d); applyQs(d,F.apply,'final'); }}
    ],tab||'quiz','final');
  }
  function renderGlossary(){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c);
    setAccent('#0d9488'); header(c,'Wordbank','Key word bank','Every key word in the topic, A to Z. Search for one, or flip through them all.',null,null,null,'book');
    const d=card(); const s=h('input',{class:'search',placeholder:'Search a word…'}); const box=h('div'); d.append(s,box); c.appendChild(d);
    const all=[]; TOPIC.lessons.forEach(l=>l.keywords.forEach(k=>all.push(k))); all.sort((a,b)=>a.word.localeCompare(b.word));
    const draw=()=>{ const v=norm(s.value); box.innerHTML=''; box.appendChild(flipCards(all.filter(k=>!v||norm(k.word+' '+k.def).includes(v)),true)); };
    s.oninput=draw; draw();
  }
  function setAccent(c){ const r=document.documentElement.style; r.setProperty('--accent',c); r.setProperty('--accent-soft',c+'1f'); r.setProperty('--accent-ink',c); }
  function route(){
    const [id,tab]=(location.hash||'#'+TOPIC.lessons[0].id).slice(1).split('/');
    if(id==='final') renderFinal(tab); else if(id==='glossary') renderGlossary();
    else renderLesson(TOPIC.lessons.find(l=>l.id===id)||TOPIC.lessons[0],tab);
    nav(id); window.scrollTo(0,0);
  }
  window.Engine={ markAnswer, tone, toneKey, vars, svg:(k,n)=>svgIcon(k,n), start(t){ TOPIC=t; document.title=t.title+' · Revision'; window.addEventListener('hashchange',route); route(); }, Store, sorter, matcher, drag, toast, confetti, shuffle, h };
})();
