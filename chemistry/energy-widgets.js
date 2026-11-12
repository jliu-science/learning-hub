/* ===== Interactive models for Topic 6.4 Chemical energy ===== */
window.EnergyWidgets = (function(){
  const K = window.Kit;
  const RED='#dc2626', BLUE='#0284c7', INK='#1d1b16', MUTED='#8a8270', LINE='#d9d1bf';

  /* ---------------- 6.4.1 Thermometer lab ---------------- */
  const EXPTS = [
    {n:'Citric acid + sodium hydrogen carbonate',src:'Tom’s experiment',a:'citric acid crystals',b:'sodium hydrogen carbonate powder',end:10,type:'endo'},
    {n:'Dilute sulfuric acid + sodium hydroxide',src:'Zoe’s experiment',a:'dilute sulfuric acid',b:'sodium hydroxide solution',end:30,type:'exo'},
    {n:'Dissolving potassium chloride',src:'Summary question 2',a:'water',b:'potassium chloride',end:10,type:'endo'},
    {n:'Dissolving calcium chloride',src:'Summary question 2',a:'water',b:'calcium chloride',end:35,type:'exo'},
    {n:'Dissolving sodium hydrogen carbonate',src:'Summary question 2',a:'water',b:'sodium hydrogen carbonate',end:15,type:'endo'},
    {n:'Dissolving sodium carbonate',src:'Summary question 2',a:'water',b:'sodium carbonate',end:24,type:'exo'}
  ];
  function thermo(el,U){
    let ex=null, T=20, busy=false, answered=false;
    el.innerHTML=`<div class="sim">
      <div class="ctl"><h4>1. Choose an experiment</h4><div id="tx" class="col"></div>
        <h4>2. Run it</h4><div class="row"><button class="btn" id="tmix" disabled>Mix them</button><button class="btn ghost small" id="twait" disabled>Leave it for a while</button></div>
        <p class="hint">Both substances start at room temperature, 20 °C. The thermometer is <b>in the mixture</b>, so it shows the temperature of the reacting mixture, not the room.</p></div>
      <div><div class="stage"><svg viewBox="0 0 380 280" id="tsvg" aria-label="Beaker with a thermometer">
        <text x="14" y="22" class="mono" font-size="12" fill="${MUTED}" id="tlbl">No experiment chosen</text>
        <path d="M40 80 L40 240 Q40 256 56 256 L224 256 Q240 256 240 240 L240 80" fill="#fdfcf8" stroke="${INK}" stroke-width="2.5"/>
        <rect id="tliq" x="42" y="150" width="196" height="104" fill="#cfe6f5" opacity=".85"/>
        <g id="tbub"></g>
        <rect x="149" y="36" width="22" height="200" rx="11" fill="#fff" stroke="${INK}" stroke-width="2"/>
        <circle cx="160" cy="232" r="14" fill="${RED}" stroke="${INK}" stroke-width="2"/>
        <rect id="tcol" x="155.5" y="100" width="9" height="136" fill="${RED}"/>
        <g id="tticks"></g>
        <text x="315" y="150" text-anchor="middle" font-size="34" font-weight="700" id="tread" fill="${INK}">20.0</text>
        <text x="315" y="174" text-anchor="middle" font-size="14" fill="${MUTED}">°C</text>
      </svg></div>
      <div class="verdict" id="tver">Pick an experiment on the left.</div></div></div>
      <div class="logwrap"><table class="logtable"><thead><tr><th>Experiment</th><th>Start</th><th>End</th><th>Change</th><th>Type</th></tr></thead><tbody id="tlog"><tr><td colspan="5" class="hint">Your results appear here.</td></tr></tbody></table></div>`;
    const $=s=>el.querySelector(s); const Y=t=>218-(t/40)*168; // 0 °C → y 218, 40 °C → y 50
    $('#tticks').innerHTML=[0,10,20,30,40].map(t=>`<line x1="171" y1="${Y(t)}" x2="178" y2="${Y(t)}" stroke="${INK}"/><text x="182" y="${Y(t)+4}" font-size="11" class="mono" fill="${INK}">${t}</text>`).join('');
    const draw=()=>{ $('#tcol').setAttribute('y',Y(T)); $('#tcol').setAttribute('height',232-Y(T)); $('#tread').textContent=T.toFixed(1); };
    const animate=(to,ms,done)=>{ busy=true; const from=T, t0=performance.now();
      const step=now=>{ const k=Math.min(1,(now-t0)/ms); const e=1-Math.pow(1-k,3); T=from+(to-from)*e; draw(); if(k<1) requestAnimationFrame(step); else { busy=false; done&&done(); } };
      requestAnimationFrame(step); };
    const bubbles=on=>{ $('#tbub').innerHTML=on?Array.from({length:14},(_,i)=>`<circle cx="${55+Math.random()*80}" cy="${170+Math.random()*80}" r="${2+Math.random()*3}" fill="#fff" opacity=".8"><animate attributeName="cy" from="${250}" to="${152}" dur="${1+Math.random()*1.4}s" repeatCount="indefinite" begin="${Math.random()}s"/></circle>`).join(''):''; };
    K.choices($('#tx'),EXPTS.map(e=>e.n),i=>{ if(busy) return; ex=EXPTS[i]; answered=false; T=20; draw(); bubbles(false);
      $('#tlbl').textContent=`${ex.a} + ${ex.b}`; $('#tmix').disabled=false; $('#twait').disabled=true;
      $('#tliq').setAttribute('y',150); $('#tver').innerHTML=`<b>${ex.n}</b> (${ex.src}). Start temperature 20 °C. Press <b>Mix them</b>.`; });
    $('#tmix').onclick=()=>{ if(!ex||busy) return; $('#tmix').disabled=true; bubbles(true); $('#tver').textContent='Mixing… watch the thermometer.';
      animate(ex.end,2600,()=>{ bubbles(false); const d=ex.end-20;
        $('#tver').innerHTML=`The thermometer <b>in the mixture</b> went from 20 °C to <b>${ex.end} °C</b> (${d>0?'+':''}${d} °C): the mixture got <b>${d>0?'hotter':'colder'}</b>. Is this change exothermic or endothermic?
          <div class="row" style="margin-top:8px"><button class="btn small" data-a="exo">Exothermic</button><button class="btn small" data-a="endo">Endothermic</button></div>`;
        $('#tver').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{ if(answered) return; answered=true; const ok=b.dataset.a===ex.type;
          const why=ex.type==='exo'?'The mixture\'s temperature <b class="up">increased</b>, so energy was transferred <b>to</b> the surroundings. That is <b>exothermic</b> (exo = exit).':'The mixture\'s temperature <b class="down">decreased</b>, so energy was transferred <b>from</b> the surroundings into the reacting substances. That is <b>endothermic</b> (endo = entrance).';
          $('#tver').innerHTML=`<b>${ok?'Correct.':'Not quite.'}</b> ${why} <br><span class="hint">Now press “Leave it for a while”.</span>`;
          const lg=$('#tlog'); if(lg.querySelector('.hint')) lg.innerHTML='';
          lg.insertAdjacentHTML('afterbegin',`<tr><td>${ex.n}</td><td>20 °C</td><td>${ex.end} °C</td><td>${d>0?'+':''}${d} °C</td><td>${ex.type==='exo'?'exothermic':'endothermic'}</td></tr>`);
          $('#twait').disabled=false; }); });
    };
    $('#twait').onclick=()=>{ if(busy) return; $('#twait').disabled=true; animate(20,2200,()=>{ $('#tver').innerHTML='Once the reaction is complete, the mixture slowly goes back to room temperature, <b>20 °C</b>, as energy moves between it and the surroundings. Choose another experiment.'; }); };
    draw();
  }

  /* ---------------- 6.4.2 Build the energy level diagram ---------------- */
  const CHANGES = [
    {n:'Burning methane',r:'methane + oxygen',p:'carbon dioxide + water',type:'exo',why:'Burning (combustion) gives out energy to the surroundings.'},
    {n:'Melting ice',r:'ice',p:'liquid water',type:'endo',why:'Melting takes in energy from the surroundings.'},
    {n:'Freezing water',r:'liquid water',p:'ice',type:'exo',why:'Freezing gives out energy to the surroundings.'},
    {n:'Dissolving potassium chloride',r:'potassium chloride + water',p:'solution',type:'endo',why:'The temperature fell from 20 °C to 10 °C: energy was taken in from the surroundings.'},
    {n:'Burning hydrogen',r:'hydrogen + oxygen',p:'water',type:'exo',why:'Burning 1 kg of hydrogen gives out 142 MJ to the surroundings.'},
    {n:'Boiling water',r:'liquid water',p:'steam',type:'endo',why:'Boiling takes in energy from the surroundings.'},
    {n:'Condensing steam',r:'steam',p:'liquid water',type:'exo',why:'Condensing gives out energy to the surroundings.'}
  ];
  function levelBuilder(el,U){
    const RY=172, EXO=246, ENDO=104, BL='#0284c7';
    let list, i, py, c, picked, done, score, firstTry, results;
    el.innerHTML=`<div class="sim lb2"><div class="ctl"><h4>Changes</h4><ol class="lb-list" id="lbl"></ol><div class="row"><button class="btn" id="lbnext" style="display:none">Next change →</button><button class="btn ghost small" id="lbre">Start again</button></div></div>
      <div class="stage lb-stage">
        <div class="lb-head"><span class="lb-n" id="lbn"></span><span class="lb-t" id="lbt"></span><span class="lb-eq" id="lbeq"></span></div>
        <div class="lb-ask" id="lbask">Is this change <button type="button" data-t="exo">exothermic</button> or <button type="button" data-t="endo">endothermic</button> ?</div>
        <div class="lb-dia"><div class="lb-note" id="lbnote"></div><svg viewBox="0 0 520 300" id="lbsvg" aria-label="Energy level diagram">
          <defs><marker id="lbah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>
          <line x1="40" y1="282" x2="40" y2="14" stroke="${INK}" stroke-width="1.6" marker-end="url(#lbah)"/><line x1="40" y1="282" x2="505" y2="282" stroke="${INK}" stroke-width="1.6" marker-end="url(#lbah)"/>
          <text x="24" y="150" transform="rotate(-90 24 150)" text-anchor="middle" font-size="13" fill="${MUTED}">energy</text>
          <text x="272" y="298" text-anchor="middle" font-size="12" fill="${MUTED}">progress of reaction</text>
          <line x1="70" y1="${RY}" x2="205" y2="${RY}" stroke="${INK}" stroke-width="3.5"/><text x="137" y="${RY-10}" text-anchor="middle" font-size="13" id="lbr"></text>
          <text x="137" y="${RY+20}" text-anchor="middle" font-size="11" fill="${MUTED}">reactants</text>
          <g id="lbarr"></g>
          <g id="lbp"><rect x="290" y="0" width="160" height="40" fill="transparent" id="lbhit"/><line id="lbpl" x1="300" x2="440" stroke-width="3.5"/>
            <text id="lbpt" x="370" text-anchor="middle" font-size="13"></text><text id="lbps" x="370" text-anchor="middle" font-size="11" fill="${MUTED}">products</text>
            <path id="lbcue" fill="none" stroke="var(--accent)" stroke-width="2"/><text id="lbcuet" x="452" font-size="12" fill="var(--accent)"></text></g>
        </svg></div>
      </div></div>`;
    const $=s=>el.querySelector(s), svg=$('#lbsvg');
    function note(txt,col){ const n=$('#lbnote'); n.innerHTML=txt||''; n.style.color=INK; n.style.borderColor=col||'transparent'; n.style.display=txt?'':'none'; n.classList.remove('fadein'); void n.offsetWidth; n.classList.add('fadein'); }
    function draw(){
      const g=!picked;
      $('#lbpl').setAttribute('y1',py); $('#lbpl').setAttribute('y2',py); $('#lbpl').setAttribute('stroke',g?MUTED:INK); $('#lbpl').setAttribute('stroke-dasharray',g?'6 5':'');
      $('#lbpt').setAttribute('y',py-10); $('#lbps').setAttribute('y',py+20); $('#lbhit').setAttribute('y',py-22);
      $('#lbp').style.cursor=picked&&!done?'grab':'default';
      const d=py-RY;
      $('#lbarr').innerHTML=Math.abs(d)<6?'':`<line x1="205" y1="${RY}" x2="300" y2="${RY}" stroke="${MUTED}" stroke-dasharray="4 4"/>`+K.arrow(252,RY,252,py,d>0?RED:BL,3,10)+
        `<text x="244" y="${RY+d/2+4}" text-anchor="end" font-size="12" fill="${d>0?RED:BL}">${d>0?'energy given out':'energy taken in'}</text>`+
        (done?`<text x="262" y="${RY+d/2+4}" font-size="13" font-weight="700" letter-spacing=".06em" fill="${d>0?RED:BL}">${d>0?'EXOTHERMIC':'ENDOTHERMIC'}</text>`:'');
      const cue=picked&&!done&&Math.abs(d)<6;
      $('#lbcue').setAttribute('d',cue?(c.type==='exo'?`M366 ${py+30} l4 5 l4 -5 M366 ${py+38} l4 5 l4 -5`:`M366 ${py-28} l4 -5 l4 5 M366 ${py-36} l4 -5 l4 5`):'');
      $('#lbcue').setAttribute('class',cue?'lb-pulse':''); $('#lbcuet').setAttribute('y',py+4); $('#lbcuet').textContent=cue?(c.type==='exo'?'drag down':'drag up'):'';
    }
    const tw=(to,ms,done2)=>{ const f=py; tween(ms,e=>{ py=f+(to-f)*e; draw(); },done2); };
    function list_(){ $('#lbl').innerHTML=list.map((x,k)=>`<li class="${k===i?'on':''} ${results[k]===true?'ok':results[k]===false?'retry':''}">${x.n}</li>`).join(''); }
    function show(){
      if(i>=list.length){ $('#lbn').textContent='All done'; $('#lbt').textContent=`${score} of ${list.length} right first time`; $('#lbeq').textContent='';
        $('#lbask').style.display='none'; note('Exothermic: products <b>lower</b> than reactants, arrow <b>down</b>. Endothermic: products <b>higher</b>, arrow <b>up</b>.',INK); $('#lbnext').style.display='none'; list_(); return; }
      c=list[i]; picked=false; done=false; firstTry=true; py=RY;
      $('#lbn').textContent=`Change ${i+1} of ${list.length}`; $('#lbt').textContent=c.n; $('#lbeq').textContent=`${c.r} → ${c.p}`;
      $('#lbr').textContent=c.r; $('#lbpt').textContent=c.p; $('#lbask').style.display='';
      el.querySelectorAll('#lbask button').forEach(b=>{ b.disabled=false; b.className=''; });
      $('#lbnext').style.display='none'; note(''); draw(); list_();
    }
    el.querySelectorAll('#lbask button').forEach(b=>b.onclick=()=>{ if(picked) return;
      if(b.dataset.t===c.type){ picked=true; b.className='on'; el.querySelectorAll('#lbask button').forEach(x=>x.disabled=x!==b);
        note(c.type==='exo'?'Energy is given out, so the products end up lower.':'Energy is taken in, so the products end up higher.',c.type==='exo'?RED:BL,c.type==='exo'?RY+64:RY-52); draw(); }
      else { firstTry=false; b.disabled=true; b.className='no'; note(`Not ${b.dataset.t==='exo'?'exothermic':'endothermic'}. ${c.why}`,RED,RY-52); } });
    K.svgDrag($('#lbp'),svg,{move:(x,y)=>{ if(!picked||done) return;
        const want=c.type==='exo'?1:-1, d=(y-RY)*want;
        if(d<0){ py=RY; draw(); note(c.type==='exo'?'Exothermic: the products go down, not up.':'Endothermic: the products go up, not down.',RED,c.type==='exo'?RY+64:RY-52); return; }
        py=RY+want*Math.min(d,76); draw(); },
      end:()=>{ if(!picked||done) return; const d=Math.abs(py-RY);
        if(d>=40&&Math.sign(py-RY)===(c.type==='exo'?1:-1)){ done=true; note(''); tw(c.type==='exo'?EXO:ENDO,250,()=>{ results[i]=firstTry; if(firstTry) score++; list_();
            note(`<b>${c.type==='exo'?'Exothermic':'Endothermic'}:</b> the products have <b>${c.type==='exo'?'less':'more'}</b> energy than the reactants. ${c.why}`,'var(--good)');
            $('#lbnext').textContent=i===list.length-1?'Finish':'Next change →'; $('#lbnext').style.display=''; }); }
        else tw(RY,200,()=>note(d<40&&d>6?'Drag it further.':'',MUTED,c.type==='exo'?RY+64:RY-52)); }});
    $('#lbnext').onclick=()=>{ i++; show(); };
    $('#lbre').onclick=start;
    function start(){ list=U.shuffle(CHANGES); i=0; score=0; results=[]; show(); }
    start();
  }

  /* ---------------- 6.4.2 Compare fuels: drag a fuel onto the burner ---------------- */
  const FUELS=[
    {n:'Hydrogen',neg:1,v:142,r:'hydrogen and oxygen',p:'water'},
    {n:'Methane (natural gas)',s:'Methane',v:56,r:'methane and oxygen',p:'carbon dioxide and water'},
    {n:'Diesel',neg:1,v:45,r:'diesel and oxygen',p:'carbon dioxide and water'},
    {n:'Coal',v:33,r:'coal and oxygen',p:'products'},
    {n:'Wood',v:21,r:'wood and oxygen',p:'products'}];
  const tween=(ms,fn,done)=>{ const t0=performance.now(); const f=now=>{ const k=Math.min(1,(now-t0)/ms), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; fn(e); if(k<1) requestAnimationFrame(f); else done&&done(); }; requestAnimationFrame(f); };
  function fuels(el,U){
    const TOPY=56, SC=1.8; const fm=f=>(f.neg?'−':'')+f.v; let burned=[], busy=false;
    el.innerHTML=`<div class="sim">
      <div class="ctl"><h4>Fuels (1 kg of each)</h4><div class="pool" id="fpool" style="flex-direction:column;align-items:flex-start"></div>
        <p class="hint">Drag a fuel onto the diagram to burn 1 kg of it. Do all five and compare.</p>
        <h4>Most energy per kg</h4><ol class="frank" id="frank"><li class="hint">Nothing burned yet.</li></ol>
        <button class="btn ghost small" id="freset">Start again</button></div>
      <div><div class="stage fdrop"><svg viewBox="0 0 520 340" id="fsvg" aria-label="Energy level diagram for burning a fuel"></svg></div>
        <div class="verdict" id="fv">Every fuel starts at the same level: fuel and oxygen.</div></div></div>`;
    const $=s=>el.querySelector(s), svg=$('#fsvg');
    svg.innerHTML=`<defs><marker id="fah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>
      <line x1="40" y1="322" x2="40" y2="14" stroke="${INK}" stroke-width="2" marker-end="url(#fah)"/><line x1="40" y1="322" x2="512" y2="322" stroke="${INK}" stroke-width="2" marker-end="url(#fah)"/>
      <text x="22" y="170" transform="rotate(-90 22 170)" text-anchor="middle" font-size="14" fill="${MUTED}">energy</text>
      <line x1="60" y1="${TOPY}" x2="200" y2="${TOPY}" stroke="${INK}" stroke-width="4"/>
      <text x="130" y="${TOPY-10}" text-anchor="middle" font-size="13" id="fr">fuel and oxygen</text>
      <text x="270" y="338" text-anchor="middle" font-size="12" fill="${MUTED}">progress of reaction</text>
      <g id="fghost"></g><g id="fnow"></g>
      <g id="fburn" opacity=".9"><text x="360" y="${TOPY+70}" text-anchor="middle" font-size="14" fill="${MUTED}">Drop a fuel here</text>
        <rect x="270" y="${TOPY+40}" width="180" height="50" fill="none" stroke="${LINE}" stroke-dasharray="6 4" stroke-width="2"/></g>`;
    const pool=$('#fpool');
    FUELS.forEach((f,k)=>{ const c=U.h('div',{class:'chip','data-k':k},f.n);
      Engine.drag(c,{targets:'.fdrop',onDrop:chip=>{ if(busy) return false; burn(+chip.dataset.k,chip); return true; }}); pool.appendChild(c); });
    function burn(k,chip){
      const f=FUELS[k], y2=TOPY+f.v*SC; busy=true; chip.classList.add('ok'); $('#fburn').style.display='none';
      // previous result becomes a faint line so the fuels can be compared
      $('#fghost').innerHTML=burned.map(b=>{ const y=TOPY+b.v*SC; return `<line x1="250" y1="${y}" x2="400" y2="${y}" stroke="${LINE}" stroke-width="3"/><text x="408" y="${y+4}" font-size="12" fill="${MUTED}">${b.s||b.n} <tspan class="mono">${fm(b)}</tspan></text>`; }).join('');
      $('#fr').textContent=f.r;
      tween(900,e=>{ const y=TOPY+(y2-TOPY)*e;
        $('#fnow').innerHTML=`<line x1="200" y1="${TOPY}" x2="250" y2="${TOPY}" stroke="${LINE}" stroke-dasharray="4 3"/>
          ${K.arrow(225,TOPY+2,225,y-2,RED,4,11)}<line x1="250" y1="${y}" x2="400" y2="${y}" stroke="${INK}" stroke-width="4"/>`; },()=>{
        $('#fnow').insertAdjacentHTML('beforeend',`<text x="215" y="${(TOPY+y2)/2+5}" text-anchor="end" font-size="15" font-weight="700" class="mono" fill="${RED}">${fm(f)} MJ/kg</text>
          <text x="325" y="${y2+20}" text-anchor="middle" font-size="13">${f.p}</text>`);
        burned.push(f); busy=false; rank(f); });
    }
    function rank(f){
      const s=[...burned].sort((a,b)=>b.v-a.v);
      $('#frank').innerHTML=s.map(b=>`<li class="${b===f?'on':''}"><span>${b.s||b.n}</span><b class="mono">${b.v} MJ/kg</b></li>`).join('');
      const pos=s.indexOf(f)+1;
      let msg=`<b>${f.n}</b>: ${f.neg?'energy change':'energy transferred to the surroundings'} <b>${fm(f)} MJ/kg</b>. Energy is given out, so burning is <b>exothermic</b> and the products are <b>lower</b> than the reactants.`;
      if(burned.length>1) msg+=`<br>So far it is number <b>${pos}</b> of ${burned.length}. The lower the products line, the more energy 1 kg gives out.`;
      if(burned.length===FUELS.length) msg+=`<br><b>All five done.</b> Hydrogen gives out the most per kilogram: about 3 times as much as diesel (142 compared with 45).`;
      $('#fv').innerHTML=msg;
    }
    $('#freset').onclick=()=>fuels(el,U);
  }

  /* ---------------- 6.4.3 Bond energy calculator: break → make → compare ---------------- */
  const RXN=[
    {n:'Hydrogen + chlorine',eq:'H₂ + Cl₂ → 2HCl',X:'Cl',xc:'#1f8a4c',xt:'#fff',hh:436,xx:243,hx:432},
    {n:'Hydrogen + fluorine',eq:'H₂ + F₂ → 2HF',X:'F',xc:'#e2c044',xt:INK,hh:436,xx:158,hx:562}
  ];
  function bonds(el,U){
    const S=0.26, TOP=92, BL='#0284c7', PU='#7c3aed';
    let R, k0=0, step, filled, vals, atoms, busy, yR, yP, IN, OUT;
    el.innerHTML=`<div class="ch" id="bx" style="margin-bottom:12px"></div>
      <div class="sim bond-sim"><div class="ctl">
        <ol class="steps-list" id="bsteps" style="margin-top:0"><li><span>Break the bonds <span class="hint">energy in</span></span></li><li><span>Make new bonds <span class="hint">energy out</span></span></li><li><span>Compare</span></li></ol>
        <p id="btxt" style="margin-top:10px"></p>
        <p class="hint" style="margin:10px 0 0">Drag the numbers in this table:</p><table class="btab"><thead><tr><th>Bond</th><th>Bond energy (kJ/mol)</th></tr></thead><tbody id="btab"></tbody></table>
        <div class="calc" id="bcalc"></div><div id="bq"></div>
        <div class="row" style="margin-top:10px"><button class="btn" id="bnext" style="display:none"></button><button class="btn ghost small" id="breset">Start again</button></div>
      </div>
      <div class="stage"><svg viewBox="0 0 680 432" id="bsvg" aria-label="Energy level diagram: breaking and making bonds"></svg></div></div>`;
    const $=s=>el.querySelector(s), svg=$('#bsvg');
    const atomSvg=a=>`<circle r="17" fill="${a==='H'?'#fff':R.xc}" stroke="${INK}" stroke-width="1.5"/><text y="6" text-anchor="middle" font-size="17" font-weight="700" fill="${a==='H'?INK:R.xt}">${a}</text>`;
    const place=()=>atoms.forEach(a=>a.el.setAttribute('transform',`translate(${a.x},${a.y})`));
    const moveTo=(pos,ms,done)=>{ const from=atoms.map(a=>[a.x,a.y]); tween(ms,e=>{ atoms.forEach((a,i)=>{ a.x=from[i][0]+(pos[i][0]-from[i][0])*e; a.y=from[i][1]+(pos[i][1]-from[i][1])*e; }); place(); },done); };
    const slot=(cx,cy,need,i)=>`<g class="bslot" data-need="${need}" data-i="${i}" transform="translate(${cx},${cy})"><rect x="-35" y="-18" width="70" height="36" rx="2" fill="#fff" stroke="${MUTED}" stroke-dasharray="4 3" stroke-width="1.5"/><text y="7" text-anchor="middle" font-size="21" class="mono" fill="${MUTED}">?</text><line x1="0" y1="18" x2="0" y2="26" stroke="${MUTED}" stroke-width="1.5"/></g>`;
    const level=(x1,x2,y,lbl)=>`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${INK}" stroke-width="4"/><text x="${(x1+x2)/2}" y="${y+22}" text-anchor="middle" font-size="16" fill="${MUTED}">${lbl.split('|').map((t,i)=>`<tspan x="${(x1+x2)/2}" dy="${i?19:0}">${t}</tspan>`).join('')}</text>`;
    const grow=(id,x,y1,y2,col,done)=>tween(800,e=>{ $(id).innerHTML=K.arrow(x,y1,x,y1+(y2-y1)*e,col,4,11); },done);
    const fade=(g,html)=>{ g.insertAdjacentHTML('beforeend',`<g class="fadein">${html}</g>`); };
    function setStep(s){ step=s; filled=0; vals=[];
      el.querySelectorAll('#bsteps li').forEach((li,i)=>{ li.classList.toggle('on',i===s); li.classList.toggle('done',i<s); });
      $('#bnext').style.display='none'; }
    function setup(k){ k0=k; R=RXN[k]; busy=false; IN=R.hh+R.xx; OUT=2*R.hx; yR=TOP+IN*S; yP=TOP+OUT*S;
      $('#btab').innerHTML=[['H–H',R.hh],[`${R.X}–${R.X}`,R.xx],[`H–${R.X}`,R.hx]].map(([b,v])=>`<tr><td>${b}</td><td><span class="chip vchip" data-b="${b}" data-v="${v}">${v}</span></td></tr>`).join('');
      el.querySelectorAll('.vchip').forEach(c=>Engine.drag(c,{targets:'.bslot',onDrop:drop}));
      svg.innerHTML=`<defs><marker id="bah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>
        <line x1="40" y1="410" x2="40" y2="14" stroke="${INK}" stroke-width="2" marker-end="url(#bah)"/><line x1="40" y1="410" x2="672" y2="410" stroke="${INK}" stroke-width="2" marker-end="url(#bah)"/>
        <text x="22" y="220" transform="rotate(-90 22 220)" text-anchor="middle" font-size="19" fill="${MUTED}">energy</text>
        <text x="360" y="429" text-anchor="middle" font-size="17" fill="${MUTED}">progress of reaction</text>
        <text x="56" y="28" font-size="20" class="mono" fill="${INK}">${R.eq}</text>
        <g id="blv">${level(60,205,yR,`reactants|H₂ + ${R.X}₂`)}</g><g id="bover"></g><g id="bup"></g><g id="bdn"></g><g id="blbl"></g><g id="bsl"></g><g id="bat"></g>`;
      const ay=yR-24; atoms=[['H',79,ay],['H',105,ay],[R.X,159,ay],[R.X,185,ay]].map(([a,x,y])=>{ const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.innerHTML=atomSvg(a); $('#bat').appendChild(g); return {a,el:g,x,y}; }); place();
      $('#bsl').innerHTML=slot(92,yR-74,'H–H',0)+slot(172,yR-74,`${R.X}–${R.X}`,1);
      setStep(0); $('#bq').innerHTML='';
      $('#btxt').innerHTML=`First the bonds in the reactants break. <b style="color:${BL}">Breaking bonds takes IN energy.</b><br>Drag each bond energy from the table into its <b>?</b> box.`;
      calc(); }
    function calc(){ const q=i=>vals[i]!==undefined?vals[i]:'?';
      let h=`<span style="color:${BL}">Energy needed to break bonds<br>= ${step===0?`${q(0)} + ${q(1)}${filled===2?` = <b>${IN} kJ/mol</b>`:''}`:`${R.hh} + ${R.xx} = <b>${IN} kJ/mol</b>`}</span>`;
      if(step>=1) h+=`<br><span style="color:${RED}">Energy released making bonds<br>= ${step===1?`${q(0)} + ${q(1)}${filled===2?` = 2 × ${R.hx} = <b>${OUT} kJ/mol</b>`:''}`:`2 × ${R.hx} = <b>${OUT} kJ/mol</b>`}</span>`;
      $('#bcalc').innerHTML=h; }
    function drop(chip,g){
      if(busy||g.dataset.done) return false;
      const need=g.dataset.need, i=+g.dataset.i;
      if(chip.dataset.b!==need){ chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake');
        const [a,b]=need.split('–'); U.toast(`That is the ${chip.dataset.b} bond energy. This bond joins ${a} to ${b}: find ${need} in the table.`); return false; }
      const col=step===0?BL:RED; g.dataset.done=1; vals[i]=+chip.dataset.v; filled++;
      g.querySelector('rect').setAttribute('fill',step===0?'#e0f2fe':'#fee2e2'); g.querySelector('rect').setAttribute('stroke',col); g.querySelector('rect').removeAttribute('stroke-dasharray');
      g.querySelector('text').textContent=chip.dataset.v; g.querySelector('text').setAttribute('fill',col);
      calc();
      if(step===1){ const p=atoms.map(a=>[a.x,a.y]); const h=i===0?0:1, x=i===0?2:3; const c=i===0?280:375; p[h]=[c-13,TOP-24]; p[x]=[c+13,TOP-24]; busy=true; moveTo(p,350,()=>{ busy=false; if(filled===2) made(); }); }
      else if(filled===2) broken();
      return true; }
    function broken(){ busy=true;
      setTimeout(()=>{ $('#bsl').innerHTML=''; $('#blv').insertAdjacentHTML('beforeend',level(205,432,TOP,'separate atoms'));
        moveTo([[250,TOP-24],[295,TOP-24],[345,TOP-24],[390,TOP-24]],900); grow('#bup',205,yR,TOP+2,BL,()=>{
          fade($('#blbl'),`<text x="214" y="${TOP+44}" font-size="16" fill="${BL}">bonds broken: energy in</text><text x="214" y="${TOP+66}" font-size="20" font-weight="700" class="mono" fill="${BL}">${IN} kJ/mol</text>`);
          busy=false; $('#btxt').innerHTML=`The molecules have split into separate atoms. That took in <b style="color:${BL}">${IN} kJ/mol</b>, so the atoms are now <b>higher</b> in energy.`;
          $('#bnext').textContent='Next: make new bonds →'; $('#bnext').style.display=''; $('#bnext').onclick=stepMake; }); },450); }
    function stepMake(){ setStep(1); calc(); busy=true;
      moveTo([[261,TOP-24],[356,TOP-24],[299,TOP-24],[394,TOP-24]],600,()=>{ busy=false;
        $('#bsl').innerHTML=slot(280,TOP-74,`H–${R.X}`,0)+slot(375,TOP-74,`H–${R.X}`,1); });
      $('#btxt').innerHTML=`Now the atoms join up in a new way to make 2H${R.X}. <b style="color:${RED}">Making bonds gives OUT energy.</b><br>2H${R.X} means two molecules, so there are <b>two</b> H–${R.X} bonds to make.<br>Drag <b>${R.hx}</b> into <b>both</b> <b>?</b> boxes.`; }
    function made(){ busy=true;
      setTimeout(()=>{ $('#bsl').innerHTML=''; const y=yP-24;
        $('#blv').insertAdjacentHTML('beforeend',level(432,655,yP,`products: 2H${R.X}`));
        moveTo([[492,y],[567,y],[518,y],[593,y]],900); grow('#bdn',432,TOP,yP-2,RED,()=>{
          fade($('#blbl'),`<text x="424" y="${TOP+98}" text-anchor="end" font-size="16" fill="${RED}">bonds made: energy out</text><text x="424" y="${TOP+120}" text-anchor="end" font-size="20" font-weight="700" class="mono" fill="${RED}">${OUT} kJ/mol</text>`);
          busy=false; $('#btxt').innerHTML=`New bonds formed and gave out <b style="color:${RED}">${OUT} kJ/mol</b>. The products end up here.`;
          $('#bnext').textContent='Next: compare →'; $('#bnext').style.display=''; $('#bnext').onclick=stepCompare; }); },450); }
    function stepCompare(){ setStep(2); calc();
      fade($('#bover'),`<line x1="205" y1="${yR}" x2="655" y2="${yR}" stroke="${MUTED}" stroke-dasharray="5 4" stroke-width="1.5"/>${K.arrow(655,yR+2,655,yP-2,PU,3,9)}`);
      $('#btxt').innerHTML=`Compare the blue arrow (energy in) with the red arrow (energy out). The dashed line shows where the reactants started.`;
      ask(`Energy needed to break bonds (<b>${IN}</b>) is ____ the energy released making bonds (<b>${OUT}</b>).`,['less than','more than'],IN<OUT?0:1,
        `Compare ${IN} and ${OUT}. Which number is smaller?`,()=>
      ask('So the reaction is…',['exothermic','endothermic'],IN<OUT?0:1,'More energy comes out than goes in, so overall energy is given out to the surroundings.',finish)); }
    function ask(q,opts,right,hint,next){
      const box=U.h('div',{class:'bask'},`<p style="margin:10px 0 6px">${q}</p><div class="ch"></div>`); $('#bq').appendChild(box);
      const bs=opts.map((o,i)=>{ const b=U.h('button',{type:'button'},o); b.onclick=()=>{ if(box.dataset.done) return;
        if(i===right){ box.dataset.done=1; b.classList.add('on'); bs.forEach(x=>x.disabled=x!==b); next(); }
        else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); U.toast(hint); } }; box.querySelector('.ch').appendChild(b); return b; }); }
    function finish(){ const d=OUT-IN;
      fade($('#bover'),`<text x="660" y="${yR-8}" text-anchor="end" font-size="20" font-weight="700" class="mono" fill="${PU}">${d}</text>`);
      $('#bq').insertAdjacentHTML('beforeend',`<div class="fb show good" style="margin-top:10px">Less energy is needed to break bonds (${IN}) than is released on making new bonds (${OUT}), so the reaction is <b>exothermic</b>.<br>
        Overall ${OUT} − ${IN} = <b>${d} kJ/mol</b> is given out. On the diagram the products end up <b>lower</b> than the reactants (purple arrow).</div>`);
      $('#bnext').textContent=`Try ${RXN[1-k0].n.toLowerCase()} →`; $('#bnext').style.display=''; $('#bnext').onclick=()=>pick.set(1-k0); }
    $('#breset').onclick=()=>setup(k0);
    const pick=K.choices($('#bx'),RXN.map(r=>r.n),setup,0);
  }

  /* ---------------- 6.4.3 What is a bond? Pull a molecule apart ---------------- */
  const EL={C:['#1f8a4c','#fff'],O:['#dc4a3d','#fff'],H:['#fff',INK]};
  const BE={'C–H':412,'O=O':496,'C=O':803,'O–H':463};
  const bname=(a,b,o)=>{ const k1=a+(o===2?'=':'–')+b, k2=b+(o===2?'=':'–')+a; return BE[k1]?k1:k2; };
  const atomSvg=(a,r)=>`<circle r="${r}" fill="${EL[a][0]}" stroke="${INK}" stroke-width="1.5"/><text y="${(r*.36).toFixed(1)}" text-anchor="middle" font-size="${Math.round(r*.95)}" font-weight="700" fill="${EL[a][1]}">${a}</text>`;
  function bondSvg(p,q,o,col,w,gap){ const L=Math.hypot(q[0]-p[0],q[1]-p[1])||1, nx=-(q[1]-p[1])/L, ny=(q[0]-p[0])/L;
    return (o===2?[-gap,gap]:[0]).map(d=>`<line x1="${p[0]+nx*d}" y1="${p[1]+ny*d}" x2="${q[0]+nx*d}" y2="${q[1]+ny*d}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`).join(''); }
  const MOLS=[
    {n:'Methane CH₄',ghs:['flame'],info:'A <b>gas</b> at room temperature. The main substance in <b>natural gas</b>, a <b>fuel</b>: it burns in oxygen and gives out energy. Comes through pipes (<b>mains gas</b>) to cookers, boilers and the lab’s Bunsen burners. Not poisonous, but <b>extremely flammable</b>.',atoms:[['C',0,0],['H',0,-66],['H',66,0],['H',0,66],['H',-66,0]],bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
    {n:'Oxygen O₂',ghs:['oxid','cyl'],info:'A <b>gas</b>, about <b>one fifth of the air</b>. We need it to breathe, and fuels need it to burn. Stored in <b>gas cylinders</b> in labs and hospitals. Not poisonous, but pure oxygen makes things burn <b>much more fiercely</b> (<b>oxidising</b>).',atoms:[['O',-40,0],['O',40,0]],bonds:[[0,1,2]]},
    {n:'Carbon dioxide CO₂',ghs:['cyl'],info:'A <b>gas</b>. Made when fuels such as methane burn, and we <b>breathe it out</b>. Stored in <b>gas cylinders</b>, e.g. for fizzy drinks and some fire extinguishers. It <b>does not burn</b>.',atoms:[['O',-80,0],['C',0,0],['O',80,0]],bonds:[[0,1,2],[1,2,2]]},
    {n:'Water H₂O',ghs:[],info:'A <b>liquid</b> at room temperature. Also made when methane burns. <b>No hazard symbol</b> (but hot water and steam can scald).',atoms:[['O',0,-16],['H',-58,28],['H',58,28]],bonds:[[0,1,1],[0,2,1]]}];
  /* snap / form burst: an expanding ring and a floating +energy number, drawn on an overlay svg */
  function burst(stage,vb,x,y,col,txt){ let o=stage.querySelector('svg.fx'); if(!o){ o=document.createElementNS('http://www.w3.org/2000/svg','svg'); o.setAttribute('class','fx'); o.setAttribute('viewBox',vb); stage.appendChild(o); }
    const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('transform',`translate(${x},${y})`);
    g.innerHTML=`<circle class="fxring" r="26" fill="none" stroke="${col}" stroke-width="3"/><text class="fxnum" text-anchor="middle" font-size="17" font-weight="700" fill="${col}">${txt}</text>`;
    o.appendChild(g); setTimeout(()=>g.remove(),1300); }
  function pullApart(el,U){
    const BL='#0284c7', CX=260, CY=185; let M, A, B, total=0, broke=[];
    el.innerHTML=`<div class="ch" id="px" style="margin-bottom:12px"></div><div class="sim"><div class="ctl">
        <p style="margin-top:0">Atoms in a molecule are held together by <b>chemical bonds</b>. In a diagram each bond is drawn as a <b>line</b>.</p>
        <div class="bkey"><div><svg viewBox="0 0 80 24"><line x1="14" y1="12" x2="66" y2="12" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="12" r="9" fill="#1f8a4c"/><circle cx="68" cy="12" r="9" fill="#fff" stroke="${INK}"/></svg><span>one line = <b>single bond</b><br><span class="hint">e.g. C–H</span></span></div>
          <div><svg viewBox="0 0 80 24"><line x1="14" y1="8" x2="66" y2="8" stroke="${INK}" stroke-width="3"/><line x1="14" y1="16" x2="66" y2="16" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="12" r="9" fill="#dc4a3d"/><circle cx="68" cy="12" r="9" fill="#dc4a3d"/></svg><span>two lines = <b>double bond</b><br><span class="hint">e.g. O=O</span></span></div></div>
        <div class="subst" id="psub"></div><div id="pcalc" hidden></div><button class="btn ghost small" id="preset" style="margin-top:10px">Put it back together</button></div>
      <div class="stage"><svg viewBox="0 0 520 350" id="psvg" aria-label="Molecule to pull apart"></svg></div></div>`;
    const $=s=>el.querySelector(s), svg=$('#psvg');
    const GHS={flame:['Flammable','<path d="M24 34c-5 0-8-3-8-7 0-5 5-7 4-13 4 2 6 6 5 10 1-1 2-2 2-4 3 3 5 6 5 8 0 4-3 6-8 6z"/>'],
      oxid:['Oxidising','<path d="M24 27c-3 0-5-2-5-4 0-3 3-5 2-9 3 1 5 4 4 7 1-1 1-1 1-3 2 2 3 4 3 5 0 3-2 4-5 4z"/><circle cx="24" cy="31" r="5" fill="none" stroke="#1d1b16" stroke-width="2.4"/><path d="M15 37h18" stroke="#1d1b16" stroke-width="2"/>'],
      cyl:['Gas under pressure','<rect x="13" y="20" width="22" height="10" rx="5" transform="rotate(-30 24 25)"/><path d="M32 15l4-3" stroke="#1d1b16" stroke-width="2.5"/>']};
    const ghsSvg=k=>`<span class="ghs"><svg viewBox="0 0 48 48"><rect x="10" y="10" width="28" height="28" transform="rotate(45 24 24)" fill="#fff" stroke="#c81e1e" stroke-width="3"/><g fill="${INK}">${GHS[k][1]}</g></svg><span>${GHS[k][0]}</span></span>`;
    function draw(){
      svg.querySelector('#pb').innerHTML=B.map(b=>{ if(b.broken) return ''; const p=A[b.i], q=A[b.j]; const f=Math.min(1,(b.s||0)/b.T);
        return bondSvg([p.x,p.y],[q.x,q.y],b.o,f>.05?BL:INK,4-2*f,5); }).join('');
      const pb=B.find(b=>!b.broken&&b.s>2), ng=svg.querySelector('#pnote');
      if(pb){ clearTimeout(ng._t); ng._t=0; ng.innerHTML=`<rect x="12" y="38" width="404" height="44" fill="#fff" stroke="${BL}" stroke-dasharray="4 3"/><text x="22" y="56" font-size="14" font-weight="700" fill="${BL}">Pulling a ${pb.k} ${pb.o===2?'double':'single'} bond</text><text x="22" y="74" font-size="13" fill="${INK}">Energy needed to break it: ${pb.e} kJ/mol</text><rect x="300" y="64" width="100" height="10" fill="#fff" stroke="${BL}"/><rect x="300" y="64" width="${100*Math.min(1,pb.s/pb.T)}" height="10" fill="${BL}"/>`; }
      else if(!ng._t) ng.innerHTML='';
      svg.querySelector('#ptot').innerHTML=broke.length?`Energy taken in: ${broke.map(b=>b.e).join(' + ')} = <tspan font-weight="700">${total} kJ/mol</tspan>`:'Pull an outside atom away from the molecule';
      A.forEach(a=>{ a.el.setAttribute('transform',`translate(${a.x},${a.y})`); const r=a.el.querySelector('.ring'); if(r) r.style.display=a.free?'none':''; });
    }
    function build(){
      svg.innerHTML=`<text x="16" y="26" font-size="15" font-weight="700">${M.n}</text><g id="pcue"></g><g id="pnote"></g><text id="ptot" x="16" y="340" font-size="14" fill="${BL}"></text><g id="pb"></g><g id="pa"></g>`;
      A.forEach((a,k)=>{ const g=document.createElementNS('http://www.w3.org/2000/svg','g'); g.innerHTML=(a.drag?`<circle r="27" fill="none" stroke="var(--accent)" stroke-dasharray="3 4" stroke-width="1.5" class="ring"/>`:'')+`<g class="wigw">${atomSvg(a.a,19)}</g>`;
        if(a.drag) g.classList.add('patom'); g.dataset.k=k; svg.querySelector('#pa').appendChild(g); a.el=g; if(!a.drag) return;
        let b0; const other=b=>A[b.i===k?b.j:b.i];
        K.svgDrag(g,svg,{start(){ cueOff(); b0=B.find(b=>!b.broken&&(b.i===k||b.j===k)); },
          move(x,y){ a.x=Math.max(20,Math.min(500,x)); a.y=Math.max(100,Math.min(312,y)); if(b0){ const o=other(b0);
            b0.s=Math.max(0,Math.hypot(a.x-o.x,a.y-o.y)-b0.L);
            if(b0.s>=b0.T){ b0.broken=true; total+=b0.e; broke.push(b0); a.free=!B.some(b=>!b.broken&&(b.i===k||b.j===k)); burst(svg.parentNode,'0 0 520 350',(a.x+other(b0).x)/2,(a.y+other(b0).y)/2,BL,'+'+b0.e+' in'); b0=null; calc(true); note(); } }
            redraw(); },
          end(){ if(b0&&!b0.broken){ const bb=b0, o=other(bb), ux=a.x-o.x, uy=a.y-o.y, L=Math.hypot(ux,uy)||1, fx=a.x, fy=a.y, tx=o.x+ux/L*bb.L, ty=o.y+uy/L*bb.L;
              if(bb.s>4) setTimeout(()=>{ const g=svg.querySelector('#pnote'); g.innerHTML=`<rect x="12" y="38" width="404" height="44" fill="#fff" stroke="${MUTED}" stroke-dasharray="4 3"/><text x="22" y="56" font-size="14" font-weight="700">Not enough energy</text><text x="22" y="74" font-size="13">The bond pulled the atom back. Pull further.</text>`; clearTimeout(g._t); g._t=setTimeout(()=>{ g._t=0; g.innerHTML=''; },2500); },320);
              tween(300,e=>{ a.x=fx+(tx-fx)*e; a.y=fy+(ty-fy)*e; bb.s=Math.max(0,Math.hypot(a.x-o.x,a.y-o.y)-bb.L); redraw(); },()=>{ bb.s=0; redraw(); }); } } }); });
      // moving start cue on the right-most outside atom
      const ci=A.reduce((m,a,i)=>a.drag&&(m<0||a.x>A[m].x)?i:m,-1), ca=A[ci], ux0=ca.x-CX, uy0=ca.y-CY, L0=Math.hypot(ux0,uy0)||1, ux=ux0/L0, uy=uy0/L0;
      const w=ca.el.querySelector('.wigw'); w.classList.add('wig'); w.style.setProperty('--dx',(ux*12)+'px'); w.style.setProperty('--dy',(uy*12)+'px');
      svg.querySelector('#pcue').innerHTML=`<g class="cuefade">${K.arrow(ca.x+ux*32,ca.y+uy*32,ca.x+ux*82,ca.y+uy*82,'var(--accent)',3,9)}<text x="${ca.x+ux*90}" y="${ca.y+uy*90+5}" text-anchor="start" font-size="14" font-weight="700" fill="var(--accent)">pull me away</text></g>`;
      draw();
    }
    function cueOff(){ svg.querySelector('#pcue').innerHTML=''; svg.querySelectorAll('.wig').forEach(w=>w.classList.remove('wig')); }
    function note(){ const b=broke[broke.length-1], g=svg.querySelector('#pnote');
      g.innerHTML=`<g class="fadein"><rect x="12" y="38" width="404" height="44" fill="#e0f2fe" stroke="${BL}"/><text x="22" y="56" font-size="14" font-weight="700" fill="${BL}">Snap! ${b.k} bond broken</text><text x="22" y="74" font-size="13" fill="${INK}">${b.o===2?'double bond (two lines)':'single bond (one line)'}: ${b.e} kJ/mol taken in</text></g>`;
      clearTimeout(g._t); g._t=setTimeout(()=>{ g._t=0; g.innerHTML=''; },3500); }
    let raf=0; const redraw=()=>{ if(raf) return; raf=requestAnimationFrame(()=>{ raf=0; draw(); }); };
    function calc(snap){ const last=broke[broke.length-1];
      $('#pcalc').innerHTML=(last?`${snap?'Snap! ':''}You broke a <b>${last.k}</b> bond (${last.o===2?'double bond: two lines':'single bond: one line'}). It took <b style="color:${BL}">${last.e} kJ/mol</b> in.<br>`:'Bonds broken: none yet.<br>')+
        `Energy taken in so far: <b style="color:${BL}">${broke.length?broke.map(b=>b.e).join(' + ')+' = ':''}${total} kJ/mol</b>`+
        (broke.length&&broke.length===B.length?`<br><b>All bonds broken.</b> Now the atoms are separate.`:''); }
    function setup(k){ M=MOLS[k]; total=0; broke=[]; $('#psub').innerHTML=`<p><b>${M.n}</b>: ${M.info}</p><div class="ghsrow">${M.ghs.length?M.ghs.map(ghsSvg).join(''):'<span class="hint">No hazard symbol</span>'}</div>`;
      A=M.atoms.map(([a,x,y])=>({a,x:CX+x,y:CY+y}));
      B=M.bonds.map(([i,j,o])=>{ const k2=bname(A[i].a,A[j].a,o), e=BE[k2]; return {i,j,o,k:k2,e,L:Math.hypot(A[i].x-A[j].x,A[i].y-A[j].y),T:e/6,s:0}; });
      const deg=A.map((_,i)=>B.filter(b=>b.i===i||b.j===i).length), mx=Math.max(...deg);
      A.forEach((a,i)=>a.drag=deg[i]<mx||A.length===2); build(); calc(false); }
    $('#preset').onclick=()=>setup(MOLS.indexOf(M));
    K.choices($('#px'),MOLS.map(m=>m.n),setup,0);
  }

  /* ---------------- 6.4.3 Burning methane on the energy diagram (class notes example) ---------------- */
  function methane(el,U){
    const S=.085, TOP=100, IN=2640, OUT=3458, yR=TOP+IN*S, yP=TOP+OUT*S, BL='#0284c7', PU='#7c3aed';
    // atoms: 0 C, 1-4 H, 5-8 O
    const KIND=['C','H','H','H','H','O','O','O','O'];
    const POS={
      R:[[100,yR-50],[100,yR-86],[136,yR-50],[100,yR-14],[64,yR-50],[168,yR-70],[212,yR-70],[168,yR-26],[212,yR-26]],
      T:[[268,TOP-48],[298,TOP-48],[326,TOP-48],[354,TOP-48],[382,TOP-48],[282,TOP-18],[312,TOP-18],[342,TOP-18],[372,TOP-18]],
      Q:[[300,TOP-84],[272,TOP+30],[328,TOP+30],[362,TOP+30],[418,TOP+30],[256,TOP-84],[344,TOP-84],[300,TOP+12],[390,TOP+12]],
      P:[[544,yP-70],[486,yP-12],[534,yP-12],[576,yP-12],[624,yP-12],[500,yP-70],[588,yP-70],[510,yP-30],[600,yP-30]]};
    const RB=[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[5,6,2],[7,8,2]].map(([i,j,o])=>({i,j,o,k:bname(KIND[i],KIND[j],o)}));
    const PB=[[0,5,2],[0,6,2],[7,1,1],[7,2,1],[8,3,1],[8,4,1]].map(([i,j,o])=>({i,j,o,k:bname(KIND[i],KIND[j],o)}));
    let c=0; RB.forEach(b=>{ c+=BE[b.k]; b.cum=c; }); c=0; PB.forEach(b=>{ c+=BE[b.k]; b.cum=c; });
    let step, t1, t2, pos, nIn=0, nOut=0, cmp=0;
    el.innerHTML=`<div class="sim bond-sim"><div class="ctl">
        <ol class="steps-list" id="msteps" style="margin-top:0"><li><span>Break the bonds <span class="hint">energy in</span></span></li><li><span>Make new bonds <span class="hint">energy out</span></span></li><li><span>Compare</span></li></ol>
        <p id="mtxt" style="margin-top:10px;font-weight:700"></p><div id="mq"></div>
        <div class="row" style="margin-top:10px"><button class="btn" id="mnext" style="display:none"></button><button class="btn ghost small" id="mreset">Start again</button></div></div>
      <div class="stage"><svg viewBox="0 0 680 440" id="msvg" aria-label="Energy in chemicals as methane burns"></svg></div></div>`;
    const $=s=>el.querySelector(s), svg=$('#msvg');
    const lerp=(A,B2,t)=>A.map((p,i)=>[p[0]+(B2[i][0]-p[0])*t,p[1]+(B2[i][1]-p[1])*t]);
    const level=(x1,x2,y,l)=>`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${INK}" stroke-width="4"/><text x="${(x1+x2)/2}" y="${y+18}" text-anchor="middle" font-size="12" fill="${MUTED}">${l}</text>`;
    function draw(){
      const bIn=RB.filter(b=>t1*IN>=b.cum-1), bOut=PB.filter(b=>t2*OUT>=b.cum-1);
      if(bIn.length>nIn){ const b=bIn[bIn.length-1]; burst(svg.parentNode,'0 0 680 440',200,yR-(yR-TOP)*t1+52,BL,'+'+BE[b.k]); } nIn=bIn.length;
      if(bOut.length>nOut){ const b=bOut[bOut.length-1]; burst(svg.parentNode,'0 0 680 440',500,TOP+(yP-TOP)*t2+48,RED,'+'+BE[b.k]); } nOut=bOut.length;
      const eIn=bIn.length?bIn[bIn.length-1].cum:0, eOut=bOut.length?bOut[bOut.length-1].cum:0;
      let h=`<line x1="40" y1="415" x2="40" y2="14" stroke="${INK}" stroke-width="2" marker-end="url(#mah)"/><line x1="40" y1="415" x2="672" y2="415" stroke="${INK}" stroke-width="2" marker-end="url(#mah)"/>
        <text x="22" y="220" transform="rotate(-90 22 220)" text-anchor="middle" font-size="14" fill="${MUTED}">energy in chemicals</text>
        <text x="360" y="434" text-anchor="middle" font-size="12" fill="${MUTED}">progress of reaction</text>
        <text x="56" y="24" font-size="14" fill="${INK}">methane + oxygen → carbon dioxide + water</text>`+level(60,225,yR,'methane + oxygen');
      const n=(arr,k)=>arr.filter(b=>b.k===k).length, T2=(x,y,t,o)=>`<text x="${x}" y="${y}" font-size="${o&&o.b?14:12.5}" ${o&&o.b?'font-weight="700"':''} ${o&&o.end?'text-anchor="end"':''} fill="${o&&o.c||INK}">${t}</text>`;
      const inLines=(x,y,end)=>T2(x,y,`C–H: 412 × ${n(bIn,'C–H')} = ${412*n(bIn,'C–H')}`,{c:BL,end})+T2(x,y+17,`O=O: 496 × ${n(bIn,'O=O')} = ${496*n(bIn,'O=O')}`,{c:BL,end})+T2(x,y+36,`energy in = ${eIn} kJ/mol`,{c:BL,b:1,end});
      const outLines=(x,y,end)=>T2(x,y,`C=O: 803 × ${n(bOut,'C=O')} = ${803*n(bOut,'C=O')}`,{c:RED,end})+T2(x,y+17,`O–H: 463 × ${n(bOut,'O–H')} = ${463*n(bOut,'O–H')}`,{c:RED,end})+T2(x,y+36,`energy out = ${eOut} kJ/mol`,{c:RED,b:1,end});
      if(t1>0) h+=K.arrow(232,yR,232,yR-(yR-TOP)*t1,BL,4,11);
      if(t1>=1) h+=level(232,458,TOP,step===0?'separate atoms':'')+(step===0?inLines(244,TOP+40):inLines(222,TOP+30,1));
      else if(t1>0) h+=inLines(244,yR-(yR-TOP)*t1+20);
      if(t2>0&&t2<1){ const ty=TOP+(yP-TOP)*t2; h+=K.arrow(458,TOP,458,ty,RED,4,11)+outLines(468,ty-52); }
      if(t2>=1) h+=K.arrow(458,TOP,458,yP,RED,4,11)+level(458,650,yP,'carbon dioxide + water')+outLines(450,TOP+150,1);
      if(step===0&&!t1) h+=T2(262,yR-110,'Bonds must break before new bonds are made.',{c:MUTED});
      if(step===2&&cmp>0) h+=T2(250,52,`energy in (${IN}) is less than energy out (${OUT})`,{b:1})+(cmp>1?T2(250,72,`so the reaction is EXOTHERMIC: ${OUT-IN} kJ/mol given out`,{b:1,c:PU})+`<text x="657" y="${(yR+yP)/2-2}" font-size="12" font-weight="700" fill="${PU}">${OUT-IN}</text><text x="657" y="${(yR+yP)/2+12}" font-size="12" font-weight="700" fill="${PU}">out</text>`:'');
      if(step===2) h+=`<line x1="225" y1="${yR}" x2="470" y2="${yR}" stroke="${MUTED}" stroke-dasharray="5 4" stroke-width="1.5"/><line x1="612" y1="${yR}" x2="660" y2="${yR}" stroke="${MUTED}" stroke-dasharray="5 4" stroke-width="1.5"/>${K.arrow(652,yR+2,652,yP-2,PU,3,9)}`;
      // bonds
      const bs=[...RB.filter(b=>!bIn.includes(b)),...bOut];
      h+=bs.map(b=>bondSvg(pos[b.i],pos[b.j],b.o,INK,3,3.5)).join('');
      // drag handle around the atoms being moved
      if(step<2&&!(step===0&&t1>=1)&&!(step===1&&t2>=1)){ const xs=pos.map(p=>p[0]), ys=pos.map(p=>p[1]), x1=Math.min(...xs)-20, y1=Math.min(...ys)-20, w=Math.max(...xs)+20-x1, hh=Math.max(...ys)+20-y1;
        h+=`<g id="mgrab" class="grab ${step===0&&!t1||step===1&&!t2?'bob':''}"><rect x="${x1}" y="${y1}" width="${w}" height="${hh}" fill="rgba(5,150,105,.06)" stroke="var(--accent)" stroke-dasharray="6 4" stroke-width="2"/>
          <text x="${step===0?x1:x1+w/2+14}" y="${step===0?y1-8:y1+hh+34}" text-anchor="start" font-size="13" font-weight="700" fill="var(--accent)">${step===0?'drag up to break the bonds':'drag down to make new bonds'}</text>`+((step===0?!t1:!t2)?(step===0?K.arrow(x1+w+16,y1+hh-4,x1+w+16,y1-6,'var(--accent)',4,11):K.arrow(x1+w/2,y1+hh+6,x1+w/2,y1+hh+52,'var(--accent)',4,11)):'')+`</g>`; }
      h+=pos.map((p,i)=>`<g transform="translate(${p[0]},${p[1]})" pointer-events="none">${atomSvg(KIND[i],KIND[i]==='H'?10:13)}</g>`).join('');
      svg.innerHTML=`<defs><marker id="mah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>`+h;
      calc(bIn,bOut);
    }
    function calc(bIn,bOut){ const n=(arr,k)=>arr.filter(b=>b.k===k).length;
      let h=`<span style="color:${BL}">Energy in (break bonds):<br>C–H 412 × ${n(bIn,'C–H')} = ${412*n(bIn,'C–H')}<br>O=O 496 × ${n(bIn,'O=O')} = ${496*n(bIn,'O=O')}<br>Total in = <b>${412*n(bIn,'C–H')+496*n(bIn,'O=O')} kJ/mol</b></span>`;
      if(step>=1) h+=`<br><span style="color:${RED}">Energy out (make bonds):<br>C=O 803 × ${n(bOut,'C=O')} = ${803*n(bOut,'C=O')}<br>O–H 463 × ${n(bOut,'O–H')} = ${463*n(bOut,'O–H')}<br>Total out = <b>${803*n(bOut,'C=O')+463*n(bOut,'O–H')} kJ/mol</b></span>`;
      }
    let drag=null;
    svg.addEventListener('pointerdown',e=>{ const g=e.target.closest('#mgrab'); if(!g) return; e.preventDefault(); svg.setPointerCapture(e.pointerId);
      const p=K.pt(svg,e); drag={y0:p.y,t0:step===0?t1:t2}; });
    svg.addEventListener('pointermove',e=>{ if(!drag) return; const y=K.pt(svg,e).y;
      if(step===0){ t1=Math.max(t1,Math.min(1,drag.t0+(drag.y0-y)/(yR-TOP))); if(t1>.97) t1=1; const dy=(TOP-yR)*t1, gone=RB.filter(x=>t1*IN>=x.cum-1);
        pos=POS.R.map((r,i)=>{ const mine=RB.filter(x=>x.i===i||x.j===i), k=mine.every(x=>gone.includes(x))?1:0, T=POS.T[i]; return [r[0]+(T[0]-r[0])*k, r[1]+dy+(T[1]-r[1]-(TOP-yR))*k]; }); }
      else { t2=Math.max(t2,Math.min(1,drag.t0+(y-drag.y0)/(yP-TOP))); if(t2>.97) t2=1; const dy=(yP-TOP)*t2, made=PB.filter(x=>t2*OUT>=x.cum-1);
        pos=POS.T.map((T,i)=>{ const mine=PB.filter(x=>x.i===i||x.j===i), k=mine.some(x=>made.includes(x))?1:0, Q=POS.Q[i]; return [T[0]+(Q[0]-T[0])*k, T[1]+(Q[1]-T[1])*k+dy]; }); }
      draw(); if(step===0&&t1>=1){ drag=null; brokeAll(); } else if(step===1&&t2>=1){ drag=null; const from=pos.map(q=>[...q]); tween(600,e=>{ pos=lerp(from,POS.P,e); draw(); },madeAll); } });
    const stop=()=>{ drag=null; }; svg.addEventListener('pointerup',stop); svg.addEventListener('pointercancel',stop);
    function setStep(s){ step=s; el.querySelectorAll('#msteps li').forEach((li,i)=>{ li.classList.toggle('on',i===s); li.classList.toggle('done',i<s); }); $('#mnext').style.display='none'; }
    function setup(){ t1=0; t2=0; nIn=0; nOut=0; cmp=0; pos=POS.R.map(p=>[...p]); setStep(0); $('#mq').innerHTML='';
      $('#mtxt').innerHTML='Step 1: break the bonds'; draw(); }
    function brokeAll(){ $('#mtxt').innerHTML='All bonds broken';
      setTimeout(()=>{ if(step!==0||t1<1) return; setStep(1); $('#mtxt').innerHTML='Step 2: make new bonds'; draw(); },900); }
    function madeAll(){ $('#mtxt').innerHTML='All new bonds made';
      $('#mnext').textContent='Next: compare →'; $('#mnext').style.display=''; $('#mnext').onclick=compare; }
    function compare(){ setStep(2); draw(); $('#mtxt').innerHTML='Step 3: compare';
      ask(`Energy taken to break the bonds (<b>${IN}</b>) is ____ the energy given out making the bonds (<b>${OUT}</b>).`,['more than','less than'],1,`Which is smaller, ${IN} or ${OUT}?`,()=>{ cmp=1; draw();
      ask('So the reaction is…',['endothermic','exothermic'],1,'More energy comes out than goes in.',()=>{ cmp=2; draw(); }); }); }
    function ask(q,opts,right,hint,next){ const box=U.h('div',{},`<p style="margin:10px 0 6px">${q}</p><div class="ch"></div>`); $('#mq').appendChild(box);
      const bs=opts.map((o,i)=>{ const b=U.h('button',{type:'button'},o); b.onclick=()=>{ if(box.dataset.done) return;
        if(i===right){ box.dataset.done=1; b.classList.add('on'); bs.forEach(x=>x.disabled=x!==b); next(); } else { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); U.toast(hint); } };
        box.querySelector('.ch').appendChild(b); return b; }); }
    $('#mreset').onclick=setup; setup();
  }

  return {thermo,levelBuilder,fuels,bonds,pullApart,methane};
})();
