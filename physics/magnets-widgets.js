/* ===== Interactive models for Topics 2.3 Magnetism and 2.4 Electromagnets ===== */
window.MagnetWidgets = (function(){
  const K = window.Kit;
  const INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf', NC='#d0402b', SC='#3b82c4', CU='#c2410c', LIVE='#dc2626', OFF='#9ca3af';

  const bar=(x,y,w,h,left,right)=>`<rect x="${x}" y="${y}" width="${w/2}" height="${h}" fill="${left==='N'?NC:SC}" stroke="${INK}" stroke-width="2"/><rect x="${x+w/2}" y="${y}" width="${w/2}" height="${h}" fill="${right==='N'?NC:SC}" stroke="${INK}" stroke-width="2"/>
    <text x="${x+w/4}" y="${y+h/2+6}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">${left}</text><text x="${x+3*w/4}" y="${y+h/2+6}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">${right}</text>`;

  /* ---------------- 2.3.1 Two magnets: attract or repel ----------------
     Both magnets sit on a table and really move: unlike poles snap together, like poles push apart.
     Tap a magnet to flip it (it turns over), or drag either one. */
  function twoMagnets(el,U){
    const W=170, H=46, Y=70, MIN=10, MAX=630; let A={x:40,v:0,p:['S','N'],flip:1,ft:0}, B={x:430,v:0,p:['S','N'],flip:1,ft:0}, held=null, raf=0, stuck=false, last=0;
    el.innerHTML=`<div class="row"><button class="btn ghost small" id="tmfa">Flip magnet A</button><button class="btn ghost small" id="tmfb">Flip magnet B</button><button class="btn ghost small" id="tmr">Pull apart</button>
        <span class="hint"><b>How:</b> tap a magnet to turn it round, or press and hold one and drag it.</span></div>
      <div class="stage" style="margin-top:8px"><svg viewBox="0 0 640 190" id="tmsvg" aria-label="Two bar magnets on a table">
        <rect x="0" y="${Y+H+4}" width="640" height="10" fill="#e9e1cf"/><line x1="0" y1="${Y+H+4}" x2="640" y2="${Y+H+4}" stroke="${INK}" stroke-width="1.5"/>
        <text id="tmword" x="320" y="34" text-anchor="middle" font-size="24" font-weight="700" letter-spacing="2"></text><g id="tmarr"></g>
        <g id="tmA" class="grab"><g class="fl"></g><text x="${W/2}" y="${Y+H+36}" text-anchor="middle" font-size="15" fill="${MUTED}">magnet A</text></g>
        <g id="tmB" class="grab"><g class="fl"></g><text x="${W/2}" y="${Y+H+36}" text-anchor="middle" font-size="15" fill="${MUTED}">magnet B</text></g></svg></div>
      <div class="verdict" id="tmv"></div>`;
    const $=s=>el.querySelector(s);
    const like=()=>A.p[1]===B.p[0], gap=()=>B.x-(A.x+W);
    function paint(m,g){ const sy=Math.abs(Math.cos(m.ft*Math.PI)); g.setAttribute('transform',`translate(${m.x} 0)`);
      const p=m.ft>.5?[m.p[1],m.p[0]]:m.p; // halfway through the turn the poles swap sides
      g.querySelector('.fl').setAttribute('transform',`translate(0 ${Y+H/2}) scale(1 ${Math.max(.04,sy)}) translate(0 ${-Y-H/2})`);
      g.querySelector('.fl').innerHTML=bar(0,Y,W,H,p[0],p[1]); }
    function draw(){ paint(A,$('#tmA')); paint(B,$('#tmB')); const g=gap(), lk=like(), f=Math.min(60,4000/((g+18)*(g+18))*14);
      $('#tmarr').innerHTML=stuck||g>260?'':K.arrow(A.x+W/2,Y-14,A.x+W/2+(lk?-f:f),Y-14,INK,3.5,10)+K.arrow(B.x+W/2,Y-14,B.x+W/2+(lk?f:-f),Y-14,INK,3.5,10);
      const w=$('#tmword'); w.textContent=lk?'REPEL':'ATTRACT'; w.setAttribute('fill',lk?SC:NC);
      $('#tmv').innerHTML=`Facing poles: <b>${A.p[1]}</b> and <b>${B.p[0]}</b>. ${lk?'<b>Like poles repel</b>: the magnets push each other apart.':'<b>Unlike poles attract</b>: the magnets pull together.'} ${stuck?'They have <b>snapped together</b>.':g<40?'Very close, so the force is <b>strong</b>.':g>220?'Far apart, so the force is <b>weak</b>.':'The <b>closer</b> they are, the <b>stronger</b> the force.'} Magnetic force is a <b>non-contact force</b>.`; }
    function tick(t){ const dt=last?Math.min(32,t-last)/16:1; last=t; let moving=false;
      [A,B].forEach(m=>{ if(m.ft>0){ m.ft=Math.min(1,m.ft+.06*dt); if(m.ft>=1){ m.ft=0; m.p=[m.p[1],m.p[0]]; } moving=true; } });
      if(!A.ft&&!B.ft&&!stuck){ const g=gap(), lk=like(), k=1600/((g+24)*(g+24)), F=lk?(g>200?0:k):-Math.max(.22,k); // unlike poles always pull in (a little force even far away)
        if(held!==A) A.v+= -F*dt; if(held!==B) B.v+= F*dt;
        [A,B].forEach(m=>{ if(m!==held){ m.v*=Math.pow(.9,dt); if(Math.abs(m.v)<.03&&F===0) m.v=0; m.x+=m.v*dt; } });
        if(A.x<MIN){ A.x=MIN; A.v=0; } if(B.x+W>MAX){ B.x=MAX-W; B.v=0; }
        if(gap()<=0){ if(like()){ const mid=(A.x+W+B.x)/2; A.x=mid-W; B.x=mid; } else { const mid=(A.x+W+B.x)/2; A.x=mid-W; B.x=mid; A.v=B.v=0; if(!held){ stuck=true; el.querySelector('.stage').animate([{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}],{duration:160}); } } }
        moving=moving||Math.abs(A.v)>.03||Math.abs(B.v)>.03||held; }
      draw(); if(moving&&el.isConnected) raf=requestAnimationFrame(tick); else raf=0; }
    const go=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
    const flip=m=>{ if(m.ft) return; m.ft=.001; stuck=false; go(); };
    [['tmA',A],['tmB',B]].forEach(([id,m])=>{ let sx=0, moved=false;
      K.svgDrag($('#'+id),$('#tmsvg'),{start(p){ sx=p.x; this.off=p.x-m.x; moved=false; held=m; },move(x){ if(Math.abs(x-sx)>4) moved=true; if(!moved) return; stuck=false; m.x=Math.max(MIN,Math.min(MAX-W,x-this.off)); if(m===A&&A.x+W>B.x) A.x=B.x-W; if(m===B&&B.x<A.x+W) B.x=A.x+W; m.v=0; go(); },end(){ held=null; if(!moved) flip(m); go(); }}); });
    $('#tmfa').onclick=()=>flip(A); $('#tmfb').onclick=()=>flip(B);
    $('#tmr').onclick=()=>{ stuck=false; A.x=40; B.x=430; A.v=B.v=0; go(); };
    draw(); go();
  }

  /* ---------------- 2.3.1 Find the field: plotting compass or iron filings ---------------- */
  function compassPlot(el,U){
    const N={x:230,y:160}, S={x:390,y:160}; let mode=0, showLines=false; const marks=[];
    el.innerHTML=`<div class="row"><span class="ch" id="cpm"></span><button class="btn ghost small" id="cpl">Show field lines</button><button class="btn ghost small" id="cpr">Clear</button><button class="btn ghost small" id="cplt" style="display:none">Show field lines</button></div>
      <p class="hint" id="cph" style="margin:6px 0 0"></p>
      <div class="stage" style="margin-top:6px;position:relative"><svg viewBox="0 0 620 320" id="cpsvg" aria-label="A bar magnet with a plotting compass or iron filings">
        <rect x="0" y="0" width="620" height="320" fill="#fffdf6"/><g id="cplines"></g><g id="cpfil"></g><g id="cpfl" style="transition:opacity .8s"></g><g id="cpmarks"></g>${bar(210,145,200,30,'N','S')}<g id="cpc" class="grab"></g></svg></div>
      <div class="row" id="cpstrrow" style="margin-top:6px;align-items:center;gap:12px"><span class="hint">Field strength at the compass</span><span class="mbar" style="flex:1;max-width:260px"><i id="cpbar" style="width:0;background:${NC}"></i></span><b id="cpstr"></b></div>
      <div class="verdict" id="cpv"></div>`;
    const $=s=>el.querySelector(s);
    const field=(x,y)=>{ const d=(p,s)=>{ const dx=x-p.x, dy=y-p.y, r=Math.max(12,Math.hypot(dx,dy)); return [s*dx/r**3, s*dy/r**3]; };
      const a=d(N,1), b=d(S,-1); const fx=a[0]+b[0], fy=a[1]+b[1]; const m=Math.hypot(fx,fy)||1; return [fx/m,fy/m,m]; };
    const inMag=(x,y)=>x>204&&x<416&&y>139&&y<181;
    function lines(){ let out=''; const starts=[];
      [0,.3,.6,.9,1.2,1.5,1.8,2.1].forEach(t=>[1,-1].forEach(sg=>{ if(!t&&sg<0) return; const ang=Math.PI+sg*t; starts.push([N.x+14*Math.cos(ang),N.y+14*Math.sin(ang)]); }));
      starts.forEach(([x,y])=>{ const pts=[[x,y]]; for(let i=0;i<4000;i++){ const [fx,fy]=field(x,y); x+=fx*2; y+=fy*2; if(x<-500||x>1100||y<-500||y>800) break; pts.push([x,y]); if(Math.hypot(x-S.x,y-S.y)<12) break; }
        const vis=pts.filter(p=>p[0]>10&&p[0]<610&&p[1]>10&&p[1]<310); const mi=pts.indexOf(vis[Math.floor(vis.length*.45)]); const mid=pts[mi], nx=pts[Math.min(pts.length-1,mi+3)];
        out+=`<polyline points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="1.4" opacity=".6"/>`;
        if(mid&&nx) out+=K.arrow(mid[0],mid[1],nx[0],nx[1],'#7c3aed',1.6,7); });
      return out; }
    // compass: rotates smoothly towards the field while you drag
    let cx=310, cy=60, ang=0, raf=0;
    const needle=(s=1)=>`<path d="M0 -5 L22 0 L0 5Z" fill="${NC}"/><path d="M0 -5 L-22 0 L0 5Z" fill="#e5e7eb" stroke="${INK}" stroke-width=".8"/><circle r="2.5" fill="${INK}"/>`;
    function paintC(){ $('#cpc').innerHTML=mode?'':`<g transform="translate(${cx} ${cy})"><circle r="30" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle r="25" fill="none" stroke="${LINE}"/><text y="-17" text-anchor="middle" font-size="9" fill="${MUTED}">N</text><g transform="rotate(${ang})">${needle()}</g></g>`; }
    function spin(){ const [fx,fy]=field(cx,cy); let t=Math.atan2(fy,fx)*180/Math.PI, d=((t-ang+540)%360)-180; ang+=d*.18; paintC(); if(Math.abs(d)>.3&&el.isConnected) raf=requestAnimationFrame(spin); else raf=0; }
    const nudge=()=>{ if(!raf) raf=requestAnimationFrame(spin); };
    function readout(x,y){ const m=field(x,y)[2], s=Math.min(1,Math.sqrt(m/0.0006)); $('#cpbar').style.width=Math.round(s*100)+'%'; $('#cpstr').innerHTML=s>.6?'strong':s>.3?'medium':'weak'; }
    function marksDraw(){ $('#cpmarks').innerHTML=marks.map(([x,y])=>{ const [fx,fy]=field(x,y); return `<g transform="translate(${x} ${y}) rotate(${Math.atan2(fy,fx)*180/Math.PI})"><path d="M-12 0 L10 0" stroke="${INK}" stroke-width="2"/><path d="M12 0 L4 -5 L4 5Z" fill="${NC}"/></g>`; }).join(''); }
    K.svgDrag($('#cpc'),$('#cpsvg'),{move(x,y){ if(mode) return; cx=Math.max(30,Math.min(590,x)); cy=Math.max(30,Math.min(290,y)); if(inMag(cx,cy)) cy=cy<160?110:210; readout(cx,cy); nudge(); paintC(); },end(){ if(mode) return; marks.push([cx,cy]); marksDraw(); text(); }});
    // iron filings: sprinkle them (they land at random), then they turn to line up with the field
    let fil=[];
    function sprinkle(){ fil=[]; let tries=0; while(fil.length<700&&tries<20000){ tries++; const x=Math.random()*620, y=Math.random()*320; if(inMag(x,y)) continue; const m=field(x,y)[2]; if(Math.random()>Math.min(1,.12+Math.sqrt(m/0.0004))) continue; fil.push({x,y,a:Math.random()*180,t:Math.atan2(field(x,y)[1],field(x,y)[0])*180/Math.PI}); }
      setFL(false); drawFil(0); $('#cpv').innerHTML='The filings land in random directions…'; setTimeout(()=>{ if(el.isConnected&&mode) tap(); },500); }
    function drawFil(k){ $('#cpfil').innerHTML=fil.map(f=>{ let d=((f.t-f.a+540)%360)-180; if(d>90) d-=180; if(d<-90) d+=180; const a=f.a+d*k; return `<line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#3f3a32" stroke-width="1.6" stroke-linecap="round" transform="translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${a.toFixed(1)})"/>`; }).join(''); }
    function tap(){ if(!fil.length) sprinkle(); const st=performance.now();
      const run=t=>{ const k=Math.min(1,(t-st)/1400); drawFil(1-(1-k)**3); if(k<1&&el.isConnected) requestAnimationFrame(run); else { setFL(true); $('#cpv').innerHTML='The filings line up with the <b>magnetic field</b>. The <b>field lines</b> show the pattern, with arrows from <b>N</b> to <b>S</b>. The filings crowd together near the <b>poles</b>, where the field is <b>strongest</b>.'; } }; requestAnimationFrame(run); }
    function setFL(v){ const g=$('#cpfl'); g.innerHTML=v?lines():''; g.style.opacity=0; if(v) requestAnimationFrame(()=>requestAnimationFrame(()=>g.style.opacity=1)); $('#cplt').textContent=v?'Hide field lines':'Show field lines'; }
    $('#cplt').onclick=()=>setFL(!$('#cpfl').innerHTML);
    function text(){ $('#cpv').innerHTML=mode?'Sprinkle <b>iron filings</b> around the magnet and watch what they do.':marks.length<6?`The <b>needle</b> lines up with the <b>magnetic field</b>. Its red end points along the field, from <b>N</b> to <b>S</b>. Drop the compass in at least 6 places.`:
      `You have plotted ${marks.length} points. Press <b>Show field lines</b> to see how your arrows follow them: the field lines go from the <b>north pole</b> to the <b>south pole</b>, and are <b>closest together</b> where the field is <b>strongest</b>.`; }
    function setMode(i){ mode=i; $('#cph').innerHTML=i?'<b>How:</b> press <b>Sprinkle iron filings</b> and watch the filings turn.':'<b>How:</b> press and hold the compass, drag it around the magnet, then let go. Each drop leaves an arrow.';
      $('#cpr').textContent='Clear'; $('#cpl').textContent=i?'Sprinkle iron filings':(showLines?'Hide field lines':'Show field lines');
      $('#cpfil').style.display=i?'':'none'; $('#cpfl').style.display=i?'':'none'; $('#cplt').style.display=i?'':'none'; $('#cpstrrow').style.display=i?'none':''; $('#cpmarks').style.display=i?'none':''; paintC(); text(); }
    $('#cpl').onclick=()=>{ if(mode){ sprinkle(); return; } showLines=!showLines; $('#cplines').innerHTML=showLines?lines():''; setMode(0); };
    $('#cpr').onclick=()=>{ if(mode){ fil=[]; drawFil(0); setFL(false); text(); return; } marks.length=0; marksDraw(); text(); };
    K.choices($('#cpm'),['Plotting compass','Iron filings'],setMode,0);
    readout(cx,cy); nudge();
  }

  /* ---------------- 2.4.1 Build an electromagnet (textbook “Mixed up electromagnets” data) ---------------- */
  const BASE={coils:10,pd:'3V',core:'iron',wire:'copper'};
  const DATA=[ // the textbook results table
    {coils:10,pd:'1.5V',core:'iron',wire:'copper',clips:4},{coils:10,pd:'3V',core:'iron',wire:'copper',clips:8},{coils:10,pd:'4.5V',core:'iron',wire:'copper',clips:12},
    {coils:10,pd:'6V',core:'iron',wire:'copper',clips:16},{coils:40,pd:'3V',core:'iron',wire:'copper',clips:20},{coils:30,pd:'3V',core:'iron',wire:'copper',clips:16},
    {coils:20,pd:'3V',core:'iron',wire:'copper',clips:12},{coils:10,pd:'3V',core:'steel',wire:'copper',clips:10},{coils:10,pd:'3V',core:'aluminium',wire:'copper',clips:0},
    {coils:30,pd:'3V',core:'iron',wire:'tungsten',clips:3}];
  const VARS=[
    {k:'coils',n:'Number of coils',opts:[10,20,30,40],fix:BASE},
    {k:'pd',n:'Potential difference',opts:['1.5V','3V','4.5V','6V'],fix:BASE},
    {k:'core',n:'Type of core',opts:['iron','steel','aluminium'],fix:BASE},
    {k:'wire',n:'Type of wire',opts:['copper','tungsten'],fix:{coils:30,pd:'3V',core:'iron',wire:'copper'}}];
  function buildEM(el,U){
    // Everything is changed ON the diagram: − / + next to each part, and a real switch in the circuit.
    let set=Object.assign({},BASE), on=false, held=0, run=0, flash='';
    el.innerHTML=`<p class="hint" style="margin:0 0 6px"><b>How:</b> press <b>−</b> or <b>+</b> next to a part of the electromagnet to change it. Then press the <b>switch</b> in the circuit and count the paper clips.</p>
      <div class="stage"><svg viewBox="0 0 640 360" id="emsvg" aria-label="An electromagnet you can change, picking up paper clips"></svg></div>
      <div class="verdict" id="emvd"></div>
      <div class="logwrap"><table class="logtable"><thead><tr><th>Number of coils</th><th>Potential difference</th><th>Type of core</th><th>Type of wire</th><th>Number of paper clips</th></tr></thead><tbody id="emlog"><tr><td colspan="5" class="hint">Each result you get is added here, like the textbook table.</td></tr></tbody></table></div>`;
    const $=s=>el.querySelector(s);
    const row=()=>DATA.find(d=>d.coils===set.coils&&d.pd===set.pd&&d.core===set.core&&d.wire===set.wire);
    const stepper=(k,x,y,label)=>{ const V=VARS.find(v=>v.k===k), i=V.opts.indexOf(set[k]); const hl=flash===k;
      return `<g class="emst" transform="translate(${x} ${y})"><rect x="-74" y="-17" width="148" height="34" rx="17" fill="${hl?'#fff7ed':'#fff'}" stroke="${hl?CU:LINE}" stroke-width="${hl?2.5:1.5}"/>
        <g class="embtn" data-k="${k}" data-d="-1" style="cursor:pointer;opacity:${i>0?1:.3}"><circle cx="-56" cy="0" r="13" fill="${CU}"/><text x="-56" y="6" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">−</text></g>
        <text x="0" y="6" text-anchor="middle" font-size="16" font-weight="700" class="mono" fill="${INK}">${label}</text>
        <g class="embtn" data-k="${k}" data-d="1" style="cursor:pointer;opacity:${i<V.opts.length-1?1:.3}"><circle cx="56" cy="0" r="13" fill="${CU}"/><text x="56" y="6" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">+</text></g></g>`; };
    function draw(){
      const coreCol=set.core==='iron'?'#8b8f98':set.core==='steel'?'#5b6472':'#dfe3e8', wireCol=set.wire==='copper'?CU:'#6b7280', cur=on?LIVE:OFF;
      const turns=Math.round(set.coils/2.5)+2; let coil=''; for(let i=0;i<turns;i++){ const x=228+i*(214/turns); coil+=`<path d="M${x} 112 C${x+7} 106 ${x+12} 168 ${x+5} 162" stroke="${wireCol}" stroke-width="3.5" fill="none"/>`; }
      const clipsUp=Array.from({length:held},(_,i)=>{ const x=240+(i%10)*20, y=170+Math.floor(i/10)*26; return `<g transform="translate(${x} ${y}) rotate(${(i*37)%20-10})"><rect x="-4" y="0" width="8" height="22" rx="4" fill="none" stroke="#475569" stroke-width="2.2"/></g>`; }).join('');
      const pile=Array.from({length:Math.max(0,20-held)},(_,i)=>`<g transform="translate(${226+(i%12)*20} ${300+Math.floor(i/12)*9}) rotate(80)"><rect x="-4" y="0" width="8" height="20" rx="4" fill="none" stroke="#94a3b8" stroke-width="2"/></g>`).join('');
      const r=row();
      $('#emsvg').innerHTML=`
        <path d="M228 112 L228 60 L80 60 L80 120 M80 200 L80 250 L130 250 M170 250 L470 250 L470 60 L450 60 M442 162 L470 162" fill="none" stroke="${cur}" stroke-width="3" ${on?'stroke-dasharray="10 6" class="emflow"':''}/>
        <rect x="60" y="120" width="40" height="80" fill="#fff" stroke="${INK}" stroke-width="2.5"/><rect x="72" y="113" width="16" height="8" fill="${INK}"/><text x="80" y="166" text-anchor="middle" font-size="16" font-weight="700" class="mono">${set.pd}</text>
        <g id="emsw" style="cursor:pointer"><rect x="118" y="222" width="64" height="44" fill="transparent"/><circle cx="130" cy="250" r="5" fill="${INK}"/><circle cx="170" cy="250" r="5" fill="${INK}"/><line x1="130" y1="250" x2="${on?170:162}" y2="${on?250:224}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <text x="150" y="284" text-anchor="middle" font-size="15" font-weight="700" fill="${on?LIVE:CU}">${on?'switch ON':'press the switch'}</text></g>
        <rect x="220" y="118" width="230" height="38" rx="4" fill="${coreCol}" stroke="${INK}" stroke-width="2.5"/>${coil}
        <text x="335" y="98" text-anchor="middle" font-size="14" fill="${MUTED}">coil of ${set.wire} wire around ${set.core==='steel'?'a':'an'} ${set.core} core</text>
        ${clipsUp}${pile}
        ${stepper('pd',80,30,set.pd)}${stepper('coils',335,30,set.coils+' coils')}${stepper('core',560,137,set.core)}${stepper('wire',560,200,set.wire)}
        <text x="560" y="112" text-anchor="middle" font-size="13" fill="${MUTED}">core</text><text x="560" y="236" text-anchor="middle" font-size="13" fill="${MUTED}">wire</text>
        ${on?`<text x="560" y="300" text-anchor="middle" font-size="40" font-weight="700" class="mono" fill="${INK}">${held}</text><text x="560" y="322" text-anchor="middle" font-size="14" fill="${MUTED}">paper clips</text>`:''}`;
      el.querySelectorAll('.embtn').forEach(b=>b.onclick=()=>change(b.dataset.k,+b.dataset.d));
      $('#emsw').onclick=toggle;
      $('#emvd').innerHTML=!on?(held&&set.core==='steel'?`Switched off, but the <b>steel</b> core keeps its magnetism, so <b>${held}</b> clips are still stuck. Steel is hard to magnetise but keeps its magnetism.`:`Ready: <b>${set.coils} coils</b>, <b>${set.pd}</b>, <b>${set.core}</b> core, <b>${set.wire}</b> wire. Press the switch.`)
        :`<b>${r.clips} paper clips</b>.`+(set.core==='aluminium'?' Aluminium is <b>not a magnetic material</b>, so the core does not help.':set.wire==='tungsten'?' Tungsten wire has a bigger resistance than copper, so less current flows.':held===r.clips&&r.clips>8?' A <b>stronger</b> electromagnet.':'');
    }
    function change(k,d){ const V=VARS.find(v=>v.k===k); const i=V.opts.indexOf(set[k])+d; if(i<0||i>=V.opts.length) return;
      // fair test: only one thing changes from the textbook's starting set-up
      const others=Object.keys(BASE).filter(q=>q!==k&&set[q]!==V.fix[q]);
      set=Object.assign({},V.fix); set[k]=V.opts[i]; run++; on=false; held=0; flash=k; draw();
      if(others.length) $('#emvd').innerHTML+=`<br><span class="hint">Fair test: the other settings went back to the textbook’s values, so only <b>one</b> thing changes.</span>`;
      setTimeout(()=>{ if(flash===k){ flash=''; if(el.isConnected) { const m=$('#emvd').innerHTML; draw(); $('#emvd').innerHTML=m; } } },700); }
    function toggle(){ if(on){ on=false; run++; held=set.core==='steel'?held:0; draw(); return; }
      on=true; const me=++run, r=row(); held=0; draw(); let k=0;
      const add=()=>{ if(me!==run||!el.isConnected) return; if(k<r.clips){ held=++k; draw(); setTimeout(add,45); } }; setTimeout(add,200);
      const key=JSON.stringify(set); const tb=$('#emlog'); if(!tb.querySelector('[data-k]')) tb.innerHTML='';
      tb.querySelectorAll('tr').forEach(t=>t.classList.remove('on'));
      let tr=tb.querySelector(`[data-k='${key}']`); if(!tr){ tb.insertAdjacentHTML('beforeend',`<tr data-k='${key}'><td>${set.coils}</td><td>${set.pd}</td><td>${set.core}</td><td>${set.wire}</td><td><b>${r.clips}</b></td></tr>`); tr=tb.lastElementChild; }
      tr.classList.add('on'); }
    draw();
  }

  /* ---------------- 2.4.2 Electric bell ---------------- */
  // pulled: armature attracted; live: current flowing; pressed: external push held
  function bellSVG(pulled,live,extraW=0,pressed=live,contactClosed=!pulled){
    const a=pulled?7:0; const w=live?LIVE:OFF;
    let coil=''; for(let i=0;i<8;i++){ const x=128+i*20; coil+=`<path d="M${x} 146 C${x+8} 140 ${x+12} 192 ${x+4} 186" stroke="${live?'#b91c1c':'#c97a6a'}" stroke-width="3.5" fill="none"/>`; }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${520+extraW} 500" font-family="Atkinson Hyperlegible, sans-serif">
      <rect x="0" y="0" width="${520+extraW}" height="500" fill="#fffdf8"/>
      <path d="M70 250 L70 60 L128 60 L128 150 M290 186 L290 230 L250 230 L250 60 L345 60 L345 84 M432 170 L460 170 L460 460 L70 460 L70 400 M70 340 L70 300" fill="none" stroke="${w}" stroke-width="5" stroke-linejoin="round"/>
      <rect x="40" y="250" width="60" height="50" fill="#fff" stroke="${INK}" stroke-width="2.5"/><text x="70" y="281" text-anchor="middle" font-size="15">battery</text>
      <g><path d="M70 340 L${pressed?70:96} ${pressed?400:385}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="340" r="6" fill="#d97706" stroke="${INK}"/><circle cx="70" cy="400" r="6" fill="#d97706" stroke="${INK}"/><text x="100" y="430" font-size="15" fill="${MUTED}">bell push</text></g>
      <rect x="118" y="150" width="182" height="32" rx="3" fill="#8b8f98" stroke="${INK}" stroke-width="2.5"/>${coil}
      <circle cx="345" cy="84" r="7" fill="#d97706" stroke="${INK}" stroke-width="2"/>
      <g transform="rotate(${a} 345 90)">
        <path d="M345 90 L345 130" stroke="#d97706" stroke-width="4"/>
        <rect x="337" y="126" width="16" height="150" fill="#4b5563" stroke="${INK}" stroke-width="2"/>
        <path d="M345 276 L345 330" stroke="${INK}" stroke-width="4"/><circle cx="345" cy="338" r="12" fill="#e5e7eb" stroke="${INK}" stroke-width="2"/></g>
      <path d="M${pulled?347:353} ${pulled?141:140} Q${contactClosed?374:348} 156 ${contactClosed?364:343} 170" stroke="#d97706" stroke-width="4" fill="none"/><circle cx="${contactClosed?364:343}" cy="170" r="3" fill="#d97706"/>
      <path d="M432 162 L380 162 L364 170 L380 178 L432 178Z" fill="#cbd5e1" stroke="${INK}" stroke-width="2"/><rect x="398" y="152" width="14" height="36" fill="#facc15" stroke="${INK}" stroke-width="2"/>
      <circle cx="245" cy="370" r="78" fill="#9ca3af" stroke="${INK}" stroke-width="2.5"/><circle cx="245" cy="370" r="44" fill="#b8bec7" stroke="${INK}" stroke-width="1.5"/><circle cx="245" cy="370" r="9" fill="${INK}"/>
    </svg>`;
  }
  function bellLabel(el,U){
    const ex=280; let svg=bellSVG(false,false,ex);
    const L=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="1.5" fill="none"/><circle cx="${x1}" cy="${y1}" r="3.5" fill="${INK}"/>`;
    svg=svg.replace('</svg>',L(210,150,560,70)+L(345,200,560,170)+L(364,156,560,270)+L(372,170,560,370).replace('</svg>','')+'</svg>');
    const img='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    K.label(el,U,{img,w:520+ex,h:500,alt:'Electric bell diagram',tip:'These are the labels from the textbook diagram.',slots:[
      {name:'electromagnet',x:565,y:48,w:225,h:44,info:'The coil of wire around an iron core. It is magnetic only when a current flows.'},
      {name:'iron armature',x:565,y:148,w:225,h:44,info:'The piece of iron that the electromagnet attracts. The hammer is on the end of it.'},
      {name:'springy metal strip',x:565,y:248,w:225,h:44,info:'Pulls the armature back when the electromagnet switches off.'},
      {name:'make and break switch',x:565,y:348,w:225,h:44,info:'Where the springy strip touches the contact screw. Moving the armature breaks the circuit, then makes it again.'}]});
  }
  function bellSim(el,U){
    // Continuous model: current flows only while the push is held AND the springy strip touches the contact.
    // Live → the electromagnet pulls the armature; the moving armature opens the contact; the spring pulls it back.
    let pressed=false, a=0, dir=0, rings=0, ringT=-9, speed=1, raf=0, last=0, sound=false, ac=null;
    el.innerHTML=`<div class="row" style="gap:16px;align-items:center"><span class="hint"><b>How:</b> press and hold the <b>bell push</b> in the diagram (or the button).</span>
        <button class="btn accent hold" id="bellpush">Hold to ring</button></div>
      <div class="stage" id="bstage" style="margin-top:6px;user-select:none;touch-action:none"></div>
      <div class="row" style="gap:18px;align-items:center;margin-top:6px"><div style="width:240px">${K.range('Speed (turn down for slow motion)',1,10,1,10,'#')}</div><label class="hint"><input type="checkbox" id="bsnd"> sound</label><span class="readout" style="margin:0">rings <b id="brn">0</b></span></div>
      <div class="verdict" id="bcap"></div>`;
    const $=s=>el.querySelector(s);
    function frame(){ const closed=a<.32, live=pressed&&closed, ang=a*8, hitAge=(performance.now()-ringT)/1000;
      const w=live?LIVE:OFF, dash=live?`stroke-dasharray="12 8" class="emflow"`:'';
      let coil=''; for(let i=0;i<8;i++){ const x=128+i*20; coil+=`<path d="M${x} 146 C${x+8} 140 ${x+12} 192 ${x+4} 186" stroke="${live?'#b91c1c':'#c97a6a'}" stroke-width="3.5" fill="none"/>`; }
      const waves=hitAge<.6?[0,1,2].map(k=>{ const r=86+(hitAge*120)+k*16; return `<circle cx="245" cy="370" r="${r}" fill="none" stroke="${INK}" stroke-width="${2-k*.5}" opacity="${Math.max(0,.5-hitAge*.8-k*.12)}"/>`; }).join(''):'';
      const shake=hitAge<.25?Math.sin(hitAge*90)*2*(1-hitAge*4):0;
      const sx=closed?364:343-a*6;
      $('#bstage').innerHTML=`<svg viewBox="0 0 520 480" aria-label="Electric bell">
        <path d="M70 250 L70 60 L128 60 L128 150 M290 186 L290 230 L250 230 L250 60 L345 60 L345 84 M432 170 L460 170 L460 450 L70 450 L70 408 M70 336 L70 300" fill="none" stroke="${w}" stroke-width="5" stroke-linejoin="round" ${dash}/>
        <rect x="40" y="250" width="60" height="50" fill="#fff" stroke="${INK}" stroke-width="2.5"/><text x="70" y="281" text-anchor="middle" font-size="15">battery</text>
        <g id="bpush" style="cursor:pointer"><rect x="20" y="326" width="110" height="94" fill="transparent"/><circle cx="70" cy="336" r="6" fill="#d97706" stroke="${INK}"/><circle cx="70" cy="408" r="6" fill="#d97706" stroke="${INK}"/>
          <path d="M70 336 L${pressed?70:100} ${pressed?408:392}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
          <rect x="${pressed?92:104}" y="360" width="22" height="16" rx="3" fill="${pressed?'#7c3aed':'#ede9fe'}" stroke="#7c3aed" stroke-width="2"/>
          <text x="128" y="430" text-anchor="middle" font-size="14" font-weight="700" fill="#7c3aed">bell push</text></g>
        ${live?`<ellipse cx="209" cy="166" rx="112" ry="40" fill="none" stroke="#dc2626" stroke-dasharray="3 5" opacity=".5"/><ellipse cx="209" cy="166" rx="128" ry="56" fill="none" stroke="#dc2626" stroke-dasharray="3 5" opacity=".3"/>`:''}
        <rect x="118" y="150" width="182" height="32" rx="3" fill="${live?'#9aa0aa':'#8b8f98'}" stroke="${INK}" stroke-width="2.5"/>${coil}
        <text x="209" y="128" text-anchor="middle" font-size="14" fill="${live?'#b91c1c':MUTED}" font-weight="${live?700:400}">${live?'magnetic':'not magnetic'}</text>
        <circle cx="345" cy="84" r="7" fill="#d97706" stroke="${INK}" stroke-width="2"/>
        <g transform="rotate(${ang} 345 90)"><path d="M345 90 L345 130" stroke="#d97706" stroke-width="4"/><rect x="337" y="126" width="16" height="150" fill="#4b5563" stroke="${INK}" stroke-width="2"/>
          <path d="M345 276 L345 330" stroke="${INK}" stroke-width="4"/><circle cx="345" cy="338" r="12" fill="#e5e7eb" stroke="${INK}" stroke-width="2"/></g>
        <path d="M${351-a*4} 140 Q${closed?374:350} 156 ${sx} 170" stroke="#d97706" stroke-width="4" fill="none"/><circle cx="${sx}" cy="170" r="3" fill="#d97706"/>
        ${pressed&&a>.3&&a<.42?`<path d="M366 162 l6 -8 l-2 7 l7 -2 l-8 9" fill="#facc15" stroke="#ca8a04"/>`:''}
        <path d="M432 162 L380 162 L364 170 L380 178 L432 178Z" fill="#cbd5e1" stroke="${INK}" stroke-width="2"/><rect x="398" y="152" width="14" height="36" fill="#facc15" stroke="${INK}" stroke-width="2"/>
        <g transform="translate(${shake} 0)"><circle cx="245" cy="370" r="78" fill="#9ca3af" stroke="${INK}" stroke-width="2.5"/><circle cx="245" cy="370" r="44" fill="#b8bec7" stroke="${INK}" stroke-width="1.5"/><circle cx="245" cy="370" r="9" fill="${INK}"/></g>${waves}
        <text x="470" y="40" text-anchor="end" font-size="16" font-weight="700" fill="${live?LIVE:MUTED}">${live?'current flowing':pressed?'circuit broken':'switch open'}</text></svg>`;
      $('#brn').textContent=rings;
      $('#bcap').innerHTML=!pressed?(rings?'You let go: the circuit is open, so the bell stops.':'Press and hold the bell push. Turn the <b>speed</b> down to see each step.')
        :live&&a<.05?'1. The switch is closed, so a <b>current flows</b> and the <b>electromagnet</b> turns on.'
        :live||dir>0?'2. The electromagnet <b>attracts the iron armature</b>. The hammer moves towards the gong.'
        :a>.9?'3. The hammer <b>hits the gong</b>. The armature has moved, so the circuit is <b>broken</b>: no current, the electromagnet turns off.'
        :'4. The <b>springy metal strip</b> pulls the armature back. When it touches the contact, the circuit is <b>made</b> again… and it repeats.'; }
    function ding(){ if(!sound) return; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(), g=ac.createGain(); o.frequency.value=1250; o.type='sine'; g.gain.setValueAtTime(.12,ac.currentTime); g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.5); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+.5); }catch(e){} }
    function tick(t){ const dt=Math.min(40,t-(last||t))/1000*speed; last=t;
      if(!pressed&&dir>0&&a<.32) dir=-1;          // let go before the contact opened
      if(pressed&&dir<0&&a<.15) dir=1;            // contact made again: the electromagnet pulls again
      a+=dir*dt*6;
      if(a>=1){ a=1; dir=-1; rings++; ringT=performance.now(); ding(); }
      if(a<=0){ a=0; dir=pressed?1:0; }
      frame(); const busy=pressed||a>0||dir!==0||performance.now()-ringT<700;
      if(busy&&el.isConnected) raf=requestAnimationFrame(tick); else raf=0; }
    const go=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
    const down=e=>{ e.preventDefault(); pressed=true; if(dir<=0&&a<.15) dir=1; $('#bellpush').classList.add('down'); go(); };
    const up=()=>{ if(!pressed) return; pressed=false; $('#bellpush').classList.remove('down'); go(); };
    $('#bellpush').addEventListener('pointerdown',down);
    $('#bstage').addEventListener('pointerdown',e=>{ if(e.target.closest('#bpush')) down(e); });
    document.addEventListener('pointerup',up); document.addEventListener('pointercancel',up);
    $('#bsnd').onchange=e=>{ sound=e.target.checked; };
    K.ranges(el,([v])=>{ speed=v/10; });
    frame();
  }

  /* ---------------- 2.4.2 Circuit breaker ----------------
     Everything in the drawing responds to the current: thicker, faster current; a stronger electromagnet;
     the iron catch is pulled further down. At a large current the catch lets go, the spring pulls the
     contacts apart, and the reset button pops out. It stays off until you push the reset button. */
  function breaker(el,U){
    const TRIP=7; let I=2, tripped=false, catchA=0, armA=0, raf=0, spark=0;
    el.innerHTML=`<div class="row" style="gap:16px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px">${K.range('Current',1,10,1,2,'#')}</div>
        <button class="btn ghost small" id="cbf">Faulty device: large current</button></div>
      <p class="hint" style="margin:4px 0 0"><b>How:</b> drag the slider to make the current bigger. To turn the circuit back on, press the orange <b>reset button</b> in the diagram.</p>
      <div class="stage" style="margin-top:6px"><svg viewBox="0 0 600 330" id="cbsvg" aria-label="Circuit breaker"></svg></div>
      <div class="row" style="align-items:center;gap:10px;margin-top:6px"><span class="hint" style="width:150px">Pull on the iron catch</span><span class="mbar" style="flex:1;max-width:320px;position:relative"><i id="cbbar"></i><b style="position:absolute;left:${TRIP/10*100}%;top:-4px;bottom:-4px;width:2px;background:${INK}"></b></span><span class="hint">trips here</span></div>
      <div class="verdict" id="cbv" style="margin-top:8px"></div>`;
    const $=s=>el.querySelector(s);
    function draw(){ const live=!tripped, w=live?2+I*.7:3, col=live?LIVE:OFF, dur=(1.4-I*.1).toFixed(2);
      let cd='M270 175 L270 182'; for(let i=0;i<7;i++) cd+=` L214 ${188+i*12} L270 ${194+i*12}`; cd+=' L214 266 L214 260';
      const coil=`<path d="${cd}" fill="none" stroke="${live?'#b91c1c':'#c97a6a'}" stroke-width="${live?2+I*.25:2.5}" stroke-linejoin="round"/>`; // one continuous wire wrapped round the iron core
      const glow=live?Array.from({length:Math.round(I/2)},(_,k)=>`<ellipse cx="242" cy="228" rx="${40+k*12}" ry="${64+k*10}" fill="none" stroke="#dc2626" stroke-dasharray="3 5" opacity="${.45-k*.07}"/>`).join(''):'';
      const ax=150, ay=110, aLen=200, tipX=ax+aLen*Math.cos(-armA*Math.PI/180), tipY=ay+aLen*Math.sin(-armA*Math.PI/180);
      $('#cbsvg').innerHTML=`<rect x="120" y="40" width="300" height="270" fill="#f8fbff" stroke="#93c5fd" stroke-width="12"/>
        <path d="M20 110 L${ax} ${ay}" stroke="${col}" stroke-width="${w}" ${live?`stroke-dasharray="12 8" style="animation:emflow ${dur}s linear infinite"`:''}/>
        <path d="M362 110 L392 110 L392 150 L330 150 L330 175 L270 175 M214 260 L214 290 L20 290" fill="none" stroke="${col}" stroke-width="${w}" ${live?`stroke-dasharray="12 8" style="animation:emflow ${dur}s linear infinite"`:''}/>
        <text x="22" y="100" font-size="14" fill="${MUTED}">in</text><text x="22" y="282" font-size="14" fill="${MUTED}">out</text>
        ${glow}<rect x="226" y="180" width="32" height="96" fill="#8b8f98" stroke="${INK}" stroke-width="2"/>${coil}
        <path d="M${ax} ${ay} L${tipX} ${tipY}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="${ax}" cy="${ay}" r="6" fill="#fff" stroke="${INK}" stroke-width="2"/>
        <rect x="${tipX-6}" y="${tipY-6}" width="12" height="12" fill="#d97706" stroke="${INK}"/><rect x="356" y="104" width="12" height="12" fill="#d97706" stroke="${INK}"/>
        ${spark?`<path d="M362 96 l8 -12 l-3 10 l9 -3 l-11 13" fill="#facc15" stroke="#ca8a04"/>`:''}
        <path d="M200 ${ay-8} ${Array.from({length:6},(_,k)=>`L${206+k*8} ${(k%2?62:72)-armA*.4}`).join(' ')} L252 50" fill="none" stroke="${INK}" stroke-width="2"/>
        <g transform="rotate(${catchA} 300 168)"><rect x="196" y="162" width="104" height="10" fill="#4b5563" stroke="${INK}"/><path d="M300 168 L300 ${ay+2}" stroke="#4b5563" stroke-width="5"/></g><circle cx="300" cy="168" r="4" fill="${INK}"/>
        <rect x="${tripped?412:392}" y="214" width="70" height="18" rx="3" id="cbreset" style="cursor:pointer" fill="#d97706" stroke="${INK}" stroke-width="2"/>
        <g font-size="14" fill="${MUTED}"><text x="440" y="70">spring</text><path d="M436 66 L258 56" stroke="${LINE}"/>
          <text x="440" y="114">contacts</text><path d="M436 110 L372 110" stroke="${LINE}"/>
          <text x="440" y="164">iron catch</text><path d="M436 160 L305 166" stroke="${LINE}"/>
          <text x="490" y="228">reset button</text>
          <text x="440" y="290">electromagnet</text><path d="M436 286 L262 262" stroke="${LINE}"/></g>
        <text x="520" y="26" text-anchor="middle" font-size="17" font-weight="700" fill="${live?LIVE:MUTED}">${live?'current flowing':'TRIPPED: no current'}</text>`;
      $('#cbreset').onclick=reset;
      const pull=live?I/10:0; $('#cbbar').style.width=Math.round(pull*100)+'%'; $('#cbbar').style.background=I>=TRIP?LIVE:'#f59e0b';
      $('#cbv').innerHTML=tripped?`<b>Tripped.</b> The large current made the <b>electromagnet</b> strong enough to <b>attract the iron catch</b>. The <b>spring</b> pulled the <b>contacts</b> apart, so the circuit is <b>broken</b>. It <b>stays off</b> until you push the <b>reset button</b>.${I>=TRIP?' <span class="hint">The fault is still there: if you reset it now, the large current flows again and it <b>trips again</b>.</span>':''}`
        :I>=TRIP?'The current is <b>too large</b>…':`Current <b>${I}</b>: the electromagnet pulls on the iron catch, but <b>not enough</b> to release the catch. The circuit stays on.`; }
    function animate(){ const tC=tripped?-9:-I/TRIP*4, tA=tripped?15:0; catchA+=(tC-catchA)*.25; armA+=(tA-armA)*.3; if(spark) spark--; draw();
      if((Math.abs(tC-catchA)>.05||Math.abs(tA-armA)>.05||spark)&&el.isConnected) raf=requestAnimationFrame(animate); else raf=0; }
    const go=()=>{ if(!raf) raf=requestAnimationFrame(animate); };
    let timer=0; const check=()=>{ clearTimeout(timer); if(I>=TRIP&&!tripped) timer=setTimeout(()=>{ tripped=true; spark=10; go(); },450); };
    function reset(){ if(!tripped) return; tripped=false; go(); check(); }
    K.ranges(el,([v])=>{ I=v; go(); check(); });
    $('#cbf').onclick=()=>{ const r=el.querySelector('.kit-range input'); r.value=9; r.dispatchEvent(new Event('input')); };
    draw();
  }

  return {twoMagnets,compassPlot,buildEM,bellLabel,bellSim,breaker};
})();
