/* ===== Topic 1.3 Contact forces, content =====
   Lessons follow the textbook pages 1.3.1–1.3.3. */
(function(){
const W = window.ForcesWidgets, K = window.Kit;

const TONES = {
  pal:{ friction:['#b45309','#fef3c7','#78350f'], drag:['#0284c7','#e0f2fe','#075985'], balance:['#4f46e5','#e0e7ff','#3730a3'],
        spring:['#059669','#d1fae5','#065f46'], squash:['#db2777','#fce7f3','#9d174d'], moment:['#7c3aed','#ede9fe','#5b21b6'], gravity:['#dc2626','#fee2e2','#991b1b'] },
  rules:[ ['friction',/(friction|rough|smooth|lubric|oil|grease|grip)/], ['drag',/(drag|air resist|water resist|streamlin|fluid|parachute)/],
          ['spring',/(stretch|tension|extension|elastic|hooke|linear|spring|bungee)/], ['squash',/(squash|compress|deform|reaction|support|shape)/],
          ['moment',/(moment|pivot|turning|newton metre|see-saw|clockwise)/], ['gravity',/(gravity|centre of mass|topple|weight)/],
          ['balance',/(resultant|equilibrium|balanced|newton|contact force|force)/] ]
};

const L1 = {
  id:'l1', code:'1.3.1', short:'Friction & drag', title:'Friction and drag', ico:'friction', accent:'#2563eb',
  hook:'Slide your finger along the desk. Does it feel smooth or rough? Even really smooth surfaces exert a force.',
  goals:['Sketch the forces when there are contact forces','Describe what happens when the resultant force is zero','Describe what affects friction and drag, and how to reduce them'],
  keywords:[
    {word:'Contact force',t:'balance',def:'A force that acts when surfaces are in contact, e.g. friction and air resistance.'},
    {word:'Newton (N)',t:'balance',def:'The unit forces are measured in.'},
    {word:'Friction',t:'friction',def:'A contact force between two surfaces sliding (or trying to slide) across each other. It grips objects.'},
    {word:'Drag force',t:'drag',def:'The force slowing an object down as it moves through a fluid, such as air or water.'},
    {word:'Air resistance',t:'drag',def:'The drag force on an object moving through air.'},
    {word:'Water resistance',t:'drag',def:'The drag force on an object moving through water.'},
    {word:'Resultant force',t:'balance',def:'The overall force on an object when all the forces are added up.'},
    {word:'Equilibrium',t:'balance',def:'When the resultant force is zero. The object stays still or moves at a steady speed in the same direction.'},
    {word:'Streamlined',t:'drag',def:'Shaped so it reduces air (or water) resistance.'},
    {word:'Lubrication',t:'friction',def:'Using oil or grease to reduce friction.'}
  ],
  summary:[
    ['balance','<b>Friction</b> and <b>air resistance</b> are <b>contact forces</b>: they act when surfaces are in contact. Forces are measured in <b>newtons (N)</b>.'],
    ['friction','Zoom in on a “smooth” surface and you will see it is actually <b>rough</b>. Friction grips objects.'],
    ['friction','Push gently on a book on a table and it may not move. Push harder and it starts to move. Remove the force and the book slows down and stops, because the rough surfaces can no longer move past each other.'],
    ['drag','Moving through a fluid (air or water) gives a <b>drag force</b> that slows you down: <b>air resistance</b> or <b>water resistance</b>. The object has to push the air or water particles out of the way.'],
    ['balance','An object keeps moving at a steady speed (or stays still) unless a <b>resultant force</b> acts. To keep something moving you need a force to cancel out friction or drag.'],
    ['balance','A falling leaf speeds up while its weight is bigger than air resistance. When the resultant force is <b>zero</b> it falls at a <b>steady speed</b> in the same direction: it is in <b>equilibrium</b>.'],
    ['drag','Reduce drag by being <b>streamlined</b>: an Olympic cyclist tucks her arms in. Reduce friction by <b>lubrication</b> with oil or grease.']
  ],
  memory:'Resultant force <b>zero</b> = no change: still stays still, moving keeps a <b>steady speed in the same direction</b>.',
  fact:['','Fantastic fact: in 1995 Fred Rompelberg cycled at 167 mph. He rode behind a lorry, where there was very little air resistance.'],
  widgets:[
    {title:'Push the book',intro:'Push gently, then harder, then let go. When does the book move, and why does it stop?',render:W.pushBook},
    {title:'Falling leaf',intro:'Drag the leaf down. Watch the two forces and the speed.',render:W.leaf},
    {title:'More or less?',intro:'Does each one reduce friction or drag, or increase it? <b>How:</b> press and hold a card, drag it into the right box, then let go.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'less',label:'Less friction or drag',t:'drag'},{id:'more',label:'More friction or drag',t:'friction'}],
      items:[
        {label:'Putting oil or grease on moving parts',bin:'less',why:'this is lubrication'},{label:'A cyclist tucking her arms in close to her body',bin:'less',why:'it makes her more streamlined'},
        {label:'A streamlined shape',bin:'less'},{label:'Cycling right behind a lorry',bin:'less',why:'there is very little air resistance there'},
        {label:'A rough surface instead of a smooth one',bin:'more'},{label:'Opening a parachute',bin:'more',why:'a parachute pushes a lot of air out of the way'},
        {label:'A cyclist sitting upright with arms out wide',bin:'more'},{label:'Wiping the oil off a bike chain',bin:'more'}
      ]})},
    {title:'Spell it',intro:'Read the clue and type the key word. Exact spelling.',render:(el,U)=>K.spell(el,U,[
      {word:'friction',clue:'The contact force that grips objects when surfaces slide across each other.'},
      {word:'air resistance',clue:'The drag force on something moving through air (two words).'},
      {word:'water resistance',clue:'The drag force on something moving through water (two words).'},
      {word:'streamlined',clue:'Shaped to reduce air resistance, like a cyclist tucked in.'},
      {word:'lubrication',clue:'Reducing friction using oil or grease.'},
      {word:'equilibrium',clue:'When the resultant force on an object is zero.'},
      {word:'resultant force',clue:'The overall force when all the forces are added up (two words).'}
    ])}
  ],
  quiz:[
    {q:'What unit are forces measured in?',options:['Newtons (N)','Metres (m)','Kilograms (kg)','Joules (J)'],answer:0},
    {q:'Is friction greater on a rough or a smooth surface?',options:['Rough','Smooth','It is the same','There is no friction on either'],answer:0},
    {q:'You push gently on a book but it doesn’t move. Why?',options:['Friction grips the book and balances your push','There are no forces on the book','The book has no weight','Air resistance is too big'],answer:0},
    {q:'Which is a drag force?',options:['Water resistance','Weight','Magnetic force','Gravity'],answer:0},
    {q:'Why does a moving object feel a drag force in water?',options:['It is in contact with water particles and has to push them out of the way','Water has no particles','Water pulls it down','Water is magnetic'],answer:0},
    {q:'The resultant force on a moving object is zero. What happens?',options:['It keeps moving at a steady speed in the same direction','It stops immediately','It speeds up','It changes direction'],answer:0},
    {q:'A falling leaf’s air resistance becomes equal to its weight. The leaf…',options:['falls at a steady speed','speeds up','stops in mid-air','goes back up'],answer:0},
    {type:'fill',q:'When the resultant force on an object is zero, the object is in ____________.',answers:['equilibrium']},
    {q:'How does an Olympic cyclist reduce air resistance?',options:['Tucks her arms in to be more streamlined','Sits up tall','Wears a parachute','Rides on a rough road'],answer:0},
    {type:'fill',q:'Reducing friction with oil or grease is called ____________.',answers:['lubrication']}
  ],
  apply:[
    {scenario:'Sam pushes a heavy box across a rough floor. When he stops pushing, the box slows down and stops.',question:'Explain why the box stops, and suggest one way to make it easier to push.',marks:3,
      chain:['Which force acts?','Why does it stop?','How to reduce it?'],
      model:'Friction acts between the box and the rough floor, against the motion. When Sam stops pushing, friction is an unbalanced (resultant) force, so the box slows down and stops. He could reduce friction by using a smoother surface or by lubrication (oil or grease).',
      points:['Friction acts between the box and the floor','When he stops pushing, there is a resultant force / friction slows it','Reduce friction: smoother surface / lubrication (oil or grease)']},
    {scenario:'A dolphin swims through water. A surfer paddles through water. A snowboarder jumps through the air.',question:'Name the drag force on each, and explain what causes a drag force.',marks:3,
      model:'The dolphin and the surfer feel water resistance; the snowboarder feels air resistance. A drag force happens because a moving object is in contact with the air or water particles and has to push them out of the way, which slows it down.',
      points:['Dolphin and surfer: water resistance','Snowboarder: air resistance','Object has to push the particles out of the way, which slows it down']},
    {scenario:'A leaf falls from a tree. At first it speeds up. Later it falls at a steady speed.',question:'Use the forces on the leaf to explain both parts.',marks:4,
      chain:['Forces at the start?','What changes?','Forces later?'],
      model:'At first the weight is bigger than the air resistance, so there is a resultant force downwards and the leaf speeds up. As it goes faster the air resistance increases. When air resistance equals weight the resultant force is zero, the leaf is in equilibrium and falls at a steady speed.',
      points:['At first weight is bigger than air resistance','Resultant force down, so it speeds up','Air resistance increases as it speeds up','Air resistance = weight, resultant zero / equilibrium, steady speed']},
    {scenario:'A company wants to compare different materials for making parachutes.',question:'Name three ways they could make it a fair test.',marks:3,
      model:'Keep everything the same except the material: the same size (area) of parachute, the same mass hanging from it, and drop it from the same height. Then time how long each one takes to fall.',
      points:['Same size / area of parachute','Same mass / weight attached','Same height dropped from']}
  ]
};

const L2 = {
  id:'l2', code:'1.3.2', short:'Squash & stretch', title:'Squashing and stretching', ico:'spring', accent:'#059669',
  hook:'Why don’t you fall through the chair you’re sitting on? The chair changes shape, or deforms, when you sit on it. This produces the force that pushes you up.',
  goals:['Describe how forces deform objects','Explain how solid surfaces provide a support force','Use Hooke’s Law and explain what a linear relationship means'],
  keywords:[
    {word:'Deformation',t:'squash',def:'When forces change the shape of an object.'},
    {word:'Compression',t:'squash',def:'What happens when forces squash an object.'},
    {word:'Tension',t:'spring',def:'What happens when forces stretch an object.'},
    {word:'Reaction force',t:'squash',def:'The support force from a chair or the floor, pushing back up on you.'},
    {word:'Extension',t:'spring',def:'The amount that something stretches when you exert a force on it.'},
    {word:'Elastic limit',t:'spring',def:'Stretch a spring past this point and it will not go back to its original length.'},
    {word:'Hooke’s Law',t:'spring',def:'If the extension doubles when you double the force, the object obeys Hooke’s Law.'},
    {word:'Linear relationship',t:'spring',def:'A straight-line graph through the origin (0,0): force and extension are proportional.'}
  ],
  summary:[
    ['squash','Forces can change the shape of objects: this is <b>deformation</b>. Squashing causes <b>compression</b>. Stretching causes <b>tension</b>.'],
    ['squash','The floor is a solid. Its particles are joined strongly by <b>bonds</b> in a regular pattern. Your weight pushes the particles together, the bonds are <b>compressed</b>, and they push back and support you.'],
    ['squash','A support force from a chair or the floor is called the <b>reaction</b> force. Solids only compress a very small amount.'],
    ['spring','Bungee cords, springs and lift cables all stretch when you exert a force. The amount they stretch is the <b>extension</b>.'],
    ['spring','<b>Double</b> the force on a spring and the extension will <b>double</b>. Remove the force and it goes back to its original length.'],
    ['spring','Past its <b>elastic limit</b> a spring will not go back. Trampoline springs are designed never to go past it.'],
    ['spring','<b>Hooke’s Law</b>: extension doubles when force doubles (up to the <b>elastic limit</b>). The graph is a straight line through (0,0): a <b>linear relationship</b>. Not everything does this, e.g. an elastic band or poly(ethene).']
  ],
  memory:'<b>Squash → compression. Stretch → tension.</b> Straight line through zero → Hooke’s Law.',
  fact:['','Foul fact: when a footballer heads a ball, the forces deform both the ball and the footballer’s head.'],
  widgets:[
    {title:'Spring lab',intro:'Hang weights on the spring, plot the graph, then go past the elastic limit and see what happens.',render:W.springLab},
    {title:'Squashed or stretched?',intro:'<b>How:</b> press and hold an example card, drag it into the right box, then let go.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'c',label:'Compression (squashed)',t:'squash'},{id:'t',label:'Tension (stretched)',t:'spring'}],
      items:[
        {label:'A chair when you sit on it',bin:'c'},{label:'The floor under your feet',bin:'c'},{label:'A golf ball when you hit it',bin:'c'},{label:'A tennis ball hitting the ground',bin:'c'},{label:'A football being headed',bin:'c'},
        {label:'A bungee cord as the jumper falls',bin:'t'},{label:'A spring with a weight hanging on it',bin:'t'},{label:'A lift cable',bin:'t'},{label:'The chain of a swing you sit on',bin:'t'},{label:'An elastic band being pulled',bin:'t'}
      ]})},
    {title:'Match the key words',intro:'<b>How:</b> press and hold a description, drag it onto the box beside its key word, then let go.',render:(el,U)=>U.matcher(el,[
      ['Deformation','Forces change the shape of an object'],['Compression','An object is squashed'],['Tension','An object is stretched'],
      ['Reaction force','Support force from a chair or the floor'],['Extension','The amount something stretches'],['Elastic limit','Past this, it won’t go back to its original length']])}
  ],
  quiz:[
    {q:'When forces change the shape of an object it is called…',options:['deformation','extension','friction','equilibrium'],answer:0},
    {q:'When forces squash an object, they cause…',options:['compression','tension','extension','lubrication'],answer:0},
    {q:'A bungee cord being stretched is in…',options:['tension','compression','equilibrium','friction'],answer:0},
    {q:'Why does the floor push up on you?',options:['Your weight compresses the bonds between its particles and they push back','The floor is magnetic','Air pushes you up','The floor has no particles'],answer:0},
    {q:'The support force from a chair or the floor is called the…',options:['reaction force','drag force','magnetic force','weight'],answer:0},
    {q:'A spring obeys Hooke’s Law. You double the force. The extension…',options:['doubles','halves','stays the same','goes back to zero'],answer:0},
    {q:'A spring is 4 cm long. A 3 N force stretches it to 6 cm. What is the extension?',options:['2 cm','6 cm','10 cm','4 cm'],answer:0},
    {q:'That same spring: what would the extension be if you doubled the force to 6 N?',options:['4 cm','2 cm','8 cm','12 cm'],answer:0},
    {type:'fill',q:'Stretch a spring past its ________ limit and it will not go back to its original length.',answers:['elastic']},
    {q:'A force–extension graph is a straight line through (0,0). This shows…',options:['a linear relationship','the elastic limit has been passed','no extension','a non-linear relationship'],answer:0}
  ],
  apply:[
    {scenario:'A tennis ball hits the ground and bounces.',question:'Describe what happens to the ball when it hits the ground, using the key words.',marks:2,
      model:'The force of hitting the ground squashes the ball, so it changes shape: it deforms and is under compression. It then pushes back on the ground and springs back into shape.',
      points:['The ball changes shape / deforms','It is squashed / compression']},
    {scenario:'You stand on a wooden floor. You can’t see anything happening, but the floor pushes you up.',question:'Explain how the floor provides a support force.',marks:3,
      chain:['What is the floor made of?','What does your weight do?','What happens next?'],
      model:'The floor is a solid made of particles joined strongly by bonds in a regular pattern. Your weight pushes the particles together and the bonds are compressed by a very small amount. The bonds push back, giving a support force called the reaction force.',
      points:['Particles joined by bonds','Weight compresses the bonds / pushes particles together','Bonds push back: reaction / support force']},
    {scenario:'Using a spring that obeys Hooke’s Law, you measure an extension of 6 cm with a force of 3 N.',question:'What extension would you expect with 6 N? Explain using Hooke’s Law, and say what would happen if you went past the elastic limit.',marks:3,
      model:'12 cm. The force has doubled, and Hooke’s Law says that if you double the force the extension doubles. If you stretch it past its elastic limit, it will not go back to its original length when the force is removed (and the graph stops being a straight line).',
      points:['12 cm','Double the force, double the extension','Past the elastic limit it won’t go back to its original length']}
  ]
};

const L3 = {
  id:'l3', code:'1.3.3', short:'Turning forces', title:'Turning forces', ico:'moment', accent:'#7c3aed',
  hook:'A tightrope walker uses a long pole to help him balance. How do turning forces keep him up there?',
  goals:['Describe what is meant by a moment','Calculate the moment of a force'],
  keywords:[
    {word:'Pivot',t:'moment',def:'The point something turns around, e.g. the hinge of a door.'},
    {word:'Moment',t:'moment',def:'The turning effect of a force. Moment = force × perpendicular distance from the pivot.'},
    {word:'Newton metres (Nm)',t:'moment',def:'The unit of a moment.'},
    {word:'Law of moments',t:'moment',def:'In equilibrium, the sum of the clockwise moments = the sum of the anticlockwise moments.'},
    {word:'Centre of gravity',t:'gravity',def:'The point where all the weight of an object seems to act. Also called the centre of mass.'},
    {word:'Centre of mass',t:'gravity',def:'Another name for the centre of gravity.'}
  ],
  summary:[
    ['moment','When you open a door you use a <b>turning force</b>. It acts a certain distance from a <b>pivot</b>.'],
    ['moment','The turning effect of a force is called a <b>moment</b>. It depends on the size of the force and how far it is from the pivot.'],
    ['moment','<b>moment (Nm) = force (N) × perpendicular distance from the pivot (m)</b>. Moments are measured in <b>newton metres</b>.'],
    ['moment','<b>Law of moments</b>: when an object is in equilibrium, the sum of the clockwise moments equals the sum of the anticlockwise moments.'],
    ['moment','See-saw: 500 N × 1 m = 500 Nm anticlockwise; 1000 N × 0.5 m = 500 Nm clockwise. The moments are the same, so it balances.'],
    ['gravity','All the weight of an object seems to act through its <b>centre of gravity</b> (centre of mass). Above the pivot: no turning force. To the left or right of the pivot: a turning force.'],
    ['gravity','Tip your chair back too far and the turning force from your weight makes you <b>topple over</b>.']
  ],
  memory:'<b>M = F × d</b>. Balanced when <b>clockwise = anticlockwise</b>.',
  fact:['','Fantastic fact: the world’s largest see-saw is in New York. It is just over 24 metres long and lifts you higher than a house.'],
  widgets:[
    {title:'Balance the see-saw',intro:'Moment = force × distance from the pivot. Make the clockwise and anticlockwise moments equal.',render:W.seesaw},
    {title:'Open the door',intro:'Push the door. In this demo the door is <b>set</b> to open at <b>3.75 Nm</b>: the answer to the textbook example (5 N × 0.75 m).',render:W.door},
    {title:'Tipping a chair',intro:'Lean back too far and you topple. Where is the <b>centre of gravity</b>?',render:W.chair},
    {title:'Spell it',intro:'Read the clue and type the key word. Exact UK spelling.',render:(el,U)=>K.spell(el,U,[
      {word:'pivot',clue:'The point something turns around.'},
      {word:'moment',clue:'The turning effect of a force.'},
      {word:'newton metres',clue:'The unit of a moment (two words).',also:['newton metre']},
      {word:'anticlockwise',clue:'The opposite way to the hands of a clock (one word).'},
      {word:'centre of gravity',clue:'The point where all the weight seems to act (three words).',us:'center of gravity'},
      {word:'perpendicular',clue:'Moment = force × ____________ distance from the pivot.'}
    ])}
  ],
  quiz:[
    {q:'What is the point that something turns around called?',options:['Pivot','Moment','Newton','Extension'],answer:0},
    {q:'What is the unit of a moment?',options:['Newton metres (Nm)','Newtons (N)','Metres (m)','Joules (J)'],answer:0},
    {q:'Which equation is correct?',options:['moment = force × perpendicular distance from the pivot','moment = force ÷ distance','moment = force + distance','moment = distance ÷ force'],answer:0},
    {q:'A girl pushes a door at right angles with 5 N, 0.75 m from the hinge. What is the moment?',options:['3.75 Nm','5.75 Nm','6.67 Nm','0.15 Nm'],answer:0},
    {q:'What does the law of moments say?',options:['In equilibrium, the sum of clockwise moments = the sum of anticlockwise moments','Moments always make things fall over','Clockwise moments are always bigger','Forces have no turning effect'],answer:0},
    {q:'A 500 N person sits 1 m from the pivot. How far from the pivot must a 1000 N person sit on the other side to balance?',options:['0.5 m','1 m','2 m','0.25 m'],answer:0},
    {q:'A see-saw is 2 m long with the pivot in the middle. A 150 N child sits at one end. Where must the 600 N mother sit to balance?',options:['0.25 m from the pivot','1 m from the pivot','0.5 m from the pivot','At the other end'],answer:0,explain:'Child: 150 × 1 = 150 Nm. Mother: 600 × d = 150, so d = 0.25 m.'},
    {q:'Another name for the centre of gravity is the…',options:['centre of mass','pivot','moment','elastic limit'],answer:0},
    {q:'You tip your chair back. When is there NO turning force from your weight?',options:['When the centre of gravity is directly above the pivot','When you sit still on the floor','When the chair is light','Never'],answer:0},
    {type:'fill',q:'The turning effect of a force is called a ________.',answers:['moment']}
  ],
  apply:[
    {scenario:'A girl pushes at right angles to a door with a force of 5 N to close it. The handle is 0.75 m from the hinge.',question:'Calculate the moment of the force. Show your working and give the unit.',marks:2,
      model:'moment = force × perpendicular distance from the pivot = 5 N × 0.75 m = 3.75 Nm.',
      points:['Uses moment = force × distance (5 × 0.75)','3.75 Nm']},
    {scenario:'A mother and daughter are on a see-saw 2 m long, with the pivot in the middle. The mother has a weight of 600 N and the child has a weight of 150 N. The child sits at one end.',question:'Calculate where the mother must sit to balance the child. Show your working.',marks:3,
      chain:['Child’s distance?','Child’s moment?','Mother’s distance?'],
      model:'The pivot is in the middle, so the child is 1 m from the pivot. Child’s moment = 150 N × 1 m = 150 Nm. For balance the mother’s moment must also be 150 Nm, so 600 N × d = 150 Nm, d = 150 ÷ 600 = 0.25 m from the pivot on the other side.',
      points:['Child is 1 m from the pivot: 150 × 1 = 150 Nm','Mother’s moment must equal 150 Nm (law of moments)','d = 150 ÷ 600 = 0.25 m']},
    {scenario:'Jake leans back on his chair, balancing on the back legs. He leans back a little more and falls over.',question:'Use the idea of centre of gravity to explain why he falls.',marks:3,
      model:'All his weight seems to act through his centre of gravity. While it is above the pivot (the back legs) there is no turning force. When he leans back further, the centre of gravity moves to the other side of the pivot, so his weight has a turning force (moment) that tips him backwards and he topples over.',
      points:['Weight acts through the centre of gravity','Above the pivot: no turning force','Past the pivot: weight makes a turning force / moment, so he topples']}
  ]
};

Engine.start({
  id:'contact-forces', subject:'Physics', title:'Contact forces', tones:TONES,
  lessons:[L1,L2,L3],
  final:{
    intro:'Mix it all together. These questions need ideas from more than one lesson, like the real assessment.',
    commandWords:[
      ['State / Name','Give a short answer. One word or a phrase is fine.'],
      ['Describe','Say what happens, step by step. No need to say why.'],
      ['Explain','Say what happens AND why. Use “because” or “so”.'],
      ['Suggest','Use what you know to work out an answer to something new.'],
      ['Sketch','Draw a simple diagram. Label the forces with arrows.'],
      ['Calculate','Show your working and give the unit, e.g. N or Nm.']
    ],
    apply:[
      {scenario:'A bird dives into a lake to catch a fish and moves through the water at a steady speed.',question:'Explain how the bird can be in equilibrium. Name the forces.',marks:3,
        model:'The bird is moving at a steady speed, so the resultant force on it is zero: it is in equilibrium. The forces on it are balanced: the force moving it forward is equal and opposite to the drag force (water resistance) slowing it down.',
        points:['Steady speed means resultant force is zero / equilibrium','Forces are balanced / equal and opposite','Drag force / water resistance acts against it']},
      {scenario:'A bungee jumper falls. The bungee cord stretches as far as it will go, then pulls her back up.',question:'Describe the force in the cord and explain why the cord must not go past its elastic limit.',marks:3,
        model:'The cord is stretched, so it is in tension, and it has an extension. The tension pulls her back up. If the cord went past its elastic limit it would not go back to its original length, so it would no longer work properly and would not be safe.',
        points:['The cord is in tension / stretched','Extension','Past the elastic limit it would not return to its original length']},
      {scenario:'Two apples balance on a ruler on a pivot. The small apple is further from the pivot than the big apple.',question:'Explain why the ruler balances, using the law of moments.',marks:3,
        model:'The ruler is in equilibrium, so the clockwise moment equals the anticlockwise moment. Moment = force × distance. The small apple has less weight but is further from the pivot, and the big apple has more weight but is closer, so their moments are equal.',
        points:['Clockwise moment = anticlockwise moment','Moment = force × distance','Small apple further away / big apple closer, so moments are equal']}
    ]
  }
});
})();
