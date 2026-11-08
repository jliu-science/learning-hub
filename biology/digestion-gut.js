/* ===== "How does food move?" — hands-on peristalsis with a fibre switch ===== */
(function(){
  const W = window.DigestionWidgets;
  const NS = 'http://www.w3.org/2000/svg';

  function peristalsis(el,U){
    el.innerHTML=`
      <div class="gut-top">
        <div class="seg" role="group" aria-label="Diet">
          <button data-f="1" class="on">High-fibre meal</button><button data-f="0">Low-fibre meal</button>
        </div>
        <div class="gut-stats"><span>Squeezes <b id="g-n">0</b></span><span>Distance <b id="g-d">0%</b></span></div>
      </div>
      <svg class="gut" viewBox="0 0 720 250" aria-label="Section of the gut with food inside">
        <defs><marker id="g-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6b6455"/></marker></defs>
        <path id="g-path" d="M20 80 C170 80 190 185 360 185 S 560 70 700 70" fill="none" stroke="none"/>
        <path id="g-lumen" fill="#fbe3d6"/>
        <g id="g-rings"></g>
        <path id="g-top" fill="none" stroke="#c96f58" stroke-width="13" stroke-linejoin="round"/>
        <path id="g-bot" fill="none" stroke="#c96f58" stroke-width="13" stroke-linejoin="round"/>
        <g id="g-food"></g>
        <text x="24" y="40" class="g-lbl">muscle in the gut wall</text>
        <path d="M120 46 L118 62" stroke="#6b6455" stroke-width="1.5" marker-end="url(#g-arr)"/>
        <text x="470" y="232" class="g-lbl">towards the large intestine</text>
        <path d="M620 210 L690 112" stroke="#6b6455" stroke-width="1.5" fill="none" marker-end="url(#g-arr)"/>
      </svg>
      <div class="row" style="margin-top:6px">
        <button class="btn" id="g-sq">Squeeze the muscles</button>
        <span class="hint">Click, or hold it down to keep squeezing. The space bar works too.</span>
        <span style="flex:1"></span><button class="btn ghost small" id="g-reset">Start again</button>
      </div>
      <div class="verdict" id="g-msg" style="margin-top:10px"></div>`;
    const $=s=>el.querySelector(s);
    const path=$('#g-path'), L=path.getTotalLength();
    const R=24;                       // resting radius of the gut
    let fibre=true, pos=60, n=0, squeeze=null, timer=null, done=false, slip=0;

    const pt=s=>{ const a=path.getPointAtLength(Math.max(0,Math.min(L,s))), b=path.getPointAtLength(Math.max(0,Math.min(L,s+1))); const dx=b.x-a.x, dy=b.y-a.y, m=Math.hypot(dx,dy)||1; return {x:a.x,y:a.y,nx:-dy/m,ny:dx/m}; };
    const bolusR=()=>fibre?22:10;

    function radius(s){
      let r=R;
      const d=s-pos; const br=bolusR();
      if(Math.abs(d)<br+10) r=Math.max(r, Math.sqrt(Math.max(0,(br+10)**2-d*d))+ (fibre?3:0));   // wall stretched over the food
      if(squeeze){ const c=squeeze.at, k=squeeze.amp*Math.exp(-((s-c)**2)/(2*16*16)); r=Math.max(5,r-k*(R-4)); }          // ring of muscle contracting
      return r;
    }
    function draw(){
      const top=[], bot=[];
      for(let s=0;s<=L;s+=4){ const p=pt(s), r=radius(s); top.push([p.x+p.nx*r,p.y+p.ny*r]); bot.push([p.x-p.nx*r,p.y-p.ny*r]); }
      const line=a=>'M'+a.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L');
      $('#g-top').setAttribute('d',line(top)); $('#g-bot').setAttribute('d',line(bot));
      $('#g-lumen').setAttribute('d',line(top)+' L'+bot.slice().reverse().map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L')+'Z');
      // circular muscle bands every 26 px
      let rings=''; for(let s=14;s<L;s+=26){ const p=pt(s), r=radius(s)+6.5, on=squeeze&&Math.abs(s-squeeze.at)<22&&squeeze.amp>.2;
        rings+=`<line x1="${(p.x+p.nx*r).toFixed(1)}" y1="${(p.y+p.ny*r).toFixed(1)}" x2="${(p.x-p.nx*r).toFixed(1)}" y2="${(p.y-p.ny*r).toFixed(1)}" class="${on?'ring on':'ring'}"/>`; }
      $('#g-rings').innerHTML=rings;
      const f=pt(pos), br=bolusR();
      $('#g-food').innerHTML = fibre
        ? `<circle cx="${f.x}" cy="${f.y}" r="${br}" fill="#c9a46a" stroke="#8a6a35" stroke-width="2"/>${[[-8,-6],[6,-9],[-2,7],[9,5],[-11,4]].map(([a,b])=>`<path d="M${f.x+a-3} ${f.y+b} l6 -2" stroke="#7c8f3a" stroke-width="2.4" stroke-linecap="round"/>`).join('')}`
        : `<circle cx="${f.x}" cy="${f.y}" r="${br}" fill="#8a6a35" stroke="#5e4622" stroke-width="2"/>`;
      $('#g-n').textContent=n; $('#g-d').textContent=Math.round((pos-60)/(L-110)*100)+'%';
    }
    function once(){
      if(squeeze||done) return; n++;
      const br=bolusR(), start=pos-br-14;
      const step = fibre ? 48 : 12;   // low fibre: little to push against, so it moves about 4x slower
      slip++;
      const from=pos, t0=performance.now(), dur=520;
      squeeze={at:start,amp:0};
      const f=now=>{ const t=Math.min(1,(now-t0)/dur);
        squeeze.amp=Math.sin(Math.PI*t); squeeze.at=start+ step*t;
        pos=from+step*Math.min(1,t*1.15);
        draw();
        if(t<1) requestAnimationFrame(f); else { squeeze=null; draw(); after(); } };
      requestAnimationFrame(f);
    }
    function after(){
      const msg=$('#g-msg');
      if(pos>=L-50){ done=true; stop();
        msg.innerHTML = fibre
          ? `<b>Through in ${n} squeezes.</b> Fibre added bulk to the food, so the muscles had something to push against.`
          : `<b>It took ${n} squeezes.</b> With little fibre there is little bulk for the muscles to push against, so the food moves slowly. Fibre-rich foods help prevent <b>constipation</b>.`;
        return; }
      if(!fibre && n===10) msg.innerHTML='Hardly moving. With so little fibre there is very little bulk for the muscles to push against. Keep going, or switch to the high-fibre meal and compare.';
      else if(fibre && n===1) msg.innerHTML='The muscles in the gut wall <b>squeeze</b> the food along, a bit like squeezing a tube of toothpaste.';
    }
    const stop=()=>{ clearInterval(timer); timer=null; $('#g-sq').classList.remove('held'); };
    const sq=$('#g-sq');
    sq.addEventListener('pointerdown',e=>{ e.preventDefault(); once(); sq.classList.add('held'); clearInterval(timer); timer=setInterval(once,560); });
    ['pointerup','pointerleave','pointercancel'].forEach(t=>sq.addEventListener(t,stop));
    sq.addEventListener('keydown',e=>{ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); once(); } });
    el.addEventListener('keydown',e=>{ if(e.key===' '&&e.target.tagName!=='BUTTON'){ e.preventDefault(); once(); } });
    function reset(){ stop(); pos=60; n=0; slip=0; done=false; squeeze=null; $('#g-msg').innerHTML = fibre
      ? 'A meal with plenty of fibre (vegetables, wholemeal bread). Squeeze the muscles to move it along.'
      : 'A meal with very little fibre. Squeeze the muscles and see what happens.'; draw(); }
    el.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{ el.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b)); fibre=b.dataset.f==='1'; reset(); });
    $('#g-reset').onclick=reset;
    reset();
  }

  W.peristalsis = peristalsis;
})();
