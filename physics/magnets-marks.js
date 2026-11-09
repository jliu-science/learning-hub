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
const materialProblem=answer=>/\b(?:must be (?:a )?magnetic|non[ -]?magnetic|not all\b[^.!?;]*\bmagnetic|aluminium|copper|another metal|other metal)\b/i.test(answer);
window.MARKS = {
  l1:[
    poles,
    [ [['needle','compass'],['magnet']], [['earth'],['field','line up','lines up','align','magnetic']] ],
    [ [['compass']], [['iron filing','filings']], [['closer','close','closest','nearer','together','dense'],['strong']] ]
  ],
  l2:[
    [ [['wrap','coil','wind','wound','loop','turn','around','round']], [['battery','cell','current','connect','clip','lead']] ],
    [ [['turns','coil','loop','wire wrap','number of']], [['current','voltage','potential difference','battery','cell']], [['core','iron','magnetic material']] ],
    [ [['steel'],['keep','stay','remain','still magnetic','hard to']], [['off','still magnetic','stay magnetic','stays magnetic','can t','cannot','not turn']] ]
  ],
  l3:[
    devices,
    [ [[...EM,'coil','iron','armature','catch','break','attract']], [['reset','stay off','stays off','keep ring','keeps ring','ring','again','by itself']] ],
    [ [['strong','power','lift heav','heavier']], [OFF] ]
  ],
  final:[
    [ outcome('a','attract'), outcome('b','repel') ],
    [ [EM], {choices:[[OFF.concat(['on and off'])],[['strong','power']]],minimum:1}, {check:materialProblem}, {check:answer=>materialProblem(answer)&&/\b(?:not|never|won['’]?t|cannot|can['’]?t)\s+(?:\w+\s+){0,3}(?:attract\w*|remove\w*|pick\w*|lift\w*)/i.test(answer)} ],
    [ [['coil','current']], [['attract','pull'],['iron','armature','catch','break','circuit']] ],
    [ [['needle','compass','magnet'],['earth','field','line up','lines up']], [['north','direction','way','navigat']] ]
  ]
};
})();
