/* ===== Area: interactive "See why" and "Explore" widgets =====
   Every 2D drawing uses the same grid: 1 square = 1 cm, 30 px. */
window.AV=window.AV||{};
(function(){
  const S=30, OX=64, OY=326, COLS=16, ROWS=10, W=576, H=376;
  const X=u=>OX+u*S, Y=v=>OY-v*S, P=([u,v])=>[X(u),Y(v)];
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const snapU=px=>Math.round((px-OX)/S), snapV=py=>Math.round((OY-py)/S);
  const bg=K=>K.grid(OX,OY-ROWS*S,COLS,ROWS,S);
  const cm2=n=>`${n} cm²`;

  /* ================= A1 rectangle ================= */
  function rectDraw(K,l,w,o={}){
    let s=bg(K); const x0=X(0), y0=Y(w);
    s+=`<rect class="shape" x="${x0}" y="${y0}" width="${l*S}" height="${w*S}" style="stroke:none"/>`;
    if(o.squares!==false){ let n=0; for(let j=w-1;j>=0;j--) for(let i=0;i<l;i++){ n++; const lit=o.count!==undefined&&n<=o.count, row=o.row!==undefined&&(w-1-j)<o.row;
        const show=o.count===undefined||lit; if(!show&&o.row===undefined) continue;
        s+=`<rect class="us ${lit||row?'lit':''}" x="${X(i)+1}" y="${Y(j+1)+1}" width="${S-2}" height="${S-2}"/>`;
        if((o.num&&o.count===undefined)||lit) s+=`<text class="cnt" x="${X(i)+S/2}" y="${Y(j+1)+S/2}">${n}</text>`; } }
    if(o.row!==undefined) for(let r=0;r<Math.min(o.row,w);r++) s+=`<text class="dl" x="${X(l)+44}" y="${Y(w-r)+S/2}" style="fill:${K.COL.w};font-size:13px">row ${r+1}: ${l}</text>`;
    s+=`<rect class="shape" x="${x0}" y="${y0}" width="${l*S}" height="${w*S}" style="fill:none"/>`;
    s+=K.dim([X(0),Y(0)],[X(l),Y(0)],`${l} cm`,'b',18);
    s+=K.dim([X(0),Y(w)],[X(0),Y(0)],`${w} cm`,"w",18);
    return s;
  }
  AV.rect={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const l=5,w=3; let stop=()=>{};
      K.steps(panel,[
        {t:`<p><b>Area</b> is how much flat surface a shape covers.</p><p>We measure it by counting <b>unit squares</b>. Each one is 1 cm by 1 cm, which we call <b>1 cm²</b> (one square centimetre).</p>`},
        {t:`<p>Count the squares in this rectangle one at a time.</p><p>There are <b>15</b>, so the area is <b>15 cm²</b>.</p>`},
        {t:`<p>Counting one by one is slow. Count in rows instead.</p><p>There are ${K.v('w','3')} rows, and each row has ${K.v('b','5')} squares.</p><p>${K.v('w','3')} × ${K.v('b','5')} = 15 squares.</p>`},
        {t:`<p>The number of squares in a row is the <b>length</b>. The number of rows is the <b>width</b>. So for any rectangle:</p>${K.formula(`Area = ${K.v('b','l')} × ${K.v('w','w')}`)}<p class="mnote">The unit is <b>squared</b> (cm², m², mm²) because we are counting squares.</p>`}
      ],(i)=>{ stop();
        if(i===0){ let s=rectDraw(K,l,w,{squares:false}); s+=`<rect class="us lit" x="${X(0)+1}" y="${Y(1)+1}" width="${S-2}" height="${S-2}" style="opacity:.75"/>`+K.label(X(0)+S/2,Y(1)+S+22,'1 cm²','b'); s+=K.dim([X(0),Y(1)],[X(1),Y(1)],'1 cm','b',-14,false); st.draw(s); }
        if(i===1){ stop=K.tween(0,15,2200,c=>st.draw(rectDraw(K,l,w,{count:Math.round(c)}))); }
        if(i===2){ stop=K.tween(0,3,1500,r=>st.draw(rectDraw(K,l,w,{row:Math.ceil(r-0.01)}))); }
        if(i===3){ st.draw(rectDraw(K,l,w,{})+`<text class="big-a" x="${X(l/2)}" y="${Y(w/2)}">15 cm²</text>`); }
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let l=6,w=4,num=false,sq=true; const found=new Set();
      const c=K.calc(); const tg=K.h('div',{class:'toggles'}); const ch=K.h('div',{class:'mnote'});
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the round handle to change the size of the rectangle.'),c,tg,ch);
      [['Unit squares',()=>sq=!sq,()=>sq],['Number them',()=>num=!num,()=>num]].forEach(([t,f,g])=>{ const b=K.h('button',{class:'tg'+(g()?' on':'')},t); b.onclick=()=>{ f(); b.classList.toggle('on',g()); draw(); }; tg.appendChild(b); });
      const draw=()=>{ st.draw(rectDraw(K,l,w,{squares:sq,num})+K.handle('c',X(l),Y(w),'b'));
        c.innerHTML=`<span class="hint">Area = length × width</span>${K.v('b',l)} × ${K.v('w',w)} = <span class="res">${l*w} cm²</span><span class="hint">${w} rows of ${l} squares</span>`;
        if(l*w===24) found.add([l,w].sort((a,b)=>a-b).join('×'));
        ch.innerHTML=`<b>Challenge.</b> Make three different rectangles that each have an area of 24 cm². Found: ${found.size?[...found].map(x=>x.replace('×',' cm × ')+' cm').join(', '):'none yet'}${found.size>=3?'. All three found.':''}`; };
      st.onDrag((n,x,y)=>{ if(x===null) return; l=clamp(snapU(x),1,COLS-1); w=clamp(snapV(y),1,ROWS-1); draw(); }); draw(); }
  };

  /* ================= A2 triangle ================= */
  /* base from (0,0) to (b,0), apex at (a,h) in cm */
  function triDraw(K,b,h,a,o={}){
    let s=bg(K); const BL=[0,0],BR=[b,0],A=[a,h],F=[a,0],TL=[0,h],TR=[b,h];
    if(o.rect) s+=K.poly([BL,BR,TR,TL].map(P),'shape ghost');
    if(o.halves){ s+=K.poly([BL,F,A].map(P),'shape','fill:#e3e9f6;stroke:none')+K.poly([F,BR,A].map(P),'shape','fill:#dcece2;stroke:none'); }
    else s+=K.poly([BL,BR,A].map(P),'shape','stroke:none');
    if(o.out!==undefined){ const t=o.out; // outside pieces rotate onto the inside pieces
      const rot=(pts,c,ang)=>pts.map(([x,y])=>{ const dx=x-c[0],dy=y-c[1],ca=Math.cos(ang),sa=Math.sin(ang); return [c[0]+dx*ca-dy*sa,c[1]+dx*sa+dy*ca]; });
      const m1=[(BL[0]+A[0])/2,(BL[1]+A[1])/2], m2=[(BR[0]+A[0])/2,(BR[1]+A[1])/2];
      s+=K.poly(rot([BL,A,TL],m1,Math.PI*t).map(P),'shape','fill:#93c5fd;fill-opacity:.55;stroke:#2f4fa2;stroke-width:1.4');
      s+=K.poly(rot([A,TR,BR],m2,Math.PI*t).map(P),'shape','fill:#6ee7b7;fill-opacity:.55;stroke:#3a7a57;stroke-width:1.4'); }
    const ext=a<0?[a,0]:a>b?[a,0]:null; if(ext) s+=K.line(P(a<0?[a,0]:[b,0]),P(a<0?[0,0]:[a,0]),'hgt','stroke:#b9ad94');
    s+=K.poly([BL,BR,A].map(P),'shape','fill:none');
    s+=K.line(P(A),P(F),'hgt')+K.ra(P(F),[a>b/2||a>b?-1:1,0],[0,-1]);
    s+=K.dim(P(BL),P(BR),`${o.bl||b+' cm'}`,'b',20);
    s+=`<text class="dl" x="${X(a)+(a>b/2?-10:10)}" y="${Y(h/2)}" style="fill:${K.COL.h};text-anchor:${a>b/2?'end':'start'}">${o.hl||h+' cm'}</text>`;
    return s;
  }
  AV.tri={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const b=10,h=7,a=6.5; let stop=()=>{};
      K.steps(panel,[
        {t:`<p>A triangle has a <b>base</b> ${K.v('b','b')} and a <b>perpendicular height</b> ${K.v('h','h')}.</p><p>Perpendicular means at a right angle (90°) to the base. The height goes straight up from the base to the top corner. It is <b>not</b> the length of a sloping side.</p>`},
        {t:`<p>Draw a rectangle round the triangle. It has the same base and the same height.</p><p>The rectangle's area is ${K.v('b','b')} × ${K.v('h','h')}.</p>`},
        {t:`<p>The height line cuts the rectangle into two smaller rectangles.</p><p>Each one is cut exactly in half by a side of the triangle: one half is inside the triangle, one half is outside.</p>`},
        {t:`<p>Spin each outside piece round. It fits exactly on top of the inside piece.</p><p>So the triangle is <b>half</b> of the rectangle.</p>${K.formula(`Area = ½ × ${K.v('b','b')} × ${K.v('h','h')}`)}`}
      ],(i)=>{ stop();
        const o={bl:'b',hl:'h'}; if(i>=1) o.rect=true; if(i>=2) o.halves=true;
        if(i<2) st.draw(triDraw(K,b,h,a,o));
        if(i===2) st.draw(triDraw(K,b,h,a,{...o,out:0}));
        if(i===3) stop=K.tween(0,1,1800,t=>st.draw(triDraw(K,b,h,a,{...o,out:t})));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let b=8,h=6,a=3;
      const c=K.calc(), n=K.h('div',{class:'mnote'});
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the top corner left and right, or up and down. Drag the end of the base to make it longer.'),c,n);
      const draw=()=>{ st.draw(triDraw(K,b,h,a,{})+K.handle('a',X(a),Y(h),'h')+K.handle('b',X(b),Y(0),'b'));
        c.innerHTML=`<span class="hint">Area = ½ × base × height</span>½ × ${K.v('b',b)} × ${K.v('h',h)} = <span class="res">${K.fmt(b*h/2)} cm²</span>`;
        n.innerHTML=(a<0||a>b)?'<b>Look:</b> the height can be <b>outside</b> the triangle. It is still measured at a right angle to the base line, and the formula still works.':'<b>Try this:</b> slide the top corner sideways without changing the height. The shape changes, but the area stays the same. Why?'; };
      st.onDrag((nm,x,y)=>{ if(x===null) return; if(nm==='a'){ a=clamp(snapU(x),-2,COLS-2); h=clamp(snapV(y),1,ROWS-1); } else b=clamp(snapU(x),1,COLS-3); draw(); });
      draw(); }
  };

  /* ================= A3 parallelogram ================= */
  function paraDraw(K,b,h,o,opt={}){
    let s=bg(K); const BL=[0,0],BR=[b,0],TR=[b+o,h],TL=[o,h],F=[o,0];
    if(opt.slide!==undefined){ const d=opt.slide*b;
      s+=K.poly([F,BR,TR,TL].map(P),'shape','stroke:none');
      s+=K.poly([BL,F,TL].map(([x,y])=>P([x+d,y])),'shape cut');
      s+=K.poly([F,BR,TR,TL].map(P),'shape','fill:none');
      if(opt.slide<1) s+=K.poly([BL,F,TL].map(P),'shape ghost');
      s+=K.line(P(TL),P(F),'hgt')+K.ra(P(F),[1,0],[0,-1]);
      s+=K.dim(P([o,0]),P([b+o,0]),opt.bl||`${b} cm`,'b',20);
    } else {
      s+=K.poly([BL,BR,TR,TL].map(P),'shape');
      if(opt.cut) s+=K.poly([BL,F,TL].map(P),'shape cut');
      s+=K.line(P(TL),P(F),'hgt')+K.ra(P(F),[o>=0?1:-1,0],[0,-1]);
      s+=K.dim(P(BL),P(BR),opt.bl||`${b} cm`,'b',20);
      if(opt.slant) s+=`<text class="dl" x="${(X(b)+X(b+o))/2+16}" y="${Y(h/2)}" style="fill:#7a7366;text-anchor:start;font-size:13px">${opt.slant}</text>`;
    }
    s+=`<text class="dl" x="${X(o)+8}" y="${Y(h/2)}" style="fill:${K.COL.h};text-anchor:start">${opt.hl||h+' cm'}</text>`;
    return s;
  }
  AV.para={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const b=9,h=6,o=3; let stop=()=>{};
      K.steps(panel,[
        {t:`<p>A parallelogram has two pairs of parallel sides. It looks like a rectangle that has been pushed over.</p><p>We need its base ${K.v('b','b')} and its perpendicular height ${K.v('h','h')}, not the sloping side.</p>`},
        {t:`<p>Cut a triangle off one end, along the height line.</p>`},
        {t:`<p>Slide the triangle to the other end. It fits perfectly.</p><p>Now the shape is a rectangle with the same base and the same height. Nothing was added or taken away, so the area has not changed.</p>`},
        {t:`<p>The area of the rectangle is base × height, so:</p>${K.formula(`Area = ${K.v('b','b')} × ${K.v('h','h')}`)}<p class="mnote"><b>Common mistake:</b> using the sloping side instead of the perpendicular height.</p>`}
      ],(i)=>{ stop();
        if(i===0) st.draw(paraDraw(K,b,h,o,{bl:'b',hl:'h',slant:'sloping side'}));
        if(i===1) st.draw(paraDraw(K,b,h,o,{bl:'b',hl:'h',cut:true}));
        if(i===2) stop=K.tween(0,1,1600,t=>st.draw(paraDraw(K,b,h,o,{bl:'b',hl:'h',slide:t})));
        if(i===3) st.draw(paraDraw(K,b,h,o,{bl:'b',hl:'h',slide:1}));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let b=7,h=5,o=3;
      const c=K.calc(), n=K.h('div',{class:'mnote'});
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the top-left corner to push the shape over. Drag the end of the base to change its length.'),c,n);
      const draw=()=>{ st.draw(paraDraw(K,b,h,o,{})+K.handle('t',X(o),Y(h),'h')+K.handle('b',X(b),Y(0),'b'));
        const sl=Math.hypot(o,h);
        c.innerHTML=`<span class="hint">Area = base × perpendicular height</span>${K.v('b',b)} × ${K.v('h',h)} = <span class="res">${b*h} cm²</span>`;
        n.innerHTML=`The sloping side is ${K.fmt(sl,1)} cm long. ${o===0?'With no lean it is the same as the height, because the shape is a rectangle.':'It is longer than the height, which is why we never use it for the area.'}`; };
      st.onDrag((nm,x,y)=>{ if(x===null) return; if(nm==='t'){ o=clamp(snapU(x),0,COLS-1-b); h=clamp(snapV(y),1,ROWS-1); } else { b=clamp(snapU(x),1,COLS-1-o); } draw(); });
      draw(); }
  };

  /* ================= A4 trapezium ================= */
  /* bottom b from (0,0), top a from (o,h) */
  function trapDraw(K,a,b,h,o,opt={}){
    let s=bg(K); const BL=[0,0],BR=[b,0],TR=[o+a,h],TL=[o,h];
    s+=K.poly([BL,BR,TR,TL].map(P),'shape');
    if(opt.copy!==undefined){ const M=[(b+o+a)/2,h/2], ang=Math.PI*opt.copy;
      const rot=([x,y])=>{ const dx=x-M[0],dy=y-M[1]; return [M[0]+dx*Math.cos(ang)-dy*Math.sin(ang),M[1]+dx*Math.sin(ang)+dy*Math.cos(ang)]; };
      const pts=[BL,BR,TR,TL].map(rot);
      s+=K.poly(pts.map(P),'shape copy',opt.copy===0?'fill-opacity:.4':'');
      if(opt.copy===1){ s+=K.dim(P([0,0]),P([a+b,0]),'',null,0,false);
        s+=K.dim(P([b,0]),P([a+b,0]),opt.al||`${a} cm`,'b',20)+K.dim(P([0,0]),P([b,0]),opt.bl||`${b} cm`,'w',20);
        s+=K.dim(P([0,0]),P([a+b,0]),opt.sum||`${a+b} cm`,'g',46); }
    }
    s+=K.line(P(TL),P([o,0]),'hgt')+K.ra(P([o,0]),[1,0],[0,-1]);
    if(opt.copy!==1){ s+=K.dim(P(TL),P(TR),opt.al||`${a} cm`,'b',-18)+K.dim(P(BL),P(BR),opt.bl||`${b} cm`,'w',20); }
    s+=`<text class="dl" x="${X(o)+8}" y="${Y(h/2)}" style="fill:${K.COL.h};text-anchor:start">${opt.hl||h+' cm'}</text>`;
    return s;
  }
  AV.trap={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const a=4,b=7,h=5,o=1; let stop=()=>{}; const lab={al:'a',bl:'b',hl:'h',sum:'a + b'};
      K.steps(panel,[
        {t:`<p>A trapezium has one pair of <b>parallel sides</b>, called ${K.v('b','a')} and ${K.v('w','b')}, and a perpendicular height ${K.v('h','h')} between them.</p>`},
        {t:`<p>Make an exact copy of the trapezium.</p>`},
        {t:`<p>Turn the copy upside down and fit it against the sloping side.</p><p>Together the two trapezia make a <b>parallelogram</b>.</p>`},
        {t:`<p>The parallelogram's base is ${K.v('b','a')} + ${K.v('w','b')}, and its height is ${K.v('h','h')}. Its area is (${K.v('b','a')} + ${K.v('w','b')}) × ${K.v('h','h')}.</p><p>That is two trapezia, so one trapezium is half of it:</p>${K.formula(`Area = ½ (${K.v('b','a')} + ${K.v('w','b')}) × ${K.v('h','h')}`)}<p class="mnote">In words: add the parallel sides, halve it, multiply by the height.</p>`}
      ],(i)=>{ stop();
        if(i===0) st.draw(trapDraw(K,a,b,h,o,lab));
        if(i===1) st.draw(trapDraw(K,a,b,h,o,{...lab,copy:0}));
        if(i===2) stop=K.tween(0,1,1800,t=>st.draw(trapDraw(K,a,b,h,o,{...lab,copy:t>.999?1:t})));
        if(i===3) st.draw(trapDraw(K,a,b,h,o,{...lab,copy:1}));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let a=4,b=9,h=5,o=2; let show=false;
      const c=K.calc(), tg=K.h('div',{class:'toggles'}), n=K.h('div',{class:'mnote'});
      const bt=K.h('button',{class:'tg'},'Show the turned copy'); bt.onclick=()=>{ show=!show; bt.classList.toggle('on',show); draw(); }; tg.appendChild(bt);
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the handles to change the top, the bottom and the height.'),c,tg,n);
      const draw=()=>{ st.draw(trapDraw(K,a,b,h,o,show?{copy:1}:{})+K.handle('tl',X(o),Y(h),'h')+K.handle('tr',X(o+a),Y(h),'b')+K.handle('br',X(b),Y(0),'w'));
        c.innerHTML=`<span class="hint">Area = ½ (a + b) × h</span>½ × (${K.v('b',a)} + ${K.v('w',b)}) × ${K.v('h',h)}<br>= ½ × ${a+b} × ${h} = <span class="res">${K.fmt((a+b)*h/2)} cm²</span>`;
        n.innerHTML=a===b?'<b>Look:</b> when a = b the trapezium is a parallelogram, and ½ (a + b) × h is the same as b × h.':'Try making the top side 0. What shape do you get, and does the formula still work?'; };
      st.onDrag((nm,x,y)=>{ if(x===null) return; const u=snapU(x);
        if(nm==='tl'){ const right=o+a; o=clamp(u,-1,right); a=right-o; h=clamp(snapV(y),1,ROWS-1); }
        if(nm==='tr'){ a=clamp(u-o,0,COLS-1-o); }
        if(nm==='br'){ b=clamp(u,1,show?COLS-1-a:COLS-1); }
        if(show&&a+b>COLS-1) a=COLS-1-b;
        draw(); });
      draw(); }
  };

  /* ================= A5 circle ================= */
  function sector(c,R,phi,th){ const p1=[c[0]+R*Math.cos(phi-th/2),c[1]+R*Math.sin(phi-th/2)], p2=[c[0]+R*Math.cos(phi+th/2),c[1]+R*Math.sin(phi+th/2)];
    return `M${c[0].toFixed(1)} ${c[1].toFixed(1)}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}A${R} ${R} 0 0 1 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z`; }
  function circleCut(K,n,t,R=100,lab=true){
    const th=2*Math.PI/n, C=[W/2,175], chord=2*R*Math.sin(th/2), width=chord*(n+1)/2, X0=(W-width)/2, Yt=175-R*Math.cos(th/2)/2;
    let s='';
    for(let k=0;k<n;k++){ const j=Math.floor(k/2), up=k%2===0;
      const phi0=-Math.PI/2+k*th+th/2;
      const tx=up?X0+chord/2+j*chord:X0+chord+j*chord, ty=up?Yt:Yt+R*Math.cos(th/2); let phi1=up?Math.PI/2:-Math.PI/2;
      while(phi1-phi0>Math.PI) phi1-=2*Math.PI; while(phi0-phi1>Math.PI) phi1+=2*Math.PI;
      const ax=C[0]+(tx-C[0])*t, ay=C[1]+(ty-C[1])*t, ph=phi0+(phi1-phi0)*t;
      s+=`<path class="shape" d="${sector([ax,ay],R,ph,th)}" style="fill:${k%2?'#ebe5f3':'#d5eaea'};stroke-width:1.4"/>`;
    }
    if(lab&&t>=1){ const yb=Yt+R*Math.cos(th/2);
      s+=K.dim([X0+chord/2,Yt-8],[X0+chord*(n+1)/2-chord/2+chord/2,Yt-8],'half the circumference = πr','b',-16);
      s+=K.dim([X0+width+6,yb],[X0+width+6,Yt],'r','r',-14);
      s+=`<text class="dl" x="${W/2}" y="${yb+30}" style="fill:#3d3a33">Area ≈ πr × r = πr²</text>`; }
    if(lab&&t===0){ s+=`<line x1="${C[0]}" y1="${C[1]}" x2="${C[0]+R*Math.cos(-Math.PI/2+th/2)}" y2="${C[1]+R*Math.sin(-Math.PI/2+th/2)}" stroke="${K.COL.r}" stroke-width="2.5"/>`; }
    return s;
  }
  AV.circle={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let stop=()=>{}; let n=8;
      const R=100, C=[W/2,175];
      const whole=()=>`<circle class="shape" cx="${C[0]}" cy="${C[1]}" r="${R}"/>`+`<line x1="${C[0]}" y1="${C[1]}" x2="${C[0]+R}" y2="${C[1]}" stroke="${K.COL.r}" stroke-width="2.5"/><circle cx="${C[0]}" cy="${C[1]}" r="3"/>`
        +K.label(C[0]+R/2,C[1]-14,'radius r','r')+`<line x1="${C[0]-R}" y1="${C[1]+R+18}" x2="${C[0]+R}" y2="${C[1]+R+18}" stroke="${K.COL.b}" stroke-width="1.5"/>`+K.label(C[0],C[1]+R+34,'diameter = 2r','b');
      let seg;
      K.steps(panel,[
        {t:`<p>The <b>radius</b> ${K.v('r','r')} goes from the centre to the edge. The <b>diameter</b> goes all the way across, so it is 2 × ${K.v('r','r')}.</p><p>The distance round the edge is the <b>circumference</b>. For every circle, circumference = π × diameter = 2π${K.v('r','r')}, where π = 3.14159…</p>`},
        {t:`<p>Cut the circle into equal slices, like a pizza.</p>`},
        {t:`<p>Lay the slices in a row, pointing up and down alternately. They make a shape that is nearly a rectangle.</p><p>Try more slices with the buttons below.</p>`},
        {t:`<p>With lots of slices it becomes a rectangle:</p><p>• its height is the radius ${K.v('r','r')}<br>• its length is half the circumference, π${K.v('r','r')}</p>${K.formula(`Area = π × ${K.v('r','r')} × ${K.v('r','r')} = π${K.v('r','r')}²`)}<p class="mnote"><b>Common mistake:</b> using the diameter. Halve it first to get the radius.</p>`}
      ],(i)=>{ stop(); seg&&(seg.style.display=i>=1&&i<=2?'':'none');
        if(i===0) st.draw(whole());
        if(i===1) st.draw(circleCut(K,n,0));
        if(i===2) stop=K.tween(0,1,1800,t=>st.draw(circleCut(K,n,t)));
        if(i===3) st.draw(circleCut(K,40,1));
      });
      seg=K.seg(panel,[[4,'4 slices'],[8,'8'],[16,'16'],[32,'32']],8,x=>{ n=x; stop(); st.draw(circleCut(K,n,1)); }); seg.style.display='none'; },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let r=4, sq=true;
      const C=[X(7),Y(5)], c=K.calc(), tg=K.h('div',{class:'toggles'}), n=K.h('div',{class:'mnote'});
      const bt=K.h('button',{class:'tg on'},'Show r × r squares'); bt.onclick=()=>{ sq=!sq; bt.classList.toggle('on',sq); draw(); }; tg.appendChild(bt);
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the handle on the edge to change the radius.'),c,tg,n);
      const draw=()=>{ const R=r*S; let s=bg(K);
        if(sq){ [[0,-1],[-1,-1],[-1,0],[0,0]].forEach(([dx,dy],k)=>s+=`<rect x="${C[0]+dx*R}" y="${C[1]+dy*R}" width="${R}" height="${R}" fill="${k===0?'#ebe5f3':'none'}" stroke="${K.COL.r}" stroke-dasharray="${k===0?'':'5 4'}" stroke-width="1.3"/>`); }
        s+=`<circle class="shape" cx="${C[0]}" cy="${C[1]}" r="${R}" style="fill-opacity:.75"/><circle cx="${C[0]}" cy="${C[1]}" r="3"/>`;
        s+=K.dim(C,[C[0]+R,C[1]],`r = ${K.fmt(r)} cm`,'r',-1,false)+K.handle('r',C[0]+R,C[1],'r');
        st.draw(s);
        const A=Math.PI*r*r;
        c.innerHTML=`<span class="hint">Area = π × r²</span>π × ${K.v('r',K.fmt(r))}² = π × ${K.fmt(r*r)}<br>= <span class="res">${K.fmt(A,1)} cm²</span> <span class="hint">to 1 decimal place</span>`;
        n.innerHTML=sq?`The shaded square is r × r = ${K.fmt(r*r)} cm². The circle is bigger than 3 of these squares but smaller than 4: it is exactly π ≈ 3.14 of them.`:`The diameter is ${K.fmt(2*r)} cm. If a question gives you the diameter, halve it first.`; };
      st.onDrag((nm,x,y)=>{ if(x===null) return; r=clamp(Math.round(Math.hypot(x-C[0],y-C[1])/S*2)/2,0.5,5); draw(); });
      draw(); }
  };

  /* ================= A6 compound shapes ================= */
  /* L-shape: W×H rectangle with a cw×ch notch cut from the top-right corner */
  function compDraw(K,Wd,Ht,cw,ch,method,o={}){
    let s=bg(K); const A=[0,0],B=[Wd,0],C=[Wd,Ht-ch],D=[Wd-cw,Ht-ch],E=[Wd-cw,Ht],F=[0,Ht];
    const blue='fill:#e3e9f6;stroke:none', green='fill:#dcece2;stroke:none';
    const part=(pts,st,txt)=>{ let r=K.poly(pts.map(P),'shape',st); if(o.parts!==false&&txt){ const cx=pts.reduce((a,p)=>a+p[0],0)/pts.length, cy=pts.reduce((a,p)=>a+p[1],0)/pts.length; r+=`<text class="dl" x="${X(cx)}" y="${Y(cy)}" style="fill:#3d3a33;font-size:14px">${txt}</text>`; } return r; };
    if(method==='down'){ s+=part([A,[Wd-cw,0],E,F],blue,`${Wd-cw} × ${Ht} = ${(Wd-cw)*Ht}`)+part([[Wd-cw,0],B,C,D],green,`${cw} × ${Ht-ch} = ${cw*(Ht-ch)}`); s+=K.line(P([Wd-cw,0]),P(D),'hgt','stroke:#3d3a33'); }
    else if(method==='across'){ s+=part([A,B,C,[0,Ht-ch]],blue,`${Wd} × ${Ht-ch} = ${Wd*(Ht-ch)}`)+part([[0,Ht-ch],D,E,F],green,`${Wd-cw} × ${ch} = ${(Wd-cw)*ch}`); s+=K.line(P([0,Ht-ch]),P(D),'hgt','stroke:#3d3a33'); }
    else if(method==='minus'){ s+=K.poly([A,B,C,D,E,F].map(P),'shape',blue); s+=K.poly([D,C,[Wd,Ht],E].map(P),'shape','fill:#f6e3d6;stroke:#a8492a;stroke-dasharray:5 4'); if(o.parts!==false) s+=`<text class="dl" x="${X(Wd-cw/2)}" y="${Y(Ht)-14}" style="fill:#a8492a;font-size:14px">corner: ${cw} × ${ch} = ${cw*ch}</text>`; s+=`<text class="dl" x="${X(Wd/2)}" y="${Y(Ht/2)-4}" style="fill:#3d3a33;font-size:14px">${o.parts===false?'':`${Wd} × ${Ht} = ${Wd*Ht}`}</text>`; }
    else s+=K.poly([A,B,C,D,E,F].map(P),'shape');
    s+=K.poly([A,B,C,D,E,F].map(P),'shape','fill:none');
    const q=k=>o.hide&&o.hide.includes(k);
    s+=K.dim(P(A),P(B),q('W')?'?':`${Wd} cm`,'b',20)+K.dim(P(F),P(A),q('H')?'?':`${Ht} cm`,'h',20);
    s+=K.dim(P(B),P(C),q('Hc')?(o.ask?'?':''):`${Ht-ch} cm`,'h',20)+K.dim(P(E),P(F),q('Wc')?(o.ask?'?':''):`${Wd-cw} cm`,'b',20);
    if(o.missing) { s+=K.dim(P(D),P(C),`${cw} cm`,'g',14)+K.dim(P(D),P(E),`${ch} cm`,'g',14); }
    return s;
  }
  const compCalc=(K,Wd,Ht,cw,ch,m)=>m==='down'?`${(Wd-cw)*Ht} + ${cw*(Ht-ch)} = <span class="res">${Wd*Ht-cw*ch} cm²</span>`:m==='across'?`${Wd*(Ht-ch)} + ${(Wd-cw)*ch} = <span class="res">${Wd*Ht-cw*ch} cm²</span>`:`${Wd*Ht} − ${cw*ch} = <span class="res">${Wd*Ht-cw*ch} cm²</span>`;
  AV.comp={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const Wd=10,Ht=8,cw=4,ch=3;
      K.steps(panel,[
        {t:`<p>A <b>compound shape</b> is made of simpler shapes stuck together. This L-shape is two rectangles.</p><p>Some lengths are missing. Work them out before you start.</p>`},
        {t:`<p><b>Missing lengths.</b> The whole width is 10 cm and the top part is 6 cm, so the step is 10 − 6 = <b>4 cm</b>.</p><p>The whole height is 8 cm and the right side is 5 cm, so the step is 8 − 5 = <b>3 cm</b>.</p>`},
        {t:`<p><b>Method 1: split it.</b> Cut it into two rectangles, find each area, then add.</p><p>${compCalc(K,Wd,Ht,cw,ch,'across')}</p>`},
        {t:`<p><b>Method 2: subtract.</b> Imagine the big rectangle, then take away the missing corner.</p><p>${compCalc(K,Wd,Ht,cw,ch,'minus')}</p><p class="mnote">Both methods give the same answer. Pick whichever needs fewer sums.</p>`}
      ],(i)=>{ if(i===0) st.draw(compDraw(K,Wd,Ht,cw,ch,'',{}));
        if(i===1) st.draw(compDraw(K,Wd,Ht,cw,ch,'',{missing:true}));
        if(i===2) st.draw(compDraw(K,Wd,Ht,cw,ch,'across',{missing:true}));
        if(i===3) st.draw(compDraw(K,Wd,Ht,cw,ch,'minus',{missing:true})); }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let Wd=11,Ht=8,cw=5,ch=4,m='across';
      const c=K.calc();
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the handles to reshape the L. Choose a method to see how the area is worked out.'));
      K.seg(panel,[['across','Split across'],['down','Split down'],['minus','Big minus corner']],m,x=>{ m=x; draw(); });
      panel.append(c,K.h('div',{class:'mnote'},'All three methods always give the same total. Check by trying each one.'));
      const draw=()=>{ st.draw(compDraw(K,Wd,Ht,cw,ch,m,{missing:true})+K.handle('c',X(Wd),Y(Ht-ch),'h')+K.handle('d',X(Wd-cw),Y(Ht),'b'));
        c.innerHTML=`<span class="hint">${m==='minus'?'Big rectangle − missing corner':'Rectangle 1 + rectangle 2'}</span>${compCalc(K,Wd,Ht,cw,ch,m)}`; };
      st.onDrag((nm,x,y)=>{ if(x===null) return; const u=snapU(x), vv=snapV(y);
        if(nm==='c'){ const left=Wd-cw; Wd=clamp(u,left+1,COLS-1); cw=Wd-left; ch=clamp(Ht-vv,1,Ht-1); }
        if(nm==='d'){ cw=clamp(Wd-u,1,Wd-1); const lowH=Ht-ch; Ht=clamp(vv,lowH+1,ROWS-1); ch=Ht-lowH; }
        draw(); });
      draw(); }
  };
})();
