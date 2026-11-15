/* ===== Auto-marking rules for the written "Apply it" questions (Magnetism & electromagnets) =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer. */
(function(){
const EM=['electromagnet','electro magnet','electro-magnet'];
const OFF=['off','switch','control','stop','let go','drop','release'];
const ordered=(pattern,expected)=>expected.map((want,i)=>({check:answer=>{
  const found=(answer.toLowerCase().match(new RegExp(pattern,'g'))||[]).map(w=>w.replace(/[ -]/g,''));
  return found[i]&&found[i].startsWith(want);
}}));
const poles=ordered('\\bnorth(?:[- ]seeking)?\\b|\\bsouth(?:[- ]seeking)?\\b|\\brepel[a-z]*\\b|\\battract[a-z]*\\b|\\bneedle\\b|\\bcompass\\b',['north','south','repel','attract','needle','compass']);
// the first two blanks can be north and south in either order
['north','south'].forEach((want,i)=>{ poles[i]={check:answer=>{ const f=(answer.toLowerCase().match(/\bnorth(?:[- ]seeking)?\b|\bsouth(?:[- ]seeking)?\b|\brepel[a-z]*\b|\battract[a-z]*\b|\bneedle\b|\bcompass\b/g)||[]).slice(0,2); return f.some(w=>w.startsWith(want)); }}; });
const devices=ordered('\\belectro[ -]?magnet\\b|\\bring[a-z]*\\b|\\bswitch\\b|\\breset\\b|\\bpermanent\\b|\\brepel[a-z]*\\b|\\battract[a-z]*\\b',['electromagnet','ring','switch','reset','permanent']);
devices.push({check:answer=>{
  const found=answer.toLowerCase().match(/\belectro[ -]?magnet\b|\bring[a-z]*\b|\bswitch\b|\breset\b|\bpermanent\b|\brepel[a-z]*\b|\battract[a-z]*\b/g)||[];
  return found.length===7&&found.slice(5).some(w=>w.startsWith('attract'))&&found.slice(5).some(w=>w.startsWith('repel'));
}});
const outcome=(label,expected)=>({check:(answer,_parts,hit)=>{
  const opposite=expected==='attract'?'repel':'attract';
  const text=answer.toLowerCase();
  const re=/\b(?:diagram\s+)?([ab])\s*(?::|[-–]|\s)\s*([\s\S]*?)(?=\b(?:diagram\s+)?[ab]\s*(?::|[-–]|\s)|$)/g;
  const labelled=[...text.matchAll(re)].filter(m=>m[1]===label);
  const norm=s=>s.replace(/[^a-z0-9]+/g,' ').trim();
  if(labelled.length) return labelled.some(m=>hit(norm(m[2]),expected)&&!hit(norm(m[2]),opposite));
  const relation=label==='a'?/\b(?:unlike|different)\b/:/\b(?:like|same)\b/;
  return text.split(/[.!?;,]|\b(?:and|but|whereas|while)\b/).map(norm).some(s=>relation.test(s)&&hit(s,expected)&&!hit(s,opposite));
}});
const materialProblem=answer=>/\b(?:must be (?:a )?magnetic|(?:might|may|could) not be (?:a )?magnetic|non[ -]?magnetic|not all\b[^.!?;]*\bmagnetic|aluminium|copper|another metal|other metal)\b/i.test(answer);
// Credit the shared mechanism and the different reset behaviour separately.
// Mentioning an electromagnet and a ringing bell does not describe a comparison.
const sharedMechanism={check:(_answer,parts,hit)=>parts.some(s=>
  /\b(?:both|each|similarity|similar|in common)\b|\bbells?\b.*\b(?:and|as well as)\b.*\bbreakers?\b|\bbreakers?\b.*\band\b.*\bbells?\b/.test(s)&&
  (hit(s,'electromagnet')||hit(s,'electro magnet'))&&
  ((hit(s,'attract')&&(hit(s,'iron')||hit(s,'armature')||hit(s,'catch')))||
    ((hit(s,'break')||hit(s,'open'))&&hit(s,'circuit'))))};
const resetDifference={check:(_answer,parts,hit)=>{
  const clauses=parts.flatMap(s=>s.split(/\b(?:but|whereas|while)\b/));
  return clauses.some(s=>{
    if(/\bbreaker\b/.test(s)) {
      if(/\b(?:not|never|doesn t)\s+(?:stay\w*|remain\w*|keep\w*)\s+(?:switched |turned )?off\b|\breset\w*\s+(?:automatically|by itself|on its own)\b/.test(s)) return false;
      const manual=/\b(?:reset|press|push|manually|manual)\b/.test(s)&&
        !/\b(?:automatically|by itself|on its own)\b/.test(s)&&hit(s,'reset');
      const staysOff=/\b(?:stay\w*|remain\w*|keep\w*)\s+(?:switched |turned )?off\b/.test(s)&&!hit(s,'automatically');
      if(manual||staysOff) return !/\b(?:does not|doesn t|never)\s+(?:need|require)\w*\s+(?:a )?reset\b/.test(s);
    }
    if(/\bbell\b/.test(s)&&hit(s,'circuit')) {
      return /\b(?:again|repeated\w*|continual\w*|automatic\w*|by itself|on its own|keeps?)\b/.test(s)&&
        (hit(s,'mak')||hit(s,'remak')||hit(s,'clos'))&&
        !/\b(?:not|never)\s+(?:\w+\s+){0,2}(?:mak\w*|remak\w*|clos\w*)\b/.test(s);
    }
    return false;
  });
}};
// cloze: a trailing "like poles attract" / "unlike poles repel" contradicts the repel/attract blanks
const poleClash=/\b(?:like|same) poles? (?:will )?attract|\b(?:unlike|different) poles? (?:will )?repel/;
poles[2].reject=poles[3].reject=[poleClash];
const parts2=parts=>parts.flatMap(s=>s.split(/,|\b(?:and|but|whereas|while|so)\b/));
// compass: the needle is a magnet that lines up with the Earth's field (not the Sun, not gravity)
const compassWrong=[/\b(?:not|isn t) (?:a )?(?:small )?magnet(?:ic)?\b|\bnot (?:\w+ )?affected\b|\bignor/,/\b(?:because of|due to|caused by|towards?|pulled by|attracted (?:to|by)) (?:the )?(?:sun|gravity)\b/];
const earthField=(_a,parts,hit)=>parts.some(s=>hit(s,'earth')&&/\b(?:line|lines|lined|lining|align\w*|points?|pointing|follow\w*|attract\w*|pull\w*|affect\w*|because|due|caused|turn\w*|in|by|with|to)\b/.test(s));
// electromagnet: wire coiled round the nail; connected to the battery so a current flows
const MAKE={choices:[[['battery','cell'],['connect','clip','lead','attach','join','wire','end']],[['current'],['flow','through','pass','switch on','turn on']]],minimum:1};
// strength factors: a factor named with a decrease (fewer turns, less current, no core) is the wrong way round unless it says "weaker"
const weakens=(factor,down)=>(_a,parts)=>parts2(parts).some(c=>factor.test(c)&&down.test(c)&&!/\bweak|\bless strong|\bnot as strong|\b(?:decreas|reduc|lower)\w* (?:the |its )?strength/.test(c));
const DOWN=/\b(?:fewer|less|lower|smaller|decreas\w*|reduc\w*)\b/;
const CORE_OUT=/\b(?:remov\w*|tak\w*|took) (?:\w+ ){0,2}core\b|\bcore (?:\w+ ){0,2}(?:out|removed)\b|\bwithout (?:a |an |the )?(?:iron )?core\b|\bno core\b/;
// steel core (book p38): steel keeps its magnetism, iron loses it
// each clause with the metal it is about ("Steel is hard to magnetise but keeps its magnetism": both clauses are steel)
const metalClauses=parts=>{ let m=null; return parts.flatMap(s=>s.split(/,|\b(?:and|but|whereas|while|so|because)\b/)).map(c=>{
  const st=/\bsteel\b/.test(c), ir=/\biron\b/.test(c); if(st!==ir) m=st?'steel':'iron'; else if(st) m=null; return [m,c]; }); };
const steelWrong=(_a,parts,hit)=>metalClauses(parts).some(([m,c])=>
  m==='steel'&&(['lose','loses','losing','lost','easy to magneti','easily magneti','demagneti','stops being magnetic','no longer magnetic'].some(t=>hit(c,t))||
    /\bonly (?:\w+ ){0,2}magnetic\b|\bnot magnetic (?:when|after|once)\b/.test(c))||
  m==='iron'&&['keep','keeps','stay','stays','remain','retain'].some(t=>hit(c,t))&&/\bmagnet/.test(c)&&!/\bnot magnetic\b/.test(c));
const steelKeeps=(_a,parts,hit)=>metalClauses(parts).some(([m,c])=>m==='steel'&&
  (['keep','stay','remain','retain','still','not lose','never lose','doesn t lose','does not lose','won t lose'].some(t=>hit(c,t))&&/\bmagnet/.test(c)||/\bpermanent/.test(c)&&hit(c,'magnet')));
const stillOn=(_a,parts)=>parts.some(s=>/\bstill (?:be |stay |remain )?(?:\w+ )?magnet|\bmagnet\w* (?:even )?still\b|\bstay\w* (?:\w+ )?magnet\w*|\bremain\w* (?:\w+ )?magnet\w*|\bmagnet\w* (?:\w+ )?(?:even )?(?:when|after|with|once) (?:the )?(?:current|electricity|power|switch|circuit|battery|it)\w* (?:\w+ ){0,2}(?:off|stopped|turned off|switched off)|\b(?:cannot|can t|can not|could not|couldn t|wouldn t|won t|unable to|not be able to|not) (?:\w+ ){0,2}(?:turn|switch)\w* (?:\w+ ){0,2}off\b|\bstay\w* on\b/.test(s));
const offWrong=/\bcan still be (?:turned|switched) off\b|\b(?:turns?|switches?) off (?:easily|properly|fine)\b|\bso it (?:switches|turns) off\b/;
// breaker (book p41): reset by hand; a breaker that "resets automatically" anywhere loses the reset point
const autoReset=(_a,parts)=>parts.flatMap(s=>s.split(/\b(?:but|whereas|while|and)\b/)).some(c=>!/\bbell/.test(c)&&
  (/\breset\w*\b.*\b(?:automatic\w*|by itself|on its own|itself)\b|\b(?:automatic\w*|by itself|on its own)\b.*\breset\w*/.test(c)||
   /\b(?:turn|switch|come)\w* (?:itself )?back on\b.*\b(?:automatic\w*|by itself|on its own)\b|\b(?:automatic\w*|by itself|on its own) (?:turn|switch|come)\w* (?:\w+ )?back on/.test(c))&&
  !/\b(?:not|never|doesn t|don t|won t|cannot|can t)\b(?:\s+\w+){0,2}\s+(?:reset|turn|switch|come)/.test(c));
// scrap yard: the electromagnet is the strong one
const permStrong=/\bpermanent magnets? (?:are|is|can be) (?:much |more |very |a lot )?(?:strong|stronger|more powerful|powerful)\b|\belectro ?magnets? (?:are|is) (?:much |a lot )?(?:weaker|less strong|not strong)/;
// surgeon: a non-magnetic splinter can't then be said to be removed / attracted
const nonMagRemoved=/\bnon ?magnetic\b(?: \w+){0,6} (?:will|would|can|could) be (?:removed|attracted|picked)/;
window.MARKS = {
  l1:[
    poles,
    [ {all:[['needle','compass'],['magnet']],reject:compassWrong}, {all:[['earth'],['field','line up','lines up','align','magnetic']],also:earthField,reject:compassWrong} ],
    [ [['compass']], [['iron filing','filings']], [['closer','close','closest','nearer','together','dense'],['strong']] ]
  ],
  l2:[
    [ [['wrap','coil','wind','wound','loop','turn'],['nail','core','iron','around','round']], MAKE ],
    [ {all:[['turns','coil','loop','wire wrap','number of']],reject:[weakens(/\b(?:turns?|coils?|loops?|wire|wraps?)\b/,DOWN)]}, {all:[['current','voltage','potential difference','battery','cell']],reject:[weakens(/\b(?:current|voltage|potential difference|batter\w*|cells?)\b/,DOWN)]}, {all:[['core','iron','magnetic material']],reject:[weakens(/\bcore\b/,CORE_OUT)]} ],
    [ {all:[['steel'],['keep','stay','remain','retain','still','permanent','not lose','never lose','doesn t lose']],also:steelKeeps,reject:[steelWrong]}, {all:[['still magnetic','stay magnetic','stays magnetic','can t','cannot','not turn','not switch','magnet']],also:stillOn,reject:[steelWrong,offWrong]} ]
  ],
  l3:[
    devices,
    [ sharedMechanism, {check:(a,p,h)=>resetDifference.check(a,p,h)||/\bbreaker/.test(a.toLowerCase())&&p.some(s=>/\b(?:press|push)\w* (?:the )?reset\b|\breset\w* (?:it )?(?:by hand|manually)\b/.test(s)),reject:[autoReset]} ],
    [ {all:[['strong','power','lift heav','heavier']],reject:[permStrong]}, [OFF] ]
  ],
  final:[
    [ outcome('a','attract'), outcome('b','repel') ],
    [ [EM], {choices:[[OFF.concat(['on and off'])],[['strong','power']]],minimum:1}, {check:materialProblem,reject:[nonMagRemoved]}, {reject:[nonMagRemoved],check:answer=>materialProblem(answer)&&/\b(?:not|never|won['’]?t|cannot|can['’]?t)\s+(?:\w+\s+){0,3}(?:attract\w*|remove\w*|pick\w*|lift\w*)/i.test(answer)} ],
    [ [['coil','current']], [['attract','pull'],['iron','armature','catch','break','circuit']] ],
    [ {all:[['needle','compass','magnet'],['earth','field','line up','lines up']],also:earthField,reject:compassWrong}, {all:[['north'],['direction','way','navigat','know','tell','find','work out','where','map','route','go']],reject:compassWrong} ]
  ]
};
})();
