/* ===== Interactive models for Topic 1.3 Contact forces ===== */
window.ForcesWidgets = (function(){
  const K = window.Kit;
  const INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf', PUSH='#2563eb', FRIC='#b45309', W='#dc2626', AIR='#0284c7', OK='#16a34a';

  /* ---------------- 1.3.1 Push the book (friction) ----------------
     Textbook story: push gently → it doesn't move; push harder → it moves;
     stop pushing → it slows down and stops. Zoom in: even "smooth" surfaces are rough.
     The slider IS the push: the book reacts live. The table scrolls so the book never leaves the picture. */
  /* Step banner shown right above the diagram (people watch the picture, not the left panel). */
  function stepBanner(ban,done,texts,endText,left){ const k=done.findIndex(d=>!d), key=String(k);
    if(ban.dataset.k===key) return; const first=ban.dataset.k===undefined; ban.dataset.k=key;
    // when the next action is in the left panel, make that control pulse so the eye is drawn there
    if(left&&left[k<0?texts.length:k]){ const t=left[k<0?texts.length:k](); if(t) t.animate([{boxShadow:'0 0 0 0 rgba(37,99,235,.6)'},{boxShadow:'0 0 0 12px rgba(37,99,235,0)'}],{duration:900,iterations:first?2:4}); }
    ban.innerHTML=k<0?`<span class="mono" style="font-size:.8rem;color:var(--accent)">✓ ALL STEPS DONE</span><div>${endText}</div>`
      :`<span class="mono" style="font-size:.8rem;color:var(--accent)">STEP ${k+1} OF ${texts.length} &nbsp;${texts.map((_,i)=>i<k?'●':i===k?'◉':'○').join(' ')}</span><div>${texts[k]}</div>`;
    ban.animate([{background:'var(--accent-soft)',transform:'translateY(-3px)'},{transform:'none'}],{duration:500}); }
  const BAN='style="border-left:4px solid var(--accent);background:var(--accent-soft);padding:8px 12px;margin:0 0 8px;font-size:1rem;border-radius:2px"';

  const SURF=[{n:'Smooth surface',max:4,amp:3},{n:'Rough surface',max:10,amp:8},{n:'Rough surface + oil (lubrication)',max:5,amp:8,oil:true}];
  function pushBook(el,U){
    let S=SURF[0], push=0, x=0, v=0, raf=0, last=0, moved=false, done=[false,false,false], logged={}, off=0;
    const X0=130, CAM=120, BW=104, ACC=90, VMAX=200;
    el.innerHTML=`<div class="sim"><div class="ctl">
        <h4>1. Choose the surface</h4><div id="pbs" class="col"></div>
        <h4>2. Push: drag the slider</h4>${K.range('Push force',0,12,1,0,'# N')}
        <div class="row" style="margin-top:6px"><button class="btn ghost small" id="pbzero">Let go (push = 0 N)</button><button class="btn ghost small" id="pbback">Book back to start</button></div>
        <ol class="steps-list" id="pbst" hidden><li>Push gently. Does the book move?</li><li>Push harder until it moves.</li><li>Let go and watch the book.</li></ol></div>
      <div><div id="pbban" ${BAN}></div><div class="verdict" id="pbv" style="margin:0 0 8px;min-height:4.6em"></div><div class="stage"><svg viewBox="0 0 520 314" id="pbsvg" aria-label="A book being pushed along a table">
        <defs><pattern id="pbrough" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#e2d3b0"/><circle cx="1.5" cy="1.5" r="1" fill="#a68a55"/><circle cx="4.5" cy="4" r=".8" fill="#8f7444"/></pattern><clipPath id="pblens"><circle cx="438" cy="222" r="70"/></clipPath></defs><g id="pbtick"></g><rect id="pbtable" x="0" y="130" width="520" height="16" fill="#e9e1cf"/><rect id="pbsheen" x="0" y="130" width="520" height="4" fill="#facc15" opacity="0"/><line x1="0" y1="130" x2="520" y2="130" stroke="${INK}" stroke-width="2"/>
        <g id="pbbook"><rect x="0" y="80" width="${BW}" height="50" fill="#fdfcf8" stroke="${INK}" stroke-width="2.5"/><rect x="0" y="80" width="${BW}" height="11" fill="#c7d2fe" stroke="${INK}" stroke-width="2.5"/><text x="${BW/2}" y="118" text-anchor="middle" font-size="17" fill="${MUTED}">book</text></g>
        <g id="pbarr"></g><text id="pbstate" x="260" y="30" text-anchor="middle" font-size="18" font-weight="700" fill="${INK}"></text><g id="pbmag"></g></svg></div>
      <div class="readout"><span>push <b id="pbp">0 N</b></span><span>friction <b id="pbf">0 N</b></span><span>resultant <b id="pbr">0 N</b></span></div>
      <p class="hint" style="margin:4px 0 0"><b>Estimated values:</b> the textbook gives <b>no formula</b> for friction, so the most each surface can grip is <b>made up</b>: smooth <b>4 N</b>, rough <b>10 N</b>, rough + oil <b>5 N</b>.</p>
      <table class="tbl" style="margin-top:10px;width:100%;font-size:.88rem"><thead><tr><th style="text-align:left">Surface</th><th style="text-align:left">The book starts to move at</th></tr></thead><tbody id="pblog"><tr><td colspan="2" class="hint">Try each surface. Results appear here.</td></tr></tbody></table></div></div>`;
    const $=s=>el.querySelector(s);
    const fric=()=>v>0||push>S.max?S.max:push;            // grips (matches push) until it slides
    // zoom lens under the book: the bumps on the bottom of the book and the top of the table
    const rnd=k=>{ const t=Math.sin(k*12.9898)*43758.5453; return t-Math.floor(t); };
    function mag(){ const C={x:438,y:222}, R=70, P=14, amp=S.amp*1.9, gap=S.oil?9:0, bx=X0+Math.min(x,CAM)+BW/2;
      const teeth=(base,dir,shift,seed)=>{ let d=`M${C.x-R-30} ${base}`; const k0=Math.floor(shift/P), fr=shift-k0*P;
        for(let k=-1;k<12;k++){ const xx=C.x-R-30+k*P-fr, h=amp*(.55+.45*rnd(k+k0+seed)); d+=` L${xx+P*.25} ${base} L${xx+P*.5} ${base+dir*h} L${xx+P*.75} ${base}`; } return d; };
      const by=C.y-amp*.5-gap/2, ty=C.y+amp*.5+gap/2;
      const book=teeth(by,1,P/2,7)+` L${C.x+R+30} ${by} L${C.x+R+30} ${C.y-R-5} L${C.x-R-30} ${C.y-R-5}Z`;
      const table=teeth(ty,-1,off,1)+` L${C.x+R+30} ${ty} L${C.x+R+30} ${C.y+R+5} L${C.x-R-30} ${C.y+R+5}Z`;
      const cap=S.oil?'The <b>oil</b> (yellow) fills the gaps between the bumps, so they slide past each other more easily: <b>less friction</b>.'
        :(v===0?'The bumps on the book and on the table <b>lock together</b>, so friction <b>grips</b> the book.':'The bumps <b>catch</b> on each other as they slide past. That is <b>friction</b>, acting against the movement.')
        +(S.n==='Smooth surface'?' A “smooth” surface is <b>actually rough</b>: its bumps are smaller, so there is <b>less friction, but not zero</b>.':'');
      $('#pbmag').innerHTML=`<circle cx="${bx}" cy="139" r="9" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="3 3"/>
        <path d="M${bx-6} 146 L${C.x-48} ${C.y-36} M${bx+6} 146 L${C.x+40} ${C.y-45}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 4" fill="none"/>
        <g clip-path="url(#pblens)"><rect x="${C.x-R}" y="${C.y-R}" width="${2*R}" height="${2*R}" fill="#fff"/>
          ${S.oil?`<rect x="${C.x-R}" y="${by-4}" width="${2*R}" height="${ty-by+8}" fill="#facc15" opacity=".5"/>`:''}
          <path d="${table}" fill="${S.n==='Smooth surface'?'#e6d3aa':'#d9bf86'}" stroke="#7c5c2a" stroke-width="1.6" stroke-linejoin="round"/>
          ${[0,1,2].map(k=>`<path d="M${C.x-R} ${ty+16+k*12} q30 ${k%2?4:-4} 60 0 t60 0" stroke="#b08a4a" stroke-width="1" fill="none" opacity=".6"/>`).join('')}
          <path d="${book}" fill="#c7d2fe" stroke="#3730a3" stroke-width="1.6" stroke-linejoin="round"/>
          ${[0,1,2].map(k=>`<line x1="${C.x-R}" y1="${by-14-k*10}" x2="${C.x+R}" y2="${by-14-k*10}" stroke="#a5b4fc" stroke-width="1"/>`).join('')}
          <text x="${C.x}" y="${C.y-R+18}" text-anchor="middle" font-size="12" font-weight="700" fill="#3730a3">book</text>
          <text x="${C.x}" y="${C.y+R-10}" text-anchor="middle" font-size="12" font-weight="700" fill="#7c5c2a">table</text>
</g>
        <circle cx="${C.x}" cy="${C.y}" r="${R}" fill="none" stroke="#334155" stroke-width="5"/><circle cx="${C.x}" cy="${C.y}" r="${R-3}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".7"/>
        <text x="${C.x}" y="${C.y+R+17}" text-anchor="middle" font-size="12" fill="${MUTED}">zoomed in</text>
        <foreignObject x="10" y="180" width="340" height="128"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13.5px;line-height:1.45;color:#3b3a36;padding-top:4px">${cap}</div></foreignObject>`;
      $('#pbtable').setAttribute('fill',S.n==='Smooth surface'?'#efe6d2':'url(#pbrough)'); $('#pbsheen').setAttribute('opacity',S.oil?.6:0); }
    function draw(){ const bx=X0+Math.min(x,CAM), f=fric(), p=push, r=v>0||p>S.max?p-f:0;
      const sh=Math.max(0,x-CAM)%45;
      $('#pbtick').innerHTML=Array.from({length:12},(_,i)=>`<line x1="${i*45-sh}" y1="146" x2="${i*45-sh}" y2="156" stroke="${MUTED}"/>`).join('');
      $('#pbbook').setAttribute('transform',`translate(${bx} 0)`);
      $('#pbarr').innerHTML=(p?K.arrow(bx-10-p*9,105,bx-4,105,PUSH,6,12)+`<text x="${bx-14}" y="94" text-anchor="end" font-size="16" font-weight="700" fill="${PUSH}" paint-order="stroke" stroke="#fffdf7" stroke-width="4">push ${p} N</text>`:'')+
        (f?K.arrow(bx+BW/2+f*4.5,140,bx+BW/2-f*4.5,140,FRIC,6,12)+`<text x="${bx+BW/2}" y="168" text-anchor="middle" font-size="16" font-weight="700" fill="${FRIC}">friction ${f} N</text>`:'');
      $('#pbstate').textContent=v===0?(p?'Not moving':moved?'Stopped':''):r>0?'Speeding up →':r<0?'Slowing down…':'Steady speed →';
      $('#pbp').textContent=p+' N'; $('#pbf').textContent=f+' N'+(v===0&&p>0?` (most it can grip: ${S.max} N)`:v>0?' (sliding)':''); $('#pbr').textContent=r>0?r+' N forwards':r<0?(-r)+' N backwards':'0 N';
      $('#pbv').innerHTML=v===0?(p===0?(moved?`The book has <b>stopped</b>. ${S.oil?'Oil means <b>less friction</b>, so it slides further.':S.n==='Smooth surface'?'Even a smooth surface has <b>friction</b>. It acts against the sliding, so the book slows down and stops.':'<b>Friction</b> acts against the sliding, so the book slows down and stops.'} No push, so no friction now.`:'Drag the <b>push</b> slider to push the book.')
          :`The book does <b>not</b> move, so the forces must be <b>balanced</b> (resultant force zero). Friction grips it and matches your push: <b>${p} N</b> each way. Push harder and friction grows too, up to <b>${S.max} N</b> on this surface. More than that, and the book moves.`)
        :r>0?`The book <b>moves</b>: push (${p} N) is bigger than friction (${f} N), so the resultant force is <b>${r} N forwards</b>. It speeds up.`
        :p===0?`You <b>stopped pushing</b>. Friction (${f} N) is the only force, acting backwards, so the book <b>slows down</b>.`
        :r<0?`Push (${p} N) is smaller than friction (${f} N): the resultant force is <b>backwards</b>, so the book <b>slows down</b>. While it is still sliding, friction stays at ${f} N.`
        :`Push = friction (${f} N): the <b>resultant force is zero</b>, so the book keeps moving at a <b>steady speed</b>.`; }
    function mark(i){ if(i>=0) done[i]=true; [...$('#pbst').children].forEach((li,k)=>{ li.classList.toggle('done',done[k]); li.classList.toggle('on',!done[k]&&done.slice(0,k).every(Boolean)); });
      stepBanner($('#pbban'),done,['← Push <b>gently</b>: drag the <b>push</b> slider on the left to a small force. Does the book move?','← Push <b>harder</b>: keep dragging the slider up until the book <b>moves</b>.','← <b>Let go</b>: drag the slider back to 0 N (or press <b>Let go</b>) and watch the book.'],'← Now choose another <b>surface</b> on the left and compare when the book starts to move.',[()=>el.querySelector('.kit-range'),()=>el.querySelector('.kit-range'),()=>$('#pbzero'),()=>$('#pbs')]); }
    function log(){ if(logged[S.n]) return; const tb=$('#pblog'); if(!Object.keys(logged).length) tb.innerHTML=''; logged[S.n]=1;
      tb.insertAdjacentHTML('beforeend',`<tr><td>${S.n}</td><td class="mono">${push} N</td></tr>`); }
    function tick(t){ const dt=last?Math.min(.05,(t-last)/1000):1/60; last=t;
      if(v===0&&push>S.max){ v=.001; moved=true; mark(1); log(); }
      if(v>0){ v=Math.min(VMAX,v+(push-S.max)*ACC*dt); if(v<=0){ v=0; if(push===0) mark(2); } x+=v*dt; off=x*1.6; }
      draw(); mag();
      if(v>0&&el.isConnected) raf=requestAnimationFrame(tick); else { raf=0; last=0; } }
    const go=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(tick); } };
    function update(){ if(v===0&&push>0&&push<=S.max) mark(0); draw(); mag(); go(); }
    const slider=el.querySelector('.kit-range input');
    // a new surface starts a fresh trial: push back to 0 N and the book back at the start
    K.choices($('#pbs'),SURF.map(s=>s.n),i=>{ S=SURF[i]; v=0; x=0; off=0; moved=false; cancelAnimationFrame(raf); raf=0; slider.value=0; slider.dispatchEvent(new Event('input')); },0);
    K.ranges(el,([p])=>{ push=p; update(); });
    $('#pbzero').onclick=()=>{ slider.value=0; slider.dispatchEvent(new Event('input')); };
    $('#pbback').onclick=()=>{ if(v>0) return; x=0; off=0; moved=false; update(); };
    mark(-1); draw(); mag();
  }

  /* ---------------- 1.3.1 Falling leaf (air resistance) ----------------
     Hands-on: drag the leaf down. Weight stays the same; air resistance grows with speed
     until it equals weight: resultant zero, equilibrium, steady speed. Three checkpoints ask which force is bigger. */
  function leaf(el,U){
    const N=240, TAU=1, T=4.2, VT=1; const ts=[], vs=[], ys=[];
    for(let i=0;i<=N;i++){ const t=i/N*T; ts.push(t); vs.push(VT*Math.tanh(t/TAU)); ys.push(VT*TAU*Math.log(Math.cosh(t/TAU))); }
    const YMAX=ys[N], TOP=40, H=205, LX=95, WL=64; // weight arrow length
    const yAt=i=>TOP+(.55*i/N+.45*ys[i]/YMAX)*H, airOf=i=>(vs[i]/VT)**2; // air resistance as a fraction of weight
    const CP=[{i:Math.round(.8/T*N),ans:0,txt:'starting to fall'},{i:Math.round(1.6/T*N),ans:0,txt:'falling faster'},{i:Math.round(3.6/T*N),ans:2,txt:'much later'}];
    const RES=['Weight is bigger: it speeds up','Air resistance is bigger','Equal: steady speed (equilibrium)'];
    let idx=0, lock=0, solved=0, asking=false;
    el.innerHTML=`<div class="sim"><div class="ctl">
        <div id="lfq" class="lfq"></div>
        <div id="lfcp" class="lfcp"></div>
        <div class="row" style="margin-top:8px"><button class="btn ghost small" id="lfr">Start again</button></div>
        <p class="hint" style="margin:10px 0 0;font-size:.85rem">The fall is replayed in steps: how fast you drag does not change the leaf’s speed.</p></div>
      <div><div class="readout"><span>weight <b>same all the way down</b></span><span>air resistance <b id="lfa">0%</b> of weight</span><span>resultant <b id="lfres">down</b></span></div><div class="stage"><svg viewBox="0 0 400 340" id="lfsvg" aria-label="A falling leaf with force arrows and a speed-time graph">
        <rect x="20" y="10" width="150" height="320" fill="#eef3e6"/>
        <g id="lfmarks"></g><g id="lfhint"></g><g id="lfg"></g><g id="lfleaf" class="grab" style="cursor:grab"><circle r="26" fill="transparent"/><circle id="lfring" r="24" fill="none" stroke="${PUSH}" stroke-width="2" stroke-dasharray="4 4"/><path id="lfpath" d="M0 -16 C14 -9 16 7 0 18 C-16 7 -14 -9 0 -16Z M0 -16 L0 18" fill="#d97706" stroke="#92400e" stroke-width="1.5"/></g><g id="lfgraph" transform="translate(225 40)"></g></svg></div>
      </div></div>`;
    const $=s=>el.querySelector(s);
    function marks(){ $('#lfmarks').innerHTML=CP.map((c,k)=>{ const tg=k===solved&&!asking, at=k===solved&&asking, col=tg?PUSH:at?'#d97706':MUTED;
      return `<line x1="24" y1="${yAt(c.i)}" x2="145" y2="${yAt(c.i)}" stroke="${col}" stroke-dasharray="${tg||at?'0':'5 4'}" stroke-width="${tg||at?3:1}"/><circle cx="156" cy="${yAt(c.i)}" r="11" fill="${tg?PUSH:at?'#d97706':'#fff'}" stroke="${col}"/><text x="156" y="${yAt(c.i)+5}" text-anchor="middle" font-size="14" font-weight="700" class="mono" fill="${tg||at?'#fff':INK}">${k+1}</text>`; }).join(''); }
    function graph(){ const gw=150, gh=150, sx=gw/T, sy=gh/1.15; let pts=''; for(let i=0;i<=idx;i++) pts+=`${(ts[i]*sx).toFixed(1)},${(gh-vs[i]*sy).toFixed(1)} `;
      return `<line x1="0" y1="0" x2="0" y2="${gh}" stroke="${INK}" stroke-width="1.5"/><line x1="0" y1="${gh}" x2="${gw+8}" y2="${gh}" stroke="${INK}" stroke-width="1.5"/>
        <text x="-10" y="${gh/2}" transform="rotate(-90 -10 ${gh/2})" text-anchor="middle" font-size="15" fill="${MUTED}">speed</text><text x="${gw/2}" y="${gh+20}" text-anchor="middle" font-size="15" fill="${MUTED}">time</text>
        <polyline points="${pts}" fill="none" stroke="${INK}" stroke-width="2.5"/><circle cx="${ts[idx]*sx}" cy="${gh-vs[idx]*sy}" r="5" fill="${AIR}"/>
        ${idx>CP[2].i-5?`<text x="${gw}" y="${gh-VT*sy-10}" text-anchor="end" font-size="14" fill="${OK}">steady speed</text>`:''}`; }
    function draw(){ const y=yAt(idx), air=airOf(idx), A=air*WL, eq=1-air<.02, dragging=!asking&&idx<N;
      $('#lfleaf').setAttribute('transform',`translate(${LX} ${y})`); $('#lfpath').setAttribute('transform',`rotate(${Math.sin(idx/9)*16})`); $('#lfring').style.display=dragging?'':'none';
      $('#lfg').innerHTML=
        K.arrow(LX,y+20,LX,y+20+WL,W,5,11)+`<text x="${LX-10}" y="${y+16+WL}" text-anchor="end" font-size="15" font-weight="700" fill="${W}" paint-order="stroke" stroke="#eef3e6" stroke-width="4">weight</text>`+
        (A>3?K.arrow(LX,y-20,LX,y-20-A,AIR,5,11)+`<text x="${LX+10}" y="${y-14-A}" font-size="15" font-weight="700" fill="${AIR}" paint-order="stroke" stroke="#eef3e6" stroke-width="4">air resistance</text>`:'');
      // on the diagram: a "drag me" cue beside the leaf while it should be dragged
      $('#lfhint').innerHTML=asking?(bt=>`<g><rect x="22" y="${bt}" width="146" height="42" rx="6" fill="#fff7ed" stroke="#d97706" stroke-width="2"/><text x="95" y="${bt+17}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b45309">← Answer the question</text><text x="95" y="${bt+34}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b45309">on the left to go on</text></g>`)(y+124>314?y-126:y+82):dragging?`<g class="tgt"><text x="${LX-32}" y="${y+2}" text-anchor="end" font-size="14" font-weight="700" fill="${PUSH}" paint-order="stroke" stroke="#eef3e6" stroke-width="4">drag</text>${K.arrow(LX-46,y+8,LX-46,y+38,PUSH,3,8)}</g>`:'';
      $('#lfgraph').innerHTML=graph(); marks();
      $('#lfa').textContent=Math.round(air*100)+'%'; $('#lfres').textContent=eq?'zero (balanced)':'down'; }
    let pulse=null;
    function step(){ // left panel: one short instruction at a time
      const q=$('#lfq'); if(pulse){ pulse.cancel(); pulse=null; } q.style.borderColor=asking?'#d97706':''; q.style.borderWidth=asking?'2px':'';
      if(asking) pulse=q.animate([{boxShadow:'0 0 0 0 rgba(217,119,6,.55)'},{boxShadow:'0 0 0 10px rgba(217,119,6,0)'}],{duration:1200,iterations:Infinity});
      if(asking){ const c=CP[solved];
        $('#lfq').innerHTML=`<div class="lbl mono" style="font-size:.8rem;color:#b45309">LINE ${solved+1} · ${c.txt.toUpperCase()} · ANSWER TO GO ON</div><p style="margin:4px 0 6px;font-size:1.05rem"><b>Which force is bigger here?</b></p><div class="ch" id="lfopts"></div>`;
        const box=$('#lfopts'); ['Weight','Air resistance','They are equal'].forEach((t,k)=>{ const b=U.h('button',{type:'button'},t); b.onclick=()=>{ if(k===c.ans){ solved++; asking=false; lock=CP[solved]?CP[solved].i:0; cp(); if(solved===3) U.toast('All three right'); step(); draw(); } else { b.classList.add('shake'); setTimeout(()=>b.classList.remove('shake'),400); b.textContent=t+' ✗'; } }; box.appendChild(b); });
      } else if(solved<3){
        $('#lfq').innerHTML=`${solved?'<p class="ok" style="margin:0 0 4px">Right.</p>':''}<p style="margin:0;font-size:1.05rem"><b>Step ${solved+1} of 3:</b> ${solved?'now ':''}press and hold the <b>leaf</b>, then drag it down to the <b style="color:${PUSH}">blue line ${solved+1}</b>.</p>`;
      } else $('#lfq').innerHTML=`<p class="ok" style="margin:0">Air resistance = weight. The resultant force is <b>zero</b>, so the leaf is in <b>equilibrium</b> and falls at a <b>steady speed</b> in the same direction.</p>`;
    }
    K.svgDrag($('#lfleaf'),$('#lfsvg'),{start(){ if(asking) $('#lfq').animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:300}); },move(px,py){ if(asking) return; let i=0; while(i<N&&yAt(i+1)<=py) i++; const cap=lock?lock:N; idx=Math.max(idx,Math.min(i,cap)); if(lock&&idx>=lock&&solved<3){ asking=true; step(); } draw(); }});
    function cp(){ $('#lfcp').innerHTML=CP.map((c,k)=>`<div class="lfrow ${k<solved?'done':''}"><span class="mono">${k+1}</span><span>${k<solved?RES[c.ans]:'?'}</span></div>`).join(''); }
    $('#lfr').onclick=()=>{ idx=0; solved=0; asking=false; lock=CP[0].i; cp(); step(); draw(); };
    $('#lfr').onclick();
  }

  /* ---------------- 1.3.2 Spring lab (Hooke's Law) ----------------
     Drop zone is the whole (static) spring picture, so every drop lands. Fixed scale with a ruler. */
  function springLab(el,U){
    const L0=5, PER=2, LIMIT=7, MAXW=9, PX=8, TOP=24; let n=0, perm=0, peak=0; const pts=[[0,0]], unl=[];
    el.innerHTML=`<div class="sim"><div class="ctl">
        <h4 style="margin-top:0">Weights</h4><p class="hint" style="margin:0 0 6px">Drag one onto the spring. Tap the spring’s weights to take one off.</p>
        <div class="pool" id="spw"></div>
        <ol class="steps-list" id="spst" hidden><li>Add weights one at a time, up to 7 N.</li><li>Add an 8th and a 9th weight.</li><li>Take all the weights off.</li></ol>
        <div class="row" style="margin-top:8px"><button class="btn ghost small" id="spoff">Take all the weights off</button><button class="btn ghost small" id="spnew">Use a fresh spring</button></div></div>
      <div><div id="spban" ${BAN}></div><div class="stage hook" id="spstage" style="position:relative"><svg viewBox="0 0 500 380" id="spsvg" aria-label="A spring with weights, a ruler and a force–extension graph">
        <rect x="6" y="364" width="190" height="10" rx="2" fill="#57534e"/><rect x="14" y="8" width="7" height="358" fill="#78716c"/><rect x="14" y="10" width="146" height="7" rx="2" fill="#78716c"/><rect x="10" y="6" width="15" height="15" rx="2" fill="#44403c"/>
        <path d="M125 17 l0 7" stroke="${INK}" stroke-width="2.5"/><g id="spruler"></g><g id="sporig"></g><g id="spring"></g><g id="spdrop"></g>
        <g transform="translate(250 30)" id="spgraph"></g></svg></div>
      <div class="readout"><span>force <b id="spf">0 N</b></span><span>length <b id="spl">5 cm</b></span><span>extension <b id="spe">0 cm</b></span></div>
      <p class="hint" style="margin:4px 0 0"><b>Estimated values:</b> this demo spring is <b>set</b> to stretch 2 cm per newton and to reach its elastic limit at <b>7 N</b>. Other springs are different.</p>
      <div class="verdict" id="spv"></div></div></div>`;
    const $=s=>el.querySelector(s);
    const ext=f=>f<=LIMIT?f*PER:LIMIT*PER+(f-LIMIT)*PER*2.2; // past the elastic limit it stretches much more
    // after going past the limit, taking weights off follows a straight line back that does not reach zero (permanent stretch)
    const cur=()=>n>=peak?ext(n):n*PER+perm;
    // wooden ruler beside the spring (0-30 cm), numbers inside the ruler so nothing overlaps
    let r=`<rect x="30" y="${TOP-8}" width="34" height="${30*PX+16}" rx="2" fill="#f3e2b3" stroke="#a16207" stroke-width="1.2"/>`;
    for(let c=0;c<=30;c++){ const y=TOP+c*PX; r+=`<line x1="${c%5?56:50}" y1="${y}" x2="64" y2="${y}" stroke="#7c5a12" stroke-width="${c%5?.8:1.3}"/>`+(c%5?'':`<text x="34" y="${y+4.5}" font-size="12" class="mono" fill="#5b420c">${c}</text>`); }
    $('#spruler').innerHTML=r+`<text x="47" y="${TOP+30*PX+24}" text-anchor="middle" font-size="13" fill="${MUTED}">cm</text>`;
    for(let i=0;i<MAXW;i++) $('#spw').appendChild(U.h('div',{class:'chip dragme'},'1 N'));
    const chips=[...el.querySelectorAll('#spw .chip')];
    function step(){ const s=n===0&&pts.length>2&&perm?2:n>LIMIT?2:n===LIMIT?1:0; const done=[n>=LIMIT||perm>0,n>LIMIT||perm>0,perm>0&&n===0];
      [...$('#spst').children].forEach((li,i)=>{ li.classList.toggle('done',done[i]); li.classList.toggle('on',!done[i]&&done.slice(0,i).every(Boolean)); });
      stepBanner($('#spban'),done,['← Drag the <b>1 N weights</b> from the <b>left</b> onto the spring, one at a time, up to <b>7 N</b>. Watch the graph.','✓ 7 N done. ← Now take <b>more weights from the left</b>: add an <b>8th</b> and a <b>9th</b>. Is the graph still a straight line?','Take <b>all the weights off</b> (tap the weights, or press the button). Does the spring go back?'],'The spring went past its <b>elastic limit</b>: it is stretched for good. Press <b>Use a fresh spring</b> to try again.',[()=>$('#spw'),()=>$('#spw'),null]); }
    function draw(){
      const e=cur(), len=L0+e, bot=TOP+len*PX, CX=125, R=13, coils=7, top=TOP+4, h=len*PX-14, pitch=h/coils;
      // a coiled spring drawn as a helix: lighter back half, darker front half of each turn
      let back='', front='';
      for(let k=0;k<coils;k++){ const y0=top+k*pitch;
        back+=`M${CX+R} ${y0} C${CX+R*.4} ${y0-3} ${CX-R*.4} ${y0+pitch*.5-3} ${CX-R} ${y0+pitch*.5} `;
        front+=`M${CX-R} ${y0+pitch*.5} C${CX-R*.4} ${y0+pitch*.5+4} ${CX+R*.4} ${y0+pitch+4} ${CX+R} ${y0+pitch} `; }
      const wt=i=>i>=LIMIT?'#c2410c':'#64748b';
      const stack=Array.from({length:n},(_,i)=>{ const y=bot+14+i*11; return `<rect x="${CX-24}" y="${y}" width="48" height="10" rx="2" fill="${wt(i)}" stroke="${INK}" stroke-width="1"/><rect x="${CX-21}" y="${y+1.5}" width="42" height="2" rx="1" fill="#fff" opacity=".35"/>`; }).join('');
      $('#spring').innerHTML=`<path d="M${CX} ${TOP} L${CX} ${top} L${CX+R} ${top}" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <path d="${back}" fill="none" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/><path d="${front}" fill="none" stroke="#374151" stroke-width="3" stroke-linecap="round"/>
        <path d="M${CX+R} ${top+h} L${CX} ${top+h} L${CX} ${bot+4}" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <path d="M${CX} ${bot+2} l0 10 M${CX-6} ${bot+12} l12 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
        <g id="spstack" style="cursor:${n?'pointer':'default'}">${stack}</g>${n?`<text x="${CX+32}" y="${bot+14+n*5.5+5}" font-size="15" font-weight="700" class="mono" fill="${INK}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">${n} N</text>`:''}
        <line x1="64" y1="${bot}" x2="${CX-4}" y2="${bot}" stroke="${PUSH}" stroke-width="1.5"/>${e>0.05?K.arrow(86,TOP+L0*PX+2,86,bot-2,PUSH,2.5,8)+`<text x="90" y="${(TOP+L0*PX+bot)/2+4}" font-size="13" font-weight="700" fill="${PUSH}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">ext.</text>`:''}`;
      // original length: a short green mark on the ruler with its label to the right of the spring (clear space)
      const oy=TOP+L0*PX;
      $('#sporig').innerHTML=`<line x1="64" y1="${oy}" x2="${CX+R+40}" y2="${oy}" stroke="${OK}" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${CX+R+44}" y="${oy+4}" font-size="13" font-weight="700" fill="${OK}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">original</text><text x="${CX+R+44}" y="${oy+19}" font-size="13" font-weight="700" fill="${OK}" paint-order="stroke" stroke="#fffdf8" stroke-width="4">length</text>`;
      $('#spdrop').innerHTML=n<MAXW?`<text x="128" y="356" text-anchor="middle" font-size="13" font-weight="700" fill="#059669" paint-order="stroke" stroke="#fffdf8" stroke-width="4">drop weights here ↑</text>`:'';
      const g=$('#spgraph'), sx=24, maxE=24, sy=240/maxE; let gr=`<line x1="0" y1="0" x2="0" y2="250" stroke="${INK}"/><line x1="0" y1="250" x2="230" y2="250" stroke="${INK}"/>
        <text x="115" y="290" text-anchor="middle" font-size="15" fill="${MUTED}">force (N)</text><text x="-30" y="125" transform="rotate(-90 -30 125)" text-anchor="middle" font-size="15" fill="${MUTED}">extension (cm)</text>`;
      for(let f=0;f<=9;f++) gr+=`<text x="${f*sx}" y="268" text-anchor="middle" font-size="13" class="mono">${f}</text>`;
      for(let c=4;c<=maxE;c+=4) gr+=`<text x="-6" y="${250-c*sy+4}" text-anchor="end" font-size="13" class="mono">${c}</text>`;
      gr+=`<line x1="0" y1="250" x2="${LIMIT*sx}" y2="${250-LIMIT*PER*sy}" stroke="${LINE}" stroke-dasharray="4 4"/>`;
      gr+=pts.map(([f,v])=>`<g transform="translate(${f*sx} ${250-Math.min(v,maxE)*sy})"><path d="M-5 -5L5 5M-5 5L5 -5" stroke="${f>LIMIT?W:INK}" stroke-width="2.2"/></g>`).join('');
      gr+=unl.map(([f,v])=>`<circle cx="${f*sx}" cy="${250-Math.min(v,maxE)*sy}" r="4.5" fill="#fff" stroke="${W}" stroke-width="2"/>`).join('')+(unl.length?`<text x="230" y="-8" text-anchor="end" font-size="13" fill="${W}">○ weights taken off</text>`:'');
      if(n>0||perm){ const cx=n*sx, cy=250-Math.min(e,maxE)*sy;
        gr+=`<line x1="0" y1="${cy}" x2="${cx}" y2="${cy}" stroke="${PUSH}" stroke-dasharray="4 3" stroke-width="1.5"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="250" stroke="${PUSH}" stroke-dasharray="4 3" stroke-width="1.5"/>
          <circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${PUSH}" stroke-width="2.5"/>
          <text x="${n>4?cx-12:cx+14}" y="${n>4?cy-12:cy+(n?-12:22)}" text-anchor="${n>4?'end':'start'}" font-size="13" font-weight="700" fill="${PUSH}" paint-order="stroke" stroke="#fffdf8" stroke-width="4" class="mono">${n} N → ${e.toFixed(0)} cm</text>`; }
      g.innerHTML=gr;
      $('#spf').textContent=n+' N'; $('#spl').textContent=len.toFixed(0)+' cm'; $('#spe').textContent=e.toFixed(0)+' cm';
      $('#spv').innerHTML=n===0?(perm?`<span class="no">The spring did <b>not</b> go back to its original length.</span> It went past its <b>elastic limit</b>.`:'No force, no extension.')
        :n>LIMIT&&n>=peak?`<span class="no">Past the <b>elastic limit</b>.</span> The extension jumps and the point is off the straight line.`
        :perm?`Extension = <b>${e.toFixed(0)} cm</b>. It went past its <b>elastic limit</b>, so it is stretched for good: it will <b>not</b> go back to its original length.`
        :n%2===0?`<b>${n} N</b> gives <b>${e.toFixed(0)} cm</b>. That is double the extension for ${n/2} N: double the force, double the extension (Hooke’s Law, up to the <b>elastic limit</b>).`
        :`<b>${n} N</b> gives an extension of <b>${e.toFixed(0)} cm</b>.`;
      chips.forEach((c,i)=>{ const used=i<n; c.classList.toggle('ok',used); c.style.display=used?'none':''; });
      $('#spstack').onclick=()=>{ if(n>0) take(); };
      step();
    }
    function setPeak(){ if(n>peak){ peak=n; perm=peak>LIMIT?ext(peak)-peak*PER:0; } }
    // a blue dot flies from the spring's extension arrow to the new point on the graph, so you can see where it comes from
    function fly(){ const e=cur(), sy=240/24, x0=86, y0=TOP+(L0+e)*PX, x1=250+n*24, y1=30+250-Math.min(e,24)*sy, st=performance.now(), svg=$('#spsvg');
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('r','7'); c.setAttribute('fill',PUSH); svg.appendChild(c);
      const run=t=>{ const k=Math.min(1,(t-st)/650), q=1-(1-k)**3; c.setAttribute('cx',x0+(x1-x0)*q); c.setAttribute('cy',y0+(y1-y0)*q-Math.sin(q*Math.PI)*40); if(k<1&&el.isConnected) requestAnimationFrame(run); else c.remove(); }; requestAnimationFrame(run); }
    function add(){ if(n>=MAXW) return false; n++; const fresh=n>peak; setPeak(); const v=cur(); setTimeout(fly,0);
      if(fresh||!perm){ const k=pts.findIndex(p=>p[0]===n); if(k>=0) pts[k]=[n,v]; else pts.push([n,v]); } else unl.push([n,v]); draw(); return true; }
    function take(){ n--; if(perm){ const k=unl.findIndex(p=>p[0]===n); if(k<0) unl.push([n,cur()]); } draw(); }
    chips.forEach(c=>Engine.drag(c,{targets:'#spstage',onDrop:()=>add()}));
    K.cue(()=>chips.find(c=>c.style.display!=='none'),{watch:$('#spstage'),host:el,ring:true,to:$('#spdrop')});
    $('#spoff').onclick=()=>{ for(let m=n-1;m>=0&&perm;m--){ if(unl.findIndex(p=>p[0]===m)<0) unl.push([m,m*PER+perm]); } n=0; draw(); };
    $('#spnew').onclick=()=>{ perm=0; peak=0; n=0; pts.length=0; pts.push([0,0]); unl.length=0; draw(); };
    draw();
  }

  /* ---------------- 1.3.3 See-saw (law of moments) ----------------
     Loads are weight arrows you slide along the beam. Each side's turning effect is drawn as a curved
     moment arrow (thickness = size) and summed in a moment balance: anticlockwise vs clockwise. */
  const TASKS=[
    {name:'Textbook example',t:'A <b>500 N</b> girl sits <b>1 m</b> left of the pivot. Slide the <b>1000 N</b> man until the see-saw balances.',L:{w:500,d:1,fixed:true,who:'girl'},R:{w:1000,d:.25,who:'man'},ans:.5},
    {name:'Mother and child',t:'2 m see-saw: the <b>150 N</b> child sits at the end, <b>1 m</b> from the pivot. Slide the <b>600 N</b> mother until it balances.',L:{w:600,d:.75,who:'mother'},R:{w:150,d:1,fixed:true,who:'child'},ans:.25},
    {name:'Explore',t:'Pick any two weights and slide both. When does it balance?',L:{w:500,d:.5},R:{w:500,d:.75},free:true}
  ];
  function seesaw(el,U){
    const PX=250, CX=320, PY=170, STEP=.125; let T, L, R, ang=0, raf=0, solved=false;
    el.innerHTML=`<div class="ch" id="ssx" style="margin-bottom:8px"></div><p id="sst" style="margin:.2em 0 .5em"></p>
      <div id="ssfree" class="row" style="display:none;gap:14px;margin-bottom:6px"><span class="hint">Left load</span><span class="ch" id="ssfl"></span><span class="hint">Right load</span><span class="ch" id="ssfr"></span></div>
      <div class="stage"><svg viewBox="0 0 640 300" id="sssvg" aria-label="See-saw with two loads and their moments">
        <line x1="40" y1="250" x2="600" y2="250" stroke="${INK}"/><path d="M${CX} ${PY+6} L${CX-24} 250 L${CX+24} 250Z" fill="#e9e1cf" stroke="${INK}" stroke-width="2"/>
        <text x="${CX}" y="272" text-anchor="middle" font-size="15" fill="${MUTED}">pivot</text>
        <g id="ssmom"></g><g id="ssbeam"><g id="ssbar"></g><g id="ssL" class="grab"></g><g id="ssR" class="grab"></g></g></svg></div>
      <div class="mbal" id="ssbal"></div>
      <p class="hint" style="margin:.4em 0 0"><b>Slide</b> the blue arrow along the beam.</p>
      <div class="verdict" id="ssv" style="margin-top:8px"></div>`;
    const $=s=>el.querySelector(s);
    let bar=`<rect x="${CX-PX}" y="${PY-6}" width="${PX*2}" height="12" fill="#d6b98a" stroke="${INK}" stroke-width="2"/>`;
    for(let d=-1;d<=1.001;d+=.25){ const x=CX+d*PX; bar+=`<line x1="${x}" y1="${PY+6}" x2="${x}" y2="${PY+14}" stroke="${INK}"/>`+(Math.abs(d)>.01?`<text x="${x}" y="${PY+30}" text-anchor="middle" font-size="14" class="mono" fill="${MUTED}">${Math.abs(d)} m</text>`:''); }
    $('#ssbar').innerHTML=bar;
    const mom=s=>s.w*s.d;
    function load(g,s,side){ const x=CX+side*s.d*PX, len=30+Math.sqrt(s.w)*2.4, col=s.fixed?MUTED:PUSH;
      g.innerHTML=`<rect x="${x-28}" y="${PY-len-46}" width="56" height="${len+46}" fill="transparent"/>`+
        `<text x="${x}" y="${PY-len-26}" text-anchor="middle" font-size="16" font-weight="700" class="mono" fill="${INK}">${s.w} N</text>`+
        (s.who?`<text x="${x}" y="${PY-len-8}" text-anchor="middle" font-size="14" fill="${MUTED}">${s.who}</text>`:'')+
        K.arrow(x,PY-len,x,PY-8,col,s.fixed?4:6,12)+(s.fixed?'':`<circle cx="${x}" cy="${PY-len}" r="7" fill="#fff" stroke="${col}" stroke-width="2.5"/>`);
      g.style.cursor=s.fixed?'default':'grab'; }
    function arc(side,m,col){ if(!m) return ''; const w=Math.min(9,2+m/90), r=20, cx=CX+side*200, cy=PY+72;
      // anticlockwise on the left (side -1), clockwise on the right (side 1): arrow heads show the turn direction
      const a1=side<0?200:-20, a2=side<0?110:70, p=a=>[cx+r*Math.cos(a*Math.PI/180), cy-r*Math.sin(a*Math.PI/180)];
      const [x1,y1]=p(a1), [x2,y2]=p(a2); const sweep=side<0?1:0;
      return `<path d="M${x1} ${y1} A${r} ${r} 0 0 ${sweep} ${x2} ${y2}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" opacity=".85"/>`+
        `<path d="M${x2} ${y2} l${side<0?10:-10} ${-8} M${x2} ${y2} l${side<0?10:-10} ${8}" stroke="${col}" stroke-width="${Math.max(3,w*.6)}" stroke-linecap="round" transform="rotate(${side<0?-20:20} ${x2} ${y2})"/>`+
        `<text x="${CX+side*170}" y="${PY+78}" text-anchor="${side<0?'start':'end'}" font-size="15" font-weight="700" fill="${col}">${side<0?'anticlockwise':'clockwise'} ${m} Nm</text>`; }
    const AC='#7c3aed', CW='#0369a1';
    function draw(){ const ma=mom(L), mc=mom(R), diff=mc-ma;
      load($('#ssL'),L,-1); load($('#ssR'),R,1);
      $('#ssmom').innerHTML=arc(-1,ma,AC)+arc(1,mc,CW);
      const max=Math.max(ma,mc,1), bw=v=>Math.round(v/max*100);
      $('#ssbal').innerHTML=`<div class="mrow"><span class="ml" style="color:${AC}">Anticlockwise</span><span class="mbar"><i style="width:${bw(ma)}%;background:${AC}"></i></span><span class="mono mv">${L.w} N × ${L.d} m = <b>${ma} Nm</b></span></div>
        <div class="mrow"><span class="ml" style="color:${CW}">Clockwise</span><span class="mbar"><i style="width:${bw(mc)}%;background:${CW}"></i></span><span class="mono mv">${R.w} N × ${R.d} m = <b>${mc} Nm</b></span></div>`;
      const bal=diff===0;
      $('#ssv').innerHTML=bal?`<span class="ok"><b>Balanced.</b> Clockwise moment = anticlockwise moment (${mc} Nm). This is the law of moments: the see-saw is in equilibrium.</span>${T.ans!==undefined?`<br>Check: ${R.fixed?L.w:R.w} N × d = ${R.fixed?mc:ma} Nm, so d = ${R.fixed?mc:ma} ÷ ${R.fixed?L.w:R.w} = <b>${T.ans} m</b>.`:''}`
        :`The <b>${diff>0?'clockwise':'anticlockwise'}</b> moment is bigger, so the see-saw turns <b>${diff>0?'clockwise':'anticlockwise'}</b>.`;
      if(bal&&!solved&&!T.free){ solved=true; U.toast('Balanced'); }
      const target=Math.max(-11,Math.min(11,diff/25)); cancelAnimationFrame(raf);
      const anim=()=>{ ang+=(target-ang)*.2; $('#ssbeam').setAttribute('transform',`rotate(${ang.toFixed(2)} ${CX} ${PY})`); if(Math.abs(target-ang)>.05) raf=requestAnimationFrame(anim); }; anim(); }
    const bind=(id,side)=>K.svgDrag($('#'+id),$('#sssvg'),{move(x){ const s=side<0?L:R; if(s.fixed) return; let d=Math.round((side*(x-CX)/PX)/STEP)*STEP; d=Math.max(STEP,Math.min(1,d)); if(d!==s.d){ s.d=d; draw(); } }});
    bind('ssL',-1); bind('ssR',1);
    K.cue(()=>L&&$(L.fixed?'#ssR circle':'#ssL circle'),{watch:$('#sssvg'),host:el,to:()=>({dx:L.fixed?60:-60,dy:0})});
    const WS=[150,500,600,1000];
    function setup(i){ T=TASKS[i]; L=Object.assign({},T.L); R=Object.assign({},T.R); solved=false; $('#sst').innerHTML=T.t;
      $('#ssfree').style.display=T.free?'flex':'none';
      if(T.free){ K.choices($('#ssfl'),WS.map(w=>w+' N'),k=>{ L.w=WS[k]; draw(); },1); K.choices($('#ssfr'),WS.map(w=>w+' N'),k=>{ R.w=WS[k]; draw(); },1); }
      draw(); }
    K.choices($('#ssx'),TASKS.map(t=>t.name),setup,0);
  }

  /* ---------------- 1.3.3 Open the door (moment = force × distance) ----------------
     Textbook example: 5 N at 0.75 m from the hinge gives 3.75 Nm. This demo is set so the door swings open at 3.75 Nm (a made-up setting).
     A real door, seen from the front, drawn in perspective. Drag the blue push point along the door; set the force. */
  function door(el,U){
    const HX=200, TOP=40, BOT=340, DW=170, HC=190, FOC=520, NEED=3.75, HY=196; let F=2, d=.75, ang=0, raf=0;
    el.innerHTML=`<p class="hint" style="margin:0 0 6px"><b>1</b> Slide the force. <b>2</b> Drag the blue push point.</p>
      <div style="max-width:360px">${K.range('Force',1,20,1,2,'# N')}</div>
      <div class="stage" style="margin-top:6px"><svg viewBox="0 0 560 380" id="dsvg" style="max-width:600px;display:block;margin:auto" aria-label="A door, seen from the front">
        <rect x="0" y="0" width="560" height="380" fill="#efe8da"/><rect x="0" y="${BOT}" width="560" height="40" fill="#d9ccb4"/>
        <rect x="${HX-14}" y="${TOP-14}" width="${DW+28}" height="${BOT-TOP+14}" fill="#f8f4ea" stroke="${INK}" stroke-width="2"/>
        <rect x="${HX}" y="${TOP}" width="${DW}" height="${BOT-TOP}" fill="#dfe7f1"/><path d="M${HX} ${BOT} L${HX+DW} ${BOT} L${HX+DW+40} ${BOT+40} L${HX-10} ${BOT+40}Z" fill="#c9bb9f" opacity=".0"/>
        <g id="dleaf"></g><g id="dhand" style="cursor:grab"></g><g id="dcalc"></g>
        <line x1="${HX}" y1="${TOP-24}" x2="${HX}" y2="${BOT}" stroke="${INK}" stroke-dasharray="5 4" stroke-width="1.5"/>
        <text x="${HX-22}" y="${TOP+70}" text-anchor="end" font-size="15" font-weight="700" fill="${INK}">hinge</text><text x="${HX-22}" y="${TOP+88}" text-anchor="end" font-size="15" font-weight="700" fill="${INK}">= pivot</text>
        <path d="M${HX-20} ${TOP+76} L${HX-4} ${TOP+76}" stroke="${INK}"/></svg></div>
      <div class="row" style="align-items:center;gap:10px;margin-top:6px"><span class="hint" style="width:70px">moment</span><span class="mbar" style="flex:1;max-width:360px;position:relative"><i id="dbar"></i><b style="position:absolute;left:${NEED/8*100}%;top:-4px;bottom:-4px;width:2px;background:${INK}"></b></span><span class="hint">this door is set to open at ${NEED} Nm</span></div>
      <div class="verdict" id="dv" style="margin-top:8px"></div>`;
    const $=s=>el.querySelector(s);
    // perspective: u = distance from the hinge in px, y = height; the door turns away from you about the hinge
    const P=(u,y)=>{ const r=ang*Math.PI/180, s=FOC/(FOC+u*Math.sin(r)); return [HX+u*Math.cos(r)*s, HC+(y-HC)*s]; };
    const poly=pts=>pts.map(([u,y])=>P(u,y).map(n=>n.toFixed(1)).join(' ')).join(' L');
    function draw(){ const M=+(F*d).toFixed(2), u=d*DW, shade=Math.round(200-ang*.9);
      const [ex]=P(DW,HC), edge=ang>2?`<path d="M${poly([[DW,TOP],[DW,BOT]])}" stroke="${INK}" stroke-width="2"/>`:'';
      const [qx,qy]=P(u,HY), [bx,by]=P(u,HY+26);
      $('#dleaf').innerHTML=`<path d="M${poly([[0,TOP],[DW,TOP],[DW,BOT],[0,BOT]])}Z" fill="rgb(${shade+15},${shade-20},${shade-75})" stroke="${INK}" stroke-width="2.5"/>
        <path d="M${poly([[18,TOP+18],[DW-18,TOP+18],[DW-18,TOP+130],[18,TOP+130]])}Z" fill="none" stroke="#8a6a3a" stroke-width="2"/>
        <path d="M${poly([[18,TOP+170],[DW-18,TOP+170],[DW-18,BOT-18],[18,BOT-18]])}Z" fill="none" stroke="#8a6a3a" stroke-width="2"/>
        <path d="M${poly([[0,TOP+40],[8,TOP+40],[8,TOP+70],[0,TOP+70]])}Z" fill="#9ca3af" stroke="${INK}"/><path d="M${poly([[0,BOT-70],[8,BOT-70],[8,BOT-40],[0,BOT-40]])}Z" fill="#9ca3af" stroke="${INK}"/>
        <path d="M${poly([[DW-26,HY-4],[DW-10,HY-4],[DW-10,HY+4],[DW-26,HY+4]])}Z" fill="#facc15" stroke="${INK}" stroke-width="1.5"/>
        <path d="M${poly([[0,BOT-8],[u,BOT-8]])}" stroke="${PUSH}" stroke-width="2.5"/><path d="M${poly([[u,HY],[u,BOT-8]])}" stroke="${PUSH}" stroke-dasharray="4 4" stroke-width="1.5"/>${edge}
        <text x="${HX+8}" y="${BOT+26}" font-size="16" font-weight="700" class="mono" fill="${INK}">d = ${d.toFixed(2)} m</text>`;
      // push arrow: a normal force arrow, same thickness, its length grows with the force (about 5 px per newton)
      const len=24+F*5, tx=qx+len*.6, ty=qy+len*.8;
      $('#dhand').innerHTML=`<rect x="${qx-26}" y="${qy-26}" width="${len+60}" height="${len+60}" fill="transparent"/>
        ${K.arrow(tx,ty,qx+5,qy+7,PUSH,5,12)}
        <circle cx="${qx}" cy="${qy}" r="10" fill="#fff" stroke="${PUSH}" stroke-width="3.5"/><circle cx="${qx}" cy="${qy}" r="3.5" fill="${PUSH}"/>
        <text x="${tx+8}" y="${ty+14}" font-size="17" font-weight="700" fill="${PUSH}" paint-order="stroke" stroke="#fffdf7" stroke-width="4">push ${F} N</text>`;
      $('#dcalc').innerHTML=`<text x="398" y="70" font-size="16" class="mono" fill="${INK}">moment = F × d</text><text x="398" y="96" font-size="16" class="mono" fill="${INK}">= ${F} N × ${d.toFixed(2)} m</text><text x="398" y="124" font-size="19" font-weight="700" class="mono" fill="${M>=NEED?OK:'#b45309'}">= ${M} Nm</text><text x="398" y="148" font-size="13" fill="${MUTED}">${M>=NEED?'enough: the door opens':'not enough to open it'}</text>`;
      $('#dbar').style.width=Math.min(100,M/8*100)+'%'; $('#dbar').style.background=M>=NEED?'#16a34a':'#f59e0b';
      $('#dv').innerHTML=M>=NEED?`<b>The door swings open.</b> ${M} Nm is enough for this door.`:`<b>Not enough.</b> The door only creaks. Push <b>harder</b>, or push <b>further from the hinge</b>. At ${d.toFixed(2)} m you need ${(NEED/d).toFixed(1)} N.`; }
    function anim(){ const M=F*d, target=M>=NEED?55:M/NEED*6; ang+=(target-ang)*.1; if(Math.abs(target-ang)<.1) ang=target; draw(); if(ang!==target&&el.isConnected) raf=requestAnimationFrame(anim); else raf=0; }
    const go=()=>{ if(!raf) raf=requestAnimationFrame(anim); };
    K.svgDrag($('#dhand'),$('#dsvg'),{move(x){ const r=ang*Math.PI/180, dx=x-HX, den=Math.cos(r)*FOC-dx*Math.sin(r);
      const u=den>1?dx*FOC/den:DW; d=Math.max(.1,Math.min(1,Math.round(u/DW/.05)*.05)); go(); draw(); }});
    K.ranges(el,([f])=>{ F=f; go(); });
    // start cue: the Force slider first; once it has been used, show the push point
    const fr=el.querySelector('.kit-range input'); K.cue(fr,{host:el});
    fr.addEventListener('change',()=>K.cue(()=>$('#dhand circle'),{watch:$('#dsvg'),host:el,to:{dx:-70,dy:0}}),{once:true});
    draw();
  }

  /* ---------------- 1.3.3 Tipping a chair (centre of gravity) ----------------
     Drag the chair back. Let go: in front of the pivot it drops back onto four legs; past the pivot it topples. */
  function chair(el,U){
    const P={x:150,y:250}, CG={x:192,y:132}, BAL=Math.atan2(CG.x-P.x,P.y-CG.y)*180/Math.PI; let a=0, raf=0, fallen=false;
    el.innerHTML=`<p class="hint" style="margin:0 0 6px"><b>Tip</b> the chair back, then let go.</p>
      <div class="stage"><svg viewBox="0 0 420 290" id="chsvg" style="max-width:560px;display:block;margin:auto" aria-label="A chair tipping back">
        <line x1="10" y1="${P.y}" x2="410" y2="${P.y}" stroke="${INK}" stroke-width="2"/><g id="chg" class="grab" style="cursor:grab"></g><g id="chcg"></g>
        <circle cx="${P.x}" cy="${P.y}" r="6" fill="${INK}"/><text x="${P.x}" y="${P.y+26}" text-anchor="middle" font-size="15" font-weight="700" fill="${INK}">pivot (back legs)</text></svg></div>
      <div class="verdict" id="chv"></div><div class="row" style="margin-top:8px"><button class="btn ghost small" id="chr">Sit up again</button></div>`;
    const $=s=>el.querySelector(s);
    function draw(){ const r=-a*Math.PI/180, dx=CG.x-P.x, dy=CG.y-P.y, gx=P.x+dx*Math.cos(r)-dy*Math.sin(r), gy=P.y+dx*Math.sin(r)+dy*Math.cos(r);
      $('#chg').innerHTML=`<g transform="rotate(${-a} ${P.x} ${P.y})"><rect x="130" y="40" width="130" height="215" fill="transparent"/>
        <path d="M150 250 L150 160 L144 80 M150 160 L245 160 L245 250" stroke="#b45309" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="170" cy="72" r="15" fill="#f1e5d1" stroke="${INK}" stroke-width="2"/>
        <path d="M168 88 L180 152 L252 148 L268 215 M174 110 L220 122" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      const side=gx<P.x-2?'behind':gx>P.x+2?'front':'over', col=side==='behind'?W:side==='over'?'#ca8a04':'#16a34a';
      $('#chcg').innerHTML=`<line x1="${gx}" y1="${gy}" x2="${gx}" y2="${P.y}" stroke="${col}" stroke-dasharray="4 3" stroke-width="1.5"/>${K.arrow(gx,gy,gx,gy+55,W,4,10)}
        <circle cx="${gx}" cy="${gy}" r="8" fill="#facc15" stroke="${INK}" stroke-width="1.5"/><text x="${gx+14}" y="${gy-8}" font-size="15" font-weight="700" fill="${INK}" paint-order="stroke" stroke="#fffdf7" stroke-width="4" stroke-linejoin="round">centre of gravity</text><text x="${gx+8}" y="${gy+52}" font-size="14" fill="${W}" paint-order="stroke" stroke="#fffdf7" stroke-width="4" stroke-linejoin="round">weight</text>`;
      $('#chv').innerHTML=fallen?'<b>You toppled over!</b> The centre of gravity went <b>behind the pivot</b>, so your weight made a turning force <b>backwards</b> (picture C).'
        :a<1?'Sitting normally on four legs.':side==='front'?'The centre of gravity is <b>in front of the pivot</b>: your weight turns the chair <b>back down</b> (picture A).'
        :side==='over'?'<b>Balanced!</b> The centre of gravity is <b>directly above the pivot</b>: <b>no turning force</b> (picture B).'
        :'The centre of gravity is <b>behind the pivot</b>: let go and you will topple…'; return gx; }
    function settle(){ const gx=draw(); const target=gx<P.x-2?90:Math.abs(gx-P.x)<=2?a:0; const step=()=>{ const g=target-a; a+=Math.sign(g)*Math.min(Math.abs(g),target===90?1.5+a*.05:2); if(target===90&&a>=89){ a=90; fallen=true; el.querySelector('.stage').animate([{transform:'translateY(4px)'},{transform:'none'}],{duration:180}); }
      draw(); if(Math.abs(target-a)>.05&&el.isConnected) raf=requestAnimationFrame(step); }; cancelAnimationFrame(raf); raf=requestAnimationFrame(step); }
    let ang0=0, a0=0;
    K.svgDrag($('#chg'),$('#chsvg'),{start(p){ if(fallen) return; cancelAnimationFrame(raf); ang0=Math.atan2(P.y-p.y,P.x-p.x); a0=a; },move(x,y){ if(fallen) return; const t=Math.atan2(P.y-y,P.x-x); a=Math.max(0,Math.min(40,a0+(ang0-t)*180/Math.PI)); if(Math.abs(a-BAL)<1.2) a=BAL; draw(); },end(){ if(!fallen) settle(); }});
    $('#chr').onclick=()=>{ fallen=false; a=0; cancelAnimationFrame(raf); draw(); };
    draw();
    K.cue(()=>$('#chg rect'),{watch:$('#chsvg'),host:el,ring:true,to:{dx:-45,dy:10}});
  }

  return {pushBook,leaf,springLab,seesaw,door,chair};
})();
