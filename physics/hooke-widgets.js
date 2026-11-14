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

  /* ---------------- Measure a force ---------------- */
  function measure(el){
    const L0=5, PER=2, PX=12.5, TOP=34, CX=160, RX=64;   // cm scale: 0 cm at y=TOP
    const BOX=[{id:'A',f:3,col:'#7c3aed'},{id:'B',f:6,col:'#0e7490'},{id:'C',f:5,col:'#b45309'}];
    const OPTS={A:[3,6,11,12],B:[6,12,17,24],C:[5,10,15,20]};
    let st='cal', bi=0, len=L0, hung=null, reading=0, pick=null, found={};
    el.innerHTML=`<div class="stage" style="padding:6px"><svg viewBox="0 0 660 430" id="mfsvg" style="max-height:min(640px,80vh)" aria-label="A spring, a ruler and boxes to weigh">
      <rect x="10" y="414" width="270" height="10" rx="2" fill="#57534e"/><rect x="18" y="12" width="7" height="404" fill="#78716c"/><rect x="18" y="14" width="160" height="7" rx="2" fill="#78716c"/>
      <path d="M${CX} 21 l0 ${TOP-21}" stroke="${INK}" stroke-width="2.5"/>
      <g id="mfruler"></g><g id="mforig"></g><g id="mfspring"></g><g id="mfext"></g><g id="mfseg"></g><g id="mfhook"></g>
      <rect x="430" y="374" width="220" height="8" rx="2" fill="#a8a29e"/><g id="mfshelf"></g>
      <g id="mfcard"></g><g id="mfptr" class="hk-grab"></g><g id="mfitems"></g></svg></div>
      <p class="hint" style="margin:6px 0 0"><b>Estimated values:</b> this demo spring is <b>set</b> to stretch <b>2 cm per newton</b>. Real springs are different.</p>`;
    const $=s=>el.querySelector(s), svg=$('#mfsvg'), yOf=cm=>TOP+cm*PX;
    let r=`<rect x="${RX-30}" y="${TOP-8}" width="34" height="${25*PX+16}" rx="2" fill="#f3e2b3" stroke="#a16207" stroke-width="1.2"/>`;
    for(let c=0;c<=25;c++){ const y=yOf(c); r+=`<line x1="${c%5?RX-8:RX-14}" y1="${y}" x2="${RX+4}" y2="${y}" stroke="#7c5a12" stroke-width="${c%5?.8:1.3}"/>`+(c%5?'':`<text x="${RX-27}" y="${y+4.5}" font-size="12" class="mono" fill="#5b420c">${c}</text>`); }
    $('#mfruler').innerHTML=r+`<text x="${RX-12}" y="${yOf(25)+24}" text-anchor="middle" font-size="13" fill="${MUTED}">cm</text>`;
    $('#mforig').innerHTML=`<line x1="${RX+4}" y1="${yOf(L0)}" x2="${CX+60}" y2="${yOf(L0)}" stroke="${OK}" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${CX+26}" y="${yOf(L0)-7}" font-size="13" font-weight="700" fill="${OK}" ${halo}>original length 5 cm</text>`;
    // items: 1 N weight and three mystery boxes, persistent groups
    const HOME={w:{x:455,y:340}}; BOX.forEach((b,i)=>HOME[b.id]={x:510+i*48,y:334});
    const items={};
    const mk=(id,html)=>{ const g=el$('g',{class:'hk-grab',transform:`translate(${HOME[id].x} ${HOME[id].y})`}); g.innerHTML=html; $('#mfitems').appendChild(g); items[id]=g; return g; };
    mk('w',`<g class="hk-in"><rect x="-20" y="0" width="40" height="34" rx="3" fill="#64748b" stroke="${INK}"/><rect x="-16" y="3" width="32" height="3" rx="1" fill="#fff" opacity=".35"/><text x="0" y="23" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">1 N</text></g>`);
    BOX.forEach(b=>mk(b.id,`<g class="hk-in"><rect x="-20" y="-6" width="40" height="40" rx="3" fill="${b.col}" stroke="${INK}"/><path d="M-20 4 h40" stroke="#000" opacity=".2"/><text x="0" y="17" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${b.id}</text><text x="0" y="30" text-anchor="middle" font-size="11" fill="#fff">? N</text></g>`));
    const hookAt=()=>({x:CX,y:yOf(len)+16});
    const box=()=>BOX[bi];
    const setLen=bouncer(()=>len,v=>len=v,()=>{ drawSpring(); if(hung) items[hung].setAttribute('transform',`translate(${CX} ${yOf(len)+18})`); });
    function drawSpring(){ const b=yOf(len);
      $('#mfspring').innerHTML=coil(CX,TOP,b)+`<line x1="${CX-10}" y1="${b}" x2="${CX+10}" y2="${b}" stroke="${BLUE}" stroke-width="2.5"/>`;
      $('#mfhook').innerHTML=`<path d="M${CX} ${b} l0 8 q0 9 -7 9 q-6 0 -6 -6" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
        +(!hung&&(st==='cal'||st==='hang')?`<circle cx="${CX}" cy="${b+26}" r="30" fill="none" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 3" class="hk-ant"/><text x="${CX+36}" y="${b+31}" font-size="14" font-weight="700" fill="${BLUE}" ${halo}>hang it here</text>`:''); }
    // reading pointer on the ruler
    const ptr=$('#mfptr');
    function drawPtr(){ if(st!=='read'&&st!=='ans'&&st!=='why'){ ptr.innerHTML=''; return; } const y=yOf(reading), live=st==='read';
      ptr.innerHTML=`<line x1="${RX+4}" y1="${y}" x2="${CX+24}" y2="${y}" stroke="${BLUE}" stroke-width="2" ${live?'stroke-dasharray="4 3"':''}/>
        <g ${live&&!moved?'class="hk-wig"':''}><path d="M${RX+4} ${y} l16 -11 h34 v22 h-34 z" fill="${BLUE}"/><text x="${RX+38}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${reading}</text></g>`
        +(live&&!moved?`<text x="${RX+62}" y="${y-16}" font-size="14" font-weight="700" fill="${BLUE}" ${halo}>drag ↓ to the bottom of the spring</text>`:''); }
    let moved=false;
    K.svgDrag(ptr,svg,{start(){ if(st!=='read') return; },move(x,y){ if(st!=='read') return; moved=true; reading=Math.max(0,Math.min(25,Math.round((y-TOP)/PX))); drawPtr(); card(); },
      end(){ if(st!=='read'||!moved) return; const true_=L0+box().f*PER; if(reading===true_){ st='ans'; drawPtr(); card(); drawExt(); } else { card(reading<L0?'That is above where the spring starts. Line the pointer up with the <bottom of the spring>.':'Not quite. Line the blue pointer up with the <blue line at the bottom of the spring>.'); } }});
    function drawExt(){ if(st==='ans'||st==='why'){ const e=box().f*PER;
        $('#mfext').innerHTML=K.arrow(112,yOf(L0)+2,112,yOf(L0+e)-2,OK,3,9)+`<text x="118" y="${(yOf(L0)+yOf(L0+e))/2+5}" font-size="13" font-weight="700" fill="${OK}" ${halo}>${st==='why'?'':'ext.'}</text>`; }
      else $('#mfext').innerHTML=''; }
    // the notebook card on the right
    function card(msg){ const b=box(), e=b.f*PER, Lm=L0+e; const x=336, lines=[];
      lines.push([`<tspan font-weight="700" fill="${OK}">1 N</tspan> stretches it ${found.cal?`<tspan font-weight="700" fill="${OK}">2 cm</tspan>`:'… ?'}`]);
      if(st!=='cal'&&st!=='calshow'){
        lines.push([`<tspan font-weight="700" fill="${b.col}">Box ${b.id}</tspan>`]);
        if(st==='hang') lines.push([`<tspan fill="${MUTED}">hang box ${b.id} on the spring</tspan>`]);
        if(['read','ans','why'].includes(st)) lines.push([`measured length = <tspan font-weight="700" fill="${BLUE}">${st==='read'&&!moved?'?':reading} cm</tspan>`]);
        if(st==='ans'||st==='why'){ lines.push([`extension = measured − original`]); lines.push([`= ${Lm} − ${L0} = <tspan font-weight="700" fill="${OK}">${e} cm</tspan>`]); }
        if(st==='why') lines.push([`${e} cm ÷ 2 cm = ${b.f}, so force = <tspan font-weight="700" fill="${b.col}">${b.f} N</tspan>`]);
      }
      let s='', yy=66; lines.forEach(l=>{ s+=T(x+14,yy,l[0],'fill="'+INK+'"'); yy+=28; });
      if(st==='ans'){ s+=T(x+14,yy,`force = <tspan font-weight="700">?</tspan>  <tspan fill="${MUTED}" font-size="13">tap the right answer</tspan>`);
        OPTS[b.id].forEach((v,i)=>{ const bx=x+14+i*74, by=yy+12; s+=`<g class="hk-btn hk-pulse" data-v="${v}"><rect x="${bx}" y="${by}" width="66" height="32" rx="3" fill="#fff" stroke="${pick===v?BAD:BLUE}" stroke-width="1.8"/><text x="${bx+33}" y="${by+21}" text-anchor="middle" font-size="15" font-weight="700" fill="${INK}">${v} N</text></g>`; }); yy+=60; }
      if(st==='why'&&bi===BOX.length-1){ s+=T(x+14,yy,`<tspan font-weight="700" fill="${OK}">✓ The extension measured each force.</tspan>`); yy+=28; }
      const done=BOX.filter(q=>found[q.id]).map(q=>`<tspan font-weight="700" fill="${q.col}">${q.id} = ${q.f} N</tspan>`).join('   ');
      if(done){ s+=`<line x1="${x+14}" y1="${yy-14}" x2="${x+300}" y2="${yy-14}" stroke="${LINE}"/>`+T(x+14,yy+6,'Found:  '+done); yy+=34; }
      if(found.A&&found.B){ s+=T(x+14,yy-6,`<tspan fill="${MUTED}" font-size="13">B stretched it <tspan font-weight="700">double</tspan> A’s, so B’s force is <tspan font-weight="700">double</tspan>.</tspan>`); yy+=22; }
      if(st==='why'&&bi<BOX.length-1){ s+=`<g class="hk-btn" id="mfnext"><rect x="${x+14}" y="${yy-8}" width="126" height="32" rx="3" fill="${BLUE}"/><text x="${x+77}" y="${yy+13}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">Next box →</text></g>`; yy+=36; }
      if(msg){ s+=`<foreignObject x="${x+10}" y="${yy-8}" width="296" height="64"><div xmlns="http://www.w3.org/1999/xhtml" style="font:14px/1.35 Inter,'Segoe UI',sans-serif;color:${BAD}">${msg.replace(/<([^>]+)>/g,'<b>$1</b>')}</div></foreignObject>`; yy+=60; }
      s=`<rect x="${x}" y="14" width="314" height="${Math.max(230,yy-20)}" rx="3" fill="#fff" stroke="${LINE}"/><text x="${x+14}" y="38" font-size="12" class="mono" fill="${MUTED}">MEASURING A FORCE</text>`+s;
      $('#mfcard').innerHTML=s;
      $('#mfcard').querySelectorAll('[data-v]').forEach(g=>g.onclick=()=>answer(+g.dataset.v));
      const nx=$('#mfnext'); if(nx) nx.onclick=next;
      // wiggle what to touch next
      Object.entries(items).forEach(([id,g])=>{ const want=(st==='cal'&&id==='w')||(st==='hang'&&id===box().id); g.firstElementChild.classList.toggle('hk-wig',want&&hung!==id); });
    }
    function answer(v){ const b=box(), e=b.f*PER; pick=v;
      if(v===b.f){ st='why'; found[b.id]=1; items[b.id].querySelector('text:last-child').textContent=b.f+' N'; card(); count(); return; }
      card(v===e?`${e} is the <extension in cm>. Each 1 N stretches it 2 cm.`:v===L0+e?`${v} cm is the <measured length>, not the extension.`:`That force would stretch it ${v*PER} cm. <Divide by 2 cm per N>.`); }
    // the extension splits into 2 cm steps, one for each newton
    function count(){ const b=box(), g=$('#mfseg'); g.innerHTML=''; drawExt();
      for(let i=0;i<b.f;i++) setTimeout(()=>{ if(!el.isConnected) return; const y0=yOf(L0+i*PER), y1=yOf(L0+(i+1)*PER);
        const s=el$('g',{}); s.innerHTML=`<rect x="104" y="${y0+1}" width="16" height="${y1-y0-2}" fill="${i%2?'#86efac':'#4ade80'}" stroke="${OK}"/><text x="${CX+24}" y="${(y0+y1)/2+5}" font-size="14" font-weight="700" fill="${OK}" ${halo}>${i+1} N</text>`;
        g.appendChild(s); s.animate([{opacity:0,transform:'translateX(-8px)'},{opacity:1,transform:'none'}],{duration:260}); },180+i*330); }
    function next(){ const b=box(); hung=null; back(items[b.id],HOME[b.id]); items[b.id].style.opacity=.45; setLen(L0); $('#mfseg').innerHTML='';
      bi++; st='hang'; pick=null; moved=false; reading=0; drawExt(); drawPtr(); card(); }
    // dragging items
    Object.entries(items).forEach(([id,g])=>grab(g,svg,{home:()=>HOME[id],
      can:()=>hung!==id&&!(id!=='w'&&found[id]),
      drop(x,y){ const h=hookAt(); if(Math.hypot(x-h.x,y-h.y)>70) return false;
        if(st==='cal'&&id!=='w'){ card('First hang the <1 N weight>, so you know how far 1 N stretches it.'); return false; }
        if(st==='hang'&&id==='w'){ card(`You already know 1 N gives 2 cm. Now hang <box ${box().id}>.`); return false; }
        if(st==='hang'&&id!==box().id){ card(`Measure the boxes in order: hang <box ${box().id}> next.`); return false; }
        if(st!=='cal'&&st!=='hang') return false;
        hung=id; g.setAttribute('transform',`translate(${CX} ${yOf(len)+18})`);
        if(id==='w'){ st='calshow'; setLen(L0+PER); setTimeout(()=>{ found.cal=1; card();
            $('#mfext').innerHTML=K.arrow(112,yOf(L0)+2,112,yOf(L0+PER)-2,OK,3,8)+`<text x="${CX+24}" y="${yOf(L0+1)+5}" font-size="14" font-weight="700" fill="${OK}" ${halo}>1 N → 2 cm</text>`; },900);
          setTimeout(()=>{ if(!el.isConnected) return; hung=null; back(g,HOME.w); setLen(L0); $('#mfext').innerHTML=''; st='hang'; card(); },2600); }
        else { setLen(L0+box().f*PER); st='read'; setTimeout(()=>{ drawPtr(); card(); },500); }
        card(); return true; }}));
    drawSpring(); card(); drawPtr();
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
