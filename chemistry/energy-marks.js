/* ===== Auto-marking rules for the written "Apply it" questions (Chemical energy) =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'endotherm' matches endothermic. */
(function(){
const ENDO=['endotherm','takes in','take in','taken in','absorb'];
const EXO=['exotherm','gives out','give out','given out','releas'];
const FROM=['from the','from it','from your','out of the','away from','leaves','lose','loses','losing','taken from','takes energy','takes heat','absorb'];
const TO=['to the','into the','to your','warms','heats','gives','transfer'];
const DOWN=['decreas','down','drop','fall','lower','cool','colder','reduc','less'];
const UP=['increas','rise','rose','goes up','hotter','warmer','higher','heat up','heats up'];
const has=(part,words,hit)=>words.some(word=>hit(part,word));
const packClauses=parts=>parts.flatMap(part=>part.split(/\b(?:and|but|whereas)\s+(?=(?:calcium|potassium) chloride|(?:the )?(?:hand warmer|cold pack))/));
const paired=(parts,substance,use)=>packClauses(parts).some(clause=>clause.includes(substance)&&new RegExp('\\b'+use+'\\b').test(clause));
const bondClauses=answer=>String(answer).toLowerCase().split(/[.,;]|\b(?:whereas|while)\b|\band\s+(?=(?:the\s+)?(?:break\w*|mak\w*|form\w*|energy\s+(?:released|needed|required))\b)/).map(part=>part.replace(/[^a-z0-9]+/g,' ').trim()).filter(Boolean);
const bondNumber=(answer,number,role,hit)=>bondClauses(answer).some(part=>hit(part,number)&&has(part,role==='break'?['break','broken']:['make','making','made','form'],hit));
const wrongEnergyComparison=parts=>parts.some(part=>/\b(?:less|smaller) energy (?:is )?(?:releas\w*|given out)\b.*\bthan\b.*\b(?:needed|required|taken in)/.test(part)||/\bmore energy (?:is )?(?:needed|required|taken in)\b.*\bthan\b.*\b(?:releas\w*|given out)/.test(part));
const wrongRelation=(parts,small,large,answer='')=>new RegExp('\\b'+small+'\\s+(?:is\\s+)?(?:greater|bigger|higher|more|larger)\\s+than\\s+'+large+'\\b|\\b'+large+'\\s+(?:is\\s+)?(?:less|smaller|lower)\\s+than\\s+'+small+'\\b').test(parts.join(' '))||new RegExp('\\b'+small+'\\s*>\\s*'+large+'\\b|\\b'+large+'\\s*<\\s*'+small+'\\b').test(answer)||wrongEnergyComparison(parts);
const relation=(parts,small,large,hit,answer='')=>{
  const text=parts.join(' ');
  if(wrongRelation(parts,small,large,answer)) return false;
  const right=new RegExp('\\b'+small+'\\s+(?:is\\s+)?(?:less|smaller|lower)\\s+than\\s+'+large+'\\b|\\b'+large+'\\s+(?:is\\s+)?(?:greater|bigger|higher|more|larger)\\s+than\\s+'+small+'\\b');
  return right.test(text)||new RegExp('\\b'+small+'\\s*<\\s*'+large+'\\b|\\b'+large+'\\s*>\\s*'+small+'\\b').test(answer)||parts.some(part=>/\b(?:less|smaller|lower) energy (?:is )?(?:needed|required|taken in)\b.*\bthan\b.*\b(?:releas\w*|given out)/.test(part)||/\bmore energy (?:is )?(?:releas\w*|given out)\b.*\bthan\b.*\b(?:needed|taken in)/.test(part));
};
const fuelError=parts=>parts.some(part=>/\b(?:methane|natural gas)\b.{0,55}\b(?:least|lowest|smallest|less than|lower than)\b|\b56\b\s+(?:is\s+)?(?:less|lower|smaller)\s+than\s+(?:33|21)\b/.test(part));
const reverseTransfer=parts=>parts.some(part=>/\b(?:energy|heat)\b.{0,35}\bfrom\s+(?:the\s+)?water\b.{0,35}\bto\s+(?:the\s+)?fuel\b|\b(?:fuel|combustion)\b.{0,35}\b(?:takes?|absorbs?)\s+(?:in\s+)?(?:energy|heat)\s+from\s+(?:the\s+)?water\b/.test(part));
// Each choice is one distinct controlled variable, even when several synonyms occur.
const CONTROLS=[
  {all:[['volume of water','mass of water','amount of water','water volume','water mass','how much water']],patterns:[/\b(?:volume|mass|amount) and (?:the )?(?:initial|starting|start) temperature of (?:the )?water\b/]},
  [['starting temperature','start temperature','initial temperature']],
  [['mass of fuel','amount of fuel','fuel mass','same fuel amount','volume of fuel','fuel volume','how much fuel']],
  [['burning time','burn time','same time','time']],
  [['distance','height','flame beaker gap']],
  [['same beaker','same container']]
];
window.MARKS = {
  l1:[
    [ [ENDO], [['energy','heat'], FROM.concat(['into the pack','into the mixture','into the cold'])], [DOWN] ],
    [
      {check:(answer,parts,hit)=>paired(parts,'calcium chloride','hand warmer')&&!paired(parts,'calcium chloride','cold pack')},
      {check:(answer,parts,hit)=>packClauses(parts).some(p=>p.includes('calcium chloride')&&has(p,EXO.concat(UP,['15','35']),hit)&&!has(p,ENDO,hit))&&!paired(parts,'calcium chloride','cold pack')},
      {check:(answer,parts,hit)=>paired(parts,'potassium chloride','cold pack')&&!paired(parts,'potassium chloride','hand warmer')},
      {check:(answer,parts,hit)=>packClauses(parts).some(p=>p.includes('potassium chloride')&&has(p,ENDO.concat(DOWN,['10']),hit)&&!has(p,EXO,hit))&&!paired(parts,'potassium chloride','hand warmer')}
    ],
    [ [ENDO], [['energy','heat'],['ice','drink','glass','hand','surround']], [['hand','skin','finger'],FROM.concat(['cold','cool'])] ],
    [ [EXO], [['water','surround','beaker'],UP.concat(TO)] ]
  ],
  l2:[
    [ [['boil','evaporat']], [['higher','more energy','above','up','greater']], [ENDO.concat(['energy in','in from'])] ],
    [ [['less energy','lower','ice has less','less than','below','down']], [['down','given out','gives out','releas','out to','to the surround']], [EXO] ],
    [
      {check:(answer,parts,hit)=>!fuelError(parts)&&parts.some(p=>has(p,['methane','natural gas'],hit)&&has(p,['most','highest','biggest','more energy','56'],hit))},
      {check:(answer,parts,hit)=>!fuelError(parts)&&parts.some(p=>hit(p,'56')&&(hit(p,'33')||hit(p,'21')||has(p,['1 7 times','2 5 times'],hit)))},
      [['cost','price','cheap','expensive','pollut','carbon dioxide','co2','renewable','non renewable','run out','store','storage','safe','availab','smoke','environment','climate','deliver']]
    ]
  ],
  l3:[
    [ {check:(answer,parts,hit)=>bondNumber(answer,'679','break',hit)&&!bondNumber(answer,'864','break',hit)}, {check:(answer,parts,hit)=>bondNumber(answer,'864','make',hit)&&!bondNumber(answer,'679','make',hit)}, {check:(answer,parts,hit)=>relation(parts,'679','864',hit,answer)}, {check:(answer,parts,hit)=>has(parts.join(' '),EXO.concat(['energy given','overall energy']),hit)&&!wrongRelation(parts,'679','864',answer)} ],
    [ {check:(answer,parts,hit)=>bondNumber(answer,'594','break',hit)&&!bondNumber(answer,'1124','break',hit)}, {check:(answer,parts,hit)=>bondNumber(answer,'1124','make',hit)&&!bondNumber(answer,'594','make',hit)}, {check:(answer,parts,hit)=>relation(parts,'594','1124',hit,answer)}, {check:(answer,parts,hit)=>has(parts.join(' '),EXO,hit)&&!wrongRelation(parts,'594','1124',answer)} ],
    [ [['bond'],['break','broken','split']], [['energy','endotherm'],['need','take','require','absorb','in','endotherm']], [['hot','heat','temperature','engine'],['energy','supply','provide','give','enough']], [['platinum','rhodium','catalyst']] ]
  ],
  final:[
    [ [['exotherm']], {check:(answer,parts,hit)=>!reverseTransfer(parts)&&parts.some(p=>has(p,['energy','heat'],hit)&&has(p,['water','surround','beaker'],hit)&&has(p,UP.concat(['to the','transfers']),hit))}, [['independent'],['fuel','type']], {choices:CONTROLS,minimum:1}, {choices:CONTROLS,minimum:2} ],
    [ [['higher','above','products','reactants'],['more energy','store','products','reactants']], [['endotherm','taken in','takes in','take in'],['taken in','takes in','take in','absorb','from the surround','in from']], [['cold'],['cool','injur','takes','take','colder','lower']] ],
    [ [['break','broken'],['in','take','need','endotherm','absorb','requir']], [['make','made','form'],['out','give','releas','exotherm']], [['more','greater','bigger','less','smaller']], [['lower','below','down','less energy']] ]
  ]
};
})();
