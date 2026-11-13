/* ===== Perimeter and circumference: interactive "Explore" and "See why" widgets =====
   Cues, running totals and sums are drawn ON the diagram (joe: Dora watches the picture). */
window.AV=window.AV||{};
(function(){
  const W=760, H=420, S=32, OX=84, OY=372, COLS=12, ROWS=10;      // grid: 1 square = 1 cm
  const X=u=>OX+u*S, Y=v=>OY-v*S, P=([u,v])=>[X(u),Y(v)];
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const SX=OX+COLS*S+34;                                            // left edge of the on-diagram sum column
  const SIDE=['#2563eb','#059669','#ea580c','#7c3aed','#db2777','#0891b2'];
  const bg=K=>K.grid(OX,OY-ROWS*S,COLS,ROWS,S);
  const hdl=(n,x,y,k,pulse)=>`<g class="hdl${pulse?' pulse':''}" data-h="${n}" transform="translate(${x},${y})" style="--hc:${k}"><circle class="hit" r="20"/><circle class="ring" r="11"/><circle class="dot" r="5"/></g>`;
  const tag=(x,y,t,anchor='start')=>`<g class="pcue"><text x="${x}" y="${y}" style="text-anchor:${anchor}">${t}</text></g>`;
  const btn=(id,x,y,w,t,on)=>`<g class="sbtn${on?' on':''}" data-b="${id}" transform="translate(${x},${y})"><rect width="${w}" height="30" rx="2"/><text x="${w/2}" y="20">${t}</text></g>`;
  /* clicks on SVG buttons */
  const top=(p,K)=>{ const panel=K.h('div',{class:'mtopsteps'}), box=K.h('div',{class:'mleft mfull'}); p.append(panel,box); return {panel,stage:box}; };
  const LOFF=[18,18,-18,-18,18,18];
  const onBtn=(svg,fn)=>svg.addEventListener('click',e=>{ const b=e.target.closest('[data-b]'); if(b) fn(b.dataset.b); });

  /* ---------- walking round a polygon ---------- */
  const sideLens=pts=>pts.map((p,i)=>{ const q=pts[(i+1)%pts.length]; return Math.hypot(q[0]-p[0],q[1]-p[1]); });
  /* position after travelling d cm from the first corner */
  function along(pts,d){ const L=sideLens(pts); let k=0; while(k<L.length-1&&d>L[k]){ d-=L[k]; k++; } d=Math.min(d,L[k]); const a=pts[k], b=pts[(k+1)%pts.length], t=L[k]?d/L[k]:0; return {k,pt:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]}; }
  /* the shape with side labels, walked part highlighted. walked = cm travelled (or Infinity for all) */
  function walkDraw(K,pts,walked,o={}){
    const L=sideLens(pts), tot=L.reduce((a,b)=>a+b,0); let s='';
    s+=K.poly(pts.map(P),'shape',o.fill?`fill:${o.fill}`:'');
    if(o.ghost) s+=K.poly(o.ghost.map(P),'shape ghost');
    const done=walked>=tot-1e-9; const pos=done?{k:L.length,pt:pts[0]}:along(pts,walked);
    pts.forEach((p,i)=>{ const q=pts[(i+1)%pts.length], col=o.pairs?o.pairs[i]:SIDE[i%SIDE.length];
      if(i<pos.k) s+=K.line(P(p),P(q),'pside','stroke:'+col);
      else if(i===pos.k&&walked>0) s+=K.line(P(p),P(pos.pt),'pside','stroke:'+col);
      const lab=o.labels?o.labels[i]:K.fmt(L[i])+' cm';
      if(lab!=='') s+=K.dim(P(p),P(q),lab,(i<pos.k||!o.colourOnWalk)?col:'#7a7366',pts.length===6?LOFF[i]:18,false);
    });
    if(walked>0&&!done){ const c=P(pos.pt); s+=`<circle class="walker" cx="${c[0]}" cy="${c[1]}" r="8"/>`; }
    if(walked===0&&o.start){ const c=P(pts[0]); s+=`<circle class="walker" cx="${c[0]}" cy="${c[1]}" r="8"/>`+tag(c[0]-12,c[1]+30,'start here','end'); }
    return {svg:s, k:pos.k, done, L, tot};
  }
  /* the running sum, written in a column to the right of the grid */
  function sumColumn(K,L,k,done,o={}){
    let s=`<text class="sumh" x="${SX}" y="${Y(ROWS)+10}">${o.title||'Perimeter'}</text><text class="sums" x="${SX}" y="${Y(ROWS)+32}">add every side</text>`;
    const n=done?L.length:k; let run=0;
    L.forEach((l,i)=>{ if(i>=n&&!(o.all)) return; run+=l; const y=Y(ROWS)+64+i*28;
      s+=`<text class="sumv" x="${SX+70}" y="${y}" style="fill:${o.pairs?o.pairs[i]:SIDE[i%SIDE.length]}">${i?'+ ':''}${K.fmt(l)}</text>`; });
    if(done||o.all){ const y=Y(ROWS)+64+L.length*28-10; const T=L.reduce((a,b)=>a+b,0);
      s+=`<line x1="${SX}" y1="${y}" x2="${SX+190}" y2="${y}" stroke="#1d1b16" stroke-width="1.5"/><text class="sumt" x="${SX+8}" y="${y+30}">= ${K.fmt(T)} cm</text>`; }
    else if(o.walking) s+=`<text class="sums" x="${SX+70}" y="${Y(ROWS)+64+n*28}">…</text>`;
    return s;
  }

  /* ================= P1 perimeter: Explore ================= */
  AV.perim={
    explore(p,K){
      const box=K.h('div',{class:'mleft mfull'}); p.appendChild(box); const st=K.stage(box,W,H);
      let mode='rect', l=7, w=4, Wd=10, Ht=7, cw=4, ch=3, walked=Infinity, stop=()=>{}, cued=false;
      const shape=()=>mode==='rect'?[[0,0],[l,0],[l,w],[0,w]]:[[0,0],[Wd,0],[Wd,Ht-ch],[Wd-cw,Ht-ch],[Wd-cw,Ht],[0,Ht]];
      const draw=()=>{ const pts=shape(); const r=walkDraw(K,pts,walked,{});
        let s=bg(K)+r.svg+sumColumn(K,r.L,r.k,r.done,{walking:walked>0});
        if(r.done&&mode==='rect') s+=`<text class="sums" x="${SX}" y="${Y(ROWS)+64+4*28+56}">shortcut: 2 × (${l} + ${w}) = ${2*(l+w)}</text>`;
        if(r.done) s+=`<text class="sums" x="${SX}" y="${Y(ROWS)+64+pts.length*28+(mode==='rect'?84:46)}">area = ${mode==='rect'?l*w:Wd*Ht-cw*ch} cm² (a different thing)</text>`;
        s+=btn('rect',OX,8,110,'Rectangle',mode==='rect')+btn('L',OX+118,8,90,'L-shape',mode==='L')+btn('walk',OX+COLS*S-140,8,140,'Walk round',false);
        if(mode==='rect') s+=hdl('c',X(l),Y(w),'#2563eb',!cued);
        else s+=hdl('c',X(Wd),Y(Ht-ch),'#ea580c',!cued)+hdl('d',X(Wd-cw),Y(Ht),'#2563eb',!cued);
        if(!cued){ const hx=mode==='rect'?X(l):X(Wd), hy=mode==='rect'?Y(w):Y(Ht-ch); s+=tag(hx+18,hy-14,'drag a corner'); s+=`<g class="pcue"><text x="${OX+COLS*S-70}" y="56" style="text-anchor:middle">then press</text></g>`; }
        st.draw(s); };
      st.svg.addEventListener('pointerdown',()=>{ if(!cued){ cued=true; } });
      st.onDrag((n,x,y,end)=>{ if(x===null){ draw(); return; } stop(); walked=Infinity; const u=Math.round((x-OX)/S), v=Math.round((OY-y)/S);
        if(mode==='rect'){ l=clamp(u,1,COLS-1); w=clamp(v,1,ROWS-2); }
        else if(n==='c'){ const left=Wd-cw; Wd=clamp(u,left+1,COLS-1); cw=Wd-left; ch=clamp(Ht-v,1,Ht-1); }
        else { cw=clamp(Wd-u,1,Wd-1); const low=Ht-ch; Ht=clamp(v,low+1,ROWS-2); ch=Ht-low; }
        draw(); });
      onBtn(st.svg,b=>{ cued=true; stop();
        if(b==='rect'||b==='L'){ mode=b; walked=Infinity; draw(); return; }
        const tot=sideLens(shape()).reduce((a,c)=>a+c,0); stop=K.tween(0,tot,Math.min(6000,tot*220),d=>{ walked=d>=tot?Infinity:d; draw(); }); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{};
      const R=[[0,0],[6,0],[6,4],[0,4]], Lsh=[[0,0],[10,0],[10,5],[6,5],[6,8],[0,8]];
      const pair=['#2563eb','#059669','#2563eb','#059669'];
      const walk=(pts,o,ms)=>{ const tot=sideLens(pts).reduce((a,b)=>a+b,0); stop=K.tween(0,tot,ms,d=>{ const r=walkDraw(K,pts,d>=tot?Infinity:d,o); st.draw(bg(K)+r.svg+sumColumn(K,r.L,r.k,r.done,{...o,walking:d>0})+(o.extra||'')); }); };
      K.steps(panel,[
        {t:`<p>The <b>perimeter</b> is the total distance all the way round the edge of a shape.</p><p>Walk round and add up every side.</p>`},
        {t:`<p>A rectangle has two equal <b>lengths</b> and two equal <b>widths</b>.</p>${K.formula(`P = 2 × (${K.v('b','l')} + ${K.v('w','w')})`)}<p>2 × (6 + 4) = 20 cm, the same as walking round.</p>`},
        {t:`<p>Some sides of this shape are missing. Work them out from the sides opposite.</p><p>10 − 6 = <b>4 cm</b> and 8 − 5 = <b>3 cm</b>.</p>`},
        {t:`<p>Now add <b>all six</b> sides.</p><p class="mnote"><b>Perimeter is a length</b>, so its unit is cm, not cm².</p>`},
        {t:`<p>Push the two inner sides out to the corner. The shape becomes a 10 × 8 rectangle with the <b>same perimeter</b>: 2 × (10 + 8) = 36 cm.</p><p class="mnote">This works for L-shapes, but the <b>area</b> does change.</p>`}
      ],i=>{ stop();
        if(i===0) walk(R,{},3000);
        if(i===1){ const r=walkDraw(K,R,Infinity,{pairs:pair}); st.draw(bg(K)+r.svg+sumColumn(K,r.L,r.k,true,{pairs:pair})+`<text class="sums" x="${SX}" y="${Y(ROWS)+64+4*28+56}" style="fill:#1d1b16">2 × (6 + 4) = 20 cm</text>`); }
        if(i===2){ const r=walkDraw(K,Lsh,0,{labels:['10 cm','5 cm','? = 4 cm','? = 3 cm','6 cm','8 cm']}); st.draw(bg(K)+r.svg+K.line(P([6,8]),P([10,8]),'hgt','stroke:#b9ad94')+K.line(P([10,5]),P([10,8]),'hgt','stroke:#b9ad94')+`<text class="sums" x="${SX}" y="${Y(ROWS)+20}">10 − 6 = 4</text><text class="sums" x="${SX}" y="${Y(ROWS)+48}">8 − 5 = 3</text>`); }
        if(i===3) walk(Lsh,{},4200);
        if(i===4) stop=K.tween(0,1,1800,t=>{ const pts=[[0,0],[10,0],[10,5+3*t],[6+4*t,5+3*t],[6+4*t,8],[0,8]];
          const lab=sideLens(pts).map((x,k)=>t>.98&&(k===2||k===3)?'':K.fmt(x,1)+' cm');
          const r=walkDraw(K,pts,Infinity,{labels:lab,ghost:t<1?Lsh:null}); st.draw(bg(K)+r.svg+(t>.98?`<text class="sumt" x="${SX}" y="${Y(ROWS)+40}">2 × (10 + 8)</text><text class="sumt" x="${SX}" y="${Y(ROWS)+76}">= 36 cm</text>`:'')); });
      }); }
  };

  /* ================= P2 circumference: rolling wheel ================= */
  const GY=300, X0=100;                                    // ground line and start of the roll
  function wheelDraw(K,r,s,o={}){
    const R=r*S, C=2*Math.PI*R, d=2*R, cx=X0+s, cy=GY-R, ang=s/R; let out='';
    out+=`<line x1="30" y1="${GY}" x2="${W-20}" y2="${GY}" stroke="#1d1b16" stroke-width="2"/>`;
    /* diameter rods laid along the ground */
    if(o.rods!==false){ for(let k=0;k<4;k++){ const a=X0+k*d, b=Math.min(X0+(k+1)*d,X0+C); if(a>=X0+C) break; const full=b-a>d-0.5;
      out+=`<rect x="${a+1}" y="${GY+14}" width="${b-a-2}" height="12" fill="${full?'#bfdbfe':'#fdba74'}" stroke="${full?'#2563eb':'#ea580c'}"/>`;
      out+=`<text class="rodl" x="${(a+b)/2}" y="${GY+44}" style="fill:${full?'#2563eb':'#ea580c'}">${full?'d':'a bit'}</text>`; }
      out+=`<line x1="${X0+C}" y1="${GY-6}" x2="${X0+C}" y2="${GY+32}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>`;
      out+=`<text class="rodl" x="${X0+C}" y="${GY+62}" style="fill:#dc2626">one turn</text>`; }
    /* paint left on the ground by the rim */
    out+=`<line x1="${X0}" y1="${GY}" x2="${cx}" y2="${GY}" stroke="#dc2626" stroke-width="6" stroke-linecap="round"/>`;
    /* the wheel */
    out+=`<g transform="translate(${cx},${cy}) rotate(${ang*180/Math.PI})">`;
    out+=`<circle r="${R}" fill="#fffdf8" stroke="#1d1b16" stroke-width="2.5"/>`;
    for(let k=0;k<6;k++){ const a=k*Math.PI/3; out+=`<line x1="0" y1="0" x2="${R*Math.cos(a)}" y2="${R*Math.sin(a)}" stroke="#d6ccb6" stroke-width="1.5"/>`; }
    const left=Math.max(0,2*Math.PI-ang);   // rim not yet painted (red arc shrinking)
    if(left>0.001){ const a0=Math.PI/2, a1=a0+left; const p0=[R*Math.cos(a0),R*Math.sin(a0)], p1=[R*Math.cos(a1),R*Math.sin(a1)];
      out+=left>=2*Math.PI-0.001?`<circle r="${R}" fill="none" stroke="#dc2626" stroke-width="5"/>`:`<path d="M${p0[0]} ${p0[1]}A${R} ${R} 0 ${left>Math.PI?1:0} 1 ${p1[0]} ${p1[1]}" fill="none" stroke="#dc2626" stroke-width="5"/>`; }
    out+=`<circle cx="0" cy="${R}" r="5" fill="#dc2626"/>`;
    out+=`</g>`;
    out+=`<line x1="${cx-R}" y1="${cy}" x2="${cx+R}" y2="${cy}" stroke="#2563eb" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="3"/>`;
    out+=`<text class="dl" x="${cx}" y="${cy-Math.max(22,R*.45)}" style="fill:#2563eb">d = ${K.fmt(2*r)} cm</text>`;
    return {svg:out, cx, cy, R, C};
  }
  AV.circum={
    explore(p,K){
      const box=K.h('div',{class:'mleft mfull'}); p.appendChild(box); const st=K.stage(box,W,H);
      let r=1.5, s=0, cued=false;
      const draw=()=>{ const w=wheelDraw(K,r,s); let o=w.svg; const dist=s/S, turns=s/w.C, done=s>=w.C-0.5;
        o+=hdl('roll',w.cx,w.cy,'#dc2626',!cued);
        if(s===0) o+=hdl('r',w.cx,w.cy-w.R,'#2563eb',!cued);
        if(!cued){ o+=tag(w.cx+w.R+14,w.cy+4,'roll me →')+tag(w.cx+16,w.cy-w.R-12,'drag to resize'); }
        /* live sum, on the diagram */
        o+=`<text class="sumh" x="${W-30}" y="40" style="text-anchor:end">${done?'One full turn':'Rolled'}</text>`;
        o+=`<text class="sumt" x="${W-30}" y="76" style="text-anchor:end">${K.fmt(dist,2)} cm</text>`;
        o+=`<text class="sums" x="${W-30}" y="102" style="text-anchor:end">${K.fmt(turns,2)} ${Math.abs(turns-1)<1e-9?'turn':'turns'}</text>`;
        if(done) o+=`<text class="sums" x="${W-30}" y="134" style="text-anchor:end;fill:#1d1b16">${K.fmt(dist,2)} ÷ ${K.fmt(2*r)} = <tspan style="font-weight:700;fill:#dc2626">3.14…</tspan></text><text class="sums" x="${W-30}" y="160" style="text-anchor:end">The rim is π × d long, whatever the size.</text>`;
        o+=btn('reset',30,8,80,'Reset',false);
        st.draw(o); };
      st.svg.addEventListener('pointerdown',()=>{ cued=true; });
      st.onDrag((n,x,y)=>{ if(x===null){ draw(); return; } const R=r*S, C=2*Math.PI*R;
        if(n==='roll'){ s=clamp(x-X0,0,C); if(C-s<6) s=C; }
        else { r=clamp(Math.round((GY-y)/S/2*2)/2,1,2.5); }
        draw(); });
      onBtn(st.svg,b=>{ if(b==='reset'){ s=0; draw(); } });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const r=2, R=r*S, C=2*Math.PI*R;
      const parts=()=>{ const cx=250, cy=200; return `<circle cx="${cx}" cy="${cy}" r="${R*2}" fill="#fffdf8" stroke="#dc2626" stroke-width="5"/>`
        +`<line x1="${cx}" y1="${cy}" x2="${cx+R*2*Math.cos(-.6)}" y2="${cy+R*2*Math.sin(-.6)}" stroke="#7c3aed" stroke-width="3"/>`
        +`<line x1="${cx-R*2}" y1="${cy}" x2="${cx+R*2}" y2="${cy}" stroke="#2563eb" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="3"/>`
        +K.label(cx+20,cy-62,'radius r','r')+K.label(cx,cy+22,'diameter d = 2r','b')+K.label(cx+R*2+90,cy,'circumference','#dc2626')+K.label(cx+R*2+90,cy+22,'(the edge)','#dc2626'); };
      const semi=()=>{ const cx=380, cy=270, Rr=130; return `<path d="M${cx-Rr} ${cy}A${Rr} ${Rr} 0 0 1 ${cx+Rr} ${cy}" fill="#fde7d6" stroke="#dc2626" stroke-width="5"/><line x1="${cx-Rr}" y1="${cy}" x2="${cx+Rr}" y2="${cy}" stroke="#2563eb" stroke-width="5"/>`
        +K.label(cx,cy-Rr-16,'curved edge = ½ × π × d','#dc2626')+K.label(cx,cy+26,'straight edge = d','b')+`<text class="sumt" x="${cx}" y="${cy+76}" style="text-anchor:middle">perimeter = ½πd + d</text>`; };
      K.steps(panel,[
        {t:`<p>The perimeter of a circle has its own name: the <b>circumference</b>.</p><p>The <b>radius</b> ${K.v('r','r')} goes from the centre to the edge. The <b>diameter</b> ${K.v('b','d')} goes right across, so d = 2r.</p>`},
        {t:`<p>Roll the circle along the ground for exactly <b>one turn</b>. The red line it leaves is as long as its circumference.</p>`},
        {t:`<p>Lay diameters along that line. Three fit, with a bit left over.</p><p>For <b>every</b> circle, circumference ÷ diameter = 3.14159… This number is called <b>π</b> (pi).</p>`},
        {t:`<p>So the circumference is π lots of the diameter:</p>${K.formula(`C = π${K.v('b','d')}<small>or, because d = 2r,</small>C = 2π${K.v('r','r')}`)}`},
        {t:`<p>A <b>semicircle</b> has a curved edge <b>and</b> a straight edge.</p><p>Perimeter = half the circumference + the diameter.</p><p class="mnote"><b>Common mistake:</b> forgetting the straight edge.</p>`}
      ],i=>{ stop();
        if(i===0) st.draw(parts());
        if(i===1) stop=K.tween(0,C,2600,s=>st.draw(wheelDraw(K,r,s,{rods:false}).svg+`<text class="sumt" x="${W-30}" y="60" style="text-anchor:end">${s>=C-1?'C = '+K.fmt(C/S,2)+' cm':''}</text>`));
        if(i===2) stop=K.tween(0,1,1200,t=>st.draw(wheelDraw(K,r,C,{}).svg+`<text class="sumt" x="${W-30}" y="60" style="text-anchor:end;opacity:${t}">${K.fmt(C/S,2)} ÷ ${K.fmt(2*r)} = 3.14…</text>`));
        if(i===3) st.draw(wheelDraw(K,r,C,{}).svg+`<text class="sumt" x="${W-30}" y="60" style="text-anchor:end">C = π × ${K.fmt(2*r)} = ${K.fmt(C/S,2)} cm</text>`);
        if(i===4) st.draw(semi());
      }); }
  };
})();
