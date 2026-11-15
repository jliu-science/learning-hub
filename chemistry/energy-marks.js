/* ===== Auto-marking rules for the written "Apply it" questions (Chemical energy) =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'endotherm' matches endothermic.
   {all, also, reject}: 'also' adds a relation test; any 'reject' match (wrong or reversed claim) loses the point. */
(function(){
const ENDO=['endotherm','takes in','take in','taken in','absorb'];
const EXO=['exotherm','gives out','give out','given out','releas'];
const FROM=['from the','from your','out of the','away from','leaves','lose','loses','losing','lost','taken from','takes energy','takes heat','takes the heat','takes the energy','absorb','moves out','to the pack','into the pack','to the cold pack','into the mixture'];
const TO=['to the','into the','to your','warms','heats','gives','transfer'];
const DOWN=['decreas','down','drop','fall','lower','cool','colder','cold','chill','reduc','less'];
const UP=['increas','rise','rose','goes up','hotter','warmer','higher','heat up','heats up'];
const has=(part,words,hit)=>words.some(word=>hit(part,word));
const anyPart=(parts,re)=>parts.some(p=>re.test(p));
// A positive (not negated) word anywhere, e.g. 'exothermic' in an answer that also says endothermic.
const claims=(parts,words,hit)=>parts.some(p=>has(p,words,hit));

/* ---- bonds: who takes in / gives out, and which is bigger ---- */
// Up to five ordinary words between a bond verb and its energy verb; stops at than/and/so, negations, numbers and the other bond verb.
const GAP='(?: (?!and (?!(?:oxygen|water|chlorine|fluorine|hydrogen|nitrogen|carbon)\\b))(?!(?:than|so|but|because|less|more|whereas|while|then|therefore|not|never|doesn|don|isn|break\\w*|broken|mak\\w*|made|form\\w*)\\b)[a-z]+){0,7}';
const BREAK_OUT=new RegExp('\\b(?:break\\w*|broken)'+GAP+' (?:gives?|giving|given|gave|releas\\w*|exotherm\\w*)\\b|\\b(?:releas\\w*|gives? out|given out) (?:when|by|in) (?:breaking|bonds? break)');
const MAKE_IN=new RegExp('\\b(?:mak\\w*|made|form\\w*)'+GAP+' (?:takes?|taking|taken|took|needs?|needed|requir\\w*|absorb\\w*|uses?|endotherm\\w*)\\b|\\b(?:taken in|takes? in|needed|required) (?:when|by|in|for|to) (?:making|make|forming)\\b');
const RIGHT_CMP=[
  /\bmore (?:energy )?(?:is )?(?:given out|gives? out|releas\w*)\b.*\bthan\b/,
  /\b(?:less|smaller|lower) (?:energy )?(?:is )?(?:needed|required|taken in|takes? in|used)\b.*\bthan\b/,
  /\b(?:mak|form)\w*(?: (?!than\b)[a-z]+){0,3} (?:more|greater|bigger|larger|higher)(?: energy)? than\b/,
  /\bbreak\w*(?: (?!than\b)[a-z]+){0,3} (?:less|smaller|lower)(?: energy)? than\b/
];
const WRONG_CMP=[
  /\b(?:less|smaller|lower) (?:energy )?(?:is )?(?:given out|gives? out|releas\w*)\b.*\bthan\b/,
  /\bmore (?:energy )?(?:is )?(?:needed|required|taken in|takes? in|used)\b.*\bthan\b/,
  /\b(?:mak|form)\w*(?: (?!than\b)[a-z]+){0,3} (?:less|smaller|lower)(?: energy)? than\b/,
  /\bbreak\w*(?: (?!than\b)[a-z]+){0,3} (?:more|greater|bigger|larger|higher)(?: energy)? than\b/
];
const wrongEnergyComparison=parts=>parts.some(p=>WRONG_CMP.some(re=>re.test(p)));
const rightEnergyComparison=parts=>parts.some(p=>RIGHT_CMP.some(re=>re.test(p)));
const bondClauses=answer=>String(answer).toLowerCase().split(/[.,;]|\b(?:whereas|while)\b|\band\s+(?=(?:the\s+)?(?:break\w*|mak\w*|form\w*|energy\s+(?:released|needed|required))\b)|\band\s+(?=\d+\s*(?:kj\S*\s*)?(?:to|for)\s+(?:break|mak|form))/).map(part=>part.replace(/[^a-z0-9]+/g,' ').trim()).filter(Boolean);
const bondNumber=(answer,number,role,hit)=>bondClauses(answer).some(part=>hit(part,number)&&has(part,role==='break'?['break','broken']:['make','making','made','form'],hit));
const swappedBonds=(answer,parts)=>anyPart(parts,BREAK_OUT)||anyPart(parts,MAKE_IN);
const wrongRelation=(parts,small,large,answer='')=>new RegExp('\\b'+small+'\\s+(?:is\\s+)?(?:greater|bigger|higher|more|larger)\\s+than\\s+'+large+'\\b|\\b'+large+'\\s+(?:is\\s+)?(?:less|smaller|lower)\\s+than\\s+'+small+'\\b').test(parts.join(' '))||new RegExp('\\b'+small+'\\s*>\\s*'+large+'\\b|\\b'+large+'\\s*<\\s*'+small+'\\b').test(answer)||wrongEnergyComparison(parts);
const relation=(parts,small,large,hit,answer='')=>{
  if(wrongRelation(parts,small,large,answer)) return false;
  const right=new RegExp('\\b'+small+'\\s+(?:is\\s+)?(?:less|smaller|lower)\\s+than\\s+'+large+'\\b|\\b'+large+'\\s+(?:is\\s+)?(?:greater|bigger|higher|more|larger)\\s+than\\s+'+small+'\\b');
  return right.test(parts.join(' '))||new RegExp('\\b'+small+'\\s*<\\s*'+large+'\\b|\\b'+large+'\\s*>\\s*'+small+'\\b').test(answer)||rightEnergyComparison(parts);
};
// Conclusion: exothermic / energy given out overall, with no endothermic claim and no reversed comparison.
const bondConclusion=(small,large)=>({all:[['exotherm','overall energy','energy given out overall','given out overall','gives out energy overall']],
  reject:[(a,parts,hit)=>claims(parts,['endotherm'],hit),(a,parts)=>wrongRelation(parts,small,large,a)]});

/* ---- hand warmer / cold pack: link each substance to its own use and direction ---- */
const SUBST=/\b(?:calcium chloride|potassium chloride|sodium hydrogen carbonate|sodium carbonate)\b/;
const substOf=t=>(t.match(SUBST)||[])[0]||null;
const packText=answer=>String(answer).replace(/\bca\s*cl\s*[2₂]?(?![a-z])/gi,'calcium chloride').replace(/\bkcl\b/gi,'potassium chloride').replace(/\bnahco\s*[3₃]?(?![a-z])/gi,'sodium hydrogen carbonate').replace(/\bna\s*[2₂]\s*co\s*[3₃]?(?![a-z])/gi,'sodium carbonate');
const USE='(?:the\\s+)?(?:calcium|potassium|sodium|kcl|ca\\s*cl|hand\\s*warm|cold\\s*pack|ice\\s*pack)';
const packClauses=answer=>{
  const out=[]; let last=null;
  packText(answer).split(/(?<!\d)\.|\.(?!\d)|[;!?\n]+/).forEach(sentence=>{
    const segs=sentence.split(new RegExp(',\\s*(?=(?:and\\s+|but\\s+)?'+USE+')|\\b(?:and|but|whereas|while)\\s+(?='+USE+')','i'))
      .map(s=>' '+s.toLowerCase().replace(/[^a-z0-9]+/g,' ')+' ')
      .flatMap(s=>s.split(new RegExp('(?='+SUBST.source+')')));
    // a piece with no substance joins the next piece in the sentence (or the previous one at the end)
    const merged=[]; let carry='';
    segs.forEach(s=>{ if(!substOf(s)) carry+=' '+s; else { merged.push(carry+' '+s); carry=''; } });
    if(carry.trim()){ if(merged.length) merged[merged.length-1]+=' '+carry; else merged.push(carry); }
    merged.forEach(text=>{ if(!text.trim()) return; const s=substOf(text); if(s) last=s; out.push({text,sub:s||last}); });
  });
  return out;
};
const HOT=/\bhand ?warm\w*/, COLD=/\b(?:cold|ice) ?packs?\b/;
const usedFor=(answer,sub,use,hit)=>packClauses(answer).some(c=>c.sub===sub&&(use==='hand'?HOT:COLD).test(c.text)&&hit(c.text,use==='hand'?(c.text.match(HOT)||[''])[0]:(c.text.match(COLD)||[''])[0]));
const choice=(sub,use,other)=>({all:[[use==='hand'?'hand warm':'cold pack',use==='hand'?'warmer':'ice pack']],
  also:(answer,parts,hit)=>usedFor(answer,sub,use,hit)&&!usedFor(answer,sub,other,hit)});
const UP_R=['increas','rise','rising','rose','risen','goes up','go up','went up','gets hot','get hot','hot','heats','heat up','heating up','warm','exotherm','gives out','give out','giving out','gives off','give off','releas','higher'];
const DOWN_R=['decreas','down','drop','fall','fell','lower','cool','cold','chill','reduc','endotherm','takes in','take in','taken in','absorb'];
const reason=(sub,good,bad,start,other)=>({all:[good],also:(answer,parts,hit)=>{
  const cs=packClauses(answer).filter(c=>c.sub===sub).map(c=>{ const t=c.text.replace(/\b(?:hand ?warm\w*|(?:cold|ice) ?packs?)\b/g,' ');
    return {good:has(t,good,hit)||start.test(t),bad:has(t,bad,hit)}; });
  return cs.some(c=>c.good&&!c.bad)&&!cs.some(c=>c.bad)&&!usedFor(answer,sub,other,hit);
}});

/* ---- fuels ---- */
const FACTOR=/\b(?:cost|price|cheap|expensive|pollut|carbon dioxide|co2|renewable|run out|stor|safe|availab|smoke|environment|climate|deliver)/;
const fuelError=parts=>parts.some(part=>
  /\b(?:methane|natural gas)\b.{0,55}\b(?:least|lowest|smallest|less than|lower than)\b|\b(?:methane|natural gas)(?: and \w+)?(?: 56)?(?: mj)? (?:are|is) (?:less|lower|smaller)\b/.test(part)||
  /\b56\b\s+(?:mj\s+)?(?:is\s+)?(?:less|lower|smaller)\s+than\s+(?:33|21)\b|\b(?:33|21)\s+(?:mj\s+)?(?:is\s+|are\s+)?(?:more|greater|bigger|higher|larger)\s+than\s+56\b/.test(part)||
  /\b(?:coal|wood)\b(?:(?! methane| natural| 56)[ a-z0-9]){0,40}?\b(?:most|highest|biggest|largest|greatest)\b|\b(?:most|highest|biggest|largest|greatest) (?:energy )?(?:per kg )?(?:is|comes from|is from) (?:from )?(?:coal|wood)\b/.test(part)||
  /\b(?:coal|wood) (?:is|would be) (?:the )?best\b/.test(part)&&!FACTOR.test(part));

/* ---- burning fuel under water ---- */
const reverseTransfer=parts=>parts.some(part=>/\b(?:energy|heat)\b(?: \w+){0,4} from (?:the )?(?:water|beaker)\b|\b(?:energy|heat)\b(?: (?!distance)\w+){0,6} (?:in)?to (?:the )?(?:flame|fuel|burner|ethanol|propanol)\b|\bwater (?:gives|loses|transfers|releases|gave|lost) (?:out )?(?:its )?(?:energy|heat)|\b(?:fuel|flame|burner|ethanol|propanol|combustion)\w* (?:takes?|absorbs?|gains?) (?:in )?(?:energy|heat)/.test(part));
const IV=/\b(?:independent(?: variable)?|chang\w*|var(?:y|ies|ied|ying)|alter\w*|different)\b(?: (?!same\b)[a-z]+){0,5} (?:fuels?|ethanol|propanol)\b|\b(?:fuels?|ethanol|propanol)(?: [a-z]+){0,3} (?:is|are|gets?) (?:changed|varied|different|the independent)/;
const IV_WRONG=/\bindependent variable (?:is|was|would be|will be) (?!(?:the |a )?(?:type|kind|fuel|which|what|different|ethanol|propanol)\b)|\bkeep (?:the )?(?:type of fuel|kind of fuel|fuel type|fuel) (?:the )?same\b|\bsame (?:type of fuel|kind of fuel|fuel type)\b/;
// Each choice is one distinct controlled variable, even when several synonyms occur.
const CONTROLS=[
  {all:[['volume of water','mass of water','amount of water','water volume','water mass','how much water']],patterns:[/\b(?:volume|mass|amount) and (?:the )?(?:initial|starting|start) temperature of (?:the )?water\b/]},
  [['starting temperature','start temperature','initial temperature']],
  [['mass of fuel','amount of fuel','fuel mass','same fuel amount','volume of fuel','fuel volume','how much fuel']],
  [['burning time','burn time','heating time','time it burns','time burning','time for burning','time to burn','time it is heated','how long']],
  [['distance','height','flame beaker gap']],
  [['same beaker','same container']]
];
const NOT_SAM=/\b(?:sam|think|thinks|thought|says|said|believes)\b/;
window.MARKS = {
  l1:[
    [ {all:[ENDO],reject:[(a,parts,hit)=>claims(parts,['exotherm'],hit),(a,parts)=>anyPart(parts,/\bendotherm\w*(?: \w+){0,4} (?:gives?|giving|given|releas\w*) (?:out )?(?:energy|heat)?/)]},
      {all:[['energy','heat'],FROM],reject:[/\b(?:from|out of) (?:the )?(?:cold )?(?:pack|mixture|ammonium nitrate)\b/,/\b(?:gives?|giving|given|releas\w*|transfer\w*) (?:out )?(?:energy |heat )?(?:in)?to (?:the |your )?(?:ankle|injury|leg|foot|skin)\b/]},
      {all:[DOWN],also:(a,parts,hit)=>parts.some(p=>has(p.replace(/\b(?:cold|ice) packs?\b/g,' '),DOWN,hit)),reject:[(a,parts,hit)=>claims(parts,['hotter','warmer','heats up','heat up','goes up','rise','increas'],hit)]} ],
    [ choice('calcium chloride','hand','cold'), reason('calcium chloride',UP_R,DOWN_R,/\b20 (?:c |degrees )?(?:to|then) 35\b/,'cold'),
      choice('potassium chloride','cold','hand'), reason('potassium chloride',DOWN_R,UP_R,/\b20 (?:c |degrees )?(?:to|then) 10\b/,'hand') ],
    [ {all:[ENDO],reject:[(a,parts,hit)=>claims(parts,['exotherm'],hit),/\bmelt\w*(?: \w+){0,3} (?:gives?|releases?) (?:out )?(?:energy|heat)/]},
      {all:[['energy','heat'],['ice','drink','glass','hand','surround'],['take','taking','took','absorb','from','gain','need','in from','energy in','heat in','into the ice','to the ice','to melt']],
       reject:[/\bice\b(?: \w+){0,2} (?:gives?|giving|releases?|transfers?) (?:out )?(?:energy|heat|cold)/,/\b(?:energy|heat) (?:\w+ ){0,3}from (?:the )?ice\b/]},
      {all:[['hand','skin','finger'],['from your','from the hand','from my','leaves','lose','loses','losing','lost','taken from','takes energy','takes heat','takes the heat','takes the energy','away from','out of','transferred from','goes from','moves from','flows from']],
       reject:[/\b(?:transfers?|transferring|gives?|giving|moves?|passes|goes) (?:the )?cold\b|\bcold (?:goes|moves|is transferred|transfers|passes|flows)\b/,/\b(?:ice|glass|drink)\b(?: \w+){0,2} (?:gives?|releases?|transfers?) (?:out )?(?:energy|heat) (?:in)?to (?:your |the )?(?:hand|skin|finger)/,/\b(?:hand|skin|finger)s? (?:feels?|gets?|is|becomes?) (?:hot|warm)/]} ],
    [ {all:[EXO],reject:[(a,parts,hit)=>claims(parts,['endotherm'],hit)]},
      {all:[['water','surround','beaker'],UP.concat(TO)],reject:[(a,parts,hit)=>claims(parts,['takes in','take in','taken in','absorb'],hit),/\bfrom (?:the )?water\b/,
        (a,parts,hit)=>parts.some(p=>hit(p,'water')&&has(p,['colder','cool','fall','drop','decreas','goes down'],hit))]} ]
  ],
  l2:[
    [ [['boil','evaporat']], [['higher','more energy','above','up','greater']],
      {all:[ENDO.concat(['energy in','in from'])],reject:[(a,parts,hit)=>parts.some(p=>!/\bcondens/.test(p)&&has(p,['exotherm','given out','gives out'],hit))]} ],
    [ {all:[['ice','product','solid','end','water','freez'],['less energy','lower','less than','below','loses','lose','lost']],
       reject:[/\bice (?:has|stores|contains|is) (?:got )?more\b/,/\b(?:ice|products?|solid|end) (?:\w+ )?(?:is |are )?(?:higher|above)\b/,/\barrow (?:\w+ )?up\b/]},
      {all:[['down','given out','gives out','give out','releas','out to','to the surround','loses','lose','lost']],
       reject:[(a,parts,hit)=>claims(parts.filter(p=>!NOT_SAM.test(p)),['takes in','take in','taken in','absorb'],hit),/\barrow (?:\w+ )?up\b/]},
      {all:[['exotherm']],reject:[/\bsam (?:is|was) (?:right|correct)\b/,/\bexotherm\w* (?:is|was) (?:wrong|incorrect)\b/,
        (a,parts,hit)=>claims(parts.filter(p=>!NOT_SAM.test(p)),['endotherm','takes in','take in','taken in','absorb'],hit)]} ],
    [
      {all:[['methane','natural gas'],['most','highest','biggest','more','largest','greatest','best','top']],reject:[(a,parts)=>fuelError(parts)]},
      {check:(answer,parts,hit)=>parts.some(p=>hit(p,'56')&&(hit(p,'33')||hit(p,'21')||has(p,['1 7 times','2 5 times'],hit))),reject:[(a,parts)=>fuelError(parts)]},
      [['cost','price','cheap','expensive','pollut','carbon dioxide','co2','renewable','non renewable','run out','store','storage','safe','availab','smoke','environment','climate','deliver']]
    ]
  ],
  l3:[
    [ {check:(answer,parts,hit)=>bondNumber(answer,'679','break',hit)&&!bondNumber(answer,'864','break',hit),reject:[swappedBonds]},
      {check:(answer,parts,hit)=>bondNumber(answer,'864','make',hit)&&!bondNumber(answer,'679','make',hit),reject:[swappedBonds]},
      {check:(answer,parts,hit)=>relation(parts,'679','864',hit,answer)}, bondConclusion('679','864') ],
    [ {check:(answer,parts,hit)=>bondNumber(answer,'594','break',hit)&&!bondNumber(answer,'1124','break',hit),reject:[swappedBonds]},
      {check:(answer,parts,hit)=>bondNumber(answer,'1124','make',hit)&&!bondNumber(answer,'594','make',hit),reject:[swappedBonds]},
      {check:(answer,parts,hit)=>relation(parts,'594','1124',hit,answer)}, bondConclusion('594','1124') ],
    [ {all:[['bond'],['break','broken','split']],reject:[/\bbonds? (?:\w+ ){0,3}(?:are |is |being |get )?(?:made|formed)\b|\b(?:mak|form)\w* (?:new )?bonds?\b(?! in (?:nitrogen )?monoxide| in no\b)/]},
      {all:[['energy','endotherm'],['need','take','require','absorb','endotherm','supply','supplie','provide','give','gives','enough']],
       also:(a,parts,hit)=>parts.some(p=>has(p,['break','broken','split'],hit)&&has(p,['energy','endotherm'],hit)),reject:[(a,parts)=>anyPart(parts,BREAK_OUT)]},
      {all:[['hot','heat','temperature','engine'],['energy','supply','supplie','provide','give','enough']],reject:[/\b(?:engine|it) (?:is |being )?cold\b/,/\bcatalyst\w*(?: \w+){0,2} (?:makes?|heats?) (?:the )?engine/]},
      {all:[['platinum','rhodium','catalyst','catalytic converter'],['harm','less','clean','safe','pollut','converts','converting','converted','change','turn','speed','faster','react','break down','breaks down']],
       reject:[/\bcatalyst\w*(?: \w+){0,3} (?:is |are |gets )?used up\b/,/\bcatalyst\w*(?: \w+){0,2} (?:gives?|provides?|supplies?) (?:the )?(?:energy|heat)/]} ]
  ],
  final:[
    [ {all:[['exotherm']],reject:[(a,parts,hit)=>claims(parts,['endotherm'],hit)]},
      {all:[['energy','heat'],['water','surround','beaker'],UP.concat(['to the','transfer','into the','goes to','gives'])],reject:[(a,parts)=>reverseTransfer(parts)]},
      {all:[['independent','chang','vary','varies','varied','alter','different'],['fuel','ethanol','propanol']],also:(a,parts)=>anyPart(parts,IV),reject:[IV_WRONG]},
      {choices:CONTROLS,minimum:1}, {choices:CONTROLS,minimum:2} ],
    [ {all:[['solution','product','end','final','it'],['higher','above','more energy','up']],
       reject:[/\b(?:solution|products?)\b(?: \w+){0,2} (?:lower|below)\b/,/\breactants?\b(?: \w+){0,2} (?:higher|above)\b/]},
      {all:[['endotherm','taken in','takes in','take in'],['taken in','takes in','take in','absorb','from the surround','in from']],reject:[(a,parts,hit)=>claims(parts,['exotherm','given out','gives out','give out'],hit)]},
      {all:[['cold pack','ice pack'],['cool','injur','takes','take','colder','lower']],
       reject:[(a,parts,hit)=>parts.some(p=>hit(p,'hand warm')&&!/\bhand warm\w* (?:is|would be|are) (?:wrong|bad|not|worse)/.test(p)),/\bcold packs? (?:get|gets|become|becomes|would get) (?:hot|warm)/]} ],
    [ {all:[['break','broken'],['take','taking','taken','need','requir','absorb','endotherm','energy in']],
       also:(a,parts)=>anyPart(parts,/\b(?:break\w*|broken)(?: [a-z]+){0,8} (?:takes?|taking|taken|took|needs?|needed|requir\w*|absorb\w*|endotherm\w*|uses?)\b|\b(?:taken in|takes? in|take in|needed|required|absorbed|endotherm\w*)(?: [a-z]+){0,4} (?:break\w*|broken)\b/)&&anyPart(parts,/\b(?:energy|heat|endotherm)/),reject:[(a,parts)=>anyPart(parts,BREAK_OUT)]},
      {all:[['make','mak','made','form'],['out','give','giving','releas','exotherm']],
       also:(a,parts)=>anyPart(parts,/\b(?:mak\w*|made|form\w*)(?: [a-z]+){0,8} (?:gives?|giving|given|gave|releas\w*|exotherm\w*)\b|\b(?:gives? out|given out|give out|releas\w*)(?: [a-z]+){0,4} (?:making|make|forming|forms?|made|formed)\b/)&&anyPart(parts,/\b(?:energy|heat|exotherm)/),reject:[(a,parts)=>anyPart(parts,MAKE_IN)]},
      {all:[['more','greater','bigger','larger','less','smaller']],also:(a,parts)=>rightEnergyComparison(parts),reject:[(a,parts)=>wrongEnergyComparison(parts)]},
      {all:[['product','arrow','diagram','line','graph','reactant','carbon dioxide'],['lower','below','down','higher','above']],
       also:(a,parts)=>anyPart(parts,/\b(?:products?|carbon dioxide|end)\b(?: [a-z]+){0,5} (?:lower|below)\b|\b(?:arrow|diagram|line|graph|it)\b(?: [a-z]+){0,3} (?:down|downwards?)\b|\breactants?\b(?: [a-z]+){0,3} (?:higher|above)\b/),
       reject:[/\b(?:products?|carbon dioxide)\b(?: [a-z]+){0,3} (?:higher|above)\b/,/\breactants?\b(?: [a-z]+){0,3} (?:lower|below)\b/,/\barrow\b(?: [a-z]+){0,2} up\b/]} ]
  ]
};
})();
