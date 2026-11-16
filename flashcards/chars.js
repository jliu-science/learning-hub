/* ===== Dora's card characters (redrawn from her own hand-made cards): Panter.W, Magie.B, Wazid.P, Backer.S and the BAD BOMB.
   They stand on top of the question card. A right answer brings one character out to celebrate; a wrong answer gets the bomb thrown. ===== */
(function(){
  const K='#1b1a17', SW='stroke="#1b1a17" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
  const face=`<rect x="34" y="40" width="52" height="36" rx="2" fill="#fffefa" ${SW}/>
    <circle cx="51" cy="56" r="2.4" fill="${K}"/><circle cx="69" cy="56" r="2.4" fill="${K}"/><path d="M55 61q5 5 10 0" fill="none" ${SW}/>
    <path d="M43 63l3-1.5M46 64l3-1.5M71 63l3-1.5M74 64l3-1.5" stroke="#f08aa4" stroke-width="2" stroke-linecap="round"/>`;
  const legs=c=>`<rect x="44" y="75" width="8" height="10" fill="${c}" ${SW}/><rect x="68" y="75" width="8" height="10" fill="${c}" ${SW}/>`;
  const CH=[
    { name:'Panter.W', col:'#2e8b57', svg:`<path d="M20 74l14-22 4 6-12 20z" fill="#e2372f" ${SW}/><path d="M24 70l8-13" stroke="#2e8b57" stroke-width="4"/>
        <circle cx="22" cy="74" r="6" fill="#2e8b57" ${SW}/>
        <path d="M86 46l10 6-6 22-6-4z" fill="#e2372f" ${SW}/><path d="M88 52l4 2-4 14" stroke="#2e8b57" stroke-width="3" fill="none"/>
        <path d="M92 70l14-30" ${SW}/><path d="M104 38l6-6 1 9z" fill="#2e8b57" ${SW}/>
        ${legs('#2e8b57')}${face}<path d="M38 42q4-12 22-12t24 10z" fill="#2e8b57" ${SW}/><circle cx="62" cy="28" r="4" fill="#e2372f" ${SW}/>
        <circle cx="14" cy="22" r="3" fill="#e2372f"/><circle cx="19" cy="24" r="1.6" fill="#2e8b57"/><circle cx="104" cy="88" r="3" fill="#e2372f"/><circle cx="99" cy="85" r="1.6" fill="#2e8b57"/>` },
    { name:'Magie.B', col:'#1f8fb0', svg:`<rect x="24" y="48" width="12" height="16" fill="#1f8fb0" ${SW} transform="rotate(25 30 56)"/><rect x="84" y="48" width="12" height="16" fill="#ef6f8f" ${SW} transform="rotate(-25 90 56)"/>
        <rect x="92" y="58" width="9" height="20" fill="#1f8fb0" ${SW}/><rect x="98" y="56" width="9" height="20" fill="#ef6f8f" ${SW}/>
        <circle cx="20" cy="72" r="10" fill="#1f8fb0" ${SW}/><circle cx="17" cy="70" r="1.6" fill="${K}"/><circle cx="23" cy="70" r="1.6" fill="${K}"/><path d="M14 82h4M22 82h4" ${SW}/>
        ${legs('#1f8fb0')}${face}<path d="M42 46q3-3 6-1M70 44q3 2 1 5" stroke="#e2372f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <rect x="50" y="24" width="20" height="16" fill="#1f8fb0" ${SW}/><rect x="56" y="16" width="8" height="8" fill="#ef6f8f" ${SW}/>
        <path d="M16 18l3 10" stroke="#ef6f8f" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="33" r="2" fill="#ef6f8f"/>
        <path d="M102 82q0-6 5-6t4 5-4 5v3" fill="none" stroke="#1f8fb0" stroke-width="3" stroke-linecap="round"/><circle cx="107" cy="94" r="1.8" fill="#1f8fb0"/>` },
    { name:'Wazid.P', col:'#3b2a8f', svg:`<path d="M34 52l-10 8 4 12 8-6z" fill="#f2c230" ${SW}/><path d="M26 62l-4 12 6 0z" fill="#3b2a8f" ${SW}/>
        <path d="M86 52l10 8-4 12-8-6z" fill="#f2c230" ${SW}/><path d="M94 62l4 12-6 0z" fill="#3b2a8f" ${SW}/>
        ${legs('#f2c230')}${face}<path d="M32 42q28-8 56 0l-2 6q-26-6-52 0z" fill="#f2c230" ${SW}/>
        <path d="M40 40q4-26 22-32 10 6 22 2-8 6-10 10 6 12 6 20z" fill="#3b2a8f" ${SW}/><circle cx="56" cy="26" r="1.4" fill="#f2c230"/><circle cx="66" cy="32" r="1.2" fill="#f2c230"/>
        ${[[16,22],[100,20],[104,64],[96,86]].map(([x,y])=>`<path d="M${x} ${y-5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="#f2c230" stroke="#b8860b" stroke-width=".8"/>`).join('')}` },
    { name:'Backer.S', col:'#c2410c', svg:`<rect x="24" y="50" width="12" height="14" fill="#f97316" ${SW} transform="rotate(30 30 57)"/><rect x="84" y="50" width="12" height="14" fill="#f97316" ${SW} transform="rotate(-30 90 57)"/>
        <path d="M90 64q2-10 12-10t12 8q0 6-6 6v12h-10v-12q-8 0-8-4z" fill="#7a3b1e" ${SW}/><path d="M103 70v6" stroke="#e8a77a" stroke-width="2"/>
        ${legs('#f97316')}${face}<path d="M48 40q-6-14 0-22 6-6 10 2 4-8 10-2 6 8 0 22z" fill="#7a3b1e" ${SW}/><path d="M53 24q2 6 0 12M65 24q-2 6 0 12" stroke="#a65a33" stroke-width="2" fill="none"/>
        <path d="M12 22l10-6M14 28l12-7" stroke="#c2410c" stroke-width="3.5" stroke-linecap="round"/><path d="M98 96l10-8M104 98l8-6" stroke="#f97316" stroke-width="3.5" stroke-linecap="round"/>` }
  ];
  // Dora's second set: coloured-pencil cut-outs, used as photos of her drawings
  const PH=[['school','School Girl','#2563eb'],['unicorn','Unicorn Girl','#c026d3'],['demon','Démon Girl','#e11d48'],['carrot','The Carrot','#ea580c'],['fox','Fox','#57534e'],['criminal','The Criminal','#c2410c']]
    .map(([f,name,col])=>({name,col,img:`img/chars/${f}.jpg`}));
  const ALL=[]; for(let i=0;i<PH.length;i++){ if(CH[i%CH.length]&&i<CH.length) ALL.push(CH[i]); ALL.push(PH[i]); }
  const BOMB=`<svg viewBox="0 0 120 120"><path d="M58 30q-4-16 8-22 14-4 16 10 2 10-6 14" fill="none" stroke="#c81e1e" stroke-width="7" stroke-linecap="round"/><circle cx="78" cy="44" r="3" fill="#c81e1e"/>
    <circle cx="58" cy="72" r="40" fill="#8a8a8a" ${SW}/><path d="M32 52q6-12 18-16" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/><circle cx="30" cy="62" r="3" fill="#fff" opacity=".8"/>
    <path d="M40 64l12 5M76 64l-12 5" ${SW}/><circle cx="48" cy="72" r="2.6" fill="${K}"/><circle cx="68" cy="72" r="2.6" fill="${K}"/>
    <path d="M48 92q10-10 20 0z" fill="#e2372f" ${SW}/><path d="M36 74q-3 6 0 8 3-2 0-8z" fill="#7cc4e8"/><rect x="52" y="27" width="12" height="8" fill="#555" ${SW}/></svg>`;
  const svgOf=c=>c.img?`<img class="ch-ph" src="${c.img}" alt="">`:`<svg viewBox="0 0 120 100" aria-hidden="true">${c.svg}</svg>`;

  // overlay for the big moments
  const fx=document.createElement('div'); fx.className='ch-fx'; fx.setAttribute('aria-hidden','true'); document.body.appendChild(fx);
  let n=0, busy=0;
  function strip(k=0){ const pick=[CH[k%4],PH[k%6],CH[(k+1)%4],PH[(k+1)%6],CH[(k+2)%4]]; return `<div class="ch-strip" aria-hidden="true">${pick.map((c,i)=>`<span class="ch-mini${c.img?' ph':''}" data-n="${c.name}" style="animation-delay:${i*.35}s">${svgOf(c)}</span>`).join('')}</div>`; }
  function centre(){ const b=document.querySelector('.fc-stage .fc-body')||document.body; const r=b.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; }
  function win(){ const now=Date.now(); if(now-busy<900) return; busy=now;
    const c=ALL[n++%ALL.length], [cx,cy]=centre(), mini=document.querySelector(`.ch-mini[data-n="${c.name}"]`);
    const el=document.createElement('div'); el.className='ch-pop'; el.style.left=cx+'px'; el.style.top=cy+'px'; el.style.setProperty('--c',c.col);
    el.innerHTML=`${svgOf(c)}<b>${c.name}</b>${Array.from({length:10},(_,k)=>`<i style="--a:${k*36}deg;--d:${(k%3)*.06}s"></i>`).join('')}`; fx.appendChild(el);
    if(mini){ mini.classList.remove('jump'); void mini.offsetWidth; mini.classList.add('jump'); }
    setTimeout(()=>el.remove(),2200); }
  function lose(){ const now=Date.now(); if(now-busy<2400) return; busy=now;
    const [cx,cy]=centre(), el=document.createElement('div'); el.className='ch-bomb'; fx.appendChild(el);
    el.innerHTML=`<div class="ch-b">${BOMB}</div><div class="ch-boom"><svg viewBox="0 0 200 200"><path d="M100 10l18 46 44-26-16 48 50 6-44 26 34 38-50-8 0 50-28-42-34 36 4-50-48 6 36-34-40-30 50-4-16-48 44 28z" fill="#ffb21f" stroke="#e2372f" stroke-width="5" stroke-linejoin="round"/><circle cx="100" cy="100" r="34" fill="#fff3b0"/></svg><b>opps&hellip; You died</b></div>`;
    const b=el.querySelector('.ch-b'), sx=innerWidth+80, sy=-120;
    b.animate([{transform:`translate(${sx}px,${sy}px) rotate(0)`},{transform:`translate(${(sx+cx)/2}px,${Math.min(sy,cy)-160}px) rotate(-200deg)`,offset:.5},{transform:`translate(${cx}px,${cy}px) rotate(-400deg)`}],{duration:700,easing:'cubic-bezier(.3,.1,.6,1)',fill:'forwards'})
      .onfinish=()=>{ b.style.display='none'; const bm=el.querySelector('.ch-boom'); bm.style.left=cx+'px'; bm.style.top=cy+'px'; bm.classList.add('go');
        const card=document.querySelector('.fc-stage .fc-card'); card&&card.animate([{transform:'translate(0,0)'},{transform:'translate(-8px,3px)'},{transform:'translate(7px,-4px)'},{transform:'translate(-4px,2px)'},{transform:'translate(0,0)'}],{duration:380}); };
    setTimeout(()=>el.remove(),2300); }
  let cn=3;
  function coach(text){ const c=ALL[cn++%ALL.length]; return `<div class="ch-coach" style="--c:${c.col}"><span class="ch-cface${c.img?' ph':''}">${svgOf(c)}</span><div class="ch-bubble"><b>${c.name}</b>${text}</div></div>`; }
  window.FCChars={strip,win,lose,coach};
})();
