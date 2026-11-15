/* ===== 8.4.5 Explore: enzyme workbench, bile + lipase, where nutrients are digested (all facts from textbook pp.140-141) ===== */
(function(){
  const W = window.DigestionWidgets;
  const sleep = ms => new Promise(r=>setTimeout(r,ms));
  const PROT = ['#3f8f4f','#e58a2e','#8e4fa8','#4a7fc9','#d4588b','#d9533c'];   // colours as in the book diagram

  /* ---------- molecules drawn in the style of the textbook diagrams ---------- */
  const hex = (cx,cy,r,fill) => `<polygon points="${Array.from({length:6},(_,i)=>{const a=Math.PI/180*(60*i);return (cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1);}).join(' ')}" fill="${fill}" stroke="#2d5a34" stroke-width="2"/>`;
  const MOL = {
    carb:{ name:'Carbohydrate (starch)', enz:'carbohydrase', prod:'sugar molecules',
      where:'Mouth (carbohydrase in saliva), stomach and small intestine',
      svg(){ let s=''; for(let i=0;i<8;i++){ const x=48+i*29; s+=`<g class="pc" data-dx="${(i-3.5)*14}" data-dy="${(i%2?-1:1)*(18+i*3)}" data-r="${i*25}">${hex(x,70,16,'#5f9e5a')}</g>`; }
        for(let i=0;i<7;i++) s+=`<circle class="cut" cx="${62+i*29}" cy="70" r="5" fill="#1f2a44"/>`; return s; } },
    prot:{ name:'Protein', enz:'protease', prod:'amino acids',
      where:'Stomach and small intestine. Acid in the stomach helps digestion and kills harmful microorganisms.',
      svg(){ let s=''; PROT.forEach((c,i)=>{ const x=50+i*36; s+=`<g class="pc" data-dx="${(i-2.5)*16}" data-dy="${(i%2?-1:1)*(22+i*2)}" data-r="${(i-3)*12}"><rect x="${x}" y="52" width="36" height="36" fill="${c}" stroke="#333" stroke-width="1.5"/></g>`; });
        for(let i=0;i<5;i++) s+=`<circle class="cut" cx="${86+i*36}" cy="${i%2?92:48}" r="6" fill="#1f2a44"/>`; return s; } },
    lipid:{ name:'Lipid', enz:'lipase', prod:'fatty acids and glycerol',
      where:'Small intestine, helped by bile (made in the liver)',
      svg(){ let s=`<g class="pc" data-dx="-40" data-dy="0" data-r="-8"><rect x="70" y="24" width="16" height="92" fill="#e8c840" stroke="#7a6a1a" stroke-width="1.5"/></g>`;
        [30,62,94].forEach((y,i)=> s+=`<g class="pc" data-dx="${30+i*10}" data-dy="${(i-1)*24}" data-r="${(i-1)*18}"><rect x="90" y="${y}" width="150" height="14" fill="#5f9e5a" stroke="#2d5a34" stroke-width="1.5"/></g>`);
        [37,69,101].forEach(y=> s+=`<circle class="cut" cx="88" cy="${y}" r="5" fill="#1f2a44"/>`); return s; } }
  };

  /* ---------- 1. Enzyme workbench ---------- */
  W.enzymeBench = function(el,U){
    el.innerHTML = `
      <div class="eb-tray"><span class="eb-lbl">Enzymes</span>${['carbohydrase','protease','lipase'].map(z=>`<div class="eb-tag" data-z="${z}">${z}</div>`).join('')}</div>
      <div class="eb-grid">${Object.entries(MOL).map(([k,m])=>`
        <section class="eb-st" data-k="${k}">
          <header><b>${m.name}</b><span class="eb-state">large molecule</span></header>
          <svg viewBox="0 0 300 140">${m.svg()}</svg>
          <div class="eb-out"><span class="eb-drop">Drag the right enzyme here</span></div>
        </section>`).join('')}</div>
      <div class="verdict" id="eb-msg">Large molecules are too big to pass into the blood. Drag each enzyme onto the molecule it breaks down.</div>
      <div class="row" style="margin-top:10px"><button class="btn small ghost" id="eb-reset">Start again</button></div>`;
    const $=s=>el.querySelector(s), msg=$('#eb-msg'); let done=0, notedCatalyst=false;
    async function digest(st,k){
      const m=MOL[k]; st.classList.add('busy');
      st.querySelectorAll('.cut').forEach(c=>c.classList.add('show')); await sleep(700);
      st.querySelectorAll('.pc').forEach(g=>{ g.style.transform=`translate(${g.dataset.dx}px,${g.dataset.dy}px) rotate(${g.dataset.r}deg)`; });
      st.querySelectorAll('.cut').forEach(c=>c.classList.remove('show'));
      await sleep(900);
      st.classList.remove('busy'); st.classList.add('done');
      st.querySelector('.eb-state').textContent='digested';
      st.querySelector('.eb-out').innerHTML=`<p><b>${m.enz}</b> breaks it down into <b>${m.prod}</b>.</p><p class="eb-where">${m.where}</p>`;
      done++;
      if(!notedCatalyst){ notedCatalyst=true; msg.innerHTML=`Look at the tray: <b>${m.enz}</b> is still there. Enzymes are <b>biological catalysts</b>: they speed up digestion <b>without being used up</b>.`; }
      else if(done===3) msg.innerHTML='All three digested. Each enzyme is named after the type of nutrient it breaks down: <b>carbohydr</b>ase, <b>prot</b>ease, <b>lip</b>ase. The small molecules can now pass into the blood.';
      else msg.innerHTML=`Correct. ${3-done} molecule${3-done>1?'s':''} left.`;
    }
    el.querySelectorAll('.eb-tag').forEach(tag=>Engine.drag(tag,{targets:'.eb-st:not(.done):not(.busy)',onDrop(chip,st){
      const k=st.dataset.k, z=chip.dataset.z;
      if(MOL[k].enz===z){ digest(st,k); return true; }
      const right={carbohydrase:'carbohydrates',protease:'proteins',lipase:'lipids'}[z];
      msg.innerHTML=`<b>${z}</b> breaks down <b>${right}</b>, not this molecule. Each enzyme only breaks down one type of nutrient.`;
      st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake'); return false; }}));
    $('#eb-reset').onclick=()=>W.enzymeBench(el,U);
  };

  /* ---------- 2. Bile and lipase ---------- */
  /* Book p.141: lipase breaks lipids down and is helped by bile. One big drop is harder for lipase to work on, so it can work alone but bile helps. */
  W.bileLab = function(el,U){
    el.innerHTML = `
      <div class="eb-tray"><span class="eb-lbl">Add</span><div class="eb-tag bile" data-z="bile">bile</div><div class="eb-tag" data-z="lipase">lipase</div></div>
      <div class="bl-stage"><span class="bl-tag">Small intestine</span><svg viewBox="0 0 600 230" id="bl-svg"></svg></div>
      <div class="verdict" id="bl-msg">This is one large drop of lipid in the small intestine. Drag <b>bile</b> or <b>lipase</b> onto it.</div>
      <div class="row" style="margin-top:10px"><button class="btn small ghost" id="bl-reset">Start again</button></div>`;
    const $=s=>el.querySelector(s), svg=$('#bl-svg'), msg=$('#bl-msg'); let bile=false, lipase=false, done=false;
    const drops = Array.from({length:14},(_,i)=>({x:70+(i%7)*76+(i>6?36:0), y:i>6?160:72, r:20}));
    svg.innerHTML = `<circle id="bl-big" cx="300" cy="115" r="88" fill="#f2d35b" stroke="#a88a1d" stroke-width="2.5"/>
      <text id="bl-note" x="300" y="224" text-anchor="middle" font-size="15" font-weight="700" fill="#7a4a1a" font-family="Inter, Segoe UI, sans-serif"></text>`;
    const note=t=>{ svg.querySelector('#bl-note').textContent=t; };
    // fatty acids (green) and glycerol (yellow), drawn as in the enzyme workbench
    const prod=(x,y,i)=>`<g class="bl-p">
          <rect x="${x-14}" y="${y-16}" width="6" height="30" fill="#e8c840" stroke="#7a6a1a" stroke-width="1" transform="rotate(${i*23} ${x} ${y})"/>
          ${[-14,-2,10].map((o,j)=>`<rect x="${x-4+j*4}" y="${y+o}" width="26" height="5" fill="#5f9e5a" stroke="#2d5a34" stroke-width="1" transform="rotate(${i*31+j*40} ${x} ${y})"/>`).join('')}</g>`;
    async function lipaseAlone(){
      lipase=true; const big=svg.querySelector('#bl-big'); big.style.transition='r 3s'; big.setAttribute('r',80);
      note('Lipase works, but one big drop is harder to digest');
      msg.innerHTML='<b>Lipase</b> starts to break the lipid into <b>fatty acids</b> and <b>glycerol</b>, but one big drop is <b>harder</b> for lipase to work on. Now add <b>bile</b>.';
      for(const [i,ang] of [-2.6,-1.2,.9,2.6].entries()){ await sleep(700); if(bile) return;
        svg.insertAdjacentHTML('beforeend', prod(300+Math.cos(ang)*98, 115+Math.sin(ang)*88, i)); }
    }
    async function addBile(){
      bile=true; const big=svg.querySelector('#bl-big'); big.style.transition='r .6s, opacity .6s'; big.setAttribute('r',40); big.style.opacity=0;
      await sleep(300);
      svg.insertAdjacentHTML('beforeend', drops.map((d,i)=>`<g class="bl-d" style="transform:translate(${300-d.x}px,${115-d.y}px) scale(.3)"><circle cx="${d.x}" cy="${d.y}" r="${d.r}" fill="#f2d35b" stroke="#a88a1d" stroke-width="2"/></g>`).join(''));
      await sleep(30); svg.querySelectorAll('.bl-d').forEach(g=>g.style.transform='');
      note('Bile: small droplets, easier for lipase');
      msg.innerHTML='<b>Bile</b>, a substance made in the <b>liver</b>, breaks the lipids into <b>small droplets</b>. These are easier for lipase to work on.'+(lipase?'':' Now add lipase.');
      if(lipase){ await sleep(900); addLipase(); }
    }
    async function addLipase(){
      lipase=true; done=true;
      svg.querySelectorAll('.bl-d').forEach((g,i)=>{ const d=drops[i]; g.style.transition='opacity .5s'; g.style.opacity=0;
        setTimeout(()=>svg.insertAdjacentHTML('beforeend', prod(d.x,d.y,i)), 350+i*40); });
      await sleep(1100);
      note('Small droplets digested quickly');
      msg.innerHTML='<b>Lipase</b> breaks the lipids down into <b>fatty acids</b> (green) and <b>glycerol</b> (yellow). This happens in the <b>small intestine</b>. Small droplets are easier for lipase to work on, so with bile the lipid is digested more easily.';
    }
    el.querySelectorAll('.eb-tag').forEach(tag=>Engine.drag(tag,{targets:'.bl-stage',onDrop(chip){
      const z=chip.dataset.z;
      if(z==='bile'){ if(bile){ msg.innerHTML='Bile has already broken the lipid into small droplets.'+(lipase?'':' Now add lipase.'); return false; } addBile(); return true; }
      if(done){ msg.innerHTML='Already digested. Press Start again to repeat.'; return false; }
      if(lipase){ msg.innerHTML='Lipase is already working on the big drop. Add <b>bile</b> to help it.'; return false; }
      bile ? addLipase() : lipaseAlone(); return true; }}));
    $('#bl-reset').onclick=()=>W.bileLab(el,U);
  };

  /* ---------- 3. Where is it digested? Drag nutrients onto the organs ---------- */
  const ORG = [
    {k:'mouth', n:'Mouth', x:120,y:155, need:['carb'], why:'Carbohydrase in saliva breaks down starch into sugar.'},
    {k:'stomach', n:'Stomach', x:238,y:458, need:['carb','prot'], why:'Carbohydrates and proteins are digested here. Acid helps digestion and kills harmful microorganisms.'},
    {k:'small', n:'Small intestine', x:175,y:640, need:['carb','prot','lipid'], why:'Carbohydrates, proteins and lipids are all digested here. Bile helps lipase break down lipids.'},
    {k:'large', n:'Large intestine', x:274,y:580, need:[], why:'Carbohydrates, proteins and lipids are not digested here, so nothing goes in this box.'}
  ];
  const TOK = {carb:'Carbohydrate', prot:'Protein', lipid:'Lipid'};
  // Step 2 is separate: fibre is not digested, so it is never part of the digestion score.
  const FIBRE_WHY = 'Fibre is not digested. Gut bacteria in the large intestine live on the fibre in your diet. They make vitamins such as vitamin K.';
  W.digestMap = function(el,U){
    el.innerHTML = `
      <div class="eb-tray"><span class="eb-lbl">Step 1</span>${Object.entries(TOK).map(([k,n])=>`<div class="eb-tag nut" data-t="${k}">${n}</div>`).join('')}</div>
      <div class="dm">
        <div style="position:relative">
          <svg class="dm-fig" viewBox="0 0 390 847"><image href="img/digestive-system.svg" width="390" height="847"/>
            ${ORG.map((o,i)=>`<g class="dm-pin" data-k="${o.k}"><circle cx="${o.x}" cy="${o.y}" r="34" fill="transparent"/><circle class="dm-dot" cx="${o.x}" cy="${o.y}" r="17" fill="#fff" stroke="#1f2a44" stroke-width="3"/><text x="${o.x}" y="${o.y+7}" text-anchor="middle" font-size="20" font-weight="700" font-family="IBM Plex Mono, monospace" pointer-events="none">${i+1}</text></g>`).join('')}</svg>
          <div id="dm-fq" style="position:absolute;left:8px;right:8px;bottom:8px;padding:6px 10px;background:#fde68a;border:1px solid #d9b44a;font-size:.86rem;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center">
            <span><b>Step 2</b> Fibre is <b>not digested</b>. Where do gut bacteria live on it? Drag it onto a number.</span>
            <div class="eb-tag nut" data-t="fibre">Fibre</div></div>
        </div>
        <div class="dm-zones">${ORG.map((o,i)=>`<div class="dm-z" data-k="${o.k}"><h4><span>${i+1}</span>${o.n}</h4><div class="dm-in"><em>Drop the nutrients digested here</em></div><p class="dm-why"></p></div>`).join('')}
          <div class="row"><button class="btn small" id="dm-check">Check</button><button class="btn small ghost" id="dm-reset">Clear</button><span class="hint" id="dm-res"></span></div>
          <p class="hint">Tap a placed nutrient to remove it.</p>
        </div>
      </div>`;
    const $=s=>el.querySelector(s);
    let fibreOk=false;
    const fq=$('#dm-fq'), ftag=fq.querySelector('.eb-tag');
    Engine.drag(ftag,{targets:'.dm-pin',onDrop(chip,pin){
      if(pin.dataset.k!=='large'){ fq.querySelector('span').innerHTML='<b>Not there.</b> Fibre is not digested. Where do gut bacteria live on it? Try another number.'; return false; }
      fibreOk=true; ftag.classList.add('ok'); pin.querySelector('.dm-dot').setAttribute('fill','#c9ecc0');
      fq.querySelector('span').innerHTML='<b>Large intestine (4).</b> '+FIBRE_WHY; fq.style.background='#f1f8ee'; fq.style.borderColor='var(--good)'; return true; }});
    el.querySelectorAll('.eb-tray .eb-tag').forEach(tag=>Engine.drag(tag,{targets:'.dm-z',onDrop(chip,z){
      const t=chip.dataset.t, box=z.querySelector('.dm-in');
      if(box.querySelector(`[data-t="${t}"]`)) return false;
      box.querySelector('em')?.remove(); z.classList.remove('good','bad'); z.querySelector('.dm-why').textContent='';
      const c=Engine.h('span',{class:'dm-c','data-t':t},TOK[t]); c.onclick=()=>{ c.remove(); z.classList.remove('good','bad'); }; box.appendChild(c); return true; }}));
    $('#dm-check').onclick=()=>{
      let right=0;
      ORG.forEach(o=>{ const z=el.querySelector(`.dm-z[data-k="${o.k}"]`); const got=[...z.querySelectorAll('.dm-c')].map(c=>c.dataset.t).sort();
        const ok=got.join()===o.need.slice().sort().join(); z.classList.toggle('good',ok); z.classList.toggle('bad',!ok);
        z.querySelector('.dm-why').innerHTML = ok ? o.why : (got.length ? 'Not quite. Check which nutrients are digested here.' : '');
        if(ok) right++; });
      $('#dm-res').textContent = (right===4 ? 'Digestion: all four correct.' : `Digestion: ${right} of 4 correct.`)+(fibreOk ? ' Fibre: correct.' : ' Fibre: Step 2 not done yet.');
    };
    $('#dm-reset').onclick=()=>W.digestMap(el,U);
  };
})();
