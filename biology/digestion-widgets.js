/* ===== Interactive widgets for the Digestion topic ===== */
window.DigestionWidgets = (function(){
  const sleep = ms => new Promise(r=>setTimeout(r,ms));

  /* ---------------- 1. Virtual food-test lab ---------------- */
  function lab(el, U){
    const FOODS = [
      {id:'starch', e:'', name:'Starch solution', has:{starch:1}},
      {id:'glucose', e:'', name:'Glucose solution', has:{sugar:1}},
      {id:'oil', e:'', name:'Cooking oil', has:{lipid:1}},
      {id:'protein', e:'', name:'Protein solution', has:{protein:1}},
      {id:'mystery', e:'', name:'Mystery sample', has:null}
    ];
    // a new mystery each visit
    const keys=['starch','lipid','sugar','protein']; const myst={}; keys.forEach(k=>{ if(Math.random()<.5) myst[k]=1; }); if(!Object.keys(myst).length) myst.protein=1;
    FOODS[4].has=myst;
    const TESTS = [
      {id:'starch', name:'Iodine', for:'starch', start:'#e8a33a', pos:'#1d1838', posTxt:'blue-black', negTxt:'stays orange-yellow',
        steps:['Add a few drops of iodine solution (orange-yellow)…','Watch the colour…']},
      {id:'sugar', name:"Benedict's", for:'sugar', start:'#3a7bd5', pos:'#d9541e', posTxt:'orange-red', negTxt:'stays blue', heat:true,
        steps:["Add a few drops of Benedict's solution (blue)…",'Heat the test tube in a water bath…','Watch the colour…']},
      {id:'lipid', name:'Ethanol', for:'lipids', start:'#e9f4fb', pos:'#f4f4f4', posTxt:'cloudy (milky white)', negTxt:'stays clear', cloudy:true,
        steps:['Add a few drops of ethanol and shake. Leave for 1 minute…','Pour the ethanol into a test tube of water…','Look, is it cloudy?']},
      {id:'protein', name:'Copper sulfate + sodium hydroxide', for:'protein', start:'#8fc3ea', pos:'#7b3fa0', posTxt:'purple', negTxt:'stays pale blue',
        steps:['Add a few drops of copper sulfate solution (pale blue)…','Add a few drops of sodium hydroxide solution…','Watch the colour…']},
      {id:'paper', name:'Filter paper', for:'lipids', paper:true, posTxt:'paper went translucent', negTxt:'paper not translucent',
        steps:['Rub some food onto filter paper…','Hold the paper up to the light…']}
    ];
    let food=null, test=null, busy=false;
    el.innerHTML = `
      <div class="lab">
        <div class="controls">
          <h4>1. Choose a sample</h4><div class="choices" id="lf"></div>
          <h4>2. Choose a test</h4><div class="choices" id="lt"></div>
          <div class="row" style="margin-top:14px"><button class="btn" id="run" disabled>▶ Run the test</button></div>
          <p class="hint">Remember: to make a food solution, crush the food with a <b>pestle and mortar</b>, add a few drops of <b>distilled water</b> and mix well. Use <b>filter paper</b> for a solid piece of food.</p>
        </div>
        <div class="bench">
          <div class="result-label" style="margin:0 0 8px" id="res">Pick a sample and a test</div>
          <svg viewBox="0 0 200 260" id="tube">
            <rect id="bath" x="20" y="150" width="160" height="90" rx="10" fill="#cfe8ff" opacity="0"/>
            <g id="bubbles" opacity="0"></g>
            <circle id="drop" cx="100" cy="-10" r="6" fill="#e8a33a"/>
            <path d="M75 20 L75 200 A25 25 0 0 0 125 200 L125 20" fill="#ffffff" stroke="#5d5470" stroke-width="4"/>
            <clipPath id="tclip"><path d="M77 20 L77 200 A23 23 0 0 0 123 200 L123 20 Z"/></clipPath>
            <rect id="liquid" x="70" y="120" width="60" height="120" fill="#f3ead7" clip-path="url(#tclip)" style="transition:fill 1.4s"/>
            <rect id="cloud" x="70" y="120" width="60" height="120" fill="#ffffff" opacity="0" clip-path="url(#tclip)" style="transition:opacity 1.6s"/>
            <g id="paper" opacity="0" style="transition:opacity .5s">
              <rect x="20" y="40" width="160" height="160" rx="6" fill="#fffdf7" stroke="#cbbfa8" stroke-width="2"/>
              <ellipse id="spot" cx="100" cy="120" rx="40" ry="30" fill="#f6e6b0" opacity="0" style="transition:opacity 1.4s"/>
              <circle cx="40" cy="60" r="0" fill="#ffd34d" id="lightglow"/>
            </g>
            <ellipse cx="100" cy="250" rx="60" ry="6" fill="#000" opacity=".08"/>
          </svg>
        </div>
      </div>
      <div class="logwrap"><table class="logtable"><thead><tr><th>Sample</th><th>Test</th><th>Result</th><th>Nutrient present?</th></tr></thead><tbody id="log"><tr><td colspan="4" class="hint">Results appear here. Use them to work out what is in the mystery sample.</td></tr></tbody></table></div>`;
    const $=s=>el.querySelector(s);
    FOODS.forEach(f=>{ const b=U.h('button',{},f.name); b.onclick=()=>{ if(busy)return; food=f; $('#lf').querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); reset(); ready(); }; $('#lf').appendChild(b); });
    TESTS.forEach(t=>{ const b=U.h('button',{},`${t.name}`); b.title='Tests for '+t.for; b.onclick=()=>{ if(busy)return; test=t; $('#lt').querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); reset(); ready(); }; $('#lt').appendChild(b); });
    const bub=$('#bubbles'); for(let i=0;i<9;i++){ bub.innerHTML+=`<circle cx="${35+i*16}" cy="230" r="3" fill="#fff"><animate attributeName="cy" from="235" to="160" dur="${1+i%3*.4}s" repeatCount="indefinite"/></circle>`; }
    function ready(){ $('#run').disabled=!(food&&test); if(food&&test) $('#res').textContent=`Ready: test ${food.name.toLowerCase()} with ${test.name}`; }
    function reset(){ $('#liquid').style.fill='#f3ead7'; $('#cloud').style.opacity=0; $('#bath').setAttribute('opacity',0); bub.setAttribute('opacity',0); $('#paper').style.opacity=0; $('#spot').style.opacity=0; }
    $('#run').onclick=async ()=>{
      if(busy) return; busy=true; $('#run').disabled=true; reset();
      const nut = test.id==='paper' ? 'lipid' : test.id;
      const positive = !!food.has[nut];
      if(test.paper){
        $('#paper').style.opacity=1; $('#res').textContent=test.steps[0]; await sleep(1300);
        $('#res').textContent=test.steps[1]; if(positive) $('#spot').style.opacity=1; await sleep(1500);
      } else {
        $('#res').textContent='Sample ready in the test tube…'; await sleep(900);
        const drop=$('#drop'); drop.setAttribute('fill',test.start);
        $('#res').textContent=test.steps[0];
        for(let i=0;i<3;i++){ drop.setAttribute('cy',-10); drop.animate([{transform:'translateY(0)'},{transform:'translateY(130px)'}],{duration:450,easing:'ease-in'}); await sleep(470); }
        $('#liquid').style.fill = mix(test.start);
        await sleep(900);
        for(const step of test.steps.slice(1,-1)){
          $('#res').textContent=step;
          if(test.heat){ $('#bath').setAttribute('opacity',.9); bub.setAttribute('opacity',1); await sleep(1800); }
          else if(test.cloudy) await sleep(1200);
          else {
            // Show the second reagent being added before revealing the Biuret result.
            drop.setAttribute('fill','#e9f4fb');
            for(let i=0;i<3;i++){ drop.setAttribute('cy',-10); drop.animate([{transform:'translateY(0)'},{transform:'translateY(130px)'}],{duration:450,easing:'ease-in'}); await sleep(470); }
          }
        }
        $('#res').textContent=test.steps[test.steps.length-1];
        if(positive){ if(test.cloudy) $('#cloud').style.opacity=.85; else $('#liquid').style.fill=test.pos; }
        await sleep(1500);
      }
      const txt = positive ? test.posTxt : test.negTxt;
      const note = test.paper ? '<br><span class="hint">In the textbook, filter paper is used for a <b>solid</b> piece of food. For a food solution, use the <b>ethanol</b> test.</span>' : '';
      const nm = food.name.toLowerCase();
      const what = test.paper ? (positive ? 'The paper has gone translucent' : 'The paper has not gone translucent') : (positive ? `It turned ${txt}` : `It ${txt}`);
      $('#res').innerHTML = (positive ? `<b>Positive.</b> ${what}, so the ${nm} contains ${test.for}.` : `<b>Negative.</b> ${what}, so the ${nm} does not contain ${test.for}.`) + note;
      const log=$('#log'); if(log.querySelector('.hint')) log.innerHTML='';
      const sw = test.paper? '' : `<span class="swatch" style="background:${positive?(test.cloudy?'#fff':test.pos):test.start}"></span>`;
      log.insertAdjacentHTML('afterbegin',`<tr><td>${food.name}</td><td>${test.name}</td><td>${sw}${txt}</td><td>${positive?'Yes':'No'}</td></tr>`);
      busy=false; $('#run').disabled=false;
    };
    function mix(c){ return c; }
  }

  /* ---------------- 2. Energy balance scale ---------------- */
  function balance(el,U){
    el.innerHTML=`
      <div class="slider"><label>Energy <b>in</b> (food)</label><input type="range" id="ein" min="4000" max="16000" step="500" value="10000"><b id="vin"></b></div>
      <div class="slider"><label>Energy <b>used</b></label><input type="range" id="eout" min="4000" max="16000" step="500" value="10000"><b id="vout"></b></div>
      <div class="scale"><div class="beam" id="beam"><div class="pan l">Energy in<div class="plate" id="pin">kJ</div></div><div class="pan r">Energy used<div class="plate" id="pout">kJ</div></div></div><div class="post"></div><div class="base"></div></div>
      <div class="verdict" id="verdict"></div>`;
    const $=s=>el.querySelector(s);
    const upd=()=>{ const a=+$('#ein').value, b=+$('#eout').value; $('#vin').textContent=a.toLocaleString()+' kJ'; $('#vout').textContent=b.toLocaleString()+' kJ'; $('#pin').innerHTML=a.toLocaleString()+'<small>kJ</small>'; $('#pout').innerHTML=b.toLocaleString()+'<small>kJ</small>';
      const diff=a-b; $('#beam').style.transform=`rotate(${Math.max(-14,Math.min(14,-diff/400))}deg)`;
      $('#verdict').innerHTML = diff>500 ? `Energy in is <b>more</b> than energy used (+${diff.toLocaleString()} kJ a day).<br>You <b>gain body mass</b>, stored as <b>fat under the skin</b>. Keep this up and you may become <b>overweight</b> or <b>obese</b> → higher risk of heart disease, stroke, type 2 diabetes and some cancers.`
        : diff<-500 ? `Energy in is <b>less</b> than energy used (${diff.toLocaleString()} kJ a day).<br>You <b>lose body mass</b> and may become <b>underweight</b> → tired, lack energy, poor immune system, lack of vitamins and minerals.`
        : `Energy in ≈ energy used. Your body mass stays about the <b>same</b>, a balanced energy intake.`; };
    $('#ein').oninput=upd; $('#eout').oninput=upd; upd();
  }

  /* ---------------- 3. Energy-requirement bar chart ---------------- */
  function chart(el,U){
    const data=[['Child 5–11',8000,8000],['Child 11–16',10500,9800],['Office worker',11000,10000],['Construction worker',16000,14500],['Pregnant woman',null,13000]];
    const W=620,H=300,pad=60,max=18000, bw=34;
    let s=`<svg class="chart" viewBox="0 0 ${W} ${H+70}" role="img" aria-label="Daily energy requirements bar chart">`;
    for(let v=0;v<=16000;v+=4000){ const y=H-v/max*H+10; s+=`<line x1="${pad}" x2="${W-10}" y1="${y}" y2="${y}" stroke="#eadfce"/><text x="${pad-8}" y="${y+4}" text-anchor="end" font-size="12" fill="#6b6380">${v.toLocaleString()}</text>`; }
    s+=`<text x="14" y="${H/2}" font-size="12" fill="#6b6380" transform="rotate(-90 14 ${H/2})" text-anchor="middle">energy needed per day (kJ)</text>`;
    const gw=(W-pad-10)/data.length;
    data.forEach((d,i)=>{ const x0=pad+i*gw+gw/2;
      [[d[1],'#2fa36b','male',-bw-2],[d[2],'#e0702a','female',2]].forEach(([v,c,sex,off])=>{ if(v==null) return; const hgt=v/max*H; s+=`<rect class="barr" data-t="${d[0]} (${sex}): about ${v.toLocaleString()} kJ per day (estimate)" x="${x0+off}" y="${H-hgt+10}" width="${bw}" height="${hgt}" rx="4" fill="${c}"><animate attributeName="height" from="0" to="${hgt}" dur=".9s"/><animate attributeName="y" from="${H+10}" to="${H-hgt+10}" dur=".9s"/></rect>`; });
      s+=`<text x="${x0}" y="${H+30}" text-anchor="middle" font-size="12" font-weight="700">${d[0]}</text>`; });
    s+=`<rect x="${W-170}" y="14" width="12" height="12" fill="#2fa36b"/><text x="${W-152}" y="24" font-size="12">male</text><rect x="${W-100}" y="14" width="12" height="12" fill="#e0702a"/><text x="${W-82}" y="24" font-size="12">female</text></svg>`;
    el.innerHTML=`<div class="chart-read k-callout" id="cr" style="text-align:center;margin:0 0 8px">Tap a bar to read its estimated value</div>`+s+`
      <p style="text-align:center"><b style="background:#fde68a;padding:0 .3em">Estimates only:</b> these values are read by eye from the textbook graph, so they are not exact.</p>
      <div class="memory"><b>Pattern:</b> energy needs go up with <b>age</b> (growing), <b>body size</b> and <b>how active you are</b>. The more exercise you do, the more energy your body requires.</div>`;
    el.querySelectorAll('.barr').forEach(b=>b.onclick=()=>{ el.querySelector('#cr').innerHTML='<b>'+b.dataset.t+'</b>'; el.querySelectorAll('.barr').forEach(x=>x.style.opacity=x===b?1:.45); });
  }

  /* ---------------- 4. Digestive system body diagram ---------------- */
  const ORG = {
    mouth:{n:'Mouth',e:'👄',t:'Teeth chew the food into smaller chunks. It is mixed with <b>saliva</b>, which contains <b>carbohydrase</b> to start breaking down starch into sugar.',time:'about 1 minute'},
    gullet:{n:'Gullet (oesophagus)',e:'⬇️',t:'A tube that carries food from the mouth down to the stomach. Muscles squeeze the food along.',time:'about 10 seconds'},
    stomach:{n:'Stomach',e:'🫙',t:'Food is churned and mixed with <b>digestive juices and acid</b>. <b>Protease</b> starts digesting proteins. The <b>acid kills harmful microorganisms</b> in food.',time:'2–4 hours'},
    liver:{n:'Liver',e:'🟤',t:'Makes <b>bile</b>, which is added to the small intestine. Bile breaks lipids into small droplets so lipase can work on them. (Food does not pass through the liver.)',time:''},
    small:{n:'Small intestine',e:'🌀',t:'Juices from the <b>liver and pancreas</b> are added and digestion is <b>completed</b>. Small nutrient molecules pass through the thin wall, with its <b>villi</b>, into the <b>bloodstream</b>.',time:'3–5 hours'},
    large:{n:'Large intestine',e:'💧',t:'Only food that <b>cannot be digested</b> (like fibre) gets here. <b>Water is absorbed</b> back into the body, leaving solid waste called <b>faeces</b>. Gut bacteria live here and make vitamin K.',time:'up to 1–2 days'},
    rectum:{n:'Rectum',e:'📦',t:'<b>Faeces are stored</b> here until they leave the body.',time:''},
    anus:{n:'Anus',e:'⭕',t:'A <b>muscular ring</b> through which faeces pass out of the body.',time:''}
  };
  const PATHS = {
    gullet:'M170 92 L170 190',
    stomach:'M170 190 Q172 205 195 205 Q240 208 232 240 Q224 268 186 262',
    small:'M186 262 L140 288 L212 300 L132 316 L214 330 L130 346 L214 360 L138 376 L226 394',
    large:'M226 394 L236 276 L104 276 L100 398 Q110 420 160 420',
    rectum:'M160 420 L168 450',
    anus:'M168 450 L170 468'
  };
  function bodySVG(pins){
    return `<svg viewBox="0 0 340 500" class="bodysvg" role="img" aria-label="Digestive system diagram">
      <path d="M110 120 Q90 125 70 160 L40 330 Q36 350 52 352 L70 352 L92 220 L100 470 L240 470 L248 220 L270 352 L288 352 Q304 350 300 330 L270 160 Q250 125 230 120 Z" fill="#ffe2cf" stroke="#e9b99c" stroke-width="3"/>
      <rect x="152" y="96" width="36" height="34" fill="#ffe2cf"/>
      <circle cx="170" cy="58" r="44" fill="#ffe2cf" stroke="#e9b99c" stroke-width="3"/>
      
      <g class="organ" data-o="mouth"><path d="M156 76 Q170 84 184 76 Q170 80 156 76Z" fill="#c2566a" stroke="#c2566a" stroke-width="3" stroke-linejoin="round"/></g>
      <g class="organ" data-o="liver"><path d="M98 200 Q120 178 175 196 Q170 232 120 238 Q96 232 98 200Z" fill="#9b4a2c" opacity=".85"/></g>
      <g class="organ" data-o="gullet"><path d="${PATHS.gullet}" stroke="#e98a7a" stroke-width="12" fill="none" stroke-linecap="round"/></g>
      <g class="organ" data-o="stomach"><path d="M168 192 Q176 196 196 196 Q250 198 242 242 Q232 276 186 272 Q162 268 172 250 Q192 250 204 238 Q206 222 186 216 Q166 212 168 192Z" fill="#f08a8a" stroke="#c9605f" stroke-width="3"/></g>
      <g class="organ" data-o="large"><path d="${PATHS.large}" stroke="#d08b5b" stroke-width="22" fill="none" stroke-linejoin="round" stroke-linecap="round" opacity=".9"/></g>
      <g class="organ" data-o="small"><path d="${PATHS.small}" stroke="#f3a3a8" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>
      <g class="organ" data-o="rectum"><path d="${PATHS.rectum}" stroke="#b36b45" stroke-width="16" fill="none" stroke-linecap="round"/></g>
      <g class="organ" data-o="anus"><circle cx="170" cy="470" r="7" fill="#fff" stroke="#7a3f22" stroke-width="4"/></g>
      ${Object.entries(PATHS).map(([k,d])=>`<path id="route-${k}" d="${d}" fill="none" stroke="none"/>`).join('')}
      <g id="dots"></g>
      <circle id="food" cx="170" cy="78" r="0" fill="#d9b56f" stroke="#9c7536" stroke-width="2"/>
      ${pins?pins:''}
    </svg>`;
  }
  function journey(el,U){
    el.innerHTML=`<div class="journey"><div>${bodySVG()}</div>
      <div><div class="organ-card" id="oc"><div class="step">Press play to follow a bite of sandwich</div><h3>Start of the journey</h3><p>Or tap any organ on the diagram to read what it does.</p></div>
      <div class="row" style="margin-top:12px"><button class="btn" id="play">▶ Play</button><button class="btn ghost" id="next">Next stop</button><button class="btn ghost small" id="rst">Reset</button></div>
      <p class="hint">The food ball gets <b>smaller</b> as it is digested, yellow nutrient molecules pass into the blood in the small intestine, and what is left becomes faeces.</p></div></div>`;
    const $=s=>el.querySelector(s); const svg=el.querySelector('svg'); const ball=$('#food');
    const order=['mouth','gullet','stomach','small','large','rectum','anus']; let i=-1, auto=false, moving=false;
    const show=(k,num)=>{ const o=ORG[k]; svg.querySelectorAll('.organ').forEach(g=>g.classList.toggle('lit',g.dataset.o===k)); $('#oc').innerHTML=`<div class="step">${num?`Stop ${num} of 7`:'Organ'}</div><h3>${o.n}</h3><p>${o.t}</p>${o.time?`<p class="hint">⏱️ Food spends ${o.time} here.</p>`:''}`; };
    svg.querySelectorAll('.organ').forEach(g=>g.addEventListener('click',()=>{ if(!moving) show(g.dataset.o); }));
    const look={mouth:[11,'#d9b56f'],gullet:[9,'#d9b56f'],stomach:[8,'#c9a25a'],small:[6,'#b58a46'],large:[6,'#7a4a21'],rectum:[7,'#6b3d18'],anus:[7,'#6b3d18']};
    async function along(k,dur){ const p=svg.querySelector('#route-'+k); const L=p.getTotalLength(); const t0=performance.now(); const r0=+ball.getAttribute('r'), r1=look[k][0];
      ball.setAttribute('fill',look[k][1]);
      return new Promise(res=>{ const f=now=>{ const t=Math.min(1,(now-t0)/dur); const pt=p.getPointAtLength(t*L); ball.setAttribute('cx',pt.x); ball.setAttribute('cy',pt.y); ball.setAttribute('r',r0+(r1-r0)*t);
        if(k==='small' && Math.random()<.18) absorb(pt);
        if(t<1) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); }); }
    function absorb(pt){ const d=document.createElementNS('http://www.w3.org/2000/svg','circle'); d.setAttribute('r',3); d.setAttribute('fill','#ffcf33'); d.setAttribute('cx',pt.x); d.setAttribute('cy',pt.y); $('#dots').appendChild(d);
      const dx=(Math.random()-.5)*60, dy=(Math.random()-.5)*40; d.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${dx}px,${dy}px)`,opacity:0}],{duration:1200,fill:'forwards'}); setTimeout(()=>d.remove(),1300); }
    async function step(){ if(moving) return; if(i>=order.length-1){ reset(); }
      i++; const k=order[i]; moving=true; show(k,i+1);
      if(k==='mouth'){ ball.setAttribute('cx',170); ball.setAttribute('cy',80); ball.setAttribute('r',13); ball.setAttribute('fill','#d9b56f'); await sleep(400); }
      else await along(k, k==='small'?3200:k==='large'?2600:1300);
      moving=false; if(i===order.length-1){ ball.animate([{opacity:1},{opacity:0}],{duration:800,fill:'forwards'}); auto=false; $('#play').textContent='▶ Play again'; U.toast('Journey complete'); }
      else if(auto){ await sleep(1700); if(auto) step(); } }
    function reset(){ auto=false; i=-1; ball.getAnimations().forEach(a=>a.cancel()); ball.setAttribute('r',0); $('#play').textContent='▶ Play'; svg.querySelectorAll('.organ').forEach(g=>g.classList.remove('lit')); }
    $('#play').onclick=()=>{ if(auto){ auto=false; $('#play').textContent='▶ Continue'; return; } if(i>=order.length-1) reset(); auto=true; $('#play').textContent='⏸ Pause'; if(!moving) step(); };
    $('#next').onclick=()=>{ auto=false; $('#play').textContent='▶ Continue'; step(); };
    $('#rst').onclick=()=>{ reset(); $('#oc').innerHTML='<div class="step">Press play to follow a bite of sandwich</div><h3>Start of the journey</h3><p>Or tap any organ on the diagram to read what it does.</p>'; };
  }

  /* label-the-diagram game */
  function labelGame(el,U){
    const spots=[['mouth',190,82],['gullet',170,150],['stomach',236,222],['liver',112,214],['small',176,338],['large',238,300],['rectum',186,438],['anus',150,476]];
    const pins=spots.map((s,i)=>`<g class="pin" data-o="${s[0]}" transform="translate(${s[1]},${s[2]})"><circle r="12"/><text text-anchor="middle" dy="4.5">${i+1}</text></g>`).join('');
    el.innerHTML=`<div class="journey"><div>${bodySVG(pins)}</div><div><p><b>Tap a label, then tap the number where it belongs.</b></p><div class="pool" id="labels"></div><div id="lstat" class="hint"></div><button class="btn ghost small" id="lr" style="margin-top:8px">Restart</button></div></div>`;
    const $=s=>el.querySelector(s); let sel=null, left=spots.length, wrong=0;
    U.shuffle(spots).forEach(s=>{ const c=U.h('div',{class:'chip','data-o':s[0]},ORG[s[0]].n.replace(' (oesophagus)','')); c.onclick=()=>{ if(c.classList.contains('ok'))return; $('#labels').querySelectorAll('.chip').forEach(x=>x.classList.remove('sel')); c.classList.add('sel'); sel=c; }; $('#labels').appendChild(c); });
    el.querySelectorAll('.pin').forEach(p=>p.addEventListener('click',()=>{ if(!sel||p.classList.contains('ok')) return;
      if(sel.dataset.o===p.dataset.o){ p.classList.add('ok'); sel.classList.remove('sel'); sel.classList.add('ok'); sel.textContent='✔ '+sel.textContent; sel=null; left--; if(!left){ $('#lstat').innerHTML=`🎉 Diagram fully labelled${wrong?` (${wrong} wrong tries)`:' with no mistakes!'}`; U.confetti(); } }
      else { wrong++; sel.classList.remove('shake'); void sel.offsetWidth; sel.classList.add('shake'); U.toast('Not there. Think about the order food travels in.'); } }));
    $('#lr').onclick=()=>labelGame(el,U);
  }

  /* peristalsis */
  function peristalsis(el){
    el.innerHTML=`<div class="tube"><div class="squeeze"></div><div class="ball"></div></div>
      <p>Muscles in the wall of the gut <b>squeeze behind the food</b> and push it along, a bit like squeezing a tube of toothpaste 🪥. <b>Fibre</b> isn't digested, but it adds <b>bulk</b> for the muscles to push against. That keeps food moving and helps <b>prevent constipation</b>.</p>`;
  }

  /* villi surface area */
  function villi(el,U){
    const flat='M10 60 L290 60';
    let v='M10 60'; for(let x=10;x<290;x+=28){ v+=` L${x+4} 60 L${x+4} 18 Q${x+14} 4 ${x+24} 18 L${x+24} 60`; } v+=' L290 60';
    el.innerHTML=`<div class="villi-demo">
      <figure><svg viewBox="0 0 300 100"><rect x="0" y="60" width="300" height="40" fill="#f6c2c2"/><path id="pf" d="${flat}" stroke="#c9605f" stroke-width="4" fill="none"/></svg><figcaption>Flat wall</figcaption><div class="hint" id="lf"></div></figure>
      <figure><svg viewBox="0 0 300 100"><rect x="0" y="60" width="300" height="40" fill="#f6c2c2"/><path id="pv" d="${v}" stroke="#c9605f" stroke-width="4" fill="#f6c2c2"/>${Array.from({length:10},(_,i)=>`<line x1="${22+i*28}" y1="24" x2="${22+i*28}" y2="58" stroke="#d6455d" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}</svg><figcaption>Wall with villi</figcaption><div class="hint" id="lv"></div></figure>
    </div>
    <div class="memory"><b>Why villi matter:</b> the villi stick out of the wall and give it a <b>big surface area</b>, so more nutrients can be absorbed. The wall is <b>thin</b>, and the villi contain <b>blood capillaries</b> (red dashes) to carry away the absorbed food molecules. The small intestine needs to absorb nutrients <b>quickly</b>, before the undigested food passes out of the body.</div>`;
    requestAnimationFrame(()=>{ const a=el.querySelector('#pf').getTotalLength(), b=el.querySelector('#pv').getTotalLength(); el.querySelector('#lf').textContent=`Surface length: ${Math.round(a)} units`; el.querySelector('#lv').innerHTML=`Surface length: <b>${Math.round(b)} units</b>, about <b>${(b/a).toFixed(1)}×</b> more!`; });
  }

  /* ---------------- 5. Enzyme scissors ---------------- */
  function enzymes(el,U){
    const MOL={
      starch:{n:'Starch (a carbohydrate)',enz:'carbohydrase',prod:'sugar molecules',build:()=>Array.from({length:7},()=>'<div class="unit hex"></div>').join('')},
      protein:{n:'Protein',enz:'protease',prod:'amino acids',build:()=>['#4caf50','#ff9800','#9c27b0','#3f51b5','#e91e63','#f44336','#009688'].map(c=>`<div class="unit sq" style="background:${c}"></div>`).join('')},
      lipid:{n:'Lipid (fat)',enz:'lipase',prod:'fatty acids and glycerol',build:()=>`<div style="margin:0 14px;display:flex;flex-direction:column;align-items:center;gap:2px"><div class="unit gly"></div><div style="display:flex;gap:6px"><div class="unit fat"></div><div class="unit fat"></div><div class="unit fat"></div></div></div>`.repeat(2)}
    };
    let cur='starch';
    el.innerHTML=`<div class="tabs" id="mt"></div><div class="enz-stage" id="st"></div><div class="result-label" id="er">Choose the enzyme that breaks down this molecule</div>
      <div class="tools">${['carbohydrase','protease','lipase'].map(z=>`<button class="tool" data-z="${z}">${z}</button>`).join('')}</div>`;
    const $=s=>el.querySelector(s);
    Object.entries(MOL).forEach(([k,m])=>{ const b=U.h('button',{class:k===cur?'on':''},m.n); b.onclick=()=>{ cur=k; $('#mt').querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); draw(); }; $('#mt').appendChild(b); });
    function draw(){ $('#st').innerHTML=MOL[cur].build(); $('#st').style.gap='0'; $('#er').innerHTML=`<b>${MOL[cur].n}</b> is a big molecule, too big to pass into the blood. Which enzyme breaks it down?`; }
    el.querySelectorAll('.tool').forEach(b=>b.onclick=()=>{ const m=MOL[cur];
      if(b.dataset.z===m.enz){ $('#st').style.gap='22px'; $('#st').querySelectorAll('.unit').forEach(u=>{ u.style.transform=`translate(${(Math.random()-.5)*50}px,${(Math.random()-.5)*60}px) rotate(${(Math.random()-.5)*90}deg)`; });
        $('#er').innerHTML=`Yes. <b>${m.enz}</b> breaks ${cur==='starch'?'carbohydrates':cur+'s'} into <b>${m.prod}</b>, small enough to pass into the blood!`; U.toast('Correct enzyme'); }
      else { $('#st').classList.remove('shake'); void $('#st').offsetWidth; $('#st').classList.add('chip','shake'); setTimeout(()=>$('#st').classList.remove('chip','shake'),400);
        $('#er').innerHTML=`<b>${b.dataset.z}</b> doesn't fit. Each enzyme only works on one type of nutrient. Clue: the name gives it away: <b>carbohydr</b>ase, <b>prot</b>ease, <b>lip</b>ase.`; } });
    draw();
  }

  /* bile emulsifying */
  function bile(el,U){
    el.innerHTML=`<div class="enz-stage" id="bs" style="height:200px;display:block"></div><div class="result-label" id="br">One large drop of lipid. Lipase works on lipids in the <b>small intestine</b>.</div>
      <div class="row"><button class="btn" id="b1">Add bile</button><button class="btn" id="b2" disabled>Add lipase</button><button class="btn ghost small" id="b3">Reset</button></div>`;
    const $=s=>el.querySelector(s); let blobs=[];
    function init(){ $('#bs').innerHTML=''; blobs=[]; const b=U.h('div',{class:'blob'}); Object.assign(b.style,{width:'120px',height:'120px',left:'calc(50% - 60px)',top:'40px'}); $('#bs').appendChild(b); blobs.push(b); $('#b1').disabled=false; $('#b2').disabled=true; $('#br').innerHTML='One large drop of lipid. Lipase works on lipids in the <b>small intestine</b>.'; }
    $('#b1').onclick=()=>{ const W=$('#bs').clientWidth; $('#bs').innerHTML=''; blobs=[]; for(let i=0;i<16;i++){ const b=U.h('div',{class:'blob'}); Object.assign(b.style,{width:'60px',height:'60px',left:(W/2-30)+'px',top:'70px'}); $('#bs').appendChild(b); blobs.push(b); requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(b.style,{width:'26px',height:'26px',left:(20+Math.random()*(W-60))+'px',top:(10+Math.random()*150)+'px'}))); }
      $('#br').innerHTML='<b>Bile</b>, a substance made in the liver, breaks the lipids into <b>small droplets</b> that are easier for lipase to work on.'; $('#b1').disabled=true; $('#b2').disabled=false; };
    $('#b2').onclick=()=>{ blobs.forEach((b,i)=>setTimeout(()=>{ b.style.borderRadius='3px'; b.style.width='6px'; b.style.height='22px'; b.style.background=i%3?'#7da73a':'#e2c636'; b.style.transform=`rotate(${Math.random()*180}deg)`; },i*60));
      $('#br').innerHTML='<b>Lipase</b> breaks the droplets into <b>fatty acids</b> (green) and <b>glycerol</b> (yellow). This happens in the <b>small intestine</b>.'; $('#b2').disabled=true; U.toast('Lipids digested'); };
    $('#b3').onclick=init; init();
  }

  return {lab,balance,chart,journey,labelGame,peristalsis,villi,enzymes,bile};
})();
