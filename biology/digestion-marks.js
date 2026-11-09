/* ===== Auto-marking rules for the written "Apply it" questions =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'absor' matches absorb, absorbed, absorption. */
(function(){
const FIBRE=['fibre','fiber','wholemeal','whole meal','wholegrain','whole grain','brown bread','vegetable','veg','fruit','lentil','bean','bran','oat','cereal','salad','broccoli','carrot','apple'];
const HEAT=['heat','water bath','warm','hot','boil'];
const any=(parts,fn)=>parts.some(fn);
const has=(part,hit,words)=>words.some(w=>hit(part,w));
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
const positiveTest=(parts,nutrient,result,hit)=>{
  const denied=new RegExp('\\b(?:no|not|without|absent|negative for)\\b.{0,30}\\b'+nutrient+'\\b|\\b'+nutrient+'\\b.{0,25}\\b(?:absent|not present|negative)\\b');
  return !parts.some(p=>denied.test(p))&&any(parts,p=>hit(p,nutrient)&&(hit(p,result)||/\b(?:contain\w*|present|positive)\b/.test(p)));
};
window.MARKS = {
  l1:[
    [ [FIBRE], [['bulk','volume','bigger','soft']], [['mov','push','pass','along','squeez','through','out','easier','easily']] ],
    [ [['sugar','simple']], [['sugar','sweet','simple'],['quick','fast','burst','short','rapid','quickly','instant']], [['starch','complex'],['slow','gradual','long','last','steady','longer','broken down','break']] ],
    [ [['store','reserve'],['energy']], [['insulat','warm','heat','cold']], [['protect','damage'],['organ','kidney','heart']] ],
    [ [['right','correct'],['nutrient','amount']], [['carbohydrate','bread','pasta','starch'],['energy']], [['protein','meat','fish','egg'],['growth','grow','repair']], [['vitamin','mineral'],['fruit','veg']], [['fibre','fiber','wholemeal']], [['water','lipid','fat','oil']] ]
  ],
  l2:[
    [ [['pestle','mortar','crush','grind'],['water']], [['iodine'],['blue','black']], [['benedict'],HEAT], [['orange','red','brick']], [['copper','biuret']], [['purple','violet','lilac','mauve']] ],
    [ [['goggle','eye','glasses','safety spec']], [['flame','fire','flammable','bunsen','hot','burn','scald','eat','taste','spill','gloves','careful']] ],
    [ [['pestle','mortar','crush','grind']], [['water']], [['mix','stir','shake']] ],
    [ [['copper']], [['sodium hydroxide','hydroxide']], {check:(answer,parts,hit)=>!parts.some(p=>/\b(?:no|not|without)\b.{0,30}\bprotein\b|\bprotein\b.{0,25}\b(?:absent|not present|negative)\b/.test(p))&&any(parts,p=>has(p,hit,['purple','violet','lilac','mauve'])&&(/\b(?:positive|contain\w*|present|mean\w*|indicat\w*)\b/.test(p)||hit(p,'protein')))} ]
  ],
  l3:[
    [ [['13000','13 000'],['10000','10 000','minus','take away','subtract','−','-']], [['3000','3 000','three thousand']] ],
    [ [['5000','5 000']], [['11000','11 000','divid','over','original']], [['100','percent','times']], {check:(answer)=>{const values=[...String(answer).matchAll(/\b(\d+(?:\.\d+)?)\s*(?:%|percent\b)/gi)].map(m=>Number(m[1]));return values.length>0&&values.every(v=>v>=45&&v<=46);}} ],
    [ [['ricket']], {check:(answer,parts,hit)=>{const denial=/\b(?:not(?! enough)|no|never)\b.{0,25}\b(?:caus\w*|lead\w*|result\w*)\b|\b(?:caus\w*|lead\w*|result\w*)\b.{0,25}\b(?:not|no|never)\b(?! enough)\s+(?:rickets|the condition)/;return !parts.some(p=>denial.test(p)&&/vitamin d|vit d/.test(p))&&any(parts,p=>/\b(?:vitamin d|vit d)\b/.test(p)&&/\b(?:lack|deficien\w*|not enough|without|low|insufficient)\b/.test(p));}}, [['bone'],['weak','soft','bend','bow','strong','calcium','brittle','healthy']] ],
    [ [['malnourish','malnutrition','both','neither','disagree','not true','wrong']], [['less','not enough','too little','fewer','lower','under'],['energy','food','eat','calorie']], [['tired','immune','ill','sick','infection','lack energy','weak','exhaust']], [['vitamin','mineral','deficien']], [['more','too much','extra','excess','over'],['fat']], [['heart','stroke','diabetes','cancer']] ]
  ],
  l4:[
    [ [['fibre','fiber'],['bulk','bulky']], [['muscle','squeez'],['push','forc','along','mov']], [['constipat']] ],
    [ {check:(answer,parts,hit)=>!parts.some(p=>/\b(?:not|never|no)\b.{0,12}\bthin\b|\b(?:not|never|no)\b.{0,12}\b(?:one|1|single) cell thick\b/.test(p))&&any(parts,p=>hit(p,'thin')||/\b(?:one|1|single) cell thick\b/.test(p))},
      {check:(answer,parts,hit)=>!parts.some(p=>/\b(?:reduc\w*|decreas\w*|less|smaller|lower)\b.{0,20}\bsurface area\b|\bsurface area\b.{0,20}\b(?:reduc\w*|decreas\w*|less|smaller|lower)\b|\b(?:not|never|no)\b.{0,15}\b(?:increas\w*|large|big|greater|more)\b.{0,20}\bsurface area\b/.test(p))&&any(parts,p=>has(p,hit,['villi','villus'])&&/\b(?:large|big|greater|increas\w*|more)\b.{0,20}\bsurface area\b|\bsurface area\b.{0,20}\b(?:large|big|greater|increas\w*|more)\b/.test(p))},
      {check:(answer,parts,hit)=>{const denial=/\b(?:not|never|don t|doesn t|cannot|can t)\b.{0,30}\b(?:carr\w*|tak\w*|transport\w*|remov\w*|mov\w*)\b|\b(?:blood|capillar)\b.{0,30}\b(?:not|never)\b.{0,20}\b(?:away|absor\w*|nutrient)\b/;return !parts.some(p=>denial.test(p))&&any(parts,p=>has(p,hit,['capillar','blood vessel','blood suppl','blood flow']));}} ],
    [ [['muscle'],['squeez','push','contract','move','forc']], [['bulk','fibre','fiber','toothpaste','behind','against']] ],
    [ [['chew','teeth','tooth','saliva']], [['gullet','oesophagus','esophagus','food pipe']], [['stomach'],['acid','juice','enzyme','churn','protease']], [['small intestine'],['blood','absor']], [['large intestine'],['water']], [['rectum','anus']] ]
  ],
  l5:[
    [ [['bacteria','probiotic','microb','microorganism','bacterium','good bacteria']], [['vitamin']], [['break','digest','healthy','health','gut']] ],
    [ [['starch','carbohydrate']], [['carbohydrase','amylase','enzyme'],['saliva','salivary','mouth']], {check:(answer,parts,hit)=>conversion(parts,STARCH,SUGAR,/\b(?:carbohydrase|amylase|saliva|enzyme)\b/,hit)&&!hasWrongDirection(parts,STARCH,SUGAR)} ],
    [ [['large','big'],['small']], [['speed','faster','quicker']], {all:[['not used up','not get used up','without being used up','without getting used up','aren t used up','isn t used up','not consumed','not changed','unchanged','reused','reusable','used again']],reject:[/\b(?:enzymes?|catalysts?|they) (?:are |is |get |gets |become )?(?:used up|consumed)\b/]} ],
    [ [['enzyme'],['small','break','chop']], [['carbohydrase','protease','lipase','different nutrient','different type']], [['bacteria'],['large intestine','fibre','fiber']], [['vitamin']] ]
  ],
  final:[
    [ [['carbohydrase','amylase'],['sugar','glucose']], [['mouth','saliva']], [['protease'],['amino']], [['stomach']] ],
    [ [['small intestine']], [['bile']], {check:(answer,parts,hit)=>conversion(parts,/\b(?:lipids?|fats?|oils?)\b/,/\b(?:fatty acids?|glycerol)\b/,/\blipase\b/,hit)&&!hasWrongDirection(parts,/\b(?:lipids?|fats?|oils?)\b/,/\b(?:fatty acids?|glycerol)\b/)&&has(parts.join(' '),hit,['fatty acid'])&&has(parts.join(' '),hit,['glycerol'])} ],
    [ [['mix','churn'],['juice','acid']], [['protease','protein','microorganism','microbe','bacteria','germ','kill']] ],
    [ {check:(answer,parts,hit)=>positiveTest(parts,'starch','blue black',hit)},
      {check:(answer,parts,hit)=>['orange red','orange','red'].some(c=>positiveTest(parts,'sugar',c,hit))},
      {check:(answer,parts,hit)=>['purple','violet','lilac'].some(c=>positiveTest(parts,'protein',c,hit))},
      {check:(answer,parts,hit)=>conversion(parts,STARCH,SUGAR,/\b(?:carbohydrase|amylase)\b/,hit)&&!hasWrongDirection(parts,STARCH,SUGAR)},
      {check:(answer,parts,hit)=>conversion(parts,/\bproteins?\b/,/\bamino acids?\b/,/\bprotease\b/,hit)&&!hasWrongDirection(parts,/\bproteins?\b/,/\bamino acids?\b/)} ]
  ]
};
})();
