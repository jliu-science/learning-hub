/* ===== Auto-marking rules for the written "Apply it" questions (Contact forces) =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'lubric' matches lubrication. */
(function(){
const RES=['resultant','unbalanced','not balanced','bigger','greater','more than','only force'];
// Relation checks for l1, l3 and the final apples (direction, operator, units, pairing).
// raw sentences keep × ÷ + = and units, which the normalised parts drop
const raw=a=>a.toLowerCase().replace(/[−–]/g,'-').split(/(?<!\d)\.|\.(?!\d)|[;!?\n]+/);
const clauses=parts=>parts.flatMap(s=>s.split(/\b(?:but|whereas|while|when|once|then|until|and the)\b/));
const flat=a=>' '+a.toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ';
const TIMES='(?:x|×|\\*|·|⋅|times|multiplied by)', NOTTIMES='(?:\\/|÷|\\+|-|plus|minus|divided by|over)';
const has=(re,a)=>raw(a).some(s=>re.test(s));
// box: friction never pushes forward; balanced forces do not stop the box
const boxForward=(_a,parts)=>parts.some(s=>/\bfriction\b/.test(s)&&/\bforwards?\b|\bspeeds? (?:it )?up\b|\bhelps? (?:it|the box) move/.test(s));
const boxBalanced=a=>raw(a).some(s=>/\b(?:stop|slow)/.test(s)&&/\bbalanced\b/.test(s.replace(/\b(?:not|no longer|isn t|aren t|never) (?:\w+ )?balanced\b/g,'')));
// drag: water for the dolphin and surfer, air for the snowboarder (a swapped pairing loses both points)
const dragSwap=(_a,parts)=>parts.flatMap(s=>s.split(/\b(?:and the|but|whereas|while)\b/)).some(c=>{
  const water=/\bwater\b/.test(c), air=/\bair\b/.test(c);
  return (water!==air)&&((air&&/\b(?:dolphin|surfer)/.test(c))||(water&&/\bsnowboard/.test(c))); });
// leaf: at first weight > air resistance; air resistance never bigger than weight
const W='(?:weight|gravity|gravitational force|force of gravity)', AR='(?:air resist\\w*|drag)';
const leafRight=(_a,parts)=>parts.some(s=>new RegExp(`\\b${W}(?: force)? (?:is |was )?(?:\\w+ ){0,2}(?:bigger|greater|larger|more|stronger|higher) than (?:the )?${AR}|\\b${AR}(?: force)? (?:is |was )?(?:\\w+ ){0,2}(?:smaller|less|lower|weaker) than (?:the |its )?${W}`).test(s));
const leafWrong=(_a,parts)=>parts.some(s=>new RegExp(`\\b${AR}(?: force)? (?:is |was )?(?:\\w+ ){0,2}(?:bigger|greater|larger|more|stronger|higher) than (?:the |its )?${W}|\\b${W}(?: force)? (?:is |was )?(?:\\w+ ){0,2}(?:smaller|less|lower|weaker) than (?:the )?${AR}`).test(s));
const dragFalls=(_a,parts)=>parts.some(s=>new RegExp(`\\b${AR}(?: force)? (?:\\w+ ){0,2}(?:decreas|reduc|gets? smaller|goes? down|becomes? smaller)`).test(s));
const dragRises=(_a,parts)=>parts.some(s=>new RegExp(`\\b${AR}(?: force)? (?:\\w+ ){0,3}(?:increas|grow|gets? (?:bigger|larger)|becomes? (?:bigger|larger)|rises?|goes up)|\\b(?:more|increas\\w*|bigger|growing) (?:in )?(?:the )?${AR}`).test(s));
const leafEqual=a=>raw(a).some(s=>/air resist|drag/.test(s)&&/=|equal|the same|balance|cancel/.test(s))||
  /\b(?:resultant|overall|net)(?: force)? (?:is |becomes |of )?(?:zero|0|nothing)\b|\bno resultant\b|\bequilibrium\b/.test(flat(a))||
  /\bbalanced\b/.test(flat(a).replace(/\b(?:not|no longer|isn t|aren t|never) (?:\w+ )?balanced\b/g,''));
// door: 5 × 0.75 (multiplication); any divided/added version of the formula or numbers loses the method point
const doorRight=a=>has(new RegExp(`\\b5\\s*(?:n\\b)?\\s*${TIMES}\\s*0?[.,]75(?!\\d)|0?[.,]75\\s*(?:m\\b)?\\s*${TIMES}\\s*5(?![.,]?\\d)`),a)||
  has(new RegExp(`\\bforce\\s*${TIMES}\\s*(?:the\\s*)?(?:perpendicular\\s*)?distance|\\bdistance\\s*${TIMES}\\s*(?:the\\s*)?force`),a)&&/\b5\b/.test(a)&&/0?[.,]75/.test(a);
const doorWrong=a=>has(new RegExp(`\\bforce\\s*${NOTTIMES}\\s*(?:the\\s*)?(?:perpendicular\\s*)?distance|\\bdistance\\s*${NOTTIMES}\\s*(?:the\\s*)?force|\\b5\\s*(?:n\\b)?\\s*${NOTTIMES}\\s*0?[.,]75|0?[.,]75\\s*(?:m\\b)?\\s*${NOTTIMES}\\s*5\\b`),a);
// see-saw: 150 × 1 working; mother at 0.25 m (or 25 cm), worked out as 150 ÷ 600
const childMoment=a=>has(new RegExp(`\\b150\\s*(?:n\\b)?\\s*${TIMES}\\s*1(?![.,]?\\d)|\\b1\\s*(?:m\\b)?\\s*${TIMES}\\s*150\\b`),a)||(/\b1\s*(?:m\b|metre|meter)/.test(a.toLowerCase())&&/\b150\s*(?:nm|n m|n·m|newton[ -]?met)/.test(a.toLowerCase()));
const seesawRight=a=>has(/(?<![\d.,])0?[.,]25\s*(?:m\b|metres?\b|meters?\b)|(?<![\d.,])25\s*(?:cm\b|centimet)|quarter of a met/,a)&&
  has(new RegExp(`\\b150\\s*(?:nm\\b|n\\s*m\\b|n\\b)?\\s*(?:÷|\\/|divided by|over)\\s*600|divid\\w* 150\\s*(?:nm\\b|n\\b)? by 600|\\b600\\s*(?:n\\b)?\\s*${TIMES}\\s*(?:d\\b|distance|\\?|0?[.,]25)|\\b(?:d|distance)\\s*${TIMES}\\s*600`),a);
const seesawWrong=a=>has(/0?[.,]25\s*(?:cm|mm|centimet|millimet)|(?<![\d.,])4\s*(?:m|metres?|meters?)\b|\b600\s*(?:n\s*)?(?:÷|\/|divided by)\s*150\b/,a)||/(?<!not on the |not on |not the )\bsame side\b/.test(flat(a));
const motherWrong=a=>/\b1200\b/.test(flat(a))||has(new RegExp(`\\b600\\s*(?:n\\b)?\\s*${TIMES}\\s*(?:1|2)\\s*(?:m\\b)?\\s*=`),a);
// chair: above the pivot there is NO turning force; past the pivot there is one
const ABOVE=/\babove\b|\bon top\b|\bdirectly over\b|\bover the (?:pivot|legs?|back legs)\b/;
const chairAbove=(_a,parts,hit)=>clauses(parts).some(c=>(hit(c,'above')||hit(c,'on top')||hit(c,'directly over')||/\bover the (?:pivot|legs?|back)/.test(c))&&
  /\b(?:no|not|isn t|doesn t|without|zero)\b(?: \w+){0,3} (?:turn|moment|topple|tip|fall)|\bbalanc|\bstable\b|\bsteady\b/.test(c));
const chairWrong=(_a,parts)=>clauses(parts).some(c=>ABOVE.test(c)&&!/\b(?:no longer|not|isn t) (?:\w+ )?(?:above|over|on top)/.test(c)&&
  /\b(?:is|there s|gives|causes|makes|creates|produces|has|have) (?:a |an |the )?(?:turning|moment|clockwise|anticlockwise)/.test(c));
const chairPast=(_a,parts)=>clauses(parts).some(c=>/\b(?:past|behind|beyond|other side|outside|further back than|no longer (?:above|over)|not (?:above|over)|isn t (?:above|over))\b/.test(c));
// apples: clockwise moment = anticlockwise moment; moment = force × distance; small apple further, big apple closer
const clockEqual=a=>raw(a).some(s=>(s.match(/clockwise/g)||[]).length>=2&&/anti/.test(s)&&/=|equal|the same|balance/.test(s));
const clockWrong=a=>raw(a).some(s=>/clockwise/.test(s)&&/\b(?:not|isn t|aren t|un)\s*(?:\w+ )?(?:equal|the same|balanced)\b|\b(?:bigger|greater|larger|more|smaller|less) than\b|\bunequal\b/.test(s));
const momentRight=a=>has(new RegExp(`\\bforce\\s*${TIMES}\\s*(?:the\\s*)?(?:perpendicular\\s*)?distance|\\bdistance\\s*${TIMES}\\s*(?:the\\s*)?force|\\bmultiply\\w* (?:the )?force by (?:the )?distance`),a);
const momentWrong=a=>has(new RegExp(`\\bforce\\s*${NOTTIMES}\\s*(?:the\\s*)?(?:perpendicular\\s*)?distance|\\bdistance\\s*${NOTTIMES}\\s*(?:the\\s*)?force`),a);
const applePairs=a=>{ let subj=null; const out=[];
  const t=flat(a).replace(/\b(?:bigger|greater|larger|longer|more) distance\b/g,' far ').replace(/\b(?:smaller|shorter|less) distance\b/g,' near ')
    .replace(/\bless (?:weight|heavy|mass)\b/g,' light ').replace(/\bmore (?:weight|mass)\b/g,' heavy ');
  // each distance word goes with the apple named most recently before it
  for(const [w] of t.matchAll(/\b(?:small|smaller|little|light|lighter|lightest|big|bigger|biggest|large|larger|heav\w*|further|furthest|farther|far|closer|closest|nearer|nearest|near)\b/g)){
    if(/^(?:small|little|light|big|large|heav)/.test(w)) subj=/^(?:small|little|light)/.test(w)?'small':'big';
    else if(subj) out.push(subj==='small'===/^f/.test(w)); }
  return out; };
const STEADY=['steady','constant','same speed','balanced','equilibrium','zero','equal'];
const constant=terms=>({check:(_answer,parts,hit)=>parts.flatMap(s=>s.split(/\bbut\b/)).some(s=>
  terms.some(t=>hit(s,t))&&['same','constant','fixed','unchanged'].some(t=>hit(s,t))&&!/\b(?:change|vary|increase|decrease|different)\b/.test(s))});
const permanent={check:(_answer,parts,hit)=>{
  if(parts.some(s=>['past','beyond','exceed'].some(t=>hit(s,t))&&/\b(?:will|would|can|does) (?:go back|return)\b/.test(s))) return false;
  return parts.some(s=>
  /\b(?:not|never|won t|cannot|can t|doesn t) (?:go back|return|recover|regain)\b/.test(s)||
  (hit(s,'permanent')&&/\b(?:stretch|extend|extension|deform|change|long)/.test(s))||
  ['stays stretched','stay stretched','stays longer','stay longer'].some(t=>hit(s,t))); }};
const badBalance=[/\bunbalanced\b/,/\bnot balanced\b/,/\bresultant(?: force)? (?:is )?(?:not zero|nonzero|non zero)\b/];
// extension = measured length − original length: the subtraction must go the right way round
const MEAS='(?:measured|new|stretched|final) length|measured|measurement', ORIG='(?:original|starting|start|unstretched|natural) length|original';
// order(A,B): a sentence says "A minus B" (or "take B from A"); the difference wording works either way round
const order=(s,A,B)=>new RegExp(`\\b(?:${A})\\b.{0,40}?\\b(?:minus|take away|takeaway|subtract|take off|less)\\b.{0,30}?\\b(?:${B})\\b`).test(s)||
  new RegExp(`\\b(?:subtract|take away|takeaway|take off|take)\\b.{0,30}?\\b(?:${B})\\b.{0,30}?\\bfrom\\b.{0,30}?\\b(?:${A})\\b`).test(s);
const sentences=answer=>answer.toLowerCase().replace(/\s[-−–]\s|[−–]/g,' minus ').split(/[.;!?\n]+/);
// right way round somewhere, and never the wrong way round anywhere (contradictory answers get no mark)
const extensionSum={check:answer=>{ const ss=sentences(answer);
  const right=ss.some(s=>order(s,MEAS,ORIG)||[[MEAS,ORIG],[ORIG,MEAS]].some(([A,B])=>new RegExp(`\\bdifference between\\b.{0,50}?\\b(?:${A})\\b.{0,30}?\\band\\b.{0,30}?\\b(?:${B})\\b`).test(s)));
  const wrong=ss.some(s=>order(s,ORIG,MEAS));
  return right&&!wrong; }};
// 1.3.2 tennis ball and floor: the right object must do the right thing, and a contradiction loses the point
const cl=a=>a.toLowerCase().replace(/[’']/g,"'").split(/[.;:!?\n,()]+|\b(?:and|but|while|whereas|so|then|because|which)\b/).map(c=>c.trim()).filter(Boolean);
const NEG=/\b(?:not|no|never|without|cannot)\b|n't\b/;
const aboutBall=c=>/\b(?:ball|it)\b/.test(c)||!/\b(?:ground|floor|court|surface)\b/.test(c);
const ballSame=a=>cl(a).some(c=>aboutBall(c)&&(/\b(?:same shape|keeps? (?:its )?shape|stays? the same|stays? round|no change)\b/.test(c)||(NEG.test(c)&&/\b(?:chang|deform|squash|squish|compress|flatten)/.test(c))));
const ballOnGround=a=>/\b(?:ball|it) (?:\w+ )?(?:squash|compress|flatten|deform)\w* (?:the )?(?:ground|floor|court)/.test(a.toLowerCase());
const ballDeforms=a=>!ballSame(a)&&!ballOnGround(a)&&cl(a).some(c=>aboutBall(c)&&!NEG.test(c)&&/\b(?:deform|chang\w* (?:its |the |of )?shape|shape chang|squash|squish|flatten|compress|dent)/.test(c));
const ballSquashed=a=>!ballSame(a)&&!ballOnGround(a)&&!cl(a).some(c=>aboutBall(c)&&!NEG.test(c)&&/\b(?:tension|stretch|pulled apart|expand)/.test(c))&&
  cl(a).some(c=>aboutBall(c)&&!NEG.test(c)&&/\b(?:compress|squash|squish|flatten)/.test(c));
const BREAK=/\bbonds? (?:\w+ ){0,2}(?:break|broke|broken|snap)|\bbreak\w* (?:the |its |their )?bonds|\bno bonds\b|\bbonds? (?:are|is) not\b/;
const APART=/\b(?:stretch|pull\w* (?:\w+ )?apart|move\w* apart|spread|tension)/;
const floorBonds=a=>!BREAK.test(a.toLowerCase())&&cl(a).some(c=>!NEG.test(c)&&/\b(?:particle|atom|molecule)/.test(c)&&/\b(?:bond|joined|held|hold|attract)/.test(c));
const floorCompressed=a=>!BREAK.test(a.toLowerCase())&&!cl(a).some(c=>!NEG.test(c)&&APART.test(c))&&
  cl(a).some(c=>!NEG.test(c)&&(/\b(?:compress|squash|squish)/.test(c)||/\b(?:push|press|force|weight)\w*\b.{0,40}\b(?:together|closer)\b/.test(c)));
const floorPushesBack=a=>!BREAK.test(a.toLowerCase())&&!/\b(?:pull\w* (?:you |me |us )?(?:up|back)|attract\w* (?:you|me))\b/.test(a.toLowerCase())&&
  cl(a).some(c=>!NEG.test(c)&&/\b(?:push\w* (?:you |me |us )?(?:back|up)|force back|reaction|support|hold\w* (?:you |me |us )?up)/.test(c));
window.MARKS = {
  l1:[
    [ {all:[['friction'],['against','oppos','between','slow','stop','floor','ground','resist','backward','rough','grip']],reject:[boxForward]}, {all:[['friction','resultant','unbalanced','not balanced','only force'],['slow','stop','decelerat','unbalanced']],reject:[boxForward,boxBalanced,/\b(?:speeds?|speeding) up\b/]}, [['lubric','oil','grease','smooth','wheel','polish']] ],
    [ {all:[['water resist','water drag','drag in water','drag in the water','drag from the water']],reject:[dragSwap]}, {all:[['air resist','air drag','drag in the air','drag from the air']],reject:[dragSwap]}, [['particle','molecule'],['push','move','way','contact','hit','collide']] ],
    [ {all:[['weight','gravity'],['bigger','greater','more','larger','stronger','smaller','less','than']],also:leafRight,reject:[leafWrong]}, {all:[['speed','faster','accelerat'],['up','increas','faster','accelerat']],reject:[leafWrong]}, {all:[['air resistance','air resistence','drag'],['increas','grow','bigger','more','rise']],also:dragRises,reject:[dragFalls]}, {all:[STEADY],also:leafEqual,reject:[leafWrong]} ],
    [ constant(['size','area','parachute','surface']), constant(['mass','weight','load','object']), constant(['height','drop from','place','distance']) ]
  ],
  l2:[
    [ {check:ballDeforms}, {check:ballSquashed} ],
    [ {check:floorBonds}, {check:floorCompressed}, {check:floorPushesBack} ],
    [ [['12']], [['double','twice','2 times','two times','x2','proportion']], permanent ],
    [ [['extension','extend','stretch'],['measur','ruler','read','how far','how much']], extensionSum, [['1 n','known','each newton','per newton','compare','divide','2 cm','one newton']] ]
  ],
  l3:[
    [ {check:doorRight,reject:[doorWrong]}, {check:answer=>/\b3[.,]75\s*(?:n\s*[·⋅*.]?\s*m|newton[ -]*(?:metres?|meters?))\b/i.test(answer)} ],
    [ {check:childMoment}, {all:[['equal','same','balance','law of moments','150 nm']],reject:[motherWrong]}, {check:seesawRight,reject:[seesawWrong]} ],
    [ [['centre of gravity','center of gravity','centre of mass','center of mass']], {all:[['above','over','on top'],['pivot','leg']],also:chairAbove,reject:[chairWrong]}, {all:[['turning','moment','topple','tip','fall']],also:chairPast,reject:[chairWrong]} ]
  ],
  final:[
    [ {all:[STEADY],reject:badBalance}, {all:[['balanced','equal','same size','opposite','cancel']],reject:badBalance}, [['drag','water resistance','water resistence']] ],
    [ [['tension','stretch']], [['extension','extend','stretch']], permanent ],
    [ {all:[['clockwise'],['anticlockwise','anti clockwise']],also:clockEqual,reject:[clockWrong]}, {all:[['force'],['distance']],also:momentRight,reject:[momentWrong]}, {all:[['further','farther','closer','nearer','far','near'],['small','light','big','heav','large']],also:a=>applePairs(a).some(Boolean),reject:[a=>applePairs(a).some(ok=>!ok)]} ]
  ]
};
})();
