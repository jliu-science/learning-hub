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
    {n:'Burning methane',r:'methane + oxygen',p:'carbon dioxide + water',type:'exo',why:'Combustion gives out energy (heat and light) to the surroundings.'},
    {n:'Melting ice',r:'ice',p:'liquid water',type:'endo',why:'Melting takes in energy from the surroundings to break up the pattern of water molecules.'},
    {n:'Freezing water',r:'liquid water',p:'ice',type:'exo',why:'Water gives out energy to the surroundings as it freezes.'},
    {n:'Cold pack',r:'ammonium nitrate + water',p:'solution',type:'endo',why:'Dissolving ammonium nitrate takes in energy, so the pack feels cold.'},
    {n:'Burning hydrogen',r:'hydrogen + oxygen',p:'water',type:'exo',why:'Burning 1 kg of hydrogen gives out 142 MJ to the surroundings.'},
    {n:'Boiling water',r:'liquid water',p:'steam',type:'endo',why:'Boiling takes in energy from the surroundings.'},
    {n:'Condensing steam',r:'steam',p:'liquid water',type:'exo',why:'Condensing gives out energy to the surroundings.'}
  ];
  function levelBuilder(el,U){
    let list=U.shuffle(CHANGES), i=0, py=150, done=false, score=0;
    el.innerHTML=`<div class="sim">
      <div class="ctl"><h4 id="lb-n"></h4><p id="lb-q" style="font-size:1.02rem"></p>
        <ol class="lb-how"><li>Decide: does this change <b>give out</b> energy (exothermic) or <b>take in</b> energy (endothermic)?</li><li>On the diagram, press and hold the purple <b id="lb-pn">products</b> line and drag it <b>up</b> (more energy) or <b>down</b> (less energy).</li><li>Press <b>Check</b>.</li></ol>
        <div class="row"><button class="btn" id="lb-c">Check</button><button class="btn ghost small" id="lb-x" style="display:none">Next change →</button></div>
        <div class="fb" id="lb-fb"></div></div>
      <div class="stage"><svg viewBox="0 0 460 290" id="lsvg" aria-label="Energy level diagram">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${INK}"/></marker></defs>
        <line x1="50" y1="268" x2="50" y2="18" stroke="${INK}" stroke-width="2" marker-end="url(#ah)"/>
        <line x1="50" y1="268" x2="445" y2="268" stroke="${INK}" stroke-width="2" marker-end="url(#ah)"/>
        <text x="20" y="150" transform="rotate(-90 20 150)" text-anchor="middle" font-size="14" fill="${MUTED}">energy</text><text x="58" y="34" font-size="11" fill="${MUTED}">more energy</text><text x="58" y="258" font-size="11" fill="${MUTED}">less energy</text>
        <text x="250" y="287" text-anchor="middle" font-size="13" fill="${MUTED}">progress of reaction</text>
        <line x1="75" y1="150" x2="200" y2="150" stroke="${INK}" stroke-width="5"/>
        <text x="137" y="140" text-anchor="middle" font-size="13" id="lr"></text>
        <line id="ldash" x1="200" y1="150" x2="290" y2="150" stroke="${LINE}" stroke-dasharray="5 4" stroke-width="2"/>
        <g id="larr"></g>
        <g id="lp" class="handle"><rect x="282" y="132" width="140" height="36" fill="transparent"/><line id="lpl" x1="290" y1="150" x2="415" y2="150" stroke="#7c3aed" stroke-width="6"/><text id="lhint" x="352" y="186" text-anchor="middle" font-size="12" fill="#7c3aed">drag me up or down</text>
          <path id="lgrip" d="M346 141 L352 135 L358 141 M346 159 L352 165 L358 159" stroke="#7c3aed" fill="none" stroke-width="2.5"/></g>
        <text x="352" y="130" text-anchor="middle" font-size="13" id="lpt"></text>
      </svg></div></div>`;
    const $=s=>el.querySelector(s); const svg=$('#lsvg');
    const draw=()=>{ $('#lpl').setAttribute('y1',py); $('#lpl').setAttribute('y2',py); $('#lp rect').setAttribute('y',py-18); $('#lhint').setAttribute('y',py+36);
      $('#lgrip').setAttribute('d',`M346 ${py-9} L352 ${py-15} L358 ${py-9} M346 ${py+9} L352 ${py+15} L358 ${py+9}`);
      $('#ldash').setAttribute('x2',290); $('#ldash').setAttribute('y2',py); $('#lpt').setAttribute('y',py-20);
      const d=py-150; $('#larr').innerHTML=Math.abs(d)<12?'':K.arrow(245,150,245,py,d>0?RED:BLUE,4,12)+
        `<text x="${d>0?236:236}" y="${150+d/2+4}" text-anchor="end" font-size="12" fill="${d>0?RED:BLUE}">${d>0?'energy given out':'energy taken in'}</text>`; };
    K.svgDrag($('#lp'),svg,{move:(x,y)=>{ if(done) return; $('#lp').classList.remove('bob'); $('#lhint').style.display='none'; py=Math.max(40,Math.min(250,y)); draw(); $('#lb-fb').className='fb'; }});
    function show(){
      if(i>=list.length){ $('#lb-n').textContent='All done'; $('#lb-q').innerHTML=`You drew <b>${score}</b> of ${list.length} diagrams right first time.`; $('#lb-c').style.display='none'; $('#lb-x').style.display=''; $('#lb-x').textContent='Start again'; return; }
      const c=list[i]; done=false; py=150; $('#lb-n').textContent=`Change ${i+1} of ${list.length}`;
      $('#lb-q').innerHTML=`<b>${c.n}</b><br>${c.r} → ${c.p}`; $('#lr').textContent=c.r; $('#lpt').textContent=c.p; $('#lb-pn').textContent=c.p; $('#lp').classList.add('bob'); $('#lhint').style.display='';
      $('#lb-c').style.display=''; $('#lb-x').style.display='none'; $('#lb-fb').className='fb'; draw(); c.tries=0;
    }
    $('#lb-c').onclick=()=>{ const c=list[i]; const d=py-150;
      if(Math.abs(d)<20){ $('#lb-fb').className='fb show bad'; $('#lb-fb').innerHTML='Move the products line up or down first.'; return; }
      const ok=(c.type==='exo')===(d>0);
      if(ok){ if(!c.tries) score++; done=true; $('#lb-fb').className='fb show good';
        $('#lb-fb').innerHTML=`<b>Correct.</b> ${c.type==='exo'?'<b>Exothermic</b>: the products store <b>less</b> energy than the reactants, so the arrow points <b>down</b>.':'<b>Endothermic</b>: the products store <b>more</b> energy than the reactants, so the arrow points <b>up</b>.'} ${c.why}`;
        $('#lb-c').style.display='none'; $('#lb-x').style.display=''; $('#lb-x').textContent=i===list.length-1?'Finish':'Next change →'; }
      else { c.tries++; $('#lb-fb').className='fb show bad'; $('#lb-fb').innerHTML=`Not quite. Is <b>${c.n.toLowerCase()}</b> exothermic or endothermic? ${c.type==='exo'?'Think: does it give out energy to the surroundings?':'Think: does it take in energy from the surroundings?'}`; }
    };
    $('#lb-x').onclick=()=>{ if(i>=list.length){ list=U.shuffle(CHANGES); i=0; score=0; } else i++; show(); };
    show();
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
      $('#btxt').innerHTML=`First the bonds in the reactants break. <b style="color:${BL}">Breaking bonds takes IN energy.</b><br><b>How:</b> press and hold a number in the table (e.g. <b>436</b>), drag it onto the <b>?</b> box above the matching molecule in the diagram, then let go. Fill both <b>?</b> boxes.`;
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
      $('#btxt').innerHTML=`Now the atoms join up in a new way to make 2H${R.X}. <b style="color:${RED}">Making bonds gives OUT energy.</b><br>2H${R.X} means two molecules, so there are <b>two</b> H–${R.X} bonds to make.<br><b>How:</b> drag <b>${R.hx}</b> (H–${R.X}) from the table onto <b>each</b> of the two <b>?</b> boxes.`; }
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

  return {thermo,levelBuilder,fuels,bonds};
})();
