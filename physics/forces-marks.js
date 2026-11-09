/* ===== Auto-marking rules for the written "Apply it" questions (Contact forces) =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'lubric' matches lubrication. */
(function(){
const RES=['resultant','unbalanced','not balanced','bigger','greater','more than','only force'];
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
window.MARKS = {
  l1:[
    [ [['friction']], [RES.concat(['slows','slow','stops','against','opposite'])], [['lubric','oil','grease','smooth','wheel','polish']] ],
    [ [['water resistance','water resistence','drag']], [['air resistance','air resistence']], [['particle','molecule'],['push','move','way','contact','hit','collide']] ],
    [ [['weight','gravity'],['bigger','greater','more','larger','than air']], [['speed','faster','accelerat'],['up','increas','faster','accelerat']], [['air resistance','air resistence','drag'],['increas','grow','bigger','more','rise']], [STEADY] ],
    [ constant(['size','area','parachute','surface']), constant(['mass','weight','load','object']), constant(['height','drop from','place','distance']) ]
  ],
  l2:[
    [ [['shape','deform','squash','flatten','change']], [['compress','squash']] ],
    [ [['bond','particle']], [['compress','push','squash','together','weight']], [['push back','reaction','support','pushes back','push up','pushes up','force back']] ],
    [ [['12']], [['double','twice','2 times','two times','x2','proportion']], permanent ]
  ],
  l3:[
    [ [['5'],['0 75','0.75','75']], {check:answer=>/\b3[.,]75\s*(?:n\s*[·⋅*.]?\s*m|newton[ -]*(?:metres?|meters?))\b/i.test(answer)} ],
    [ [['150'],['1']], [['equal','same','balance','law of moments','150 nm']], [['0 25','0.25','25 cm','quarter']] ],
    [ [['centre of gravity','center of gravity','centre of mass','center of mass']], [['above','over','on top'],['pivot','leg']], [['turning','moment','topple','tip','fall'],['pivot','behind','past','beyond','other side','weight']] ]
  ],
  final:[
    [ {all:[STEADY],reject:badBalance}, {all:[['balanced','equal','same size','opposite','cancel']],reject:badBalance}, [['drag','water resistance','water resistence']] ],
    [ [['tension','stretch']], [['extension','extend','stretch']], permanent ],
    [ [['clockwise'],['anticlockwise','equal','same']], [['force'],['distance','times']], [['further','farther','longer','closer','nearer','distance'],['small','light','big','heav','less','more']] ]
  ]
};
})();
