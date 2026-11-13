/* ===== Decimals: interactive "Explore" and "See why" widgets (helpers from fd-widgets.js) ===== */
window.AV=window.AV||{};
(function(){
  const {W,H,INK,PAPER,BLUE,BLUES,ORA,ORAS,GRN,GRNS,RED,TEAL,clamp,gcd,hdl,tag,btn,onBtn,top,full,svgPt,txt,expr,simp}=window.FDH;

  /* long division of n by d: whole part, decimal digits, index where the repeat starts (-1 = it stops) */
  function decParts(n,d){ const int=Math.floor(n/d); let rem=n%d; const digits=[], seen={}; let rep=-1;
    while(rem!==0&&digits.length<14){ if(seen[rem]!==undefined){ rep=seen[rem]; break; } seen[rem]=digits.length; rem*=10; digits.push(Math.floor(rem/d)); rem%=d; }
    return {int,digits,rep}; }
  /* decimal in SVG, monospace so the recurring dots can sit over the right digits */
  function decSvg(x,y,n,d,sz=34,col=INK){ const P=decParts(n,d), cw=sz*.6; const s=P.int+(P.digits.length?'.'+P.digits.join(''):'');
    let o=`<text x="${x}" y="${y}" style="font:600 ${sz}px 'IBM Plex Mono',monospace;fill:${col}">${s}</text>`;
    if(P.rep>=0){ const off=String(P.int).length+1, a=P.rep, b=P.digits.length-1; [a,b].filter((v,i,arr)=>arr.indexOf(v)===i).forEach(k=>{ o+=`<circle cx="${x+(off+k+.5)*cw}" cy="${y-sz*.86}" r="${sz*.07}" fill="${col}"/>`; }); }
    return o; }
  window.FDH.decParts=decParts;

  /* ================= D1 fractions to decimals ================= */
  const DEN=[2,4,5,8,10,20,25,3,6,9];
  const NUM=d=>({2:1,4:3,5:2,8:3,10:7,20:9,25:6,3:1,6:5,9:4})[d];
  AV.f2d={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const GX=50, GY=74, C=26, LX=380, LW=340, NY=330;
      let d=8, n=3, touched=false;
      const draw=()=>{ let o=txt(GX,30,'denominator','klab'); DEN.forEach((k,j)=>o+=btn('d'+k,GX+122+j*42,10,36,k,k===d));
        /* hundred grid, filled one column (one tenth) at a time */
        const sq=n/d*100, full_=Math.floor(sq+1e-9), part=sq-full_;
        o+=`<rect x="${GX}" y="${GY}" width="${10*C}" height="${10*C}" fill="${PAPER}"/>`;
        for(let k=0;k<full_;k++){ const cx=Math.floor(k/10), cy=k%10; o+=`<rect x="${GX+cx*C}" y="${GY+cy*C}" width="${C}" height="${C}" fill="${BLUES}"/>`; }
        if(part>1e-6&&full_<100){ const cx=Math.floor(full_/10), cy=full_%10; o+=`<rect x="${GX+cx*C}" y="${GY+cy*C}" width="${C*part}" height="${C}" fill="${BLUES}"/>`; }
        let g=''; for(let k=1;k<10;k++) g+=`M${GX+k*C} ${GY}v${10*C}M${GX} ${GY+k*C}h${10*C}`; o+=`<path d="${g}" stroke="#b9ad94" stroke-width="1"/>`;
        for(let k=1;k<10;k++) o+=`<line x1="${GX+k*C}" y1="${GY}" x2="${GX+k*C}" y2="${GY+10*C}" stroke="#7a7366" stroke-width="1.2"/>`;
        o+=`<rect x="${GX}" y="${GY}" width="${10*C}" height="${10*C}" fill="none" stroke="${INK}" stroke-width="1.3"/>`;
        o+=txt(GX,GY+10*C+24,'100 squares = 1 whole · 1 column = 0.1','sums');
        /* the numbers */
        o+=expr(LX,104,[{v:[n,d],c:BLUE},'=',`${n} ÷ ${d}`,'='],{size:30});
        o+=decSvg(LX,182,n,d,40,GRN);
        const hs=simp(n*100,d,true); o+=expr(LX,222,['shaded:',{v:hs,c:BLUE},'squares out of 100'],{size:16,col:'#7a7366'});
        const P=decParts(n,d); o+=txt(LX,266,n===0||n===d?'':P.rep<0?'The division stops, so the decimal ends.':'The digits repeat for ever: a recurring decimal.',P.rep<0?'sums':'goodt',P.rep<0?'font-size:15px':'');
        /* number line 0 to 1 */
        o+=`<line x1="${LX}" y1="${NY}" x2="${LX+LW}" y2="${NY}" stroke="${INK}" stroke-width="1.3"/>`;
        for(let k=0;k<=10;k++){ const x=LX+k*LW/10; o+=`<line x1="${x}" y1="${NY}" x2="${x}" y2="${NY+(k%5?8:12)}" stroke="${INK}" stroke-width="${k%5?1.2:2}"/>`; if(k%5===0||k===1) o+=txt(x,NY+30,k===0?'0':k===10?'1':(k/10).toFixed(1),'tick'); }
        for(let k=0;k<=d;k++){ const x=LX+k*LW/d; o+=`<line x1="${x}" y1="${NY-9}" x2="${x}" y2="${NY}" stroke="${ORA}" stroke-width="1.6"/>`; }
        o+=txt(LX,NY-20,`orange marks: ${d} equal steps from 0 to 1`,'sums','font-size:12px;fill:'+ORA);
        o+=hdl('n',LX+n/d*LW,NY,BLUE,!touched); if(!touched) o+=tag(LX+n/d*LW+16,NY+52,'drag along the line');
        st.draw(o); };
      st.onDrag((nm,x)=>{ if(x===null){ draw(); return; } touched=true; n=clamp(Math.round((x-LX)/LW*d),0,d); draw(); });
      onBtn(st.svg,id=>{ d=+id.slice(1); n=NUM(d); draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{};
      const grid=(x,y,c,k,col=BLUES)=>{ let o=`<rect x="${x}" y="${y}" width="${10*c}" height="${10*c}" fill="${PAPER}"/>`; for(let i=0;i<k;i++) o+=`<rect x="${x+Math.floor(i/10)*c}" y="${y+(i%10)*c}" width="${c}" height="${c}" fill="${col}"/>`;
        let g=''; for(let i=1;i<10;i++) g+=`M${x+i*c} ${y}v${10*c}M${x} ${y+i*c}h${10*c}`; return o+`<path d="${g}" stroke="#b9ad94"/><rect x="${x}" y="${y}" width="${10*c}" height="${10*c}" fill="none" stroke="${INK}" stroke-width="1.3"/>`; };
      /* bus-stop division 3 ÷ 8 */
      const bus=t=>{ const x0=300, cwid=36, y0=210; let o=`<g style="font:600 34px 'IBM Plex Mono',monospace">`;
        '3.000'.split('').forEach((c,i)=>o+=`<text x="${x0+i*cwid}" y="${y0}" style="fill:${INK}">${c}</text>`);
        o+=`<text x="${x0-50}" y="${y0}" style="fill:${ORA}">8</text><path d="M${x0-12} ${y0+8}q10 -24 0 -46h${5*cwid+10}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
        const q='0.375'.split(''), carry=['','','6','4','']; const show=Math.floor(t);
        q.forEach((c,i)=>{ if(i<=show) o+=`<text x="${x0+i*cwid}" y="${y0-50}" style="fill:${GRN}">${c}</text>`; });
        o+=`</g>`; [[2,'3',1],[3,'6',2],[4,'4',3]].forEach(([k,c,after])=>{ if(show>=after) o+=`<text x="${x0+k*cwid-13}" y="${y0-22}" style="font:600 16px Inter,sans-serif;fill:${RED}">${c}</text>`; });
        return o; };
      K.steps(panel,[
        {t:`<p>A fraction is a <b>division</b>: ${K.fr(3,4)} means 3 ÷ 4.</p><p>Decimals count in <b>tenths</b> and <b>hundredths</b>, so ${K.fr(3,4)} = ${K.fr(75,100)} = 0.75.</p>`},
        {t:`<p>When the bottom is not 10 or 100, divide. ${K.fr(3,8)} = 3 ÷ 8:</p><p>8 into 3 won't go, so write 0 and carry 3. 8 into 30 is 3, carry 6. 8 into 60 is 7, carry 4. 8 into 40 is 5.</p>`},
        {t:`<p>Some divisions <b>never stop</b>. ${K.fr(1,3)} = 0.333… for ever. We write it with a dot: <b>0.<span class="rec">3</span></b>.</p><p>${K.fr(1,6)} = 0.1<span class="rec">6</span> (only the 6 repeats) and ${K.fr(2,11)} = 0.<span class="rec">1</span><span class="rec">8</span>.</p>`},
        {t:`<p>Decimal to fraction: read the last place value, then simplify.</p>${K.formula(`0.45 = ${K.fr(45,100)} = ${K.fr(9,20)}`)}<p class="mnote">0.45 has hundredths, so the bottom is 100.</p>`},
        {t:`<p>To <b>compare</b> decimals, line up the points and compare place by place. 0.6 is bigger than 0.58, because 6 tenths beats 5 tenths.</p><p class="mnote">More digits does not mean bigger.</p>`}
      ],i=>{ stop();
        if(i===0) st.draw(grid(90,60,28,75)+expr(420,150,[{v:[3,4],c:BLUE},'=',[75,100]],{size:30})+`<text x="420" y="260" class="fdm" style="fill:${GRN}">= 0.75</text>`+txt(90,370,'75 of the 100 squares'));
        if(i===1) stop=K.tween(0,4.99,3000,t=>st.draw(expr(120,160,[{v:[3,8],c:BLUE},'='],{size:30})+bus(t)+(t>4.9?txt(300,290,'3 ÷ 8 = 0.375','goodt','font-size:20px'):'')));
        if(i===2) st.draw(decSvg(120,110,1,3,40,GRN)+expr(70,96,[[1,3]],{anchor:'middle',size:26})+txt(330,104,'= 0.3333… for ever','sums','font-size:16px')
          +decSvg(120,210,1,6,40,GRN)+expr(70,196,[[1,6]],{anchor:'middle',size:26})+txt(330,204,'= 0.1666…','sums','font-size:16px')
          +decSvg(120,310,2,11,40,GRN)+expr(70,296,[[2,11]],{anchor:'middle',size:26})+txt(330,304,'= 0.181818…','sums','font-size:16px')+txt(120,370,'the dots go over the first and last digit that repeat'));
        if(i===3) st.draw(grid(90,60,28,45,GRNS)+`<text x="420" y="150" class="fdm">0.45</text>`+expr(420,230,['=',[45,100],'=',{v:[9,20],c:GRN}],{size:30})+txt(420,320,'÷ 5 top and bottom','sums'));
        if(i===4){ const x0=280, cwid=44; let o=''; ['T','O','.','t','h'].forEach((c,k)=>o+=txt(x0+k*cwid+12,70,c,'fdh'));
          const row=(y,s,hi)=>{ let r=''; s.split('').forEach((c,k)=>r+=`<text x="${x0+k*cwid}" y="${y}" class="fdm" style="fill:${k===hi?GRN:INK}">${c}</text>`); return r; };
          o+=row(140,' 0.6',3)+row(210,' 0.58',3)+`<rect x="${x0+3*cwid-6}" y="96" width="${cwid}" height="130" fill="none" stroke="${GRN}" stroke-width="2" rx="4"/>`+txt(x0+5*cwid+24,180,'6 tenths > 5 tenths','goodt')+txt(x0,300,'0.6 > 0.58','sumt');
          st.draw(o); }
      }); }
  };

  /* ================= D2 multiplying and dividing by 10, 100, 1000 ================= */
  const NUMS=[['347',-2],['52',-1],['275',-1],['8',-1],['63',0],['405',-2],['12',-2],['9',0]];
  const PL=['10 000s','1000s','100s','10s','1s','tenths','hundredths','thousandths','10 000ths'];
  const AB=['TTh','Th','H','T','O','t','h','th','tth'];
  const numStr=(ds,e)=>{ const L=ds.length, hi=Math.max(e+L-1,0), lo=Math.min(e,0); let s=''; for(let pl=hi;pl>=lo;pl--){ const i=L-1-(pl-e); s+=(i>=0&&i<L)?ds[i]:'0'; if(pl===0&&lo<0) s+='.'; } return s; };
  AV.p10={
    explore(p,K){ const st=K.stage(full(p,K),W,H); const CW=74, X0=(W-9*CW)/2, Y0=150, Y1=244, PX=X0+5*CW;
      let ni=0, k=0, sh=0, stop=()=>{}, touched=false, grabX=0, startSh=0;
      const draw=()=>{ const [ds,e]=NUMS[ni], L=ds.length; let o='';
        [['m1','× 10'],['m2','× 100'],['m3','× 1000'],['d1','÷ 10'],['d2','÷ 100'],['d3','÷ 1000']].forEach(([id,t],j)=>o+=btn(id,X0+j*82,8,76,t,false));
        o+=btn('reset',X0+6*82+8,8,70,'Reset',false)+btn('new',X0+7*82+4,8,70,'New',false);
        for(let c=0;c<9;c++){ o+=`<rect x="${X0+c*CW}" y="70" width="${CW}" height="${Y1-70+40}" fill="${c===4?'#f3efe5':PAPER}" stroke="#d6ccb6"/>`; o+=txt(X0+c*CW+CW/2,92,AB[c],'fdh','font-size:15px;fill:'+INK)+txt(X0+c*CW+CW/2,110,PL[c],'fdh','font-size:9.5px'); }
        o+=`<line x1="${PX}" y1="70" x2="${PX}" y2="${Y1+40}" stroke="${RED}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        [Y0,Y1].forEach(y=>o+=`<circle cx="${PX}" cy="${y+12}" r="5" fill="${RED}"/>`);
        o+=txt(X0-8,Y0+5,'start','sums','text-anchor:end')+txt(X0-8,Y1+5,'now','sums','text-anchor:end;font-weight:600;fill:'+INK);
        const colOf=pl=>4-pl, xc=pl=>X0+colOf(pl)*CW+CW/2;
        /* start row: digits and any zero needed in the ones column */
        const row=(y,shift,col,ghost)=>{ let r=''; const lo=e+shift, hiP=e+shift+L-1;
          for(let i=0;i<L;i++){ const pl=e+shift+(L-1-i); r+=`<text class="pvd" x="${xc(pl)}" y="${y}" style="fill:${col}">${ds[i]}</text>`; }
          if(Number.isInteger(shift)){ for(let pl=lo-1;pl>=0;pl--) r+=`<text class="pvd" x="${xc(pl)}" y="${y}" style="fill:#b9ad94">0</text>`;
            if(hiP<0) for(let pl=0;pl>hiP;pl--) r+=`<text class="pvd" x="${xc(pl)}" y="${y}" style="fill:#b9ad94">0</text>`; }
          return r; };
        o+=row(Y0,0,'#7a7366');
        o+=`<g class="drag-b" data-h="row"><rect x="${X0}" y="${Y1-26}" width="${9*CW}" height="52" fill="transparent"/>${row(Y1,sh,BLUE)}</g>`;
        if(!touched) o+=tag(W/2,Y1+68,'drag the digits ← or → (or press a button)','middle');
        /* arrows from start to now, for each digit */
        if(Number.isInteger(sh)&&sh!==0) for(let i=0;i<L;i++){ const pl=e+(L-1-i); const a=xc(pl), b=xc(pl+sh); o+=`<path d="M${a} ${Y0+22}C${a} ${Y0+50} ${b} ${Y1-50} ${b} ${Y1-24}" fill="none" stroke="${ORA}" stroke-width="1.8" marker-end="url(#ah)"/>`; }
        o=`<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${ORA}"/></marker></defs>`+o;
        if(Number.isInteger(sh)){ const a=numStr(ds,e), b=numStr(ds,e+sh); const opS=sh>0?'×':'÷', pw=Math.pow(10,Math.abs(sh));
          o+=txt(W/2,350,sh===0?a:`${a} ${opS} ${pw} = ${b}`,'sumt','text-anchor:middle');
          if(sh) o+=txt(W/2,384,`Every digit moved ${Math.abs(sh)} place${Math.abs(sh)>1?'s':''} ${sh>0?'left':'right'}, so it is worth ${sh>0?pw+' times more':pw+' times less'}. The point did not move.`,'sums','text-anchor:middle;font-size:14px');
          if(sh&&(e+sh>0||e+sh+L-1<0)) o+=txt(W/2,406,'The grey zeros hold the empty places.','sums','text-anchor:middle;font-size:14px;fill:#7a7366'); }
        st.draw(o); };
      const lim=()=>{ const [ds,e]=NUMS[ni], L=ds.length; return [-4-e, 4-(e+L-1)]; };
      const go=to=>{ stop(); const [a,b]=lim(); to=clamp(to,a,b); const from=sh; if(to===from){ draw(); return; } stop=K.tween(from,to,500+180*Math.abs(to-from),x=>{ sh=x; if(Math.abs(x-to)<1e-3) sh=to; draw(); },()=>{ sh=to; k=to; draw(); }); };
      st.svg.addEventListener('pointerdown',e=>{ if(!e.target.closest('[data-h="row"]')) return; stop(); grabX=svgPt(st.svg,e).x; startSh=Math.round(sh); sh=startSh; });
      st.onDrag((n,x)=>{ if(x===null){ const [a,b]=lim(); sh=clamp(Math.round(sh),a,b); k=sh; draw(); return; } touched=true; const [a,b]=lim(); sh=clamp(startSh-(x-grabX)/CW,a,b); draw(); });
      onBtn(st.svg,id=>{ touched=true; if(id==='reset') return go(0); if(id==='new'){ stop(); ni=(ni+1)%NUMS.length; sh=0; k=0; draw(); return; }
        const m=+id[1]; go(id[0]==='m'?m:-m); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{}; const CW=80, X0=(W-7*CW)/2, PX=X0+4*CW;
      const AB7=['Th','H','T','O','t','h','th'];
      const chart=(ds,e,shift,y0=170,y1=270,note='')=>{ let o=''; for(let c=0;c<7;c++){ o+=`<rect x="${X0+c*CW}" y="80" width="${CW}" height="230" fill="${c===3?'#f3efe5':PAPER}" stroke="#d6ccb6"/>`+txt(X0+c*CW+CW/2,106,AB7[c],'fdh','font-size:15px;fill:'+INK); }
        o+=`<line x1="${PX}" y1="80" x2="${PX}" y2="310" stroke="${RED}" stroke-width="1.5" stroke-dasharray="4 4"/>`; [y0,y1].forEach(y=>o+=`<circle cx="${PX}" cy="${y+12}" r="5" fill="${RED}"/>`);
        const L=ds.length, xc=pl=>X0+(3-pl)*CW+CW/2;
        const row=(y,s,col,int)=>{ let r=''; for(let i=0;i<L;i++) r+=`<text class="pvd" x="${xc(e+s+(L-1-i))}" y="${y}" style="fill:${col}">${ds[i]}</text>`;
          if(int){ for(let pl=e+s-1;pl>=0;pl--) r+=`<text class="pvd" x="${xc(pl)}" y="${y}" style="fill:${ORA}">0</text>`; if(e+s+L-1<0) for(let pl=0;pl>e+s+L-1;pl--) r+=`<text class="pvd" x="${xc(pl)}" y="${y}" style="fill:${ORA}">0</text>`; } return r; };
        o+=row(y0,0,'#7a7366',false)+row(y1,shift,BLUE,Math.abs(shift-Math.round(shift))<1e-6);
        return o+txt(W/2,370,note,'sumt','text-anchor:middle'); };
      const anim=(ds,e,to,note)=>{ stop=K.tween(0,to,900+250*Math.abs(to),s=>st.draw(chart(ds,e,s,170,270,Math.abs(s-to)<1e-3?note:''))); };
      K.steps(panel,[
        {t:`<p><b>× 10</b>: every digit moves <b>one place to the left</b>, so each digit is worth 10 times more. The decimal point stays where it is.</p>`},
        {t:`<p><b>× 100</b> moves the digits <b>two</b> places left (100 = 10 × 10). <b>× 1000</b> moves them three.</p>`},
        {t:`<p><b>÷ 10</b> moves every digit one place to the <b>right</b>. Sometimes a zero is needed in the ones column to hold its place: 3.47 ÷ 10 = 0.347.</p>`},
        {t:`<p>Sometimes there are empty places between the digits and the point. Fill them with <b>zeros</b>: 5.2 × 1000 = 5200.</p>`},
        {t:`<p><b>Common mistake:</b> "to × 10, add a zero". 3.4 × 10 is <b>not</b> 3.40, because 3.40 is the same as 3.4. The digits move, not the point.</p>`}
      ],i=>{ stop();
        if(i===0) anim('347',-2,1,'3.47 × 10 = 34.7');
        if(i===1) anim('347',-2,2,'3.47 × 100 = 347');
        if(i===2) anim('347',-2,-1,'3.47 ÷ 10 = 0.347');
        if(i===3) anim('52',-1,3,'5.2 × 1000 = 5200');
        if(i===4) st.draw(chart('34',-1,1,170,270,'3.4 × 10 = 34   (not 3.40)')+txt(W/2,404,'3.40 means 3 ones, 4 tenths, 0 hundredths: still 3.4','sums','text-anchor:middle'));
      }); }
  };

  /* ================= D3 rounding decimals ================= */
  const RN=[34782,26350,9614,51249,7975,18306];   // in ten-thousandths: 3.4782, 2.635, ...
  function roundLine(K,v,m,o={}){ /* v in ten-thousandths, m = decimal places to round to */
    const step=Math.pow(10,4-m), lo=Math.floor(v/step)*step, hi=lo+step, half=lo+step/2, X0=110, X1=650, NY=o.y||250;
    const X=t=>X0+(t-lo)/step*(X1-X0), up=v-lo>=step/2, f=t=>(t/1e4).toFixed(m); let s='';
    s+=`<rect x="${X0}" y="${NY-16}" width="${(X1-X0)/2}" height="32" fill="${BLUES}" opacity="${up?.35:.9}"/><rect x="${(X0+X1)/2}" y="${NY-16}" width="${(X1-X0)/2}" height="32" fill="${ORAS}" opacity="${up?.9:.35}"/>`;
    s+=`<line x1="${X0}" y1="${NY}" x2="${X1}" y2="${NY}" stroke="${INK}" stroke-width="1.3"/>`;
    for(let k=0;k<=10;k++){ const x=X0+k*(X1-X0)/10, big=k===0||k===10, mid=k===5; s+=`<line x1="${x}" y1="${NY-(big?22:mid?18:8)}" x2="${x}" y2="${NY+(big?22:mid?18:8)}" stroke="${mid?RED:INK}" stroke-width="${big?2.5:mid?2:1.2}"/>`; }
    s+=txt(X0,NY+52,f(lo),'sumt','text-anchor:middle;fill:'+BLUE)+txt(X1,NY+52,f(hi),'sumt','text-anchor:middle;fill:'+ORA)+txt((X0+X1)/2,NY+46,'halfway '+(half/1e4).toFixed(m+1),'sums','text-anchor:middle;fill:'+RED);
    const px=X(v), tx=up?X1:X0; s+=`<path d="M${px} ${NY-30}Q${(px+tx)/2} ${NY-80} ${tx} ${NY-30}" fill="none" stroke="${up?ORA:BLUE}" stroke-width="1.6" marker-end="url(#ar)"/>`;
    s=`<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${up?ORA:BLUE}"/></marker></defs>`+s;
    return {svg:s,px,NY,up,r:up?hi:lo,f}; }
  /* the number with the deciding digit boxed */
  function numDigits(v,m,D,x,y){ const s=(v/1e4).toFixed(D), dot=s.indexOf('.'), cut=m===0?dot:dot+m, cw=30; let o='';
    s.split('').forEach((c,i)=>{ const isDec=i===cut+(m===0?1:1); const col=i<=cut-(m===0?1:0)?INK:isDec?ORA:'#b9ad94';
      if(isDec) o+=`<rect x="${x+i*cw-4}" y="${y-36}" width="${cw+2}" height="46" fill="none" stroke="${ORA}" stroke-width="2" rx="3"/>`;
      o+=`<text x="${x+i*cw}" y="${y}" style="font:600 42px 'IBM Plex Mono',monospace;fill:${col}">${c}</text>`; });
    return {svg:o, dec:+s[cut+1]}; }
  AV.rounding={
    explore(p,K){ const st=K.stage(full(p,K),W,H); let ri=0, v=RN[0], m=1, touched=false;
      const D=()=>Math.min(3,m+2), unit=()=>Math.pow(10,4-D());
      const draw=()=>{ let o=''; [[0,'whole number'],[1,'1 d.p.'],[2,'2 d.p.']].forEach(([k,t],j)=>o+=btn('m'+k,110+j*130,8,124,t,m===k)); o+=btn('new',W-130,8,110,'New number',false);
        const L=roundLine(K,v,m,{y:258}), nd=numDigits(v,m,D(),110,104);
        o+=L.svg+nd.svg;
        o+=`<circle cx="${L.px}" cy="${L.NY}" r="7" fill="${RED}"/>`+hdl('v',L.px,L.NY,RED,!touched);
        if(!touched) o+=tag(L.px,L.NY+90,'drag the point','middle');
        const where=m===0?'first decimal place':m===1?'second decimal place':'third decimal place';
        o+=txt(110,150,`Look at the digit in the ${where}: <tspan style="font-weight:700;fill:${ORA}">${nd.dec}</tspan> is ${nd.dec>=5?'5 or more, so round up':'less than 5, so round down'}.`,'sums','font-size:15px');
        o+=txt(W/2,392,`${(v/1e4).toFixed(D())} ≈ ${L.f(L.r)}  (${m===0?'nearest whole number':m+' d.p.'})`,'sumt','text-anchor:middle');
        st.draw(o); };
      st.onDrag((n,x)=>{ if(x===null){ draw(); return; } touched=true; const step=Math.pow(10,4-m), lo=Math.floor(v/step)*step, u=unit();
        v=clamp(lo+Math.round((x-110)/540*step/u)*u,lo,lo+step-u); draw(); });
      onBtn(st.svg,id=>{ if(id==='new'){ ri=(ri+1)%RN.length; v=RN[ri]; } else { m=+id[1]; v=Math.round(v/unit())*unit(); } draw(); });
      draw(); },

    see(p,K){ const {stage,panel}=top(p,K); const st=K.stage(stage,W,H); let stop=()=>{};
      const show=(v,m,note)=>{ let dp=4; while(dp>m+1&&v%Math.pow(10,5-dp)===0) dp--; const L=roundLine(K,v,m,{y:250}), nd=numDigits(v,m,dp,110,100); return nd.svg+L.svg+`<circle cx="${L.px}" cy="${L.NY}" r="8" fill="${RED}" stroke="${PAPER}" stroke-width="3"/>`+txt(W/2,380,note||`≈ ${L.f(L.r)}`,'sumt','text-anchor:middle'); };
      K.steps(panel,[
        {t:`<p>Round 3.4782 to <b>1 decimal place</b>. With one decimal place it is either <b>3.4</b> or <b>3.5</b>. Which is nearer?</p>`},
        {t:`<p>Look at the <b>next digit</b> (here 7). 5 or more: round <b>up</b>. Less than 5: round <b>down</b>.</p><p>3.4782 is past halfway (3.45), so it rounds to <b>3.5</b>.</p>`},
        {t:`<p>Exactly halfway? The rule is to round <b>up</b>: 2.635 to 2 d.p. is <b>2.64</b>.</p>`},
        {t:`<p>Watch the carry: 7.975 to 1 d.p. The 9 tenths go up to 10 tenths, which makes a whole one: <b>8.0</b>.</p><p class="mnote">Keep the zero. "8.0" shows the answer is correct to 1 d.p.</p>`},
        {t:`<p><b>Round only at the end.</b> 2.46 + 2.46 = 4.92 ≈ <b>4.9</b>. Rounding first gives 2.5 + 2.5 = 5.0, which is wrong.</p><p class="mnote">Keep every digit (and π) in your working, then round the final answer once.</p>`}
      ],i=>{ stop();
        if(i===0) st.draw(show(34782,1,'3.4 or 3.5 ?'));
        if(i===1) st.draw(show(34782,1,'3.4782 ≈ 3.5 (1 d.p.)'));
        if(i===2) st.draw(show(26350,2,'2.635 ≈ 2.64 (2 d.p.)'));
        if(i===3) st.draw(show(79750,1,'7.975 ≈ 8.0 (1 d.p.)'));
        if(i===4) st.draw(`<text x="80" y="90" class="sumh">Round at the end</text><text x="80" y="140" class="fdm" style="font-size:28px">2.46 + 2.46 = 4.92</text><text x="80" y="190" class="fdm" style="font-size:28px;fill:${GRN}">≈ 4.9</text>`
          +`<text x="430" y="90" class="sumh" style="fill:${RED}">Round first</text><text x="430" y="140" class="fdm" style="font-size:28px">2.5 + 2.5 = 5.0</text><text x="430" y="190" class="fdm" style="font-size:28px;fill:${RED}">wrong</text>`
          +`<line x1="400" y1="60" x2="400" y2="220" stroke="#d6ccb6" stroke-width="2"/>`+txt(W/2,300,'Each early rounding adds a small error, and the errors add up.','sums','text-anchor:middle;font-size:16px'));
      }); }
  };
})();
