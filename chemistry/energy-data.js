/* ===== Topic 6.4 Chemical energy, content =====
   Lessons follow the textbook pages 6.4.1–6.4.3. */
(function(){
const W = window.EnergyWidgets, K = window.Kit;

const TONES = {
  pal:{ exo:['#dc2626','#fee2e2','#991b1b'], endo:['#0284c7','#e0f2fe','#075985'], level:['#7c3aed','#ede9fe','#5b21b6'],
        bond:['#059669','#d1fae5','#065f46'], catalyst:['#a16207','#fef3c7','#854d0e'], reaction:['#d97706','#fef3c7','#92400e'], fuel:['#ea580c','#ffedd5','#9a3412'] },
  rules:[ ['endo',/(endotherm|cold pack|takes? in|from the surround|melt|boil)/], ['exo',/(exotherm|combust|burn|hand warmer|gives? out|to the surround|freez|condens)/],
          ['level',/(energy level|diagram|reactant|product)/], ['catalyst',/(catalys|catalytic|platinum|rhodium|exhaust|pollut)/], ['bond',/(bond|atom|molecule)/],
          ['fuel',/(fuel|hydrogen|diesel|methane|coal|wood)/], ['reaction',/(reaction|change|dissolv|chemical|temperature|thermometer|surround)/] ]
};

const L1 = {
  id:'l1', code:'6.4.1', short:'Exo & endo', title:'Exothermic and endothermic', ico:'exo', accent:'#dc2626',
  hook:'How does a cold pack get cold with no fridge? And why does a candle flame feel hot? It is all about which way energy moves.',
  goals:['Describe exothermic and endothermic changes','Use temperature readings to tell them apart'],
  keywords:[
    {word:'Exothermic change',t:'exo',def:'A change that transfers energy TO the surroundings. The temperature of the surroundings goes up.'},
    {word:'Exothermic reaction',t:'exo',def:'A chemical reaction that gives out energy to the surroundings, e.g. combustion (burning).'},
    {word:'Endothermic change',t:'endo',def:'A change that transfers energy FROM the surroundings. The temperature of the surroundings goes down.'},
    {word:'Endothermic reaction',t:'endo',def:'A chemical reaction that takes in energy from the surroundings, e.g. citric acid + sodium hydrogen carbonate.'},
    {word:'Combustion',t:'fuel',def:'Burning. A reaction with oxygen that gives out energy as heat and light. Always exothermic.'}
  ],
  summary:[
    ['reaction','All chemical reactions involve <b>energy transfers</b>. Changes of state and dissolving do too.'],
    ['exo','<b>Exothermic</b>: energy is transferred <b>to</b> the surroundings, so the <b>temperature increases</b>. Examples: combustion, freezing, condensing, some dissolving.'],
    ['endo','<b>Endothermic</b>: energy is transferred <b>from</b> the surroundings, so the <b>temperature decreases</b>. Examples: some reactions, melting, boiling, some dissolving.'],
    ['endo','A <b>cold pack</b>: ammonium nitrate dissolves in water. This takes in energy from the injury, so the injury cools down.'],
    ['endo','Tom mixed citric acid with sodium hydrogen carbonate: the temperature of the mixture fell from 20 °C to <b>10 °C</b>, an <b>endothermic</b> reaction.'],
    ['exo','Zoe mixed sulfuric acid with sodium hydroxide: the temperature of the mixture rose from 20 °C to <b>30 °C</b>, an <b>exothermic</b> reaction.'],
    ['reaction','When the reaction is over, the mixture slowly goes back to room temperature (20 °C).']
  ],
  memory:'<b>EXOthermic</b> = energy goes out, like an <b>exit</b>. <b>ENdothermic</b> = energy goes in, like an <b>entrance</b>.',
  fact:['','Foul fact: you can get frostbite from a cold pack if you use it wrongly. Never leave one on your skin for longer than the pack says.'],
  widgets:[
    {title:'Thermometer lab',intro:'Choose an experiment from the textbook, mix the substances and watch the temperature. Then decide: exothermic or endothermic?',render:W.thermo},
    {title:'Sort the changes',intro:'Drag each change into the right box.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'x',label:'Exothermic: energy out',t:'exo'},{id:'n',label:'Endothermic: energy in',t:'endo'}],
      items:[
        {label:'Burning a candle',bin:'x',why:'combustion gives out heat and light'},{label:'A hand warmer warming up',bin:'x'},{label:'Water freezing into ice',bin:'x',why:'freezing gives out energy'},
        {label:'Steam condensing on a window',bin:'x'},{label:'Sulfuric acid + sodium hydroxide (20 → 30 °C)',bin:'x'},{label:'Calcium chloride dissolving (20 → 35 °C)',bin:'x'},
        {label:'A cold pack on an injury',bin:'n',why:'it takes energy from the injury'},{label:'Ice melting in a drink',bin:'n',why:'melting takes in energy'},{label:'Water boiling in a kettle',bin:'n'},
        {label:'Citric acid + sodium hydrogen carbonate (20 → 10 °C)',bin:'n'},{label:'Potassium chloride dissolving (20 → 10 °C)',bin:'n'}
      ]})},
    {title:'Spell it',intro:'Read the clue and type the key word. The spelling has to be exact, just like in the test.',render:(el,U)=>K.spell(el,U,[
      {word:'exothermic',clue:'A change that transfers energy <b>to</b> the surroundings.'},
      {word:'endothermic',clue:'A change that transfers energy <b>from</b> the surroundings.'},
      {word:'combustion',clue:'Another word for burning.'},
      {word:'thermometer',clue:'The instrument you use to measure temperature.'},
      {word:'temperature',clue:'What goes <b>down</b> during an endothermic change.'}
    ])}
  ],
  quiz:[
    {q:'In an <b>exothermic</b> change, energy is transferred…',options:['to the surroundings','from the surroundings','into the thermometer only','nowhere, it is destroyed'],answer:0},
    {q:'In an <b>endothermic</b> change, the temperature of the surroundings…',options:['decreases','increases','stays the same','doubles'],answer:0},
    {q:'Which of these is an <b>exothermic</b> change?',options:['Combustion of a fuel','Melting ice','Boiling water','A cold pack working'],answer:0},
    {q:'Which of these is an <b>endothermic</b> change?',options:['Melting','Freezing','Condensing','Burning'],answer:0,explain:'Melting and boiling take in energy. Freezing and condensing give it out.'},
    {q:'Tom mixes citric acid and sodium hydrogen carbonate. The temperature of the mixture goes from 20 °C to 10 °C. The reaction is…',options:['endothermic','exothermic','not a chemical reaction','neither'],answer:0},
    {q:'Zoe mixes dilute sulfuric acid with sodium hydroxide. The temperature of the mixture goes from 20 °C to 30 °C. What does this show?',options:['The reaction is exothermic','The reaction is endothermic','Energy was taken in from the surroundings','The thermometer is broken'],answer:0},
    {type:'fill',q:'A cold pack contains ammonium nitrate and water. When they mix, the pack gets cold. This is an ________ change.',answers:['endothermic']},
    {q:'After an exothermic reaction finishes, what happens to the temperature of the mixture?',options:['It slowly returns to room temperature','It keeps rising forever','It drops below 0 °C','It stays hot forever'],answer:0},
    {q:'Calcium chloride dissolves in water and the temperature goes from 20 °C to 35 °C. Sodium hydrogen carbonate dissolves in water and the temperature goes from 20 °C to 15 °C. Which would be best in a <b>hand warmer</b>?',options:['Calcium chloride','Sodium hydrogen carbonate','Both are the same','Neither changes temperature'],answer:0,explain:'Calcium chloride dissolving is exothermic: it gives out energy, so it warms your hands.'},
    {type:'fill',q:'An easy way to remember: EXOthermic, energy goes out like an e___.',answers:['exit']}
  ],
  apply:[
    {scenario:'Amir twists his ankle playing football. The coach squeezes a cold pack and holds it on the ankle. Inside, ammonium nitrate dissolves in water.',question:'Explain how the cold pack cools the ankle.',marks:3,
      chain:['What type of change?','Which way does energy move?','So what happens to the ankle?'],
      hints:['Does the pack get hotter or colder when it is used?'],
      model:'Dissolving ammonium nitrate in water is endothermic. Energy is transferred from the surroundings (the injured ankle) to the mixture in the pack. So the ankle loses energy and its temperature goes down, which helps it feel better.',
      points:['Dissolving ammonium nitrate is endothermic','Energy transferred from the ankle / surroundings into the pack','So the temperature of the ankle decreases']},
    {scenario:'A company makes hand warmers for walkers and cold packs for sports teams. Their data (temperature of the water before → after dissolving): potassium chloride 20 → 10 °C; calcium chloride 20 → 35 °C; sodium hydrogen carbonate 20 → 15 °C; sodium carbonate 20 → 24 °C.',question:'Choose one substance for the hand warmer and one for the cold pack. Justify your choices.',marks:4,
      chain:['Which ones warm up?','Which warms the most?','Which ones cool down?','Which cools the most?'],
      model:'Hand warmer: calcium chloride, because it dissolves exothermically and has the biggest temperature rise (+15 °C), so it transfers the most energy to your hands. Cold pack: potassium chloride, because it dissolves endothermically and has the biggest fall (−10 °C), so it takes in the most energy from the injury.',
      points:['Hand warmer: calcium chloride','It is exothermic / biggest temperature rise (+15 °C)','Cold pack: potassium chloride','It is endothermic / biggest temperature fall (−10 °C)']},
    {scenario:'You hold a glass of drink with ice cubes in it. The glass feels cold and the ice slowly melts.',question:'Is melting ice exothermic or endothermic? Explain why the glass feels cold.',marks:3,
      hints:['Where does the ice get the energy it needs to melt from?'],
      model:'Melting is endothermic. The ice takes in energy from its surroundings: the drink, the glass and your hand. Energy is transferred away from your hand, so the glass feels cold.',
      points:['Melting is endothermic','Ice takes in energy from the surroundings / drink / glass','Energy leaves your hand so it feels cold']},
    {scenario:'Marcus burns some ethanol under a beaker of water. The water gets hotter.',question:'Is burning ethanol exothermic or endothermic? Use his observation to explain.',marks:2,
      model:'It is exothermic. Combustion transfers energy to the surroundings, and we know this because the temperature of the water (part of the surroundings) increases.',
      points:['Exothermic','Energy transferred to the water / surroundings, so the temperature rises']}
  ]
};

const L2 = {
  id:'l2', code:'6.4.2', short:'Energy diagrams', title:'Energy level diagrams', ico:'level', accent:'#7c3aed',
  hook:'An ice cube melts as energy is transferred from the drink. A simple diagram can show which store of energy is bigger, before and after.',
  goals:['Tell from a diagram if a change is exothermic or endothermic','Use diagrams to explain energy changes'],
  keywords:[
    {word:'Energy level diagram',t:'level',def:'A diagram showing the relative energy stored in the reactants and the products.'},
    {word:'Reactants',t:'level',def:'The substances at the start of a reaction. Drawn on the left of the diagram.'},
    {word:'Products',t:'level',def:'The substances made in a reaction. Drawn on the right of the diagram.'},
    {word:'Exothermic diagram',t:'exo',def:'Products LOWER than reactants. Arrow points DOWN. Energy given out to the surroundings.'},
    {word:'Endothermic diagram',t:'endo',def:'Products HIGHER than reactants. Arrow points UP. Energy taken in from the surroundings.'},
    {word:'MJ/kg',t:'fuel',def:'Megajoules per kilogram: how much energy 1 kg of fuel transfers when it burns. Negative (−) means exothermic.'}
  ],
  summary:[
    ['level','An <b>energy level diagram</b> shows the energy stored in the <b>reactants</b> (left) and the <b>products</b> (right). The vertical axis is energy, the horizontal axis is progress of reaction.'],
    ['exo','<b>Exothermic</b>: products are <b>lower</b> than reactants. The arrow points <b>down</b>: energy is given out to the surroundings.'],
    ['endo','<b>Endothermic</b>: products are <b>higher</b> than reactants. The arrow points <b>up</b>: energy is taken in from the surroundings.'],
    ['endo','<b>Melting</b> ice: liquid water stores more energy than ice, so melting is <b>endothermic</b>. Forces between water molecules are disrupted.'],
    ['exo','<b>Freezing</b> water: ice stores less energy, so water gives out energy as it freezes. Freezing is <b>exothermic</b>.'],
    ['fuel','Burning 1 kg of <b>hydrogen</b>: −142 MJ/kg. Burning 1 kg of <b>diesel</b>: −45 MJ/kg. Exothermic changes have <b>negative</b> values, endothermic changes have <b>positive</b> values.']
  ],
  memory:'Products go <b>down</b>, energy goes <b>out</b> (exo). Products go <b>up</b>, energy goes <b>in</b> (endo).',
  fact:['','Fantastic fact: hydrogen gives out about three times as much energy per kilogram as diesel, and the only product is water.'],
  widgets:[
    {title:'Build the diagram',intro:'Read the change, decide if it gives out or takes in energy, then drag the purple products line up or down to match.',render:W.levelBuilder},
    {title:'Compare fuels',intro:'Burn 1 kg of each fuel on the same energy level diagram. The lower the products line, the more energy is given out.',render:W.fuels},
    {title:'Read the diagram',intro:'Drag each clue into the box for the type of change it shows.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'x',label:'Exothermic',t:'exo'},{id:'n',label:'Endothermic',t:'endo'}],
      items:[
        {label:'Products lower than reactants',bin:'x'},{label:'Arrow points down',bin:'x'},{label:'Energy change is negative (−)',bin:'x'},{label:'Temperature of surroundings rises',bin:'x'},{label:'Liquid water → ice',bin:'x'},
        {label:'Products higher than reactants',bin:'n'},{label:'Arrow points up',bin:'n'},{label:'Energy change is positive (+)',bin:'n'},{label:'Temperature of surroundings falls',bin:'n'},{label:'Ice → liquid water',bin:'n'}
      ]})}
  ],
  quiz:[
    {q:'On an energy level diagram, what is on the vertical axis?',options:['Energy','Time in seconds','Temperature only','Mass'],answer:0},
    {q:'The products are drawn <b>lower</b> than the reactants. The change is…',options:['exothermic','endothermic','neither','impossible to tell'],answer:0},
    {q:'In an endothermic reaction, which has more energy?',options:['The products','The reactants','They have the same','The catalyst'],answer:0},
    {q:'Why is melting ice endothermic?',options:['Energy is taken in to disrupt the forces holding the water molecules in a pattern','Energy is given out as the ice melts','The ice gets colder','Water molecules are destroyed'],answer:0},
    {q:'Which arrow shows an <b>exothermic</b> change on an energy level diagram?',options:['An arrow pointing down from reactants to products','An arrow pointing up from reactants to products','A flat arrow','No arrow at all'],answer:0},
    {q:'The energy change for burning 1 kg of hydrogen is −142 MJ/kg. The minus sign tells you it is…',options:['exothermic','endothermic','a mistake','a physical change'],answer:0},
    {q:'Per kilogram, which fuel transfers more energy to the surroundings when it burns?',options:['Hydrogen (−142 MJ/kg)','Diesel (−45 MJ/kg)','They are the same','You cannot tell'],answer:0},
    {type:'fill',q:'Freezing water gives out energy to the surroundings. Freezing is ________.',answers:['exothermic']},
    {q:'A fuel table: coal 33 MJ/kg, methane 56 MJ/kg, wood 21 MJ/kg. Which transfers the <b>most</b> energy per kg?',options:['Methane','Coal','Wood','All the same'],answer:0},
    {type:'order',q:'Put these fuels in order, <b>most</b> energy per kilogram first.',items:['Hydrogen (142 MJ/kg)','Methane (56 MJ/kg)','Diesel (45 MJ/kg)','Coal (33 MJ/kg)','Wood (21 MJ/kg)']}
  ],
  apply:[
    {scenario:'An energy level diagram shows “state at beginning” drawn low and “state at end” drawn higher up. It is for a liquid turning into a gas.',question:'Does the diagram show boiling or condensing? Explain your answer.',marks:3,
      chain:['Is the end higher or lower?','Energy in or out?','Which change takes energy in?'],
      model:'It shows boiling. The end state (gas) is higher than the beginning state, so it stores more energy. Energy must be taken in from the surroundings, so the change is endothermic, and boiling is endothermic (condensing is exothermic).',
      points:['Boiling','End state higher / more energy than beginning','Energy taken in, so endothermic']},
    {scenario:'Sam says: “Freezing water makes things colder, so freezing must be endothermic.”',question:'Use an energy level diagram idea to explain why Sam is wrong.',marks:3,
      hints:['Which stores more energy: liquid water or ice?'],
      model:'Ice stores less energy than liquid water, so on an energy level diagram the products (ice) are lower than the reactants (water). The arrow points down, which means energy is given out to the surroundings. So freezing is exothermic, not endothermic.',
      points:['Ice has less energy than liquid water / products lower','Arrow points down / energy given out to the surroundings','So freezing is exothermic']},
    {scenario:'A family is choosing a fuel to heat their house. Data per kg: coal 33 MJ, methane (natural gas) 56 MJ, wood 21 MJ.',question:'Compare the data and suggest which fuel to choose. Give one other factor they should think about.',marks:3,
      model:'Methane transfers the most energy per kg (56 MJ), about 1.7 times as much as coal and over 2.5 times as much as wood, so they would need less of it. Other factors: cost, whether it is renewable (wood is, gas and coal are not), how much pollution or carbon dioxide it makes, and how easy it is to store or deliver.',
      points:['Methane gives out the most energy per kg','Compares numbers (e.g. 56 vs 33 vs 21)','Another factor: cost / pollution / renewable / storage']}
  ]
};

const L3 = {
  id:'l3', code:'6.4.3', short:'Bond energies', title:'Bond energies', ico:'bond', accent:'#059669',
  hook:'Every year UK cars must pass an exhaust emissions test. Hot engines make nitrogen and oxygen react. Why does that need so much energy?',
  goals:['State what happens to bonds in exothermic and endothermic reactions','Use bond energies to explain energy changes'],
  keywords:[
    {word:'Chemical bond',t:'bond',def:'A strong force that holds atoms together in molecules.'},
    {word:'Bond energy',t:'bond',def:'The energy needed to break a bond. Measured in kJ/mol. Some bonds are stronger than others.'},
    {word:'Bond breaking',t:'endo',def:'Takes IN energy from the surroundings. Always endothermic.'},
    {word:'Bond making',t:'exo',def:'Gives OUT energy to the surroundings. Always exothermic.'},
    {word:'Catalyst',t:'catalyst',def:'A substance that speeds up a chemical reaction but is unchanged at the end.'},
    {word:'Catalytic converter',t:'catalyst',def:'Part of a car exhaust. Metals such as platinum and rhodium act as catalysts to turn harmful gases into less harmful ones.'}
  ],
  summary:[
    ['bond','In a molecule, strong forces called <b>chemical bonds</b> hold the atoms together. The energy needed to break a bond is its <b>bond energy</b>.'],
    ['endo','<b>Bond breaking</b> takes in energy: it is <b>endothermic</b>.'],
    ['exo','<b>Bond making</b> gives out energy: it is <b>exothermic</b>.'],
    ['exo','<b>Exothermic</b> reaction: energy to break bonds is <b>less than</b> energy released making new bonds.'],
    ['endo','<b>Endothermic</b> reaction: energy to break bonds is <b>more than</b> energy released making new bonds.'],
    ['bond','H₂ + Cl₂ → 2HCl: break 436 + 243 = <b>679 kJ/mol</b>. Make 2 × 432 = <b>864 kJ/mol</b>. 679 &lt; 864, so it is <b>exothermic</b>.'],
    ['catalyst','N₂ + O₂ → 2NO happens in hot car engines (endothermic). A <b>catalytic converter</b> uses <b>platinum</b> and <b>rhodium</b> as <b>catalysts</b> to make exhaust gases less harmful.']
  ],
  memory:'<b>Break = take</b> (energy in). <b>Make = give</b> (energy out). Whichever is bigger wins.',
  widgets:[
    {title:'Bond energy calculator',intro:'Three steps: break the bonds (energy in), make new bonds (energy out), then compare the two.',render:W.bonds},
    {title:'Match the key words',intro:'Drag each description onto its word.',render:(el,U)=>U.matcher(el,[
      ['Chemical bond','Force that holds atoms together in a molecule'],['Bond energy','Energy needed to break a bond (kJ/mol)'],
      ['Bond breaking','Endothermic: energy taken in'],['Bond making','Exothermic: energy given out'],
      ['Catalyst','Speeds up a reaction but is unchanged at the end'],['Catalytic converter','Makes harmful exhaust gases less harmful']])},
    {title:'Spell it',intro:'Read the clue and type the word. Exact spelling.',render:(el,U)=>K.spell(el,U,[
      {word:'catalyst',clue:'A substance that speeds up a reaction but is unchanged at the end.'},
      {word:'catalytic converter',clue:'The part of a car exhaust that makes harmful gases less harmful (two words).'},
      {word:'chemical bond',clue:'A strong force that holds atoms together in a molecule (two words).'},
      {word:'platinum',clue:'A metal used as a catalyst in a catalytic converter. It starts with p.'},
      {word:'nitrogen monoxide',clue:'The pollutant, formula NO, made in a hot car engine (two words).'},
      {word:'molecule',clue:'A group of atoms held together by bonds, e.g. H₂.'}
    ])}
  ],
  quiz:[
    {q:'What is a chemical bond?',options:['A strong force that holds atoms together','A type of reaction','A unit of energy','A gas made in car engines'],answer:0},
    {q:'Breaking bonds is…',options:['endothermic','exothermic','neither','both at the same time'],answer:0},
    {q:'Making bonds is…',options:['exothermic','endothermic','neither','impossible'],answer:0},
    {q:'A reaction is <b>exothermic</b> if the energy needed to break bonds is…',options:['less than the energy released making new bonds','more than the energy released making new bonds','exactly zero','the same as the mass'],answer:0},
    {q:'The H–H bond energy is 436 kJ/mol and Cl–Cl is 243 kJ/mol. How much energy is needed to break both?',options:['679 kJ/mol','193 kJ/mol','864 kJ/mol','436 kJ/mol'],answer:0},
    {type:'fill',q:'Making the bonds in 2HCl releases 2 × 432 = ____ kJ/mol.',answers:['864']},
    {q:'Why does nitrogen react with oxygen in a car engine, but not in the air around you?',options:['The hot engine supplies the energy needed to break their bonds','The air has no oxygen','Nitrogen is a catalyst','Car engines are cold'],answer:0},
    {q:'What is a catalyst?',options:['A substance that speeds up a reaction but is unchanged at the end','A substance that is used up in a reaction','A type of fuel','A bond that never breaks'],answer:0},
    {q:'Which metals act as catalysts in a catalytic converter?',options:['Platinum and rhodium','Iron and copper','Sodium and calcium','Gold and silver'],answer:0},
    {q:'H₂ + F₂ → 2HF. Break: 436 + 158 = 594 kJ/mol. Make: 2 × 562 = 1124 kJ/mol. The reaction is…',options:['exothermic','endothermic','neither','cannot tell'],answer:0,explain:'Less energy goes in breaking bonds (594) than comes out making them (1124).'}
  ],
  apply:[
    {scenario:'Hydrogen reacts with chlorine: H₂ + Cl₂ → 2HCl. Bond energies: H–H 436 kJ/mol, Cl–Cl 243 kJ/mol, H–Cl 432 kJ/mol.',question:'Use the bond energies to show that this reaction is exothermic.',marks:4,
      chain:['Energy to break','Energy released by making','Compare','Conclusion'],
      hints:['There are two H–Cl bonds in 2HCl.'],
      model:'Energy needed to break bonds = 436 + 243 = 679 kJ/mol. Energy released making bonds = 2 × 432 = 864 kJ/mol. Less energy is needed to break the bonds than is released when new bonds form, so overall energy is given out and the reaction is exothermic.',
      points:['Break: 436 + 243 = 679','Make: 2 × 432 = 864','Breaking needs less energy than making releases','So it is exothermic / energy given out']},
    {scenario:'Hydrogen reacts with fluorine: H₂ + F₂ → 2HF. Bond energies: H–H 436 kJ/mol, F–F 158 kJ/mol, H–F 562 kJ/mol.',question:'Predict whether this reaction is exothermic or endothermic. Show your working.',marks:4,
      model:'Break: 436 + 158 = 594 kJ/mol. Make: 2 × 562 = 1124 kJ/mol. 594 is less than 1124, so more energy is released than taken in. The reaction is exothermic.',
      points:['Break: 436 + 158 = 594','Make: 2 × 562 = 1124','594 is less than 1124','Exothermic']},
    {scenario:'Every year UK cars must pass an exhaust emissions test. Inside a hot engine, nitrogen and oxygen from the air react to make nitrogen monoxide, NO, which harms health and the environment.',question:'Explain why this reaction happens in the engine but not in normal air, and how a catalytic converter helps.',marks:4,
      chain:['What must happen to the bonds first?','Where does the energy come from?','What does the converter contain?'],
      model:'The bonds in nitrogen and oxygen molecules must be broken first, which needs energy (bond breaking is endothermic, and this reaction is endothermic overall). The hot engine supplies this energy; at normal temperatures there is not enough. A catalytic converter contains metals such as platinum and rhodium that act as catalysts, speeding up reactions that turn harmful exhaust gases into less harmful substances.',
      points:['Bonds in nitrogen / oxygen must be broken','Breaking bonds needs energy / endothermic','Hot engine supplies the energy','Catalytic converter: platinum / rhodium catalysts make gases less harmful']}
  ]
};

Engine.start({
  id:'chemical-energy', subject:'Chemistry', title:'Chemical energy', tones:TONES,
  lessons:[L1,L2,L3],
  final:{
    intro:'Mix it all together. These questions need ideas from more than one lesson, like the real assessment.',
    commandWords:[
      ['State / Name','Give a short answer. One word or a phrase is fine.'],
      ['Describe','Say what happens, step by step. No need to say why.'],
      ['Explain','Say what happens AND why. Use “because” or “so”.'],
      ['Suggest','Use what you know to work out an answer to something new.'],
      ['Compare','Say how two things are similar AND different. Use “whereas” or “but”.'],
      ['Calculate','Show your working and give the unit, e.g. kJ/mol or MJ/kg.']
    ],
    apply:[
      {scenario:'Marcus wants to find out which fuel makes water hotter: ethanol or propanol. He burns each fuel in turn under a beaker of water and measures how hot the water gets.',question:'State whether combustion is exothermic or endothermic and explain. Name the independent variable and two variables he must keep the same.',marks:5,
        model:'Combustion is exothermic: it transfers energy to the surroundings, so the water gets hotter. He changes the type of fuel, so that is the independent variable. He must keep the same: the volume (or mass) of water, the starting temperature of the water, the mass of fuel burned (or burning time), and the distance from flame to beaker. This makes it a fair test.',
        points:['Exothermic','Energy transferred to the water / surroundings, temperature rises','Independent variable: type of fuel','Control: volume / mass of water','Control: mass of fuel / time / starting temperature / distance']},
      {scenario:'An energy level diagram shows a substance dissolving in water. The solution is drawn higher than the solute and solvent.',question:'Is the dissolving exothermic or endothermic? Suggest whether the process would be better in a hand warmer or a cold pack. Justify your answer.',marks:3,
        model:'The products (solution) are higher than the reactants, so the solution stores more energy. Energy is taken in from the surroundings: it is endothermic. It would be better for a cold pack, because it takes energy from the injury and cools it.',
        points:['Products / solution higher, so more energy','Endothermic, energy taken in from surroundings','Cold pack, because it cools the injury']},
      {scenario:'Methane burns: CH₄ + 2O₂ → CO₂ + 2H₂O. It is exothermic.',question:'Explain, in terms of bonds, why burning methane gives out energy. Sketch in words what its energy level diagram looks like.',marks:4,
        model:'Bonds in methane and oxygen are broken, which takes in energy. New bonds in carbon dioxide and water are made, which gives out energy. More energy is given out making the new bonds than is taken in breaking the old ones, so overall energy is given out. On the energy level diagram the products (carbon dioxide + water) are lower than the reactants (methane + oxygen), with an arrow pointing down.',
        points:['Breaking bonds takes in energy','Making bonds gives out energy','More energy released making than needed breaking','Diagram: products lower than reactants / arrow down']}
    ]
  }
});
})();
