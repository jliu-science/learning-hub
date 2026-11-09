/* ===== Interactive models for Topics 2.3 Magnetism and 2.4 Electromagnets ===== */
window.MagnetWidgets = (function(){
  const K = window.Kit;
  const INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf', NC='#d0402b', SC='#3b82c4', CU='#c2410c', LIVE='#dc2626', OFF='#9ca3af';

  const bar=(x,y,w,h,left,right)=>`<rect x="${x}" y="${y}" width="${w/2}" height="${h}" fill="${left==='N'?NC:SC}" stroke="${INK}" stroke-width="2"/><rect x="${x+w/2}" y="${y}" width="${w/2}" height="${h}" fill="${right==='N'?NC:SC}" stroke="${INK}" stroke-width="2"/>
    <text x="${x+w/4}" y="${y+h/2+6}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">${left}</text><text x="${x+3*w/4}" y="${y+h/2+6}" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">${right}</text>`;

  /* ---------------- 2.3.1 Two magnets: attract or repel ---------------- */
  function twoMagnets(el,U){
    let A=['S','N'], B=['S','N'], bx=360, stuck=false;
    el.innerHTML=`<div class="sim wide"><div class="row"><button class="btn ghost small" id="tmA">Flip magnet A</button><button class="btn ghost small" id="tmB">Flip magnet B</button></div>
      <div class="stage" style="margin-top:8px"><svg viewBox="0 0 640 170" id="tmsvg" aria-label="Two bar magnets"></svg></div>
      <div class="verdict" id="tmv"></div></div>`;
    const $=s=>el.querySelector(s); const AX=60, W=200, H=46, Y=62;
    const like=()=>A[1]===B[0];
    function draw(){ const gap=Math.max(0,bx-(AX+W)); const f=Math.min(70,9000/((gap+30)*(gap+30))*8);
      const dir=like()?1:-1; let arrows='';
      if(!stuck&&f>4){ arrows=K.arrow(AX+W-10,Y-14,AX+W-10-dir*f,Y-14,INK,3,9)+K.arrow(bx+10,Y-14,bx+10+dir*f,Y-14,INK,3,9); }
      $('#tmsvg').innerHTML=`<text x="${AX+W/2}" y="${Y+H+26}" text-anchor="middle" font-size="15" fill="${MUTED}">magnet A</text>${bar(AX,Y,W,H,A[0],A[1])}
        <g id="tmb" class="grab">${bar(bx,Y,W,H,B[0],B[1])}<text x="${bx+W/2}" y="${Y+H+26}" text-anchor="middle" font-size="15" fill="${MUTED}">magnet B (drag me)</text></g>${arrows}`;
      $('#tmv').innerHTML=`Facing poles: <b>${A[1]}</b> and <b>${B[0]}</b>. ${like()?'<b>Like poles repel</b>: the magnets push apart.':'<b>Unlike poles attract</b>: the magnets pull together.'} ${stuck?'They have snapped together.':gap<40?'They are close, so the force is <b>strong</b>.':gap>200?'They are far apart, so the force is <b>weak</b>.':'The closer they are, the stronger the force.'} <span class="hint">Magnetic force is a non-contact force.</span>`;
      K.svgDrag($('#tmb'),$('#tmsvg'),{start(p){ this.off=p.x-bx; stuck=false; },move(x){ bx=Math.max(AX+W,Math.min(420,x-(this.off||0))); draw(); },end(){ release(); }});
    }
    function release(){ const gap=bx-(AX+W);
      if(like()){ const go=()=>{ const g=bx-(AX+W); if(g<220&&bx<420){ bx+=Math.max(1.5,40/(g+8)); draw(); requestAnimationFrame(go);} }; go(); }
      else if(gap<90){ const go=()=>{ if(bx>AX+W){ bx=Math.max(AX+W,bx-Math.max(2,(120-(bx-AX-W))/8)); draw(); requestAnimationFrame(go);} else { stuck=true; draw(); } }; go(); } }
    $('#tmA').onclick=()=>{ A=[A[1],A[0]]; stuck=false; draw(); };
    $('#tmB').onclick=()=>{ B=[B[1],B[0]]; stuck=false; draw(); };
    draw();
  }

  /* ---------------- 2.3.1 Plotting compass: find the field shape ---------------- */
  function compassPlot(el,U){
    const N={x:220,y:150}, S={x:380,y:150}; let showLines=false; const marks=[];
    el.innerHTML=`<div class="sim wide"><div class="row"><button class="btn ghost small" id="cpl">Show field lines</button><button class="btn ghost small" id="cpr">Clear</button><span class="hint">Drag the compass around the magnet. Where you let go, its direction is drawn.</span></div>
      <div class="stage" style="margin-top:8px"><svg viewBox="0 0 600 300" id="cpsvg" aria-label="A bar magnet with a plotting compass"></svg></div>
      <div class="verdict" id="cpv">The compass needle lines up with the magnetic field. Its north end points along the field line.</div></div>`;
    const $=s=>el.querySelector(s);
    const field=(x,y)=>{ const d=(p,s)=>{ const dx=x-p.x, dy=y-p.y, r=Math.max(12,Math.hypot(dx,dy)); return [s*dx/r**3, s*dy/r**3]; };
      const a=d(N,1), b=d(S,-1); const fx=a[0]+b[0], fy=a[1]+b[1]; const m=Math.hypot(fx,fy)||1; return [fx/m,fy/m,m]; };
    function lines(){ let out=''; const starts=[];
      [0,.3,.6,.9,1.2,1.5,1.8,2.1].forEach(t=>[1,-1].forEach(sg=>{ if(!t&&sg<0) return; const ang=Math.PI+sg*t; starts.push([N.x+14*Math.cos(ang),N.y+14*Math.sin(ang)]); }));
      starts.forEach(([x,y])=>{ let pts=[[x,y]]; for(let i=0;i<4000;i++){ const [fx,fy]=field(x,y); x+=fx*2; y+=fy*2; if(x<-500||x>1100||y<-500||y>800) break; pts.push([x,y]); if(Math.hypot(x-S.x,y-S.y)<12) break; }
        const vis=pts.filter(p=>p[0]>10&&p[0]<590&&p[1]>10&&p[1]<290); const mi=pts.indexOf(vis[Math.floor(vis.length*.45)]); const mid=pts[mi], nx=pts[Math.min(pts.length-1,mi+3)];
        out+=`<polyline points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="1.4" opacity=".7"/>`;
        if(mid&&nx) out+=K.arrow(mid[0],mid[1],nx[0],nx[1],'#7c3aed',1.6,7); });
      return out; }
    const needle=(x,y,s=1)=>{ const [fx,fy]=field(x,y); const a=Math.atan2(fy,fx)*180/Math.PI;
      return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 -4 L16 0 L0 4Z" fill="${NC}"/><path d="M0 -4 L-16 0 L0 4Z" fill="#cbd5e1" stroke="${INK}" stroke-width=".6"/></g>`; };
    let cx=300, cy=60;
    const svg=$('#cpsvg');
    svg.innerHTML=`<g id="cplines"></g>${bar(200,135,200,30,'N','S')}<g id="cpmarks"></g><g id="cpc" class="grab"></g>`;
    function draw(){ const strong=field(cx,cy)[2];
      $('#cplines').innerHTML=showLines?lines():'';
      $('#cpmarks').innerHTML=marks.map(([x,y])=>needle(x,y,.7)).join('');
      $('#cpc').innerHTML=`<circle cx="${cx}" cy="${cy}" r="22" fill="#fff" stroke="${INK}" stroke-width="2"/>${needle(cx,cy)}`;
      $('#cpv').innerHTML=`The compass needle lines up with the magnetic field. Field lines go from the <b>north</b> pole to the <b>south</b> pole. ${strong>0.00009?'Here, near a pole, the field is <b>strong</b> (field lines close together).':'Further away the field is <b>weaker</b>.'}`;
    }
    K.svgDrag($('#cpc'),svg,{move(x,y){ cx=Math.max(20,Math.min(580,x)); cy=Math.max(20,Math.min(280,y)); if(cx>190&&cx<410&&cy>118&&cy<182) cy=cy<150?118:182; draw(); },end(){ marks.push([cx,cy]); draw(); }});
    $('#cpl').onclick=()=>{ showLines=!showLines; $('#cpl').textContent=showLines?'Hide field lines':'Show field lines'; draw(); };
    $('#cpr').onclick=()=>{ marks.length=0; draw(); };
    draw();
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
    let V=VARS[0], set=Object.assign({},BASE), on=false, held=0, pickupTimer=0, pickupRun=0;
    el.innerHTML=`<div class="sim"><div class="ctl"><p>A student’s results from the textbook. Change <b>one</b> variable at a time, switch on, and count the paper clips.</p>
        <h4>Variable to change</h4><div id="emv"></div><h4 id="emon-h">Value</h4><div id="emo"></div>
        <div class="row" style="margin-top:12px"><button class="btn" id="emon">Switch on</button><button class="btn ghost small" id="emoff" disabled>Switch off</button></div></div>
      <div><div class="stage"><svg viewBox="0 0 460 260" id="emsvg" aria-label="An electromagnet picking up paper clips"></svg></div><div class="verdict" id="emvd"></div></div></div>
      <div class="logwrap"><table class="logtable"><thead><tr><th>Number of coils</th><th>Potential difference</th><th>Type of core</th><th>Type of wire</th><th>Number of paper clips</th></tr></thead><tbody id="emlog"></tbody></table></div>`;
    const $=s=>el.querySelector(s);
    const row=()=>DATA.find(d=>d.coils===set.coils&&d.pd===set.pd&&d.core===set.core&&d.wire===set.wire);
    function draw(){ const coreCol=set.core==='iron'?'#8b8f98':set.core==='steel'?'#5b6472':'#d6dbe2'; const turns=set.coils/2+3;
      const live=on; let coil=''; for(let i=0;i<turns;i++){ const x=110+i*(220/turns); coil+=`<path d="M${x} 78 C${x+6} 74 ${x+10} 126 ${x+4} 122" stroke="${set.wire==='copper'?CU:'#6b7280'}" stroke-width="3" fill="none"/>`; }
      const clips=Array.from({length:held},(_,i)=>{ const x=130+(i%10)*20, y=128+Math.floor(i/10)*30; return `<g transform="translate(${x} ${y}) rotate(${(i*37)%20-10})"><rect x="-4" y="0" width="8" height="24" rx="4" fill="none" stroke="#475569" stroke-width="2"/></g>`; }).join('');
      const pile=Array.from({length:Math.max(0,20-held)},(_,i)=>`<g transform="translate(${100+(i%12)*22} ${232+Math.floor(i/12)*8}) rotate(80)"><rect x="-4" y="0" width="8" height="22" rx="4" fill="none" stroke="#94a3b8" stroke-width="2"/></g>`).join('');
      $('#emsvg').innerHTML=`<rect x="100" y="84" width="240" height="32" rx="4" fill="${coreCol}" stroke="${INK}" stroke-width="2"/><text x="350" y="104" font-size="15" fill="${MUTED}">${set.core} core</text>${coil}
        <path d="M110 80 L110 30 L40 30 L40 60 M330 120 L330 160 L380 160 L380 30 L60 30" fill="none" stroke="${live?LIVE:OFF}" stroke-width="2.5"/>
        <rect x="26" y="60" width="28" height="44" fill="#fff" stroke="${INK}" stroke-width="2"/><text x="40" y="88" text-anchor="middle" font-size="14" class="mono">${set.pd}</text>
        <text x="220" y="20" text-anchor="middle" font-size="15" fill="${live?LIVE:MUTED}">${live?'current flowing':'switched off'}</text>${clips}${pile}`;
      const r=row(); $('#emvd').innerHTML=!on?(held&&set.core==='steel'?`Switched off: the <b>steel</b> core keeps its magnetism, so ${held} clips are still stuck. Steel is hard to magnetise but keeps its magnetism.`:'Switch on to see how many paper clips it picks up.')
        :`${set.coils} coils, ${set.pd}, ${set.core} core, ${set.wire} wire: <b>${r.clips} paper clips</b>.`+(set.core==='aluminium'?' Aluminium is not a magnetic material, so the core does not help.':set.wire==='tungsten'?' Tungsten wire has a bigger resistance than copper, so less current flows.':''); }
    function stopPickup(){ pickupRun++; clearTimeout(pickupTimer); pickupTimer=0; }
    function choose(){ stopPickup(); $('#emon-h').textContent=V.n; K.choices($('#emo'),V.opts.map(String),i=>{ stopPickup(); set=Object.assign({},V.fix); set[V.k]=V.opts[i]; on=false; held=0; $('#emon').disabled=false; $('#emoff').disabled=true; draw(); },V.opts.indexOf(V.fix[V.k])); }
    K.choices($('#emv'),VARS.map(v=>v.n),i=>{ V=VARS[i]; choose(); },0);
    $('#emon').onclick=()=>{ stopPickup(); const run=pickupRun, r=row(); on=true; $('#emon').disabled=true; $('#emoff').disabled=false; let k=0; const add=()=>{ if(run!==pickupRun||!on||('isConnected' in el&&!el.isConnected)) return; if(k<r.clips){ held=++k; draw(); if(k<r.clips) pickupTimer=setTimeout(add,40); } else draw(); }; held=0; add();
      const key=JSON.stringify(set); if(!el.querySelector(`[data-k='${key}']`)){ $('#emlog').insertAdjacentHTML('beforeend',`<tr data-k='${key}'><td>${set.coils}</td><td>${set.pd}</td><td>${set.core}</td><td>${set.wire}</td><td><b>${r.clips}</b></td></tr>`); } };
    $('#emoff').onclick=()=>{ stopPickup(); on=false; $('#emoff').disabled=true; $('#emon').disabled=false; held=set.core==='steel'?held:0; draw(); };
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
      <g><path d="M70 340 L${pressed?70:96} ${pressed?400:385}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="340" r="6" fill="#d97706" stroke="${INK}"/><circle cx="70" cy="400" r="6" fill="#d97706" stroke="${INK}"/><text x="88" y="374" font-size="15" fill="${MUTED}">bell push</text></g>
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
    let pressed=false, phase=0, timer=0, rings=0, slow=false;
    el.innerHTML=`<div class="sim"><div class="ctl"><p><b>Press and hold</b> the bell push. Watch the circuit (red = current flowing).</p>
        <div class="row"><button class="btn hold" id="bellpush">Hold to ring</button><label class="hint"><input type="checkbox" id="bslow"> slow motion</label></div>
        <ol class="steps-list" id="bst"><li>The switch completes the circuit and a current flows.</li><li>The electromagnet attracts the iron armature. The hammer hits the gong: the bell rings once.</li><li>The armature has moved, so the circuit is broken and no current flows. The coil and core are no longer magnetic.</li><li>The springy metal strip returns to its original position, so the circuit is complete again… and it repeats until you let go.</li></ol>
        <p class="readout">rings <b id="brn">0</b></p></div>
      <div class="stage" id="bstage"></div></div>`;
    const $=s=>el.querySelector(s);
    const draw=()=>{ const live=pressed&&phase!==2, pulled=phase===1||phase===2;
      $('#bstage').innerHTML=bellSVG(pulled,live,0,pressed,phase!==2).replace('<svg ','<svg aria-label="Electric bell" ');
      [...$('#bst').children].forEach((li,i)=>li.classList.toggle('on',pressed&&i===phase)); $('#brn').textContent=rings; };
    const step=()=>{ if(!pressed&&phase===0){ draw(); return; }
      phase=(phase+1)%4; if(phase===1) rings++; if(!pressed&&phase===0){ draw(); return; } draw(); timer=setTimeout(step,slow?1100:140); };
    const down=e=>{ e.preventDefault(); if(pressed) return; pressed=true; $('#bellpush').classList.add('down'); phase=0; draw(); clearTimeout(timer); timer=setTimeout(step,slow?1100:140); };
    const up=()=>{ if(!pressed) return; pressed=false; $('#bellpush').classList.remove('down'); };
    $('#bellpush').addEventListener('pointerdown',down); ['pointerup','pointerleave','pointercancel'].forEach(t=>$('#bellpush').addEventListener(t,up));
    $('#bslow').onchange=e=>{ slow=e.target.checked; };
    draw();
  }

  /* ---------------- 2.4.2 Circuit breaker ---------------- */
  function breaker(el,U){
    let tripped=false, I=3, anim=0;
    el.innerHTML=`<div class="sim"><div class="ctl"><p>Make the current in the circuit bigger, as if a device were faulty.</p>
        ${K.range('Current in the circuit',1,10,1,3,'#')}<div class="row"><button class="btn ghost small" id="cbr">Push the reset button</button></div>
        <div class="verdict" id="cbv"></div></div>
      <div class="stage"><svg viewBox="0 0 360 300" id="cbsvg" aria-label="Circuit breaker"></svg></div></div>`;
    const $=s=>el.querySelector(s);
    function draw(){ const live=!tripped; const strong=I>=7; const pull=live&&strong;
      let coil=''; for(let i=0;i<7;i++){ coil+=`<path d="M150 ${170+i*12} L210 ${166+i*12}" stroke="${live?'#b91c1c':'#c97a6a'}" stroke-width="3"/>`; }
      $('#cbsvg').innerHTML=`<rect x="110" y="40" width="160" height="240" fill="none" stroke="#93c5fd" stroke-width="14"/>
        <rect x="165" y="160" width="30" height="96" fill="#8b8f98" stroke="${INK}" stroke-width="2"/>${coil}
        <path d="M120 60 L120 20 L60 20 L60 285 L100 285" stroke="${live?LIVE:OFF}" stroke-width="3" fill="none"/>
        <path d="M150 256 L150 285 L100 285 M210 160 L210 100 L230 100" stroke="${live?LIVE:OFF}" stroke-width="3" fill="none"/>
        <g transform="rotate(${tripped?-18:0} 140 120)"><path d="M140 120 L230 100" stroke="${INK}" stroke-width="5"/><rect x="226" y="96" width="8" height="8" fill="#d97706"/></g>
        <rect x="226" y="96" width="8" height="8" fill="#d97706"/><text x="244" y="104" font-size="14" fill="${MUTED}">contacts</text>
        <rect x="${tripped?172:172}" y="${tripped?146:132}" width="40" height="8" fill="#4b5563" stroke="${INK}"/><text x="218" y="150" font-size="14" fill="${MUTED}">iron catch</text>
        <path d="M140 120 C150 90 120 92 120 72 L120 60" stroke="${INK}" stroke-width="2" fill="none"/><text x="40" y="60" font-size="14" fill="${MUTED}">spring</text>
        <rect x="236" y="190" width="70" height="16" fill="#d97706" stroke="${INK}"/><text x="240" y="225" font-size="14" fill="${MUTED}">reset button</text>
        <text x="20" y="16" font-size="15" fill="${live?LIVE:MUTED}">${live?'current flowing':'circuit broken: no current'}</text>
        <rect x="20" y="290" width="${I*8}" height="6" fill="${strong?LIVE:'#f59e0b'}"/>`;
      $('#cbv').innerHTML=tripped?`<b>Tripped.</b> The large current made the electromagnet strong enough to attract the iron catch. The catch moved, the contacts sprang apart and the circuit was broken. Unlike an electric bell, the circuit <b>stays off</b> until you push the reset button.${strong?' <br><span class="hint">The current is still too large: if you reset now, it will trip again.</span>':''}`
        :strong?'The current is large…':`Normal current. The electromagnet is too weak to attract the iron catch, so the circuit stays on.`; }
    K.ranges(el,([v])=>{ I=v; draw(); clearTimeout(anim); if(I>=7&&!tripped) anim=setTimeout(()=>{ tripped=true; draw(); },500); });
    $('#cbr').onclick=()=>{ tripped=false; draw(); if(I>=7) anim=setTimeout(()=>{ tripped=true; draw(); },500); };
  }

  return {twoMagnets,compassPlot,buildEM,bellLabel,bellSim,breaker};
})();
