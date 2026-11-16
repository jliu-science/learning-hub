/* ===== Flashcards scene: an anime-style dusk sky, and Dora's own night creature (redrawn from her sketch) flying around.
   It roams on the card table, perches on the top edge of the card while a question is open, and does a loop when an answer is right. ===== */
(function(){
  const NS='http://www.w3.org/2000/svg', reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DEFS=`<radialGradient id="dc-bodyG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d6c9ff"/><stop offset=".45" stop-color="#8a76d6"/><stop offset="1" stop-color="#3a2d78"/></radialGradient>
<radialGradient id="dc-headG" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#e3d9ff"/><stop offset=".5" stop-color="#9886e0"/><stop offset="1" stop-color="#43358a"/></radialGradient>
<radialGradient id="dc-maneG" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e9e1ff"/><stop offset=".8" stop-color="#a99bdc"/><stop offset="1" stop-color="#6a5ba8"/></radialGradient>
<radialGradient id="dc-bellyG" cx=".4" cy=".35"><stop offset="0" stop-color="#f3eeff"/><stop offset="1" stop-color="#b3a5ea" stop-opacity=".2"/></radialGradient>
<radialGradient id="dc-clawG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffc0a8"/><stop offset=".5" stop-color="#f06b55"/><stop offset="1" stop-color="#8c2a2a"/></radialGradient>
<linearGradient id="dc-wingG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3fb5c4" stop-opacity=".95"/><stop offset="1" stop-color="#1b3f7a" stop-opacity=".85"/></linearGradient>
<radialGradient id="dc-irisG" cx=".4" cy=".35"><stop offset="0" stop-color="#fff2a0"/><stop offset=".6" stop-color="#f2a93b"/><stop offset="1" stop-color="#9a4c12"/></radialGradient>
<radialGradient id="dc-glowC"><stop offset="0" stop-color="#bff9ff" stop-opacity="1"/><stop offset=".35" stop-color="#7ff3ff" stop-opacity=".55"/><stop offset="1" stop-color="#7ff3ff" stop-opacity="0"/></radialGradient>
<radialGradient id="dc-eyeGlowC"><stop offset="0" stop-color="#eaffb0" stop-opacity="1"/><stop offset=".4" stop-color="#c8ff6a" stop-opacity=".5"/><stop offset="1" stop-color="#c8ff6a" stop-opacity="0"/></radialGradient>
<filter id="dc-fur" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="dc-softFur" x="-10%" y="-10%" width="120%" height="120%">
<feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed="9" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
</filter>
`, CREATURE=`<g id="dc-bodyAll">
<g id="dc-tail">
<path id="dc-tailPath" d="M28,-52 C78,-40 112,-58 114,-108 C116,-150 152,-170 170,-142 C184,-120 160,-102 150,-120" fill="none" stroke="#5a4aa6" stroke-width="10" stroke-linecap="round"/>
<path d="M28,-52 C78,-40 112,-58 114,-108 C116,-150 152,-170 170,-142" fill="none" stroke="#b6a6f2" stroke-width="3" stroke-linecap="round" opacity=".55" transform="translate(-2,-2)"/>
<g id="dc-spikes" fill="#f3ecdc" stroke="#8d7fb8" stroke-width="1"></g>
<circle cx="150" cy="-120" r="6" fill="#f3ecdc"/>
</g>
<g id="dc-wingL" transform="translate(-28,-74)">
<g id="dc-wingLr"><path d="M0,0 C-30,6 -78,38 -120,72 C-96,64 -84,70 -74,76 C-70,62 -56,56 -44,58 C-40,44 -26,38 -16,40 C-12,28 -4,16 4,10Z" fill="url(#dc-wingG)" stroke="#123056" stroke-width="2"/>
<path d="M0,4 L-118,71 M-2,8 L-74,74 M0,10 L-44,57 M2,12 L-16,40" stroke="#9ff2ff" stroke-width="1.4" opacity=".55"/></g>
</g>
<g id="dc-wingR" transform="translate(28,-74) scale(-1,1)">
<g id="dc-wingRr"><path d="M0,0 C-30,6 -78,38 -120,72 C-96,64 -84,70 -74,76 C-70,62 -56,56 -44,58 C-40,44 -26,38 -16,40 C-12,28 -4,16 4,10Z" fill="url(#dc-wingG)" stroke="#123056" stroke-width="2"/>
<path d="M0,4 L-118,71 M-2,8 L-74,74 M0,10 L-44,57 M2,12 L-16,40" stroke="#9ff2ff" stroke-width="1.4" opacity=".55"/></g>
</g>
<g fill="url(#dc-bodyG)" stroke="#2c2260" stroke-width="2">
<path d="M-26,-40 C-28,-24 -26,-14 -24,-6 L-12,-6 C-12,-18 -12,-30 -10,-40Z"/>
<path d="M26,-40 C28,-24 26,-14 24,-6 L12,-6 C12,-18 12,-30 10,-40Z"/>
<ellipse cx="-19" cy="-3" rx="13" ry="8"/><ellipse cx="19" cy="-3" rx="13" ry="8"/>
</g>
<path d="M-29,2 l-3,4 M-21,4 l-1,4 M-12,2 l2,4 M29,2 l3,4 M21,4 l1,4 M12,2 l-2,4" stroke="#e9e1ff" stroke-width="2" stroke-linecap="round"/>
<g id="dc-torso">
<path d="M-40,-38 C-60,-80 -50,-140 -32,-176 L32,-176 C50,-140 60,-80 40,-38 C24,-22 -24,-22 -40,-38Z" fill="url(#dc-bodyG)" stroke="#2c2260" stroke-width="2" filter="url(#dc-softFur)"/>
<ellipse cx="0" cy="-88" rx="26" ry="34" fill="url(#dc-bellyG)" filter="url(#dc-softFur)"/>
<g id="dc-clawL" transform="translate(-24,-112) scale(1.3)">
<path d="M-14,-40 C-22,-24 -18,-10 -6,-2" stroke="#7a2a33" stroke-width="7" stroke-linecap="round" fill="none"/>
<ellipse cx="0" cy="4" rx="15" ry="12" fill="url(#dc-clawG)" stroke="#6b1f22" stroke-width="2"/>
<path d="M6,-4 C16,-16 26,-14 28,-6 C20,-8 14,-4 10,2Z" fill="url(#dc-clawG)" stroke="#6b1f22" stroke-width="2"/>
<g class="finger"><path d="M8,8 C18,10 26,6 28,-2 C22,2 16,4 8,2Z" fill="#ffb39c" stroke="#6b1f22" stroke-width="2"/></g>
</g>
<g id="dc-clawR" transform="translate(24,-112) scale(-1.3,1.3)">
<path d="M-14,-40 C-22,-24 -18,-10 -6,-2" stroke="#7a2a33" stroke-width="7" stroke-linecap="round" fill="none"/>
<ellipse cx="0" cy="4" rx="15" ry="12" fill="url(#dc-clawG)" stroke="#6b1f22" stroke-width="2"/>
<path d="M6,-4 C16,-16 26,-14 28,-6 C20,-8 14,-4 10,2Z" fill="url(#dc-clawG)" stroke="#6b1f22" stroke-width="2"/>
<g class="finger"><path d="M8,8 C18,10 26,6 28,-2 C22,2 16,4 8,2Z" fill="#ffb39c" stroke="#6b1f22" stroke-width="2"/></g>
</g>
</g>
<g id="dc-head">
<g id="dc-mane" filter="url(#dc-fur)">
<g fill="url(#dc-maneG)">
<circle cx="-78" cy="-326" r="36"/><circle cx="78" cy="-326" r="36"/>
<circle cx="-74" cy="-272" r="36"/><circle cx="74" cy="-272" r="36"/>
<circle cx="-38" cy="-362" r="42"/><circle cx="38" cy="-362" r="42"/>
<circle cx="0" cy="-330" r="62"/><circle cx="0" cy="-286" r="54"/>
<circle cx="-44" cy="-300" r="44"/><circle cx="44" cy="-300" r="44"/>
</g>
<path d="M-60,-356 C-40,-380 -10,-390 20,-382" stroke="#fff" stroke-width="6" fill="none" opacity=".6" stroke-linecap="round"/>
</g>
<g id="dc-horns" fill="none" stroke-linecap="round">
<path d="M-62,-382 C-74,-420 -44,-446 -20,-424" stroke="#2a2350" stroke-width="9"/>
<path d="M62,-382 C74,-420 44,-446 20,-424" stroke="#2a2350" stroke-width="9"/>
<path class="hornGlow" d="M-62,-382 C-74,-420 -44,-446 -20,-424" stroke="#7ff3ff" stroke-width="3"/>
<path class="hornGlow" d="M62,-382 C74,-420 44,-446 20,-424" stroke="#7ff3ff" stroke-width="3"/>
</g>
<path d="M-60,-205 C-62,-240 -58,-262 -50,-284 C-35,-264 -20,-258 0,-258 C20,-258 35,-264 50,-284 C58,-262 62,-240 60,-205 C58,-176 30,-166 0,-166 C-30,-166 -58,-176 -60,-205Z" fill="url(#dc-headG)" stroke="#2c2260" stroke-width="2"/>
<path d="M-44,-270 L-38,-252 L-30,-260Z M44,-270 L38,-252 L30,-260Z" fill="#f3b7d8" opacity=".7"/>
<ellipse cx="-38" cy="-192" rx="9" ry="5" fill="#ff9fc4" opacity=".35"/><ellipse cx="38" cy="-192" rx="9" ry="5" fill="#ff9fc4" opacity=".35"/>
<g id="dc-eyes">
<g id="dc-eyeL" transform="translate(-24,-214)">
<path d="M0,-30 L4,-6 L0,28 L-4,-6Z" fill="#2a1d4a" opacity=".7"/>
<ellipse rx="14" ry="13" fill="#fdfaf2" stroke="#2c2260" stroke-width="2"/>
<g class="iris"><circle r="9.5" fill="url(#dc-irisG)"/>
<path d="M0,-8 L2.2,-2.2 L8,0 L2.2,2.2 L0,8 L-2.2,2.2 L-8,0 L-2.2,-2.2Z" fill="#1a1030"/>
<circle cx="-3.5" cy="-4" r="2.6" fill="#fff"/></g>
<path d="M-15,-9 C-8,-15 6,-16 15,-10" stroke="#2c2260" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>
<g id="dc-eyeR" transform="translate(24,-214)">
<ellipse rx="14" ry="13" fill="#fdfaf2" stroke="#2c2260" stroke-width="2"/>
<g class="iris"><circle r="9.5" fill="url(#dc-irisG)"/><circle r="4.5" fill="#1a1030"/>
<circle cx="-3.5" cy="-4" r="2.6" fill="#fff"/></g>
<path d="M-15,-10 C-6,-16 8,-15 15,-9" stroke="#2c2260" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>
</g>
<path d="M-4,-198 l4,3 l4,-3" fill="none" stroke="#2c2260" stroke-width="2" stroke-linecap="round"/>
<g id="dc-mouthClosed"><path d="M-16,-186 Q0,-178 18,-189" fill="none" stroke="#2c2260" stroke-width="2.5" stroke-linecap="round"/>
<path d="M8,-182.5 L12,-171 L15,-184.5Z" fill="#fff" stroke="#2c2260" stroke-width="1.5" stroke-linejoin="round"/></g>
<g id="dc-mouthOpen" opacity="0"><path d="M-18,-188 Q0,-176 20,-190 Q4,-160 -18,-188Z" fill="#5a1630" stroke="#2c2260" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M8,-182 L12,-168 L16,-184Z" fill="#fff" stroke="#2c2260" stroke-width="1.5"/><path d="M-12,-185 L-9,-176 L-6,-183Z" fill="#fff"/></g>
</g>
</g>
<g id="dc-glowAll">
<g id="dc-headGlow">
<circle class="knob" cx="-20" cy="-424" r="30" fill="url(#dc-glowC)"/>
<circle class="knob" cx="20" cy="-424" r="30" fill="url(#dc-glowC)"/>
<circle cx="-20" cy="-424" r="6" fill="#dffcff"/><circle cx="20" cy="-424" r="6" fill="#dffcff"/>
<g id="dc-eyeGlow" opacity="0">
<circle cx="-24" cy="-214" r="26" fill="url(#dc-eyeGlowC)"/><circle cx="24" cy="-214" r="26" fill="url(#dc-eyeGlowC)"/>
</g>
</g>
</g>`;

  const FCP=document.body.classList.contains('fc-page');
  /* ---------- background scene (flashcards page only) ---------- */
  if(FCP){
  const bg=document.createElement('div'); bg.className='fc-scene'; bg.setAttribute('aria-hidden','true');
  let stars=''; let s=7; const r=()=>((s=(s*9301+49297)%233280)/233280);
  for(let i=0;i<110;i++){ const x=r()*1600, y=r()*520, rr=.6+r()*1.6; stars+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(1)}" fill="#fff" style="animation-delay:${(r()*4).toFixed(2)}s" class="${r()<.35?'tw':''}" opacity="${(.35+r()*.6).toFixed(2)}"/>`; }
  let flies=''; for(let i=0;i<16;i++){ flies+=`<circle cx="${(r()*1600).toFixed(0)}" cy="${(560+r()*300).toFixed(0)}" r="${(2+r()*2.5).toFixed(1)}" fill="#fff6a8" class="ff" style="animation-delay:${(r()*6).toFixed(2)}s;animation-duration:${(5+r()*5).toFixed(1)}s"/>`; }
  bg.innerHTML=`<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs>
      <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14123a"/><stop offset=".42" stop-color="#3b2a73"/><stop offset=".72" stop-color="#9c4f8f"/><stop offset=".9" stop-color="#f08f7a"/><stop offset="1" stop-color="#ffc58a"/></linearGradient>
      <radialGradient id="sc-moon"><stop offset="0" stop-color="#fff6d6" stop-opacity=".9"/><stop offset=".25" stop-color="#ffe6a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient>
      <filter id="sc-blur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
    <rect width="1600" height="900" fill="url(#sc-sky)"/>
    <g class="stars">${stars}</g>
    
    <g class="clouds" filter="url(#sc-blur)" opacity=".55">
      <g class="c1"><ellipse cx="300" cy="230" rx="220" ry="40" fill="#b07ac9"/><ellipse cx="380" cy="205" rx="120" ry="40" fill="#c58ed3"/></g>
      <g class="c2"><ellipse cx="1000" cy="330" rx="260" ry="42" fill="#d47ea8"/><ellipse cx="920" cy="305" rx="130" ry="38" fill="#e39bb7"/></g>
      <g class="c1"><ellipse cx="1500" cy="420" rx="200" ry="34" fill="#e88f99"/></g></g>
    <path d="M0 640 C220 560 420 600 620 570 S1000 520 1220 580 S1480 600 1600 560 V900 H0Z" fill="#5a3478" opacity=".9"/>
    <path d="M0 720 C180 660 360 700 560 670 S900 640 1120 690 S1440 700 1600 660 V900 H0Z" fill="#3a2258"/>
    <g fill="#24163d">${Array.from({length:34},(_,i)=>{ const x=i*49+(i%3)*9, h=60+((i*37)%50); return `<path d="M${x} 780 l18 -${h} l18 ${h}z"/>`; }).join('')}</g>
    <path d="M0 790 C300 760 600 800 900 775 S1400 770 1600 785 V900 H0Z" fill="#1a1030"/>
    <g>${flies}</g></svg><div class="sc-dora"></div>`;
  document.body.prepend(bg);
  }

  /* ---------- the creature ---------- */
  /* ---------- on the subject pages the creature takes that subject's colour ---------- */
  const path=location.pathname.replace(/\\/g,'/');
  const TINT=/\/biology\//.test(path)?'#0f9d76':/\/chemistry\//.test(path)?'#ea580c':/\/physics\//.test(path)?'#2563eb':/fractions-decimals/.test(path)?'#0d9488':/\/maths\//.test(path)?'#7c3aed':null;
  const mix=(hex,to,k)=>{ const a=parseInt(hex.slice(1),16), b=parseInt(to.slice(1),16); const c=[16,8,0].map(sh=>Math.round(((a>>sh)&255)*(1-k)+((b>>sh)&255)*k)); return '#'+c.map(v=>v.toString(16).padStart(2,'0')).join(''); };
  let defs=DEFS;
  if(TINT){ const L=mix(TINT,'#ffffff',.72), M=mix(TINT,'#ffffff',.18), D=mix(TINT,'#000000',.45);
    defs=defs.replace(/(id="dc-(?:bodyG|headG)"[^>]*>)<stop offset="0" stop-color="[^"]+"\/><stop offset="([^"]+)" stop-color="[^"]+"\/><stop offset="1" stop-color="[^"]+"\/>/g,(m,h,o)=>`${h}<stop offset="0" stop-color="${L}"/><stop offset="${o}" stop-color="${M}"/><stop offset="1" stop-color="${D}"/>`)
      .replace(/(id="dc-maneG"[^>]*>(?:<stop[^>]*>){2})<stop offset="\.8" stop-color="[^"]+"\/><stop offset="1" stop-color="[^"]+"\/>/,(m,h)=>`${h}<stop offset=".8" stop-color="${mix(TINT,'#ffffff',.55)}"/><stop offset="1" stop-color="${mix(TINT,'#000000',.2)}"/>`); }
  const lay=document.createElementNS(NS,'svg'); lay.setAttribute('class','fc-flyer'); lay.setAttribute('aria-hidden','true'); if(!FCP) lay.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:55;pointer-events:none;overflow:visible';
  lay.innerHTML=`<defs>${defs}</defs><g id="dc-pos"><g id="dc-fig">${CREATURE}</g></g>`; document.body.appendChild(lay);
  const $=id=>lay.querySelector('#'+id), pos=$('dc-pos'), fig=$('dc-fig');
  // spikes along the tail, like Dora's drawing
  const tp=$('dc-tailPath'), tl=tp.getTotalLength();
  for(let i=1;i<=7;i++){ const d=tl*(0.12+i*0.1); if(d>tl-10) break; const p=tp.getPointAtLength(d), q=tp.getPointAtLength(d+1), a=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;
    const sp=document.createElementNS(NS,'path'); sp.setAttribute('d','M-5,-3 L0,-17 L5,-3Z'); sp.setAttribute('transform',`translate(${p.x},${p.y}) rotate(${a})`); $('dc-spikes').appendChild(sp); }

  let W=innerWidth,H=innerHeight; const size=()=>{ W=innerWidth; H=innerHeight; lay.setAttribute('viewBox',`0 0 ${W} ${H}`); }; addEventListener('resize',size); size();
  let x=W*.15,y=H*.75,vx=0,vy=0,sc=.3,tx=x,ty=y,tsc=.3, mode=FCP?'roam':'rest', lapT=0, nextLap=6, cheerT=0, t0=performance.now(), last=t0;
  function perchPoint(){ const c=document.querySelector('.fc-stage .fc-card'); if(!c) return [W*.85,H*.3]; const b=c.getBoundingClientRect(); return [b.left+b.width*.72,b.top+3]; }
  function newTarget(){ const m=Math.min(W,H)*.12; tx=m+Math.random()*(W-2*m); ty=H*.32+Math.random()*(H*.62); }
  newTarget();
  window.FCCreature={ mode(m){ if(m==='cheer'){ if(mode!=='perch') return; mode='cheer'; cheerT=0; } else mode=m; if(m==='roam') newTarget(); } };

  function frame(now){
    const dt=Math.min(.05,(now-last)/1000); last=now; const t=(now-t0)/1000;
    let flying=true, base=Math.min(W,H)/900;
    if(mode==='rest'){ tsc=.14; const btn=document.querySelector('.topbar .fc-btn,.topbar .home-btn,.topbar .music-btn'), br=btn&&btn.getBoundingClientRect(), tb=document.querySelector('.topbar');
      tx=br?br.left-46:W-260; ty=(tb?tb.getBoundingClientRect().bottom:52)-4; nextLap-=dt; if(nextLap<=0){ mode='lap'; lapT=0; } }
    else if(mode==='lap'){ lapT+=dt; tsc=.22*base; const k=lapT/5; tx=W*(.15+.75*Math.sin(Math.PI*k)); ty=H*(.22+.12*Math.sin(k*9)); if(lapT>5){ mode='rest'; nextLap=25+Math.random()*20; } }
    else if(mode==='roam'){ tsc=.42*base; if(Math.hypot(tx-x,ty-y)<60) newTarget(); }
    else if(mode==='perch'){ tsc=.2*base; [tx,ty]=perchPoint(); }
    else if(mode==='cheer'){ cheerT+=dt; tsc=.3*base; const a=cheerT*3.2; tx=W*.5+Math.cos(a)*W*.32; ty=H*.5+Math.sin(a)*H*.28; if(cheerT>2.1) mode='perch'; }
    const dx=tx-x, dy=ty-y, d=Math.hypot(dx,dy);
    if((mode==='perch'||mode==='rest')&&d<4){ x=tx; y=ty; vx=vy=0; flying=false; }
    else { const maxV=(mode==='cheer'?900:mode==='perch'?700:mode==='lap'?520:mode==='rest'?380:170)*Math.max(.6,base), k=mode==='roam'?1.2:mode==='lap'?2.5:5;
      const want=Math.min(maxV,d*(mode==='roam'?3:4)); const ax=(dx/(d||1)*want-vx)*k, ay=(dy/(d||1)*want-vy)*k; vx+=ax*dt; vy+=ay*dt; x+=vx*dt; y+=vy*dt; if((mode==='perch'||mode==='rest')&&d<30) flying=false; }
    sc+=(tsc-sc)*Math.min(1,dt*4);
    const bob=flying?Math.sin(t*3)*8*base:Math.sin(t*1.6)*1.2, tilt=Math.max(-18,Math.min(18,vx*.04));
    pos.setAttribute('transform',`translate(${x.toFixed(1)},${(y+bob).toFixed(1)}) rotate(${tilt.toFixed(1)}) scale(${sc.toFixed(3)})`);
    const w=flying?Math.sin(t*(mode==='roam'?9:15))*26-6:Math.sin(t*2)*4;
    $('dc-wingLr').setAttribute('transform',`rotate(${w.toFixed(1)})`); $('dc-wingRr').setAttribute('transform',`rotate(${w.toFixed(1)})`);
    $('dc-tail').setAttribute('transform',`rotate(${(Math.sin(t*2.2)*5).toFixed(1)} 28 -52)`);
    const kn=.6+.4*Math.sin(t*2.2); lay.querySelectorAll('.knob').forEach(k=>k.setAttribute('opacity',kn.toFixed(2)));
    const blink=(t%4.2)<.12; lay.querySelectorAll('.iris').forEach(i=>i.setAttribute('transform',blink?'scale(1 .1)':''));
    if(!reduce) requestAnimationFrame(frame);
  }
  if(reduce){ mode=FCP?'perch':'rest'; requestAnimationFrame(frame); setInterval(()=>requestAnimationFrame(n=>{ last=n; frame(n); }),500); } else requestAnimationFrame(frame);
})();
