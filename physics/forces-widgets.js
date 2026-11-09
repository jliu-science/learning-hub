/* ===== Interactive models for Topic 1.3 Contact forces ===== */
window.ForcesWidgets = (function(){
  const K = window.Kit;
  const INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf', PUSH='#2563eb', FRIC='#b45309', W='#dc2626', AIR='#0284c7', OK='#16a34a';

  /* ---------------- 1.3.1 Push the book (friction) ---------------- */
  const SURF=[{n:'Smooth surface',max:4,rough:3},{n:'Rough surface',max:10,rough:9},{n:'Rough surface + oil (lubrication)',max:5,rough:9,oil:true}];
  function pushBook(el,U){
    let S=SURF[1], push=0, x=0, v=0, raf=0;
    el.innerHTML=`<div class="sim"><div class="ctl">
        <h4>Surface</h4><div id="pbs" class="col"></div>
        <h4>Your push</h4>${K.range('Push force',0,15,1,0,'# N')}
        <p class="hint">Push gently, then harder. Then let go (push 0 N).</p></div>
      <div><div class="stage"><svg viewBox="0 0 520 250" id="pbsvg" aria-label="A book being pushed along a table">
        <rect x="0" y="150" width="520" height="12" fill="#e9e1cf"/><path id="pbground" d="" fill="none" stroke="${INK}" stroke-width="1.5"/>
        <g id="pbbook"><rect x="0" y="100" width="110" height="50" fill="#fdfcf8" stroke="${INK}" stroke-width="2.5"/><rect x="0" y="100" width="110" height="10" fill="#c7d2fe" stroke="${INK}" stroke-width="2.5"/><text x="55" y="135" text-anchor="middle" font-size="15" fill="${MUTED}">book</text><g id="pbarr"></g></g>
        <g transform="translate(440 60)"><clipPath id="pbclip"><circle r="46"/></clipPath><circle r="46" fill="#fff" stroke="${MUTED}" stroke-dasharray="3 3"/><g id="pbzoom" clip-path="url(#pbclip)"></g><text y="62" text-anchor="middle" font-size="14" fill="${MUTED}">zoomed in</text></g>
      </svg></div>
      <div class="readout"><span>push <b id="pbp">0 N</b></span><span>friction <b id="pbf">0 N</b></span><span>resultant <b id="pbr">0 N</b></span></div>
      <div class="verdict" id="pbv"></div></div></div>`;
    const $=s=>el.querySelector(s);
    const zoom=()=>{ const r=S.rough*1.4; let top='M-46 -1', bot='M-46 1'; for(let k=0;k<=18;k++){ const xx=-46+k*5.2; top+=` L${xx} ${k%2?r/2:-r/2}`; bot+=` L${xx} ${k%2?r/2+3:-r/2+3}`; }
      $('#pbzoom').innerHTML=`<path d="${top} L48 -40 L-48 -40Z" fill="#c7d2fe" stroke="${INK}"/><path d="${bot} L48 40 L-48 40Z" fill="#e9e1cf" stroke="${INK}"/>${S.oil?'<path d="M-46 1.5 L46 1.5" stroke="#ca8a04" stroke-width="6" opacity=".55"/>':''}`; };
    const ground=()=>{ let d='M0 150'; for(let k=0;k<=104;k++) d+=` L${k*5} ${150-(k%2?S.rough*.25:0)}`; $('#pbground').setAttribute('d',d); };
    function draw(fr){ const bx=20+x; $('#pbbook').setAttribute('transform',`translate(${bx} 0)`);
      $('#pbarr').innerHTML=(push?K.arrow(-8-push*7,125,-4,125,PUSH,5,11)+`<text x="${-12-push*3.5}" y="115" text-anchor="middle" font-size="15" fill="${PUSH}">push</text>`:'')+
        (fr?K.arrow(55,160,55-fr*7,160,FRIC,5,11)+`<text x="${55-fr*3.5}" y="182" text-anchor="middle" font-size="15" fill="${FRIC}">friction</text>`:'');
      const net=push-fr;
      $('#pbp').textContent=push+' N'; $('#pbf').textContent=fr+' N'; $('#pbr').textContent=net===0?'0 N':`${Math.abs(net)} N ${net>0?'→':'←'}`; }
    function tick(){ let fr, msg;
      if(v<=0 && push<=S.max){ v=0; fr=push; msg=push===0?'No push, no friction. The book is still.':`The book does <b>not</b> move. Friction grips it and matches your push: <b>${fr} N</b> each way, so the <b>resultant force is zero</b>.`; }
      else { fr=S.max; v=Math.max(0,v+(push-fr)*0.06); x+=v;
        msg=push>fr?`The book <b>moves</b>. Your push (${push} N) is bigger than friction (${fr} N), so there is a resultant force of <b>${push-fr} N</b>.`:
          push===fr?'The push and friction are <b>equal</b>. The resultant force is <b>zero</b>, so the moving book continues at a <b>steady speed</b>.':
          v>0?'Friction is bigger than your push, so the book <b>slows down</b>…':`Friction has <b>stopped</b> the book. ${S.oil?'':'Rough surfaces can no longer move past each other.'}`; }
      if(x>360){ x=0; }
      draw(fr); $('#pbv').innerHTML=msg+(S.oil?'<br><span class="hint">The oil (lubrication) lets the surfaces slide more easily, so friction is smaller.</span>':''); raf=requestAnimationFrame(tick); }
    K.choices($('#pbs'),SURF.map(s=>s.n),i=>{ S=SURF[i]; v=0; zoom(); ground(); },1);
    K.ranges(el,([p])=>{ push=p; });
    cancelAnimationFrame(raf); tick();
    const stop=new MutationObserver(()=>{ if(!document.body.contains(el.querySelector('#pbsvg'))){ cancelAnimationFrame(raf); stop.disconnect(); } }); stop.observe(document.body,{childList:true,subtree:true});
  }

  /* ---------------- 1.3.1 Falling leaf (air resistance) ---------------- */
  function leaf(el,U){
    let y=0, v=0, run=false, raf=0, frames=0; const Wt=6, k=.55;
    el.innerHTML=`<div class="sim"><div class="ctl"><p>A leaf falls from a tree. Its <b>weight</b> pulls it down. <b>Air resistance</b> pushes up, and gets bigger as the leaf goes faster.</p>
        <div class="row"><button class="btn" id="lfgo">Drop the leaf</button><button class="btn ghost small" id="lfr">Reset</button></div><p class="hint" id="lfstate">Follow the leaf as it falls; the view repeats so you can see it reach steady speed.</p>
        <ol class="steps-list" id="lfst"><li>Just let go: air resistance is small. The resultant force is down, so the speed <b>increases</b>.</li><li>Faster: air resistance grows. Still smaller than weight, so it keeps speeding up, but less.</li><li>Air resistance = weight. The resultant force is <b>zero</b>, the leaf is in <b>equilibrium</b> and falls at a <b>steady speed</b>.</li></ol></div>
      <div><div class="stage"><svg viewBox="0 0 360 330" id="lfsvg" aria-label="A falling leaf with force arrows">
        <rect x="0" y="0" width="140" height="330" fill="#eef3e6"/><text x="70" y="320" text-anchor="middle" font-size="14" fill="${MUTED}">tree</text>
        <g id="lfg"></g><g id="lfgraph" transform="translate(190 30)"></g></svg></div>
      <div class="readout"><span>weight <b>${Wt} units</b></span><span>air resistance <b id="lfa">0</b></span><span>resultant <b id="lfres">0</b></span></div></div></div>`;
    const $=s=>el.querySelector(s); const pts=[];
    function draw(){ const air=k*v*v, py=75+y; const res=Math.abs(Wt-air)<1e-8?0:Wt-air;
      $('#lfg').innerHTML=`<path transform="translate(80 ${py}) rotate(${Math.sin(y/14)*18})" d="M0 -14 C12 -8 14 6 0 16 C-14 6 -12 -8 0 -14Z M0 -14 L0 16" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>`+
        K.arrow(80,py+18,80,py+18+Wt*9,W,4,10)+`<text x="92" y="${py+18+Wt*9}" font-size="15" fill="${W}">weight</text>`+
        (air>.1?K.arrow(80,py-18,80,py-18-air*9,AIR,4,10)+`<text x="92" y="${py-14-air*9}" font-size="15" fill="${AIR}">air resistance</text>`:'');
      $('#lfa').textContent=air.toFixed(2); $('#lfres').textContent=res===0?'0 (balanced)':res.toFixed(2)+' down';
      const stage=v<.05&&!run?-1:res>2.5?0:res>0?1:2; [...$('#lfst').children].forEach((li,i)=>li.classList.toggle('on',i===stage));
      const g=$('#lfgraph'); g.innerHTML=`<line x1="0" y1="0" x2="0" y2="150" stroke="${INK}"/><line x1="0" y1="150" x2="150" y2="150" stroke="${INK}"/><text x="-8" y="75" transform="rotate(-90 -8 75)" text-anchor="middle" font-size="14" fill="${MUTED}">speed</text><text x="75" y="166" text-anchor="middle" font-size="14" fill="${MUTED}">time</text>`+
        `<polyline points="${pts.map((p,i)=>`${i*150/Math.max(1,pts.length-1)},${150-p*38}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="2"/>`; }
    function tick(){ if(!run) return; const air=k*v*v; v+=(Wt-air)*.006; if(Wt-k*v*v<.015) v=Math.sqrt(Wt/k); y=(y+v*.6)%170; frames++; if(frames%3===0&&pts.length<151) pts.push(v); draw(); raf=requestAnimationFrame(tick); }
    $('#lfgo').onclick=()=>{ if(run){ run=false; cancelAnimationFrame(raf); $('#lfgo').textContent='Drop again'; $('#lfstate').textContent='Animation paused. Press Drop again to repeat the fall.'; return; } y=0; v=0; frames=0; pts.length=0; pts.push(0); run=true; $('#lfgo').textContent='Pause'; $('#lfstate').textContent='Following the falling leaf. The repeated view lets you observe steady speed.'; cancelAnimationFrame(raf); tick(); };
    $('#lfr').onclick=()=>{ run=false; cancelAnimationFrame(raf); y=0; v=0; frames=0; pts.length=0; draw(); $('#lfgo').textContent='Drop the leaf'; $('#lfstate').textContent='Follow the leaf as it falls; the view repeats so you can see it reach steady speed.'; };
    const stop=new MutationObserver(()=>{ if(!document.body.contains(el.querySelector('#lfsvg'))){ run=false; cancelAnimationFrame(raf); stop.disconnect(); } }); stop.observe(document.body,{childList:true,subtree:true});
    draw();
  }

  /* ---------------- 1.3.2 Spring lab (Hooke's Law) ---------------- */
  function springLab(el,U){
    const L0=5, PER=2, LIMIT=7; let n=0, perm=0; const pts=[];
    el.innerHTML=`<div class="sim"><div class="ctl"><p><b>How:</b> press and hold a <b>1 N</b> weight below, drag it onto the dashed hook under the spring, then let go. Add them one at a time. Each time, the extension is plotted on the graph.</p>
        <div class="pool" id="spw"></div><div class="row"><button class="btn ghost small" id="spoff">Take all the weights off</button><button class="btn ghost small" id="spnew">Use a fresh spring</button></div>
        <div class="calc" id="spc"></div></div>
      <div><div class="stage"><svg viewBox="0 0 470 330" id="spsvg" aria-label="A spring with weights and a force–extension graph">
        <rect x="20" y="10" width="140" height="10" fill="${INK}"/>
        <g id="spring"></g>
        <g transform="translate(220 20)" id="spgraph"></g></svg></div></div></div>`;
    const $=s=>el.querySelector(s);
    const ext=f=>f<=LIMIT?f*PER:LIMIT*PER+(f-LIMIT)*PER*2.2; // beyond the elastic limit it stretches much more
    for(let i=0;i<9;i++) $('#spw').appendChild(U.h('div',{class:'chip dragme'},'1 N'));
    function draw(){
      const e=ext(n)+perm, len=L0+e, px=Math.min(11,(280-n*13)/len); const top=20, bot=top+len*px; let d=`M90 ${top}`; const coils=12;
      for(let k=1;k<=coils;k++) d+=` L${k%2?70:110} ${top+ (len*px-20)*(k/(coils+1))}`; d+=` L90 ${bot-20} L90 ${bot}`;
      $('#spring').innerHTML=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M90 ${bot} q10 6 0 12" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <g class="hook" data-hook="1"><rect class="${n?'':'tgt'}" x="55" y="${bot+8}" width="70" height="${Math.max(30,n*13+12)}" fill="transparent" stroke="${n?'none':'#059669'}" stroke-dasharray="5 4" stroke-width="1.5"/>${Array.from({length:n},(_,i)=>`<rect x="66" y="${bot+14+i*13}" width="48" height="11" fill="#cbd5e1" stroke="${INK}"/>`).join('')}</g>
        `;
      const g=$('#spgraph'), sx=24, maxE=Math.ceil((Math.max(20,e,...pts.map(p=>p[1]))+2)/4)*4, sy=240/maxE; let gr=`<line x1="0" y1="0" x2="0" y2="250" stroke="${INK}"/><line x1="0" y1="250" x2="230" y2="250" stroke="${INK}"/>
        <text x="115" y="285" text-anchor="middle" font-size="15" fill="${MUTED}">force (N)</text><text x="-30" y="125" transform="rotate(-90 -30 125)" text-anchor="middle" font-size="15" fill="${MUTED}">extension (cm)</text>`;
      for(let f=0;f<=9;f++) gr+=`<text x="${f*sx}" y="266" text-anchor="middle" font-size="13" class="mono">${f}</text>`;
      for(let c=0;c<=maxE;c+=4) gr+=`<text x="-6" y="${250-c*sy+3}" text-anchor="end" font-size="13" class="mono">${c}</text>`;
      gr+=`<line x1="0" y1="250" x2="${LIMIT*sx}" y2="${250-LIMIT*PER*sy}" stroke="${LINE}" stroke-dasharray="4 4"/>`;
      gr+=pts.map(([f,e])=>`<g transform="translate(${f*sx} ${250-e*sy})"><path d="M-4 -4L4 4M-4 4L4 -4" stroke="${f>LIMIT?W:INK}" stroke-width="2"/></g>`).join('');
      g.innerHTML=gr;
      $('#spc').innerHTML=`Original length = ${L0} cm. Length now = ${len.toFixed(1)} cm.<br>Force = <b>${n} N</b><br>Extension from the original length = <b>${e.toFixed(1)} cm</b>`+
        (perm?`<br><span class="no">Permanent extension = ${perm.toFixed(1)} cm: the spring did not return to its original length.</span>`:'')+
        (n>LIMIT?'<br><span class="no">Past the elastic limit: the points no longer lie on the straight line.</span>':!perm&&n>0&&n%2===0?`<br><span class="ok">Compare with ${n/2} N: double the force, double the extension. Hooke’s Law.</span>`:'');
    }
    el.querySelectorAll('#spw .chip').forEach(c=>Engine.drag(c,{targets:'.hook',onDrop:(chip)=>{ if(n>=9) return false; n++; pts.push([n,ext(n)+perm]); chip.classList.add('ok'); chip.style.visibility='hidden'; draw(); return true; }}));
    const removeWeights=()=>{ n=0; pts.length=0; pts.push([0,perm]); el.querySelectorAll('#spw .chip').forEach(c=>{ c.classList.remove('ok'); c.style.visibility=''; }); draw(); };
    $('#spoff').onclick=()=>{ if(n>LIMIT) perm=Math.max(perm,(n-LIMIT)*PER); removeWeights(); };
    $('#spnew').onclick=()=>{ perm=0; removeWeights(); };
    draw();
  }

  /* ---------------- 1.3.3 See-saw (law of moments) ---------------- */
  const PEOPLE=[['Child',150],['Girl',500],['Mother',600],['Man',1000]];
  const TASKS=[
    {t:'Textbook example: a 500 N girl sits 1 m to the left of the pivot. Where must the 1000 N man sit to balance her?',need:{'Girl':-1,'Man':.5},fix:{'Girl':-1}},
    {t:'Sitting on a see-saw: the 2 m see-saw has the 150 N child at one end (1 m from the pivot). Where must the 600 N mother sit to balance?',need:{'Child':1,'Mother':-.25},fix:{'Child':1}},
    {t:'Free play: put anyone anywhere and see if it balances.',free:true}
  ];
  function seesaw(el,U){
    let T=TASKS[0], seats={};
    el.innerHTML=`<div class="ch" id="ssx" style="margin-bottom:8px"></div><p id="sst" style="margin:.3em 0 .6em"></p>
      <div class="stage"><svg viewBox="0 0 640 250" id="sssvg" aria-label="See-saw"></svg></div>
      <div class="pool" id="ssp" style="margin-top:10px"></div>
      <div class="calc" id="ssc"></div><div class="row" style="margin-top:8px"><button class="btn ghost small" id="ssr">Start again</button></div>`;
    const $=s=>el.querySelector(s); const PX=260; // pixels per metre, beam 2 m
    const POS=[-1,-.75,-.5,-.25,.25,.5,.75,1];
    function draw(){
      const cw=Object.entries(seats).filter(([,d])=>d>0).reduce((s,[p,d])=>s+PEOPLE.find(q=>q[0]===p)[1]*d,0);
      const acw=Object.entries(seats).filter(([,d])=>d<0).reduce((s,[p,d])=>s+PEOPLE.find(q=>q[0]===p)[1]*-d,0);
      const diff=cw-acw; const ang=Math.max(-12,Math.min(12,diff/40));
      let s=`<path d="M320 160 L298 215 L342 215Z" fill="#e9e1cf" stroke="${INK}" stroke-width="2"/><line x1="40" y1="215" x2="600" y2="215" stroke="${INK}"/>
        <text x="320" y="236" text-anchor="middle" font-size="15" fill="${MUTED}">pivot</text><g transform="rotate(${ang} 320 160)">
        <rect x="${320-PX}" y="152" width="${PX*2}" height="10" fill="#d6b98a" stroke="${INK}" stroke-width="2"/>`;
      POS.forEach(d=>{ const x=320+d*PX; const who=Object.keys(seats).find(p=>seats[p]===d);
        s+=`<g class="seat" data-d="${d}"><rect x="${x-30}" y="70" width="60" height="82" fill="transparent"/><line x1="${x}" y1="146" x2="${x}" y2="152" stroke="${INK}"/>
          <text x="${x}" y="178" text-anchor="middle" font-size="13" class="mono" fill="${MUTED}">${Math.abs(d)} m</text>`;
        if(who){ const w=PEOPLE.find(q=>q[0]===who)[1]; s+=`<rect x="${x-26}" y="${140-Math.sqrt(w)*1.6}" width="52" height="${Math.sqrt(w)*1.6}" rx="3" fill="${d<0?'#ede9fe':'#e0f2fe'}" stroke="${INK}"/><text x="${x}" y="${132-Math.sqrt(w)*1.6}" text-anchor="middle" font-size="14" font-weight="700">${who}</text><text x="${x}" y="134" text-anchor="middle" font-size="13" class="mono">${w} N</text>` }
        else s+=`<circle cx="${x}" cy="140" r="5" fill="none" stroke="${MUTED}" stroke-dasharray="2 2"/>`;
        s+='</g>'; });
      s+=`</g><text x="60" y="30" font-size="15" fill="#6d28d9">↺ anticlockwise side</text><text x="580" y="30" text-anchor="end" font-size="15" fill="#0369a1">clockwise side ↻</text>`;
      $('#sssvg').innerHTML=s;
      const line=(side)=>Object.entries(seats).filter(([,d])=>side>0?d>0:d<0).map(([p,d])=>`${PEOPLE.find(q=>q[0]===p)[1]} N × ${Math.abs(d)} m`).join(' + ')||'nothing';
      let msg=`Anticlockwise moment = ${line(-1)} = <b>${acw} Nm</b><br>Clockwise moment = ${line(1)} = <b>${cw} Nm</b><br>`;
      const n=Object.keys(seats).length;
      if(n<2) msg+=`<span class="hint"><b>How:</b> drag a person card onto a seat.</span>`;
      else if(diff===0) msg+=`<span class="ok">Balanced: clockwise moment = anticlockwise moment. This is the law of moments, the see-saw is in equilibrium.</span>`;
      else msg+=`<span class="no">Not balanced: the ${diff>0?'clockwise':'anticlockwise'} moment is bigger, so the see-saw turns ${diff>0?'clockwise':'anticlockwise'}.</span>`;
      $('#ssc').innerHTML=msg;
      el.querySelectorAll('#ssp .chip').forEach(c=>{ c.style.visibility=seats[c.dataset.p]!==undefined?'hidden':''; });
    }
    function setup(i){ T=TASKS[i]; seats=Object.assign({},T.fix||{}); $('#sst').innerHTML=T.t; const pool=$('#ssp'); pool.innerHTML='';
      PEOPLE.forEach(([p,w])=>{ if(T.fix&&T.fix[p]!==undefined) return; if(!T.free&&!(p in T.need)) return;
        const c=U.h('div',{class:'chip','data-p':p},`${p} · ${w} N`);
        Engine.drag(c,{targets:'.seat',onDrop:(chip,g)=>{ const d=+g.dataset.d; if(Object.values(seats).includes(d)) return false; seats[chip.dataset.p]=d; draw(); return true; }});
        pool.appendChild(c); });
      if(!T.free) pool.insertAdjacentHTML('beforeend','<span class="hint" style="align-self:center">Drag onto a seat. Drag again to move.</span>');
      draw(); }
    // allow moving a seated person by dragging their chip again: chips reappear on reset only, so tapping a seat clears it
    $('#sssvg').addEventListener('click',e=>{ const g=e.target.closest('.seat'); if(!g) return; const d=+g.dataset.d; const who=Object.keys(seats).find(p=>seats[p]===d); if(who&&!(T.fix&&T.fix[who]!==undefined)){ delete seats[who]; draw(); } });
    K.choices($('#ssx'),['Task 1','Task 2','Free play'],setup,0);
    $('#ssr').onclick=()=>setup(TASKS.indexOf(T));
  }

  /* ---------------- 1.3.3 Open the door (moment = force × distance) ---------------- */
  function door(el,U){
    el.innerHTML=`<div class="sim"><div class="ctl"><p>You push on a door. The hinge is the <b>pivot</b>.</p>
        ${K.range('Force',1,20,1,5,'# N')}${K.range('Distance from the hinge',.1,1,.05,.75,'# m')}
        <div class="calc" id="dc"></div></div>
      <div class="stage"><svg viewBox="0 0 420 260" id="dsvg" aria-label="A door seen from above"></svg></div></div>`;
    const $=s=>el.querySelector(s);
    K.ranges(el,([F,d])=>{ const M=+(F*d).toFixed(2); const ang=Math.min(25,M*4); const L=290;
      $('#dsvg').innerHTML=`<text x="20" y="22" font-size="15" fill="${MUTED}">seen from above</text><circle cx="60" cy="105" r="7" fill="${INK}"/><text x="60" y="135" text-anchor="middle" font-size="15" fill="${MUTED}">hinge (pivot)</text>
        <g transform="rotate(${ang} 60 105)"><rect x="60" y="99" width="${L}" height="12" fill="#d6b98a" stroke="${INK}" stroke-width="2"/>
        ${K.arrow(60+d*L,55,60+d*L,97,PUSH,4,10)}<line x1="60" y1="120" x2="${60+d*L}" y2="120" stroke="${MUTED}"/><text x="${60+d*L/2}" y="137" text-anchor="middle" font-size="14" class="mono" fill="${MUTED}">${d} m</text>
        <text x="${60+d*L}" y="47" text-anchor="middle" font-size="15" fill="${PUSH}">${F} N</text></g>`;
      $('#dc').innerHTML=`moment = force × perpendicular distance from the pivot<br>= ${F} N × ${d} m = <b>${M} Nm</b><br><span class="hint">The force produces a clockwise turning effect. The angle is illustrative. Push further from the hinge and you need less force for the same moment.</span>`; });
  }

  /* ---------------- 1.3.3 Tipping a chair (centre of gravity) ---------------- */
  function chair(el,U){
    el.innerHTML=`<div class="sim"><div class="ctl"><p>Lean back on your chair. The back legs touching the floor are the <b>pivot</b>. Watch where the <b>centre of gravity</b> is.</p>
        ${K.range('Tip the chair back',0,32,1,0,'#°')}<div class="verdict" id="chv"></div></div>
      <div class="stage"><svg viewBox="0 0 360 280" id="chsvg" aria-label="A chair tipping back"></svg></div></div>`;
    const $=s=>el.querySelector(s); const P={x:120,y:240}; const CG={x:162,y:122}; 
    K.ranges(el,([a])=>{ const r=a*Math.PI/180; const cx=P.x+(CG.x-P.x)*Math.cos(r)-(CG.y-P.y)*Math.sin(r)*-1*-1;
      const dx=CG.x-P.x, dy=CG.y-P.y; const gx=P.x+dx*Math.cos(-r)-dy*Math.sin(-r), gy=P.y+dx*Math.sin(-r)+dy*Math.cos(-r);
      const over=Math.abs(gx-P.x)<3; const behind=gx<P.x-3;
      $('#chsvg').innerHTML=`<line x1="10" y1="240" x2="350" y2="240" stroke="${INK}" stroke-width="2"/>
        <g transform="rotate(${-a} ${P.x} ${P.y})">
          <path d="M120 240 L120 150 L114 70 M120 150 L215 150 L215 240" stroke="#b45309" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="140" cy="62" r="15" fill="#f1e5d1" stroke="${INK}" stroke-width="2"/>
          <path d="M138 78 L150 142 L222 138 L238 205 M144 100 L190 112" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
        <circle cx="${P.x}" cy="${P.y}" r="6" fill="${MUTED}"/><text x="${P.x-10}" y="262" text-anchor="end" font-size="14" fill="${MUTED}">pivot</text>
        <line x1="${gx}" y1="${gy}" x2="${gx}" y2="240" stroke="${W}" stroke-dasharray="4 3"/>${K.arrow(gx,gy,gx,gy+50,W,4,10)}
        <circle cx="${gx}" cy="${gy}" r="7" fill="#facc15" stroke="${INK}"/><text x="${gx+12}" y="${gy-8}" font-size="14" fill="${INK}">centre of gravity</text>`;
      $('#chv').innerHTML=over?'<b>Balanced on the pivot</b>: the centre of gravity is directly above the pivot, so your weight has <b>no turning force</b> (like picture B).'
        :behind?'<b>You topple over!</b> The centre of gravity has moved behind the pivot. Your weight now has a turning force that pulls you <b>backwards</b> (like picture C).'
        :'Your weight acts in front of the pivot. Its turning force brings the chair <b>back down</b> onto the floor (like picture A).'; });
  }

  return {pushBook,leaf,springLab,seesaw,door,chair};
})();
