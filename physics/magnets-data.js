/* ===== Big Idea 2: Magnetism & electromagnets, content =====
   Lessons follow the textbook pages 2.3.1, 2.4.1 and 2.4.2 (pages 36–42). */
(function(){
const W = window.MagnetWidgets, K = window.Kit;

const TONES = {
  pal:{ magnet:['#dc2626','#fee2e2','#991b1b'], field:['#2563eb','#dbeafe','#1e40af'], compass:['#0d9488','#ccfbf1','#115e59'],
        electro:['#b45309','#fef3c7','#78350f'], device:['#7c3aed','#ede9fe','#5b21b6'], material:['#475569','#e2e8f0','#1e293b'] },
  rules:[ ['compass',/(compass|earth|navigat|north|south)/], ['field',/(field|line|non-contact|force)/],
          ['electro',/(electromagnet|solenoid|coil|current|core|turns)/], ['device',/(bell|breaker|loudspeaker|earphone|armature|switch|reset)/],
          ['material',/(iron|steel|cobalt|nickel|magnetic material|magnetise|aluminium)/], ['magnet',/(magnet|pole|repel|attract)/] ]
};

const L1 = {
  id:'l1', code:'2.3.1', short:'Magnets & fields', title:'Magnets and magnetic fields', ico:'magnet', accent:'#dc2626',
  hook:'With a magnet you can make something move without even touching it. How?',
  goals:['Describe how magnets interact','Describe how magnetic field diagrams tell you about the direction and strength of a magnetic field','Explain observations about navigation using the Earth’s magnetic field'],
  keywords:[
    {word:'Magnet',t:'magnet',def:'Has two magnetic poles: a north-seeking pole and a south-seeking pole.'},
    {word:'Magnetic poles',t:'magnet',def:'The two ends of a magnet: north-seeking and south-seeking. Like poles repel, unlike poles attract.'},
    {word:'Magnetic field',t:'field',def:'The region around a magnet where a magnetic material feels a force.'},
    {word:'Magnetic force',t:'field',def:'The force on iron, steel, cobalt or nickel in a magnetic field. It is a non-contact force.'},
    {word:'Magnetic field lines',t:'field',def:'Lines that show the magnetic field. They go from the north pole to the south pole, and are closer together where the field is stronger.'},
    {word:'Permanent magnet',t:'magnet',def:'A magnet that has its own magnetic field.'},
    {word:'Magnetic material',t:'material',def:'Iron, steel, cobalt or nickel. It feels a force in a magnetic field.'}
  ],
  summary:[
    ['magnet','A <b>magnet</b> has two <b>magnetic poles</b>: a north-seeking pole and a south-seeking pole. <b>Like poles repel, unlike poles attract.</b>'],
    ['material','Iron, steel, cobalt and nickel are <b>magnetic</b>. In a <b>magnetic field</b> they feel a <b>magnetic force</b>. It is a <b>non-contact force</b>, and it is stronger the closer you are to the magnet.'],
    ['field','You can draw <b>magnetic field lines</b>. They go from the <b>north pole to the south pole</b>. They are like elastic bands that try to straighten, which helps explain attraction and repulsion.'],
    ['field','Find the shape of a field with <b>plotting compasses</b> or <b>iron filings</b>. The needle of a compass lines up with the field. Field lines <b>closer together</b> = a <b>stronger</b> field.'],
    ['field','The magnetic field around any magnet gets <b>weaker</b> as you move away. There is also a magnetic field around a wire with a current flowing in it.'],
    ['compass','A hanging magnet lines up pointing north to south, because it is in the magnetic field of the <b>Earth</b>. The Earth’s field is the same shape as that of a big <b>bar magnet</b>, with the south pole at the top of the planet.'],
    ['compass','People have used compasses to navigate for thousands of years. A compass needle is a small magnet that lines up with the Earth’s magnetic field.']
  ],
  memory:'<b>Like poles repel, unlike poles attract.</b>',
  fact:['','Fantastic fact: the Earth’s magnetic field keeps flipping. About 500 000 years ago the magnetic north pole was actually the south pole.'],
  widgets:[
    {title:'Two magnets',intro:'Turn the magnets round and watch them move. Which poles <b>attract</b>, which <b>repel</b>?',render:W.twoMagnets},
    {title:'Plot the field',intro:'Find the shape of the <b>magnetic field</b> two ways, like the textbook: with a <b>plotting compass</b> and with <b>iron filings</b>.',render:W.compassPlot},
    {title:'Attract or repel?',intro:'<b>How:</b> press and hold a card, drag it into Attract or Repel, then let go.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'att',label:'Attract',t:'field'},{id:'rep',label:'Repel',t:'magnet'}],
      items:[
        {label:'North-seeking pole and south-seeking pole',bin:'att',why:'unlike poles attract'},
        {label:'North-seeking pole and north-seeking pole',bin:'rep',why:'like poles repel'},
        {label:'South-seeking pole and south-seeking pole',bin:'rep',why:'like poles repel'},
        {label:'South-seeking pole and north-seeking pole',bin:'att',why:'unlike poles attract'},
        {label:'A magnet and a steel paper clip',bin:'att',why:'steel is a magnetic material'},
        {label:'A magnet and iron filings',bin:'att',why:'iron is a magnetic material'}
      ]})},
    {title:'Spell it',intro:'Read the clue and type the key word. Exact spelling.',render:(el,U)=>K.spell(el,U,[
      {word:'magnetic field',clue:'The region around a magnet where a magnetic material feels a force (two words).'},
      {word:'repel',clue:'What two like poles do.'},
      {word:'attract',clue:'What two unlike poles do.'},
      {word:'permanent magnet',clue:'A magnet that has its own magnetic field (two words).'},
      {word:'compass',clue:'Its needle is a small magnet that lines up with the Earth’s field.'},
      {word:'nickel',clue:'Iron, steel, cobalt and ______ are magnetic.'}
    ])}
  ],
  quiz:[
    {q:'Name the two poles of a magnet.',options:['North-seeking and south-seeking','Positive and negative','Top and bottom','Iron and steel'],answer:0},
    {q:'What happens when two north-seeking poles are brought together?',options:['They repel','They attract','Nothing','They stick together'],answer:0},
    {q:'What happens when a north-seeking pole and a south-seeking pole are brought together?',options:['They attract','They repel','Nothing','They spin'],answer:0},
    {q:'Which list contains only magnetic materials?',options:['Iron, steel, cobalt, nickel','Iron, copper, steel, nickel','Aluminium, steel, cobalt, iron','Steel, nickel, tungsten, copper'],answer:0},
    {q:'Magnetic force is a…',options:['non-contact force','contact force','drag force','type of friction'],answer:0},
    {q:'Which way do magnetic field lines go?',options:['From the north pole to the south pole','From the south pole to the north pole','Round in a circle inside the magnet','Straight out from the middle'],answer:0},
    {q:'Where is the magnetic field strongest?',options:['Where the field lines are closest together','Where the field lines are furthest apart','Far away from the magnet','It is the same everywhere'],answer:0},
    {q:'Which two things can you use to find the shape of a magnetic field?',options:['Plotting compasses and iron filings','A ruler and a thermometer','Copper wire and a battery','A newtonmeter and a spring'],answer:0},
    {q:'Why does a hanging magnet line up pointing north–south?',options:['It is in the magnetic field of the Earth','The Sun pulls it','Gravity pulls it north','The air pushes it'],answer:0},
    {type:'fill',q:'The Earth’s magnetic field is the same shape as that of a big ______ magnet.',answers:['bar']}
  ],
  apply:[
    {scenario:'Copy and complete: Magnets have a ______ pole and a ______ pole. Two poles that are the same will ______ and two poles that are different will ______. The ______ of a ______ lines up in the magnetic field of a magnet.',question:'Write the six missing words, in order.',marks:6,
      model:'north-seeking; south-seeking; repel; attract; needle; compass.',
      points:['north(-seeking)','south(-seeking)','repel','attract','needle','compass']},
    {scenario:'A compass always points in the same direction, wherever you point it in a room.',question:'Explain why.',marks:2,
      model:'The needle of the compass is a small magnet. It lines up with the magnetic field of the Earth, so it always points north–south.',
      points:['The needle is a (small) magnet','It lines up with the Earth’s magnetic field']},
    {scenario:'You are given some plotting compasses, some iron filings, a sheet of paper and a bar magnet.',question:'State two ways to find out the shape of a magnetic field, and say how the diagram shows where the field is strongest.',marks:3,
      model:'Use plotting compasses, or sprinkle iron filings around the magnet. The field is strongest where the field lines are closest together.',
      points:['Plotting compasses','Iron filings','Field lines closer together = stronger field']}
  ]
};

const L2 = {
  id:'l2', code:'2.4.1', short:'Electromagnets', title:'Electromagnets', ico:'electro', accent:'#b45309',
  hook:'Permanent magnets are fun, but you can’t turn them off. An electromagnet you can.',
  goals:['Describe how to make an electromagnet','Use a diagram to explain how to make an electromagnet and how to change its strength','Describe how the strength of an electromagnet changes with distance'],
  keywords:[
    {word:'Solenoid',t:'electro',def:'Lots of loops of wire wound together to make a coil.'},
    {word:'Electromagnet',t:'electro',def:'A solenoid with a current flowing through it. You can turn it on and off.'},
    {word:'Core',t:'material',def:'A magnetic material in the centre of the coil. It makes the electromagnet much stronger.'},
    {word:'Magnetise',t:'material',def:'To make a material into a magnet. Iron is easy to magnetise but loses its magnetism easily.'}
  ],
  summary:[
    ['field','A wire with an electric current flowing through it has a <b>magnetic field</b> around it. The field lines are <b>circles</b>. In a circular loop of wire, the field lines at the centre are straight.'],
    ['electro','The field around one loop isn’t very strong. Wind lots of loops together to make a coil, called a <b>solenoid</b>. If a current flows through it you have an <b>electromagnet</b>.'],
    ['electro','You can turn an electromagnet <b>on and off</b>: the field is only produced when the current is flowing. You cannot turn a permanent magnet off.'],
    ['material','A <b>core</b> of magnetic material in the centre makes it much stronger. <b>Iron</b> is easy to <b>magnetise</b> but loses its magnetism easily. <b>Steel</b> is hard to magnetise but keeps it, so a steel core stays magnetic when you turn the current off.'],
    ['electro','To make it <b>stronger</b>: more <b>turns</b> of wire on the coil, a bigger <b>current</b>, and a core of <b>magnetic material</b> (iron or steel).'],
    ['field','The field around a solenoid is the same shape as the field around a bar magnet. Its strength <b>decreases with distance</b>, just like the electric field and gravitational field.']
  ],
  memory:'Stronger electromagnet: <b>more turns, more current, iron core</b>.',
  fact:['','Fantastic fact: the strongest magnet is an electromagnet that produces a magnetic field 10 million times stronger than the Earth’s magnetic field.'],
  widgets:[
    {title:'Mixed up electromagnets',intro:'The textbook’s results table. Change <b>one</b> thing, switch on, count the paper clips.',render:W.buildEM},
    {title:'Which field shape?',intro:'<b>How:</b> press and hold a description, drag it onto the box beside the thing it belongs to, then let go.',render:(el,U)=>U.matcher(el,[
      ['A straight wire with a current','Circular field lines around the wire'],
      ['A circular loop of wire','Field lines at the centre are straight'],
      ['A solenoid with a current','Same shape as the field of a bar magnet'],
      ['The Earth','Same shape as a big bar magnet, south pole at the top']
    ])},
    {title:'Spell it',intro:'Read the clue and type the key word. Exact UK spelling.',render:(el,U)=>K.spell(el,U,[
      {word:'solenoid',clue:'Lots of loops of wire wound together to make a coil.'},
      {word:'electromagnet',clue:'A coil of wire with a current flowing through it.'},
      {word:'core',clue:'The magnetic material in the centre of the coil.'},
      {word:'magnetise',clue:'Make something into a magnet. Iron is easy to ______.',us:'magnetize'},
      {word:'current',clue:'The field is only produced when this is flowing in the wire.'}
    ])}
  ],
  quiz:[
    {q:'What is the shape of the magnetic field lines around a straight wire carrying a current?',options:['Circles','Straight lines','Zigzags','There is no field'],answer:0},
    {type:'fill',q:'Lots of loops of wire wound together to make a coil is called a ________.',answers:['solenoid']},
    {q:'When is the magnetic field of an electromagnet produced?',options:['Only when the current is flowing','All the time','Only when it is cold','Only when it touches iron'],answer:0},
    {q:'What are most cores made of?',options:['Iron','Copper','Aluminium','Plastic'],answer:0},
    {q:'Why would a steel core be a bad choice for an electromagnet you want to switch off?',options:['Steel keeps its magnetism, so it would still be magnetic','Steel is not magnetic','Steel melts','Steel stops the current'],answer:0},
    {q:'Which change makes an electromagnet stronger?',options:['More turns of wire on the coil','Fewer turns of wire','Less current','Taking the core out'],answer:0},
    {q:'In the textbook table, 10 coils at 3 V with an iron core picked up 8 paper clips. With 4.5 V it picked up…',options:['12','8','4','0'],answer:0,explain:'More current flowing in the wire makes a stronger electromagnet: 12 paper clips.'},
    {q:'An electromagnet with an aluminium core picked up 0 paper clips. Why?',options:['Aluminium is not a magnetic material','Aluminium is too heavy','There was no current','The coils were too long'],answer:0},
    {q:'How does the strength of an electromagnet change as you move away from it?',options:['It decreases','It increases','It stays the same','It doubles'],answer:0},
    {q:'The field around a solenoid is the same shape as the field around…',options:['a bar magnet','a straight wire','a single loop','nothing'],answer:0}
  ],
  apply:[
    {scenario:'You have a nail, a piece of wire, crocodile clips, leads and a battery.',question:'Describe how to use them to make an electromagnet.',marks:2,
      model:'Wrap (coil) the wire around the iron nail lots of times. Connect the ends of the wire to the battery with the leads and crocodile clips so that a current flows through the coil.',
      points:['Wrap / coil the wire around the nail','Connect it to the battery so a current flows']},
    {scenario:'A student wants to make an electromagnet that can lift more paper clips.',question:'State three things that affect the strength of an electromagnet.',marks:3,
      model:'The number of turns (loops) of wire on the coil, the size of the current flowing in the wire, and the type of core (a magnetic material such as iron).',
      points:['Number of turns / loops on the coil','The current','The type of core / magnetic material']},
    {scenario:'Electromagnets usually have an iron core. Someone suggests using a steel core instead.',question:'Explain why a steel core would not work well if you want to turn the electromagnet off.',marks:2,
      model:'Steel is hard to magnetise but keeps its magnetism. So when you turn the current off, the steel core would still be magnetic and you could not turn the electromagnet off. Iron is easy to magnetise but loses its magnetism easily.',
      points:['Steel keeps its magnetism','Still magnetic when the current is off / can’t turn it off']}
  ]
};

const L3 = {
  id:'l3', code:'2.4.2', short:'Using electromagnets', title:'Using electromagnets', ico:'bell', accent:'#7c3aed',
  hook:'High-speed trains that use electromagnets can go faster than a Formula 1 car. They don’t have an engine. How do they work?',
  goals:['Explain why you choose an electromagnet rather than a permanent magnet for a purpose','Describe how electric bells, circuit breakers and loudspeakers work'],
  keywords:[
    {word:'Electric bell',t:'device',def:'A circuit with an electromagnet, a switch and a battery. A ‘make and break’ switch keeps it ringing.'},
    {word:'Circuit breaker',t:'device',def:'A safety device that switches off a circuit if the current is too large. It is a resettable switch.'},
    {word:'Loudspeaker',t:'device',def:'A coil, a cone and a magnet. The changing current makes the cone move in and out to make sound.'}
  ],
  summary:[
    ['device','Press a doorbell switch and you complete a circuit. The <b>electric bell</b> contains an <b>electromagnet</b> that attracts the <b>iron armature</b>, which hits the bell.'],
    ['device','When the armature moves it <b>breaks the circuit</b>, so the current stops. The electromagnet is no longer magnetic, the <b>springy metal strip</b> returns, and the circuit is complete again. This <b>make and break</b> switch keeps the bell ringing until you let go.'],
    ['device','A large current in a faulty device could injure you. A <b>circuit breaker</b> stops this: a big current makes the electromagnet strong enough to attract the <b>iron catch</b>, which breaks the circuit. It stays off until you push the <b>reset</b> switch.'],
    ['device','Earphones contain tiny <b>loudspeakers</b>. The changing current flows in a coil, which becomes an electromagnet. A magnet repels and attracts it, so the <b>cone</b> moves in and out and makes sound.'],
    ['electro','<b>Electromagnet or permanent magnet?</b> You can turn electromagnets <b>on and off</b>, and make them <b>much stronger</b>. A small permanent magnet works as a fridge magnet, but you need an electromagnet to lift a car.']
  ],
  memory:'Bell: <b>attract → break → spring back → make</b>, again and again.',
  fact:['','Remember: there is a board in your house with lots of circuit breakers, near your electricity meter. Do not touch the circuit breakers!'],
  widgets:[
    {title:'Label the bell',intro:'<b>How:</b> press and hold a label, drag it into the empty box that points at that part of the bell, then let go.',render:W.bellLabel},
    {title:'Ring the bell',intro:'Hold the bell push and watch the <b>make and break</b> switch keep the bell ringing.',render:W.bellSim},
    {title:'Circuit breaker',intro:'Make the current bigger and watch the <b>electromagnet</b> pull on the <b>iron catch</b>.',render:W.breaker},
    {title:'Permanent or electromagnet?',intro:'Which kind of magnet is used? <b>How:</b> press and hold a card, drag it into the right box, then let go.',render:(el,U)=>U.sorter(el,{
      bins:[{id:'perm',label:'Permanent magnet',t:'magnet'},{id:'em',label:'Electromagnet',t:'electro'}],
      items:[
        {label:'A fridge magnet',bin:'perm',why:'a small permanent magnet is fine'},
        {label:'A compass needle',bin:'perm',why:'it is a small magnet that lines up with the Earth’s field'},
        {label:'Lifting a car in a scrap yard',bin:'em',why:'it needs to be very strong and to let go of the car'},
        {label:'An electric bell',bin:'em',why:'it has to switch on and off to make and break the circuit'},
        {label:'A circuit breaker',bin:'em'},
        {label:'Removing a steel splinter from a patient’s eye',bin:'em',why:'doctors have used electromagnets for this'}
      ]})}
  ],
  quiz:[
    {q:'In an electric bell, what does the electromagnet attract?',options:['The iron armature','The battery','The springy metal strip','The switch'],answer:0},
    {q:'What happens when the armature moves towards the electromagnet?',options:['It breaks the circuit, so the current stops','It makes the current bigger','It turns the battery off','Nothing'],answer:0},
    {q:'What brings the armature back to its original position?',options:['The springy metal strip','The electromagnet','Gravity only','The battery'],answer:0},
    {q:'What keeps an electric bell ringing?',options:['The ‘make and break’ switch','A permanent magnet','The reset button','A loudspeaker'],answer:0},
    {q:'What is a circuit breaker for?',options:['To switch off a circuit if the current is too large','To make a bell ring','To make sound','To make a current bigger'],answer:0},
    {q:'In a circuit breaker, what does the electromagnet attract when the current is large?',options:['The iron catch','The reset button','The battery','The bell'],answer:0},
    {q:'How do you turn a circuit breaker back on?',options:['Push the reset switch','Wait for it to cool','Turn the current up','Shake it'],answer:0},
    {q:'What three things are inside an earphone?',options:['A coil, a cone and a magnet','A bell, a battery and a switch','An iron catch and a spring','A compass and a core'],answer:0},
    {q:'Why does a loudspeaker cone move in and out?',options:['A magnet repels and attracts the coil, which is an electromagnet','The air pushes it','The battery shakes it','It is on a spring'],answer:0},
    {q:'Which is a reason to choose an electromagnet instead of a permanent magnet?',options:['You can turn it on and off','It never needs a current','It is always weaker','It works without a coil'],answer:0}
  ],
  apply:[
    {scenario:'Copy and complete: In an electric bell, circuit breaker, or loudspeaker a coil of wire becomes an ______ when a current flows. A bell contains a ‘make or break’ circuit that makes the bell ______. A circuit breaker is like a ______: you can ______ it. In a loudspeaker the ______ magnet and electromagnet ______ to make a cone move in and out.',question:'Write the six missing words, in order.',marks:6,
      model:'electromagnet; ring; switch; reset; permanent; repel and attract.',
      points:['electromagnet','ring','switch','reset','permanent','repel and attract']},
    {scenario:'Electric bells and circuit breakers both use electromagnets.',question:'Describe one similarity and one difference between an electric bell and a circuit breaker.',marks:2,
      model:'Similarity: both contain an electromagnet that attracts a piece of iron (the armature or the catch), which breaks the circuit. Difference: the bell’s circuit makes again by itself so it keeps ringing, but the circuit breaker stays off until you press the reset button.',
      points:['Similarity: both have an electromagnet that attracts iron / breaks the circuit','Difference: breaker stays off until reset / bell keeps making and breaking']},
    {scenario:'A scrap yard uses a crane with a big magnet to lift up cars.',question:'Explain why electromagnets are used to lift up cars in a scrap yard.',marks:2,
      model:'An electromagnet can be made much stronger than a permanent magnet, so it can lift a car. You can also turn it off, so it lets go of the car where you want it.',
      points:['Electromagnets can be much stronger','You can turn it off to drop the car']}
  ]
};

Engine.start({
  id:'magnetism', subject:'Physics', title:'Magnetism & electromagnets', tones:TONES,
  lessons:[L1,L2,L3],
  final:{
    intro:'Mix it all together. A <b>selection</b> of the textbook’s End-of-Big-Idea questions (not all of them).',
    commandWords:[
      ['State / Name','Give a short answer. One word or a phrase is fine.'],
      ['Describe','Say what happens, step by step. No need to say why.'],
      ['Explain','Say what happens AND why. Use “because” or “so”.'],
      ['Suggest','Use what you know to work out an answer to something new.'],
      ['Draw','Draw a clear diagram. Field lines need arrows from N to S.']
    ],
    apply:[
      {scenario:'Two pairs of bar magnets. In diagram A they are placed S N | S N, so a north-seeking pole faces a south-seeking pole. In diagram B they are placed N S | S N, so two south-seeking poles face each other.',question:'Describe what would happen to the magnets in diagrams A and B.',marks:2,
        model:'A: the poles facing each other are different (unlike), so the magnets attract. B: the poles facing each other are the same (like), so the magnets repel.',
        points:['A: unlike poles, so they attract','B: like poles, so they repel']},
      {scenario:'A surgeon wants to use a magnet to remove metal splinters from a patient’s eye.',question:'Suggest and explain whether the surgeon should use an electromagnet or a permanent magnet, and one problem the surgeon might have.',marks:4,
        model:'An electromagnet, because it can be made much stronger and it can be turned on and off, so the surgeon can control it. One problem: the splinter must be a magnetic material (such as steel or iron); a splinter of another metal would not be attracted.',
        points:['Electromagnet','Explain one benefit: controlled on/off or a stronger magnet','Problem: the splinter must be a magnetic material','Explain the problem: non-magnetic metal would not be attracted / removed']},
      {scenario:'Electromagnets have lots of uses.',question:'Copy and complete: An electric bell is like a loudspeaker because… A circuit breaker is like an electric bell because…',marks:2,
        model:'An electric bell is like a loudspeaker because both contain a coil of wire that becomes an electromagnet when a current flows. A circuit breaker is like an electric bell because in both the electromagnet attracts a piece of iron, which breaks the circuit.',
        points:['Both contain a coil / electromagnet','The electromagnet attracts iron and breaks the circuit']},
      {scenario:'People have used compasses to navigate for thousands of years.',question:'Explain how you navigate with a compass.',marks:2,
        model:'The compass needle is a small magnet. It lines up with the Earth’s magnetic field and points north, so you can tell which direction you are going.',
        points:['The needle lines up with the Earth’s magnetic field','It points north, so you know your direction']}
    ]
  }
});
})();
