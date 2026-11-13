/* ===== Fractions & decimals practice: question generators (added to window.AVQ) =====
   Fraction answers: kind:'frac', ans:[N,D] (exact), simplest / form checked by MathsEngine.
   Decimal answers: units:[] (no unit buttons), exact unless dp is set. */
window.AVQ=window.AVQ||{};
(function(){
  const K=()=>MathsEngine.K;
  const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const F=(n,d)=>K().fr(n,d);
  const red=(n,d)=>{ const g=gcd(n,d); return [n/g,d/g]; };
  const M=(n,d)=>{ const [a,b]=red(n,d); return K().mixed(a,b); };            // simplest form, mixed if > 1
  const I=(n,d)=>{ const [a,b]=red(n,d); return F(a,b); };                    // simplest form, improper
  const frq=(o,n,d,mixed=true)=>{ const q=Object.assign({kind:'frac',ans:red(n,d),simplest:true,show:mixed?M(n,d):I(n,d),fig:''},o); if(q.unitShow) q.show+=q.unitShow; return q; };
  const num=(o)=>Object.assign({units:[],fig:''},o,{show:o.show!==undefined?o.show:String(parseFloat(o.ans.toFixed(6)))});
  const coprime=(R,dens)=>{ for(;;){ const d=R.pick(dens), n=R.int(1,d-1); if(gcd(n,d)===1) return [n,d]; } };
  const trunc=(x,k)=>(Math.floor(x*Math.pow(10,k)+1e-9)/Math.pow(10,k)).toFixed(k);   // cut off, not rounded, before a '…'
  const dstr=x=>String(parseFloat(x.toFixed(6)));                               // plain decimal string, no grouping commas
  const bars=(n,s)=>{ const w=300/n; let o=''; for(let i=0;i<n;i++) o+=`<rect x="${10+i*w}" y="40" width="${w}" height="50" fill="${i<s?'#dbe3f4':'#fffdf8'}" stroke="#1d1b16" stroke-width="1.5"/>`; return `<svg class="qfig" viewBox="0 0 320 130">${o}</svg>`; };
  const simpLine=(n,d)=>{ const g=gcd(n,d); if(g===1&&n<=d) return ''; let s=''; if(g>1) s+=`${F(n,d)} = ${F(n/g,d/g)} (÷ ${g})`; const a=n/g, b=d/g; if(a>b&&b>1) s+=`${g>1?' ':F(n,d)+' '}= ${K().mixed(a,b)}`; else if(b===1&&g===1) s+=` = ${a}`; return s; };

  /* ---------- F1 equivalent fractions ---------- */
  const equiv=[
    R=>{ const [a,b]=coprime(R,[2,3,4,5,6,8]), k=R.int(2,9); return num({text:`Find the missing number: ${F(a,b)} = ${F('?',b*k)}`, ans:a*k, hint:'Multiply the top and the bottom by the same number.',
      work:[`${b} × ${k} = ${b*k}, so the bottom was multiplied by ${k}.`,`Do the same to the top: ${a} × ${k} = ${a*k}`]}); },
    R=>{ const [a,b]=coprime(R,[3,4,5,6,7,9]), k=R.int(2,8); return num({text:`Find the missing number: ${F(a,b)} = ${F(a*k,'?')}`, ans:b*k, hint:'Multiply the top and the bottom by the same number.',
      work:[`${a} × ${k} = ${a*k}, so the top was multiplied by ${k}.`,`Do the same to the bottom: ${b} × ${k} = ${b*k}`]}); },
    R=>{ const [a,b]=coprime(R,[3,4,5,6,7,8,9,10]), k=R.int(2,9); return frq({text:`Write ${F(a*k,b*k)} in its simplest form.`, hint:'Divide the top and the bottom by their highest common factor.',
      work:[`The highest common factor of ${a*k} and ${b*k} is ${k}.`,`${F(a*k+' ÷ '+k,b*k+' ÷ '+k)} = ${F(a,b)}`]},a,b,false); },
    R=>{ const n=R.pick([6,8,9,10,12]); let s; do{ s=R.int(2,n-1); }while(gcd(s,n)===1); const [a,b]=red(s,n);
      return frq({text:'What fraction of the bar is shaded? Give your answer in its simplest form.', fig:bars(n,s), hint:'Count the shaded pieces and all the pieces, then simplify.',
        work:[`${s} of the ${n} pieces are shaded: ${F(s,n)}`,`${F(s,n)} = ${F(a,b)} (÷ ${gcd(s,n)})`]},s,n,false); },
    R=>{ let A,B; do{ A=coprime(R,[3,4,5,6,8,10]); B=coprime(R,[3,4,5,6,8,10]); }while(A[1]===B[1]||A[0]*B[1]===B[0]*A[1]);
      const L=lcm(A[1],B[1]), a=A[0]*L/A[1], b=B[0]*L/B[1], big=a>b?A:B;
      return frq({text:`Which is bigger, ${F(...A)} or ${F(...B)}? Type the bigger fraction.`, hint:'Change both to the same denominator, then compare the tops.',
        work:[`Use ${L} as the common denominator: ${F(...A)} = ${F(a,L)} and ${F(...B)} = ${F(b,L)}`,`${Math.max(a,b)} > ${Math.min(a,b)}, so ${F(...big)} is bigger.`]},big[0],big[1],false); }
  ];

  /* ---------- F2 mixed numbers ---------- */
  const mixfr=[
    R=>{ let n,d; do{ d=R.pick([2,3,4,5,6,8]); n=R.int(d+1,5*d); }while(n%d===0||gcd(n,d)>1); const w=Math.floor(n/d), r=n%d;
      return frq({text:`Write ${F(n,d)} as a mixed number.`, form:'mixed', hint:'Divide the top by the bottom. The remainder goes over the bottom.',
        work:[`${n} ÷ ${d} = ${w} remainder ${r}`,`So ${F(n,d)} = ${w}${F(r,d)}`]},n,d,true); },
    R=>{ let w,r,d; do{ d=R.pick([2,3,4,5,6,8,10]); w=R.int(1,6); r=R.int(1,d-1); }while(gcd(r,d)>1); const n=w*d+r;
      return frq({text:`Write ${w}${F(r,d)} as an improper fraction.`, form:'improper', hint:'Multiply the whole number by the bottom, then add the top.',
        work:[`${w} wholes = ${w} × ${d} = ${w*d} pieces of size ${F(1,d)}`,`${w*d} + ${r} = ${n}, so ${w}${F(r,d)} = ${F(n,d)}`]},n,d,false); },
    R=>{ const d=R.pick([2,3,4,5,8]), w=R.int(2,7); let r; do{ r=R.int(1,d-1); }while(gcd(r,d)>1); const nm={2:'halves',3:'thirds',4:'quarters',5:'fifths',8:'eighths'}[d];
      return num({text:`How many ${nm} are there in ${w}${F(r,d)}?`, ans:w*d+r, hint:`Each whole has ${d} ${nm}.`,
        work:[`${w} wholes = ${w} × ${d} = ${w*d} ${nm}`,`${w*d} + ${r} = ${w*d+r} ${nm}`]}); },
    R=>{ const d=R.pick([6,8,10,12]); let n; do{ n=R.int(d+1,3*d); }while(n%d===0||gcd(n,d)>1); const w=Math.floor(n/d), r=n%d;
      return frq({text:`Each slice is ${F(1,d)} of a pizza. There are ${n} slices left. How many pizzas is that? Give a mixed number.`, form:'mixed', hint:`${d} slices make one whole pizza.`,
        work:[`${n} slices = ${F(n,d)} of a pizza`,`${n} ÷ ${d} = ${w} remainder ${r}, so ${w}${F(r,d)} pizzas`]},n,d,true); }
  ];

  /* ---------- F3 adding and subtracting ---------- */
  const pairD=(R,sub)=>{ for(;;){ const A=coprime(R,[2,3,4,5,6,8,10,12]), B=coprime(R,[2,3,4,5,6,8,10,12]); if(A[1]===B[1]||lcm(A[1],B[1])>40) continue; if(sub&&A[0]*B[1]<=B[0]*A[1]) continue; return [A,B]; } };
  const addWork=(A,B,sub)=>{ const L=lcm(A[1],B[1]), a=A[0]*L/A[1], b=B[0]*L/B[1], r=sub?a-b:a+b, s=simpLine(r,L);
    return [`Common denominator: ${L} (the lowest number that ${A[1]} and ${B[1]} both go into)`,`${F(...A)} ${sub?'−':'+'} ${F(...B)} = ${F(a,L)} ${sub?'−':'+'} ${F(b,L)} = ${F(r,L)}`].concat(s?[s]:[]); };
  const addfr=[
    R=>{ const d=R.pick([5,7,8,9,10,12]); let a,b; do{ a=R.int(1,d-1); b=R.int(1,d-1); }while(a+b===d); const s=simpLine(a+b,d);
      return frq({text:`Work out ${F(a,d)} + ${F(b,d)}. Give your answer in its simplest form.`, hint:'The pieces are the same size: add the tops, keep the bottom.',
        work:[`Same denominator, so add the tops: ${a} + ${b} = ${a+b}`,`${F(a+b,d)}`].concat(s?[s]:[])},a+b,d,true); },
    R=>{ const [A,B]=pairD(R,false); const L=lcm(A[1],B[1]); const r=A[0]*L/A[1]+B[0]*L/B[1];
      return frq({text:`Work out ${F(...A)} + ${F(...B)}. Give your answer in its simplest form.`, hint:'Change both fractions to the same denominator first.', work:addWork(A,B,false)},r,L,true); },
    R=>{ const [A,B]=pairD(R,true); const L=lcm(A[1],B[1]); const r=A[0]*L/A[1]-B[0]*L/B[1];
      return frq({text:`Work out ${F(...A)} − ${F(...B)}. Give your answer in its simplest form.`, hint:'Change both fractions to the same denominator first.', work:addWork(A,B,true)},r,L,true); },
    R=>{ const [A,B]=pairD(R,false), w1=R.int(1,3), w2=R.int(1,3); const L=lcm(A[1],B[1]), a=A[0]*L/A[1], b=B[0]*L/B[1], tot=(w1+w2)*L+a+b;
      const lines=[`Add the whole numbers: ${w1} + ${w2} = ${w1+w2}`,`Add the fractions: ${F(a,L)} + ${F(b,L)} = ${F(a+b,L)}`];
      if(a+b>=L) lines.push(`${F(a+b,L)} is more than 1: it is ${M(a+b,L)}`); lines.push(`${w1+w2} + ${M(a+b,L)} = ${M(tot,L)}`);
      return frq({text:`Work out ${w1}${F(...A)} + ${w2}${F(...B)}. Give your answer as a mixed number in its simplest form.`, form:'mixed', hint:'Add the whole numbers, then add the fractions.', work:lines},tot,L,true); },
    R=>{ const [A,B]=pairD(R,false); const L=lcm(A[1],B[1]), a=A[0]*L/A[1], b=B[0]*L/B[1]; if(a+b>=L) return addfr[1](R);
      return frq({text:`Sam eats ${F(...A)} of a cake and Ali eats ${F(...B)} of it. What fraction of the cake is left?`, hint:'The whole cake is 1. Add what they ate, then take it from 1.',
        work:[`Eaten: ${F(...A)} + ${F(...B)} = ${F(a,L)} + ${F(b,L)} = ${F(a+b,L)}`,`Left: 1 − ${F(a+b,L)} = ${F(L,L)} − ${F(a+b,L)} = ${F(L-a-b,L)}`].concat(gcd(L-a-b,L)>1?[simpLine(L-a-b,L)]:[])},L-a-b,L,true); }
  ];

  /* ---------- F4 multiplying ---------- */
  const mulfr=[
    R=>{ const [a,b]=coprime(R,[3,4,5,6,7,8]); let n; do{ n=R.int(2,9); }while(n%b===0); const s=simpLine(n*a,b);
      return frq({text:`Work out ${n} × ${F(a,b)}. Give your answer in its simplest form.`, hint:'Multiply the top by the whole number. The bottom stays the same.',
        work:[`${n} × ${F(a,b)} = ${F(n+' × '+a,b)} = ${F(n*a,b)}`].concat(s?[s]:[])},n*a,b,true); },
    R=>{ const A=coprime(R,[2,3,4,5,6,8]), B=coprime(R,[2,3,4,5,6,9]); const n=A[0]*B[0], d=A[1]*B[1], s=simpLine(n,d);
      return frq({text:`Work out ${F(...A)} × ${F(...B)}. Give your answer in its simplest form.`, hint:'Multiply the tops, multiply the bottoms.',
        work:[`${F(A[0]+' × '+B[0],A[1]+' × '+B[1])} = ${F(n,d)}`].concat(s?[s]:[])},n,d,true); },
    R=>{ const [a,b]=coprime(R,[3,4,5,8,10]), k=R.int(2,12), N=b*k, item=R.pick([['£',''],['',' kg'],['',' m']]);
      return num({text:`Find ${F(a,b)} of ${item[0]}${N}${item[1]}.`, ans:a*k, show:`${item[0]}${a*k}${item[1]}`, hint:'Divide by the bottom, then multiply by the top.',
        work:[`${N} ÷ ${b} = ${k}`,`${k} × ${a} = ${a*k}, so the answer is ${item[0]}${a*k}${item[1]}`]}); },
    R=>{ const A=coprime(R,[2,3,4,5]), B=coprime(R,[3,4,5,6]); const n=A[0]*B[0], d=A[1]*B[1], s=simpLine(n,d);
      return frq({text:`A rectangle is ${F(...A)} m long and ${F(...B)} m wide. Find its area in m².`, unitShow:' m²', hint:'Area = length × width. Multiply the tops, multiply the bottoms.',
        work:[`Area = ${F(...A)} × ${F(...B)} = ${F(n,d)} m²`].concat(s?[s,`Area = ${M(n,d)} m²`]:[])},n,d,true); }
  ];

  /* ---------- F5 dividing ---------- */
  const divfr=[
    R=>{ const n=R.int(2,6), d=R.pick([2,3,4,5,8]); return frq({text:`Work out ${n} ÷ ${F(1,d)}.`, hint:`How many ${F(1,d)} pieces fit into ${n}?`,
      work:[`Each whole holds ${d} pieces of ${F(1,d)}.`,`${n} × ${d} = ${n*d}`]},n*d,1,true); },
    R=>{ let A,B; do{ A=coprime(R,[2,3,4,5,6,8]); B=coprime(R,[2,3,4,5,6]); }while(A[0]*B[1]===A[1]*B[0]); const n=A[0]*B[1], d=A[1]*B[0], s=simpLine(n,d);
      return frq({text:`Work out ${F(...A)} ÷ ${F(...B)}. Give your answer in its simplest form.`, hint:'Keep the first fraction, change ÷ to ×, flip the second fraction.',
        work:[`${F(...A)} ÷ ${F(...B)} = ${F(...A)} × ${F(B[1],B[0])}`,`= ${F(A[0]+' × '+B[1],A[1]+' × '+B[0])} = ${F(n,d)}`].concat(s?[s]:[])},n,d,true); },
    R=>{ const [a,b]=coprime(R,[2,3,4,5,6,8]), n=R.int(2,5); const s=simpLine(a,b*n);
      return frq({text:`Work out ${F(a,b)} ÷ ${n}. Give your answer in its simplest form.`, hint:`÷ ${n} is the same as × ${F(1,n)}.`,
        work:[`${F(a,b)} ÷ ${n} = ${F(a,b)} × ${F(1,n)} = ${F(a,b*n)}`].concat(s?[s]:[])},a,b*n,true); },
    R=>{ const d=R.pick([2,4,5]), w=R.int(2,5); let r; do{ r=R.int(1,d-1); }while(gcd(r,d)>1); const tot=w*d+r;
      return frq({text:`A jug holds ${w}${F(r,d)} litres. How many ${F(1,d)}-litre glasses can it fill?`, hint:`How many ${F(1,d)}s fit into ${w}${F(r,d)}?`,
        work:[`${w}${F(r,d)} = ${F(tot,d)}`,`${F(tot,d)} ÷ ${F(1,d)} = ${F(tot,d)} × ${d} = ${tot}`]},tot,1,true); }
  ];

  /* ---------- D1 fractions and decimals ---------- */
  const f2d=[
    R=>{ const [n,d]=coprime(R,[2,4,5,8,20,25,50]); const x=n/d, m=100/d;
      return num({text:`Write ${F(n,d)} as a decimal.`, ans:x, show:dstr(x), hint:'Divide the top by the bottom, or make the bottom 10, 100 or 1000.',
        work:Number.isInteger(m)?[`${F(n,d)} = ${F(n+' × '+m,d+' × '+m)} = ${F(n*m,100)}`,`= ${dstr(x)}`]:[`${n} ÷ ${d} = ${dstr(x)}`]}); },
    R=>{ const k=R.pick([1,2]); let t; do{ t=R.int(1,k===1?9:99); }while(t%10===0&&k===2); const D=k===1?10:100, [a,b]=red(t,D);
      return frq({text:`Write ${dstr(t/D)} as a fraction in its simplest form.`, hint:`The last digit is in the ${k===1?'tenths':'hundredths'} column.`,
        work:[`${dstr(t/D)} = ${F(t,D)}`,a===t?`${F(t,D)} is already in its simplest form.`:`${F(t,D)} = ${F(a,b)} (÷ ${gcd(t,D)})`]},a,b,false); },
    R=>{ const [n,d]=R.pick([[1,3],[2,3],[1,6],[5,6],[1,9],[4,9],[7,9],[2,11],[5,12],[1,7]]), dp=R.pick([2,3]);      const x=n/d; return num({text:`Write ${F(n,d)} as a decimal, correct to ${dp} decimal places.`, ans:x, dp, places:dp, show:x.toFixed(dp), hint:'Divide the top by the bottom, then round.',
        work:[`${n} ÷ ${d} = ${trunc(x,dp+3)}… (the digits keep going)`,`Correct to ${dp} d.p.: ${x.toFixed(dp)}`]}); },
    R=>{ let a,b; do{ a=R.int(1,9)/10; b=R.int(11,99)/100; }while(Math.abs(a-b)<1e-9||Math.floor(a*10)===Math.floor(b*10));
      const big=Math.max(a,b); return num({text:`Which is bigger, ${dstr(a)} or ${dstr(b)}? Type the bigger number.`, ans:big, show:dstr(big), hint:'Line up the decimal points and compare the tenths first.',
        work:[`Compare tenths: ${dstr(a)} has ${Math.floor(a*10+1e-9)} tenth${Math.floor(a*10+1e-9)===1?'':'s'}, ${dstr(b)} has ${Math.floor(b*10+1e-9)} tenth${Math.floor(b*10+1e-9)===1?'':'s'}.`,`So ${dstr(big)} is bigger.`]}); },
    R=>{ const [n,d]=coprime(R,[4,5,8,20]); const x=n/d, y=R.pick([.1,.2,.3,.4,.6,.7,.8,.9].filter(v=>Math.abs(v-x)>1e-9)); const big=Math.max(x,y);
      return num({text:`Which is bigger, ${F(n,d)} or ${dstr(y)}? Type the bigger one as a decimal.`, ans:big, show:dstr(big), hint:'Change the fraction to a decimal first.',
        work:[`${F(n,d)} = ${n} ÷ ${d} = ${dstr(x)}`,`${dstr(big)} is bigger than ${dstr(Math.min(x,y))}, so the answer is ${dstr(big)}.`]}); }
  ];

  /* ---------- D2 × and ÷ by 10, 100, 1000 ---------- */
  const shiftStr=(ds,e)=>{ const L=ds.length, hi=Math.max(e+L-1,0), lo=Math.min(e,0); let s=''; for(let pl=hi;pl>=lo;pl--){ const i=L-1-(pl-e); s+=(i>=0&&i<L)?ds[i]:'0'; if(pl===0&&lo<0) s+='.'; } return s; };
  const pick10=(R,down=0)=>{ let ds,e; do{ ds=String(R.int(1,9999)); e=-R.int(0,Math.min(3,ds.length)); }while(ds.endsWith('0')||e-down<-4); return [ds,e]; };   // down = places moved right
  const p10=[
    R=>{ const [ds,e]=pick10(R), k=R.int(1,3), pw=Math.pow(10,k), a=shiftStr(ds,e), b=shiftStr(ds,e+k);
      return num({text:`Work out ${a} × ${pw}.`, ans:parseFloat(b), show:b, hint:`× ${pw}: every digit moves ${k} place${k>1?'s':''} to the left.`,
        work:[`Move every digit ${k} place${k>1?'s':''} to the left (the point stays still).`,`${a} × ${pw} = ${b}`]}); },
    R=>{ const k=R.int(1,3), [ds,e]=pick10(R,k), pw=Math.pow(10,k), a=shiftStr(ds,e), b=shiftStr(ds,e-k);
      return num({text:`Work out ${a} ÷ ${pw}.`, ans:parseFloat(b), show:b, hint:`÷ ${pw}: every digit moves ${k} place${k>1?'s':''} to the right.`,
        work:[`Move every digit ${k} place${k>1?'s':''} to the right. Put a 0 in any empty place before the point.`,`${a} ÷ ${pw} = ${b}`]}); },
    R=>{ const k=R.int(1,3), mul=R.pick([true,false]), [ds,e]=pick10(R,mul?0:k), pw=Math.pow(10,k), a=shiftStr(ds,e), b=shiftStr(ds,mul?e+k:e-k);
      return num({text:`Find the missing number: ${a} ${mul?'×':'÷'} ? = ${b}`, ans:pw, hint:'Count how many places the digits have moved.',
        work:[`The digits moved ${k} place${k>1?'s':''} to the ${mul?'left':'right'}.`,`So the missing number is ${pw}`]}); },
    R=>{ const c=R.pick([['cm','mm',10,'×'],['m','cm',100,'×'],['km','m',1000,'×'],['kg','g',1000,'×'],['mm','cm',10,'÷'],['cm','m',100,'÷'],['g','kg',1000,'÷'],['ml','litres',1000,'÷']]);
      const k=Math.round(Math.log10(c[2])), [ds,e]=pick10(R,c[3]==='×'?0:k), a=shiftStr(ds,e), b=shiftStr(ds,c[3]==='×'?e+k:e-k);
      return num({text:`Change ${a} ${c[0]} into ${c[1]}.`, ans:parseFloat(b), show:`${b} ${c[1]}`, hint:'1 cm = 10 mm, 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g, 1 litre = 1000 ml.',
        work:[c[3]==='×'?`1 ${c[0]} = ${c[2]} ${c[1]}, so multiply by ${c[2]}.`:`1 ${c[1]} = ${c[2]} ${c[0]}, so divide by ${c[2]}.`,`${a} ${c[3]} ${c[2]} = ${b} ${c[1]}`]}); }
  ];

  /* ---------- D3 rounding ---------- */
  const rnd=(v,m)=>{ const st=Math.pow(10,4-m); return Math.floor((v+st/2)/st)*st; };   // v in ten-thousandths
  const rword=m=>m===0?'the nearest whole number':m===1?'1 decimal place':'2 decimal places';
  const roundQ=(R,m,v)=>{ v=v||R.int(10001,99999); if(v%10===0) v+=R.int(1,9); const r=rnd(v,m), x=parseFloat((v/1e4).toFixed(4)), ans=r/1e4, sh=ans.toFixed(m);
    const s=String(x), dot=s.indexOf('.'), dec=+s[dot+m+1]||0, lo=Math.floor(v/Math.pow(10,4-m))*Math.pow(10,4-m);
    return num({text:`Round ${x} to ${rword(m)}.`, ans, places:m, show:sh, hint:'Look at the next digit along: 5 or more rounds up.',
      work:[`${x} is between ${(lo/1e4).toFixed(m)} and ${((lo+Math.pow(10,4-m))/1e4).toFixed(m)}.`,`The next digit is ${dec}, ${dec>=5?'5 or more, so round up':'less than 5, so round down'}: ${sh}`].concat(/0$/.test(sh)&&m>0?['Keep the final 0: it shows the answer is to '+m+' d.p.']:[])}); };
  const rounding=[
    R=>roundQ(R,1), R=>roundQ(R,2), R=>roundQ(R,0),
    R=>{ const w=R.int(1,9), v=w*10000+R.pick([9600,9700,9800,9900])+R.int(1,9)*10+R.int(0,9); return roundQ(R,1,v); },
    R=>{ const ends=d=>{ while(d%2===0) d/=2; while(d%5===0) d/=5; return d===1; }; let a,b; do{ a=R.int(2,40); b=R.pick([3,6,7,9,11,12]); }while(ends(b/gcd(a,b))); const x=a/b;
      return num({text:`Work out ${a} ÷ ${b}. Give your answer correct to 2 decimal places.`, ans:x, dp:2, places:2, show:x.toFixed(2), hint:'Use every digit from the division, then round once at the end.',
        work:[`${a} ÷ ${b} = ${trunc(x,5)}…`,`Correct to 2 d.p.: ${x.toFixed(2)}`]}); }
  ];

  Object.assign(window.AVQ,{equiv,mixfr,addfr,mulfr,divfr,f2d,p10,rounding});
})();
