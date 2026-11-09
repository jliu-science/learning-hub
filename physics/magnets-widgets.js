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
        <span class="hint"><b>Tap</b> a magnet to flip it. <b>Drag</b> to move it.</span></div>
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
    K.cue(()=>$('#tmB'),{watch:$('#tmsvg'),host:el,ring:true,delay:1500,to:{dx:60,dy:0}});
  }

  /* ---------------- 2.3.1 Find the field: plotting compass or iron filings ---------------- */
  function compassPlot(el,U){
    const N={x:230,y:160}, S={x:390,y:160}; let mode=0, showLines=false; const marks=[];
    el.innerHTML=`<div class="row"><span class="ch" id="cpm"></span><button class="btn ghost small" id="cpl">Show field lines</button><button class="btn ghost small" id="cpr">Clear</button><button class="btn ghost small" id="cplt" style="display:none">Show field lines</button></div>
      <p class="hint" id="cph" style="margin:6px 0 0"></p>
      <div class="stage" style="margin-top:6px;position:relative"><style>#cpv b{color:#b42318}</style><div id="cpv" style="min-height:3.2em;padding:9px 14px;margin:8px 8px 0;border-left:5px solid #d0402b;border-radius:6px;background:#fdecea;color:#3b1d17;font-size:1em;line-height:1.5"></div><svg viewBox="0 0 620 320" id="cpsvg" aria-label="A bar magnet with a plotting compass or iron filings">
        <rect x="0" y="0" width="620" height="320" fill="#fffdf6"/><g id="cplines"></g><g id="cpfil"></g><g id="cpfl" style="transition:opacity .8s"></g><g id="cpmarks"></g>${bar(210,145,200,30,'N','S')}<g id="cpc" class="grab"></g></svg></div>
      <div class="row" id="cpstrrow" style="margin-top:6px;align-items:center;gap:12px"><span class="hint">Field strength at the compass</span><span class="mbar" style="flex:1;max-width:260px"><i id="cpbar" style="width:0;background:${NC}"></i></span><b id="cpstr"></b></div>
`;
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
      const run=t=>{ const k=Math.min(1,(t-st)/1400); drawFil(1-(1-k)**3); if(k<1&&el.isConnected) requestAnimationFrame(run); else { setFL(true); $('#cpv').innerHTML='The <b>iron filings</b> line up with the <b>magnetic field</b>. The <b>magnetic field lines</b> go from the <b>north pole</b> to the <b>south pole</b>. Where the lines are <b>closer together</b>, the field is <b>stronger</b>.'; } }; requestAnimationFrame(run); }
    function setFL(v){ const g=$('#cpfl'); g.innerHTML=v?lines():''; g.style.opacity=0; if(v) requestAnimationFrame(()=>requestAnimationFrame(()=>g.style.opacity=1)); $('#cplt').textContent=v?'Hide field lines':'Show field lines'; }
    $('#cplt').onclick=()=>setFL(!$('#cpfl').innerHTML);
    function text(){ setTimeout(()=>$('#cpv').animate([{background:'#f9c9c2'},{background:'#fdecea'}],{duration:900}),0); $('#cpv').innerHTML=mode?'Sprinkle <b>iron filings</b> around the magnet and watch what they do.':marks.length<6?`The <b>needle</b> lines up with the <b>magnetic field</b>. Its red end points along the field, from <b>N</b> to <b>S</b>. Drop the compass in at least 6 places.`:
      `You have plotted ${marks.length} points. Press <b>Show field lines</b> to see how your arrows follow them: the field lines go from the <b>north pole</b> to the <b>south pole</b>, and where they are <b>closer together</b>, the field is <b>stronger</b>.`; }
    function setMode(i){ mode=i; $('#cph').innerHTML=i?'Press <b>Sprinkle iron filings</b>.':'<b>Drag</b> the compass. Each drop leaves an arrow.';
      $('#cpr').textContent='Clear'; $('#cpl').textContent=i?'Sprinkle iron filings':(showLines?'Hide field lines':'Show field lines');
      $('#cpfil').style.display=i?'':'none'; $('#cpfl').style.display=i?'':'none'; $('#cplt').style.display=i?'':'none'; $('#cpstrrow').style.display=i?'none':''; $('#cpmarks').style.display=i?'none':''; paintC(); text(); }
    $('#cpl').onclick=()=>{ if(mode){ sprinkle(); return; } showLines=!showLines; $('#cplines').innerHTML=showLines?lines():''; setMode(0); };
    $('#cpr').onclick=()=>{ if(mode){ fil=[]; drawFil(0); setFL(false); text(); return; } marks.length=0; marksDraw(); text(); };
    K.choices($('#cpm'),['Plotting compass','Iron filings'],setMode,0);
    readout(cx,cy); nudge();
    K.cue(()=>$('#cpc g'),{watch:$('#cpsvg'),host:el,to:{dx:130,dy:60}});
    $('#cpm').addEventListener('click',()=>{ if(mode) K.cue($('#cpl'),{host:el}); });
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
    // One question at a time: pick the thing to change, keep everything else the same (fair test),
    // switch on, watch the paper clips jump up, and see the bar chart build up from the textbook's data.
    const F={coils:{n:'number of coils',tab:'Number of coils',fmt:v=>v+' coils',concl:'More <b>turns on the coil</b> → more paper clips → a <b>stronger</b> electromagnet.'},
      pd:{n:'potential difference',tab:'Potential difference',fmt:v=>v,concl:'Bigger <b>potential difference</b> → more paper clips → a <b>stronger</b> electromagnet.'},
      core:{n:'type of core',tab:'Type of core',fmt:v=>v+' core',concl:'Iron and steel cores pick up paper clips, aluminium picks up <b>none</b>. A core made of a <b>magnetic material</b> makes a <b>stronger</b> electromagnet.'},
      wire:{n:'type of wire',tab:'Type of wire',fmt:v=>v+' wire',concl:'With everything else the same, <b>copper</b> wire picks up 16 paper clips and <b>tungsten</b> wire only 3. The type of wire changes the strength too.'}};
    const keys=['coils','pd','core','wire'], AC=CU, NCLIP=20;
    let f='coils', set, on=false, held=0, run=0; const tested={coils:{},pd:{},core:{},wire:{}};
    el.innerHTML=`<p class="hint" style="margin:0 0 6px">Choose what to change, then press the <b>switch</b>.</p>
      <div class="stage" style="padding:0"><div class="ch" id="emtabs" style="padding:10px 10px 0"></div>
      <style>#emq b{color:#9a3412}</style><div id="emq" style="min-height:3.2em;padding:9px 14px;margin:8px 10px 0;border-left:5px solid ${AC};border-radius:6px;background:#fff1e6;color:#3b1d0f;line-height:1.5"></div>
      <svg viewBox="0 0 680 420" id="emsvg" aria-label="An electromagnet picking up paper clips, with a bar chart of the results">
        <g id="emcirc"></g><g id="emclips"></g><g id="emctl"></g><g id="emchart"></g></svg></div>`;
    const $=s=>el.querySelector(s);
    const row=()=>DATA.find(d=>d.coils===set.coils&&d.pd===set.pd&&d.core===set.core&&d.wire===set.wire);
    const V=()=>VARS.find(v=>v.k===f);
    // 20 paper clips that stay in the DOM so they can really move (CSS transition on transform)
    const clipPath='M-3 -8 v15 a3 3 0 0 0 6 0 v-17 a4.5 4.5 0 0 0 -9 0 v19 a6 6 0 0 0 12 0 v-15';
    $('#emclips').innerHTML=Array.from({length:NCLIP},(_,i)=>`<g class="emclip" style="transition:transform .38s cubic-bezier(.3,1.3,.5,1)"><path d="${clipPath}" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></g>`).join('');
    const clips=[...el.querySelectorAll('.emclip')];
    const pileAt=i=>`translate(${196+(i%10)*18+((i*7)%5)}px,${398-Math.floor(i/10)*7}px) rotate(${84+(i*29)%18}deg)`;
    const upAt=i=>`translate(${192+(i%10)*19}px,${i<10?236:262}px) rotate(${(i*37)%14-7}deg)`;
    function placeClips(){ clips.forEach((c,i)=>{ c.style.transform=i<held?upAt(i):pileAt(i); }); }
    function circuit(){
      const needSw=!on&&tested[f][set[f]]===undefined, cur=on?LIVE:OFF, wireCol=set.wire==='copper'?'#c2410c':'#6b7280';
      const coreCol=set.core==='iron'?'#8b8f98':set.core==='steel'?'#55606e':'#dfe3e8';
      const turns=Math.round(set.coils/2.5)+2; let coil=''; for(let i=0;i<turns;i++){ const x=186+i*(190/turns); coil+=`<path d="M${x} 186 C${x+7} 180 ${x+12} 232 ${x+5} 226" stroke="${wireCol}" stroke-width="${f==='wire'||f==='coils'?4:3.5}" fill="none"/>`; }
      const hl=k=>f===k?AC:MUTED, wt=k=>f===k?700:400;
      return `<rect x="0" y="0" width="680" height="420" fill="#fffdf8"/>
        <line x1="20" y1="408" x2="420" y2="408" stroke="${INK}" stroke-width="2"/>
        <path d="M80 124 L80 92 L190 92 M250 92 L400 92 L400 206 L384 206 M178 206 L80 206 L80 186" fill="none" stroke="${cur}" stroke-width="3" ${on?'stroke-dasharray="10 6" class="emflow"':''}/>
        <rect x="58" y="124" width="44" height="62" fill="#fff" stroke="${f==='pd'?AC:INK}" stroke-width="${f==='pd'?3.5:2.5}"/><rect x="72" y="117" width="16" height="7" fill="${INK}"/>
        <text x="80" y="161" text-anchor="middle" font-size="15" font-weight="700" class="mono" fill="${f==='pd'?AC:INK}">${set.pd}</text>
        <g id="emsw" style="cursor:pointer"><rect x="180" y="62" width="80" height="50" fill="transparent"/><circle cx="194" cy="92" r="5" fill="${INK}"/><circle cx="246" cy="92" r="5" fill="${INK}"/>
          <line x1="194" y1="92" x2="${on?246:238}" y2="${on?92:64}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
          <text x="220" y="${on?78:52}" text-anchor="middle" font-size="14" font-weight="700" fill="${on?LIVE:AC}">${on?'ON':needSw?'click the switch':'switch'}</text>
          ${needSw?`<circle cx="220" cy="84" r="26" fill="none" stroke="${AC}" stroke-width="3"><animate attributeName="r" values="22;34;22" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.15;1" dur="1.3s" repeatCount="indefinite"/></circle>`:''}</g>
        <rect x="178" y="190" width="206" height="32" rx="4" fill="${coreCol}" stroke="${f==='core'?AC:INK}" stroke-width="${f==='core'?3.5:2.5}"/>${coil}
        <text x="50" y="160" text-anchor="end" font-size="13" fill="${hl('pd')}" font-weight="${wt('pd')}">p.d.</text>
        <text x="281" y="180" text-anchor="middle" font-size="13" fill="${MUTED}"><tspan fill="${hl('coils')}" font-weight="${wt('coils')}">${set.coils} coils</tspan> of <tspan fill="${hl('wire')}" font-weight="${wt('wire')}">${set.wire}</tspan> wire on <tspan fill="${hl('core')}" font-weight="${wt('core')}">${set.core==='iron'?'an':'a'} ${set.core}</tspan> core</text>
        ${on||held?`<text x="281" y="318" text-anchor="middle" font-size="30" font-weight="700" class="mono" fill="${INK}" id="emcount">${held}</text><text x="281" y="338" text-anchor="middle" font-size="13" fill="${MUTED}">paper clips picked up</text>`:''}
        ${!on&&held&&set.core==='steel'?`<text x="281" y="360" text-anchor="middle" font-size="13" font-weight="700" fill="#55606e">switched off: the steel core stays magnetic</text>`:''}`;
    }
    function stepper(){ const v=V(), i=v.opts.indexOf(set[f]), x=f==='pd'?80:281, y=f==='pd'?272:140, w=f==='pd'?132:150;
      // after a result, point at the button that leads to a value not yet tested
      const T=tested[f], up=v.opts.findIndex((o,j)=>j>i&&T[o]===undefined), dn=v.opts.findIndex((o,j)=>j<i&&T[o]===undefined);
      const nd=T[set[f]]!==undefined&&(!on||held===T[set[f]])?(up>=0?1:dn>=0?-1:0):0, bx=nd>0?w/2-17:-w/2+17;
      const nx=nd?`<circle cx="${bx}" cy="0" r="16" fill="none" stroke="${AC}" stroke-width="3"><animate attributeName="r" values="14;24;14" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.15;1" dur="1.3s" repeatCount="indefinite"/></circle>
        <text x="${bx}" y="-26" text-anchor="middle" font-size="13" font-weight="700" fill="${AC}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">next: press ${nd>0?'+':'−'}</text>`:'';
      return `<g transform="translate(${x} ${y})">${nx}<rect x="${-w/2}" y="-17" width="${w}" height="34" rx="17" fill="#fff7ed" stroke="${AC}" stroke-width="2"/>
        <g class="embtn" data-d="-1" style="cursor:pointer;opacity:${i>0?1:.25}"><circle cx="${-w/2+17}" cy="0" r="13" fill="${AC}"/><text x="${-w/2+17}" y="6" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">−</text></g>
        <text x="0" y="5" text-anchor="middle" font-size="14" font-weight="700" class="mono" fill="${INK}">${f==='coils'?set[f]+' coils':set[f]}</text>
        <g class="embtn" data-d="1" style="cursor:pointer;opacity:${i<v.opts.length-1?1:.25}"><circle cx="${w/2-17}" cy="0" r="13" fill="${AC}"/><text x="${w/2-17}" y="6" text-anchor="middle" font-size="20" font-weight="700" fill="#fff">+</text></g></g>`; }
    function chart(){ const v=V(), n=v.opts.length, X0=455, Wd=205, B=372, k=10, slot=Wd/n, bw=Math.min(42,slot-16), T=tested[f];
      let s=`<text x="${X0+Wd/2}" y="96" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">paper clips picked up</text>
        <text x="${X0+Wd/2}" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#9a3412">measured results, not a calculation</text>
        <text x="${X0+Wd/2}" y="132" text-anchor="middle" font-size="11.5" fill="${MUTED}">a student’s results table, textbook p42</text>
        <line x1="${X0-8}" y1="${B}" x2="${X0+Wd}" y2="${B}" stroke="${INK}" stroke-width="2"/><line x1="${X0-8}" y1="${B}" x2="${X0-8}" y2="${B-k*20-10}" stroke="${INK}" stroke-width="2"/>`;
      for(let c=0;c<=20;c+=5) s+=`<text x="${X0-14}" y="${B-c*k+4}" text-anchor="end" font-size="11" class="mono" fill="${MUTED}">${c}</text><line x1="${X0-8}" y1="${B-c*k}" x2="${X0+Wd}" y2="${B-c*k}" stroke="${LINE}" stroke-width="${c?1:0}"/>`;
      v.opts.forEach((o,i)=>{ const cx=X0+slot*(i+.5), cur=o===set[f], val=cur&&(on||held)?held:T[o];
        s+= val!==undefined ? `<rect x="${cx-bw/2}" y="${B-val*k}" width="${bw}" height="${val*k}" fill="${cur?AC:'#fdba74'}" stroke="${cur?'#9a3412':'none'}" stroke-width="1.5"/><text x="${cx}" y="${B-val*k-6}" text-anchor="middle" font-size="13" font-weight="700" class="mono" fill="${INK}">${val}</text>`
          : `<rect x="${cx-bw/2}" y="${B-60}" width="${bw}" height="60" fill="none" stroke="${cur?AC:LINE}" stroke-dasharray="4 4" stroke-width="1.5"/><text x="${cx}" y="${B-24}" text-anchor="middle" font-size="16" fill="${cur?AC:MUTED}">?</text>`;
        s+=`<text x="${cx}" y="${B+17}" text-anchor="middle" font-size="12" class="mono" font-weight="${cur?700:400}" fill="${cur?AC:INK}">${o}</text>`; });
      return s+`<text x="${X0+Wd/2}" y="${B+36}" text-anchor="middle" font-size="12" fill="${MUTED}">${F[f].n}</text>`; }
    function question(){ const v=V(), fix=Object.keys(BASE).filter(q=>q!==f).map(q=>F[q].fmt(v.fix[q])).join(', '), T=tested[f], left=v.opts.filter(o=>T[o]===undefined);
      let h=`<b>Question:</b> does the <b>${F[f].n}</b> change how many paper clips the electromagnet picks up?<br><span style="font-size:.92em">Kept the same (fair test): ${fix}.</span>`;
      if(on&&held===row().clips) h=`<b>${F[f].fmt(set[f])} → ${held} paper clips.</b> `+(left.length?`Now change the <b>${F[f].n}</b> with <b>−</b> / <b>+</b> and switch on again.`:'')+(left.length?'':`<br>${F[f].concl}`);
      else if(!left.length&&!on) h=`<b>All done.</b> ${F[f].concl}`+(set.core==='steel'&&held?' The <b>steel</b> core stays magnetic when you switch off.':'');
      $('#emq').innerHTML=h; }
    function draw(){ $('#emcirc').innerHTML=circuit(); $('#emctl').innerHTML=stepper(); $('#emchart').innerHTML=chart(); placeClips(); question();
      $('#emsw').onclick=toggle; el.querySelectorAll('.embtn').forEach(b=>b.onclick=()=>change(+b.dataset.d)); }
    // the circuit group is re-rendered under the clips; keep clips above it
    function change(d){ const v=V(), i=v.opts.indexOf(set[f])+d; if(i<0||i>=v.opts.length) return; set[f]=v.opts[i]; run++; on=false; held=0; draw(); }
    function toggle(){ if(on){ on=false; run++; if(set.core!=='steel') held=0; draw(); return; }
      on=true; const me=++run, r=row(); held=0; draw(); let k=0;
      const add=()=>{ if(me!==run||!el.isConnected) return; if(k<r.clips){ held=++k; draw(); setTimeout(add,90); } else { tested[f][set[f]]=r.clips; draw(); } };
      if(!r.clips){ tested[f][set[f]]=0; draw(); } else setTimeout(add,250); }
    function pick(i){ f=keys[i]; set=Object.assign({},VARS.find(v=>v.k===f).fix); on=false; held=0; run++; draw(); }
    K.choices($('#emtabs'),keys.map(k=>F[k].tab),pick,0);
  }

  /* ---------------- 2.4.2 Electric bell ----------------
     One realistic drawing used by both "Label the bell" and "Ring the bell".
     o.a: armature position 0 (rest) … 1 (hammer on the gong); o.live: current flowing; o.pressed: bell push held;
     o.hit: seconds since the hammer hit the gong; o.focus: step 1–4 to highlight on the diagram. */
  const BELL_PIV={x:430,y:62};
  function bellArt(o={}){
    const a=o.a||0, live=!!o.live, pressed=!!o.pressed, th=a*8*Math.PI/180, closed=a<.32;
    const W=live?'#dc2626':'#7c8594', flow=live?'stroke-dasharray="10 7" class="emflow"':'';
    const rot=(dx,dy)=>[BELL_PIV.x+dx*Math.cos(th)-dy*Math.sin(th), BELL_PIV.y+dx*Math.sin(th)+dy*Math.cos(th)];
    let coil=''; for(let i=0;i<15;i++){ const x=252+i*9; coil+=`<path d="M${x} 104 C${x+5} 100 ${x+8} 140 ${x+4} 137" stroke="url(#bcu)" stroke-width="4.2" fill="none" stroke-linecap="round"/>`; }
    const [bx,by]=rot(7,114), tip=closed?[452,150]:[452-(a-.32)*34,150+(a-.32)*6];
    const hitAge=o.hit===undefined?9:o.hit, shake=hitAge<.25?Math.sin(hitAge*90)*2.2*(1-hitAge*4):0;
    const waves=hitAge<.7?[0,1,2].map(k=>`<circle cx="320" cy="322" r="${70+hitAge*110+k*15}" fill="none" stroke="#a16207" stroke-width="${2.2-k*.6}" opacity="${Math.max(0,.55-hitAge*.8-k*.14)}"/>`).join(''):'';
    const ring=(x,y,r,n)=>`<g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${x+r*.72}" cy="${y-r*.72}" r="11" fill="#ea580c"/><text x="${x+r*.72}" y="${y-r*.72+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${n}</text></g>`;
    const [ax,ay]=rot(0,60);
    const focus={1:ring(320,120,58,1),2:ring(ax-14,ay,30,2),3:ring(452,150,20,3),4:ring((bx+tip[0])/2,(by+tip[1])/2,22,4)}[o.focus]||'';
    return `<defs>
        <linearGradient id="bcore" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9ced6"/><stop offset=".45" stop-color="#8d949e"/><stop offset="1" stop-color="#5d636c"/></linearGradient>
        <linearGradient id="bcu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${live?'#f97316':'#e0905a'}"/><stop offset=".5" stop-color="${live?'#c2410c':'#b4632f'}"/><stop offset="1" stop-color="#7c2d12"/></linearGradient>
        <linearGradient id="biron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b7280"/><stop offset=".5" stop-color="#9ca3af"/><stop offset="1" stop-color="#4b5563"/></linearGradient>
        <radialGradient id="bgong" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#fdf6d8"/><stop offset=".35" stop-color="#e3c66a"/><stop offset=".8" stop-color="#b08a2e"/><stop offset="1" stop-color="#7a5c16"/></radialGradient>
        <linearGradient id="bwood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4e8cf"/><stop offset="1" stop-color="#e6d3ac"/></linearGradient>
        <radialGradient id="bbrass" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#a16207"/></radialGradient></defs>
      <rect x="0" y="0" width="680" height="440" fill="#fffdf8"/>
      <rect x="168" y="28" width="476" height="396" rx="16" fill="url(#bwood)" stroke="#b9975b" stroke-width="2"/>
      <!-- wires -->
      <path d="M82 142 L82 118 L190 118 M190 118 L250 118 M392 120 L404 120 L404 50 L420 50 M548 164 L548 384 L190 384 M82 272 L82 314 M108 342 L132 342 L132 384 L190 384" fill="none" stroke="${W}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" ${flow}/>
      <!-- battery -->
      <rect x="58" y="146" width="48" height="126" rx="8" fill="#334155" stroke="#0f172a" stroke-width="2"/><rect x="58" y="146" width="48" height="34" rx="8" fill="#b45309"/><rect x="72" y="136" width="20" height="12" rx="3" fill="#94a3b8" stroke="#0f172a"/>
      <text x="82" y="232" text-anchor="middle" font-size="13" fill="#e2e8f0" transform="rotate(-90 82 232)">battery</text>
      <!-- bell push -->
      <g id="bpush" style="cursor:pointer"><rect x="40" y="300" width="90" height="90" fill="transparent"/>
        <circle cx="82" cy="342" r="27" fill="#f8fafc" stroke="#475569" stroke-width="2"/><circle cx="82" cy="342" r="${pressed?12:15}" fill="${pressed?'#c2410c':'#ea580c'}" stroke="#7c2d12" stroke-width="2"/>
        <circle cx="78" cy="${pressed?339:337}" r="4" fill="#fff" opacity="${pressed?.25:.6}"/>
        <text x="82" y="392" text-anchor="middle" font-size="14" font-weight="700" fill="#7c2d12">bell push</text>
        ${o.prompt&&!pressed?`<text x="82" y="410" text-anchor="middle" font-size="12.5" font-weight="700" fill="#ea580c">press and hold</text><circle cx="82" cy="342" r="30" fill="none" stroke="#ea580c" stroke-width="3"><animate attributeName="r" values="28;40;28" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.1;1" dur="1.3s" repeatCount="indefinite"/></circle>`:''}</g>
      <!-- terminals on the board -->
      <circle cx="190" cy="118" r="7" fill="url(#bbrass)" stroke="#713f12"/><circle cx="190" cy="384" r="7" fill="url(#bbrass)" stroke="#713f12"/>
      <!-- electromagnet: coil of copper wire on an iron core, mounted on a bracket -->
      <rect x="248" y="134" width="12" height="12" fill="#a8a29e" stroke="#57534e"/><rect x="372" y="134" width="12" height="12" fill="#a8a29e" stroke="#57534e"/>
      ${live?`<g fill="none" stroke="#dc2626" stroke-dasharray="3 5" opacity=".55"><ellipse cx="320" cy="120" rx="108" ry="36"/><ellipse cx="320" cy="120" rx="124" ry="52" opacity=".6"/></g>`:''}
      <rect x="236" y="104" width="160" height="32" rx="8" fill="url(#bcore)" stroke="#374151" stroke-width="2"/>${coil}
      <text x="320" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="${live?'#b91c1c':'#78716c'}">${live?'magnetic':'not magnetic'}</text>
      <!-- gong -->
      <g transform="translate(${shake} 0)"><rect x="312" y="384" width="16" height="24" fill="#a8a29e" stroke="#57534e"/>
        <circle cx="320" cy="322" r="66" fill="url(#bgong)" stroke="#6b4f12" stroke-width="2"/><circle cx="320" cy="322" r="44" fill="none" stroke="#f8eec6" stroke-width="2" opacity=".6"/><circle cx="320" cy="322" r="8" fill="#57534e"/></g>${waves}
      <!-- armature on its hinge (bracket at the top), hammer at the bottom -->
      <rect x="418" y="38" width="24" height="16" rx="2" fill="#a8a29e" stroke="#57534e"/><circle cx="420" cy="50" r="4" fill="url(#bbrass)"/>
      <g transform="rotate(${a*8} ${BELL_PIV.x} ${BELL_PIV.y})">
        <rect x="425" y="62" width="10" height="20" fill="#cbd5e1" stroke="#475569"/>
        <rect x="423" y="80" width="14" height="150" rx="2" fill="url(#biron)" stroke="#1f2937" stroke-width="1.6"/>
        <rect x="428" y="228" width="4" height="80" fill="#57534e"/><circle cx="430" cy="314" r="11" fill="#475569" stroke="#111827" stroke-width="1.5"/><circle cx="426" cy="310" r="3" fill="#cbd5e1"/></g>
      <!-- springy metal strip on the armature, touching the contact screw: the make and break switch -->
      <path d="M${bx} ${by} Q${(bx+tip[0])/2+8} ${(by+tip[1])/2+4} ${tip[0]} ${tip[1]}" stroke="#d4a017" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <rect x="532" y="140" width="22" height="40" fill="#a8a29e" stroke="#57534e"/>
      <path d="M454 150 L466 144 L532 144 L532 156 L466 156 Z" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>${[0,1,2,3,4,5].map(i=>`<line x1="${474+i*9}" y1="144" x2="${470+i*9}" y2="156" stroke="#64748b"/>`).join('')}
      <rect x="500" y="138" width="10" height="24" rx="2" fill="url(#bbrass)" stroke="#713f12"/>
      ${live&&a>.28&&a<.4?`<path d="M454 141 l5 -9 l-1 7 l7 -3 l-8 11" fill="#facc15" stroke="#ca8a04"/>`:''}
      ${focus}`;
  }
  // the make-and-break model shared by both bell widgets. draw(st) is called every frame.
  function bellEngine(el,draw){
    const st={a:0,dir:0,pressed:false,rings:0,ringT:-9,speed:1,sound:false}; let raf=0, last=0, ac=null;
    function ding(){ if(!st.sound) return; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(), g=ac.createGain(); o.frequency.value=1250; o.type='sine'; g.gain.setValueAtTime(.12,ac.currentTime); g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.5); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+.5); }catch(e){} }
    function tick(t){ const dt=Math.min(40,t-(last||t))/1000*st.speed; last=t;
      if(!st.pressed&&st.dir>0&&st.a<.32) st.dir=-1;          // let go before the contact opened
      if(st.pressed&&st.dir<0&&st.a<.15) st.dir=1;            // contact made again: the electromagnet pulls again
      st.a+=st.dir*dt*6;
      if(st.a>=1){ st.a=1; st.dir=-1; st.rings++; st.ringT=performance.now(); ding(); }
      if(st.a<=0){ st.a=0; st.dir=st.pressed?1:0; }
      draw(st); const busy=st.pressed||st.a>0||st.dir!==0||performance.now()-st.ringT<800;
      if(busy&&el.isConnected) raf=requestAnimationFrame(tick); else raf=0; }
    const go=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
    st.down=e=>{ e&&e.preventDefault(); st.pressed=true; if(st.dir<=0&&st.a<.15) st.dir=1; go(); };
    st.up=()=>{ if(!st.pressed) return; st.pressed=false; go(); };
    st.idle=()=>!raf;
    document.addEventListener('pointerup',st.up); document.addEventListener('pointercancel',st.up);
    return st;
  }
  function bellLabel(el,U){
    const L=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#1d1b16" stroke-width="1.6" fill="none"/><circle cx="${x2}" cy="${y2}" r="3.5" fill="#1d1b16"/>`;
    // labels sit in the order of the parts from top to bottom, so no leader lines cross
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 440" font-family="Atkinson Hyperlegible, sans-serif">${bellArt({}).replace(/<text x="320" y="92"[^]*?<\/text>/,'')}
      ${L(560,98,456,147)}${L(560,205,448,172)}${L(560,258,437,200)}${L(300,212,300,138)}</svg>`;
    const img='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    K.label(el,U,{img,w:680,h:440,alt:'Electric bell diagram',tip:'These are the labels from the textbook diagram.',slots:[
      {name:'make and break switch',x:470,y:64,w:200,h:34,info:'Where the springy metal strip touches the contact screw. When the armature moves it breaks the circuit; when it springs back it makes the circuit again.'},
      {name:'springy metal strip',x:470,y:188,w:200,h:34,info:'Returns the armature to its original position when the electromagnet is no longer magnetic.'},
      {name:'iron armature',x:470,y:241,w:200,h:34,info:'The piece of iron that the electromagnet attracts. The hammer is on the end of it.'},
      {name:'electromagnet',x:200,y:212,w:200,h:34,info:'A coil of wire around an iron core. It is magnetic only while a current flows.'}]});
    // when every label is in place, the picture becomes a working bell: press the bell push to ring it
    const leaders=`${L(560,98,456,147)}${L(560,205,448,172)}${L(560,258,437,200)}${L(300,212,300,138)}`;
    const mo=new MutationObserver(()=>{ if(!el.isConnected){ mo.disconnect(); return; } const svgEl=el.querySelector('svg.lbl'), im=svgEl&&svgEl.querySelector('image');
      if(!im||!/All labelled \(/.test(el.querySelector('#lb-st')?.textContent||'')) return;
      const g=document.createElementNS(K.NS,'g'); im.replaceWith(g);
      const bell=bellEngine(el,st=>{ g.innerHTML=bellArt({a:st.a,live:st.pressed&&st.a<.32,pressed:st.pressed,hit:(performance.now()-st.ringT)/1000,prompt:!st.rings}).replace(/<text x="320" y="92"[^]*?<\/text>/,'')+leaders; });
      bell.sound=true;
      g.innerHTML=bellArt({prompt:true}).replace(/<text x="320" y="92"[^]*?<\/text>/,'')+leaders;
      svgEl.addEventListener('pointerdown',e=>{ if(e.target.closest('#bpush')) bell.down(e); });
      el.querySelector('#lb-st').innerHTML='All labelled. Now <b>press and hold the bell push</b> on the diagram to ring the bell.'; });
    mo.observe(el,{subtree:true,childList:true,characterData:true});
    const c0=el.querySelector('#lb-pool .chip'); if(c0) K.cue(c0,{host:el,ring:true,to:el.querySelector(`.slot[data-i="${c0.dataset.k}"]`)});
  }
  function bellSim(el,U){
    // Continuous model: current flows only while the push is held AND the springy strip touches the contact.
    let pressed=false, a=0, dir=0, rings=0, ringT=-9, speed=1, raf=0, last=0, sound=false, ac=null, step=0, capKey='';
    el.innerHTML=`<div class="stage" id="bstage" style="padding:0;user-select:none;touch-action:none">
        <style>#bcap b{color:#9a3412}</style><div id="bcap" style="min-height:3.2em;padding:9px 14px;margin:10px 10px 0;border-left:5px solid #ea580c;border-radius:6px;background:#fff1e6;color:#3b1d0f;line-height:1.5"></div>
        <svg viewBox="0 0 680 440" id="bsvg" aria-label="Electric bell"></svg></div>
      <div class="row" style="gap:18px;align-items:center;margin-top:8px"><div style="width:240px">${K.range('Speed (turn down for slow motion)',1,10,1,10,'#')}</div><label class="hint"><input type="checkbox" id="bsnd"> sound</label><span class="readout" style="margin:0">rings <b id="brn">0</b></span></div>`;
    const $=s=>el.querySelector(s);
    const TXT=['Press and hold the <b>bell push</b> on the diagram. Turn the <b>speed</b> down to see each step.',
      '<b>1</b> The bell push completes the circuit, so a <b>current flows</b>. The <b>electromagnet</b> becomes magnetic.',
      '<b>2</b> The electromagnet <b>attracts the iron armature</b>. The hammer moves to the gong.',
      '<b>3</b> The armature has moved, so the circuit is <b>broken</b>: no current flows. The coil and core are <b>no longer magnetic</b>.',
      '<b>4</b> The <b>springy metal strip</b> returns to its original position. The circuit is complete again, so it all repeats until you let go.'];
    function frame(){ const closed=a<.32, live=pressed&&closed;
      step=!pressed?0:live&&a<.05&&dir>=0?1:dir>0?2:a>.6?3:4;
      $('#bsvg').innerHTML=bellArt({a,live,pressed,hit:(performance.now()-ringT)/1000,focus:speed<=.3?step:0,prompt:!rings});
      $('#brn').textContent=rings;
      // the four steps stay on screen; only the highlight moves (and only in slow motion), so the text can be read
      const slow=speed<=.3, head=!pressed&&rings?'You let go: the circuit is <b>open</b>, so no current flows and the bell stops.':!pressed?TXT[0]:slow?'In slow motion: watch the numbered ring on the diagram.':'The <b>make and break switch</b> keeps the bell ringing. Turn the <b>speed</b> down to follow each step.';
      const hi=pressed&&slow?step:0, key=head+hi;
      if(key!==capKey){ capKey=key; $('#bcap').innerHTML=`<div style="margin-bottom:4px">${head}</div><ol style="margin:0;padding-left:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;font-size:.92em">${TXT.slice(1).map((t,k)=>`<li style="padding:3px 8px;border-radius:5px;${hi===k+1?'background:#fed7aa;outline:2px solid #ea580c':''}">${t}</li>`).join('')}</ol>`; } }
    function ding(){ if(!sound) return; try{ ac=ac||new (window.AudioContext||window.webkitAudioContext)(); const o=ac.createOscillator(), g=ac.createGain(); o.frequency.value=1250; o.type='sine'; g.gain.setValueAtTime(.12,ac.currentTime); g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.5); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime+.5); }catch(e){} }
    function tick(t){ const dt=Math.min(40,t-(last||t))/1000*speed; last=t;
      if(!pressed&&dir>0&&a<.32) dir=-1;          // let go before the contact opened
      if(pressed&&dir<0&&a<.15) dir=1;            // contact made again: the electromagnet pulls again
      a+=dir*dt*6;
      if(a>=1){ a=1; dir=-1; rings++; ringT=performance.now(); ding(); }
      if(a<=0){ a=0; dir=pressed?1:0; }
      frame(); const busy=pressed||a>0||dir!==0||performance.now()-ringT<800;
      if(busy&&el.isConnected) raf=requestAnimationFrame(tick); else raf=0; }
    const go=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
    const down=e=>{ e.preventDefault(); pressed=true; if(dir<=0&&a<.15) dir=1; go(); };
    const up=()=>{ if(!pressed) return; pressed=false; go(); };
    $('#bstage').addEventListener('pointerdown',e=>{ if(e.target.closest('#bpush')) down(e); });
    document.addEventListener('pointerup',up); document.addEventListener('pointercancel',up);
    $('#bsnd').onchange=e=>{ sound=e.target.checked; };
    K.ranges(el,([v])=>{ speed=v/10; if(!raf) frame(); });
    frame();
  }

  /* ---------------- 2.4.2 Circuit breaker ----------------
     Same drawing style as the bell. The current flows in → contact arm → contacts → electromagnet coil → out.
     A larger current makes the electromagnet pull harder on the iron catch. At the trip value the catch is pulled
     off the contact arm, the spring pulls the contacts apart, and the reset button pops up. It stays off until reset.
     The numbers are demo values (the textbook gives none): it starts at 3 and is set to trip at 6. */
  function breaker(el,U){
    const TRIP=6; let I=3, tripped=false, catchA=0, armA=0, raf=0, spark=0, capKey='';
    el.innerHTML=`<div class="stage" style="padding:0">
        <div class="row" style="gap:16px;align-items:center;flex-wrap:wrap;padding:10px 12px 0"><div style="flex:1;min-width:220px">${K.range('Current',1,10,1,3,'#')}</div>
          <button class="btn ghost small" id="cbf">Faulty device: large current</button></div>
        <style>#cbv b{color:#9a3412}</style><div id="cbv" style="min-height:3.2em;padding:9px 14px;margin:8px 10px 0;border-left:5px solid #ea580c;border-radius:6px;background:#fff1e6;color:#3b1d0f;line-height:1.5"></div>
        <svg viewBox="0 0 680 420" id="cbsvg" aria-label="Circuit breaker"></svg></div>`;
    const $=s=>el.querySelector(s);
    const P={x:196,y:150}, Q={x:350,y:252};
    function draw(){ const live=!tripped, col=live?'#dc2626':'#7c8594', w=live?2.5+I*.45:3, dur=(1.5-I*.11).toFixed(2);
      const flow=live?`stroke-dasharray="11 7" style="animation:emflow ${dur}s linear infinite"`:'';
      const ar=-armA*Math.PI/180, ex=P.x+140*Math.cos(ar), ey=P.y+140*Math.sin(ar);
      let coil=''; for(let i=0;i<10;i++){ const y=272+i*8.5; coil+=`<path d="M398 ${y} C392 ${y+3} 392 ${y+7} 398 ${y+8} L446 ${y+8}" stroke="url(#ccu)" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
      const glow=live?Array.from({length:Math.max(1,Math.round(I/2.5))},(_,k)=>`<ellipse cx="422" cy="312" rx="${40+k*13}" ry="${56+k*11}" fill="none" stroke="#dc2626" stroke-dasharray="3 5" opacity="${.5-k*.1}"/>`).join(''):'';
      let spring=`M318 50`; for(let k=0;k<9;k++) spring+=` L${k%2?310:326} ${58+k*((ey-6-58)/9)}`; spring+=` L318 ${ey-6}`;
      const pull=live?Math.min(1,I/10):0, gy=v=>350-v*240;
      const resetUp=tripped, hint=tripped&&I<TRIP;
      $('#cbsvg').innerHTML=`<defs>
          <linearGradient id="ccase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient>
          <linearGradient id="ciron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b7280"/><stop offset=".5" stop-color="#9ca3af"/><stop offset="1" stop-color="#4b5563"/></linearGradient>
          <linearGradient id="ccu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c2d12"/><stop offset=".5" stop-color="${live?'#f97316':'#d08a55'}"/><stop offset="1" stop-color="#7c2d12"/></linearGradient>
          <radialGradient id="cbr" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#a16207"/></radialGradient></defs>
        <rect x="0" y="0" width="680" height="420" fill="#fffdf8"/>
        <!-- case -->
        <rect x="146" y="34" width="340" height="370" rx="18" fill="url(#ccase)" stroke="#94a3b8" stroke-width="2.5"/>
        <!-- wires: in → arm pivot; contact → coil; coil → out -->
        <path d="M20 ${P.y} L${P.x} ${P.y}" stroke="${col}" stroke-width="${w}" ${flow}/>
        <path d="M320 172 L320 290 L398 290 M444 352 L462 352 L462 394 L20 394" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" ${flow}/>
        <text x="22" y="${P.y-10}" font-size="14" font-weight="700" fill="${MUTED}">current in</text><text x="22" y="386" font-size="14" font-weight="700" fill="${MUTED}">current out</text>
        <!-- electromagnet -->
        ${glow}<rect x="404" y="266" width="36" height="96" rx="4" fill="url(#ciron)" stroke="#1f2937" stroke-width="1.6"/>${coil}
        <text x="384" y="340" text-anchor="end" font-size="13" fill="${MUTED}">electromagnet</text>
        <!-- fixed contact -->
        <rect x="306" y="162" width="28" height="10" rx="2" fill="url(#cbr)" stroke="#713f12"/>
        ${spark?`<path d="M318 150 l9 -14 l-3 11 l10 -4 l-13 15" fill="#facc15" stroke="#ca8a04"/>`:''}
        <!-- contact arm with its moving contact, pivot on the left -->
        <g transform="rotate(${-armA} ${P.x} ${P.y})"><rect x="${P.x}" y="${P.y-5}" width="140" height="10" rx="3" fill="#cbd5e1" stroke="#334155" stroke-width="1.6"/><rect x="${P.x+112}" y="${P.y+5}" width="24" height="7" rx="2" fill="url(#cbr)" stroke="#713f12"/></g>
        <circle cx="${P.x}" cy="${P.y}" r="7" fill="url(#cbr)" stroke="#713f12"/>
        <!-- spring pulling the arm up -->
        <rect x="300" y="42" width="36" height="8" fill="#94a3b8"/><path d="${spring}" fill="none" stroke="#334155" stroke-width="2.2" stroke-linejoin="round"/>
        <text x="342" y="84" font-size="13" fill="${MUTED}">spring</text>
        <text x="250" y="190" text-anchor="middle" font-size="13" fill="${MUTED}">contacts</text>
        <!-- iron catch: holds the end of the arm down; the electromagnet pulls its right end -->
        <g transform="rotate(${catchA} ${Q.x} ${Q.y})"><path d="M${Q.x} ${Q.y} L${Q.x} 142 L322 142" fill="none" stroke="#4b5563" stroke-width="7" stroke-linejoin="round"/><rect x="${Q.x}" y="${Q.y-6}" width="94" height="12" rx="3" fill="url(#ciron)" stroke="#1f2937"/></g>
        <circle cx="${Q.x}" cy="${Q.y}" r="5" fill="#1f2937"/><text x="${Q.x-36}" y="${Q.y-2}" text-anchor="end" font-size="13" fill="${MUTED}">iron catch</text>
        <!-- reset button -->
        <g id="cbreset" style="cursor:${tripped?'pointer':'default'}"><rect x="226" y="${resetUp?6:22}" width="44" height="${resetUp?30:14}" rx="5" fill="${tripped?'#ea580c':'#fdba74'}" stroke="#7c2d12" stroke-width="2"/><rect x="210" y="0" width="76" height="40" fill="transparent"/></g>
        <text x="200" y="${resetUp?26:30}" text-anchor="end" font-size="13" font-weight="${tripped?700:400}" fill="${tripped?'#c2410c':MUTED}">reset button</text>
        ${hint?`<circle cx="248" cy="22" r="26" fill="none" stroke="#ea580c" stroke-width="3"><animate attributeName="r" values="22;34;22" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.15;1" dur="1.3s" repeatCount="indefinite"/></circle><text x="292" y="26" font-size="13" font-weight="700" fill="#ea580c">press</text>`:''}
        <!-- status -->
        <text x="228" y="320" text-anchor="middle" font-size="18" font-weight="700" fill="${live?'#b91c1c':'#475569'}">${live?'ON':'OFF: tripped'}</text>
        <!-- pull meter -->
        <g><text x="580" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">pull on the</text><text x="580" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="${INK}">iron catch</text>
          <rect x="560" y="110" width="40" height="240" rx="5" fill="#f1f5f9" stroke="#94a3b8"/>
          <rect x="560" y="${gy(pull)}" width="40" height="${350-gy(pull)}" rx="5" fill="${I>=TRIP&&live?'#dc2626':'#f59e0b'}"/>
          <line x1="552" y1="${gy(TRIP/10)}" x2="608" y2="${gy(TRIP/10)}" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 3"/>
          <text x="614" y="${gy(TRIP/10)+4}" font-size="12.5" font-weight="700" fill="${INK}">trips</text>
          ${live?'':`<rect x="560" y="${gy(I/10)}" width="40" height="${350-gy(I/10)}" rx="5" fill="none" stroke="${I>=TRIP?'#dc2626':'#475569'}" stroke-width="2" stroke-dasharray="4 3"/>`}
          <text x="580" y="372" text-anchor="middle" font-size="12" fill="${MUTED}">${live?'current '+I:'set to '+I+', but no current'}</text>
          <text x="580" y="398" text-anchor="middle" font-size="11.5" fill="${MUTED}"><tspan font-weight="700">Demo values</tspan>: set to</text><text x="580" y="412" text-anchor="middle" font-size="11.5" fill="${MUTED}">trip at ${TRIP}</text></g>`;
      $('#cbreset').onclick=reset;
      const txt=tripped?`<b>Tripped.</b> The large current made the <b>electromagnet</b> strong enough to <b>attract the iron catch</b>. The <b>spring</b> pulled the <b>contacts</b> apart, so the circuit is <b>broken</b>. It <b>stays off</b> until you push the <b>reset button</b>.`+(I>=TRIP?'<br>The fault is still there: if you reset now, it trips again. <b>Lower the current</b> first.':'<br>The current is small again: press the <b>reset button</b> to switch it back on.')
        :I>=TRIP?'The current is <b>too large</b>…'
        :`Current <b>${I}</b>: the electromagnet pulls on the iron catch, but <b>not enough</b> to release it. The circuit stays <b>on</b>.`+(I===3?' Drag the <b>current</b> up.':'');
      if(txt!==capKey){ capKey=txt; $('#cbv').innerHTML=txt; } }
    function animate(){ const tC=tripped?8:I/TRIP*2.5, tA=tripped?14:0; catchA+=(tC-catchA)*.25; armA+=(tA-armA)*.3; if(spark) spark--; draw();
      if((Math.abs(tC-catchA)>.05||Math.abs(tA-armA)>.05||spark)&&el.isConnected) raf=requestAnimationFrame(animate); else raf=0; }
    const go=()=>{ if(!raf) raf=requestAnimationFrame(animate); };
    let timer=0; const check=()=>{ clearTimeout(timer); if(I>=TRIP&&!tripped) timer=setTimeout(()=>{ tripped=true; spark=10; go(); },450); };
    function reset(){ if(!tripped) return; tripped=false; go(); check(); }
    K.ranges(el,([v])=>{ I=v; go(); check(); });
    $('#cbf').onclick=()=>{ const r=el.querySelector('.kit-range input'); r.value=9; r.dispatchEvent(new Event('input')); };
    draw();
    K.cue(el.querySelector('.kit-range input'),{host:el});
  }

  return {twoMagnets,compassPlot,buildEM,bellLabel,bellSim,breaker};
})();
