/* ===== Digestive system on the textbook diagram: spelling journey + labelling ===== */
(function(){
  const W = window.DigestionWidgets;
  const IMG = 'img/digestive-system.svg'; // public-domain vector (M. Ruiz), cropped to 390×847
  // points on the 390×847 picture; ly = height of the label on the right
  const STEPS = [
    {k:'mouth', name:'mouth', answers:['mouth'], x:120, y:155, ly:155,
      info:'Teeth chew the food into smaller pieces and it mixes with saliva. Saliva contains carbohydrase, which starts breaking starch down into sugar.'},
    {k:'gullet', name:'gullet', answers:['gullet','oesophagus'], alt:{esophagus:'That is the American spelling. In the UK it is <b>oesophagus</b>.'}, x:182, y:355, ly:355,
      info:'A tube that carries food from the mouth down to the stomach. Muscles in its wall squeeze the food along. (Its other name is the oesophagus.)'},
    {k:'stomach', name:'stomach', answers:['stomach'], x:238, y:458, ly:440,
      info:'Food is mixed with digestive juices and acid. Protease starts digesting proteins, and the acid kills harmful microorganisms.'},
    {k:'small', name:'small intestine', answers:['small intestine'], x:175, y:640, ly:640,
      info:'Juices from the liver and pancreas are added and digestion is completed. Small nutrient molecules pass through the thin wall and villi into the blood.'},
    {k:'large', name:'large intestine', answers:['large intestine'], x:274, y:580, ly:540,
      info:'Only food that cannot be digested gets here. Water is absorbed back into the body, leaving faeces. Gut bacteria live here and make vitamin K.'},
    {k:'rectum', name:'rectum', answers:['rectum'], x:160, y:752, ly:740,
      info:'Faeces are stored here until they leave the body.'},
    {k:'anus', name:'anus', answers:['anus'], x:163, y:792, ly:810,
      info:'A muscular ring. Faeces pass out of the body through it.'}
  ];
  const norm = s => String(s).toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
  const lev = (a,b) => { const d=Array.from({length:a.length+1},(_,i)=>[i]); for(let j=1;j<=b.length;j++) d[0][j]=j;
    for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[a.length][b.length]; };

  function diagram(){
    const lines = STEPS.map(s => `<path d="M${s.x+8} ${s.y} L404 ${s.ly}" stroke="#222" stroke-width="1.6" fill="none"/>`).join('');
    const slots = STEPS.map((s,i)=>`<g class="slot" data-i="${i}" transform="translate(410 ${s.ly-22})"><rect width="250" height="44" rx="3"/><text x="14" y="29"></text></g>`).join('');
    const marks = STEPS.map((s,i)=>`<g class="mark" data-i="${i}"><circle cx="${s.x}" cy="${s.y}" r="22"/><circle class="dot" cx="${s.x}" cy="${s.y}" r="6"/></g>`).join('');
    return `<svg class="tbdiagram" viewBox="0 0 670 852" role="img" aria-label="Diagram of the digestive system">
      <image href="${IMG}" x="0" y="0" width="390" height="847"/>${lines}${marks}${slots}</svg>`;
  }

  /* ---- step-by-step: food moves on, Dora types each organ's name ---- */
  function spellJourney(el,U){
    let i=0, tries=0, firstTime=0, mustCopy=false;
    el.innerHTML=`<div class="spell">
      <div>${diagram()}</div>
      <div class="spell-side">
        <div class="step" id="sj-step"></div>
        <p id="sj-q"></p>
        <div class="row fill"><input type="text" id="sj-in" autocomplete="off" spellcheck="false" placeholder="Type the name"><button class="btn" id="sj-go">Check</button></div>
        <div class="row" style="margin-top:8px"><button class="btn ghost small" id="sj-hint">Hint</button><span class="hint">Spelling has to be exact.</span></div>
        <div class="fb" id="sj-fb"></div>
        <div class="row" style="margin-top:10px"><button class="btn" id="sj-next" style="display:none">Next stop →</button><button class="btn ghost small" id="sj-reset">Start again</button></div>
      </div></div>`;
    const $=s=>el.querySelector(s); const svg=el.querySelector('svg');
    const setSlot=(k,txt,cls)=>{ const g=svg.querySelector(`.slot[data-i="${k}"]`); g.setAttribute('class','slot '+(cls||'')); g.querySelector('text').textContent=txt; };
    function show(){
      STEPS.forEach((s,k)=>{ svg.querySelector(`.mark[data-i="${k}"]`).setAttribute('class','mark'+(k===i?' on':k<i?' done':'')); if(k>i) setSlot(k,'',''); });
      if(i>=STEPS.length){ $('#sj-step').textContent='Journey complete';
        $('#sj-q').innerHTML=`You named all ${STEPS.length} parts. <b>${firstTime}</b> spelled right first time.`;
        $('.spell-side .fill').style.display='none'; $('#sj-hint').style.display='none'; $('#sj-next').style.display='none'; $('#sj-fb').className='fb'; return; }
      const s=STEPS[i]; tries=0; mustCopy=false;
      setSlot(i,'?','cur');
      $('#sj-step').textContent=`Stop ${i+1} of ${STEPS.length}`;
      $('#sj-q').innerHTML = i===0 ? 'The food starts here, at the ringed part. <b>Name it.</b>' : `The food has moved on to the ringed part. <b>Name it.</b>`;
      $('.spell-side .fill').style.display=''; $('#sj-hint').style.display='';
      $('#sj-in').value=''; $('#sj-in').readOnly=false; $('#sj-in').className=''; $('#sj-go').disabled=false;
      $('#sj-fb').className='fb'; $('#sj-next').style.display='none'; setTimeout(()=>$('#sj-in').focus(),30);
    }
    function check(){
      const s=STEPS[i]; const v=norm($('#sj-in').value); if(!v) return;
      if(s.answers.includes(v)){
        if(!tries && !mustCopy) firstTime++;
        $('#sj-in').className='ok'; $('#sj-in').readOnly=true; $('#sj-go').disabled=true; $('#sj-hint').style.display='none';
        setSlot(i, s.answers.length>1 && v!==s.answers[0] ? v : s.name, 'ok');
        $('#sj-fb').className='fb show good'; $('#sj-fb').innerHTML=`<b>${mustCopy?'Now it\'s right.':'Correct.'}</b> ${s.info}`;
        $('#sj-next').style.display=''; $('#sj-next').textContent = i===STEPS.length-1 ? 'Finish' : 'Next stop →';
        return;
      }
      tries++; $('#sj-in').className='no';
      const close = Math.min(...s.answers.map(a=>lev(v,a)));
      let msg;
      if(mustCopy) msg=`Not quite. Copy it exactly: <b>${s.answers[0]}</b>`;
      else if(s.alt && s.alt[v]) msg=s.alt[v];
      else if(close<=2) msg=`Very close, but the spelling isn't right. You wrote "<b>${v}</b>". Look at each letter again.`;
      else msg='That isn\'t this part. Think about where the food goes next.';
      if(tries>=2 && !mustCopy){ mustCopy=true; msg+=`<br>The answer is <b>${s.answers[0]}</b>${s.answers.length>1?` (or <b>${s.answers[1]}</b>)`:''}. Type it out correctly to carry on.`; }
      $('#sj-fb').className='fb show bad'; $('#sj-fb').innerHTML=msg;
      $('#sj-in').select();
    }
    $('#sj-go').onclick=check;
    $('#sj-in').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); if($('#sj-next').style.display!=='none') $('#sj-next').click(); else check(); } });
    $('#sj-in').addEventListener('input',()=>{ $('#sj-in').className=''; });
    $('#sj-hint').onclick=()=>{ const a=STEPS[i].answers[0]; $('#sj-fb').className='fb show'; $('#sj-fb').style.background='#fffbeb'; $('#sj-fb').innerHTML=`It starts with <b>${a[0]}</b> and has <b>${a.replace(/ /g,'').length}</b> letters${a.includes(' ')?' (two words)':''}.`; };
    $('#sj-next').onclick=()=>{ $('#sj-fb').style.background=''; i++; show(); };
    $('#sj-reset').onclick=()=>{ i=0; firstTime=0; STEPS.forEach((s,k)=>setSlot(k,'','')); show(); };
    show();
  }

  /* ---- label the textbook diagram: drag each word into its box ---- */
  function labelPhoto(el,U){
    el.innerHTML=`<div class="spell"><div>${diagram()}</div><div class="spell-side"><p><b>Drag each word into the right box on the diagram.</b></p><div class="pool" id="lp"></div><div class="hint" id="lps"></div><button class="btn ghost small" id="lpr" style="margin-top:8px">Start again</button></div></div>`;
    const $=s=>el.querySelector(s); const svg=el.querySelector('svg'); let left=STEPS.length, wrong=0;
    svg.querySelectorAll('.mark').forEach(m=>m.setAttribute('class','mark'));
    U.shuffle(STEPS.map((s,k)=>[s.name,k])).forEach(([n,k])=>{ const c=U.h('div',{class:'chip','data-k':k},n);
      Engine.drag(c,{targets:'.slot',onDrop:(chip,g)=>{
        if(g.classList.contains('ok')) return false;
        if(chip.dataset.k===g.dataset.i){ g.setAttribute('class','slot ok'); g.querySelector('text').textContent=chip.textContent; chip.classList.add('ok'); chip.style.visibility='hidden'; left--; if(!left) $('#lps').textContent=`All labelled (${wrong} wrong attempt${wrong===1?'':'s'}).`; return true; }
        wrong++; chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake'); U.toast('Not that box. Follow the line to the organ.'); return false; }});
      $('#lp').appendChild(c); });
    $('#lpr').onclick=()=>labelPhoto(el,U);
  }

  W.spellJourney=spellJourney; W.labelPhoto=labelPhoto;
})();
