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
window.MARKS = {
  l1:[
    [ [ENDO], [['energy','heat'], FROM.concat(['into the pack','into the mixture','into the cold'])], [DOWN] ],
    [ [['calcium chloride']], [EXO.concat(UP,['15','35','biggest rise','most'])], [['potassium chloride']], [ENDO.concat(DOWN,['10','biggest fall','biggest drop','most'])] ],
    [ [ENDO], [['energy','heat'],['ice','drink','glass','hand','surround']], [['hand','skin','finger'],FROM.concat(['cold','cool'])] ],
    [ [EXO], [['water','surround','beaker'],UP.concat(TO)] ]
  ],
  l2:[
    [ [['boil','evaporat']], [['higher','more energy','above','up','greater']], [ENDO.concat(['energy in','in from'])] ],
    [ [['less energy','lower','ice has less','less than','below','down']], [['down','given out','gives out','releas','out to','to the surround']], [EXO] ],
    [ [['methane','natural gas','gas']], [['56','33','21','most','more','highest','biggest','times']], [['cost','price','cheap','expensive','pollut','carbon dioxide','co2','renewable','non renewable','run out','store','storage','safe','availab','smoke','environment','climate','deliver']] ]
  ],
  l3:[
    [ [['679']], [['864']], [['less','smaller','lower','more energy is released','more released','bigger','greater','more than']], [EXO.concat(['energy given','overall energy'])] ],
    [ [['594']], [['1124','1 124']], [['less','smaller','lower','bigger','greater','more']], [['exotherm']] ],
    [ [['bond'],['break','broken','split']], [['energy','endotherm'],['need','take','require','absorb','in','endotherm']], [['hot','heat','temperature','engine'],['energy','supply','provide','give','enough']], [['platinum','rhodium','catalyst']] ]
  ],
  final:[
    [ [['exotherm']], [['energy','heat'],['water','surround','beaker','to the','hotter','rise','increas','warm']], [['independent'],['fuel','type']], [['volume','amount of water','mass of water','same water','how much water']], [['mass of fuel','amount of fuel','how much fuel','time','starting temperature','start temperature','initial temperature','distance','height','same beaker','same fuel amount']] ],
    [ [['higher','above','products','reactants'],['more energy','store','products','reactants']], [['endotherm','taken in','takes in','take in'],['taken in','takes in','take in','absorb','from the surround','in from']], [['cold'],['cool','injur','takes','take','colder','lower']] ],
    [ [['break','broken'],['in','take','need','endotherm','absorb','requir']], [['make','made','form'],['out','give','releas','exotherm']], [['more','greater','bigger','less','smaller']], [['lower','below','down','less energy']] ]
  ]
};
})();
