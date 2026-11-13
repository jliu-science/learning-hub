/* ===== Perimeter & circumference practice: question generators (added to window.AVQ) ===== */
(function(){
  const K=()=>MathsEngine.K, v=(k,t)=>K().v(k,t), f=(x,dp)=>K().fmt(x,dp), fig=s=>K().figure(s);
  const pickU=R=>R.pick(['cm','cm','cm','m','mm']);
  const F={ rect:`P = 2 × (<i class="v v-b">l</i> + <i class="v v-w">w</i>)`, all:'Perimeter = add the lengths of all the sides',
    circ:`C = π<i class="v v-b">d</i> = 2π<i class="v v-r">r</i>`, semi:`Perimeter = ½ × π<i class="v v-b">d</i> + <i class="v v-b">d</i>` };
  const sq=(p,u,w)=>[p,u,w];

  const perim=[
    R=>{ const u=pickU(R), l=R.int(4,15), w=R.int(2,l-1); return {text:'Find the perimeter of this rectangle.', base:u, ans:2*(l+w), unit:u, hint:F.rect,
      fig:fig({pts:[[0,0],[l,0],[l,w],[0,w]],ra:[sq([0,0],[1,0],[0,1])],dims:[{a:[0,0],b:[l,0],t:`${l} ${u}`,k:'b'},{a:[l,0],b:[l,w],t:`${w} ${u}`,k:'w'}]}),
      work:[`Two lengths and two widths: ${l} + ${w} + ${l} + ${w}`,`= 2 × (${v('b',l)} + ${v('w',w)}) = 2 × ${l+w} = ${2*(l+w)} ${u}`,'Perimeter is a length, so the unit is not squared.']}; },
    R=>{ const s=R.int(3,12); return {text:`A square has an area of <b>${s*s} cm²</b>. What is its perimeter?`, base:'cm', ans:4*s, unit:'cm', hint:'Side × side = area. A square has 4 equal sides.', fig:'',
      work:[`Side × side = ${s*s}, so each side is ${s} cm (because ${s} × ${s} = ${s*s}).`,`Perimeter = 4 × ${s} = ${4*s} cm`]}; },
    R=>{ const l=R.int(5,14), w=R.int(2,l-1); const P=2*(l+w); return {text:`A rectangle has a perimeter of <b>${P} cm</b>. Its length is <b>${l} cm</b>. How wide is it?`, base:'cm', ans:w, unit:'cm', hint:F.rect,
      fig:fig({pts:[[0,0],[l,0],[l,w],[0,w]],dims:[{a:[0,0],b:[l,0],t:`${l} cm`,k:'b'},{a:[l,0],b:[l,w],t:'?',k:'w'}]}),
      work:[`The two lengths make ${l} + ${l} = ${2*l} cm.`,`That leaves ${P} − ${2*l} = ${P-2*l} cm for the two widths.`,`One width = ${P-2*l} ÷ 2 = ${w} cm`]}; },
    R=>{ const Wd=R.int(8,14), Ht=R.int(6,11), cw=R.int(2,Wd-3), ch=R.int(2,Ht-3);
      const pts=[[0,0],[Wd,0],[Wd,Ht-ch],[Wd-cw,Ht-ch],[Wd-cw,Ht],[0,Ht]];
      return {text:'Find the perimeter of this shape. All corners are right angles.', base:'cm', ans:2*(Wd+Ht), unit:'cm', hint:F.all,
        fig:fig({pts,dims:[{a:[0,0],b:[Wd,0],t:`${Wd} cm`,k:'b'},{a:[0,Ht],b:[0,0],t:`${Ht} cm`,k:'h'},{a:[Wd,0],b:[Wd,Ht-ch],t:`${Ht-ch} cm`,k:'h'},{a:[Wd-cw,Ht],b:[0,Ht],t:`${Wd-cw} cm`,k:'b'}]}),
        work:[`Missing sides: ${Wd} − ${Wd-cw} = ${cw} cm and ${Ht} − ${Ht-ch} = ${ch} cm.`,`${Wd} + ${Ht-ch} + ${cw} + ${ch} + ${Wd-cw} + ${Ht} = ${2*(Wd+Ht)} cm`]}; },
    R=>{ const a=R.int(4,12), b=R.int(4,12), c=R.int(Math.abs(a-b)+2,a+b-2); const P=a+b+c; return {text:'Find the perimeter of this triangle.', base:'cm', ans:P, unit:'cm', hint:F.all,
      fig:(()=>{ const x=(a*a+c*c-b*b)/(2*a), y=Math.sqrt(Math.max(c*c-x*x,1)); return fig({pts:[[0,0],[a,0],[x,y]],dims:[{a:[0,0],b:[a,0],t:`${a} cm`,k:'b'},{a:[a,0],b:[x,y],t:`${b} cm`,k:'w'},{a:[x,y],b:[0,0],t:`${c} cm`,k:'h'}]}); })(),
      work:[`${a} + ${b} + ${c} = ${P} cm`]}; },
    R=>{ const n=R.pick([[5,'pentagon'],[6,'hexagon'],[8,'octagon']]), s=R.int(3,12); return {text:`A regular ${n[1]} has sides of <b>${s} cm</b>. Find its perimeter.`, base:'cm', ans:n[0]*s, unit:'cm', hint:'Regular means all the sides are the same length.', fig:'',
      work:[`A ${n[1]} has ${n[0]} sides, all ${s} cm.`,`${n[0]} × ${s} = ${n[0]*s} cm`]}; }
  ];

  const cfig=(t,k,dia)=>fig({circles:[{c:[0,0],r:1}],extra:(m,s)=>{ const c=m([0,0]); return dia
    ?`<line x1="${c[0]-s}" y1="${c[1]}" x2="${c[0]+s}" y2="${c[1]}" stroke="#2f4fa2" stroke-width="2"/><text class="dl" x="${c[0]}" y="${c[1]-12}" style="fill:#2f4fa2">${t}</text>`
    :`<line x1="${c[0]}" y1="${c[1]}" x2="${c[0]+s}" y2="${c[1]}" stroke="#6a4c93" stroke-width="2"/><text class="dl" x="${c[0]+s/2}" y="${c[1]-12}" style="fill:#6a4c93">${t}</text>`; }});
  const circum=[
    R=>{ const d=R.int(3,20), u=pickU(R); const C=Math.PI*d; return {text:'Find the circumference of this circle.', base:u, ans:C, dp:1, pi:true, unit:u, hint:F.circ,
      fig:cfig(`${d} ${u}`,'b',true), work:[`C = π${v('b','d')} = π × ${v('b',d)}`,`≈ ${f(C,1)} ${u} (1 d.p.)`]}; },
    R=>{ const r=R.int(2,15); const C=2*Math.PI*r; return {text:'Find the circumference of this circle.', base:'cm', ans:C, dp:1, pi:true, unit:'cm', hint:F.circ,
      fig:cfig(`${r} cm`,'r',false), work:[`This is the radius, so d = 2 × ${r} = ${2*r} cm.`,`C = π × ${2*r} = ${2*r}π ≈ ${f(C,1)} cm (1 d.p.)`]}; },
    R=>{ const d=R.even(4,20); const curve=Math.PI*d/2, Ptot=curve+d; return {text:'Find the perimeter of this semicircle.', base:'cm', ans:Ptot, dp:1, pi:true, piOffset:d, unit:'cm', hint:F.semi,
      fig:fig({pts:Array.from({length:31},(_,i)=>[Math.cos(Math.PI*i/30),Math.sin(Math.PI*i/30)]),dims:[{a:[1,0],b:[-1,0],t:`${d} cm`,k:'b',off:-0.001}]}),
      work:[`Curved edge: half of π × ${d} = ${d/2}π cm`,`Straight edge: the diameter, ${d} cm`,`Perimeter = ${d/2}π + ${d} ≈ ${f(Ptot,1)} cm`,'Keep π until the last step, then round.']}; },
    R=>{ const d=R.pick([50,60,64,70,80]), n=R.pick([10,20,50,100]); const dist=Math.PI*d*n/100; return {text:`A bicycle wheel has a diameter of <b>${d} cm</b>. How far does the bike move, in <b>metres</b>, when the wheel turns ${n} times?`, units:['m','m²','cm²'], ans:dist, dp:1, pi:true, unit:'m', hint:`${F.circ}<br>100 cm = 1 m`, fig:'',
      work:[`One turn: π × ${d} cm`,`${n} turns: π × ${d} × ${n} = ${d*n}π cm`,`In metres: ${d*n}π ÷ 100 = ${f(d*n/100)}π ≈ ${f(dist,1)} m`]}; }
  ];
  window.AVQ.perim=perim; window.AVQ.circum=circum;
})();
