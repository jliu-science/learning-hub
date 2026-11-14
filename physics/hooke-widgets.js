/* ===== Hooke's law extras for 1.3.2 (from the class notes, 9 and 12 Oct 2026) =====
   measure  – "How would you use this fact to measure a force?": calibrate with 1 N, hang a mystery box,
              read the ruler, extension = measured − original, then count the 2 cm steps.
   band     – her elastic band results: hang 1 N weights, drag the right extension into the table, graph builds live.
   detective– four sets of results that don't follow Hooke's law: drag the reason onto the graph, the graph fixes itself. */
window.HookeWidgets = (function(){
  const K=window.Kit, NS='http://www.w3.org/2000/svg';
  const INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf', BLUE='#2563eb', OK='#16a34a', BAD='#dc2626', PAPER='#fffdf8';
  const halo=`paint-order="stroke" stroke="${PAPER}" stroke-width="4"`;
  const T=(x,y,s,o='')=>`<text x="${x}" y="${y}" font-size="14" ${o}>${s}</text>`;
  if(!document.getElementById('hk-css')){ const st=document.createElement('style'); st.id='hk-css';
    st.textContent=`@keyframes hkwig{0%,100%{transform:rotate(0)}20%{transform:rotate(-5deg)}40%{transform:rotate(5deg)}60%{transform:rotate(-3deg)}80%{transform:rotate(2deg)}}
.hk-wig{animation:hkwig 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes hkdash{to{stroke-dashoffset:-18}} .hk-ant{animation:hkdash .9s linear infinite}
@keyframes hkpulse{0%,100%{opacity:1}50%{opacity:.35}} .hk-pulse{animation:hkpulse 1s ease-in-out infinite}
.hk-btn{cursor:pointer} .hk-btn:hover rect{fill:#eef2ff} .hk-grab{cursor:grab} .hk-grab:active{cursor:grabbing}`;
    document.head.appendChild(st); }
  const el$=(tag,attrs)=>{ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); return e; };
  const shake=g=>g.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:320});
  // coiled spring between y0 and y1 at x=cx
  function coil(cx,y0,y1,R=13,n=8){ const h=y1-y0-12, p=h/n, t=y0+6; let b='',f='';
    for(let k=0;k<n;k++){ const a=t+k*p; b+=`M${cx+R} ${a} C${cx+R*.4} ${a-3} ${cx-R*.4} ${a+p*.5-3} ${cx-R} ${a+p*.5} `; f+=`M${cx-R} ${a+p*.5} C${cx-R*.4} ${a+p*.5+4} ${cx+R*.4} ${a+p+4} ${cx+R} ${a+p} `; }
    return `<path d="M${cx} ${y0} L${cx} ${t} L${cx+R} ${t}" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="${b}" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/><path d="${f}" fill="none" stroke="#374151" stroke-width="3" stroke-linecap="round"/><path d="M${cx+R} ${t+h} L${cx} ${t+h} L${cx} ${y1}" fill="none" stroke="${INK}" stroke-width="2.5"/>`; }
  // move a persistent SVG group with the pointer; drop(x,y) returns true to keep it where it is
  function grab(g,svg,{can,drop,home}){ let off=null;
    K.svgDrag(g,svg,{start(p){ if(can&&!can()){ off=null; shake(g); return; } const h=home(); off={x:p.x-h.x,y:p.y-h.y}; g.style.transition='none'; },
      move(x,y){ if(!off) return; g.setAttribute('transform',`translate(${x-off.x} ${y-off.y})`); },
      end(p){ if(!off) return; const ok=drop(p.x-off.x,p.y-off.y); off=null; if(!ok) back(g,home()); }}); }
  function back(g,h){ const m=/translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform')||'')||[0,h.x,h.y], x0=+m[1], y0=+m[2], st=performance.now();
    const run=t=>{ const k=Math.min(1,(t-st)/260), q=1-(1-k)**3; g.setAttribute('transform',`translate(${x0+(h.x-x0)*q} ${y0+(h.y-y0)*q})`); if(k<1) requestAnimationFrame(run); }; requestAnimationFrame(run); }
  // damped spring motion of a length value
  function bouncer(get,set,draw){ let v=0, raf=0, target=get();
    const run=()=>{ const x=get(); v=(v+(target-x)*.12)*.82; const nx=Math.abs(target-x)<.01&&Math.abs(v)<.01?target:x+v; set(nx); draw(); raf=nx!==target?requestAnimationFrame(run):0; };
    return to=>{ target=to; if(!raf) raf=requestAnimationFrame(run); }; }

  /* ---------------- Measure a force ----------------
     1 N stretches the spring 2 cm → that 2 cm becomes a "1 N brick". Hang a box, read the length,
     fill the extension with bricks to count the newtons. Then build a force scale on the ruler and read box D straight off it. */
  function measure(el){
    const L0=5, PER=2, PX=13, TOP=44, CX=236, RX=70, BX=140, BW=26;
    const CAL='#0f766e';
    const BOX=[{id:'A',f:3,col:'#7c3aed'},{id:'B',f:6,col:'#0e7490'},{id:'C',f:5,col:'#b45309'},{id:'D',f:4,col:'#be185d'}];
    let st='cal', bi=0, len=L0, hung=null, reading=0, moved=false, bricks=0, tags=0, found={};
    el.innerHTML=`<div class="stage" style="padding:6px"><svg viewBox="0 0 680 440" id="mfsvg" style="max-height:min(660px,82vh)" aria-label="A spring and a ruler used to measure forces">
      <rect x="10" y="426" width="290" height="10" rx="2" fill="#57534e"/><rect x="18" y="14" width="7" height="414" fill="#78716c"/><rect x="18" y="16" width="${CX-4}" height="7" rx="2" fill="#78716c"/>
      <path d="M${CX} 23 L${CX} ${TOP}" stroke="${INK}" stroke-width="2.5"/>
      <g id="mfruler"></g><g id="mfscale"></g><g id="mforig"></g><g id="mfgap"></g><g id="mfbricks"></g><g id="mfspring"></g><g id="mfhook"></g><g id="mfcal"></g><g id="mfcalc"></g>
      <rect x="470" y="400" width="200" height="8" rx="2" fill="#a8a29e"/><g id="mfpile" class="hk-grab"></g><g id="mftags"></g>
      <g id="mfptr" class="hk-grab"></g><g id="mfitems"></g><g id="mfban"></g><g id="mfbtn"></g></svg></div>
      <p class="hint" style="margin:6px 0 0"><b>Estimated values:</b> this demo spring is <b>set</b> to stretch <b>2 cm per newton</b>. Real springs are different.</p>`;
    const $=s=>el.querySelector(s), svg=$('#mfsvg'), yOf=cm=>TOP+cm*PX, box=()=>BOX[bi], B=s=>s.replace(/<([^>]+)>/g,'<tspan font-weight="700">$1</tspan>');
    let r=`<rect x="${RX-36}" y="${TOP-8}" width="36" height="${25*PX+16}" rx="2" fill="#f3e2b3" stroke="#a16207" stroke-width="1.2"/>`;
    for(let c=0;c<=25;c++){ const y=yOf(c); r+=`<line x1="${c%5?RX-8:RX-14}" y1="${y}" x2="${RX}" y2="${y}" stroke="#7c5a12" stroke-width="${c%5?.8:1.3}"/>`+(c%5?'':`<text x="${RX-33}" y="${y+4.5}" font-size="12" class="mono" fill="#5b420c">${c}</text>`); }
    $('#mfruler').innerHTML=r+`<text x="${RX-18}" y="${yOf(25)+24}" text-anchor="middle" font-size="13" fill="${MUTED}">cm</text>`;
    $('#mforig').innerHTML=`<line x1="${RX}" y1="${yOf(L0)}" x2="${CX+40}" y2="${yOf(L0)}" stroke="${OK}" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${CX+22}" y="${yOf(L0)-7}" font-size="13" font-weight="700" fill="${OK}" ${halo}>original length 5 cm</text>`;
    // prompt on the diagram (top right)
    function ban(html,bad){ $('#mfban').innerHTML=`<foreignObject x="290" y="2" width="384" height="84"><div xmlns="http://www.w3.org/1999/xhtml" style="font:15px/1.4 Inter,'Segoe UI',sans-serif;color:${bad?BAD:INK};border-left:4px solid ${bad?BAD:'var(--accent)'};background:${bad?'#fef2f2':'var(--accent-soft)'};padding:7px 10px">${html}</div></foreignObject>`; }
    function button(label,fn){ if(!label) return; const f=$('#mfban div'); f.insertAdjacentHTML('beforeend',` <button class="btn small" id="mfgo" style="margin-left:6px">${label}</button>`); $('#mfgo').onclick=fn; }
    // things on the shelf
    const HOME={w:{x:495,y:366}}; BOX.forEach((b,i)=>HOME[b.id]={x:i<3?545+i*45:495,y:360});
    const items={};
    const mk=(id,html,show=true)=>{ const g=el$('g',{class:'hk-grab',transform:`translate(${HOME[id].x} ${HOME[id].y})`}); g.innerHTML=`<g>${html}</g>`; if(!show) g.style.display='none'; $('#mfitems').appendChild(g); items[id]=g; return g; };
    mk('w',`<rect x="-20" y="0" width="40" height="34" rx="3" fill="#64748b" stroke="${INK}"/><rect x="-16" y="3" width="32" height="3" rx="1" fill="#fff" opacity=".35"/><text x="0" y="23" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">1 N</text>`);
    BOX.forEach(b=>mk(b.id,`<rect x="-20" y="-6" width="40" height="40" rx="3" fill="${b.col}" stroke="${INK}"/><path d="M-20 4 h40" stroke="#000" opacity=".2"/><text x="0" y="17" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${b.id}</text><text x="0" y="30" text-anchor="middle" font-size="11" fill="#fff">? N</text>`,b.id!=='D'));
    const setLen=bouncer(()=>len,v=>len=v,()=>{ drawSpring(); if(hung) items[hung].setAttribute('transform',`translate(${CX} ${yOf(len)+(hung==='w'?24:30)})`); });
    function drawSpring(){ const b=yOf(len), want=!hung&&(st==='cal'||st==='hang'||st==='final');
      $('#mfspring').innerHTML=coil(CX,TOP,b)+`<line x1="${CX-11}" y1="${b}" x2="${CX+11}" y2="${b}" stroke="${BLUE}" stroke-width="2.5"/>`;
      $('#mfhook').innerHTML=`<path d="M${CX} ${b} l0 8 q0 9 -7 9 q-6 0 -6 -6" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
        +(want?`<circle cx="${CX}" cy="${b+30}" r="30" fill="none" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 3" class="hk-ant"/><text x="${CX+36}" y="${b+35}" font-size="14" font-weight="700" fill="${BLUE}" ${halo}>hang it here</text>`:'');
      if(st==='end') $('#mfspring').innerHTML+=`<line x1="${RX+50}" y1="${b}" x2="${CX-11}" y2="${b}" stroke="${BLUE}" stroke-width="2"/>`;
      if((st==='final'||st==='end')&&hung) $('#mfscale').querySelectorAll('[data-k]').forEach(t=>t.classList.toggle('hk-pulse',+t.dataset.k*PER+L0===Math.round(len))); }
    function wig(){ Object.entries(items).forEach(([id,g])=>{ const want=hung!==id&&((st==='cal'&&id==='w')||((st==='hang'||st==='final')&&id===box().id)); g.firstElementChild.classList.toggle('hk-wig',want); }); }
    // reading pointer
    const ptr=$('#mfptr');
    function drawPtr(){ if(st!=='read'){ ptr.innerHTML=''; return; } const y=yOf(reading);
      ptr.innerHTML=`<line x1="${RX}" y1="${y}" x2="${CX+26}" y2="${y}" stroke="${BLUE}" stroke-width="2" stroke-dasharray="4 3"/>
        <g ${moved?'':'class="hk-wig"'}><path d="M${RX} ${y} l16 -12 h38 v24 h-38 z" fill="${BLUE}"/><text x="${RX+36}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${reading}</text></g>`
        +(moved?'':`<text x="${RX+60}" y="${y-18}" font-size="14" font-weight="700" fill="${BLUE}" ${halo}>drag me ↓</text>`); }
    K.svgDrag(ptr,svg,{move(x,y){ if(st!=='read') return; moved=true; reading=Math.max(0,Math.min(25,Math.round((y-TOP)/PX))); drawPtr(); },
      end(){ if(st!=='read'||!moved) return; const L=L0+box().f*PER;
        if(reading===L){ st='fill'; ptr.innerHTML=''; drawRead(); prompt(); setTimeout(()=>drawCal(true),400); }
        else ban(reading<L?'Too high. Line the pointer up with the <b>blue line at the bottom</b> of the spring.':'Too low. Line the pointer up with the <b>blue line at the bottom</b> of the spring.',true); }});
    // the measured length and the extension sum, beside the spring
    // step 1 result stays on the diagram: where 2 cm per N comes from
    function drawCal(flash){ if(!found.cal&&st!=='calshow'){ $('#mfcal').innerHTML=''; return; }
      $('#mfcal').innerHTML=`<g id="mfcalg"><rect x="290" y="112" width="300" height="72" rx="3" fill="#f0fdfa" stroke="${CAL}" stroke-width="1.8"/>
        <text x="302" y="131" font-size="12" class="mono" fill="${CAL}">STEP 1 · A KNOWN FORCE: 1 N</text>
        <text x="302" y="152" font-size="14">extension = <tspan fill="${BLUE}">7</tspan> − <tspan fill="${OK}">5</tspan> = <tspan font-weight="700">2 cm</tspan></text>
        <text x="302" y="173" font-size="15" font-weight="700" fill="${CAL}">so 1 N stretches it 2 cm: 2 cm per N</text></g>`;
      if(flash) $('#mfcalg').animate([{opacity:.25},{opacity:1},{opacity:.4},{opacity:1}],{duration:1100}); }
    function drawRead(){ const b=box(), e=b.f*PER, L=L0+e, y=yOf(L);
      let s=`<line x1="${RX}" y1="${y}" x2="${CX-12}" y2="${y}" stroke="${BLUE}" stroke-width="2"/><path d="M${RX} ${y} l12 -9 h30 v18 h-30 z" fill="${BLUE}"/><text x="${RX+27}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${L}</text>`;
      const cy=Math.max(206,(yOf(L0)+y)/2-60), x=CX+52, hd=(yy,t)=>`<text x="0" y="${yy}" font-size="12" class="mono" fill="${MUTED}">${t}</text>`;
      s+=`<g transform="translate(${x} ${cy})">`+hd(0,`STEP 2 · BOX ${b.id}: MEASURE THE EXTENSION`)
        +`<text x="0" y="22" font-size="14">extension = measured length − original length</text>
        <text x="0" y="46" font-size="17" font-weight="700">= <tspan fill="${BLUE}">${L}</tspan> − <tspan fill="${OK}">${L0}</tspan> = <tspan fill="${OK}">${e} cm</tspan></text>`
        +hd(78,'STEP 3 · WORK OUT THE FORCE')
        +`<text x="0" y="100" font-size="14">force = extension ÷ <tspan font-weight="700" fill="${CAL}">2 cm per N</tspan> <tspan fill="${CAL}" font-size="12">(from step 1)</tspan></text>`
        +(bricks===b.f?`<text x="0" y="126" font-size="18" font-weight="700">= ${e} ÷ 2 = <tspan fill="${b.col}">${b.f} N</tspan></text>`
          :`<text x="0" y="126" font-size="17">= ${e} ÷ 2 = <tspan font-weight="700" fill="${OK}">?</tspan></text><text x="0" y="148" font-size="13" fill="${MUTED}">${bricks?`check: ${bricks} brick${bricks>1?'s':''} = ${bricks*PER} cm = ${bricks} N so far`:'check it: fill the extension with 1 N bricks'}</text>`)+`</g>`;
      $('#mfcalc').innerHTML=s; drawBricks(); }
    // the extension gap and the 1 N bricks inside it
    const brick=(k,cls='')=>`<g class="${cls}"><rect x="${BX}" y="${yOf(L0+k*PER)+1}" width="${BW}" height="${PER*PX-2}" fill="${k%2?'#86efac':'#4ade80'}" stroke="${OK}" stroke-width="1.5"/><text x="${BX+BW/2}" y="${yOf(L0+k*PER)+PER*PX/2+5}" text-anchor="middle" font-size="12" font-weight="700" fill="#14532d">1 N</text></g>`;
    function drawBricks(){ const f=st==='fill'||st==='boxdone'?box().f:0;
      $('#mfgap').innerHTML=f?`<rect x="${BX-3}" y="${yOf(L0)}" width="${BW+6}" height="${f*PER*PX}" fill="#f0fdf4" stroke="${OK}" stroke-width="2" stroke-dasharray="6 4" ${bricks<f?'class="hk-ant"':''}/>`:'';
      let s=''; for(let k=0;k<bricks;k++) s+=brick(k)+`<text x="${BX+BW+6}" y="${yOf(L0+(k+1)*PER)-6}" font-size="13" font-weight="700" fill="${OK}" ${halo}>${k+1} N</text>`;
      $('#mfbricks').innerHTML=s; }
    // the pile of bricks to drag from
    const PH={x:300,y:372}, pile=$('#mfpile');
    function drawPile(){ const on=st==='fill';
      pile.style.display=found.cal&&st!=='scale'&&st!=='final'&&st!=='end'?'':'none'; pile.setAttribute('transform',`translate(${PH.x} ${PH.y})`);
      pile.innerHTML=`<g ${on&&bricks===0?'class="hk-wig"':''}><rect x="-4" y="6" width="${BW}" height="${PER*PX-2}" fill="#4ade80" stroke="${OK}" stroke-width="1.5" opacity=".5"/><rect x="0" y="0" width="${BW}" height="${PER*PX-2}" fill="#4ade80" stroke="${OK}" stroke-width="1.5"/><text x="${BW/2}" y="${PER*PX/2+4}" text-anchor="middle" font-size="12" font-weight="700" fill="#14532d">1 N</text></g>
        <text x="${BW+10}" y="10" font-size="13" font-weight="700" fill="${OK}">1 N brick</text><text x="${BW+10}" y="27" font-size="13" fill="${MUTED}">= 2 cm of stretch</text>`; }
    grab(pile,svg,{home:()=>PH,can:()=>st==='fill',drop(x,y){ const f=box().f;
      if(Math.abs(x+BW/2-(BX+BW/2))>70||y<yOf(L0)-50||y>yOf(L0+f*PER)+40) return false;
      if(bricks>=f){ ban('The extension is already full.',true); return false; }
      bricks++; pile.setAttribute('transform',`translate(${PH.x} ${PH.y})`); drawRead();
      if(bricks===f){ st='boxdone'; found[box().id]=1; items[box().id].querySelector('text:last-child').textContent=box().f+' N'; prompt(); } else prompt(); return true; }});
    // force scale tags
    function drawScale(){ let s=''; const show=st==='scale'||st==='final'||st==='end';
      if(show) for(let k=0;k<=6;k++){ const y=yOf(L0+k*PER), has=k===0||k<=tags||(tags>=3);
        s+=has?`<g data-k="${k}"><rect x="${RX+6}" y="${y-11}" width="44" height="22" rx="2" fill="#fff" stroke="${BLUE}" stroke-width="1.5"/><text x="${RX+28}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="700" fill="${BLUE}">${k} N</text></g>`
          :`<rect x="${RX+6}" y="${y-11}" width="44" height="22" rx="2" fill="#fff" stroke="${MUTED}" stroke-dasharray="4 3" ${k===tags+1?'class="hk-ant"':''}/>`; }
      $('#mfscale').innerHTML=s; }
    const TH=k=>({x:300+(k-1)*62,y:240});
    function drawTags(){ const g=$('#mftags'); g.innerHTML=''; if(st!=='scale') return;
      for(let k=tags+1;k<=3;k++){ const t=el$('g',{class:'hk-grab',transform:`translate(${TH(k).x} ${TH(k).y})`}); t.innerHTML=`<g ${k===tags+1?'class="hk-wig"':''}><rect x="0" y="0" width="50" height="26" rx="2" fill="#fff" stroke="${BLUE}" stroke-width="1.8" stroke-dasharray="4 2"/><text x="25" y="18" text-anchor="middle" font-size="14" font-weight="700" fill="${BLUE}">${k} N</text></g>`; g.appendChild(t);
        grab(t,svg,{home:()=>TH(k),drop(x,y){ if(x>RX+80) return false; const cm=(y+13-TOP)/PX, want=L0+k*PER;
          if(Math.abs(cm-want)>1){ ban((k===1?'1 N stretches it 2 cm':`1 N stretches it 2 cm, so <b>${k} N</b> stretches it ${k*PER} cm`)+`: the <b>${k} N</b> mark goes at 5 + ${k*PER} = <b>${want} cm</b>.`,true); return false; }
          if(k!==tags+1){ ban(`Start with <b>${tags+1} N</b>.`,true); return false; }
          tags++; drawScale(); drawTags(); if(tags===3){ st='final'; bi=3; items.w.style.display='none'; items.D.style.display=''; drawSpring(); } prompt(); return true; }}); } }
    function prompt(){ const b=box(); button('');
      if(st==='cal') ban('Hang the <b>1 N</b> weight on the spring. How far does <b>1 N</b> stretch it?');
      else if(st==='calshow') ban('<b>1 N</b> stretches it <b>2 cm</b>. So every <b>2 cm</b> of extension is <b>1 N</b>: a green <b>1 N brick</b>.');
      else if(st==='hang') ban(`Now hang <b>box ${b.id}</b>. How big is its force?`);
      else if(st==='read') ban('Drag the <b>blue pointer</b> to the bottom of the spring to measure its length.');
      else if(st==='fill') ban(bricks?`<b>${bricks} N</b> so far. Keep filling the extension.`:'Drag <b>1 N bricks</b> into the green gap until the <b>extension</b> is full.');
      else if(st==='boxdone'){ ban(`<b>Box ${b.id} = ${b.f} N.</b> `+(b.id==='B'?'B stretched it <b>double</b> A’s, so its force is <b>double</b>.':b.id==='C'?'Three boxes measured. Now turn the ruler into a <b>force scale</b>.':''));
        button(bi<2?'Next box →':'Make a scale →',next); }
      else if(st==='scale') ban(tags?`Good. Now <b>${tags+1} N</b>.`:'Drag <b>1 N</b> to the ruler mark where the spring’s bottom would be with 1 N on it.');
      else if(st==='final') ban('Your <b>force scale</b>: every 1 N adds 2 cm. Hang <b>box D</b> and read its force straight off the scale.');
      else if(st==='end'){ ban(`<b>Box D = 4 N</b>, read straight off your scale. The spring’s <b>extension measures the force</b>.`); button('Start again',()=>{ measure(el); }); }
      wig(); drawPile(); drawPtr(); }
    function next(){ const b=box(); hung=null; back(items[b.id],HOME[b.id]); items[b.id].style.opacity=.45; setLen(L0); bricks=0; moved=false; reading=0;
      $('#mfcalc').innerHTML=''; if(bi===2){ st='scale'; drawScale(); drawTags(); } else { bi++; st='hang'; } drawBricks(); prompt(); }
    // hanging things on the hook
    Object.entries(items).forEach(([id,g])=>grab(g,svg,{home:()=>HOME[id],
      can:()=>hung!==id&&!found[id]&&!(id==='w'&&found.cal),
      drop(x,y){ const h={x:CX,y:yOf(len)+30}; if(Math.hypot(x-h.x,y-h.y)>75) return false;
        if(st==='cal'&&id!=='w'){ ban('First hang the <b>1 N</b> weight, so you know how far 1 N stretches it.',true); return false; }
        if((st==='hang'||st==='final')&&id!==box().id){ ban(`Hang <b>box ${box().id}</b> next.`,true); return false; }
        if(!['cal','hang','final'].includes(st)) return false;
        hung=id; g.setAttribute('transform',`translate(${CX} ${yOf(len)+(id==='w'?24:30)})`);
        if(id==='w'){ st='calshow'; setLen(L0+PER); prompt(); setTimeout(()=>drawCal(true),900);
          setTimeout(()=>{ if(!el.isConnected) return; $('#mfbricks').innerHTML=brick(0); },700);
          setTimeout(()=>{ if(!el.isConnected) return; found.cal=1; drawCal(); hung=null; back(g,HOME.w); g.style.opacity=.45; setLen(L0); $('#mfbricks').innerHTML=''; st='hang'; prompt(); },3400); }
        else if(st==='final'){ setLen(L0+box().f*PER); setTimeout(()=>{ st='end'; items.D.querySelector('text:last-child').textContent='4 N'; prompt(); drawSpring(); },900); }
        else { setLen(L0+box().f*PER); st='read'; prompt(); }
        wig(); return true; }}));
    drawSpring(); drawBricks(); drawScale(); prompt();
  }

  /* ---------------- Elastic band results (class data) ---------------- */
  function band(el){
    const D=[50,75,102,130,161,193,224,252,275], TOP=34, CX=128, RX=72;   // 1 svg unit per mm
    let n=0, ext=[0], len=50, wait=false;
    el.innerHTML=`<div class="stage" style="padding:6px"><svg viewBox="0 0 720 480" id="ebsvg" style="max-height:min(680px,84vh)" aria-label="An elastic band with weights, a results table and a graph">
      <rect x="10" y="464" width="200" height="10" rx="2" fill="#57534e"/><rect x="18" y="12" width="7" height="454" fill="#78716c"/><rect x="18" y="14" width="124" height="7" rx="2" fill="#78716c"/>
      <g id="ebruler"></g><g id="ebband"></g><g id="ebcalc"></g><g id="ebtable"></g><g id="ebgraph"></g><g id="ebchk"></g><g id="ebmsg"></g><g id="ebchips"></g><g id="ebw" class="hk-grab"></g></svg></div>
      <p class="hint" style="margin:6px 0 0">These are <b>your class results</b> for an elastic band (lengths in mm).</p>`;
    const $=s=>el.querySelector(s), svg=$('#ebsvg'), y=mm=>TOP+mm;
    let r=`<rect x="${RX-34}" y="${TOP-8}" width="38" height="316" rx="2" fill="#f3e2b3" stroke="#a16207" stroke-width="1.2"/>`;
    for(let m=0;m<=300;m+=10){ r+=`<line x1="${m%50?RX-8:RX-14}" y1="${y(m)}" x2="${RX+4}" y2="${y(m)}" stroke="#7c5a12" stroke-width="${m%50?.8:1.3}"/>`+(m%50?'':`<text x="${RX-31}" y="${y(m)+4.5}" font-size="12" class="mono" fill="#5b420c">${m}</text>`); }
    $('#ebruler').innerHTML=r+`<text x="${RX-15}" y="${y(300)+24}" text-anchor="middle" font-size="13" fill="${MUTED}">mm</text>`;
    function drawBand(){ const b=y(len), W=7;
      const stack=Array.from({length:n},(_,i)=>`<rect x="${CX-22}" y="${b+16+i*9}" width="44" height="8" rx="2" fill="#64748b" stroke="${INK}" stroke-width=".8"/>`).join('');
      $('#ebband').innerHTML=`<path d="M${CX} 21 L${CX} ${TOP}" stroke="${INK}" stroke-width="2.5"/><rect x="${CX-W/2}" y="${TOP}" width="${W}" height="${len}" rx="3.5" fill="none" stroke="#b45309" stroke-width="3.2"/>
        <path d="M${CX} ${b} l0 14" stroke="${INK}" stroke-width="2"/><line x1="${CX-24}" y1="${b+14}" x2="${CX+24}" y2="${b+14}" stroke="${INK}" stroke-width="2.5"/>${stack}
        <line x1="${RX+4}" y1="${b}" x2="${CX-6}" y2="${b}" stroke="${BLUE}" stroke-width="1.6"/><line x1="${RX+4}" y1="${y(50)}" x2="${CX+14}" y2="${y(50)}" stroke="${OK}" stroke-width="1.3" stroke-dasharray="5 4"/><text x="${CX+10}" y="${y(50)-6}" font-size="12" font-weight="700" fill="${OK}" ${halo}>original</text>
        ${n?`<text x="${CX+30}" y="${b+28+n*4.5}" font-size="14" font-weight="700" ${halo}>${n} N</text>`:''}
        ${n<8&&!wait?`<circle cx="${CX}" cy="${b+34+n*9}" r="26" fill="none" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 3" class="hk-ant"/>`:''}`; }
    const setLen=bouncer(()=>len,v=>len=v,drawBand);
    // table
    const TX=226, rowY=i=>84+i*30;
    function table(){ let s=`<rect x="${TX}" y="40" width="226" height="${30*9+40}" rx="3" fill="#fff" stroke="${LINE}"/>
      <text x="${TX+30}" y="62" text-anchor="middle" font-size="12" class="mono" fill="${MUTED}">FORCE</text><text x="${TX+104}" y="62" text-anchor="middle" font-size="12" class="mono" fill="${MUTED}">LENGTH</text><text x="${TX+184}" y="62" text-anchor="middle" font-size="12" class="mono" fill="${MUTED}">EXTENSION</text>
      <line x1="${TX+60}" y1="44" x2="${TX+60}" y2="${30*9+76}" stroke="${LINE}"/><line x1="${TX+146}" y1="44" x2="${TX+146}" y2="${30*9+76}" stroke="${LINE}"/>`;
      for(let i=0;i<=8;i++){ const yy=rowY(i)+12, on=i===n&&wait;
        if(on) s+=`<rect x="${TX+2}" y="${rowY(i)-8}" width="222" height="28" fill="#eff6ff"/>`;
        s+=`<text x="${TX+30}" y="${yy}" text-anchor="middle" font-size="14" fill="${i<=n?INK:LINE}">${i} N</text>`;
        if(i<=n) s+=`<text x="${TX+104}" y="${yy}" text-anchor="middle" font-size="14" fill="${BLUE}">${D[i]}</text>`;
        if(ext[i]!==undefined) s+=`<text x="${TX+184}" y="${yy}" text-anchor="middle" font-size="14" font-weight="700" fill="${OK}">${ext[i]}</text>`;
        else if(on) s+=`<rect id="ebslot" x="${TX+156}" y="${rowY(i)-6}" width="56" height="24" rx="2" fill="#fff" stroke="${BLUE}" stroke-width="2" stroke-dasharray="5 3" class="hk-ant"/><text x="${TX+184}" y="${yy}" text-anchor="middle" font-size="14" font-weight="700" fill="${BLUE}">?</text>`; }
      $('#ebtable').innerHTML=s; }
    // graph: force 0-8 N across, extension 0-250 mm up
    const GX=500, GY=300, gx=f=>GX+f*24, gy=e=>GY-e*1.0;
    function graph(){ let s=`<line x1="${GX}" y1="${GY}" x2="${GX}" y2="${GY-260}" stroke="${INK}"/><line x1="${GX}" y1="${GY}" x2="${gx(8)+12}" y2="${GY}" stroke="${INK}"/>
      <text x="${gx(4)}" y="${GY+36}" text-anchor="middle" font-size="14" fill="${MUTED}">force (N)</text><text x="${GX-40}" y="${GY-125}" transform="rotate(-90 ${GX-40} ${GY-125})" text-anchor="middle" font-size="14" fill="${MUTED}">extension (mm)</text>`;
      for(let f=0;f<=8;f+=2) s+=`<text x="${gx(f)}" y="${GY+18}" text-anchor="middle" font-size="13" class="mono">${f}</text>`;
      for(let e=50;e<=250;e+=50) s+=`<text x="${GX-6}" y="${gy(e)+4}" text-anchor="end" font-size="13" class="mono">${e}</text><line x1="${GX}" y1="${gy(e)}" x2="${gx(8)}" y2="${gy(e)}" stroke="${LINE}" stroke-width=".6"/>`;
      ext.forEach((e,f)=>s+=`<path transform="translate(${gx(f)} ${gy(e)})" d="M-5 -5L5 5M-5 5L5 -5" stroke="${INK}" stroke-width="2.2"/>`);
      $('#ebgraph').innerHTML=s; }
    // chips to drag into the extension cell
    let chips=[];
    function makeChips(){ const i=n, right=D[i]-50, alt=i===1?D[2]-50:D[i]-D[i-1];
      const vals=[right,D[i],alt].sort((a,b)=>a-b); $('#ebchips').innerHTML=''; chips=[];
      $('#ebcalc').innerHTML=`<g transform="translate(${TX} 382)"><text x="0" y="0" font-size="13" fill="${MUTED}">extension = measured length − original length</text>
        <text x="0" y="24" font-size="16" font-weight="700"><tspan fill="${BLUE}">${D[i]}</tspan> − <tspan fill="${OK}">50</tspan> = ?</text><text x="${110}" y="24" font-size="13" fill="${BLUE}" font-weight="700">drag the answer into the table ↑</text></g>`;
      vals.forEach((v,k)=>{ const home={x:TX+k*66,y:418}; const g=el$('g',{class:'hk-grab',transform:`translate(${home.x} ${home.y})`});
        g.innerHTML=`<g class="${k===vals.indexOf(right)&&false?'':''}"><rect x="0" y="0" width="56" height="30" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.5" stroke-dasharray="4 2"/><text x="28" y="20" text-anchor="middle" font-size="15" font-weight="700">${v}</text></g>`;
        $('#ebchips').appendChild(g); chips.push(g);
        grab(g,svg,{home:()=>home,drop(x,yy){ const sl=$('#ebslot'); if(!sl) return false; const sx=+sl.getAttribute('x'), sy=+sl.getAttribute('y');
          if(Math.abs(x+28-(sx+28))>60||Math.abs(yy+15-(sy+12))>34) return false;
          if(v!==right){ msg(v===D[i]?`${v} is the <measured length>. Take away the original 50 mm.`:i===1?`${v} is the extension for the <next row>. Check you are on the ${i} N row.`:`${v} is how much it grew since the <last row>. Measure from the original 50 mm.`); return false; }
          done(); return true; }}); });
      chips[0]&&chips[0].firstElementChild.classList.add('hk-wig'); }
    function msg(s){ $('#ebmsg').innerHTML=s?`<text x="${TX}" y="472" font-size="14" fill="${BAD}">${s.replace(/<([^>]+)>/g,'<tspan font-weight="700">$1</tspan>')}</text>`:''; }
    function done(){ ext[n]=D[n]-50; wait=false; msg(''); $('#ebchips').innerHTML=''; $('#ebcalc').innerHTML=''; table(); graph(); drawBand();
      const p=$('#ebgraph').lastElementChild; p&&p.animate([{opacity:0},{opacity:1}],{duration:400});
      if(n===8) check(); else hint(); }
    function hint(){ $('#ebcalc').innerHTML=`<text x="${TX}" y="420" font-size="14" font-weight="700" fill="${BLUE}">← drag the next 1 N weight onto the hanger</text>`; }
    // doubling check once the table is full
    function check(){ const row=(a,b,yy)=>`<text x="${GX-30}" y="${yy}" font-size="14">${a} N → <tspan font-weight="700">${ext[a]}</tspan>, ${b} N → <tspan font-weight="700">${ext[b]}</tspan></text><text x="${GX-30}" y="${yy+19}" font-size="13" fill="${MUTED}">double ${ext[a]} = ${ext[a]*2}, not ${ext[b]}</text>`;
      $('#ebchk').innerHTML=`<text x="${GX-30}" y="30" font-size="12" class="mono" fill="${MUTED}">DOES THE EXTENSION DOUBLE?</text>`
        +[2,4,8].map(f=>`<circle cx="${gx(f)}" cy="${gy(ext[f])}" r="10" fill="none" stroke="${BLUE}" stroke-width="2.2"/>`).join('')
        +row(2,4,364)+row(4,8,410)+`<text x="${GX-30}" y="458" font-size="14" font-weight="700">Close, but <tspan fill="${BAD}">not exactly</tspan> double.</text>`;
      $('#ebcalc').innerHTML=`<text x="${TX}" y="420" font-size="14" font-weight="700" fill="${OK}">✓ Table complete</text><text x="${TX}" y="442" font-size="13" fill="${MUTED}">extension at 0 N is always 0</text>`; }
    // the 1 N weight to drag
    const WH={x:150,y:440}, wg=$('#ebw');
    function drawW(){ wg.setAttribute('transform',`translate(${WH.x} ${WH.y})`); wg.innerHTML=n<8?`<g class="${n===0?'hk-wig':''}"><rect x="-22" y="-6" width="44" height="18" rx="2" fill="#64748b" stroke="${INK}"/><text x="0" y="8" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">1 N</text></g><text x="28" y="8" font-size="12" fill="${MUTED}">×${8-n}</text>`:''; }
    grab(wg,svg,{home:()=>WH,can:()=>n<8&&!wait,drop(x,yy){ const b=y(len); if(Math.abs(x-CX)>60||yy<b-40||yy>b+130) return false;
      n++; wait=true; drawW(); setLen(D[n]); table(); makeChips(); return true; }});
    // when the weight can't be used yet, say why
    wg.addEventListener('pointerdown',()=>{ if(wait) msg('First drag the extension for this row into the table.'); });
    drawBand(); table(); graph(); drawW(); hint();
  }

  /* ---------------- Results detective ---------------- */
  const REASONS=[{id:'lim',t:'Spring over its elastic limit'},{id:'wt',t:'Incorrect weight'},{id:'math',t:'Incorrect maths'},{id:'eq',t:'Incorrect use of equipment'}];
  const ok=f=>f*20;   // demo spring: 20 mm per newton
  const CASES=[
    {r:'wt',note:'One of the weights came from a <b>different set</b>.',pts:f=>f===4?100:ok(f),fix:f=>f===4?{f:5,e:100}:null,
      wrong:'Only <b>one</b> point is off. Read the note again.',why:'That “4 N” weight was really <b>5 N</b>. Move the point to 5 N and it sits on the line.'},
    {r:'math',note:'Table: 0 N → length <b>50</b>, extension <b>20</b>. 1 N → length <b>70</b>, extension <b>40</b>.',pts:f=>ok(f)+20,fix:f=>({f,e:ok(f)}),
      wrong:'Look at the note: is 70 − 50 really 40?',why:'Extension = measured − original. <b>70 − 50 = 20</b>, not 40. Fixed, the line goes through (0,0).'},
    {r:'eq',note:'From 5 N on, the <b>ruler slipped</b> down by 10 mm.',pts:f=>f>=5?ok(f)-10:ok(f),fix:f=>f>=5?{f,e:ok(f)}:null,
      wrong:'Every point after the slip is off by the <b>same</b> amount. What slipped?',why:'The ruler moved, so every reading after it was 10 mm short. Read correctly, they sit on the line.'},
    {r:'lim',note:'After the weights came off, the spring <b>stayed longer</b> than at the start.',pts:f=>f<=6?ok(f):f===7?165:215,fix:()=>null,
      wrong:'The spring <b>stayed longer</b> afterwards. What does that tell you?',why:'Past its <b>elastic limit</b> the spring stops obeying Hooke’s law: the graph bends away and it won’t go back.'}
  ];
  function detective(el,U){
    let ci=0, solved=false;
    el.innerHTML=`<div id="dtban" style="border-left:4px solid var(--accent);background:var(--accent-soft);padding:8px 12px;margin:0 0 8px;font-size:1rem;border-radius:2px"></div>
      <div class="pool" id="dtpool" style="margin-bottom:8px"></div>
      <div class="stage" id="dtstage"><svg viewBox="0 0 640 410" id="dtsvg" style="max-height:min(600px,72vh)" aria-label="Force–extension graph of a set of results"><g id="dtg"></g><g id="dtp"></g><g id="dtmsg"></g></svg></div>
      <p class="hint" style="margin:6px 0 0"><b>Estimated values:</b> made-up results for a spring that stretches <b>20 mm per newton</b>.</p>`;
    const $=s=>el.querySelector(s), GX=90, GY=355, gx=f=>GX+f*56, gy=e=>GY-e*1.1;
    let g=`<line x1="${GX}" y1="${GY}" x2="${GX}" y2="${gy(225)}" stroke="${INK}"/><line x1="${GX}" y1="${GY}" x2="${gx(8)+20}" y2="${GY}" stroke="${INK}"/>
      <text x="${gx(4)}" y="${GY+40}" text-anchor="middle" font-size="15" fill="${MUTED}">force (N)</text><text x="${GX-52}" y="${GY-100}" transform="rotate(-90 ${GX-52} ${GY-100})" text-anchor="middle" font-size="15" fill="${MUTED}">extension (mm)</text>`;
    for(let f=0;f<=8;f++) g+=`<text x="${gx(f)}" y="${GY+20}" text-anchor="middle" font-size="13" class="mono">${f}</text>`;
    for(let e=40;e<=200;e+=40) g+=`<text x="${GX-8}" y="${gy(e)+4}" text-anchor="end" font-size="13" class="mono">${e}</text><line x1="${GX}" y1="${gy(e)}" x2="${gx(8)}" y2="${gy(e)}" stroke="${LINE}" stroke-width=".6"/>`;
    $('#dtg').innerHTML=g+`<g id="dtline"></g><g id="dtzone"></g>`;
    const cap=e=>Math.min(e,225);
    const P=Array.from({length:9},(_,f)=>{ const p=el$('g',{}); p.innerHTML=`<path d="M-6 -6L6 6M-6 6L6 -6" stroke-width="2.6"/>`; $('#dtp').appendChild(p); return p; });
    let cur=[];
    function place(pts,anim){ const from=cur.slice(); cur=pts; const st=performance.now();
      const run=t=>{ const k=anim?Math.min(1,(t-st)/900):1, q=k<.5?2*k*k:1-(-2*k+2)**2/2;
        pts.forEach((p,f)=>{ const a=from[f]||p, x=gx(a.f+(p.f-a.f)*q), y=gy(cap(a.e+(p.e-a.e)*q)); P[f].setAttribute('transform',`translate(${x} ${y})`); P[f].firstElementChild.setAttribute('stroke',p.bad&&!solved?BAD:INK); });
        if(k<1&&el.isConnected) requestAnimationFrame(run); }; requestAnimationFrame(run); }
    const chips=REASONS.map(r=>{ const c=U.h('div',{class:'chip dragme','data-r':r.id},r.t); $('#dtpool').appendChild(c);
      Engine.drag(c,{targets:'#dtstage',onDrop:()=>drop(r.id,c)}); return c; });
    function say(s,col){ $('#dtmsg').innerHTML=s?`<foreignObject x="${GX+10}" y="4" width="${gx(8)-GX-10}" height="100"><div xmlns="http://www.w3.org/1999/xhtml" style="font:15px/1.35 Inter,'Segoe UI',sans-serif;color:${col};background:${PAPER};border:1.5px solid ${col};padding:6px 9px;border-radius:3px">${s}</div></foreignObject>`:''; }
    function show(){ const c=CASES[ci]; solved=false; $('#dtline').innerHTML=''; $('#dtzone').innerHTML=''; say('');
      $('#dtban').innerHTML=`<span class="mono" style="font-size:.8rem;color:var(--accent)">CASE ${ci+1} OF ${CASES.length} &nbsp;${CASES.map((_,i)=>i<ci?'●':i===ci?'◉':'○').join(' ')}</span><div>${c.note} <b>Why don’t these results follow Hooke’s law?</b> Drag the reason onto the graph.</div>`;
      place(Array.from({length:9},(_,f)=>{ const e=c.pts(f); return {f,e,bad:e!==ok(f)}; }),ci>0);
      const free=chips.filter(x=>!x.classList.contains('ok')); if(free[0]) K.cue(free[0],{host:el,ring:true,to:$('#dtstage')}); }
    function drop(id,chip){ const c=CASES[ci]; if(solved) return false;
      if(id!==c.r){ say(c.wrong,BAD); return false; }
      solved=true; chip.classList.add('ok'); chip.style.display='none';
      const fixed=Array.from({length:9},(_,f)=>{ const m=c.fix(f); return m?{f:m.f,e:m.e}:{f,e:c.pts(f)}; });
      place(fixed,true);
      setTimeout(()=>{ if(!el.isConnected) return;
        if(c.r==='lim') $('#dtzone').innerHTML=`<rect x="${gx(6)+4}" y="${gy(225)}" width="${gx(8)-gx(6)+12}" height="${GY-gy(225)}" fill="#fee2e2" opacity=".6"/><line x1="${gx(6)}" y1="${GY}" x2="${gx(6)}" y2="${gy(225)}" stroke="${BAD}" stroke-dasharray="5 4"/><text x="${gx(6)+8}" y="${GY-12}" font-size="14" font-weight="700" fill="${BAD}" ${halo}>past the elastic limit</text>`;
        $('#dtline').innerHTML=`<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(c.r==='lim'?6:8)}" y2="${gy(ok(c.r==='lim'?6:8))}" stroke="${OK}" stroke-width="2" opacity=".7"/>`;
        say(`<b style="color:${OK}">✓ ${REASONS.find(r=>r.id===c.r).t}.</b> <span style="color:${INK}">${c.why}</span>`+(ci<CASES.length-1?' <button class="btn small" id="dtnext" style="margin-left:6px">Next case →</button>':' <b style="color:'+INK+'">All four solved.</b>'),OK);
        const nb=$('#dtnext'); if(nb) nb.onclick=()=>{ ci++; show(); }; },950);
      return true; }
    show();
  }

  return {measure,band,detective};
})();
