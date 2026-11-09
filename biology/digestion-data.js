/* ===== Topic 8.4 Digestion, content =====
   Lessons follow the textbook pages 8.4.1–8.4.5. */
(function(){
const W = window.DigestionWidgets;

const L1 = {
  id:'l1', code:'8.4.1', short:'Nutrients', icon:'🥗', title:'Nutrients',
  colour:'linear-gradient(135deg,#2fa36b,#1f7a8c)',
  hook:'Why can\'t you live on sweets alone? Your body needs seven different things from food, each with its own job.',
  goals:['Name the nutrients and their jobs','Compare foods and diets','Explain what a balanced diet is'],
  keywords:[
    {word:'Nutrient',e:'🧩',def:'An important substance your body needs to survive and stay healthy. We get most from food.'},
    {word:'Carbohydrate',e:'🍞',def:'Provides energy. Simple carbs (sugars) = quick energy. Complex carbs (starch) = slow-release energy.'},
    {word:'Lipid',e:'🧈',def:'Fats and oils. Store of energy, keep you warm (insulation under skin), protect organs.'},
    {word:'Protein',e:'🍗',def:'Used for growth and repair of body tissues and to make new cells.'},
    {word:'Vitamin',e:'🍊',def:'Needed in tiny amounts to keep you healthy, e.g. vitamin A for eyesight, vitamin D for bones.'},
    {word:'Mineral',e:'🪨',def:'Needed in tiny amounts to keep you healthy, e.g. calcium for teeth and bones, iron for red blood cells.'},
    {word:'Dietary fibre',e:'🥦',def:'Parts of plants the body can\'t break down. Adds bulk so food keeps moving through the gut. Prevents constipation.'},
    {word:'Balanced diet',e:'⚖️',def:'Eating food containing the right nutrients in the correct amounts.'}
  ],
  summary:[
    ['🧩','<b>Nutrients</b> are substances your body needs to survive and stay healthy: <b>carbohydrates, lipids, proteins, vitamins, minerals</b> and <b>water</b>. <b>Fibre</b> isn\'t a nutrient but is important too.'],
    ['⚡','<b>Carbohydrates</b> give energy. <b>Sugars</b> (sugar, fruit) = quick energy. <b>Starch</b> (pasta, bread) must be broken down first, so energy is released <b>slowly</b>.'],
    ['🧈','<b>Lipids</b> (fats &amp; oils): 1) store of energy 2) keep you warm, insulation under the skin 3) protect organs like kidneys and heart.'],
    ['💪','<b>Proteins</b> repair body tissues and make new cells for growth. Muscles, organs and your immune system are mostly protein. Protein-rich foods include meat, fish, eggs, nuts and beans.'],
    ['🍊','<b>Vitamins &amp; minerals</b>, only tiny amounts needed. Vitamin A → eyesight. Vitamin D + calcium → teeth &amp; bones. Iron → red blood cells. Fruit &amp; veg are good sources.'],
    ['💧','<b>Water</b>: cells are about <b>70% water</b>. You lose it in sweat, tears, urine, faeces and breathing out, drink over a litre a day.'],
    ['🥦','<b>Fibre</b> adds bulk so food keeps moving through the gut and waste is pushed out more easily → prevents <b>constipation</b>.'],
    ['⚖️','A <b>balanced diet</b> = the right nutrients in the correct amounts.']
  ],
  memory:'<b>"Can Little Penguins Visit Many Wet Fields?"</b> → Carbohydrates, Lipids, Proteins, Vitamins, Minerals, Water, Fibre.',
  fact:['','Foul fact: eat lots of beetroot and your urine turns pink. Lots of asparagus turns it bright yellow!'],
  widgets:[
    {title:'Sort the foods',icon:'',intro:'Which nutrient is each food richest in? Drag each food into the right box.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'c',label:'Carbohydrate'},{id:'l',label:'Lipid'},{id:'p',label:'Protein'},{id:'v',label:'Vitamins & minerals'}],
      items:[
        {label:'Bread',ic:'bread',bin:'c',why:'bread contains starch'},{label:'Pasta',ic:'pasta',bin:'c',why:'pasta contains starch'},{label:'Rice',ic:'rice',bin:'c',why:'rice is mostly starch'},{label:'Sugar',ic:'sugar',bin:'c',why:'sugar is a simple carbohydrate'},
        {label:'Butter',ic:'butter',bin:'l',why:'butter is mostly fat'},{label:'Olive oil',ic:'oliveoil',bin:'l',why:'lipids are fats and oils'},
        {label:'Chicken',ic:'protein',bin:'p'},{label:'Fish',ic:'fish',bin:'p'},{label:'Meat',ic:'meat',bin:'p'},
        {label:'Broccoli',ic:'broccoli',bin:'v',why:'vegetables are a good source of vitamins and minerals'},{label:'Carrots',ic:'carrot',bin:'v',why:'vegetables are a good source of vitamins and minerals'},{label:'Spinach',ic:'spinach',bin:'v',why:'vegetables are a good source of vitamins and minerals'}
      ]})},
    {title:'Match the nutrient to its job',icon:'🔗',intro:'Textbook Summary Question 1.',render:(el,U)=>U.matcher(el,[
      ['Carbohydrates','Provide energy'],['Lipids','Energy store and insulation'],['Protein','Growth and repair'],
      ['Vitamins and minerals','Needed in small amounts to keep you healthy'],['Water','Needed in cells and body fluids'],['Dietary fibre','Provides bulk to food']])}
  ],
  quiz:[
    {q:'What is a nutrient?',options:['An important substance your body needs to survive and stay healthy','Any food that tastes good','A type of vitamin only','A chemical that makes food last longer'],answer:0},
    {q:'Which nutrient is mainly used for <b>growth and repair</b>?',options:['Protein','Carbohydrate','Lipid','Fibre'],answer:0,explain:'Proteins repair tissues and make new cells. Muscles are mostly protein.'},
    {q:'Why does pasta release energy more <b>slowly</b> than sugar?',options:['Pasta contains starch (a complex carbohydrate) which has to be broken down first','Pasta has no energy','Pasta is a lipid','Sugar is a protein'],answer:0},
    {q:'Which is <b>NOT</b> a job of lipids?',options:['Growth and repair','Store of energy','Insulation to keep you warm','Protecting organs like the heart and kidneys'],answer:0},
    {q:'Vitamin D works with which mineral to keep teeth and bones healthy?',options:['Calcium','Iron','Salt','Vitamin A'],answer:0},
    {q:'Iron is important for making…',options:['red blood cells','strong bones','good eyesight','fibre'],answer:0},
    {type:'fill',q:'Your cells are made up of about ____ % water.',answers:['70','70%','seventy']},
    {q:'Fibre is important because it…',options:['adds bulk so food keeps moving through the gut','gives lots of energy','is a vitamin','repairs muscles'],answer:0,explain:'Fibre can\'t be digested, it helps prevent constipation.'},
    {type:'fill',q:'Eating food containing the right nutrients in the correct amounts is called a ________ diet.',answers:['balanced','balanced diet']},
    {q:'True or false: fibre is a nutrient.',options:['False, it isn\'t a nutrient, but it is important for a healthy diet','True'],answer:0,noShuffle:true}
  ],
  apply:[
    {scenario:'Sam has constipation, it is hard to go to the toilet. Sam eats white bread, crisps and burgers, and hardly any fruit or vegetables.',question:'Suggest and explain the advice a doctor might give Sam.',marks:3,
      chain:['What is missing?','What does it do?','So what should Sam eat?'],
      hints:['Which part of the diet keeps food moving through the gut?','Which foods are rich in it?'],
      model:'Sam should eat more fibre-rich foods, such as wholemeal bread, fruit and vegetables. Fibre adds bulk to food, so the muscles of the gut can push against it and food keeps moving. Waste is pushed out more easily, so constipation is prevented.',
      points:['Eat more fibre (or name fibre-rich foods)','Fibre adds bulk to food','Keeps food moving through the gut / waste pushed out more easily']},
    {scenario:'There are two types of carbohydrate.',question:'Compare the two types of carbohydrate. Give an example food for each.',marks:3,
      chain:['Simple: found in…','Complex: found in…','Fast or slow energy?'],
      hints:['Think about sugar and fruit, and pasta and bread.'],
      model:'Simple carbohydrates (sugars) are found in foods such as sugar and fruit, and they provide a quick source of energy. Complex carbohydrates (starch) are found in foods such as pasta and bread. They have to be broken down by the body, so the energy is released more slowly.',
      points:['Simple carbohydrates (sugars), e.g. sugar or fruit','Sugars give a quick source of energy','Starch, e.g. pasta or bread, is broken down by the body so energy is released slowly']},
    {scenario:'Your friend says, "Fat is bad. My body doesn\'t need any lipids at all."',question:'Describe the role of lipids in the body.',marks:3,
      hints:['The book gives lipids three important jobs.'],
      model:'Lipids (fats and oils) provide a store of energy. They keep you warm by providing a layer of insulation under your skin. They also protect organs like your kidneys and heart from damage.',
      points:['Store of energy','Keep you warm / insulation under the skin','Protect organs (kidneys, heart) from damage']},
    {scenario:'A school is making a poster about healthy eating.',question:'Explain in detail what is meant by a balanced diet. Give examples of what a balanced diet should contain.',marks:6,
      model:'A balanced diet means eating food containing the right nutrients in the correct amounts. It should contain carbohydrates such as bread and pasta for energy; proteins such as meat, fish and eggs for growth and repair; vitamins and minerals, for example from fruit and vegetables, to keep you healthy; dietary fibre such as wholemeal bread to keep food moving through the gut; and over a litre of water a day. Lipids should be eaten only in small amounts.',
      points:['The right nutrients in the correct amounts','Carbohydrates for energy (e.g. bread, pasta)','Protein for growth and repair (e.g. meat, fish, eggs)','Vitamins and minerals from fruit and vegetables','Fibre (e.g. wholemeal bread) to keep food moving','Water (over a litre a day) / lipids only in small amounts']}
  ]
};

const L2 = {
  id:'l2', code:'8.4.2', short:'Food tests', icon:'🧪', title:'Food tests',
  colour:'linear-gradient(135deg,#3b6fd8,#7a5af8)',
  hook:'Scientists don\'t guess what\'s in food, they test it. Each nutrient has its own colour-change test.',
  goals:['Describe how to test for starch, lipids, sugar and protein','Describe each positive result'],
  keywords:[
    {word:'Food test',e:'🧪',def:'A chemical test to find out which nutrients are in a food.'},
    {word:'Hypothesis',e:'💭',def:'An idea that explains something scientists observe. It can be tested in an investigation and used to make a prediction.'},
    {word:'Iodine solution',e:'🟠',def:'Tests for STARCH. Orange-yellow → turns blue-black if starch is present.'},
    {word:'Benedict\'s solution',e:'🔵',def:'Tests for SUGAR. Blue → heat in a water bath → orange-red if sugar is present.'},
    {word:'Ethanol test',e:'☁️',def:'Tests for LIPIDS in a solution. Shake with ethanol, pour into water → turns cloudy if lipids are present.'},
    {word:'Copper sulfate + sodium hydroxide',e:'🟣',def:'Tests for PROTEIN. Pale blue → turns purple if protein is present.'},
    {word:'Filter paper test',e:'📄',def:'Tests a SOLID food for lipids. Rub on paper, hold to the light → translucent patch = lipids.'},
    {word:'Distilled water',e:'💧',def:'Pure water that contains no other chemical substances. Used to make a food solution.'}
  ],
  summary:[
    ['🥣','<b>Make a food solution:</b> 1) crush the food with a <b>pestle and mortar</b> 2) add a few drops of <b>distilled water</b> and mix well.'],
    ['🟠','<b>Starch:</b> add a few drops of <b>iodine</b> (orange-yellow) → <b>blue-black</b> = starch.'],
    ['🔵','<b>Sugar:</b> add <b>Benedict\'s</b> (blue) → <b>heat in a water bath</b> → <b>orange-red</b> = sugar.'],
    ['☁️','<b>Lipids (solution):</b> add <b>ethanol</b>, shake, leave 1 minute, pour into a tube of <b>water</b> → <b>cloudy</b> = lipids.'],
    ['📄','<b>Lipids (solid):</b> rub on <b>filter paper</b>, hold to the light → <b>translucent</b> (see-through) = lipids.'],
    ['🟣','<b>Protein:</b> add <b>copper sulfate</b> (pale blue) then <b>sodium hydroxide</b> (colourless) → <b>purple</b> = protein.']
  ],
  memory:'<b>"Starch goes Black, Sugar goes Red (needs heat), Protein goes Purple, Lipids go cloudy."</b> Picture a <b>B</b>lack <b>S</b>tar, a <b>R</b>ed-hot <b>S</b>ugar cube, a <b>P</b>urple <b>P</b>rotein shake and a <b>cloud</b> of fat.',
  widgets:[
    {title:'Virtual lab',icon:'🔬',intro:'Run the food tests from your textbook. Each sample is named after the nutrient it contains. The mystery sample changes every visit: work out what it contains.',render:W.lab},
    {title:'Match the test to the result',icon:'🔗',intro:'Textbook Summary Question 1.',render:(el,U)=>U.matcher(el,[
      ['Starch (iodine)','Turns blue-black'],['Sugar (Benedict\'s + heat)','Turns orange-red'],['Lipids (ethanol + water)','Turns cloudy'],['Lipids (filter paper)','Paper goes translucent'],['Protein (copper sulfate + sodium hydroxide)','Turns purple']])}
  ],
  quiz:[
    {q:'Which piece of equipment do you use to crush food?',options:['Pestle and mortar','Bunsen burner','Test tube rack','Filter paper'],answer:0},
    {q:'Why use <b>distilled</b> water to make a food solution?',options:['It is pure water that contains no other chemical substances','It is warmer','It contains nutrients','It changes colour'],answer:0},
    {q:'Iodine turns <b>blue-black</b>. Which nutrient is present?',options:['Starch','Sugar','Protein','Lipid'],answer:0},
    {q:'What must you do in the sugar test that you don\'t do in the others?',options:['Heat the test tube in a water bath','Add ethanol','Rub on filter paper','Add iodine'],answer:0},
    {q:'Benedict\'s solution turns ______ if sugar is present.',options:['orange-red','blue-black','purple','cloudy'],answer:0},
    {q:'Copper sulfate and sodium hydroxide turn purple. The food contains…',options:['protein','starch','sugar','lipids'],answer:0},
    {q:'A student pours the ethanol into water and it turns cloudy. This shows…',options:['lipids are present','starch is present','there is no lipid','protein is present'],answer:0},
    {q:'Which test is best for a solid piece of cheese to check for lipids?',options:['Rub it on filter paper and hold it up to the light','Iodine','Benedict\'s','Copper sulfate'],answer:0},
    {type:'order',q:'Put the <b>sugar test</b> steps in order.',items:['Crush the food and mix with distilled water','Add a few drops of Benedict\'s solution','Heat in a water bath','Look for an orange-red colour']},
    {q:'Iodine stays orange-yellow. What does this tell you?',options:['There is no starch in the food','There is lots of starch','There is sugar','The test was too hot'],answer:0}
  ],
  apply:[
    {scenario:'A student wants to find out which nutrients are in a gingerbread biscuit.',question:'Explain in detail how she would test a gingerbread-biscuit solution for starch, sugar and protein.',marks:6,
      chain:['Make solution','Split into 3 tubes','One test each','Colour = result'],
      model:'Crush the biscuit with a pestle and mortar and mix with distilled water. Put some solution into three test tubes. Starch: add iodine; if it turns from orange-yellow to blue-black, starch is present. Sugar: add Benedict\'s solution and heat in a water bath; orange-red means sugar. Protein: add copper sulfate then sodium hydroxide; purple means protein.',
      points:['Crush with pestle and mortar + distilled water','Iodine → blue-black = starch','Benedict\'s + heat in water bath','Orange-red = sugar','Copper sulfate + sodium hydroxide','Purple = protein']},
    {scenario:'A student wants to test crisps. She will use a hot water bath and ethanol.',question:'Suggest two safety precautions she should take.',marks:2,
      hints:['Think about eyes, heat and flames.'],
      model:'Wear eye protection (goggles) in case chemicals splash. Keep ethanol away from flames because it is flammable. (Also: take care with the hot water bath; don\'t eat the food in the lab.)',
      points:['Wear eye protection / goggles','Ethanol away from flames OR care with hot water / don\'t eat food']},
    {scenario:'You want to find out which nutrients are in your breakfast cereal.',question:'Describe how to prepare a food solution of a breakfast cereal.',marks:3,
      model:'Crush the cereal using a pestle and mortar. Add a few drops of distilled water. Mix well.',
      points:['Crush the food with a pestle and mortar','Add a few drops of (distilled) water','Mix well']},
    {scenario:'A student has made a solution of crisps.',question:'Describe how the student should test the food solution for protein.',marks:3,
      model:'Add a few drops of copper sulfate solution to the food solution. Then add a few drops of sodium hydroxide solution. If the solution turns purple, the crisps contain protein.',
      points:['Add copper sulfate solution','Add sodium hydroxide solution','Turns purple = protein']}
  ]
};

const L3 = {
  id:'l3', code:'8.4.3', short:'Unhealthy diet', icon:'⚖️', title:'Unhealthy diet',
  colour:'linear-gradient(135deg,#e0702a,#d6455d)',
  hook:'Too much food, too little food, or the wrong food can all damage your health. It comes down to balance.',
  goals:['Recall how you get and use energy','Describe health problems of an unbalanced diet','Calculate energy needs'],
  keywords:[
    {word:'Malnourishment',e:'🍽️',def:'Eating the wrong amount or the wrong types of food. Can make you overweight OR underweight.'},
    {word:'Starvation',e:'🥄',def:'An extreme case of not eating enough food.'},
    {word:'Obese',e:'📈',def:'Extremely overweight.'},
    {word:'Deficiency',e:'❗',def:'Not having enough of a certain vitamin or mineral. Can damage health.'},
    {word:'Kilojoule (kJ)',e:'🔋',def:'Unit for energy in food. 1 kJ = 1000 joules (J).'},
    {word:'Rickets',e:'🦴',def:'Weak bones caused by a lack of vitamin D.'},
    {word:'Night blindness',e:'🌙',def:'Can\'t see clearly in dim light, caused by a lack of vitamin A.'}
  ],
  summary:[
    ['🔋','You need energy for everything, even sleeping! It comes from food and is measured in <b>joules (J)</b> or <b>kilojoules (kJ)</b>. 1 kJ = 1000 J. Food labels tell you the energy.'],
    ['⬇️','<b>Energy in &lt; energy used</b> → you lose body mass → <b>underweight</b>. Problems: <b>poor immune system</b>, <b>lack energy / tired</b>, <b>lack of vitamins or minerals</b>. Extreme = <b>starvation</b>.'],
    ['⬆️','<b>Energy in &gt; energy used</b> → you gain body mass, stored as <b>fat under the skin</b> → overweight or <b>obese</b>. Increased risk of <b>heart disease, stroke, type 2 diabetes, some cancers</b>.'],
    ['❗','<b>Deficiency</b> = not enough of a vitamin or mineral. No vitamin A → <b>night blindness</b>. No vitamin D → <b>rickets</b> (weak bones).'],
    ['🏃','Energy needs depend on <b>age</b> (growth), <b>body size</b> and <b>how active you are</b>. More exercise = more energy needed.'],
    ['🔺','In the <b>food pyramid</b> the biggest part of your diet should be <b>carbohydrate</b>-based; lipids, oils and sweets only in very small amounts.']
  ],
  memory:'Think of a <b>see-saw</b>: food energy on one side, energy used on the other. Too heavy on the food side → gain mass. Too light → lose mass.',
  widgets:[
    {title:'Energy balance',icon:'⚖️',intro:'Move the sliders. What happens to body mass?',render:W.balance},
    {title:'Who needs the most energy?',icon:'📊',intro:'Daily energy needs for different people. <b style="background:#fde68a;padding:0 .3em">These are only estimates</b>, read by eye from the textbook graph. They are not exact values.',render:W.chart},
    {title:'Causes of health problems',icon:'🕵️',intro:'Match the problem to its cause.',render:(el,U)=>U.matcher(el,[
      ['Can\'t see well in dim light (night blindness)','Not enough vitamin A'],['Weak bones (rickets)','Not enough vitamin D'],['Higher risk of heart disease and type 2 diabetes','Eating more energy than you use'],['Tired, poor immune system','Eating less energy than you use'],['Constipation','Not enough fibre']])}
  ],
  quiz:[
    {q:'Energy in food is measured in…',options:['kilojoules (kJ)','kilograms (kg)','litres','degrees'],answer:0},
    {type:'fill',q:'1 kilojoule = ______ joules.',answers:['1000','1,000','one thousand']},
    {q:'If the energy you eat is <b>more</b> than the energy you use, you will…',options:['gain body mass','lose body mass','stay exactly the same','get rickets'],answer:0},
    {q:'Which is <b>NOT</b> an increased risk for an obese person?',options:['Night blindness','Heart disease','Type 2 diabetes','Stroke'],answer:0,explain:'Night blindness is caused by a lack of vitamin A.'},
    {q:'Which is a problem caused by being underweight?',options:['Poor immune system','Too much fat under the skin','Stroke','Type 2 diabetes'],answer:0},
    {q:'A lack of vitamin D can cause…',options:['rickets','night blindness','constipation','obesity'],answer:0},
    {q:'Being overweight and being underweight are both caused by…',options:['malnourishment','deficiency of water','exercise','food tests'],answer:0},
    {q:'Who needs the most energy per day?',options:['A male construction worker','A child aged 5–11','A female office worker','A male office worker'],answer:0,explain:'The more exercise you do, the more energy your body requires.'},
    {q:'Which three things affect how much energy you need?',options:['Age, body size and how active you are','Hair colour, height and eye colour','Only what you eat','Only your age'],answer:0},
    {q:'In a healthy food pyramid, the largest part of the diet should be…',options:['carbohydrates','sweets','oils and lipids','vitamins'],answer:0}
  ],
  apply:[
    {scenario:'A female office worker needs <b style="background:#fde68a;padding:0 .3em">about 10 000 kJ</b> a day. When she becomes pregnant she needs <b style="background:#fde68a;padding:0 .3em">about 13 000 kJ</b> a day. <b style="background:#fde68a;padding:0 .3em">(Estimates read from the graph, not exact.)</b>',question:'Use the graph values to calculate the extra energy she needs each day.',marks:2,
      model:'Extra energy = 13 000 − 10 000 = <b>about 3000 kJ</b> per day (an estimate, because the graph values are estimates).',
      points:['Subtracts: 13 000 − 10 000','3000 kJ']},
    {scenario:'A man works in an office and needs <b style="background:#fde68a;padding:0 .3em">about 11 000 kJ</b> a day. He starts a new job as a construction worker and now needs <b style="background:#fde68a;padding:0 .3em">about 16 000 kJ</b> a day. <b style="background:#fde68a;padding:0 .3em">(Estimates read from the graph, not exact.)</b>',question:'Calculate the percentage increase in his daily energy needs.',marks:4,
      chain:['Increase = new − old','÷ old','× 100'],
      hints:['Percentage increase = (increase ÷ original) × 100'],
      model:'Increase = 16 000 − 11 000 = 5000 kJ. 5000 ÷ 11 000 = 0.4545… × 100 = <b>about 45%</b>. Construction work is much more physically active, so he uses more energy.',
      points:['Increase = 5000 kJ','Divide by 11 000 (the original)','× 100','≈ 45%']},
    {scenario:'A doctor sees a child whose bones have become weak and whose legs bend, like the photo on page 137 of your textbook.',question:'Name the condition and explain the cause.',marks:3,
      model:'Rickets. It is caused by a vitamin D deficiency. Vitamin D is needed with the mineral calcium to maintain healthy teeth and bones, so without it the bones become weak.',
      points:['Rickets','Lack (deficiency) of vitamin D','Vitamin D + calcium keep bones strong → bones go weak']},
    {scenario:'Your friend says, "Being underweight is healthier than being overweight."',question:'Compare the health problems of being underweight with being overweight. Do you agree?',marks:6,
      model:'Both are caused by malnourishment and both are unhealthy. Underweight: energy in is less than energy used, so the person loses body mass; they lack energy and are tired, have a poor immune system and may have vitamin or mineral deficiencies. Overweight: energy in is more than used, extra is stored as fat under the skin; they have a higher risk of heart disease, stroke, type 2 diabetes and some cancers. So I disagree, neither is healthy; a balanced diet is best.',
      points:['Both caused by malnourishment / both unhealthy','Underweight: energy in < energy used','Underweight: tired, poor immune system','Underweight: vitamin/mineral deficiencies','Overweight: energy in > used, stored as fat','Overweight: heart disease, stroke, type 2 diabetes, cancers']}
  ]
};

const L4 = {
  id:'l4', code:'8.4.4', short:'Digestive system', icon:'🌀', title:'Digestive system',
  colour:'linear-gradient(135deg,#d6455d,#7a5af8)',
  hook:'How does your body get nutrients out of food? Follow a sandwich from mouth to anus.',
  goals:['State what happens during digestion','Describe the main parts of the digestive system','Explain how the small intestine is adapted'],
  keywords:[
    {word:'Digestive system',e:'🌀',def:'A group of organs that work together to break down food. Also called the gut.'},
    {word:'Digestion',e:'✂️',def:'Breaking down large molecules of food into small molecules that can pass into the blood.'},
    {word:'Gullet',e:'⬇️',def:'Tube that carries food from the mouth to the stomach.'},
    {word:'Stomach',e:'🫙',def:'Food is mixed with digestive juices and acid.'},
    {word:'Small intestine',e:'🌀',def:'Juices from liver and pancreas added; digestion is completed; small nutrient molecules pass into the blood.'},
    {word:'Large intestine',e:'💧',def:'Water is absorbed back into the body, leaving faeces.'},
    {word:'Rectum',e:'📦',def:'Stores faeces until they leave the body.'},
    {word:'Anus',e:'⭕',def:'Muscular ring through which faeces pass out of the body.'},
    {word:'Villi',e:'🧽',def:'Tiny structures that stick out of the wall of the small intestine. They give it a big surface area and contain blood capillaries.'}
  ],
  summary:[
    ['✂️','<b>Digestion:</b> large molecules (like lipids and proteins) are broken down into <b>small molecules</b> of nutrients. These pass into the <b>blood</b> and are used by the body.'],
    ['🗺️','<b>Order:</b> mouth → gullet → stomach → small intestine → large intestine → rectum → anus.'],
    ['👄','<b>Mouth:</b> teeth chew food; mixed with saliva. <b>Gullet:</b> food passes down this tube. <b>Stomach:</b> mixed with digestive juices and acid.'],
    ['🌀','<b>Small intestine:</b> juices from the liver and pancreas added, digestion <b>completed</b>, small molecules pass through the wall into the <b>bloodstream</b>.'],
    ['💧','<b>Large intestine:</b> only undigested food gets here; <b>water is absorbed</b> back, leaving <b>faeces</b>. <b>Rectum</b> stores faeces; they leave through the <b>anus</b>.'],
    ['💪','Muscles in the gut wall <b>squeeze food along</b> (like toothpaste). Fibre gives them bulk to push against → prevents constipation.'],
    ['🧽','The small intestine is adapted for absorption: <b>thin wall</b>, <b>villi</b> → <b>big surface area</b>, villi contain <b>blood capillaries</b> to carry nutrients away.']
  ],
  memory:'<b>"My Giraffe Sings Silly Love Rap Anthems"</b> → Mouth, Gullet, Stomach, Small intestine, Large intestine, Rectum, Anus.',
  fact:['','Fantastic fact: unravel your small intestine and it would be about <b>four times taller than you</b>, it is not very small.'],
  widgets:[
    {title:'Name each part',icon:'',intro:'Follow the food through the digestive system. At each stop, type the name of the part. Spelling counts, just like in the test.',render:W.spellJourney},
    {title:'Label the diagram',icon:'',intro:'A diagram like the one in the textbook. Put each label in the right box.',render:W.labelPhoto},
    {title:'How does food move?',icon:'🪥',intro:'You control the muscles in the gut wall. Try a high-fibre meal, then a low-fibre one, and compare.',render:W.peristalsis},
    {title:'Villi and surface area',icon:'',intro:'Grow villi on the wall of the small intestine, then release digested food. How much is absorbed into the blood?',render:(el,U)=>W.villi(el,U)}
  ],
  quiz:[
    {q:'What happens during digestion?',options:['Large food molecules are broken down into small molecules that can pass into the blood','Small molecules are joined into big ones','Food is stored in the body','Water is made from food'],answer:0},
    {q:'Which structure carries food from the mouth to the stomach?',options:['Gullet','Rectum','Small intestine','Anus'],answer:0},
    {q:'Where is water absorbed back into the body?',options:['Large intestine','Stomach','Mouth','Gullet'],answer:0},
    {q:'Where do small nutrient molecules pass into the bloodstream?',options:['Small intestine','Large intestine','Rectum','Stomach'],answer:0},
    {q:'Which organ stores faeces until they leave the body?',options:['Rectum','Anus','Stomach','Large intestine'],answer:0},
    {q:'In the stomach, food is mixed with…',options:['digestive juices and acid','bile only','water only','bacteria that make vitamin K'],answer:0},
    {type:'order',q:'Put the parts of the digestive system in the order food travels.',items:['Mouth','Gullet','Stomach','Small intestine','Large intestine','Rectum','Anus']},
    {q:'How do villi help the small intestine?',options:['They give a big surface area and contain blood capillaries','They make bile','They store faeces','They chew food'],answer:0},
    {q:'How does food move along the gut?',options:['Muscles in the gut wall squeeze it along','Gravity only','It is pumped by the heart','Villi push it'],answer:0},
    {type:'fill',q:'The solid waste of undigested food is called ________.',answers:['faeces','feces']}
  ],
  apply:[
    {scenario:'Your doctor says you should eat more vegetables and wholemeal bread.',question:'Explain why it is important to eat a fibre-rich diet.',marks:3,
      chain:['Fibre adds…','Muscles…','So it prevents…'],
      model:'Fibre is not digested but it adds bulk to the food. The muscles in the gut wall push against this bulk, forcing food along the gut. This helps prevent constipation.',
      points:['Fibre adds bulk to food','Muscles push against it, forcing food along the gut','Helps prevent constipation']},
    {scenario:'Food can only be absorbed in the small intestine before it moves on and leaves the body.',question:'Describe the adaptations of the small intestine to its function.',marks:3,
      model:'1) The wall of the small intestine is thin. 2) It is covered with tiny structures called villi, which stick out of the wall and give it a big surface area. 3) The villi contain blood capillaries to carry away the absorbed food molecules.',
      points:['Thin wall','Villi → big surface area','Blood capillaries carry nutrients away']},
    {scenario:'Look at the diagram of the gut on page 139: the food is squeezed along like toothpaste.',question:'Describe how food moves along the gut.',marks:2,
      model:'Muscles in the wall of the gut squeeze the food along, a bit like squeezing a tube of toothpaste. Fibre adds bulk, and the muscles push against this, forcing the food along.',
      points:['Muscles in the gut wall squeeze / push the food along','They push against the bulk (fibre), forcing food along the gut']},
    {scenario:'You have just eaten a cheese sandwich.',question:'Describe in detail the passage of food through the digestive system, from mouth to anus.',marks:6,
      model:'In the mouth teeth chew the sandwich into small pieces and it mixes with saliva. It travels down the gullet to the stomach, where it is mixed with digestive juices and acid. In the small intestine juices from the liver and pancreas are added, digestion is completed and small nutrient molecules pass through the wall (villi) into the blood. Undigested food goes to the large intestine where water is absorbed, leaving faeces. Faeces are stored in the rectum and leave through the anus.',
      points:['Mouth: chewed by teeth + saliva','Gullet to stomach','Stomach: juices and acid','Small intestine: digestion completed, absorbed into blood','Large intestine: water absorbed, faeces formed','Rectum stores, anus releases']}
  ]
};

const L5 = {
  id:'l5', code:'8.4.5', short:'Enzymes & bacteria', icon:'✂️', title:'Bacteria and enzymes in digestion',
  colour:'linear-gradient(135deg,#1f7a8c,#2fa36b)',
  hook:'Enzymes chop large molecules into small ones, and bacteria in your gut help with digestion too.',
  goals:['Describe the role of enzymes','Describe the role of gut bacteria','Describe how a meal is turned into simple molecules'],
  keywords:[
    {word:'Enzyme',e:'✂️',def:'A special protein that breaks large molecules of nutrients into small molecules.'},
    {word:'Catalyst',e:'⚡',def:'Something that speeds up a reaction without being used up. Enzymes are BIOLOGICAL catalysts.'},
    {word:'Carbohydrase',e:'🍞',def:'Enzyme that breaks down carbohydrates (e.g. starch) into sugar molecules. Found in saliva.'},
    {word:'Protease',e:'🍗',def:'Enzyme that breaks down proteins into amino acids. Works in the stomach and small intestine.'},
    {word:'Lipase',e:'🧈',def:'Enzyme that breaks down lipids into fatty acids and glycerol. Works in the small intestine.'},
    {word:'Bile',e:'💚',def:'Made in the liver. Breaks lipids into small droplets so lipase can work on them more easily.'},
    {word:'Gut bacteria',e:'🦠',def:'Microorganisms in the large intestine. Live on fibre, make vitamins like vitamin K and help break food down.'},
    {word:'Probiotic',e:'🥛',def:'Foods like live yoghurt that contain useful gut bacteria.'}
  ],
  summary:[
    ['🦷','Your <b>teeth</b> begin digestion by breaking food into smaller pieces. The digestive juices in your gut contain <b>enzymes</b>.'],
    ['✂️','<b>Enzymes</b> are special proteins that chop large molecules into the small molecules they are made from. They are <b>biological catalysts</b>, they <b>speed up</b> digestion <b>without being used up</b>.'],
    ['🍞','<b>Carbohydrase:</b> carbohydrates (starch) → <b>sugars</b>. Digested in the <b>mouth</b> (saliva), stomach and small intestine.'],
    ['🍗','<b>Protease:</b> proteins → <b>amino acids</b>. Digested in the <b>stomach</b> and small intestine. Stomach <b>acid</b> helps and <b>kills harmful microorganisms</b>.'],
    ['🧈','<b>Lipase:</b> lipids → <b>fatty acids and glycerol</b>. In the <b>small intestine</b>, helped by <b>bile</b> from the liver, which breaks lipids into small droplets.'],
    ['🦠','<b>Gut bacteria</b> in the large intestine live on <b>fibre</b>, make <b>vitamins</b> such as <b>vitamin K</b> (absorbed into the body) and help break food down. <b>Probiotic</b> foods (live yoghurt) contain these bacteria.']
  ],
  memory:'The enzyme name tells you its food: <b>CARBOHYDR</b>ase → carbohydrates, <b>PROT</b>ease → proteins, <b>LIP</b>ase → lipids. Each enzyme is named after the type of nutrient it breaks down.',
  widgets:[
    {title:'Enzyme workbench',icon:'',intro:'Drag each enzyme onto the large molecule it breaks down. The diagrams are drawn like the ones in your textbook.',render:(el,U)=>W.enzymeBench(el,U)},
    {title:'Bile and lipase',icon:'',intro:'Digest a drop of lipid in the small intestine. Which do you add first?',render:(el,U)=>W.bileLab(el,U)},
    {title:'Where is it digested?',icon:'',intro:'Drag each nutrient onto every part of the gut where it is digested, then check. Fibre is the odd one out: it is not digested, but gut bacteria live on it.',render:(el,U)=>W.digestMap(el,U)}
  ],
  quiz:[
    {q:'What is an enzyme?',options:['A special protein that breaks large molecules into small molecules','A type of bacteria','A vitamin','A large food molecule'],answer:0},
    {q:'Why are enzymes called <b>catalysts</b>?',options:['They speed up digestion without being used up','They are used up in digestion','They slow down digestion','They make food bigger'],answer:0},
    {q:'Protease breaks proteins down into…',options:['amino acids','sugars','fatty acids and glycerol','vitamins'],answer:0},
    {q:'Lipase breaks lipids down into…',options:['fatty acids and glycerol','amino acids','sugars','starch'],answer:0},
    {q:'Which enzyme is in saliva?',options:['Carbohydrase','Lipase','Protease','Bile'],answer:0},
    {q:'What is the job of bile?',options:['Breaks lipids into small droplets so lipase can work more easily','Breaks proteins into amino acids','Kills bacteria','Absorbs water'],answer:0},
    {q:'Where is bile made?',options:['Liver','Stomach','Mouth','Large intestine'],answer:0},
    {q:'Why are gut bacteria important?',options:['They make vitamins like vitamin K and help break food down','They make bile','They chew food','They cause constipation'],answer:0},
    {q:'What do gut bacteria live (feed) on?',options:['Fibre','Bile','Acid','Amino acids'],answer:0},
    {q:'Besides helping digestion, what does stomach acid do?',options:['Kills harmful microorganisms in food','Makes vitamin K','Absorbs water','Turns food blue-black'],answer:0}
  ],
  apply:[
    {scenario:'A yoghurt advert says: "Live yoghurt, good for your gut!"',question:'Explain why live yoghurt should be part of your diet.',marks:3,
      model:'Live yoghurt is a probiotic food, it contains useful gut bacteria. These bacteria live in the large intestine on fibre, make vitamins such as vitamin K that are absorbed into the body, and help to break food down.',
      points:['Contains useful (gut) bacteria / probiotic','Bacteria make vitamins e.g. vitamin K','Help break food down / keep you healthy']},
    {scenario:'You chew a piece of bread.',question:'Explain what happens to the starch in the bread while it is in your mouth.',marks:3,
      chain:['Bread contains…','Saliva contains…','Which makes…'],
      model:'Bread contains starch, a type of carbohydrate. Carbohydrase present in your saliva breaks down the starch in the bread into sugar molecules.',
      points:['Bread contains starch (a carbohydrate)','Saliva contains carbohydrase','Starch is broken down into sugar']},
    {scenario:'Enzymes are special proteins that play a crucial role in digestion.',question:'Describe the role of enzymes in digestion, and explain why enzymes are called catalysts.',marks:3,
      model:'Enzymes break large molecules of nutrients into small molecules. They are biological catalysts: they speed up digestion without being used up.',
      points:['Break large molecules into small molecules','Speed up digestion','Without being used up']},
    {scenario:'Your teacher asks for a summary comparing enzymes and bacteria in digestion.',question:'Compare the roles of enzymes and bacteria in digestion.',marks:4,
      model:'Enzymes are proteins in digestive juices that break large molecules into small molecules: carbohydrase, protease and lipase each break down a different nutrient. Gut bacteria live in the large intestine on the fibre in your diet. They make vitamins such as vitamin K and also help to break food down.',
      points:['Enzymes break large molecules into small molecules','Carbohydrase, protease and lipase break down different nutrients','Bacteria live in the large intestine / on fibre','Bacteria make vitamins (vitamin K) and help break food down']}
  ]
};

Engine.start({
  id:'digestion', subject:'Biology', title:'Digestion',
  lessons:[L1,L2,L3,L4,L5],
  final:{
    intro:'Mix it all together! These questions need ideas from more than one lesson, just like the real assessment.',
    commandWords:[
      ['State / Name','Give a short answer. One word or a phrase is fine.'],
      ['Describe','Say what happens, step by step. No need to say why.'],
      ['Explain','Say what happens AND why. Use "because" or "so".'],
      ['Suggest','Use what you know to work out an answer to something new. There may be more than one right answer!'],
      ['Compare','Say how two things are similar AND different. Use "whereas" or "but".'],
      ['Calculate','Show your working and give the unit (e.g. kJ, %).']
    ],
    apply:[
      {scenario:'Follow a cheese sandwich through your body. Bread = starch, cheese = protein and lipid.',question:'Compare how and where the carbohydrate and the protein are digested.',marks:4,
        model:'Carbohydrate (starch in the bread) is broken down by carbohydrase into sugars, in the mouth (saliva), stomach and small intestine. Protein (in the cheese) is broken down by protease into amino acids, in the stomach and small intestine. Both are broken into small molecules that pass into the blood in the small intestine, but only carbohydrate digestion starts in the mouth.',
        points:['Starch → sugars by carbohydrase','Carbohydrate: mouth, stomach, small intestine','Protein → amino acids by protease','Protein: stomach and small intestine']},
      {scenario:'Explain how lipids in a plate of chips are broken down and digested.',question:'Include where it happens and any substances that help.',marks:3,
        model:'In the small intestine bile (made in the liver) breaks the lipids into small droplets. Lipase then breaks the lipids down into fatty acids and glycerol, which are absorbed into the blood through the villi.',
        points:['Small intestine','Bile breaks lipids into small droplets','Lipase → fatty acids and glycerol']},
      {scenario:'Look at the end-of-topic diagram of the digestive system.',question:'Describe the role of the stomach in digestion.',marks:2,
        model:'In the stomach, food is mixed with digestive juices and acid. Proteins are digested here by protease. Acid in the stomach helps digestion and kills harmful microorganisms in food.',
        points:['Food is mixed with digestive juices and acid','Protease digests protein / acid kills harmful microorganisms']},
      {scenario:'Scientists investigating a new sports bar find: iodine → blue-black; Benedict\'s → orange-red; copper sulfate + sodium hydroxide → purple.',question:'Which nutrients does the bar contain? Which enzymes digest the starch and the protein, and what is each broken down into?',marks:5,
        model:'Iodine turned blue-black, so it contains starch. Benedict\'s turned orange-red, so it contains sugar. The copper sulfate and sodium hydroxide turned purple, so it contains protein. Starch is digested by carbohydrase into sugar molecules. Protein is digested by protease into amino acids.',
        points:['Contains starch (blue-black)','Contains sugar (orange-red)','Contains protein (purple)','Carbohydrase: starch → sugar','Protease: protein → amino acids']}
    ]
  }
});
})();
