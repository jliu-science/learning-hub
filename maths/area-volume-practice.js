/* ===== Area & volume practice: question generators. Each returns
   {text, fig, ans, unit, base|units, dp, pi, work:[lines], hint}. New numbers every time. */
window.AVQ=(function(){
  const K=()=>MathsEngine.K;
  const v=(k,t)=>K().v(k,t), f=(x,dp)=>K().fmt(x,dp);
  const pickU=R=>R.pick(['cm','cm','cm','m','mm']);
  const fig=spec=>K().figure(spec);
  const dxk=Math.cos(35*Math.PI/180)*.5, dyk=Math.sin(35*Math.PI/180)*.5;
  const norm=(arr,lo=.45)=>{ const m=Math.max(...arr); return arr.map(x=>lo+(1-lo)*x/m); };
  const hint=s=>s;
  const F={
    rect:`A = ${'<i class="v v-b">l</i>'} × <i class="v v-w">w</i>`,
    tri:`A = ½ × <i class="v v-b">b</i> × <i class="v v-h">h</i>`,
    para:`A = <i class="v v-b">b</i> × <i class="v v-h">h</i>`,
    trap:`A = ½ (<i class="v v-b">a</i> + <i class="v v-w">b</i>) × <i class="v v-h">h</i>`,
    circ:`A = π<i class="v v-r">r</i>²`,
    cub:`V = <i class="v v-b">l</i> × <i class="v v-w">w</i> × <i class="v v-h">h</i>`,
    prism:`V = <i class="v v-c">A</i> × <i class="v v-b">l</i> (area of cross-section × length)`,
    cyl:`V = π<i class="v v-r">r</i>²<i class="v v-h">h</i>`
  };

  /* ---------- 3D figures ---------- */
  function wrap(s){ return `<svg class="qfig" viewBox="0 0 320 230">${s}</svg>`; }
  function cuboidFig(l,w,h,lab){ const k=K(); const [L,Wd,Hh]=norm([l,w,h]);
    const s=Math.min(200/(L+Wd*dxk),150/(Hh+Wd*dyk)); const ox=(320-(L+Wd*dxk)*s)/2, oy=(230+(Hh+Wd*dyk)*s)/2; const P=k.oblique(ox,oy,s);
    const c=(x,y,z)=>P(x*L,y*Wd,z*Hh); let o='';
    o+=k.poly([c(0,0,0),c(1,0,0),c(1,0,1),c(0,0,1)],'fig')+k.poly([c(0,0,1),c(1,0,1),c(1,1,1),c(0,1,1)],'fig','fill:#fffdf8')+k.poly([c(1,0,0),c(1,1,0),c(1,1,1),c(1,0,1)],'fig','fill:#efe9dc');
    o+=[[c(0,0,0),c(0,1,0)],[c(0,1,0),c(1,1,0)],[c(0,1,0),c(0,1,1)]].map(([a,b])=>k.line(a,b,'frame hid')).join('');
    o+=k.dim(c(0,0,0),c(1,0,0),lab[0],'b',16)+k.dim(c(1,0,0),c(1,1,0),lab[1],'w',14)+k.dim(c(0,0,1),c(0,0,0),lab[2],'h',16);
    return wrap(o); }
  function prismFig(pts,len,o){ const k=K(); const mx=Math.max(...pts.map(p=>p[0])), mz=Math.max(...pts.map(p=>p[1]));
    const L=Math.min(Math.max(len,mx*.8),mx*2.2); const s=Math.min(230/(mx+L*dxk),160/(mz+L*dyk)); const ox=(320-(mx+L*dxk)*s)/2, oy=(230+(mz+L*dyk)*s)/2; const P=k.oblique(ox,oy,s);
    const at=d=>pts.map(([u,v])=>P(u,d,v)); let out='';
    for(let d=L;d>0;d-=L/40) out+=k.poly(at(d),'','fill:#e6f4f1;stroke:none');
    pts.forEach(([u,v])=>out+=k.line(P(u,0,v),P(u,L,v),'edge','opacity:.45'));
    out+=k.poly(at(L),'','fill:none;stroke:#3d3a33;stroke-opacity:.45;stroke-width:1.2');
    out+=k.poly(at(0),'fig');
    (o.dims||[]).forEach(d=>out+=k.dim(P(d.a[0],0,d.a[1]),P(d.b[0],0,d.b[1]),d.t,d.k,d.off===undefined?14:d.off));
    if(o.dash) o.dash.forEach(([a,b])=>out+=k.line(P(a[0],0,a[1]),P(b[0],0,b[1]),'hgt'));
    if(o.area){ const cx=pts.reduce((a,p)=>a+p[0],0)/pts.length, cz=pts.reduce((a,p)=>a+p[1],0)/pts.length; const C=P(cx,0,cz); out+=`<text class="dl" x="${C[0]}" y="${C[1]}" style="fill:#115e59;font-size:13px">${o.area}</text>`; }
    out+=k.dim(P(mx,0,0),P(mx,L,0),o.len,'b',14);
    return wrap(out); }
  function cylFig(rl,hl,useD,ratio){ const k=K(); const R=70*Math.min(1,Math.max(.55,ratio)), ry=R*.3, Hh=Math.min(140,Math.max(70,140/ratio*0.7)); const cx=150, yb=200-ry, yt=yb-Hh;
    let o=`<path class="fig" d="M${cx-R} ${yt}L${cx-R} ${yb}A${R} ${ry} 0 0 0 ${cx+R} ${yb}L${cx+R} ${yt}Z"/>`+`<path d="M${cx-R} ${yb}A${R} ${ry} 0 0 1 ${cx+R} ${yb}" fill="none" stroke="#3d3a33" stroke-dasharray="4 4" stroke-opacity=".5"/>`+`<ellipse class="fig" cx="${cx}" cy="${yt}" rx="${R}" ry="${ry}" style="fill:#fffdf8"/>`;
    o+=useD?`<line x1="${cx-R}" y1="${yt}" x2="${cx+R}" y2="${yt}" stroke="${k.COL.r}" stroke-width="2"/>${k.label(cx,yt-ry-12,rl,'r')}`:`<line x1="${cx}" y1="${yt}" x2="${cx+R}" y2="${yt}" stroke="${k.COL.r}" stroke-width="2"/><circle cx="${cx}" cy="${yt}" r="2.5"/>${k.label(cx+R/2,yt-ry-10,rl,'r')}`;
    o+=k.dim([cx+R,yb],[cx+R,yt],hl,'h',-16);
    return wrap(o); }

  /* ---------- A1 rectangles ---------- */
  const rect=[
    R=>{ const u=pickU(R), l=R.int(3,15), w=R.int(2,9); return {text:'Find the area of this rectangle.', base:u, ans:l*w, unit:u+'²', hint:F.rect,
      fig:fig({pts:[[0,0],[l,0],[l,w],[0,w]],dims:[{a:[0,0],b:[l,0],t:`${l} ${u}`,k:'b'},{a:[l,0],b:[l,w],t:`${w} ${u}`,k:'w'}],ra:[[[0,0],[1,0],[0,1]]]}),
      work:[`A = ${v('b','l')} × ${v('w','w')}`,`= ${v('b',l)} × ${v('w',w)} = ${l*w} ${u}²`]}; },
    R=>{ const w=R.int(3,9), l=R.int(4,12); const A=l*w; return {text:`A rectangle has an area of <b>${A} cm²</b>. Its width is <b>${w} cm</b>. How long is it?`, base:'cm', ans:l, unit:'cm', hint:F.rect,
      fig:fig({pts:[[0,0],[l,0],[l,w],[0,w]],dims:[{a:[0,0],b:[l,0],t:'?',k:'b'},{a:[l,0],b:[l,w],t:`${w} cm`,k:'w'}],extra:(m)=>{ const c=m([l/2,w/2]); return `<text class="big-a" x="${c[0]}" y="${c[1]}" style="font-size:18px">${A} cm²</text>`; }}),
      work:[`${v('b','l')} × ${v('w',w)} = ${A}`,`${v('b','l')} = ${A} ÷ ${w} = ${l} cm`,'It is a length, so the unit is cm, not cm².']}; },
    R=>{ const l=R.half(4,12), w=R.int(3,8); return {text:`A rectangular garden lawn is <b>${f(l)} m</b> long and <b>${w} m</b> wide. What is the area of the lawn?`, base:'m', ans:l*w, unit:'m²', hint:F.rect,
      fig:fig({pts:[[0,0],[l,0],[l,w],[0,w]],dims:[{a:[0,0],b:[l,0],t:`${f(l)} m`,k:'b'},{a:[l,0],b:[l,w],t:`${w} m`,k:'w'}]}),
      work:[`A = ${v('b',f(l))} × ${v('w',w)} = ${f(l*w)} m²`]}; },
    R=>{ const s=R.int(3,12), u=pickU(R); return {text:'Find the area of this square.', base:u, ans:s*s, unit:u+'²', hint:F.rect,
      fig:fig({pts:[[0,0],[1,0],[1,1],[0,1]],dims:[{a:[0,0],b:[1,0],t:`${s} ${u}`,k:'b'}],ra:[[[0,0],[1,0],[0,1]]]}),
      work:['All four sides of a square are the same.',`A = ${v('b',s)} × ${v('w',s)} = ${s*s} ${u}²`]}; }
  ];

  /* ---------- A2 triangles ---------- */
  const TRIPLES=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[12,16,20]];
  const tri=[
    R=>{ const u=pickU(R), b=R.int(4,14), h=R.int(3,10), a=R.int(1,b-1); const sl=f(Math.hypot(b-a,h),1); return {text:'Find the area of this triangle.', base:u, ans:b*h/2, unit:u+'²', hint:F.tri,
      fig:fig({pts:[[0,0],[b,0],[a,h]],dash:[[[a,0],[a,h]]],ra:[[[a,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:`${b} ${u}`,k:'b'},{a:[b,0],b:[a,h],t:`${sl} ${u}`,k:'g',off:12,arrows:false}],extra:m=>{ const p=m([a,h/2]); return `<text class="dl" x="${p[0]-6}" y="${p[1]}" style="fill:#bf5a32;text-anchor:end">${h} ${u}</text>`; }}),
      work:[`A = ½ × ${v('b','b')} × ${v('h','h')}`,`= ½ × ${v('b',b)} × ${v('h',h)} = ${f(b*h/2)} ${u}²`,`The ${sl} ${u} side slopes, so it is not the height.`]}; },
    R=>{ const t=R.pick(TRIPLES), [b,h,c]=R.int(0,1)?[t[0],t[1],t[2]]:[t[1],t[0],t[2]]; return {text:'Find the area of this right-angled triangle.', base:'cm', ans:b*h/2, unit:'cm²', hint:F.tri,
      fig:fig({pts:[[0,0],[b,0],[0,h]],ra:[[[0,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:`${b} cm`,k:'b'},{a:[0,h],b:[0,0],t:`${h} cm`,k:'h'},{a:[b,0],b:[0,h],t:`${c} cm`,k:'g',off:12,arrows:false}]}),
      work:['In a right-angled triangle, the two sides that meet at the right angle are the base and the height.',`A = ½ × ${v('b',b)} × ${v('h',h)} = ${f(b*h/2)} cm²`]}; },
    R=>{ const b=R.even(4,14), h=R.int(3,10); const A=b*h/2; return {text:`A triangle has an area of <b>${f(A)} cm²</b> and a base of <b>${b} cm</b>. What is its perpendicular height?`, base:'cm', ans:h, unit:'cm', hint:F.tri,
      fig:fig({pts:[[0,0],[b,0],[b*.35,h]],dash:[[[b*.35,0],[b*.35,h]]],ra:[[[b*.35,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:`${b} cm`,k:'b'}],extra:m=>{ const p=m([b*.35,h/2]); return `<text class="dl" x="${p[0]+8}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start">?</text>`; }}),
      work:[`½ × ${v('b',b)} × ${v('h','h')} = ${f(A)}`,`${b/2} × ${v('h','h')} = ${f(A)}`,`${v('h','h')} = ${f(A)} ÷ ${b/2} = ${h} cm`]}; }
  ];

  /* ---------- A3 parallelograms ---------- */
  const para=[
    R=>{ const u=pickU(R), b=R.int(5,14), h=R.int(3,9), o=R.int(2,4); const sl=f(Math.hypot(o,h),1); return {text:'Find the area of this parallelogram.', base:u, ans:b*h, unit:u+'²', hint:F.para,
      fig:fig({pts:[[0,0],[b,0],[b+o,h],[o,h]],dash:[[[o,0],[o,h]]],ra:[[[o,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:`${b} ${u}`,k:'b'},{a:[b,0],b:[b+o,h],t:`${sl} ${u}`,k:'g',off:12,arrows:false}],extra:m=>{ const p=m([o,h/2]); return `<text class="dl" x="${p[0]+7}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start">${h} ${u}</text>`; }}),
      work:[`A = ${v('b','b')} × ${v('h','h')} = ${v('b',b)} × ${v('h',h)} = ${b*h} ${u}²`,`Ignore the sloping side (${sl} ${u}).`]}; },
    R=>{ const b=R.half(3,9), h=R.int(2,6), o=R.int(1,3); return {text:`A parallelogram-shaped patio has a base of <b>${f(b)} m</b> and a perpendicular height of <b>${h} m</b>. Find its area.`, base:'m', ans:b*h, unit:'m²', hint:F.para,
      fig:fig({pts:[[0,0],[b,0],[b+o,h],[o,h]],dash:[[[o,0],[o,h]]],ra:[[[o,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:`${f(b)} m`,k:'b'}],extra:m=>{ const p=m([o,h/2]); return `<text class="dl" x="${p[0]+7}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start">${h} m</text>`; }}),
      work:[`A = ${v('b',f(b))} × ${v('h',h)} = ${f(b*h)} m²`]}; },
    R=>{ const h=R.int(3,9), b=R.int(4,12); const A=b*h; return {text:`A parallelogram has an area of <b>${A} cm²</b> and a perpendicular height of <b>${h} cm</b>. How long is its base?`, base:'cm', ans:b, unit:'cm', hint:F.para,
      fig:fig({pts:[[0,0],[b,0],[b+2,h],[2,h]],dash:[[[2,0],[2,h]]],ra:[[[2,0],[1,0],[0,1]]],dims:[{a:[0,0],b:[b,0],t:'?',k:'b'}],extra:m=>{ const p=m([2,h/2]); return `<text class="dl" x="${p[0]+7}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start">${h} cm</text>`; }}),
      work:[`${v('b','b')} × ${v('h',h)} = ${A}`,`${v('b','b')} = ${A} ÷ ${h} = ${b} cm`]}; }
  ];

  /* ---------- A4 trapezia ---------- */
  const trap=[
    R=>{ const u=pickU(R), a=R.int(3,8), b=a+R.int(2,6), h=R.int(2,8), o=R.int(0,b-a); return {text:'Find the area of this trapezium.', base:u, ans:(a+b)*h/2, unit:u+'²', hint:F.trap,
      fig:fig({pts:[[0,0],[b,0],[o+a,h],[o,h]],dash:[[[o,0],[o,h]]],ra:[[[o,0],[1,0],[0,1]]],dims:[{a:[o,h],b:[o+a,h],t:`${a} ${u}`,k:'b',off:-14},{a:[0,0],b:[b,0],t:`${b} ${u}`,k:'w'}],extra:m=>{ const p=m([o,h/2]); return `<text class="dl" x="${p[0]+(o===0?-7:7)}" y="${p[1]}" style="fill:#bf5a32;text-anchor:${o===0?'end':'start'}">${h} ${u}</text>`; }}),
      work:[`A = ½ (${v('b','a')} + ${v('w','b')}) × ${v('h','h')}`,`= ½ × (${v('b',a)} + ${v('w',b)}) × ${v('h',h)}`,`= ½ × ${a+b} × ${h} = ${f((a+b)*h/2)} ${u}²`]}; },
    R=>{ const a=R.int(4,9), b=a+R.int(3,7), h=R.even(2,8), o=R.int(1,b-a-1); const sl=f(Math.hypot(b-a-o,h),1); return {text:'Find the area of this trapezium. Not every length is needed.', base:'cm', ans:(a+b)*h/2, unit:'cm²', hint:F.trap,
      fig:fig({pts:[[0,0],[b,0],[o+a,h],[o,h]],dash:[[[o,0],[o,h]]],ra:[[[o,0],[1,0],[0,1]]],dims:[{a:[o,h],b:[o+a,h],t:`${a} cm`,k:'b',off:-14},{a:[0,0],b:[b,0],t:`${b} cm`,k:'w'},{a:[b,0],b:[o+a,h],t:`${sl} cm`,k:'g',off:12,arrows:false}],extra:m=>{ const p=m([o,h/2]); return `<text class="dl" x="${p[0]+7}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start">${h} cm</text>`; }}),
      work:[`½ × (${v('b',a)} + ${v('w',b)}) × ${v('h',h)} = ½ × ${a+b} × ${h} = ${f((a+b)*h/2)} cm²`,`The ${sl} cm side slopes, so it is not used.`]}; },
    R=>{ const a=R.int(2,6), b=a+R.int(1,4), h=R.half(1.5,5); return {text:`A flower bed is a trapezium. Its parallel sides are <b>${a} m</b> and <b>${b} m</b>, and they are <b>${f(h)} m</b> apart. Find the area of the flower bed.`, base:'m', ans:(a+b)*h/2, unit:'m²', hint:F.trap,
      fig:'', work:[`½ × (${v('b',a)} + ${v('w',b)}) × ${v('h',f(h))} = ½ × ${a+b} × ${f(h)} = ${f((a+b)*h/2,2)} m²`,'"Apart" means the perpendicular distance between them, which is the height.']}; }
  ];

  /* ---------- A5 circles ---------- */
  const circ=[
    R=>{ const r=R.int(2,15), u=pickU(R); return {text:'Find the area of this circle.', base:u, ans:Math.PI*r*r, dp:1, pi:true, unit:u+'²', hint:F.circ,
      fig:fig({circles:[{c:[0,0],r:1}],extra:(m,s)=>{ const c=m([0,0]); return `<line x1="${c[0]}" y1="${c[1]}" x2="${c[0]+s}" y2="${c[1]}" stroke="#6a4c93" stroke-width="2"/><text class="dl" x="${c[0]+s/2}" y="${c[1]-12}" style="fill:#6a4c93">${r} ${u}</text>`; }}),
      work:[`A = π${v('r','r')}² = π × ${v('r',r)}² = π × ${r*r}`,`≈ ${f(Math.PI*r*r,1)} ${u}² (1 d.p.)`]}; },
    R=>{ const d=R.even(4,20); const r=d/2; return {text:'Find the area of this circle.', base:'cm', ans:Math.PI*r*r, dp:1, pi:true, unit:'cm²', hint:F.circ,
      fig:fig({circles:[{c:[0,0],r:1}],extra:(m,s)=>{ const c=m([0,0]); return `<line x1="${c[0]-s}" y1="${c[1]}" x2="${c[0]+s}" y2="${c[1]}" stroke="#2f4fa2" stroke-width="2"/><text class="dl" x="${c[0]}" y="${c[1]-12}" style="fill:#2f4fa2">${d} cm</text>`; }}),
      work:[`This is the diameter, so the radius is ${d} ÷ 2 = ${v('r',r)} cm.`,`A = π × ${v('r',r)}² = π × ${r*r} ≈ ${f(Math.PI*r*r,1)} cm²`]}; },
    R=>{ const d=R.even(6,20), r=d/2; return {text:'Find the area of this semicircle.', base:'cm', ans:Math.PI*r*r/2, dp:1, pi:true, unit:'cm²', hint:F.circ,
      fig:fig({pts:Array.from({length:31},(_,i)=>[Math.cos(Math.PI*i/30),Math.sin(Math.PI*i/30)]),dims:[{a:[1,0],b:[-1,0],t:`${d} cm`,k:'b',off:-0.001}]}),
      work:[`The radius is ${d} ÷ 2 = ${v('r',r)} cm.`,`Whole circle: π × ${r}² = ${f(r*r)}π cm²`,`Half of it: ${f(r*r)}π ÷ 2 = ${f(r*r/2)}π ≈ ${f(Math.PI*r*r/2,1)} cm²`,'Keep π until the last step, then round.']}; },
    R=>{ const r=R.half(1.5,9); return {text:`A round table top has a radius of <b>${f(r)} m</b>. What is its area?`, base:'m', ans:Math.PI*r*r, dp:1, pi:true, unit:'m²', hint:F.circ, fig:'',
      work:[`A = π × ${v('r',f(r))}² = π × ${f(r*r)} ≈ ${f(Math.PI*r*r,1)} m²`]}; }
  ];

  /* ---------- A6 compound shapes ---------- */
  const comp=[
    R=>{ const Wd=R.int(8,14), Ht=R.int(6,11), cw=R.int(2,Wd-3), ch=R.int(2,Ht-3); const A=Wd*Ht-cw*ch;
      const pts=[[0,0],[Wd,0],[Wd,Ht-ch],[Wd-cw,Ht-ch],[Wd-cw,Ht],[0,Ht]];
      return {text:'Find the area of this L-shape. All corners are right angles.', base:'cm', ans:A, unit:'cm²', hint:F.rect,
        fig:fig({pts,dims:[{a:[0,0],b:[Wd,0],t:`${Wd} cm`,k:'b'},{a:[0,Ht],b:[0,0],t:`${Ht} cm`,k:'h'},{a:[Wd,0],b:[Wd,Ht-ch],t:`${Ht-ch} cm`,k:'h'},{a:[Wd-cw,Ht],b:[0,Ht],t:`${Wd-cw} cm`,k:'b'}]}),
        work:[`Missing lengths: ${Wd} − ${Wd-cw} = ${cw} cm and ${Ht} − ${Ht-ch} = ${ch} cm.`,`Big rectangle − corner: ${Wd} × ${Ht} − ${cw} × ${ch}`,`= ${Wd*Ht} − ${cw*ch} = ${A} cm²`]}; },
    R=>{ const b=R.even(6,12), hr=R.int(3,7), ht=R.int(2,5); const A=b*hr+b*ht/2;
      return {text:'This shape is a rectangle with a triangle on top. Find its total area.', base:'cm', ans:A, unit:'cm²', hint:`${F.rect}<br>${F.tri}`,
        fig:fig({pts:[[0,0],[b,0],[b,hr],[b/2,hr+ht],[0,hr]],dash:[[[0,hr],[b,hr]],[[b/2,hr],[b/2,hr+ht]]],dims:[{a:[0,0],b:[b,0],t:`${b} cm`,k:'b'},{a:[b,0],b:[b,hr],t:`${hr} cm`,k:'h'}],extra:m=>{ const p=m([b/2,hr+ht/2]); return `<text class="dl" x="${p[0]+7}" y="${p[1]}" style="fill:#bf5a32;text-anchor:start;font-size:13px">${ht} cm</text>`; }}),
        work:[`Rectangle: ${b} × ${hr} = ${b*hr} cm²`,`Triangle: ½ × ${b} × ${ht} = ${f(b*ht/2)} cm²`,`Total: ${b*hr} + ${f(b*ht/2)} = ${f(A)} cm²`]}; },
    R=>{ const Wd=R.int(9,15), Ht=R.int(6,10), s=R.int(2,Math.min(4,Ht-3)); const A=Wd*Ht-s*s;
      return {text:`A metal plate is a rectangle with a square hole cut out. The hole is ${s} cm by ${s} cm. Find the area of the metal that is left.`, base:'cm', ans:A, unit:'cm²', hint:F.rect,
        fig:fig({pts:[[0,0],[Wd,0],[Wd,Ht],[0,Ht]],polys:[{pts:[[Wd/2-s/2,Ht/2-s/2],[Wd/2+s/2,Ht/2-s/2],[Wd/2+s/2,Ht/2+s/2],[Wd/2-s/2,Ht/2+s/2]],cls:'hole'}],dims:[{a:[0,0],b:[Wd,0],t:`${Wd} cm`,k:'b'},{a:[Wd,0],b:[Wd,Ht],t:`${Ht} cm`,k:'w'}]}).replace(/(<polygon class="fig hole"[^>]*\/>)(.*?)(<polygon class="fig main"[^>]*\/>)/,'$3$2$1'),
        work:[`Whole plate: ${Wd} × ${Ht} = ${Wd*Ht} cm²`,`Hole: ${s} × ${s} = ${s*s} cm²`,`Left: ${Wd*Ht} − ${s*s} = ${A} cm²`]}; },
    R=>{ const w=R.even(4,10), l=R.int(6,12); const r=w/2, rectangle=l*w, A=rectangle+Math.PI*r*r/2;
      return {text:'This shape is a rectangle with a semicircle on one end. Find its total area.', base:'cm', ans:A, dp:1, pi:true, piOffset:rectangle, unit:'cm²', hint:`${F.rect}<br>${F.circ}`,
        fig:fig({pts:[[0,0],[l,0],...Array.from({length:21},(_,i)=>[l+r*Math.sin(Math.PI*i/20),r-r*Math.cos(Math.PI*i/20)]),[0,w]],dash:[[[l,0],[l,w]]],dims:[{a:[0,0],b:[l,0],t:`${l} cm`,k:'b'},{a:[0,w],b:[0,0],t:`${w} cm`,k:'w'}]}),
        work:[`Rectangle: ${l} × ${w} = ${l*w} cm²`,`Semicircle: radius = ${w} ÷ 2 = ${r} cm, so ½ × π × ${r}² = ${f(r*r/2)}π cm²`,`Total: ${l*w} + ${f(r*r/2)}π ≈ ${f(A,1)} cm²`]}; }
  ];

  /* ---------- V1 cuboids ---------- */
  const cub=[
    R=>{ const u=pickU(R), l=R.int(3,12), w=R.int(2,8), h=R.int(2,9); return {text:'Find the volume of this cuboid.', base:u, ans:l*w*h, unit:u+'³', hint:F.cub,
      fig:cuboidFig(l,w,h,[`${l} ${u}`,`${w} ${u}`,`${h} ${u}`]), work:[`V = ${v('b','l')} × ${v('w','w')} × ${v('h','h')}`,`= ${v('b',l)} × ${v('w',w)} × ${v('h',h)} = ${l*w*h} ${u}³`]}; },
    R=>{ const s=R.int(2,10); return {text:'Find the volume of this cube.', base:'cm', ans:s*s*s, unit:'cm³', hint:F.cub,
      fig:cuboidFig(1,1,1,[`${s} cm`,'','']), work:['Every edge of a cube is the same length.',`V = ${s} × ${s} × ${s} = ${s*s*s} cm³`]}; },
    R=>{ const l=R.int(4,10), w=R.int(2,6), h=R.int(2,9); const V=l*w*h; return {text:`A box has a volume of <b>${V} cm³</b>. It is ${l} cm long and ${w} cm wide. How tall is it?`, base:'cm', ans:h, unit:'cm', hint:F.cub,
      fig:cuboidFig(l,w,h,[`${l} cm`,`${w} cm`,'?']), work:[`Area of the base: ${l} × ${w} = ${l*w} cm²`,`${v('h','h')} = ${V} ÷ ${l*w} = ${h} cm`]}; },
    R=>{ const l=R.pick([40,50,60,80]), w=R.pick([20,25,30,40]), h=R.pick([20,30,40,50]); const V=l*w*h; return {text:`A fish tank is ${l} cm long, ${w} cm wide and ${h} cm high. How many <b>litres</b> of water does it hold when full? (1 litre = 1000 cm³)`, units:['cm³','litres','ml'], ans:V/1000, unit:'litres', hint:F.cub,
      fig:cuboidFig(l,w,h,[`${l} cm`,`${w} cm`,`${h} cm`]), work:[`V = ${l} × ${w} × ${h} = ${f(V)} cm³`,`${f(V)} ÷ 1000 = ${f(V/1000)} litres`]}; }
  ];

  /* ---------- V2 prisms ---------- */
  const prism=[
    R=>{ const b=R.int(3,10), h=R.int(3,9), L=R.int(5,15), a=R.int(1,b-1); const A=b*h/2; return {text:'Find the volume of this triangular prism.', base:'cm', ans:A*L, unit:'cm³', hint:F.prism,
      fig:prismFig([[0,0],[b,0],[a,h]],L,{len:`${L} cm`,dims:[{a:[0,0],b:[b,0],t:`${b} cm`,k:'b',off:16}],dash:[[[a,0],[a,h]]],area:''}).replace('</svg>',(()=>`</svg>`)()) ,
      work:[`Cross-section (triangle): ½ × ${b} × ${h} = ${f(A)} cm²`,`V = ${v('c',f(A))} × ${v('b',L)} = ${f(A*L)} cm³`], _h:h}; },
    R=>{ const A=R.int(8,40), L=R.int(3,15); return {text:`The cross-section of this prism has an area of <b>${A} cm²</b>. The prism is <b>${L} cm</b> long. Find its volume.`, base:'cm', ans:A*L, unit:'cm³', hint:F.prism,
      fig:prismFig([[0,0],[4,0],[4,1],[1,1],[1,4],[0,4]],L/2.5,{len:`${L} cm`,area:`${A} cm²`}), work:[`V = ${v('c',A)} × ${v('b',L)} = ${A*L} cm³`]}; },
    R=>{ const a=R.int(2,6), b=a+R.even(2,6), h=R.int(2,6), L=R.int(4,12); const A=(a+b)*h/2; const o=(b-a)/2; return {text:'This prism has a trapezium cross-section. Find its volume.', base:'cm', ans:A*L, unit:'cm³', hint:`${F.trap}<br>${F.prism}`,
      fig:prismFig([[0,0],[b,0],[o+a,h],[o,h]],L,{len:`${L} cm`,dims:[{a:[0,0],b:[b,0],t:`${b} cm`,k:'w',off:16},{a:[o,h],b:[o+a,h],t:`${a} cm`,k:'b',off:-12}],dash:[[[o,0],[o,h]]]}),
      work:[`Cross-section: ½ × (${a} + ${b}) × ${h} = ${f(A)} cm²`,`V = ${v('c',f(A))} × ${v('b',L)} = ${f(A*L)} cm³`], _h:h}; },
    R=>{ const s=R.int(3,9), L=R.int(5,20); return {text:`A chocolate bar is a prism. Its end is a triangle with base ${s} cm and perpendicular height ${s-1} cm. The bar is ${L} cm long. Find the volume of chocolate.`, base:'cm', ans:s*(s-1)/2*L, unit:'cm³', hint:F.prism, fig:'',
      work:[`Cross-section: ½ × ${s} × ${s-1} = ${f(s*(s-1)/2)} cm²`,`V = ${f(s*(s-1)/2)} × ${L} = ${f(s*(s-1)/2*L)} cm³`]}; }
  ];
  // put the height label on the triangle / trapezium prisms
  prism.forEach((g,i)=>{ if(i===0||i===2){ prism[i]=R=>{ const q=g(R); q.fig=q.fig.replace('</svg>',''); const m=q.fig.match(/class="hgt"[^>]*x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/); if(m){ const x=(+m[1]+ +m[3])/2+6, y=(+m[2]+ +m[4])/2; q.fig+=`<text class="dl" x="${x}" y="${y}" style="fill:#bf5a32;text-anchor:start">${q._h} cm</text>`; } q.fig+='</svg>'; return q; }; } });

  /* ---------- V3 cylinders ---------- */
  const cyl=[
    R=>{ const r=R.int(2,10), h=R.int(3,20); const V=Math.PI*r*r*h; return {text:'Find the volume of this cylinder.', base:'cm', ans:V, dp:1, pi:true, unit:'cm³', hint:F.cyl,
      fig:cylFig(`${r} cm`,`${h} cm`,false,r*2/h), work:[`Area of circle: π × ${v('r',r)}² = ${r*r}π cm²`,`V = ${r*r}π × ${v('h',h)} = ${r*r*h}π ≈ ${f(V,1)} cm³`]}; },
    R=>{ const d=R.even(4,20), h=R.int(3,20); const r=d/2, V=Math.PI*r*r*h; return {text:'Find the volume of this cylinder.', base:'cm', ans:V, dp:1, pi:true, unit:'cm³', hint:F.cyl,
      fig:cylFig(`${d} cm`,`${h} cm`,true,d/h), work:[`The diameter is ${d} cm, so the radius is ${v('r',r)} cm.`,`V = π × ${r}² × ${v('h',h)} = ${r*r*h}π ≈ ${f(V,1)} cm³`]}; },
    R=>{ const d=R.pick([6,7,8,10]), h=R.pick([10,11,12,15]); const r=d/2, V=Math.PI*r*r*h; return {text:`A tin of beans is a cylinder with diameter ${d} cm and height ${h} cm. How many millilitres does it hold? (1 ml = 1 cm³) Give your answer to the nearest ml.`, units:['ml','cm²','cm'], ans:Math.round(V), unit:'ml', hint:F.cyl, fig:'',
      work:[`Radius = ${d} ÷ 2 = ${f(r)} cm`,`V = π × ${f(r)}² × ${h} = ${f(r*r*h)}π ≈ ${f(V,3)} cm³`,`1 cm³ = 1 ml, so to the nearest ml: ${Math.round(V)} ml`]}; }
  ];
  cyl[2]=(g=>R=>{ const q=g(R); q.ans=Math.round(q.ans); return q; })(cyl[2]);

  /* ---------- U1 units ---------- */
  const units=[
    R=>{ const n=R.int(2,15); return {text:`Change <b>${n} cm²</b> into mm².`, units:['mm','mm²','mm³'], ans:n*100, unit:'mm²', hint:'1 cm² = 100 mm²', fig:'', work:['1 cm² = 10 mm × 10 mm = 100 mm²',`${n} × 100 = ${n*100} mm²`]}; },
    R=>{ const n=R.half(1,6); return {text:`Change <b>${f(n)} m²</b> into cm².`, units:['cm','cm²','cm³'], ans:n*10000, unit:'cm²', hint:'1 m² = 10 000 cm²', fig:'', work:['1 m² = 100 cm × 100 cm = 10 000 cm²',`${f(n)} × 10 000 = ${f(n*10000)} cm²`]}; },
    R=>{ const n=R.int(2,40)*50; return {text:`Change <b>${n} mm²</b> into cm².`, units:['cm','cm²','cm³'], ans:n/100, unit:'cm²', hint:'1 cm² = 100 mm²', fig:'', work:['Going to a bigger unit, so divide.',`${n} ÷ 100 = ${f(n/100)} cm²`]}; },
    R=>{ const n=R.half(1,5); return {text:`A bottle holds <b>${f(n)} litres</b>. How many cm³ is that?`, units:['cm','cm²','cm³'], ans:n*1000, unit:'cm³', hint:'1 litre = 1000 cm³', fig:'', work:[`${f(n)} × 1000 = ${f(n*1000)} cm³`]}; },
    R=>{ const n=R.int(2,9); return {text:`Change <b>${n} cm³</b> into mm³.`, units:['mm','mm²','mm³'], ans:n*1000, unit:'mm³', hint:'1 cm³ = 1000 mm³', fig:'', work:['1 cm³ = 10 × 10 × 10 = 1000 mm³',`${n} × 1000 = ${f(n*1000)} mm³`]}; },
    R=>{ const l=R.pick([150,200,250,300,400]), w=R.pick([100,120,150,200]); return {text:`A rug is ${l} cm long and ${w} cm wide. Find its area in <b>m²</b>.`, units:['m','m²','cm²'], ans:l*w/10000, unit:'m²', hint:'Change the lengths to metres first: 100 cm = 1 m', fig:'', work:[`${l} cm = ${f(l/100)} m and ${w} cm = ${f(w/100)} m`,`${f(l/100)} × ${f(w/100)} = ${f(l*w/10000)} m²`,`(Or: ${l} × ${w} = ${f(l*w)} cm², then ÷ 10 000.)`]}; }
  ];

  return {rect,tri,para,trap,circ,comp,cub,prism,cyl,units};
})();
