/* ===== Maths engine: a topic = lessons, each with Explore / See why / Practice tabs.
   A topic data file calls MathsEngine.start(TOPIC). Reuses Engine.Store and the shared styles.
   Add a new maths topic as maths/<topic>.html + <topic>-*.js files, then link it on index.html. */
(function(){
  const E=window.Engine, h=E.h, $=(s,el=document)=>el.querySelector(s);

  /* ---------- colour code: the same quantity always has the same colour ---------- */
  const COL={ b:'#2563eb', h:'#ea580c', w:'#059669', r:'#7c3aed', c:'#0d9488', a:'#0d9488', g:'#7a7366' };
  const SOFT={ b:'#dbeafe', h:'#ffedd5', w:'#d1fae5', r:'#ede9fe', c:'#ccfbf1', a:'#ccfbf1', g:'#efe9dc' };
  const v=(k,t)=>`<i class="v v-${k}">${t}</i>`;               // coloured variable in a formula

  /* ---------- numbers ---------- */
  const round=(x,dp=0)=>{ const m=Math.pow(10,dp); return Math.round(x*m+1e-9)/m; };
  const fmt=(x,dp)=>{ const r=dp===undefined?round(x,6):round(x,dp); return r.toLocaleString('en-GB',{maximumFractionDigits:dp===undefined?6:dp, minimumFractionDigits:0}); };
  const R={ int:(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick:a=>a[Math.floor(Math.random()*a.length)],
    half:(a,b)=>R.int(a*2,b*2)/2, even:(a,b)=>R.int(Math.ceil(a/2),Math.floor(b/2))*2 };

  /* ---------- tiny animation helper ---------- */
  function tween(from,to,ms,cb,done){ const t0=performance.now(); let raf;
    const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    const f=now=>{ const t=Math.min(1,(now-t0)/ms); cb(from+(to-from)*ease(t)); if(t<1) raf=requestAnimationFrame(f); else done&&done(); };
    raf=requestAnimationFrame(f); return ()=>cancelAnimationFrame(raf); }

  /* ---------- SVG stage with draggable handles ---------- */
  function stage(el,w,hgt,cls=''){
    el.innerHTML=`<svg class="mstage ${cls}" viewBox="0 0 ${w} ${hgt}" role="img"><g class="layer"></g></svg>`;
    const svg=el.querySelector('svg'), layer=svg.querySelector('.layer');
    return { svg, draw(html){ layer.innerHTML=html; },
      onDrag(fn){ svg.addEventListener('pointerdown',e=>{
        const t=e.target.closest('[data-h]'); if(!t) return; e.preventDefault(); const name=t.dataset.h; svg.classList.add('dragging');
        const pt=ev=>new DOMPoint(ev.clientX,ev.clientY).matrixTransform(svg.getScreenCTM().inverse());
        const mv=ev=>{ const p=pt(ev); fn(name,p.x,p.y); };
        const up=()=>{ removeEventListener('pointermove',mv); removeEventListener('pointerup',up); removeEventListener('pointercancel',up); svg.classList.remove('dragging'); fn(name,null,null,true); };
        addEventListener('pointermove',mv); addEventListener('pointerup',up); addEventListener('pointercancel',up);
      }); return this; } };
  }
  const handle=(name,x,y,k='g')=>`<g class="hdl" data-h="${name}" transform="translate(${x},${y})" style="--hc:${COL[k]}"><circle class="hit" r="18"/><circle class="ring" r="11"/><circle class="dot" r="5"/></g>`;
  const grid=(x0,y0,cols,rows,s)=>{ let d=''; for(let i=0;i<=cols;i++) d+=`M${x0+i*s} ${y0}v${rows*s}`; for(let j=0;j<=rows;j++) d+=`M${x0} ${y0+j*s}h${cols*s}`; return `<path class="grid" d="${d}"/>`; };
  const poly=(pts,cls='',style='')=>`<polygon class="${cls}" style="${style}" points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}"/>`;
  const line=(a,b,cls='',style='')=>`<line class="${cls}" style="${style}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
  const label=(x,y,t,k='g',cls='')=>`<text class="dl ${cls}" x="${x}" y="${y}" style="fill:${COL[k]||k}">${t}</text>`;
  /* dimension line from a to b, pushed sideways by off px (positive = right of the direction a→b) */
  function dim(a,b,t,k='g',off=18,arrows=true){
    const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L; const ox=nx*off, oy=ny*off;
    const A=[a[0]+ox,a[1]+oy], B=[b[0]+ox,b[1]+oy], sg=Math.sign(off||1); let tx=(A[0]+B[0])/2+nx*13*sg, ty=(A[1]+B[1])/2+ny*13*sg, anc='middle';
    if(Math.abs(nx)>0.8){ anc=nx*sg>0?'start':'end'; tx=(A[0]+B[0])/2+nx*sg*7; ty=(A[1]+B[1])/2; }
    const tk=6, ux=dx/L, uy=dy/L;
    return `<g class="dim" style="--dc:${COL[k]||k}">${line(A,B)}${arrows?`${line([A[0]-nx*tk,A[1]-ny*tk],[A[0]+nx*tk,A[1]+ny*tk])}${line([B[0]-nx*tk,B[1]-ny*tk],[B[0]+nx*tk,B[1]+ny*tk])}`:''}
      ${off?`${line(a,[A[0]+nx*3*Math.sign(off),A[1]+ny*3*Math.sign(off)],'ext')}${line(b,[B[0]+nx*3*Math.sign(off),B[1]+ny*3*Math.sign(off)],'ext')}`:''}
      <text x="${tx}" y="${ty}" style="text-anchor:${anc}">${t}</text></g>`;
  }
  /* right-angle marker at corner p, along unit directions u and w */
  const ra=(p,u,w,s=11)=>`<path class="ra" d="M${p[0]+u[0]*s} ${p[1]+u[1]*s}L${p[0]+u[0]*s+w[0]*s} ${p[1]+u[1]*s+w[1]*s}L${p[0]+w[0]*s} ${p[1]+w[1]*s}"/>`;

  /* ---------- 3D: oblique projection (front face true shape, depth goes back and to the right) ---------- */
  function oblique(ox,oy,s,k=.5,ang=35){ const c=Math.cos(ang*Math.PI/180)*k, sn=Math.sin(ang*Math.PI/180)*k; return (x,y,z)=>[ox+x*s+y*s*c, oy-z*s-y*s*sn]; }
  /* stack of unit cubes; cubes = list of [x,y,z]; P = projection */
  function cubes(list,P,col){
    const sorted=list.slice().sort((a,b)=>b[1]-a[1]||a[0]-b[0]||a[2]-b[2]); let s='';
    sorted.forEach(([x,y,z])=>{
      const q=(dx,dy,dz)=>P(x+dx,y+dy,z+dz), c=typeof col==='function'?col(x,y,z):col;
      s+=poly([q(0,0,1),q(1,0,1),q(1,1,1),q(0,1,1)],'cb top',`fill:${c[1]}`);
      s+=poly([q(1,0,0),q(1,1,0),q(1,1,1),q(1,0,1)],'cb side',`fill:${c[2]}`);
      s+=poly([q(0,0,0),q(1,0,0),q(1,0,1),q(0,0,1)],'cb front',`fill:${c[0]}`);
    }); return s;
  }
  /* wireframe cuboid with hidden edges dashed */
  function boxFrame(P,l,w,ht,cls='frame'){
    const c=(x,y,z)=>P(x*l,y*w,z*ht);
    const vis=[[c(0,0,0),c(1,0,0)],[c(1,0,0),c(1,0,1)],[c(1,0,1),c(0,0,1)],[c(0,0,1),c(0,0,0)],[c(0,0,1),c(0,1,1)],[c(0,1,1),c(1,1,1)],[c(1,1,1),c(1,0,1)],[c(1,0,0),c(1,1,0)],[c(1,1,0),c(1,1,1)]];
    const hid=[[c(0,0,0),c(0,1,0)],[c(0,1,0),c(1,1,0)],[c(0,1,0),c(0,1,1)]];
    return hid.map(([a,b])=>line(a,b,cls+' hid')).join('')+vis.map(([a,b])=>line(a,b,cls)).join('');
  }

  /* ---------- labelled 2D figure for practice questions (fits any shape into a box, not to scale) ----------
     spec: {pts:[[x,y]...] (maths coords, y up), dims:[{a,b,t,k,off}], dash:[[a,b]], ra:[[p,u,w]], circles:[{c,r}], polys:[{pts,fill}], extra(map)} */
  function figure(spec,W=320,H=230,pad=54){
    const all=[...(spec.pts||[]),...[].concat(...(spec.polys||[]).map(p=>p.pts))]; (spec.circles||[]).forEach(c=>{ all.push([c.c[0]-c.r,c.c[1]-c.r],[c.c[0]+c.r,c.c[1]+c.r]); });
    const xs=all.map(p=>p[0]), ys=all.map(p=>p[1]); const x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
    const s=Math.min((W-2*pad)/((x1-x0)||1),(H-2*pad)/((y1-y0)||1)); const mx=(W-(x1-x0)*s)/2, my=(H-(y1-y0)*s)/2;
    const m=p=>[mx+(p[0]-x0)*s, H-my-(p[1]-y0)*s];
    let o='';
    (spec.polys||[]).forEach(p=>o+=poly(p.pts.map(m),'fig '+(p.cls||''),p.fill?`fill:${p.fill}`:''));
    if(spec.pts) o+=poly(spec.pts.map(m),'fig main');
    (spec.circles||[]).forEach(c=>{ const C=m(c.c); o+=`<circle class="fig ${c.cls||'main'}" cx="${C[0]}" cy="${C[1]}" r="${c.r*s}"/>`; if(c.dot!==false) o+=`<circle cx="${C[0]}" cy="${C[1]}" r="2.5" fill="#1d1b16"/>`; });
    (spec.dash||[]).forEach(([a,b])=>o+=line(m(a),m(b),'hgt'));
    (spec.ra||[]).forEach(([p,u,w])=>o+=ra(m(p),[u[0],-u[1]],[w[0],-w[1]]));
    if(spec.extra) o+=spec.extra(m,s);
    (spec.dims||[]).forEach(d=>o+=dim(m(d.a),m(d.b),d.t,d.k,d.off===undefined?16:d.off,d.arrows!==false));
    return `<svg class="qfig" viewBox="0 0 ${W} ${H}">${o}</svg>`;
  }

  /* ---------- layout pieces ---------- */
  const split=(el,wide)=>{ const g=h('div',{class:'msplit'+(wide?' wide':'')}); const a=h('div',{class:'mleft'}), b=h('div',{class:'mright'}); g.append(a,b); el.appendChild(g); return {stage:a,panel:b}; };
  const formula=html=>`<div class="formula">${html}</div>`;
  /* step-through explainer: steps = [{t:'html', at(i)}]; calls go(i) */
  function steps(panel,list,go,opts={}){
    let i=0; const box=h('div',{class:'msteps'}); panel.appendChild(box);
    const draw=()=>{ box.innerHTML=`<div class="snav">${list.map((s,k)=>`<button class="${k===i?'on':k<i?'done':''}" data-k="${k}">${k+1}</button>`).join('')}<span class="hint">Step ${i+1} of ${list.length}</span></div>
      <div class="stext">${list[i].t}</div>
      <div class="row">${i>0?'<button class="btn ghost small pv">← Back</button>':''}<span style="flex:1"></span>${i<list.length-1?'<button class="btn small nx">Next step →</button>':(opts.end||'')}</div>`;
      box.querySelectorAll('.snav button').forEach(b=>b.onclick=()=>{ i=+b.dataset.k; draw(); go(i,true); });
      const pv=$('.pv',box), nx=$('.nx',box); pv&&(pv.onclick=()=>{ i--; draw(); go(i,true); }); nx&&(nx.onclick=()=>{ i++; draw(); go(i); });
    };
    draw(); go(0,true); return { get i(){ return i; } };
  }
  /* slider row: returns input */
  function slider(panel,{label,k='g',min,max,step=1,value,unit='',oninput}){
    const r=h('label',{class:'mslider',style:`--sc:${COL[k]||k}`},`<span class="sl">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><b class="sv"></b>`);
    const inp=$('input',r), out=$('.sv',r); const upd=()=>{ out.textContent=fmt(+inp.value)+(unit?' '+unit:''); oninput&&oninput(+inp.value); };
    inp.addEventListener('input',upd); panel.appendChild(r); setTimeout(upd); r.set=x=>{ inp.value=x; upd(); }; r.input=inp; return r;
  }
  function seg(panel,opts,cur,onpick){ const s=h('div',{class:'seg'}); opts.forEach(([id,t])=>{ const b=h('button',{class:id===cur?'on':''},t); b.onclick=()=>{ s.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); onpick(id); }; s.appendChild(b); }); panel.appendChild(s); return s; }
  const calc=()=>h('div',{class:'mcalc'});

  /* ---------- practice: one question at a time, number + unit checked separately ---------- */
  /* ---------- fractions ---------- */
  const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const fr=(n,d)=>d===1?`${n}`:`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
  const mixed=(n,d)=>{ const w=Math.floor(n/d), r=n%d; return w&&r?`${w}${fr(r,d)}`:w?`${w}`:fr(r,d); };
  /* "3/4", "1 2/3", "2", "0.5" → {n,d,form:'frac'|'mixed'|'int'|'dec'} or null */
  function parseFrac(s){ s=String(s).trim().replace(/\s+/g,' ');
    let m=s.match(/^(-?\d+) (\d+) ?\/ ?(\d+)$/); if(m&&+m[3]) return {n:+m[1]*+m[3]+(+m[1]<0?-1:1)*+m[2],d:+m[3],form:'mixed',fn:+m[2],fd:+m[3]};
    m=s.match(/^(-?\d+) ?\/ ?(\d+)$/); if(m&&+m[2]) return {n:+m[1],d:+m[2],form:'frac',fn:+m[1],fd:+m[2]};
    m=s.match(/^-?\d+$/); if(m) return {n:+s,d:1,form:'int'};
    m=s.match(/^-?\d*\.\d+$/); if(m){ const k=s.split('.')[1].length, d=Math.pow(10,k); return {n:Math.round(parseFloat(s)*d),d,form:'dec'}; }
    return null; }
  function parseNum(s){ s=String(s).trim().replace(/,/g,'').replace(/\s+/g,''); if(!/^-?\d*\.?\d+$/.test(s)) return NaN; return parseFloat(s); }
  function checkNum(val,q){
    if(!Number.isFinite(val)) return 'bad';
    const dp=Number.isInteger(q.dp)?q.dp:null;
    const same=(a,b)=>Math.abs(a-b)<=1e-6;
    const matches=answer=>same(val,answer)||(dp!==null&&same(val,round(answer,dp)));
    if(matches(q.ans)) return 'ok';
    if(q.pi){
      const offset=q.piOffset??0;
      const with314=offset+(q.ans-offset)*3.14/Math.PI;
      if(matches(with314)) return 'ok314';
    }
    if(dp!==null&&Math.abs(val-q.ans)<=Math.pow(10,-dp)*1.5) return 'close';
    return 'no';
  }
  function practice(el,gens,id,n,onDone,intro){
    n=n||8; const order=[]; while(order.length<n){ E.shuffle(gens).forEach(g=>order.length<n&&order.push(g)); }
    const qs=order.map(g=>g(R)); let i=0, score=0; const log=[];
    const draw=()=>{
      el.innerHTML='';
      if(i>=qs.length) return finish();
      const q=qs[i]; let unit=null, done=false;
      const units=q.kind==='frac'?[]:(q.units||[q.base||'cm',(q.base||'cm')+'²',(q.base||'cm')+'³']); const noUnit=!units.length;
      const w=h('div',{class:'mprac'});
      w.innerHTML=`<div class="qtop"><span>Question ${i+1} of ${qs.length}</span><div class="prog"><i style="width:${i/qs.length*100}%"></i></div><span>Score ${score}</span></div>
        <div class="pgrid${q.fig?'':' nofig'}"><div class="pfig">${q.fig||''}${q.fig?'<div class="hint nts">Not drawn to scale</div>':''}</div>
        <div class="pq"><div class="qtext">${q.text}</div>
          <div class="ansrow"><input class="num${q.kind==='frac'?' wide':''}" type="text" inputmode="${q.kind==='frac'?'text':'decimal'}" autocomplete="off" placeholder="${q.kind==='frac'?'e.g. 3/4 or 1 2/3':'Answer'}" aria-label="Your answer">
          ${noUnit?'':`<div class="seg units">${units.map(u=>`<button data-u="${u}">${u}</button>`).join('')}</div>`}</div>${q.kind==='frac'?'<div class="hint">Type a fraction with /, for example <b>5/8</b>, or a mixed number with a space, for example <b>2 1/4</b>.</div>':''}
          ${q.dp?`<div class="hint">Round to ${q.dp} decimal place${q.dp>1?'s':''}.${q.pi?' Use the π button on your calculator.':''}</div>`:''}
          <div class="row" style="margin-top:12px"><button class="btn ck">Check</button>${q.hint?`<button class="btn ghost small hb">${(T&&T.hintLabel)||'Show the formula'}</button>`:''}</div>
          <div class="hintbox">${q.hint||''}</div>
          <div class="fb"></div>
          <div class="qnav"><span></span><button class="btn accent nxt" disabled>${i===qs.length-1?'See results':'Next →'}</button></div></div></div>`;
      el.appendChild(w);
      const inp=$('.num',w), fb=$('.fb',w), nxt=$('.nxt',w);
      w.querySelectorAll('.units button').forEach(b=>b.onclick=()=>{ if(done) return; unit=b.dataset.u; w.querySelectorAll('.units button').forEach(x=>x.classList.toggle('on',x===b)); });
      const hb=$('.hb',w); hb&&(hb.onclick=()=>$('.hintbox',w).classList.add('show'));
      const check=()=>{
        if(done) return; const val=parseNum(inp.value);
        if(inp.value.trim()===''){ inp.focus(); return; }
        if(q.kind==='frac') return checkFrac();
        if(isNaN(val)){ fb.className='fb show bad'; fb.innerHTML='Type just the number, for example <b>42</b> or <b>12.5</b>.'; return; }
        if(!unit&&!noUnit){ fb.className='fb show warn'; fb.innerHTML='Now pick the unit too. Is it a length, an area or a volume?'; return; }
        done=true; const r=checkNum(val,q), uok=noUnit||unit===q.unit; const nok=r==='ok'||r==='ok314'; const ok=nok&&uok;
        if(ok) score++; log.push([q.text,ok]);
        inp.classList.add(nok?'ok':'no'); inp.disabled=true;
        w.querySelectorAll('.units button').forEach(b=>{ b.disabled=true; if(b.dataset.u===q.unit) b.classList.add('right'); else if(b.dataset.u===unit) b.classList.add('wrong'); });
        let msg = ok ? '<b>Correct.</b>' : nok ? `<b>Right number, wrong unit.</b> ${unitWhy(q.unit)}` : uok ? (r==='close'?'<b>Very close.</b> Check your rounding.':noUnit?'<b>Not quite.</b>':'<b>Not quite.</b> The unit is right, the number is not.') : '<b>Not quite.</b>';
        if(r==='ok314') msg+=' (You used 3.14 for π. That is fine, but the π button is more accurate.)';
        fb.className='fb show '+(ok?'good':'bad');
        fb.innerHTML=`${msg} Answer: <b>${q.show||fmt(q.ans,q.dp)}${q.unit?' '+q.unit:''}</b><div class="work">${q.work.map(x=>`<div>${x}</div>`).join('')}</div>`;
        nxt.disabled=false; nxt.focus();
      };
      /* fraction answers: value must match exactly; q.simplest needs lowest terms, q.form:'mixed' needs a mixed number */
      const checkFrac=()=>{
        const a=parseFrac(inp.value);
        if(!a){ fb.className='fb show bad'; fb.innerHTML='Write it like <b>3/4</b>, <b>2 1/3</b> or a whole number.'; return; }
        if(a.form==='dec'&&!q.allowDec){ fb.className='fb show warn'; fb.innerHTML='Give your answer as a fraction, not a decimal.'; return; }
        done=true; const [N,D]=q.ans; const equal=a.n*D===N*a.d;
        const lowest=(a.form==='frac'||a.form==='mixed')?gcd(a.fn,a.fd)===1:true;
        const wantMixed=q.form==='mixed'&&Math.abs(N)>D&&N%D!==0, wantImp=q.form==='improper'&&Math.abs(N)>D&&N%D!==0;
        const formOk=(!wantMixed||a.form==='mixed')&&(!wantImp||a.form==='frac'); const proper=a.form!=='mixed'||a.fn<a.fd;
        const ok=equal&&(!q.simplest||lowest)&&formOk&&proper;
        if(ok) score++; log.push([q.text,ok]);
        inp.classList.add(ok?'ok':'no'); inp.disabled=true;
        let msg=ok?'<b>Correct.</b>':!equal?'<b>Not quite.</b>':!lowest?'<b>Right value, but not in its simplest form.</b> Divide the top and bottom by a common factor.':!formOk?(wantImp?'<b>Right value.</b> The question asks for an improper fraction.':'<b>Right value.</b> The question asks for a mixed number.'):'<b>Right value.</b> The fraction part of a mixed number should be less than 1.';
        fb.className='fb show '+(ok?'good':'bad');
        fb.innerHTML=`${msg} Answer: <b>${q.show}</b><div class="work">${q.work.map(x=>`<div>${x}</div>`).join('')}</div>`;
        nxt.disabled=false; nxt.focus();
      };
      $('.ck',w).onclick=check; inp.addEventListener('keydown',e=>{ if(e.key==='Enter') done?nxt.click():check(); });
      nxt.onclick=()=>{ i++; draw(); }; setTimeout(()=>inp.focus({preventScroll:true}),50);
    };
    const finish=()=>{
      const pct=score/qs.length, stars=pct===1?3:pct>=.75?2:pct>=.5?1:0; if(id) E.Store.setStars(id,stars);
      el.innerHTML=`<div class="result card"><div class="hint">Your score</div><div class="big">${score} / ${qs.length}</div><div class="stars">${'★'.repeat(stars)}<span style="color:#d1d5db">${'★'.repeat(3-stars)}</span></div>
        <p>${stars===3?'Every answer right.':stars===2?'Nearly there. A new set has different numbers, so have another go.':stars===1?'Look back at See why, then try a new set.':'Go through Explore and See why first, then come back.'}</p>
        <div class="row" style="justify-content:center"><button class="btn accent" id="again">New set of questions</button></div>
        <div class="review">${log.map(([t,ok])=>`<div>${ok?'✓':'✗'} &nbsp;${t.replace(/<[^>]+>/g,'')}</div>`).join('')}</div></div>`;
      $('#again',el).onclick=()=>practice(el,gens,id,n,onDone);
      onDone&&onDone();
    };
    draw();
  }
  function unitWhy(u){ return /³/.test(u)?'This is a volume, so the unit is cubed.':/²/.test(u)?'This is an area, so the unit is squared.':'This is a length, so the unit is not squared or cubed.'; }

  /* ---------- page: nav + lesson tabs ---------- */
  const LCOL=['#2563eb','#ea580c','#059669','#db2777','#7c3aed','#0d9488','#ca8a04','#4f46e5','#dc2626','#0891b2'];
  let T, ALL;
  const dots=n=>`<span class="dots">${[0,1,2].map(i=>`<i class="${i<n?'f':''}"></i>`).join('')}</span>`;
  const sid=l=>T.id+'-'+l.id;
  function nav(cur){
    const n=$('#lessonnav'); n.innerHTML='';
    T.groups.forEach(g=>{ n.appendChild(h('div',{class:'grp'},g.name));
      g.lessons.forEach(l=>{ n.appendChild(h('a',{href:'#'+l.id,class:cur===l.id?'on':'',style:`--lc:${l.accent}`},`<span class="num">${l.code}</span><span class="micon">${shapeIcon(l.icon,20)}</span><span class="nm">${l.short}</span>${dots(E.Store.stars(sid(l)))}`)); }); });
    n.appendChild(h('div',{class:'sep'}));
    n.appendChild(h('a',{href:'#mixed',class:cur==='mixed'?'on':'',style:'--lc:#7c3aed'},`<span class="num">ALL</span><span class="nm">Mixed practice</span>${dots(E.Store.stars(T.id+'-mixed'))}`));
    n.appendChild(h('a',{href:'#formulas',class:cur==='formulas'?'on':'',style:'--lc:#0d9488'},`<span class="num">f(x)</span><span class="nm">${T.sheetTitle||'Formula sheet'}</span>`));
    const on=n.querySelector('.on'); if(on&&innerWidth<900) on.scrollIntoView({inline:'center',block:'nearest'});
    $('#xp').innerHTML=`<b>★</b> ${E.Store.total()} stars`;
  }
  function setAccent(c){ const r=document.documentElement.style; r.setProperty('--accent',c); r.setProperty('--accent-soft',c+'1f'); r.setProperty('--accent-ink',c); }
  function header(c,code,title,hook,formulaHtml,prev,next,ic){
    c.appendChild(h('div',{class:'lhead'},`<div class="ttl"><span class="ico lg">${shapeIcon(ic,34)}</span><div><div class="code">${code}</div><h1>${title}</h1>${hook?`<p>${hook}</p>`:''}</div></div>
      ${formulaHtml?`<div class="hformula">${formulaHtml}</div>`:''}
      <div class="pn">${prev?`<a class="btn ghost small" href="#${prev[0]}">← ${prev[1]}</a>`:''}${next?`<a class="btn ghost small" href="#${next[0]}">${next[1]} →</a>`:''}</div>`));
  }
  function tabs(c,defs,active,base){
    const bar=h('div',{class:'tabbar',role:'tablist'}), panel=h('div',{class:'mpanel-tab'});
    defs.forEach(t=>{ const b=h('button',{class:t.id===active?'on':'',role:'tab'},t.label); b.onclick=()=>{ history.replaceState(null,'','#'+base+'/'+t.id); show(t.id); }; t.btn=b; bar.appendChild(b); });
    const show=id=>{ defs.forEach(t=>t.btn.classList.toggle('on',t.id===id)); panel.innerHTML=''; (defs.find(t=>t.id===id)||defs[0]).render(panel); };
    c.append(bar,panel); show(active||defs[0].id);
  }
  const K={ gcd, lcm, fr, mixed, COL, SOFT, v, R, fmt, round, tween, stage, handle, grid, poly, line, label, dim, ra, oblique, cubes, boxFrame, figure, split, formula, steps, slider, seg, calc, h, $, toast:E.toast, shuffle:E.shuffle };
  function renderLesson(l,tab){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c);
    const k=ALL.indexOf(l), pv=ALL[k-1], nx=ALL[k+1]; setAccent(l.accent);
    header(c,'Lesson '+l.code,l.title,l.hook,l.formula,pv&&[pv.id,pv.short],nx?[nx.id,nx.short]:['mixed','Mixed practice'],l.icon);
    tabs(c,[
      {id:'explore',label:'Explore',render(p){ l.explore(p,K); }},
      {id:'why',label:'See why',render(p){ l.see(p,K); }},
      {id:'practice',label:'Practice',render(p){ const d=h('div',{class:'card'}); p.appendChild(d); practice(d,l.practice,sid(l),8,()=>nav(l.id)); }}
    ],tab,l.id);
  }
  function renderMixed(){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c); setAccent('#7c3aed');
    const last=ALL[ALL.length-1];
    header(c,'Whole topic','Mixed practice',T.mixedHook||'Ten questions from every lesson, mixed up. You need to decide which formula to use.',null,[last.id,last.short],['formulas','Formula sheet'],'mixed');
    const gens=[].concat(...ALL.map(l=>l.practice)); const d=h('div',{class:'card'}); c.appendChild(d); practice(d,gens,T.id+'-mixed',10,()=>nav('mixed'));
  }
  function renderFormulas(){
    const m=$('#main'); m.innerHTML=''; const c=h('div',{class:'content'}); m.appendChild(c); setAccent('#0d9488');
    header(c,'Summary',T.sheetTitle||'Formula sheet',T.sheetHook||'Every formula from this topic on one page. Tap a card to open its lesson.',null,['mixed','Mixed practice'],null,'formulas');
    T.groups.forEach(g=>{ c.appendChild(h('h2',{class:'fgrp'},g.name)); const grid=h('div',{class:'fsheet'});
      g.lessons.forEach(l=>grid.appendChild(h('a',{class:'fcard',href:'#'+l.id,style:`--lc:${l.accent}`},`<span class="fi">${shapeIcon(l.icon,30)}</span><div><b>${l.short}</b>${l.formula}${l.remember?`<span class="hint">${l.remember}</span>`:''}</div>`)));
      c.appendChild(grid); });
  }
  function route(){
    const [id,tab]=(location.hash||'#'+ALL[0].id).slice(1).split('/');
    if(id==='mixed') renderMixed(); else if(id==='formulas') renderFormulas();
    else renderLesson(ALL.find(l=>l.id===id)||ALL[0],tab);
    nav(id); scrollTo(0,0);
  }

  /* ---------- shape icons (line drawings, currentColor) ---------- */
  const SI={
    equiv:'<rect x="3" y="5" width="18" height="5"/><path d="M9 5v5M15 5v5"/><rect x="3" y="14" width="18" height="5"/><path d="M6 14v5M9 14v5M12 14v5M15 14v5M18 14v5" opacity=".6"/>',
    mixfr:'<rect x="2.5" y="8" width="8" height="8"/><rect x="13.5" y="8" width="8" height="8"/><path d="M17.5 8v8M13.5 12h8" opacity=".6"/><path d="M2.5 8l8 8M2.5 12l4 4" opacity=".35"/>',
    addfr:'<rect x="3" y="4" width="18" height="5"/><path d="M12 4v5"/><path d="M12 12v6M9 15h6"/><rect x="3" y="20" width="18" height="0.1"/>',
    mulfr:'<rect x="4" y="4" width="16" height="16"/><path d="M9.3 4v16M14.6 4v16M4 12h16"/><path d="M4 12h10.6V20H4z" fill="currentColor" opacity=".25"/>',
    divfr:'<path d="M3 9h18"/><path d="M3 15h4.5M8.5 15H13M14 15h4.5" stroke-width="3"/><path d="M3 6v6M21 6v6"/>',
    f2d:'<rect x="3" y="4" width="18" height="5"/><path d="M12 4v5"/><path d="M12 4h-9v5h9z" fill="currentColor" opacity=".25"/><path d="M3 17h18M3 14.5v5M21 14.5v5M12 15v4"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/><path d="M12 10.5v3" stroke-dasharray="1.5 1.5"/>',
    p10:'<path d="M3 6h18v12H3zM9 6v12M15 6v12"/><circle cx="15" cy="15" r="1" fill="currentColor"/><path d="M13 3l-3 0M10 3l1.5-1.2M10 3l1.5 1.2"/>',
    rounding:'<path d="M3 15h18M3 12v6M21 12v6M12 13.5v3"/><path d="M15 15c0-5 4-7 6-7" /><circle cx="15" cy="15" r="1.6" fill="currentColor"/><path d="M19 7l2 1-1 2"/>',
    perim:'<path d="M4 18V8h9v-3h7v13z"/><circle cx="4" cy="18" r="1.6" fill="currentColor"/>',
    circum:'<circle cx="9" cy="11" r="5.5"/><path d="M2 18.5h20"/><path d="M9 16.5h8" stroke-dasharray="2 2"/>',
    rect:'<rect x="3.5" y="6" width="17" height="12"/><path d="M3.5 10h17M3.5 14h17M8 6v12M12 6v12M16 6v12" opacity=".35"/>',
    tri:'<path d="M3 19h18L9 5z"/><path d="M9 5v14" stroke-dasharray="2 2"/>',
    para:'<path d="M3 18h13l5-12H8z"/><path d="M8 6v12" stroke-dasharray="2 2"/>',
    trap:'<path d="M2.5 18h19l-5-12h-8z"/><path d="M8.5 6v12" stroke-dasharray="2 2"/>',
    circle:'<circle cx="12" cy="12" r="8.5"/><path d="M12 12h8.5"/><circle cx="12" cy="12" r=".8"/>',
    comp:'<path d="M3.5 4h9v7h8v9h-17z"/><path d="M12.5 11H3.5" stroke-dasharray="2 2"/>',
    cuboid:'<path d="M3 9h12v11H3zM3 9l5-4h12l-5 4M15 20l5-4V5"/>',
    prism:'<path d="M3 19h11L8.5 8zM8.5 8l6-4 5.5 11-6 4M14 19"/>',
    cyl:'<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/>',
    units:'<path d="M3 17h18M5 17v-3M9 17v-2M13 17v-3M17 17v-2M21 17v-3"/><rect x="5" y="4" width="7" height="7"/>',
    mixed:'<path d="M3 20h8l-4-7zM13.5 13h7v7h-7z"/><circle cx="7" cy="7" r="3.5"/><path d="M15 4l3.5 6h-7z"/>',
    formulas:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>'
  };
  function shapeIcon(k,size=22){ return `<svg class="svgi" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SI[k]||SI.rect}</svg>`; }

  window.MathsEngine={ K, practice, parseFrac, start(t){ T=t; ALL=[].concat(...t.groups.map(g=>g.lessons)); ALL.forEach((l,i)=>l.accent=l.accent||LCOL[i%LCOL.length]);
    document.title=t.title+' · Maths'; addEventListener('hashchange',route); route(); } };
})();
