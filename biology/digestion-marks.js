/* ===== Auto-marking rules for the written "Apply it" questions =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'absor' matches absorb, absorbed, absorption.
   {all, also, reject}: `also` checks the relation (pairing in one statement, direction, units);
   `reject` removes the point if a wrong or reversed claim appears anywhere in the answer. */
(function(){
const FIBRE=['fibre','fiber','wholemeal','whole meal','wholegrain','whole grain','brown bread','vegetable','veg','fruit','lentil','bean','bran','oat','cereal','salad','broccoli','carrot','apple'];
const FIB_RE='(?:fibre|fiber|fruits?|veg\\w*|wholemeal|wholegrain|whole grain|whole meal|brown bread|salad|lentils?|beans?|bran|oats?|cereals?)';
const HEAT=['heat','water bath','warm'];
const any=(parts,fn)=>parts.some(fn);
const has=(part,hit,words)=>words.some(w=>hit(part,w));
const norm=t=>' '+String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ';
const sentences=a=>String(a).split(/(?<!\d)\.|\.(?!\d)|[!?;\n]+/).map(norm).filter(s=>s.trim());
const clauses=a=>String(a).split(/(?<!\d)\.|\.(?!\d)|[!?;,:()\n]+/).map(norm).filter(s=>s.trim());
// regex match that is not negated (not/no/never within 3 words before it)
const hitRe=(p,hit,re)=>[...p.matchAll(new RegExp(re.source,'g'))].some(m=>hit(p,m[0].trim()));
// one statement passes every test: word list, RegExp or function
const one=(parts,hit,...tests)=>any(parts,p=>tests.every(t=>Array.isArray(t)?has(p,hit,t):t instanceof RegExp?t.test(p):t(p)));
const pair=(...tests)=>(a,parts,hit)=>one(parts,hit,...tests);
const STARCH=/\bstarch\b/, SUGAR=/\b(?:sugars?|maltose|glucose)\b/;
const conversion=(parts,source,product,enzyme,hit)=>any(parts,p=>{
  if(!source.test(p)||!product.test(p)||!enzyme.test(p)) return false;
  const s=p.search(source), t=p.search(product);
  if(/\b(?:not|never|doesn t|don t|cannot|can t)\b.{0,35}\b(?:break\w*|hydrolys\w*|digest\w*|convert\w*|turn\w*|produc\w*|mak\w*)\b/.test(p)) return false;
  const forward=s<t&&!/\bfrom\b/.test(p.slice(s,t))&&/\b(?:break\w*|hydrolys\w*|digest\w*|convert\w*|turn\w*|produc\w*|mak\w*|into|to|yield\w*)\b/.test(p);
  const passive=t<s&&/\b(?:from|by)\b/.test(p.slice(t,s));
  return (forward||passive)&&hit(p,p.match(product)[0]);
});
const hasWrongDirection=(parts,source,product)=>any(parts,p=>{if(!source.test(p)||!product.test(p)) return false;const s=p.search(source), t=p.search(product);if(s<t)return /\bfrom\b/.test(p.slice(s,t))&&/\b(?:mak\w*|produc\w*|convert\w*|turn\w*|form\w*)\b/.test(p);const between=p.slice(t,s);return !/\b(?:from|by)\b/.test(between)&&/\b(?:into|to|produce\w*|make\w*|convert\w*|turn\w*|break\w*|hydrolys\w*|digest\w*)\b/.test(between);});

/* Food tests: a colour must be tied to the right nutrient. */
const NUT={starch:/\bstarch\b/,sugar:/\b(?:sugars?|glucose|maltose)\b/,protein:/\bproteins?\b/,lipid:/\b(?:lipids?|fats?|oils?)\b/};
const COLOUR={starch:/\bblack\b/,sugar:/\bred\b/,protein:/\b(?:purple|violet|lilac|mauve)\b/};      // strict, for wrong pairings
const SEEN={starch:/\bblack\b/,sugar:/\bred\b|\borange\b(?! yellow| brown)/,protein:COLOUR.protein}; // loose, for credit
const denies=n=>new RegExp('\\b(?:no|not|without)\\s+(?:\\w+\\s+){0,2}'+NUT[n].source.replace(/\\b/g,'')+'|'+NUT[n].source+'\\s+(?:\\w+\\s+){0,1}(?:absent|not present|negative)|\\bnegative\\b');
const wrongTest=n=>(a,parts,hit)=>clauses(a).some(c=>{
  const col=hitRe(c,hit,COLOUR[n]), nut=hitRe(c,hit,NUT[n]), denied=denies(n).test(c);
  const otherNut=Object.keys(NUT).some(k=>k!==n&&hitRe(c,hit,NUT[k]));
  const otherCol=Object.keys(COLOUR).some(k=>k!==n&&hitRe(c,hit,COLOUR[k]));
  return (col&&otherNut&&!nut)||(col&&NUT[n].test(c)&&denied)||(nut&&!denied&&otherCol&&!col)||(n==='protein'&&nut&&!denied&&/\b(?:stays|remains|still|stay) blue\b/.test(c));
});
const rightTest=(n,noColourOk)=>(a,parts,hit)=>any(parts,p=>{
  if(denies(n).test(p)) return false;
  const otherNut=Object.keys(NUT).some(k=>k!==n&&hitRe(p,hit,NUT[k]));
  const said=hitRe(p,hit,NUT[n])||(!otherNut&&/\b(?:positive|present|contain\w*|mean\w*|indicat\w*|show\w*)\b/.test(p));
  return said&&(hitRe(p,hit,SEEN[n])||(noColourOk&&hitRe(p,hit,NUT[n])&&/\b(?:contain\w*|present|positive|has|have)\b/.test(p)));
});

/* l3 Q3: tie each problem to underweight or overweight. A statement with no weight word continues the last one. */
const WEIGHT=/\b(?:(underweight|under weight|starv\w*|too thin|skinny)|(overweight|over weight|obes\w*))\b/g;
const weightSegs=a=>{let topic=null;const out=[];for(const s of sentences(a)){const ms=[...s.matchAll(WEIGHT)];if(!ms.length){out.push({t:s,topic});continue;}
  ms.forEach((m,i)=>{const tp=m[1]?'under':'over';out.push({t:(i?'':s.slice(0,m.index))+s.slice(m.index,i+1<ms.length?ms[i+1].index:s.length),topic:tp});topic=tp;});}return out;};
const VERB=/\b(?:is|are|be|being|been|get\w*|have|has|had|feel\w*|caus\w*|lead\w*|risk\w*|because|so|mean\w*|lack\w*|becom\w*|eat\w*|lose|loses|losing|gain\w*|stor\w*|use|uses|used|can|may|might|will|suffer\w*|likely|higher|increas\w*|take|takes|than)\b/;
const segHas=(a,hit,topic,words,extra)=>weightSegs(a).some(s=>(s.topic===topic||(topic==='under'&&/\bboth\b/.test(s.t)))&&has(s.t,hit,words)&&VERB.test(s.t)&&(!extra||extra.test(s.t)));
const LESS=['less','not enough','too little','fewer','lower'], MORE=['more','too much','extra','excess'];
const ENERGYW=/\b(?:energy|food|eat\w*|calories?|fat)\b/, ADVICE=/\b(?:should|need to|needs to|must|could|try|advice)\b/;
const wrongBalance=(a,parts,hit)=>weightSegs(a).some(s=>!ADVICE.test(s.t)&&ENERGYW.test(s.t)&&((s.topic==='over'&&has(s.t,hit,LESS))||(s.topic==='under'&&has(s.t,hit,MORE))));

/* l4 Q3: organs listed backwards (three or more in reverse order) */
const ORGANS=/\b(?:(mouth|teeth|tooth|chew\w*)|(gullet|oesophagus|esophagus|food pipe)|(stomach)|(small intestine)|(large intestine)|(rectum|anus))\b/g;
const backwards=a=>sentences(a).some(s=>{let run=0,prev=null;for(const m of s.matchAll(ORGANS)){const k=m.slice(1).findIndex(Boolean);if(prev!==null&&k<prev){if(++run>=2)return true;}else if(k!==prev)run=0;prev=k;}return false;});

/* l5: enzymes break big into small, never join small into big */
const BREAK=/\b(?:break\w*|broke\w*|chop\w*|split\w*|cut\w*|digest\w*|turn\w*|convert\w*|hydrolys\w*)\b/;
const bigToSmall=(a,parts,hit)=>any(parts,p=>{const l=p.search(/\b(?:large|big|bigger|larger)\b/), s=p.search(/\b(?:small|smaller|tiny)\b/);return BREAK.test(p)&&hit(p,p.match(BREAK)[0])&&l>=0&&s>l;});
const joinsSmall=(a,parts)=>parts.some(p=>{const l=p.search(/\b(?:large|big|bigger|larger)\b/), s=p.search(/\b(?:small|smaller|tiny)\b/);return l>=0&&s>=0&&(/\b(?:join\w*|build\w*|bond\w*|combin\w*|put\w* together)\b/.test(p)||(s<l&&/\b(?:into|to make|to form)\b/.test(p.slice(s,l))));});
const enzymesAreBacteria=/\benzymes? (?:are|is) (?:\w+ ){0,1}(?:bacteria|bacterium|living|alive|microorganisms?|microbes?)\b/;
const bacteriaWrongPlace=(a,parts,hit)=>parts.some(p=>hitRe(p,hit,/\bbacteri\w*/)&&/\b(?:stomach|small intestine|mouth)\b/.test(p)&&!/\blarge intestine\b/.test(p)&&!/\b(?:kill\w*|destroy\w*|acid)\b/.test(p));

window.MARKS = {
  l1:[
    [ {all:[FIBRE],also:pair(FIBRE,/\b(?:more|eat\w*|increas\w*|add\w*|includ\w*|swap\w*|switch\w*|chang\w*|instead|rich|should|need\w*|try)\b/),
        reject:[new RegExp('\\b(?:eat|eating|have)\\s+more\\s+(?:\\w+\\s+){0,1}(?:sugar|sweets|crisps?|burgers?|white bread|chips|junk)|\\bmore\\s+(?:sugar|sweets|crisps|burgers|white bread|chips|junk)\\b|\\b(?:eat|have|eating)\\s+(?:less|fewer|no)\\s+(?:\\w+\\s+){0,1}'+FIB_RE+'|\\bavoid\\w*\\s+(?:\\w+\\s+){0,1}'+FIB_RE)]},
      {all:[FIBRE,['bulk','volume','bigger','soft']],also:pair(FIBRE,['bulk','volume','bigger','soft'],/\b(?:add\w*|giv\w*|provid\w*|mak\w*|increas\w*|bulk\w* up|bulky|bulkier|more|so|because|has|have|is|are)\b/),
        reject:[new RegExp(FIB_RE+'\\s+(?:\\w+\\s+){0,2}(?:remov\\w*|reduc\\w*|takes? away|lower\\w*|decreas\\w*)\\s+(?:\\w+\\s+){0,1}bulk')]},
      {all:[['mov','push','pass','along','squeez','through','out','easier','easily']],
        reject:[/\b(?:stop\w*|slow\w* down|block\w*)\s+(?:the\s+)?(?:food|waste|faeces|poo|it)\s+(?:from\s+)?(?:mov\w*|pass\w*|going)\b|\b(?:food|waste|it)\s+(?:stops|slows)\b/]} ],
    [ [['sugar','simple']],
      {all:[['sugar','sweet','simple'],['quick','fast','burst','short','rapid','quickly','instant']],also:pair(['sugar','sweet','simple'],['quick','fast','burst','short','rapid','quickly','instant'],/\b(?:energy|releas\w*)\b/)},
      {all:[['starch','complex'],['slow','gradual','long','last','steady','longer','broken down','break']],also:pair(['starch','complex'],['slow','gradual','long','last','steady','longer','broken down','break'],/\b(?:energy|releas\w*|broken|break\w*|digest\w*)\b/)} ].map((r,i)=>i?Object.assign(r,{reject:[(a,parts,hit)=>parts.some(p=>(has(p,hit,['sugar','simple'])&&has(p,hit,['slow','gradual','steady'])&&!has(p,hit,['starch','complex']))||(has(p,hit,['starch','complex'])&&has(p,hit,['quick','fast','rapid','instant','burst'])&&!has(p,hit,['sugar','simple'])))]}):r),
    [ {all:[['store','reserve'],['energy']],reject:[/\b(?:remov\w*|takes? away|use up|uses up)\s+(?:\w+\s+){0,1}energy\b/]},
      {all:[['insulat','warm','heat']],reject:[/\bmak\w*\s+(?:\w+\s+){0,1}cold\b|\bcool\w* (?:you|the body)\b|\bheat loss\b|\blos\w* (?:\w+ )?heat\b/]},
      {all:[['protect'],['organ','kidney','heart']],reject:[(a,parts,hit)=>parts.some(p=>hitRe(p,hit,/\b(?:damag\w*|harm\w*|hurt\w*)\s+(?:\w+\s+){0,1}(?:organs?|kidneys?|hearts?)\b/)&&!/\bprotect\w*\b/.test(p))]} ],
    (()=>{
      const PROT=['protein','meat','fish','egg'], CARB=['carbohydrate','bread','pasta','starch','rice','potato'];
      const swapped=(a,parts,hit)=>clauses(String(a).replace(/\band\b/gi,',')).some(c=>(has(c,hit,PROT)&&has(c,hit,['energy'])&&!has(c,hit,CARB))||(has(c,hit,CARB)&&has(c,hit,['growth','grow','repair'])&&!has(c,hit,PROT)));
      const LINK=/\b(?:for|giv\w*|provid\w*|help\w*|need\w*|used?|is|are|so|because|to|keep\w*|mak\w*|build\w*|gives?)\b/;
      return [ [['right','correct'],['nutrient','amount']],
        {all:[['carbohydrate','bread','pasta','starch'],['energy']],also:pair(['carbohydrate','bread','pasta','starch','rice','potato'],['energy'],LINK),reject:[swapped]},
        {all:[['protein','meat','fish','egg'],['growth','grow','repair']],also:pair(PROT,['growth','grow','repair'],LINK),reject:[swapped]},
        [['vitamin','mineral'],['fruit','veg']], [['fibre','fiber','wholemeal']], [['water','lipid','fat','oil']] ];
    })()
  ],
  l2:[
    [ [['pestle','mortar','crush','grind'],['water']],
      {all:[['blue black','black']],also:(a,parts,hit)=>/\biodine\b/.test(norm(a))&&rightTest('starch')(a,parts,hit),reject:[wrongTest('starch')]},
      [['benedict'],HEAT],
      {all:[['orange','red','brick']],also:rightTest('sugar'),reject:[wrongTest('sugar')]},
      [['copper','biuret'],['hydroxide','biuret']],
      {all:[['purple','violet','lilac','mauve']],also:rightTest('protein'),reject:[wrongTest('protein')]} ],
    [ [['goggle','eye','glasses','safety spec']],
      {all:[['flame','fire','flammable','bunsen','scald','spill','gloves','hair','tie','tied','hot water','burn','not eat','do not eat','don t eat','never eat','no eating','no food','not be eaten','not taste','don t taste','never taste']],
        reject:[(a,parts,hit)=>parts.some(p=>hit(p,'eat')||hit(p,'taste'))]} ],
    [ {all:[['pestle','mortar','crush','grind']],reject:[/\b(?:not|don t|never|no)\s+(?:\w+\s+){0,3}(?:pestle|mortar|crush\w*|grind\w*)\b/]}, [['water']], [['mix','stir','shake']] ],
    [ [['copper']], [['sodium hydroxide','hydroxide']],
      {all:[['purple','violet','lilac','mauve']],also:rightTest('protein'),reject:[wrongTest('protein')]} ]
  ],
  l3:[
    [ [['13000','13 000'],['10000','10 000','minus','take away','subtract','−','-']],
      // the answer needs the unit kJ: 3000 J, 3000 kg or no unit loses this mark
      {all:[['3000','3 000','three thousand','3000kj','3 000kj']],also:a=>/(?:\b3 ?000|\bthree thousand)\s*(?:kj|kilo ?joules?)\b/.test(norm(a)),
        reject:[/(?:\b3 ?000|\bthree thousand) ?(?:j|joules?|kg|kilograms?|g|grams?|litres?|liters?|l|calories?|kcal)\b/]} ],
    [ [['5000','5 000']], [['11000','11 000','divid','over','original']], [['100','percent','times']], {check:(answer)=>{const values=[...String(answer).matchAll(/\b(\d+(?:\.\d+)?)\s*(?:%|percent\b)/gi)].map(m=>Number(m[1]));return values.length>0&&values.every(v=>v>=45&&v<=46);}} ],
    [ [['ricket']], {check:(answer,parts,hit)=>{const denial=/\b(?:not(?! (?:\w+ )?enough)|no|never)\b.{0,25}\b(?:caus\w*|lead\w*|result\w*)\b|\b(?:caus\w*|lead\w*|result\w*)\b.{0,25}\b(?:not|no|never)\b(?! enough)\s+(?:rickets|the condition)/;return !parts.some(p=>denial.test(p)&&/vitamin d|vit d/.test(p))&&any(parts,p=>/\b(?:vitamin d|vit d)\b/.test(p)&&/\b(?:lack|deficien\w*|not (?:\w+ )?enough|without|low|insufficient|too little)\b/.test(p));}},
      {all:[['bone']],also:pair(['bone'],p=>/\b(?:weak\w*|soft\w*|bend\w*|bent|bow\w*|brittle|break\w*)\b/.test(p)||/\b(?:strong|healthy)\b/.test(p)&&/\b(?:keep\w*|maintain\w*|need\w*|help\w*|calcium|for)\b/.test(p)),
        reject:[(a,parts,hit)=>parts.some(p=>hit(p,'strong')&&/\b(?:rickets|deficien\w*|lack\w*|without|not enough)\b/.test(p)&&!/\b(?:keep\w*|maintain\w*|need\w*|help\w*|healthy|calcium)\b/.test(p))]} ],
    [ {all:[['malnourish','malnutrition','both','neither','no neither','disagree','not true','wrong']],
        reject:[(a,parts)=>parts.some(p=>/\b(?:i agree|i do agree|healthier to be underweight|better to be underweight|underweight is (?:healthier|better)|malnourish\w* is (?:good|healthy))\b/.test(p)&&!/\b(?:not|don t|isn t|disagree)\b/.test(p))]},
      {all:[LESS,['energy','food','eat','calorie']],also:(a,parts,hit)=>segHas(a,hit,'under',LESS,/\b(?:energy|food|eat\w*|calories?)\b/),reject:[wrongBalance]},
      {all:[['tired','immune','ill','sick','infection','lack energy','weak','exhaust']],also:(a,parts,hit)=>segHas(a,hit,'under',['tired','immune','ill','sick','infection','lack energy','weak','exhaust']),
        reject:[(a,parts,hit)=>weightSegs(a).some(s=>s.topic==='over'&&has(s.t,hit,['tired','immune','exhaust','lack energy']))]},
      {all:[['vitamin','mineral','deficien']],also:(a,parts,hit)=>segHas(a,hit,'under',['vitamin','mineral','deficien'])},
      {all:[MORE,['fat','energy','food','eat','calorie']],also:(a,parts,hit)=>segHas(a,hit,'over',MORE,ENERGYW),reject:[wrongBalance]},
      {all:[['heart','stroke','diabetes','cancer']],also:(a,parts,hit)=>segHas(a,hit,'over',['heart','stroke','diabetes','cancer']),
        reject:[(a,parts,hit)=>weightSegs(a).some(s=>s.topic==='under'&&has(s.t,hit,['heart','stroke','diabetes','cancer']))]} ]
  ],
  l4:[
    [ {all:[['fibre','fiber'],['bulk','bulky']],also:pair(['fibre','fiber'],['bulk','bulky'],/\b(?:add\w*|giv\w*|provid\w*|mak\w*|increas\w*|bulk\w* up|bulky|bulkier|more|so|because|has|have|is|are)\b/),
        reject:[new RegExp(FIB_RE+'\\s+(?:\\w+\\s+){0,2}(?:remov\\w*|reduc\\w*|takes? away|lower\\w*|decreas\\w*)\\s+(?:\\w+\\s+){0,1}bulk')]},
      {all:[['muscle','squeez'],['push','forc','along','mov']],also:pair(['muscle','squeez'],/\b(?:food|along|gut|it|waste|bulk|faeces|through|intestine)\b/),
        reject:[/\bmuscles?\s+(?:\w+\s+){0,2}stop\w*\b|\bstop\w*\s+(?:the\s+)?food\s+(?:from\s+)?mov\w*/]},
      {check:(a,parts,hit)=>any(parts,p=>/\bconstipat\w*/.test(p)&&/\b(?:prevent\w*|stop\w*|avoid\w*|reduc\w*|help\w*|less likely|lower\w*|cure\w*|treat\w*|won t get|don t get|not get|lack\w*|not enough|too little|without|low)\b/.test(p)),
        reject:[(a,parts)=>parts.some(p=>/\b(?:fibre|fiber)\b/.test(p)&&/\b(?:caus\w*|giv\w*|lead\w* to|mak\w*)\s+(?:\w+\s+){0,2}constipat/.test(p)&&!/\b(?:lack\w*|not enough|too little|little|without|low|no|less)\s+(?:\w+\s+){0,1}(?:fibre|fiber)\b/.test(p))]} ],
    [ {check:(answer,parts,hit)=>!parts.some(p=>/\b(?:not|never|no)\b.{0,12}\bthin\b|\b(?:not|never|no)\b.{0,12}\b(?:one|1|single) cell thick\b/.test(p)||/(?<!not )\bthick\s+(?:\w+\s+){0,1}(?:walls?|lining)\b|\b(?:walls?|lining)\s+(?:\w+\s+){0,5}(?<!not )thick\b(?! cell)/.test(p)&&!/\b(?:one|1|single) cell thick\b/.test(p))
        &&any(parts,p=>(hit(p,'thin')&&/\bthin\s+(?:\w+\s+){0,2}(?:walls?|lining|layer|membrane|epithelium)\b|\b(?:walls?|lining|layer|membrane|epithelium)\b(?:\s+\w+){0,5}\s+thin\b/.test(p))||/\b(?:one|1|single) cell thick\b/.test(p))},
      {check:(answer,parts,hit)=>!parts.some(p=>/\b(?:reduc\w*|decreas\w*|less|smaller|lower)\b.{0,20}\bsurface area\b|\bsurface area\b.{0,20}\b(?:reduc\w*|decreas\w*|less|smaller|lower)\b|\b(?:not|never|no)\b.{0,15}\b(?:increas\w*|large|big|greater|more)\b.{0,20}\bsurface area\b/.test(p))&&any(parts,p=>has(p,hit,['villi','villus'])&&/\b(?:large|big|greater|increas\w*|more)\b.{0,20}\bsurface area\b|\bsurface area\b.{0,20}\b(?:large|big|greater|increas\w*|more)\b/.test(p))},
      {check:(answer,parts,hit)=>{const denial=/\b(?:not|never|don t|doesn t|cannot|can t)\b.{0,30}\b(?:carr\w*|tak\w*|transport\w*|remov\w*|mov\w*)\b|\b(?:blood|capillar)\b.{0,30}\b(?:not|never)\b.{0,20}\b(?:away|absor\w*|nutrient)\b/;
        const wrongJob=p=>/\b(?:capillar\w*|blood)\b/.test(p)&&/\b(?:oxygen|faeces|feces|poo|waste|stor\w*|bring\w*\s+(?:\w+\s+){0,2}to)\b/.test(p);
        return !parts.some(p=>denial.test(p)||wrongJob(p))&&any(parts,p=>has(p,hit,['capillar','blood vessel','blood suppl'])||(/\bblood\b/.test(p)&&/\b(?:absor\w*|carr\w*|tak\w*|transport\w*)\b/.test(p)&&/\b(?:away|nutrients?|food|molecules?|absorbed|digested)\b/.test(p)));}} ],
    (()=>{const wrongMover=/\b(?:gravity|heart|villi|villus|teeth|tongue)\b|\bmuscles? in (?:the |your )?(?:arms?|legs?|hands?)\b/, MOVE=/\b(?:push\w*|mov\w*|squeez\w*|pump\w*|forc\w*)\b/;
      const reject=[(a,parts)=>parts.some(p=>wrongMover.test(p)&&MOVE.test(p))];
      return [ {all:[['muscle'],['squeez','push','contract','move','forc']],also:pair(['muscle'],/\b(?:gut|wall|intestine|food|it|along|stomach|gullet)\b/),reject},
        {all:[['bulk','fibre','fiber','toothpaste','behind','against']],also:pair(['bulk','fibre','fiber','toothpaste','behind','against'],MOVE),reject} ];})(),
    [ {all:[['chew','teeth','tooth','saliva']],also:pair(['chew','teeth','tooth','saliva'],/\b(?:mouth|chew\w*|break\w*|crush\w*|grind\w*|mix\w*|pieces|bite\w*|bits)\b/),reject:[backwards]},
      {all:[['gullet','oesophagus','esophagus','food pipe']],also:pair(['gullet','oesophagus','esophagus','food pipe'],/\b(?:down|travel\w*|go|goes|going|mov\w*|pass\w*|swallow\w*|squeez\w*|to|into|carr\w*|push\w*)\b/),reject:[backwards]},
      {all:[['stomach'],['acid','juice','enzyme','churn','protease']],reject:[backwards]},
      {all:[['small intestine'],['blood','absor']],also:pair(['small intestine'],/\bblood\b|\babsor\w*/,/\b(?:absor\w*|pass\w*|into|through|diffus\w*)\b/),reject:[backwards]},
      {all:[['large intestine'],['water']],also:pair(['large intestine'],['water'],/\b(?:absor\w*|taken|tak\w*|remov\w*|back)\b/),reject:[backwards]},
      {all:[['rectum','anus']],also:pair(['rectum','anus'],/\b(?:stor\w*|leav\w*|out|releas\w*|exit\w*|egest\w*|pass\w*|faeces|feces|poo|through)\b/),reject:[backwards]} ]
  ],
  l5:[
    [ {all:[['bacteria','probiotic','microb','microorganism','bacterium','good bacteria']],also:(a,parts)=>/\b(?:useful|good|healthy|help\w*|probiotic|friendly|gut|live)\b/.test(norm(a)),
        reject:[(a,parts,hit)=>parts.some(p=>/\b(?:bacteri\w*|germs?|microb\w*)\b/.test(p)&&hitRe(p,hit,/\b(?:harmful|bad|dangerous|germs?)\b/))]},
      {all:[['vitamin']],also:pair(['vitamin'],/\b(?:mak\w*|produc\w*|creat\w*|synthes\w*|provid\w*|giv\w*|releas\w*)\b/,p=>!/\bvitamins? (?:are|is) in\b/.test(p))},
      {all:[['break','digest','healthy','health','gut']],also:pair(/\b(?:help\w*|break\w*|digest\w*|keep\w*|good for|healthy|improv\w*)\b/,/\b(?:bacteri\w*|they|it|yoghurt|probiotic|these|food)\b/),
        reject:[(a,parts,hit)=>parts.some(p=>/\b(?:bacteri\w*|germs?|microb\w*)\b/.test(p)&&hitRe(p,hit,/\b(?:harmful|bad|dangerous|germs?)\b/))]} ],
    [ [['starch','carbohydrate']], [['carbohydrase','amylase','enzyme'],['saliva','salivary','mouth']], {check:(answer,parts,hit)=>conversion(parts,STARCH,SUGAR,/\b(?:carbohydrase|amylase|saliva|enzyme)\b/,hit)&&!hasWrongDirection(parts,STARCH,SUGAR)} ],
    [ {all:[['large','big'],['small']],also:bigToSmall,reject:[joinsSmall]},
      [['speed','faster','quicker']],
      {all:[['not used up','not get used up','without being used up','without getting used up','aren t used up','isn t used up','not consumed','not changed','unchanged','reused','reusable','used again']],reject:[/\b(?:enzymes?|catalysts?|they) (?:are |is |get |gets |become )?(?:also |still |then |all |actually )?(?:used up|consumed)\b/]} ],
    [ {all:[['enzyme'],['small','break','chop']],also:(a,parts,hit)=>bigToSmall(a,parts,hit)||one(parts,hit,['enzyme'],BREAK,/\b(?:small|smaller|tiny)\b/),reject:[joinsSmall,enzymesAreBacteria]},
      [['carbohydrase','protease','lipase','different nutrient','different type']],
      {all:[['bacteria'],['large intestine','fibre','fiber']],also:pair(['bacteria'],['large intestine','fibre','fiber'],/\b(?:live\w*|found|in|feed\w*|on|eat\w*)\b/),reject:[bacteriaWrongPlace]},
      {all:[['vitamin']],also:pair(['vitamin'],/\b(?:mak\w*|produc\w*|creat\w*|synthes\w*|provid\w*|releas\w*|giv\w*)\b/)} ]
  ],
  final:[
    (()=>{const CARB=/\b(?:starch|carbohydrates?|bread)\b/, PROT=/\b(?:proteins?|protease|cheese)\b/;
      return [ {all:[['carbohydrase','amylase'],['sugar','glucose']],also:(a,parts,hit)=>conversion(parts,/\b(?:starch|carbohydrates?)\b/,SUGAR,/\b(?:carbohydrase|amylase)\b/,hit),reject:[(a,parts)=>hasWrongDirection(parts,/\b(?:starch|carbohydrates?)\b/,SUGAR)]},
        {all:[['mouth','saliva']],also:pair(['mouth','saliva'],p=>CARB.test(p)||/\b(?:carbohydrase|amylase)\b/.test(p)),reject:[(a,parts,hit)=>parts.some(p=>hitRe(p,hit,/\b(?:mouth|saliva)\b/)&&hitRe(p,hit,PROT)&&!CARB.test(p)&&!/\b(?:carbohydrase|amylase)\b/.test(p))]},
        {all:[['protease'],['amino']],also:(a,parts,hit)=>conversion(parts,/\bproteins?\b/,/\bamino acids?\b/,/\bprotease\b/,hit),reject:[(a,parts)=>hasWrongDirection(parts,/\bproteins?\b/,/\bamino acids?\b/)]},
        {all:[['stomach']],also:pair(['stomach'],PROT)} ];})(),
    [ [['small intestine']], [['bile']], {check:(answer,parts,hit)=>conversion(parts,/\b(?:lipids?|fats?|oils?)\b/,/\b(?:fatty acids?|glycerol)\b/,/\blipase\b/,hit)&&!hasWrongDirection(parts,/\b(?:lipids?|fats?|oils?)\b/,/\b(?:fatty acids?|glycerol)\b/)&&has(parts.join(' '),hit,['fatty acid'])&&has(parts.join(' '),hit,['glycerol'])} ],
    [ [['mix','churn'],['juice','acid']],
      {all:[['protease','protein','microorganism','microbe','bacteria','germ','kill']],
        also:(a,parts,hit)=>one(parts,hit,['protease','protein'],/\b(?:digest\w*|break\w*|broke\w*|turn\w*|amino|by|chop\w*)\b/)||one(parts,hit,['kill','destroy'],['microorganism','microbe','bacteria','germ','pathogen']),
        reject:[/\b(?:help\w*|mak\w*|let\w*)\s+(?:\w+\s+){0,2}(?:bacteria|germs?|microorganisms?|microbes?)\s+(?:to\s+)?(?:grow|multiply|live|survive)\b/,
          (a,parts,hit)=>parts.some(p=>hitRe(p,hit,/\bprotease\b/)&&/\b(?:lipids?|fats?|glycerol|fatty acids?|starch|sugars?)\b/.test(p)&&!/\bproteins?\b/.test(p))]} ],
    [ {check:rightTest('starch',true),reject:[wrongTest('starch')]},
      {check:rightTest('sugar',true),reject:[wrongTest('sugar')]},
      {check:rightTest('protein',true),reject:[wrongTest('protein')]},
      {check:(answer,parts,hit)=>conversion(parts,STARCH,SUGAR,/\b(?:carbohydrase|amylase)\b/,hit)&&!hasWrongDirection(parts,STARCH,SUGAR)},
      {check:(answer,parts,hit)=>conversion(parts,/\bproteins?\b/,/\bamino acids?\b/,/\bprotease\b/,hit)&&!hasWrongDirection(parts,/\bproteins?\b/,/\bamino acids?\b/)} ]
  ]
};
})();
