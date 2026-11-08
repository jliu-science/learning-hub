/* ===== Kit: shared helpers and widgets for the Chemistry and Physics topics =====
   Kit.spell  – type each key word from its meaning (exact UK spelling)
   Kit.label  – drag labels into the boxes on a real textbook diagram
   plus small helpers used by the subject model files. */
window.Kit = (function(){
  const NS='http://www.w3.org/2000/svg';
  const norm = s => String(s).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z' ]/g,'').replace(/\s+/g,' ').trim();
  const lev = (a,b) => { const d=Array.from({length:a.length+1},(_,i)=>[i]); for(let j=1;j<=b.length;j++) d[0][j]=j;
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[a.length][b.length]; };

  /* ---- buttons to choose one option; returns {set(i)} ---- */
  function choices(box,labels,onPick,start){
    box.innerHTML=''; box.classList.add('ch');
    const bs=labels.map((t,i)=>{ const b=document.createElement('button'); b.type='button'; b.innerHTML=t; b.onclick=()=>set(i); box.appendChild(b); return b; });
    function set(i){ bs.forEach((b,k)=>b.classList.toggle('on',k===i)); onPick(i); }
    if(start!==undefined && start!==null) set(start);
    return {set,buttons:bs};
  }
  /* ---- pointer position in SVG user units ---- */
  function pt(svg,e){ const p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  /* ---- drag something inside an SVG; cb.move(x,y) gets SVG coordinates ---- */
  function svgDrag(target,svg,cb){
    target.addEventListener('pointerdown',e=>{ if(e.button>0) return; e.preventDefault(); target.setPointerCapture&&target.setPointerCapture(e.pointerId);
      cb.start&&cb.start(pt(svg,e));
      const mv=ev=>{ const p=pt(svg,ev); cb.move(p.x,p.y); };
      const up=ev=>{ target.removeEventListener('pointermove',mv); target.removeEventListener('pointerup',up); target.removeEventListener('pointercancel',up); cb.end&&cb.end(pt(svg,ev)); };
      target.addEventListener('pointermove',mv); target.addEventListener('pointerup',up); target.addEventListener('pointercancel',up); });
  }
  const arrow=(x1,y1,x2,y2,col,w=4,head=10)=>{ const L=Math.hypot(x2-x1,y2-y1); if(L<2) return ''; const ux=(x2-x1)/L, uy=(y2-y1)/L; const hx=x2-ux*head, hy=y2-uy*head;
    return `<g><line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x2} ${y2} L${hx-uy*head*.6} ${hy+ux*head*.6} L${hx+uy*head*.6} ${hy-ux*head*.6} Z" fill="${col}"/></g>`; };
  const range=(label,min,max,step,val,fmt)=>`<label class="kit-range"><span>${label}</span><output></output><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-fmt="${fmt||''}"></label>`;

  /* ---- spelling: words = [{word, clue, also?:[other accepted], us?:'american spelling'}] ---- */
  function spell(el,U,words){
    let list=U.shuffle(words), i=0, tries=0, firstTime=0, mustCopy=false;
    el.innerHTML=`<div class="sim"><div class="spell-side">
        <div class="step" id="sp-step"></div>
        <p id="sp-q" style="font-size:1.05rem;min-height:3.2em"></p>
        <div class="row fill"><input type="text" id="sp-in" autocomplete="off" spellcheck="false" placeholder="Type the word"><button class="btn" id="sp-go">Check</button></div>
        <div class="row" style="margin-top:8px"><button class="btn ghost small" id="sp-hint">Hint</button><span class="hint">Spelling has to be exact, UK spelling.</span></div>
        <div class="fb" id="sp-fb"></div>
        <div class="row" style="margin-top:10px"><button class="btn" id="sp-next" style="display:none">Next word →</button><button class="btn ghost small" id="sp-reset">Start again</button></div>
      </div><div class="stage" id="sp-done" style="min-height:120px"><h4 class="hint" style="margin:0 0 6px;font-family:'IBM Plex Mono',monospace;font-weight:500">WORDS YOU HAVE SPELLED</h4><div class="pool" id="sp-pool" style="border:0;padding:0"></div></div></div>`;
    const $=s=>el.querySelector(s);
    function show(){
      if(i>=list.length){ $('#sp-step').textContent='All done';
        $('#sp-q').innerHTML=`You spelled all ${list.length} words. <b>${firstTime}</b> right first time.`;
        $('.spell-side .fill').style.display='none'; $('#sp-hint').style.display='none'; $('#sp-next').style.display='none'; $('#sp-fb').className='fb'; return; }
      const w=list[i]; tries=0; mustCopy=false;
      $('#sp-step').textContent=`Word ${i+1} of ${list.length}`; $('#sp-q').innerHTML=w.clue;
      $('.spell-side .fill').style.display=''; $('#sp-hint').style.display='';
      const inp=$('#sp-in'); inp.value=''; inp.readOnly=false; inp.className=''; $('#sp-go').disabled=false; $('#sp-fb').className='fb'; $('#sp-fb').style.background=''; $('#sp-next').style.display='none'; setTimeout(()=>inp.focus(),30);
    }
    function check(){
      const w=list[i]; const v=norm($('#sp-in').value); if(!v) return; const ans=[w.word,...(w.also||[])].map(norm);
      if(ans.includes(v)){
        if(!tries&&!mustCopy) firstTime++;
        $('#sp-in').className='ok'; $('#sp-in').readOnly=true; $('#sp-go').disabled=true; $('#sp-hint').style.display='none';
        $('#sp-fb').className='fb show good'; $('#sp-fb').innerHTML=`<b>${mustCopy?'Now it\'s right.':'Correct.'}</b> ${w.word}${w.note?'. '+w.note:''}`;
        $('#sp-pool').appendChild(U.h('span',{class:'chip ok'},w.word));
        $('#sp-next').style.display=''; $('#sp-next').textContent=i===list.length-1?'Finish':'Next word →'; return;
      }
      tries++; $('#sp-in').className='no'; let msg;
      const close=Math.min(...ans.map(a=>lev(v,a)));
      if(mustCopy) msg=`Not quite. Copy it exactly: <b>${w.word}</b>`;
      else if(w.us && norm(w.us)===v) msg=`That is the American spelling. In the UK it is spelled differently.`;
      else if(close<=2) msg=`Very close, but the spelling isn't right. You wrote "<b>${v}</b>". Check each letter.`;
      else msg='That isn\'t the word. Read the clue again.';
      if(tries>=2&&!mustCopy){ mustCopy=true; msg+=`<br>The answer is <b>${w.word}</b>. Type it out correctly to carry on.`; }
      $('#sp-fb').className='fb show bad'; $('#sp-fb').innerHTML=msg; $('#sp-in').select();
    }
    $('#sp-go').onclick=check;
    $('#sp-in').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); if($('#sp-next').style.display!=='none') $('#sp-next').click(); else check(); } });
    $('#sp-in').addEventListener('input',()=>{ $('#sp-in').className=''; });
    $('#sp-hint').onclick=()=>{ const a=list[i].word; $('#sp-fb').className='fb show'; $('#sp-fb').style.background='#fffbeb';
      $('#sp-fb').innerHTML=`It starts with <b>${a[0]}</b> and has <b>${a.replace(/[ '-]/g,'').length}</b> letters${a.includes(' ')?` (${a.split(' ').length} words)`:''}.`; };
    $('#sp-next').onclick=()=>{ i++; show(); };
    $('#sp-reset').onclick=()=>spell(el,U,words);
    show();
  }

  /* ---- label a textbook picture: cfg = {img, w, h, alt, slots:[{name, x,y,w,h, lines?:[...]}], tip} ---- */
  function label(el,U,cfg){
    const slots=cfg.slots.map((s,i)=>{ const lines=s.lines||[s.name]; return `<g class="slot" data-i="${i}" transform="translate(${s.x} ${s.y})"><rect width="${s.w}" height="${s.h}" rx="3"/>${lines.map((t,k)=>`<text x="${s.w/2}" y="${(s.h/lines.length)*(k+.5)+6}" text-anchor="middle" data-line="${k}"></text>`).join('')}</g>`; }).join('');
    el.innerHTML=`<div class="spell"><div><svg class="tbdiagram lbl" viewBox="0 0 ${cfg.w} ${cfg.h}" role="img" aria-label="${cfg.alt||'Textbook diagram'}"><image href="${cfg.img}" x="0" y="0" width="${cfg.w}" height="${cfg.h}"/>${slots}</svg></div>
      <div class="spell-side"><p><b>Drag each label into the right box on the diagram.</b></p><div class="pool" id="lb-pool"></div><div class="hint" id="lb-st">${cfg.tip||''}</div><button class="btn ghost small" id="lb-r" style="margin-top:8px">Start again</button><div class="fb" id="lb-fb"></div></div></div>`;
    const $=s=>el.querySelector(s); const svg=el.querySelector('svg'); let left=cfg.slots.length, wrong=0;
    U.shuffle(cfg.slots.map((s,k)=>[s.name,k])).forEach(([n,k])=>{ const c=U.h('div',{class:'chip','data-k':k},n);
      Engine.drag(c,{targets:'.slot',onDrop:(chip,g)=>{
        if(g.classList.contains('ok')) return false;
        if(chip.dataset.k===g.dataset.i){ const s=cfg.slots[+g.dataset.i]; (s.lines||[s.name]).forEach((t,j)=>{ g.querySelector(`[data-line="${j}"]`).textContent=t; });
          g.setAttribute('class','slot ok'); chip.classList.add('ok'); chip.style.visibility='hidden'; left--;
          if(s.info){ $('#lb-fb').className='fb show good'; $('#lb-fb').innerHTML=`<b>${s.name}.</b> ${s.info}`; }
          if(!left) $('#lb-st').textContent=`All labelled (${wrong} wrong attempt${wrong===1?'':'s'}).`; return true; }
        wrong++; chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake'); U.toast('Not that box. Look at the part the line points to.'); return false; }});
      $('#lb-pool').appendChild(c); });
    $('#lb-r').onclick=()=>label(el,U,cfg);
  }

  /* ---- wire up every .kit-range in el: onInput(values[]) ---- */
  function ranges(el,onInput){
    const rs=[...el.querySelectorAll('.kit-range input')];
    const upd=()=>{ rs.forEach(r=>{ const f=r.dataset.fmt||''; r.previousElementSibling.textContent=f.replace('#',r.value)||r.value; }); onInput(rs.map(r=>+r.value)); };
    rs.forEach(r=>r.addEventListener('input',upd)); upd(); return rs;
  }

  return {NS,choices,pt,svgDrag,arrow,range,ranges,spell,label};
})();
