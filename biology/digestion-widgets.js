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
      <div class="memory"><b>Pattern:</b> the energy you need depends on your <b>age</b> (as this affects your growth rate), your <b>body size</b> and <b>how active you are</b>. The more exercise you do, the more energy your body requires.</div>`;
    el.querySelectorAll('.barr').forEach(b=>b.onclick=()=>{ el.querySelector('#cr').innerHTML='<b>'+b.dataset.t+'</b>'; el.querySelectorAll('.barr').forEach(x=>x.style.opacity=x===b?1:.45); });
  }

  return {lab,balance,chart};
})();
