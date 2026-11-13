/* ===== Volume and units: interactive "See why" and "Explore" widgets ===== */
window.AV=window.AV||{};
(function(){
  const W=560, H=380;
  const LAYER=[['#bfdbfe','#dbeafe','#93c5fd'],['#a7f3d0','#d1fae5','#6ee7b7'],['#fed7aa','#ffedd5','#fdba74'],['#ddd6fe','#ede9fe','#c4b5fd'],['#fbcfe8','#fce7f3','#f9a8d4'],['#fde68a','#fef3c7','#fcd34d']];
  const DK=.5, DA=35, dxk=Math.cos(DA*Math.PI/180)*DK, dyk=Math.sin(DA*Math.PI/180)*DK;

  /* ================= V1 cuboid ================= */
  function cuboidDraw(K,l,w,h,n,o={}){
    const s=o.s||Math.min(40,300/(l+w*dxk),250/(h+w*dyk));
    const ox=(W-(l+w*dxk)*s)/2, oy=(H+(h+w*dyk)*s)/2+(o.dy||0); const P=K.oblique(ox,oy,s,DK,DA);
    const list=[]; for(let z=0;z<h;z++) for(let y=w-1;y>=0;y--) for(let x=0;x<l;x++) list.push([x,y,z]);
    let out=K.boxFrame(P,l,w,h);
    out+=K.cubes(list.slice(0,n),P,(x,y,z)=>LAYER[z%LAYER.length]);
    if(n>=l*w*h) out+=K.boxFrame(P,l,w,h).replace(/frame hid/g,'frame hid" style="display:none');
    else out+=K.boxFrame(P,l,w,h).replace(/class="frame"/g,'class="frame" style="opacity:.35"');
    out+=K.dim(P(0,0,0),P(l,0,0),o.ll||`${l} cm`,'b',20);
    out+=K.dim(P(l,0,0),P(l,w,0),o.wl||`${w} cm`,'w',18);
    out+=K.dim(P(0,0,h),P(0,0,0),o.hl||`${h} cm`,'h',20);
    return out;
  }
  const fillTo=(K,st,l,w,h,from,to,ms,o)=>K.tween(from,to,ms,c=>st.draw(cuboidDraw(K,l,w,h,Math.round(c),o)));
  AV.cuboid={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const l=4,w=3,h=3; let stop=()=>{}; const lab={ll:'l = 4 cm',wl:'w = 3 cm',hl:'h = 3 cm'};
      K.steps(panel,[
        {t:`<p><b>Volume</b> is how much space a 3D shape takes up.</p><p>We measure it in <b>unit cubes</b>. A cube that is 1 cm long, 1 cm wide and 1 cm high has a volume of <b>1 cm³</b> (one cubic centimetre).</p>`},
        {t:`<p>Fill the bottom of the box with one layer of cubes.</p><p>The layer has ${K.v('w','3')} rows of ${K.v('b','4')} cubes, so it holds ${K.v('b','4')} × ${K.v('w','3')} = <b>12 cubes</b>. That is the same as the area of the base.</p>`},
        {t:`<p>Now stack more layers until the box is full. It is ${K.v('h','3')} cm high, so there are ${K.v('h','3')} layers.</p><p>12 × ${K.v('h','3')} = <b>36 cubes</b>, so the volume is <b>36 cm³</b>.</p>`},
        {t:`<p>Cubes in one layer × number of layers gives:</p>${K.formula(`Volume = ${K.v('b','l')} × ${K.v('w','w')} × ${K.v('h','h')}<small>or area of the base × height</small>`)}<p class="mnote">The unit is <b>cubed</b> (cm³, m³) because we are counting cubes.</p>`}
      ],(i)=>{ stop();
        if(i===0) st.draw(cuboidDraw(K,l,w,h,1,lab)+`<text class="dl" x="${W/2-60}" y="${H-22}" style="fill:#2563eb">one cube = 1 cm³</text>`);
        if(i===1) stop=fillTo(K,st,l,w,h,1,l*w,1500,lab);
        if(i===2) stop=fillTo(K,st,l,w,h,l*w,l*w*h,1800,lab);
        if(i===3) st.draw(cuboidDraw(K,l,w,h,l*w*h,lab));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let l=5,w=3,h=4,mode='full', stop=()=>{};
      const c=K.calc();
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the sliders to change the box. Then fill it with cubes.'));
      const draw=(anim)=>{ stop(); const N=mode==='empty'?0:mode==='base'?l*w:l*w*h, s=34;
        if(anim) stop=fillTo(K,st,l,w,h,0,N,Math.min(2500,N*40),{s}); else st.draw(cuboidDraw(K,l,w,h,N,{s}));
        c.innerHTML=`<span class="hint">One layer: length × width</span>${K.v('b',l)} × ${K.v('w',w)} = ${l*w} cubes<br><span class="hint">Layers: height = ${h}</span>${l*w} × ${K.v('h',h)} = <span class="res">${l*w*h} cm³</span>`; };
      K.slider(panel,{label:'Length',k:'b',min:1,max:7,value:l,unit:'cm',oninput:x=>{ l=x; draw(); }});
      K.slider(panel,{label:'Width',k:'w',min:1,max:5,value:w,unit:'cm',oninput:x=>{ w=x; draw(); }});
      K.slider(panel,{label:'Height',k:'h',min:1,max:5,value:h,unit:'cm',oninput:x=>{ h=x; draw(); }});
      K.seg(panel,[['empty','Empty'],['base','One layer'],['full','Fill it']],mode,x=>{ mode=x; draw(true); });
      panel.append(c); draw(); }
  };

  /* ================= V2 prism ================= */
  const XS={
    tri:{name:'Triangle',pts:[[0,0],[4,0],[1,3]],area:'½ × 4 × 3 = 6',A:6},
    L:{name:'L-shape',pts:[[0,0],[4,0],[4,1],[1,1],[1,4],[0,4]],area:'4 × 1 + 1 × 3 = 7',A:7},
    trap:{name:'Trapezium',pts:[[0,0],[5,0],[4,3],[1,3]],area:'½ × (3 + 5) × 3 = 12',A:12},
    rect:{name:'Rectangle',pts:[[0,0],[4,0],[4,2],[0,2]],area:'4 × 2 = 8',A:8}
  };
  function prismDraw(K,x,L,o={}){
    const pts=x.pts, s=32, mx=Math.max(...pts.map(p=>p[0])), mz=Math.max(...pts.map(p=>p[1]));
    const ox=(W-(mx+L*dxk)*s)/2, oy=(H+(mz+L*dyk)*s)/2+6; const P=K.oblique(ox,oy,s,DK,DA);
    const at=d=>pts.map(([u,v])=>P(u,d,v));
    let out='';
    pts.forEach(([u,v])=>out+=K.line(P(u,0,v),P(u,L,v),'edge'));
    const step=o.solid?0.08:1;
    for(let d=L;d>0.0001;d=+(d-step).toFixed(3)){ const k=Math.round(d); out+=K.poly(at(d),o.solid?'':'slice',o.solid?'fill:#99f6e4;stroke:none':`fill:${k%2?'#ccfbf1':'#e6fbf6'}`); }
    if(o.solid) pts.forEach(([u,v])=>out+=K.line(P(u,0,v),P(u,L,v),'edge','opacity:.5'));
    out+=K.poly(at(0),'slice front','fill:#5eead4');
    const cx=pts.reduce((a,p)=>a+p[0],0)/pts.length, cz=pts.reduce((a,p)=>a+p[1],0)/pts.length; const C=P(cx,0,cz);
    out+=`<text class="dl" x="${C[0]}" y="${C[1]}" style="fill:#115e59;font-size:14px">${o.al||'A = '+x.A+' cm²'}</text>`;
    out+=K.dim(P(mx,0,0),P(mx,L,0),o.ll||`${L} cm`,'b',16);
    return out;
  }
  AV.prism={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const x=XS.tri; let stop=()=>{};
      K.steps(panel,[
        {t:`<p>A <b>prism</b> is a 3D shape that is the same shape all the way through. Slice it anywhere (parallel to the end) and you get the same face.</p><p>That face is called the <b>cross-section</b>. Here it is a triangle.</p>`},
        {t:`<p>Cut the prism into slices 1 cm thick.</p><p>Each slice has the same area as the cross-section (6 cm²) and is 1 cm thick, so each slice is <b>6 cm³</b>.</p>`},
        {t:`<p>Watch the prism grow one slice at a time. Every 1 cm of length adds another 6 cm³.</p><p>6 slices: 6 × 6 = <b>36 cm³</b>.</p>`},
        {t:`<p>So for any prism:</p>${K.formula(`Volume = ${K.v('c','A')} × ${K.v('b','l')}<small>area of cross-section × length</small>`)}<p class="mnote">A cuboid is a prism too: its cross-section is a rectangle. That is why length × width × height works.</p>`}
      ],(i)=>{ stop();
        if(i===0) st.draw(prismDraw(K,x,6,{solid:true,ll:'length 6 cm'}));
        if(i===1) st.draw(prismDraw(K,x,6,{ll:'6 slices'}));
        if(i===2) stop=K.tween(1,6,2400,L=>st.draw(prismDraw(K,x,Math.round(L),{ll:Math.round(L)+' cm',al:`${Math.round(L)} × 6 = ${6*Math.round(L)} cm³`})));
        if(i===3) st.draw(prismDraw(K,x,6,{solid:true,ll:'l = 6 cm'}));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let key='L', L=5, slices=true;
      const c=K.calc(), tg=K.h('div',{class:'toggles'});
      const draw=()=>{ const x=XS[key]; st.draw(prismDraw(K,x,L,{solid:!slices}));
        c.innerHTML=`<span class="hint">Area of cross-section</span>${x.area} cm²<br><span class="hint">Volume = area × length</span>${K.v('c',x.A)} × ${K.v('b',L)} = <span class="res">${x.A*L} cm³</span>`; };
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Choose a cross-section, then change the length.'));
      K.seg(panel,Object.keys(XS).map(k=>[k,XS[k].name]),key,k=>{ key=k; draw(); });
      K.slider(panel,{label:'Length',k:'b',min:1,max:9,value:L,unit:'cm',oninput:x=>{ L=x; draw(); }});
      const bt=K.h('button',{class:'tg on'},'Show 1 cm slices'); bt.onclick=()=>{ slices=!slices; bt.classList.toggle('on',slices); draw(); }; tg.appendChild(bt);
      panel.append(tg,c); draw(); }
  };

  /* ================= V3 cylinder ================= */
  function cylDraw(K,r,h,o={}){
    const s=o.s||30, R=r*s, ry=R*.32, cx=W/2, yb=H-40-ry; let out='';
    const yz=z=>yb-z*s;
    if(o.ghost) out+=`<path d="M${cx-R} ${yz(o.ghost)}L${cx-R} ${yb}A${R} ${ry} 0 0 0 ${cx+R} ${yb}L${cx+R} ${yz(o.ghost)}" fill="none" stroke="#b9ad94" stroke-dasharray="5 4"/><ellipse cx="${cx}" cy="${yz(o.ghost)}" rx="${R}" ry="${ry}" fill="none" stroke="#b9ad94" stroke-dasharray="5 4"/>`;
    if(h===0){ out+=`<ellipse class="shape" cx="${cx}" cy="${yb}" rx="${R}" ry="${ry}" style="fill:#ddd6fe"/>`; }
    for(let z=0;z<h;z++){ const yt=yz(z+1), y0=yz(z), c=LAYER[(z+3)%LAYER.length];
      out+=`<path d="M${cx-R} ${yt}L${cx-R} ${y0}A${R} ${ry} 0 0 0 ${cx+R} ${y0}L${cx+R} ${yt}A${R} ${ry} 0 0 1 ${cx-R} ${yt}Z" fill="${c[2]}" stroke="#3d3a33" stroke-width="1"/>`;
      out+=`<ellipse cx="${cx}" cy="${yt}" rx="${R}" ry="${ry}" fill="${c[1]}" stroke="#3d3a33" stroke-width="1"/>`; }
    const top=yz(h);
    out+=`<line x1="${cx}" y1="${top}" x2="${cx+R}" y2="${top}" stroke="${K.COL.r}" stroke-width="2.5"/><circle cx="${cx}" cy="${top}" r="2.5"/>`;
    out+=`<text class="dl" x="${cx+R/2}" y="${top-12}" style="fill:${K.COL.r}">${o.rl||'r = '+K.fmt(r)+' cm'}</text>`;
    if(h>0) out+=K.dim([cx+R,yb],[cx+R,top],o.hl||`${h} cm`,'h',-22);
    if(o.al) out+=`<text class="dl" x="${cx}" y="${top+ry+18}" style="fill:#3d3a33;font-size:14px">${o.al}</text>`;
    return out;
  }
  AV.cyl={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const r=3,h=6; let stop=()=>{};
      K.steps(panel,[
        {t:`<p>A <b>cylinder</b> is like a prism with a circle as its cross-section.</p><p>Start with the circle on the bottom. Its area is π${K.v('r','r')}².</p><p>With ${K.v('r','r')} = 3 cm: π × 3² = 9π ≈ 28.3 cm².</p>`},
        {t:`<p>Make it 1 cm thick, like a coin.</p><p>Its volume is the area of the circle × 1 cm = 9π cm³ ≈ 28.3 cm³.</p>`},
        {t:`<p>Stack coins until the cylinder is ${K.v('h','6')} cm tall.</p><p>6 × 9π = 54π ≈ 169.6 cm³.</p>`},
        {t:`<p>Area of the circle × height:</p>${K.formula(`Volume = π${K.v('r','r')}² × ${K.v('h','h')}<small>also written πr²h</small>`)}<p class="mnote"><b>Watch out:</b> if you are given the diameter, halve it first to get the radius.</p>`}
      ],(i)=>{ stop();
        if(i===0) st.draw(cylDraw(K,r,0,{ghost:h,al:'πr² = 9π ≈ 28.3 cm²'}));
        if(i===1) st.draw(cylDraw(K,r,1,{ghost:h,hl:'1 cm'}));
        if(i===2) stop=K.tween(1,h,2000,z=>st.draw(cylDraw(K,r,Math.round(z),{ghost:h})));
        if(i===3) st.draw(cylDraw(K,r,h,{}));
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); let r=3,h=5;
      const c=K.calc();
      const draw=()=>{ st.draw(cylDraw(K,r,h,{s:Math.min(30,260/(h+r*.64+1))}));
        const A=Math.PI*r*r; c.innerHTML=`<span class="hint">Area of circle = πr²</span>π × ${K.v('r',K.fmt(r))}² = ${K.fmt(r*r)}π cm²<br><span class="hint">Volume = area × height</span>${K.fmt(r*r)}π × ${K.v('h',h)} = ${K.fmt(r*r*h)}π ≈ <span class="res">${K.fmt(A*h,1)} cm³</span>`; };
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Change the radius and the height. Which makes the volume grow faster?'));
      K.slider(panel,{label:'Radius',k:'r',min:1,max:4,step:.5,value:r,unit:'cm',oninput:x=>{ r=x; draw(); }});
      K.slider(panel,{label:'Height',k:'h',min:1,max:8,value:h,unit:'cm',oninput:x=>{ h=x; draw(); }});
      panel.append(c,K.h('div',{class:'mnote'},'Doubling the height doubles the volume. Doubling the radius makes it <b>4 times</b> bigger, because the radius is squared.'));
      draw(); }
  };

  /* ================= U1 units ================= */
  function gridSq(x,y,size,n,col){ let d=''; for(let i=1;i<n;i++){ d+=`M${x+i*size/n} ${y}v${size}M${x} ${y+i*size/n}h${size}`; } return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${col}" stroke="#1d1b16" stroke-width="2"/><path d="${d}" stroke="#1d1b16" stroke-opacity=".35" stroke-width="1"/>`; }
  function gridCube(K,ox,oy,size,n,col){ const P=K.oblique(ox,oy,size,DK,DA); let s='';
    const face=(pts,c)=>s+=K.poly(pts,'','fill:'+c+';stroke:#1d1b16;stroke-width:2');
    face([P(0,0,0),P(1,0,0),P(1,0,1),P(0,0,1)],col[0]); face([P(0,0,1),P(1,0,1),P(1,1,1),P(0,1,1)],col[1]); face([P(1,0,0),P(1,1,0),P(1,1,1),P(1,0,1)],col[2]);
    let d=''; const L=(a,b)=>d+=`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    for(let i=1;i<n;i++){ const t=i/n; L(P(t,0,0),P(t,0,1)); L(P(0,0,t),P(1,0,t)); L(P(t,0,1),P(t,1,1)); L(P(0,t,1),P(1,t,1)); L(P(1,t,0),P(1,t,1)); L(P(1,0,t),P(1,1,t)); }
    return s+`<path d="${d}" stroke="#1d1b16" stroke-opacity=".3" stroke-width="1"/>`; }
  AV.units={
    see(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H);
      K.steps(panel,[
        {t:`<p>1 cm = 10 mm. So a 1 cm square is 10 mm long and 10 mm wide.</p><p>Inside it are 10 × 10 = <b>100</b> tiny squares, each 1 mm².</p>${K.formula('1 cm² = 100 mm²')}<p class="mnote"><b>Common mistake:</b> thinking 1 cm² = 10 mm². The square is 10 mm in <b>both</b> directions.</p>`},
        {t:`<p>1 m = 100 cm. A 1 m square is 100 cm by 100 cm.</p><p>100 × 100 = <b>10 000</b>.</p>${K.formula('1 m² = 10 000 cm²')}`},
        {t:`<p>A 1 cm cube is 10 mm long, 10 mm wide and 10 mm high.</p><p>10 × 10 × 10 = <b>1000</b> tiny cubes.</p>${K.formula('1 cm³ = 1000 mm³')}`},
        {t:`<p>For liquids we use litres and millilitres.</p>${K.formula('1 ml = 1 cm³<small>and</small>1 litre = 1000 cm³')}<p>A cube 10 cm × 10 cm × 10 cm holds exactly 1 litre.</p>`}
      ],(i)=>{
        if(i===0) st.draw(gridSq(180,50,200,10,'#ccfbf1')+K.dim([180,250],[380,250],'1 cm = 10 mm','b',22)+K.dim([180,250],[180,50],'1 cm = 10 mm','w',22)+`<rect x="180" y="50" width="20" height="20" fill="#0d9488"/>`+`<text class="dl" x="470" y="62" style="fill:#0d9488;font-size:14px">1 mm²</text><line x1="200" y1="60" x2="440" y2="60" stroke="#0d9488" stroke-width="1"/>`);
        if(i===1) st.draw(gridSq(170,40,220,10,'#ede9fe')+K.dim([170,260],[390,260],'1 m = 100 cm','b',22)+K.dim([170,260],[170,40],'1 m = 100 cm','w',22)+`<text class="dl" x="280" y="350" style="fill:#3d3a33;font-size:13px">each small square here is 10 cm × 10 cm = 100 cm²</text>`);
        if(i===2) st.draw(gridCube(K,170,300,200,10,['#bfdbfe','#dbeafe','#93c5fd'])+K.dim([170,300],[370,300],'10 mm','b',20)+K.dim([170,100],[170,300],'10 mm','h',20));
        if(i===3) st.draw(gridCube(K,170,300,200,10,['#a7f3d0','#d1fae5','#6ee7b7'])+K.dim([170,300],[370,300],'10 cm','b',20)+K.dim([170,100],[170,300],'10 cm','h',20)+`<text class="big-a" x="270" y="200">1 litre</text><text class="dl" x="270" y="232" style="fill:#3d3a33;font-size:13px">each little cube is 1 cm³ = 1 ml</text>`);
      }); },
    explore(p,K){ const {stage,panel}=K.split(p); const st=K.stage(stage,W,H); const S=40, OX=64, OY=326, C=12, Rw=7; let l=3,w=2,u='cm';
      const X=a=>OX+a*S, Y=b=>OY-b*S; const c=K.calc();
      const draw=()=>{ let d=''; for(let i=0;i<=C*10;i++){ d+=`M${OX+i*S/10} ${OY-Rw*S}v${Rw*S}`; } for(let j=0;j<=Rw*10;j++) d+=`M${OX} ${OY-j*S/10}h${C*S}`;
        let s=`<path d="${d}" stroke="#efe7d6" stroke-width=".6"/>`+K.grid(OX,OY-Rw*S,C,Rw,S);
        s+=`<rect class="shape" x="${X(0)}" y="${Y(w)}" width="${l*S}" height="${w*S}" style="fill-opacity:.8"/>`;
        s+=K.dim([X(0),Y(0)],[X(l),Y(0)],u==='cm'?`${l} cm`:`${l*10} mm`,'b',18)+K.dim([X(0),Y(w)],[X(0),Y(0)],u==='cm'?`${w} cm`:`${w*10} mm`,'w',18)+K.handle('c',X(l),Y(w),'b');
        st.draw(s);
        c.innerHTML=`<span class="hint">In centimetres</span>${K.v('b',l)} × ${K.v('w',w)} = <span class="res">${l*w} cm²</span><br><span class="hint">In millimetres</span>${K.v('b',l*10)} × ${K.v('w',w*10)} = <span class="res">${K.fmt(l*w*100)} mm²</span><span class="hint">${K.fmt(l*w*100)} ÷ ${l*w} = 100, every time.</span>`; };
      panel.append(K.h('p',{class:'hint',style:'margin:0'},'Drag the corner. The faint lines are millimetres. Switch units to see both answers.'));
      K.seg(panel,[['cm','Label in cm'],['mm','Label in mm']],u,x=>{ u=x; draw(); });
      panel.append(c,K.h('div',{class:'mnote'},'Both lengths get 10 times bigger, so the area gets 10 × 10 = 100 times bigger.'));
      st.onDrag((n,x,y)=>{ if(x===null) return; l=Math.max(1,Math.min(C-1,Math.round((x-OX)/S))); w=Math.max(1,Math.min(Rw-1,Math.round((OY-y)/S))); draw(); });
      draw(); }
  };
})();
