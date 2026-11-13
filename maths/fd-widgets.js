/* ===== Fractions: interactive "Explore" and "See why" widgets =====
   Same pattern as perimeter-widgets.js: cues, live sums and feedback are drawn ON the diagram. */
window.AV=window.AV||{};
(function(){
  const W=760, H=420, INK='#26231f', PAPER='#fffdf8';
  const BLUE='#2f4fa2', BLUES='#dbe3f4', ORA='#bf5a32', ORAS='#f4dccd', GRN='#3a7a57', GRNS='#d3e8da', RED='#b4322a', TEAL='#2d7f86', TEALS='#b6dcdc';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const hdl=(n,x,y,k,pulse)=>`<g class="hdl${pulse?' pulse':''}" data-h="${n}" transform="translate(${x},${y})" style="--hc:${k}"><circle class="hit" r="20"/><circle class="ring" r="11"/><circle class="dot" r="5"/></g>`;
  const tag=(x,y,t,anchor='start')=>`<g class="pcue"><text x="${x}" y="${y}" style="text-anchor:${anchor}">${t}</text></g>`;
  const btn=(id,x,y,w,t,on,cue)=>`<g class="sbtn${on?' on':''}" data-b="${id}" transform="translate(${x},${y})">${cue?`<rect class="cue-ring" x="-4" y="-4" width="${w+8}" height="38" rx="19"/>`:''}<rect width="${w}" height="30" rx="15"/><text x="${w/2}" y="20">${t}</text></g>`;
  const onBtn=(svg,fn)=>svg.addEventListener('click',e=>{ const b=e.target.closest('[data-b]'); if(b) fn(b.dataset.b); });
  const top=(p,K)=>{ const panel=K.h('div',{class:'mtopsteps'}), box=K.h('div',{class:'mleft mfull'}); p.append(panel,box); return {panel,stage:box}; };
  const full=(p,K)=>{ const box=K.h('div',{class:'mleft mfull'}); p.appendChild(box); return box; };
  const svgPt=(svg,e)=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  const txt=(x,y,t,cls='sums',style='')=>`<text class="${cls}" x="${x}" y="${y}" style="${style}">${t}</text>`;

  /* ---------- fractions drawn in SVG: expr(x,y,[ 'text', [n,d], [w,n,d], {v:..,c:colour} ]) ---------- */
  const cw=(ch,sz)=>sz*(ch===' '?.28:/[0-9]/.test(ch)?.6:/[×÷+−=<>≠≈]/.test(ch)?.66:/[iljtfrI.,:;'!|]/.test(ch)?.3:/[mwMW]/.test(ch)?.9:/[A-Z]/.test(ch)?.7:.58);
  const tw=(s,sz)=>[...String(s)].reduce((a,c)=>a+cw(c,sz),0);
  const fw=(n,d,sz)=>Math.max(tw(n,sz),tw(d,sz))+sz*.4;
  function expr(x,y,items,o={}){
    const sz=o.size||24, gap=sz*.32; let col0=o.col||INK;
    const parts=items.map(it=>{ let c=col0; if(it&&typeof it==='object'&&!Array.isArray(it)){ c=it.c; it=it.v; }
      if(!Array.isArray(it)){ const s=String(it); return {k:'t',s,c,w:tw(s,sz)}; }
      if(it.length===2) return it[1]===1?{k:'t',s:String(it[0]),c,w:tw(it[0],sz)}:{k:'f',n:it[0],d:it[1],c,w:fw(it[0],it[1],sz)};
      if(it[1]===0) return {k:'t',s:String(it[0]),c,w:tw(it[0],sz)};
      const ww=tw(it[0],sz)+sz*.08; return it[0]?{k:'m',wh:it[0],n:it[1],d:it[2],c,ww,w:ww+fw(it[1],it[2],sz)}:{k:'f',n:it[1],d:it[2],c,w:fw(it[1],it[2],sz)}; });
    const tot=parts.reduce((a,p)=>a+p.w,0)+gap*(parts.length-1);
    let cx=o.anchor==='middle'?x-tot/2:o.anchor==='end'?x-tot:x, out=`<g class="fx" style="font:500 ${sz}px Fraunces,Georgia,serif">`;
    const frac=(x0,n,d,c)=>{ const w=fw(n,d,sz), m=x0+w/2; return `<text x="${m}" y="${y-sz*.18}" style="fill:${c};text-anchor:middle">${n}</text><line x1="${x0+2}" y1="${y}" x2="${x0+w-2}" y2="${y}" stroke="${c}" stroke-width="${Math.max(1.1,sz/20)}"/><text x="${m}" y="${y+sz*.86}" style="fill:${c};text-anchor:middle">${d}</text>`; };
    parts.forEach(p=>{ if(p.k==='t') out+=`<text x="${cx}" y="${y+sz*.36}" style="fill:${p.c}">${p.s}</text>`;
      else if(p.k==='f') out+=frac(cx,p.n,p.d,p.c);
      else out+=`<text x="${cx}" y="${y+sz*.36}" style="fill:${p.c}">${p.wh}</text>`+frac(cx+p.ww,p.n,p.d,p.c);
      cx+=p.w+gap; });
    return out+'</g>';
  }
  /* simplest form of n/d as an expr item: whole, proper fraction or mixed number */
  const simp=(n,d,mixed=true)=>{ const g=gcd(n,d); n/=g; d/=g; if(d===1) return [n,1]; if(mixed&&n>d) return [Math.floor(n/d),n%d,d]; return [n,d]; };

  /* bar split into n equal pieces, the first s shaded (s may be a decimal); o.cut = extra cut lines faded in with o.op */
  function bar(x,y,w,h,n,s,fill,o={}){
    let out=fill==='none'?'':`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER}"/>`;
    if(s>0) out+=`<rect x="${x}" y="${y}" width="${w*Math.min(s,n)/n}" height="${h}" fill="${fill}"/>`;
    if(o.cut&&o.op>0) for(let i=1;i<o.cut;i++){ const xx=x+w*i/o.cut; out+=`<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y+h}" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3" opacity="${o.op*.8}"/>`; }
    for(let i=1;i<n;i++){ const xx=x+w*i/n; out+=`<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y+h}" stroke="${INK}" stroke-width="${n>30?.5:.8}" opacity=".45"/>`; }
    return out+`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
  }
  window.FDH={W,H,INK,PAPER,BLUE,BLUES,ORA,ORAS,GRN,GRNS,RED,TEAL,TEALS,clamp,gcd,lcm,hdl,tag,btn,onBtn,top,full,svgPt,txt,expr,simp,bar,tw};

  /* ================= F1 equivalent fractions ================= */
  AV.equiv={
    explore(p,K){ const st=K.stage(full(p,K),W,H);
      const TG=[[3,4,8],[2,3,4],[3,5,10],[1,2,6],[5,6,12],[2,5,15],[1,3,9],[3,8,16],[4,5,10]];
      let ti=0, a=3, b=4, n=8, s=0, touched=false; const X0=150, BW=520, BH=54, Y1=88, Y2=228;
      const draw=()=>{ const tx=X0+a/b*BW, need=a*n/b, match=s>0&&s*b===a*n, lines=n%b===0; let o='';
        o+=btn('new',W-160,8,140,'New fraction',false);
        o+=txt(X0,Y1-12,'match this','klab')+bar(X0,Y1,BW,BH,b,a,ORAS)+expr(84,Y1+BH/2-4,[[a,b]],{anchor:'middle',size:28,col:ORA});
        o+=txt(X0,Y2-12,`your bar · ${n} equal pieces`,'klab')+bar(X0,Y2,BW,BH,n,s,match?GRNS:BLUES)+expr(84,Y2+BH/2-4,[[s,n]],{anchor:'middle',size:28,col:match?GRN:BLUE});
        o+=`<line x1="${tx}" y1="${Y1}" x2="${tx}" y2="${Y2+BH+14}" stroke="${ORA}" stroke-width="2" stroke-dasharray="6 4"/>`;
        o+=btn('minus',X0,Y2+BH+24,44,'−',false)+btn('plus',X0+52,Y2+BH+24,44,'+',false)+txt(X0+108,Y2+BH+44,'pieces','klab');
        o+=hdl('s',X0+s/n*BW,Y2+BH/2,match?GRN:BLUE,!touched);
        if(!touched) o+=tag(X0+s/n*BW+24,Y2+BH/2+5,'drag to shade →');
        const sy=372;
        if(match){ const k=n/b; o+=expr(W/2,sy-6,[{v:[a,b],c:ORA},'=',{v:[s,n],c:GRN}],{anchor:'middle',size:30});
          o+=txt(W/2,sy+44,`Same amount. Top and bottom were both multiplied by ${k}.`,'goodt','text-anchor:middle'); }
        else if(!lines) o+=txt(W/2,sy,`No cut line lands on the dashed line, so ${n} pieces can never match ${a}/${b} exactly.`,'warnt','text-anchor:middle')+txt(W/2,sy+26,`Try a number of pieces that ${b} goes into.`,'sums','text-anchor:middle');
        else if(touched) o+=txt(W/2,sy,s<need?`Not enough yet: shade up to the dashed line.`:`Too much: go back to the dashed line.`,'sums','text-anchor:middle;font-size:16px;fill:#a4532e');
        st.draw(o); };
      st.onDrag((nm,x)=>{ if(x===null){ draw(); return; } touched=true; s=clamp(Math.round((x-X0)/BW*n),0,n); draw(); });
      onBtn(st.svg,id=>{ if(id==='new'){ ti=(ti+1)%TG.length; [a,b]=TG[ti]; n=b+1; s=0; touched=false; }
        else { const m=n; n=clamp(n+(id==='plus'?1:-1),2,24); s=Math.round(s/m*n); }
        draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const X0=170, BW=480, BH=50;
      const row=(y,n,s,f,col,lab,o)=>bar(X0,y,BW,BH,n,s,f,o)+expr(92,y+BH/2-4,[lab],{anchor:'middle',size:28,col});
      const dash=(t,y0,y1,c=ORA)=>`<line x1="${X0+t*BW}" y1="${y0}" x2="${X0+t*BW}" y2="${y1}" stroke="${c}" stroke-width="2" stroke-dasharray="6 4"/>`;
      K.steps(panel,[
        {t:`<p><b>${K.fr(3,4)}</b> means the whole is cut into <b>4 equal pieces</b> and we take <b>3</b> of them.</p>`},
        {t:`<p>Cut every piece in half. Now there are <b>8</b> pieces and <b>6</b> are shaded, but the shaded <b>amount</b> has not changed.</p>${K.formula(`${K.fr(3,4)} = ${K.fr('3 × 2','4 × 2')} = ${K.fr(6,8)}`)}`},
        {t:`<p>Cut each quarter into 3 instead and you get ${K.fr(9,12)}. These are all <b>equivalent fractions</b>.</p><p class="mnote">Multiply the top and the bottom by the <b>same</b> number.</p>`},
        {t:`<p>Going the other way is <b>simplifying</b>. Group the twelfths in fours: ${K.fr(8,12)} becomes ${K.fr(2,3)}.</p>${K.formula(`${K.fr(8,12)} = ${K.fr('8 ÷ 4','12 ÷ 4')} = ${K.fr(2,3)}`)}<p class="mnote">Divide by the <b>highest common factor</b> (here 4) to get the simplest form in one go.</p>`},
        {t:`<p><b>Common mistake:</b> adding the same number to the top and bottom. ${K.fr(1,2)} → ${K.fr('1 + 1','2 + 1')} = ${K.fr(2,3)} is <b>not</b> equal. Only multiplying or dividing keeps the amount the same.</p>`}
      ],i=>{ stop();
        if(i===0) st.draw(row(150,4,3,BLUES,BLUE,[3,4])+dash(.75,140,215)+txt(X0,240,'3 of 4 equal pieces'));
        if(i===1) stop=K.tween(0,1,1400,t=>st.draw(row(70,4,3,BLUES,BLUE,[3,4])+row(200,4,3,GRNS,GRN,t>.95?[6,8]:[3,4],{cut:8,op:t})+(t>.95?bar(X0,200,BW,BH,8,6,GRNS):'')+dash(.75,60,265)+(t>.95?expr(W/2,330,[{v:[3,4],c:BLUE},'=',{v:[6,8],c:GRN}],{anchor:'middle',size:28})+txt(W/2,398,'4 pieces × 2 = 8 pieces,   3 shaded × 2 = 6 shaded','sums','text-anchor:middle'):'')));
        if(i===2) st.draw(row(40,4,3,BLUES,BLUE,[3,4])+row(140,8,6,GRNS,GRN,[6,8])+row(240,12,9,ORAS,ORA,[9,12])+dash(.75,30,300,INK)+expr(W/2,350,[{v:[3,4],c:BLUE},'=',{v:[6,8],c:GRN},'=',{v:[9,12],c:ORA}],{anchor:'middle',size:28}));
        if(i===3) stop=K.tween(0,1,1200,t=>{ let g=''; for(let k=0;k<3;k++) g+=`<rect x="${X0+k*BW/3}" y="64" width="${BW/3}" height="${BH+12}" fill="none" stroke="${GRN}" stroke-width="3" opacity="${t}"/>`;
          st.draw(row(70,12,8,BLUES,BLUE,[8,12])+g+(t>.9?row(210,3,2,GRNS,GRN,[2,3])+dash(2/3,60,270,INK)+expr(W/2,330,[{v:[8,12],c:BLUE},'=',{v:[2,3],c:GRN}],{anchor:'middle',size:28})+txt(W/2,396,'groups of 4 twelfths: 8 ÷ 4 = 2 and 12 ÷ 4 = 3','sums','text-anchor:middle'):'')); });
        if(i===4) st.draw(row(70,2,1,BLUES,BLUE,[1,2])+row(200,3,2,'#f1d2cc',RED,[2,3])+dash(.5,60,265,BLUE)+dash(2/3,60,265,RED)+expr(W/2,330,[{v:[1,2],c:BLUE},{v:'≠',c:RED},{v:[2,3],c:RED}],{anchor:'middle',size:28})+txt(W/2,396,'2/3 is bigger than 1/2: the dashed lines do not meet','warnt','text-anchor:middle'));
      }); }
  };

  /* ================= F2 mixed numbers and improper fractions ================= */
  AV.mixfr={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const NX=80, U=150, NY=330, BY=210, BH=50;
      let d=4, v=11, touched=false;
      const draw=()=>{ let o=txt(NX,30,'pieces in a whole','klab'); [2,3,4,5,6,8].forEach((k,j)=>o+=btn('d'+k,NX+150+j*44,10,38,k,k===d));
        for(let k=0;k<4;k++){ const s=clamp(v-k*d,0,d), x=NX+k*U+5; o+=bar(x,BY,U-10,BH,d,s,s===d?'#b8c7ea':BLUES);
          if(s===d) o+=txt(x+(U-10)/2,BY-10,'1 whole','sums',`text-anchor:middle;fill:${BLUE};font-weight:600`);
          for(let j=0;j<s;j++) o+=`<text class="cnt" x="${x+(j+.5)*(U-10)/d}" y="${BY+BH/2}" style="fill:${INK}">${k*d+j+1}</text>`; }
        o+=`<line x1="${NX-12}" y1="${NY}" x2="${NX+4*U+12}" y2="${NY}" stroke="${INK}" stroke-width="1.3"/>`;
        for(let j=0;j<=4*d;j++){ const x=NX+j*U/d, big=j%d===0; o+=`<line x1="${x}" y1="${NY-(big?10:6)}" x2="${x}" y2="${NY+(big?10:6)}" stroke="${INK}" stroke-width="${big?2:1.2}"/>`; if(big) o+=txt(x,NY+32,j/d,'tick','font-size:16px;font-weight:600;fill:'+INK); }
        o+=hdl('v',NX+v/d*U,NY,BLUE,!touched); if(!touched) o+=tag(NX+v/d*U+22,NY-16,'drag along the line');
        const w=Math.floor(v/d), r=v%d;
        o+=txt(W/2-200,74,'improper fraction','klab','text-anchor:middle')+txt(W/2+40,74,v<d?'':'mixed number','klab','text-anchor:middle');
        o+=expr(W/2-200,118,[[v,d]],{anchor:'middle',size:34,col:BLUE});
        if(v>=d){ o+=expr(W/2-80,118,['='],{anchor:'middle',size:34})+expr(W/2+40,118,[r?[w,r,d]:[w,1]],{anchor:'middle',size:34,col:GRN});
          o+=txt(W/2+140,108,`${v} ÷ ${d} = ${w}${r?` remainder ${r}`:''}`,'sums','font-size:15px;fill:'+INK)+txt(W/2+140,130,r?`${w} whole${w>1?'s':''} and ${r} piece${r>1?'s':''} left`:'no pieces left over'); }
        else o+=txt(W/2-120,124,'less than 1 whole, so it is a proper fraction','sums');
        st.draw(o); };
      st.onDrag((n,x)=>{ if(x===null){ draw(); return; } touched=true; v=clamp(Math.round((x-NX)/U*d),1,4*d); draw(); });
      onBtn(st.svg,id=>{ const nd=+id.slice(1); v=clamp(Math.round(v/d*nd),1,4*nd); d=nd; draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const U=150, pw=U/4;
      const piece=(x,y,c=BLUES)=>`<rect x="${x}" y="${y}" width="${pw}" height="46" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
      const startX=i=>70+i*(pw+18), endX=i=>80+Math.floor(i/4)*(U+30)+(i%4)*pw;
      const grouped=()=>{ let o=''; for(let i=0;i<11;i++) o+=piece(endX(i),200); o+=`<rect x="80" y="200" width="${U}" height="46" fill="none" stroke="${INK}" stroke-width="1.6"/><rect x="${80+U+30}" y="200" width="${U}" height="46" fill="none" stroke="${INK}" stroke-width="1.6"/><rect x="${80+2*(U+30)}" y="200" width="${U}" height="46" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
        return o+txt(80+U/2,270,'1 whole','sums','text-anchor:middle')+txt(80+U*1.5+30,270,'1 whole','sums','text-anchor:middle')+txt(80+2*(U+30)+U/2,270,'3 quarters','sums','text-anchor:middle'); };
      K.steps(panel,[
        {t:`<p>${K.fr(11,4)} means <b>11 quarters</b>. The top is bigger than the bottom, so it is more than 1 whole. This is an <b>improper fraction</b>.</p>`},
        {t:`<p>Every <b>4 quarters</b> make <b>1 whole</b>. How many wholes can we make from 11 quarters?</p>${K.formula('11 ÷ 4 = 2 remainder 3')}`},
        {t:`<p>2 wholes and 3 quarters left over. As a <b>mixed number</b>:</p>${K.formula(`${K.fr(11,4)} = 2${K.fr(3,4)}`)}`},
        {t:`<p>Going back: each whole is 4 quarters, so 2 wholes are 8 quarters, plus 3 more.</p>${K.formula(`2${K.fr(3,4)} = ${K.fr('2 × 4 + 3',4)} = ${K.fr(11,4)}`)}<p class="mnote">Multiply the whole number by the bottom, then add the top.</p>`},
        {t:`<p>On a number line, ${K.fr(11,4)} sits between 2 and 3: three quarters of the way from 2 to 3.</p>`}
      ],i=>{ stop();
        if(i===0){ let o=''; for(let k=0;k<11;k++) o+=piece(startX(k),130)+`<text class="cnt" x="${startX(k)+pw/2}" y="153" style="fill:${INK}">${k+1}</text>`; st.draw(o+expr(W/2,290,[[11,4]],{anchor:'middle',size:34,col:BLUE})+txt(W/2,360,'11 pieces, each one quarter of a whole','sums','text-anchor:middle')); }
        if(i===1) stop=K.tween(0,1,1800,t=>{ let o=''; for(let k=0;k<11;k++){ const tt=clamp(t*1.6-k*.055,0,1); o+=piece(startX(k)+(endX(k)-startX(k))*tt,130+70*tt); } st.draw(o+(t>.98?grouped():'')+(t>.98?expr(W/2,340,['11 ÷ 4 = 2 remainder 3'],{anchor:'middle',size:26}):'')); });
        if(i===2) st.draw(grouped()+expr(W/2,340,[{v:[11,4],c:BLUE},'=',{v:[2,3,4],c:GRN}],{anchor:'middle',size:34}));
        if(i===3) st.draw(grouped()+expr(W/2,340,[{v:[2,3,4],c:GRN},'=',['2 × 4 + 3',4],'=',{v:[11,4],c:BLUE}],{anchor:'middle',size:28}));
        if(i===4){ const NX=90, LU=150, NY=230; let o=`<line x1="${NX-12}" y1="${NY}" x2="${NX+4*LU+12}" y2="${NY}" stroke="${INK}" stroke-width="1.3"/>`;
          for(let j=0;j<=16;j++){ const x=NX+j*LU/4, big=j%4===0; o+=`<line x1="${x}" y1="${NY-(big?10:6)}" x2="${x}" y2="${NY+(big?10:6)}" stroke="${INK}" stroke-width="${big?2:1.2}"/>`; if(big) o+=txt(x,NY+32,j/4,'tick','font-size:16px;font-weight:600;fill:'+INK); }
          const x=NX+2.75*LU; o+=`<circle cx="${x}" cy="${NY}" r="8" fill="${RED}" stroke="${PAPER}" stroke-width="3"/>`+expr(x,NY-70,[{v:[11,4],c:BLUE},'=',{v:[2,3,4],c:GRN}],{anchor:'middle',size:26});
          st.draw(o); }
      }); }
  };

  /* ================= F3 adding and subtracting ================= */
  const DEN=[2,3,4,5,6,8,10,12];
  function pair(op){ for(;;){ const da=DEN[Math.floor(Math.random()*DEN.length)], db=DEN[Math.floor(Math.random()*DEN.length)];
    if(da===db||lcm(da,db)>24) continue; const na=1+Math.floor(Math.random()*(da-1)), nb=1+Math.floor(Math.random()*(db-1));
    if(gcd(na,da)>1||gcd(nb,db)>1) continue; if(op==='-'&&na*db<=nb*da) continue; return [[na,da],[nb,db]]; } }
  AV.addfr={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const BW=280, BH=46, AX=90, BX=450, TY=118, RY=262;
      let op='+', A=[1,2], B=[1,3], cut=false, placed=false, drag=null, grab=[0,0], msg='';
      const draw=()=>{ const L=lcm(A[1],B[1]), na=cut?A[0]*L/A[1]:A[0], nb=cut?B[0]*L/B[1]:B[0], pa=cut?L:A[1], pb=cut?L:B[1]; let o='';
        o+=btn('add',AX,8,44,'+',op==='+')+btn('sub',AX+50,8,44,'−',op==='-')+btn('new',AX+110,8,110,'New pair',false)+btn('cut',BX+40,8,200,'Cut into equal pieces',cut,!cut);
        if(!cut) o+=tag(BX+28,28,'start here','end');
        o+=expr(AX+BW/2,TY-44,cut?[[A[0],A[1]],'=',{v:[na,L],c:BLUE}]:[[A[0],A[1]]],{anchor:'middle',size:24,col:BLUE});
        o+=expr(BX+BW/2,TY-44,cut?[[B[0],B[1]],'=',{v:[nb,L],c:ORA}]:[[B[0],B[1]]],{anchor:'middle',size:24,col:ORA});
        o+=bar(AX,TY,BW,BH,pa,na,BLUES)+bar(BX,TY,BW,BH,pb,(drag||placed)?0:nb,ORAS);
        if(drag||placed) o+=`<rect x="${BX}" y="${TY}" width="${BW*nb/pb}" height="${BH}" fill="${ORAS}" opacity=".35"/>`;
        o+=expr((AX+BW+BX)/2,TY+BH/2-2,[op==='+'?'+':'−'],{anchor:'middle',size:30,col:'#7a7366'});
        /* answer row */
        o+=txt(AX,RY-12,'answer','klab');
        const rN=op==='+'?na+nb:na-nb;
        const wholes=op==='+'?2:1;
        for(let k=0;k<wholes;k++){ const x=AX+k*(BX-AX); let s=0, fill=BLUES; o+=`<g>${bar(x,RY,BW,BH,pa,0,BLUES)}</g>`;
          for(let j=0;j<pa;j++){ const idx=k*pa+j, px=x+j*BW/pa, pwid=BW/pa; let c=null, cross=false;
            if(idx<na) c=BLUES; if(op==='+'&&placed&&idx>=na&&idx<na+nb) c=ORAS; if(op==='-'&&placed&&idx>=na-nb&&idx<na){ c='#f1d2cc'; cross=true; }
            if(c) o+=`<rect x="${px}" y="${RY}" width="${pwid}" height="${BH}" fill="${c}"/>`;
            if(cross) o+=`<line x1="${px+3}" y1="${RY+3}" x2="${px+pwid-3}" y2="${RY+BH-3}" stroke="${RED}" stroke-width="2"/>`; }
          o+=bar(x,RY,BW,BH,pa,0,'none'); }
        /* the piece of B being dragged */
        if(!placed){ const bx=drag?drag[0]:BX, by=drag?drag[1]:TY, bw=BW*nb/pb;
          o+=`<g class="drag-b" data-h="B">${bar(bx,by,bw,BH,nb,nb,ORAS)}</g>`+hdl('B',bx+bw/2,by+BH/2,ORA,cut&&!drag);
          if(cut&&!drag) o+=tag(bx+bw/2+18,by+BH+24,'drag down onto the answer');
          }
        /* the sum, on the diagram */
        const sy=362;
        if(placed){ const it=[{v:[na,L],c:BLUE},op==='+'?'+':'−',{v:[nb,L],c:ORA},'=',[rN,L]]; const g=gcd(rN,L);
          if(g>1||rN>L) it.push('=',{v:simp(rN,L),c:GRN}); o+=expr(W/2,sy-8,it,{anchor:'middle',size:28});
          o+=txt(W/2,sy+44,op==='+'?'Same-sized pieces: add the tops, keep the bottom.':'Same-sized pieces: subtract the tops, keep the bottom.','goodt','text-anchor:middle'); }
        else o+=expr(W/2,sy-8,cut?[{v:[na,L],c:BLUE},op==='+'?'+':'−',{v:[nb,L],c:ORA},'=','?']:[{v:A,c:BLUE},op==='+'?'+':'−',{v:B,c:ORA},'=','?'],{anchor:'middle',size:28});
        if(msg) o+=txt(W/2,sy+44,msg,'warnt','text-anchor:middle');
        st.draw(o); };
      st.svg.addEventListener('pointerdown',e=>{ if(!e.target.closest('[data-h="B"]')) return; const q=svgPt(st.svg,e); grab=[q.x-(drag?drag[0]:BX),q.y-(drag?drag[1]:TY)]; });
      st.onDrag((n,x,y)=>{ if(x===null){ if(drag){ if(drag[1]>RY-70){ if(!cut){ msg='Different-sized pieces cannot be counted together. Cut into equal pieces first.'; } else { placed=true; msg=''; } } drag=null; } draw(); return; }
        drag=[x-grab[0],y-grab[1]]; msg=''; draw(); });
      onBtn(st.svg,id=>{ msg='';
        if(id==='add'||id==='sub'){ op=id==='add'?'+':'-'; if(op==='-'&&A[0]*B[1]<=B[0]*A[1]) [A,B]=pair(op); cut=false; placed=false; }
        if(id==='new'){ [A,B]=pair(op); cut=false; placed=false; }
        if(id==='cut'&&!cut){ cut=true; placed=false; }
        draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const BW=300, BH=46, X0=200;
      const row=(y,n,s,f,col,lab,w=BW)=>bar(X0,y,w,BH,n,s,f)+expr(110,y+BH/2-4,[lab],{anchor:'middle',size:26,col});
      K.steps(panel,[
        {t:`<p>${K.fr(1,2)} + ${K.fr(1,3)}: the pieces are <b>different sizes</b> (halves and thirds), so we cannot just count them.</p>`},
        {t:`<p><b>Common mistake:</b> add the tops and add the bottoms to get ${K.fr(2,5)}. But ${K.fr(2,5)} is <b>smaller</b> than ${K.fr(1,2)} on its own, so it must be wrong.</p>`},
        {t:`<p>Cut both into <b>sixths</b>, a size that both 2 and 3 go into (the lowest common multiple).</p>${K.formula(`${K.fr(3,6)} + ${K.fr(2,6)} = ${K.fr(5,6)}`)}<p>Now the pieces match: add the tops, keep the bottom.</p>`},
        {t:`<p>Subtracting works the same way. 4 and 3 both go into <b>12</b>.</p>${K.formula(`${K.fr(3,4)} − ${K.fr(1,3)} = ${K.fr(9,12)} − ${K.fr(4,12)} = ${K.fr(5,12)}`)}`},
        {t:`<p>If the answer is more than 1, change it to a mixed number.</p>${K.formula(`${K.fr(3,4)} + ${K.fr(1,2)} = ${K.fr(3,4)} + ${K.fr(2,4)} = ${K.fr(5,4)} = 1${K.fr(1,4)}`)}`}
      ],i=>{ stop();
        if(i===0) st.draw(row(80,2,1,BLUES,BLUE,[1,2])+row(170,3,1,ORAS,ORA,[1,3])+expr(W/2+60,320,[{v:[1,2],c:BLUE},'+',{v:[1,3],c:ORA},'=','?'],{anchor:'middle',size:28}));
        if(i===1) st.draw(row(60,2,1,BLUES,BLUE,[1,2])+row(140,3,1,ORAS,ORA,[1,3])+row(240,5,2,'#f1d2cc',RED,[2,5])+`<line x1="${X0+BW/2}" y1="50" x2="${X0+BW/2}" y2="300" stroke="${BLUE}" stroke-width="2" stroke-dasharray="6 4"/>`+txt(X0+BW+20,268,'smaller than ½ alone!','warnt'));
        if(i===2) stop=K.tween(0,1,1200,t=>st.draw(bar(X0,60,BW,BH,2,1,BLUES,{cut:6,op:t})+expr(110,79,[t>.95?[3,6]:[1,2]],{anchor:'middle',size:26,col:BLUE})+bar(X0,140,BW,BH,3,1,ORAS,{cut:6,op:t})+expr(110,159,[t>.95?[2,6]:[1,3]],{anchor:'middle',size:26,col:ORA})
          +(t>.95?bar(X0,240,BW,BH,6,0,BLUES)+`<rect x="${X0}" y="240" width="${BW/2}" height="${BH}" fill="${BLUES}"/><rect x="${X0+BW/2}" y="240" width="${BW/3}" height="${BH}" fill="${ORAS}"/>`+bar(X0,240,BW,BH,6,0,'none')+expr(110,259,[[5,6]],{anchor:'middle',size:26,col:GRN})+txt(X0,226,'3 sixths + 2 sixths = 5 sixths'):'')));
        if(i===3) st.draw(row(60,12,9,BLUES,BLUE,[9,12])+row(140,12,4,ORAS,ORA,[4,12])+bar(X0,240,BW,BH,12,0,BLUES)+`<rect x="${X0}" y="240" width="${BW*5/12}" height="${BH}" fill="${GRNS}"/>`+(()=>{ let o=''; for(let j=5;j<9;j++){ const x=X0+j*BW/12; o+=`<rect x="${x}" y="240" width="${BW/12}" height="${BH}" fill="#f1d2cc"/><line x1="${x+3}" y1="243" x2="${x+BW/12-3}" y2="${240+BH-3}" stroke="${RED}" stroke-width="2"/>`; } return o; })()+bar(X0,240,BW,BH,12,0,'none')+expr(110,259,[[5,12]],{anchor:'middle',size:26,col:GRN})+txt(X0,226,'9 twelfths, take away 4 twelfths'));
        if(i===4){ const w2=BW*.8; st.draw(bar(X0,60,w2,BH,4,3,BLUES)+expr(110,79,[[3,4]],{anchor:'middle',size:26,col:BLUE})+bar(X0,140,w2,BH,4,2,ORAS)+expr(110,159,[[2,4]],{anchor:'middle',size:26,col:ORA})
          +bar(X0,250,w2,BH,4,3,BLUES)+`<rect x="${X0+w2*.75}" y="250" width="${w2/4}" height="${BH}" fill="${ORAS}"/>`+bar(X0,250,w2,BH,4,0,'none')
          +bar(X0+w2+20,250,w2,BH,4,1,ORAS)+txt(X0+w2/2,320,'1 whole','sums','text-anchor:middle')+txt(X0+w2+20+w2/8,320,'1 quarter','sums','text-anchor:middle')+expr(110,269,[[1,1,4]],{anchor:'middle',size:26,col:GRN})); }
      }); }
  };

  /* ================= F4 multiplying ================= */
  AV.mulfr={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const SX=130, SY=74, SZ=300;
      let a=2, b=3, c=3, d=4, touched=false;
      const draw=()=>{ let o=''; const xa=SX+a/b*SZ, yc=SY+SZ-c/d*SZ;
        o+=`<rect x="${SX}" y="${SY}" width="${SZ}" height="${SZ}" fill="${PAPER}"/>`;
        o+=`<rect x="${SX}" y="${SY}" width="${xa-SX}" height="${SZ}" fill="${BLUES}"/><rect x="${SX}" y="${yc}" width="${SZ}" height="${SY+SZ-yc}" fill="${ORAS}"/><rect x="${SX}" y="${yc}" width="${xa-SX}" height="${SY+SZ-yc}" fill="${TEALS}"/>`;
        for(let i=1;i<b;i++) o+=`<line x1="${SX+i*SZ/b}" y1="${SY}" x2="${SX+i*SZ/b}" y2="${SY+SZ}" stroke="${BLUE}" stroke-width="1.5"/>`;
        for(let j=1;j<d;j++) o+=`<line x1="${SX}" y1="${SY+j*SZ/d}" x2="${SX+SZ}" y2="${SY+j*SZ/d}" stroke="${ORA}" stroke-width="1.5"/>`;
        o+=`<rect x="${SX}" y="${SY}" width="${SZ}" height="${SZ}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
        o+=`<rect x="${SX}" y="${yc}" width="${xa-SX}" height="${SY+SZ-yc}" fill="none" stroke="${TEAL}" stroke-width="3"/>`;
        o+=expr((SX+xa)/2,SY-36,[[a,b]],{anchor:'middle',size:22,col:BLUE})+expr(SX-46,(yc+SY+SZ)/2-4,[[c,d]],{anchor:'middle',size:22,col:ORA});
        o+=hdl('a',xa,SY,BLUE,!touched)+hdl('c',SX,yc,ORA,!touched);
        if(!touched) o+=tag(xa+18,SY-14,'drag ↔')+tag(SX-20,yc-26,'drag ↕','end');
        const RX=470; o+=txt(RX,40,'columns','klab')+txt(RX,108,'rows','klab');
        [2,3,4,5,6].forEach((k,j)=>{ o+=btn('b'+k,RX+j*44,48,38,k,k===b)+btn('d'+k,RX+j*44,116,38,k,k===d); });
        o+=expr(RX,190,[{v:[a,b],c:BLUE},'of',{v:[c,d],c:ORA},'=','?'],{size:22});
        o+=txt(RX,244,`overlap: ${a} × ${c} = <tspan style="font-weight:700;fill:${TEAL}">${a*c}</tspan> small pieces`,'sums','font-size:15px');
        o+=txt(RX,268,`whole square: ${b} × ${d} = <tspan style="font-weight:700;fill:${INK}">${b*d}</tspan> small pieces`,'sums','font-size:15px');
        const it=[{v:[a,b],c:BLUE},'×',{v:[c,d],c:ORA},'=',{v:[a*c,b*d],c:TEAL}]; if(gcd(a*c,b*d)>1) it.push('=',simp(a*c,b*d));
        o+=expr(RX,326,it,{size:22})+txt(RX,388,'multiply the tops, multiply the bottoms','goodt');
        st.draw(o); };
      st.onDrag((n,x,y)=>{ if(x===null){ draw(); return; } touched=true;
        if(n==='a') a=clamp(Math.round((x-SX)/SZ*b),1,b); else c=clamp(Math.round((SY+SZ-y)/SZ*d),1,d); draw(); });
      onBtn(st.svg,id=>{ const k=+id.slice(1); if(id[0]==='b'){ a=clamp(Math.round(a/b*k),1,k); b=k; } else { c=clamp(Math.round(c/d*k),1,k); d=k; } draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{};
      const sq=(t,blue)=>{ const SX=150, SY=60, SZ=280; let o=`<rect x="${SX}" y="${SY}" width="${SZ}" height="${SZ}" fill="${PAPER}"/><rect x="${SX}" y="${SY+SZ/4}" width="${SZ}" height="${SZ*.75}" fill="${ORAS}"/>`;
        if(blue) o+=`<rect x="${SX}" y="${SY}" width="${SZ/2}" height="${SZ}" fill="${BLUES}" opacity="${t*.9}"/><rect x="${SX}" y="${SY+SZ/4}" width="${SZ/2}" height="${SZ*.75}" fill="${TEALS}" opacity="${t}"/><line x1="${SX+SZ/2}" y1="${SY}" x2="${SX+SZ/2}" y2="${SY+SZ}" stroke="${BLUE}" stroke-width="2" opacity="${t}"/>`;
        for(let j=1;j<4;j++) o+=`<line x1="${SX}" y1="${SY+j*SZ/4}" x2="${SX+SZ}" y2="${SY+j*SZ/4}" stroke="${ORA}" stroke-width="1.5"/>`;
        o+=`<rect x="${SX}" y="${SY}" width="${SZ}" height="${SZ}" fill="none" stroke="${INK}" stroke-width="1.6"/>`+expr(SX-46,SY+SZ*5/8-4,[[3,4]],{anchor:'middle',size:24,col:ORA});
        if(blue) o+=expr(SX+SZ/4,SY-30,[[1,2]],{anchor:'middle',size:24,col:BLUE}); return o; };
      K.steps(panel,[
        {t:`<p>A whole number times a fraction is repeated adding.</p>${K.formula(`3 × ${K.fr(2,5)} = ${K.fr(2,5)} + ${K.fr(2,5)} + ${K.fr(2,5)} = ${K.fr(6,5)} = 1${K.fr(1,5)}`)}`},
        {t:`<p>In maths, <b>"of" means ×</b>. Here is ${K.fr(3,4)} of a square. Now take <b>half of it</b>.</p>`},
        {t:`<p>The overlap is <b>3</b> of the <b>8</b> small pieces.</p>${K.formula(`${K.fr(1,2)} × ${K.fr(3,4)} = ${K.fr('1 × 3','2 × 4')} = ${K.fr(3,8)}`)}<p class="mnote">Multiply the tops, multiply the bottoms. No common denominator needed.</p>`},
        {t:`<p>A fraction <b>of an amount</b>: find ${K.fr(3,5)} of 20.</p>${K.formula('20 ÷ 5 = 4,  4 × 3 = 12')}<p>Divide by the bottom, multiply by the top.</p>`},
        {t:`<p>Multiplying by a fraction <b>less than 1</b> makes a number <b>smaller</b>: 12 × ${K.fr(1,2)} = 6 and 12 × ${K.fr(1,4)} = 3.</p>`}
      ],i=>{ stop();
        if(i===0){ let o=''; for(let k=0;k<3;k++) o+=bar(90+k*200,80,170,40,5,2,BLUES); o+=bar(140,230,300,40,5,5,GRNS)+bar(460,230,300,40,5,1,GRNS);
          st.draw(o+txt(90,64,'3 lots of two fifths')+txt(140,216,'6 fifths = 1 whole and 1 fifth')+expr(W/2,330,[[2,5],'+',[2,5],'+',[2,5],'=',[6,5],'=',{v:[1,1,5],c:GRN}],{anchor:'middle',size:26})); }
        if(i===1) stop=K.tween(0,1,1400,t=>st.draw(sq(t,true)));
        if(i===2) st.draw(sq(1,true)+expr(580,200,[{v:[1,2],c:BLUE},'×',{v:[3,4],c:ORA},'=',{v:[3,8],c:TEAL}],{anchor:'middle',size:26}));
        if(i===3){ let o=''; for(let g=0;g<5;g++){ o+=`<rect x="${80+g*124}" y="80" width="112" height="112" rx="4" fill="${g<3?GRNS:PAPER}" stroke="${g<3?GRN:'#b9ad94'}" stroke-width="2"/>`; for(let k=0;k<4;k++) o+=`<circle cx="${108+g*124+(k%2)*56}" cy="${108+Math.floor(k/2)*56}" r="14" fill="${g<3?GRN:'#d6ccb6'}"/>`; }
          st.draw(o+txt(80,64,'20 counters in 5 equal groups')+expr(W/2,280,[{v:[3,5],c:GRN},'of 20 = 3 groups of 4 = 12'],{anchor:'middle',size:26})); }
        if(i===4) stop=K.tween(0,1,1600,t=>{ const s=t<.5?6:3; st.draw(bar(80,120,600,50,12,12,'#e7e2d6')+bar(80,220,600,50,12,s,GRNS)+txt(80,104,'12')+expr(W/2,330,['12 ×',t<.5?[1,2]:[1,4],'=',{v:s,c:GRN}],{anchor:'middle',size:28})); });
      }); }
  };

  /* ================= F5 dividing ================= */
  const PR=[[3,1,1,4],[2,1,2,3],[3,4,1,8],[2,1,3,4],[3,4,1,2],[5,2,1,2],[1,2,1,6],[3,1,3,5]];
  AV.divfr={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const X0=90, LW=580, BY=120, PY=196, NY=300;
      let pi=0, j=0, touched=false;
      const draw=()=>{ const [pp,q,r,s]=PR[pi], D=pp/q, V=r/s, Wn=Math.max(1,Math.ceil(D-1e-9)), U=LW/Wn;
        const nFit=Math.floor((pp*s)/(q*r)+1e-9), exact=(pp*s)%(q*r)===0, stops=[]; for(let m=0;m<=nFit;m++) stops.push(m*V); if(!exact) stops.push(D);
        j=clamp(j,0,stops.length-1); const pos=stops[j], laid=Math.min(j,nFit), atEnd=j===stops.length-1; let o='';
        o+=btn('next',W-180,8,160,'Next problem',false);
        o+=expr(X0,46,['How many',{v:[r,s],c:ORA},'fit into',{v:[pp,q],c:GRN},'?'],{size:22});
        for(let k=0;k<Wn;k++) o+=`<rect x="${X0+k*U}" y="${BY}" width="${U}" height="50" fill="${PAPER}" stroke="#b9ad94" stroke-width="1.5" stroke-dasharray="5 4"/>`;
        o+=`<rect x="${X0}" y="${BY}" width="${D*U}" height="50" fill="${GRNS}" stroke="${INK}" stroke-width="1.3"/>`;
        for(let k=1;k<D-1e-9;k++) o+=`<line x1="${X0+k*U}" y1="${BY}" x2="${X0+k*U}" y2="${BY+50}" stroke="${INK}" stroke-width="1.2"/>`;
        for(let m=0;m<laid;m++) o+=`<rect x="${X0+m*V*U}" y="${PY}" width="${V*U}" height="40" fill="${m%2?'#e9c3ae':ORAS}" stroke="${INK}" stroke-width="1.5"/><text class="cnt" x="${X0+(m+.5)*V*U}" y="${PY+20}" style="fill:${INK};font-size:13px">${m+1}</text>`;
        if(atEnd&&!exact){ const left=D-nFit*V, x=X0+nFit*V*U; const [fn,fd]=[(pp*s)-(q*r)*nFit,q*r], g=gcd(fn,fd);
          o+=`<rect x="${x}" y="${PY}" width="${V*U}" height="40" fill="none" stroke="${ORA}" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="${x}" y="${PY}" width="${left*U}" height="40" fill="#efe0ae" stroke="${INK}" stroke-width="1.5"/>`;
          o+=expr(x+V*U/2,PY+70,[[fn/g,fd/g],'of a piece'],{anchor:'middle',size:16,col:'#a4532e'}); }
        o+=`<line x1="${X0-10}" y1="${NY}" x2="${X0+LW+10}" y2="${NY}" stroke="${INK}" stroke-width="1.3"/>`;
        const tk=s*Wn; for(let k=0;k<=tk;k++){ const x=X0+k*LW/tk, big=k%s===0; o+=`<line x1="${x}" y1="${NY-(big?10:5)}" x2="${x}" y2="${NY+(big?10:5)}" stroke="${INK}" stroke-width="${big?2:1}"/>`; if(big) o+=txt(x,NY+30,k/s,'tick','font-size:16px;font-weight:600;fill:'+INK); }
        o+=hdl('j',X0+pos*U,PY+20,ORA,!touched); if(!touched) o+=tag(X0+pos*U+22,PY+50,'drag to lay pieces →');
        const sy=372;
        if(atEnd){ const ans=simp(pp*s,q*r), divisor=[r,s], flip=[String(s),String(r)];
          o+=expr(X0,sy-10,[{v:[pp,q],c:GRN},'÷',{v:divisor,c:ORA},'=',{v:ans,c:INK}],{size:24});
          o+=expr(X0+340,sy-10,['keep, change, flip:',{v:[pp,q],c:GRN},'×',{v:flip,c:ORA},'=',ans],{size:18}); }
        else o+=txt(X0,sy,`${laid} piece${laid===1?'':'s'} so far`,'sums','font-size:18px;fill:'+INK);
        st.draw(o); };
      st.onDrag((n,x)=>{ if(x===null){ draw(); return; } touched=true; const [pp,q,r,s]=PR[pi], D=pp/q, V=r/s, U=LW/Math.max(1,Math.ceil(D-1e-9));
        const nFit=Math.floor((pp*s)/(q*r)+1e-9), exact=(pp*s)%(q*r)===0, stops=[]; for(let m=0;m<=nFit;m++) stops.push(m*V); if(!exact) stops.push(D);
        const val=(x-X0)/U; let best=0; stops.forEach((sv,k)=>{ if(Math.abs(sv-val)<Math.abs(stops[best]-val)) best=k; }); j=best; draw(); });
      onBtn(st.svg,()=>{ pi=(pi+1)%PR.length; j=0; draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const X0=80;
      const strip=(y,wholes,U,n,fill)=>{ let o=''; for(let k=0;k<wholes;k++) o+=bar(X0+k*U,y,U,46,n,n,fill); return o; };
      const groups=(y,count,w,lab)=>{ let o=''; for(let m=0;m<count;m++) o+=`<rect x="${X0+m*w+2}" y="${y}" width="${w-4}" height="38" rx="3" fill="${m%2?'#e9c3ae':ORAS}" stroke="${INK}" stroke-width="1.5"/><text class="cnt" x="${X0+(m+.5)*w}" y="${y+19}" style="fill:${INK};font-size:13px">${m+1}</text>`; return o+(lab?txt(X0,y+66,lab,'sums','font-size:15px;fill:'+INK):''); };
      K.steps(panel,[
        {t:`<p>6 ÷ 2 asks: <b>how many 2s fit into 6?</b> The answer is 3.</p><p>Dividing by a fraction asks the same question.</p>`},
        {t:`<p>3 ÷ ${K.fr(1,4)} asks: how many <b>quarters</b> fit into 3? Each whole holds 4 quarters, so 3 × 4 = <b>12</b>.</p><p class="mnote">Dividing by a fraction less than 1 gives a <b>bigger</b> answer.</p>`},
        {t:`<p>2 ÷ ${K.fr(2,3)}: 2 wholes make 6 thirds. Group them in twos: <b>3</b> groups.</p>${K.formula(`2 ÷ ${K.fr(2,3)} = 2 × 3 ÷ 2 = 2 × ${K.fr(3,2)} = 3`)}`},
        {t:`<p>So dividing by a fraction is the same as multiplying by it <b>flipped</b>. Keep the first, change ÷ to ×, flip the second.</p>${K.formula(`${K.fr(3,4)} ÷ ${K.fr(1,2)} = ${K.fr(3,4)} × ${K.fr('2','1')} = ${K.fr(6,4)} = 1${K.fr(1,2)}`)}`}
      ],i=>{ stop();
        if(i===0){ const U=100; let o=''; for(let k=0;k<6;k++) o+=`<rect x="${X0+k*U}" y="90" width="${U}" height="46" fill="${GRNS}" stroke="${INK}" stroke-width="1.5"/>`; st.draw(o+txt(X0,74,'6 equal units')+groups(170,3,2*U,'three 2s fit into 6')+expr(W/2,330,['6 ÷ 2 = 3'],{anchor:'middle',size:28})); }
        if(i===1) stop=K.tween(0,12,2400,t=>{ const U=200; st.draw(strip(90,3,U,4,GRNS)+txt(X0,74,'3 wholes, each cut into quarters')+groups(170,Math.floor(t),U/4,Math.floor(t)>=12?'12 quarters fit into 3':'')+(t>=12?expr(W/2,330,['3 ÷',[1,4],'= 3 × 4 = 12'],{anchor:'middle',size:28}):'')); });
        if(i===2) stop=K.tween(0,3,1800,t=>{ const U=300; st.draw(strip(90,2,U,3,GRNS)+txt(X0,74,'2 wholes = 6 thirds')+groups(170,Math.floor(t),U*2/3,Math.floor(t)>=3?'three lots of 2 thirds':'')+(t>=3?expr(W/2,330,['2 ÷',[2,3],'= 3'],{anchor:'middle',size:28}):'')); });
        if(i===3){ const U=400; st.draw(`<rect x="${X0}" y="90" width="${U}" height="46" fill="${PAPER}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 4"/>`+bar(X0,90,U*.75,46,3,3,GRNS)+txt(X0,74,'three quarters')+groups(170,1,U/2,'')+`<rect x="${X0+U/2+2}" y="170" width="${U/4-4}" height="38" rx="3" fill="#efe0ae" stroke="${INK}" stroke-width="1.5"/>`+txt(X0,236,'1 half fits, plus half of another half','sums','font-size:15px;fill:'+INK)+expr(W/2,330,[{v:[3,4],c:GRN},'÷',{v:[1,2],c:ORA},'=',{v:[3,4],c:GRN},'×',{v:['2','1'],c:ORA},'=',[1,1,2]],{anchor:'middle',size:26})); }
      }); }
  };
})();
