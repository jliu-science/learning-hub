/* ===== Auto-marking rules for the written "Apply it" questions =====
   MARKS[lesson][question] = one rule per marking point, in the same order as the points.
   A rule is a list of groups; the point is awarded if EVERY group has at least one of its words in the answer.
   Words match the start of a word, so 'absor' matches absorb, absorbed, absorption. */
(function(){
const FIBRE=['fibre','fiber','wholemeal','whole meal','wholegrain','whole grain','brown bread','vegetable','veg','fruit','lentil','bean','bran','oat','cereal','salad','broccoli','carrot','apple'];
const HEAT=['heat','water bath','warm','hot','boil'];
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
    [ [['copper']], [['sodium hydroxide','hydroxide']], [['purple','violet','lilac','mauve']] ]
  ],
  l3:[
    [ [['13000','13 000'],['10000','10 000','minus','take away','subtract','−','-']], [['3000','3 000','three thousand']] ],
    [ [['5000','5 000']], [['11000','11 000','divid','over','original']], [['100','percent','times']], [['45','46']] ],
    [ [['ricket']], [['vitamin d','vit d']], [['bone'],['weak','soft','bend','bow','strong','calcium','brittle','healthy']] ],
    [ [['malnourish','malnutrition','both','neither','disagree','not true','wrong']], [['less','not enough','too little','fewer','lower','under'],['energy','food','eat','calorie']], [['tired','immune','ill','sick','infection','lack energy','weak','exhaust']], [['vitamin','mineral','deficien']], [['more','too much','extra','excess','over'],['fat']], [['heart','stroke','diabetes','cancer']] ]
  ],
  l4:[
    [ [['fibre','fiber'],['bulk','bulky']], [['muscle','squeez'],['push','forc','along','mov']], [['constipat']] ],
    [ [['thin']], [['villi','villus','surface']], [['capillar','blood vessel','blood suppl','blood flow','blood']] ],
    [ [['muscle'],['squeez','push','contract','move','forc']], [['bulk','fibre','fiber','toothpaste','behind','against']] ],
    [ [['chew','teeth','tooth','saliva']], [['gullet','oesophagus','esophagus','food pipe']], [['stomach'],['acid','juice','enzyme','churn','protease']], [['small intestine'],['blood','absor']], [['large intestine'],['water']], [['rectum','anus']] ]
  ],
  l5:[
    [ [['bacteria','probiotic','microb','microorganism','bacterium','good bacteria']], [['vitamin']], [['break','digest','healthy','health','gut']] ],
    [ [['starch','carbohydrate']], [['carbohydrase','enzyme'],['saliva','mouth']], [['sugar']] ],
    [ [['large','big'],['small']], [['speed','faster','quicker']], [['used up','not used','without being','aren t used','isn t used','not changed']] ],
    [ [['enzyme'],['small','break','chop']], [['carbohydrase','protease','lipase','different nutrient','different type']], [['bacteria'],['large intestine','fibre','fiber']], [['vitamin']] ]
  ],
  final:[
    [ [['carbohydrase','amylase'],['sugar','glucose']], [['mouth','saliva']], [['protease'],['amino']], [['stomach']] ],
    [ [['small intestine']], [['bile']], [['lipase'],['fatty acid','glycerol']] ],
    [ [['mix','churn'],['juice','acid']], [['protease','protein','microorganism','microbe','bacteria','germ','kill']] ],
    [ [['starch']], [['sugar']], [['protein']], [['carbohydrase']], [['protease','amino']] ]
  ]
};
})();
