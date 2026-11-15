// Regression tests for the physics "Apply it" marking loopholes (non-Hooke questions only).
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function load(base) {
  const c = {svgIcon: () => ''}; c.window = c;
  c[base === 'forces' ? 'ForcesWidgets' : 'MagnetWidgets'] = new Proxy({}, {get: () => () => {}});
  c.Kit = new Proxy({}, {get: () => () => {}});
  vm.createContext(c);
  const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c);
  run('assets/engine.js'); c.Engine.start = t => { c.topic = t; };
  run(`physics/${base}-data.js`); run(`physics/${base}-marks.js`);
  c.q = (lesson, index) => (lesson === 'final' ? c.topic.final : c.topic.lessons.find(l => l.id === lesson)).apply[index];
  c.mark = (lesson, index, answer) => {
    const q = c.q(lesson, index);
    return [...c.Engine.markAnswer(answer, c.MARKS[lesson][index], (q.scenario + ' ' + q.question).replace(/<[^>]+>/g, ' ')).map(r => r.ok)];
  };
  return c;
}
const forces = load('forces'), magnets = load('magnets');
const total = r => r.filter(Boolean).length;

// [lesson, index, correct paraphrases (full marks), [wrong answer, expected per-point result]...]
const cases = {
  forces: [
    ['l1', 0, ['Friction acts against the box. When Sam stops pushing there is a resultant force backwards so it slows down and stops. Put oil on the floor.',
      'Friction between the box and the floor slows it down and stops it. He could put wheels on the box.'], [
      ['Friction acts. The box stops because friction pushes it forward. Use oil.', [false, false, true]],
      ['The box stops because friction is balanced. Use oil.', [true, false, true]],
      ['Friction acts against the box. When he stops pushing, the forces are balanced so it slows down. Make the floor smoother.', [true, false, true]],
      ['friction resultant lubrication', [false, false, true]]]],
    ['l1', 1, ['Dolphin: water resistance. Surfer: water resistance. Snowboarder: air resistance. Drag happens because the object has to push the particles out of the way.',
      'The dolphin and surfer feel water resistance and the snowboarder feels air resistance. The object hits the particles of air or water and pushes them out of the way.'], [
      ['The dolphin feels air resistance and the snowboarder feels water resistance. Particles push it.', [false, false, true]],
      ['Dolphin: air resistance. Surfer: air resistance. Snowboarder: water resistance. It pushes particles out of the way.', [false, false, true]]]],
    ['l1', 2, ['At first the weight is bigger than the air resistance so it speeds up. As it gets faster the air resistance increases. When the air resistance equals the weight it falls at a steady speed.',
      'At the start air resistance is smaller than weight, so there is a resultant force down and the leaf accelerates. The air resistance grows. Then the forces are balanced and the speed is constant.'], [
      ['At first air resistance is bigger than weight so it speeds up. The air resistance increases. Later air resistance is smaller than weight and the leaf falls at steady speed.', [false, false, true, false]],
      ['Air resistance is bigger than weight so it speeds up. Then weight bigger than air resistance and it is steady.', [false, false, false, false]],
      ['The weight is smaller than air resistance so it accelerates, air resistance decreases, steady speed.', [false, false, false, false]]]],
    ['l1', 3, ['Keep the area of the parachute, the mass and the drop height the same.',
      'Use the same size parachute, hang the same weight on it and drop it from the same height.'], []],
    ['l3', 0, ['Moment = force x distance = 5 x 0.75 = 3.75 Nm', '5 N × 0.75 m = 3.75 N m', '0.75 times 5 = 3.75 newton metres'], [
      ['5 + 0.75 = 3.75 Nm', [false, true]],
      ['moment = force + distance = 5 + 0.75 = 3.75 Nm', [false, true]],
      ['moment = force x distance. 5 / 0.75 = 3.75 Nm', [false, true]],
      ['moment = distance / force = 0.75/5 = 3.75 Nm', [false, true]],
      ['moment = force divided by distance, 5 x 0.75 = 3.75 Nm', [false, true]],
      ['5 x 0.75 = 3.75 Nm. Moment = force / distance.', [false, true]],
      ['moment = force / distance = 5 / 0.75 = 6.67 Nm', [false, false]]]],
    ['l3', 1, ['Child: 150 x 1 = 150 Nm. The moments must be equal, so 600 x d = 150, d = 0.25 m.',
      'The child is 1 m from the pivot so her moment is 150 N × 1 m = 150 Nm. For balance the mother’s moment is the same. d = 150 ÷ 600 = 0.25 m.',
      'Child moment = 150 x 1 = 150 Nm. Mother must also make 150 Nm, 150 / 600 = 25 cm from the pivot.'], [
      ['Child 150 x 1 = 150 Nm. Mother 600 x d = 150, d = 0.25 cm.', [true, true, false]],
      ['Child 150 x 1 = 150 Nm. Mother 600 x 2 = 1200. The moments are equal. d = 0.25 m', [true, false, false]],
      ['Child moment 150 x 1 = 150 Nm, equal, so d = 600/150 = 4 m, or 0.25 m', [true, true, false]],
      ['Child 150 x 1 = 150 Nm. Moments equal. d = 150 ÷ 600 = 0.25 m but she sits on the same side', [true, true, false]],
      ['150 N 1 m balance 0.25 m', [false, true, false]]]],
    ['l3', 2, ['His weight acts through his centre of gravity. When it is above the back legs there is no turning force. When he leans back it goes past the pivot so his weight has a moment and he topples.',
      'The centre of gravity is above the pivot so there is no turning force. When he leans back further the centre of gravity moves behind the pivot and there is a turning force that tips him over.'], [
      ['The centre of gravity is above the pivot so there is a turning force, so he falls.', [true, false, false]],
      ['Centre of gravity above the pivot gives a turning force and he topples.', [true, false, false]],
      ['centre of gravity above pivot topple', [true, false, false]]]],
    ['final', 0, ['It moves at a steady speed so the resultant force is zero. The forward force and the water resistance are equal and opposite.'], []],
    ['final', 2, ['The clockwise moment equals the anticlockwise moment. Moment = force x distance. The small apple is lighter but further from the pivot and the big apple is heavier but closer.',
      'Clockwise moment = anticlockwise moment. Moment is force times distance. The heavy apple is nearer the pivot so the light apple has to be further away.'], [
      ['Clockwise moment = anticlockwise moment. Moment = force / distance. Small apple further so big apple closer.', [true, false, true]],
      ['The clockwise and anticlockwise moments are not equal. Moment = force x distance. Small apple further, big apple closer.', [false, true, true]],
      ['Clockwise moment is bigger than anticlockwise. force x distance. big apple further, small apple closer', [false, true, false]],
      ['Clockwise moment = anticlockwise moment. Moment = force x distance. The big apple is further from the pivot and the small apple closer.', [true, true, false]],
      ['clockwise anticlockwise force distance further heavy', [false, false, false]]]]
  ],
  magnets: [
    ['l1', 0, ['north; south; repel; attract; needle; compass', 'North-seeking, south-seeking, repel, attract, needle, compass.'], [
      ['north-seeking; south-seeking; repel; attract; needle; compass; also like poles attract', [true, true, false, false, true, true]]]],
    ['l1', 1, ['The needle is a little magnet and it lines up with the Earth’s magnetic field.',
      'The compass needle is magnetic. It points north because it is in the Earth’s magnetic field.'], [
      ['The compass needle is a magnet. It points towards the sun and ignores the earth magnetic field.', [false, false]],
      ['compass magnet earth field', [true, false]]]],
    ['l1', 2, ['Put plotting compasses around the magnet or sprinkle iron filings. Where the lines are closest together the field is strongest.'], []],
    ['l2', 0, ['Coil the wire around the nail lots of times. Connect the ends to the battery with the leads and clips.',
      'Wrap the wire round the nail, then clip the wire ends to the battery so a current flows.'], [
      ['wrap battery', [false, false]],
      ['Put the wire next to the nail and connect it to the battery with a lead.', [false, true]]]],
    ['l2', 1, ['More turns of wire, more current, and an iron core.', 'The number of coils, the voltage of the battery and the type of core.',
      'turns, battery, iron'], [
      ['Fewer turns, less current, and take the core out.', [false, false, false]],
      ['Fewer turns of wire makes it stronger. A bigger current. An iron core.', [false, true, true]]]],
    ['l2', 2, ['Steel keeps its magnetism, so it would still be magnetic when the current is off and you could not switch it off.',
      'Steel is hard to magnetise but keeps its magnetism. So it stays magnetic even when you switch off the current.',
      'Steel stays magnetic, so you can’t turn the electromagnet off. Iron loses its magnetism easily.'], [
      ['Iron keeps its magnetism but steel loses it, so the electromagnet can still be turned off.', [false, false]],
      ['Steel is hard to magnetise so it stays off.', [false, false]],
      ['Steel is only magnetic when current flows, loses magnetism when switched off.', [false, false]],
      ['Steel is easy to magnetise and loses its magnetism easily, so it switches off.', [false, false]],
      ['Steel keeps its magnetism. Iron keeps its magnetism too, so it would still be magnetic.', [false, false]]]],
    ['l3', 0, ['electromagnet, ring, switch, reset, permanent, attract and repel'], []],
    ['l3', 1, ['Both have an electromagnet that attracts iron and breaks the circuit. The bell keeps ringing because the circuit makes again by itself, but the breaker stays off until you press reset.',
      'Similarity: both use an electromagnet that attracts an iron armature or catch. Difference: you have to reset the circuit breaker by hand.'], [
      ['Both have an electromagnet that attracts iron and breaks the circuit. The breaker stays off until you press reset, but it also resets automatically.', [true, false]],
      ['Both have an electromagnet that attracts iron and breaks the circuit. The breaker stays off until reset. The breaker resets automatically.', [true, false]],
      ['Both have an electromagnet that attracts iron and breaks the circuit. The circuit breaker turns itself back on automatically.', [true, false]]]],
    ['l3', 2, ['Electromagnets can be made much stronger than permanent magnets, and you can switch them off to drop the car.',
      'An electromagnet is very strong so it can lift heavy cars, and you turn the current off to let go of the car.'], [
      ['Permanent magnets are strong and you cannot switch them off', [false, false]],
      ['Electromagnets are weaker and you cannot turn them off.', [false, false]]]],
    ['final', 0, ['A attracts and B repels.'], []],
    ['final', 1, ['An electromagnet, because you can switch it on and off. A problem is that the splinter might not be magnetic, so it would not be attracted.'], [
      ['Electromagnet because it can be switched on and off. A problem: it is non-magnetic and will be removed.', [true, true, false, false]]]],
    ['final', 2, ['Both contain a coil of wire that becomes an electromagnet. In both the electromagnet attracts iron and breaks the circuit.'], []],
    ['final', 3, ['The needle lines up with the Earth’s magnetic field so it points north and you know which direction you are going.',
      'The compass needle is a magnet that is pulled by the Earth’s magnetic field. It always points north, so you can work out which way to go.'], [
      ['The needle is not a magnet and is not affected by the Earth magnetic field. It points north because of the sun.', [false, false]],
      ['compass earth north', [false, false]]]]
  ]
};

for (const [base, list] of Object.entries(cases)) {
  const c = base === 'forces' ? forces : magnets;
  for (const [lesson, index, good, bad] of list) {
    const label = `${base} ${lesson} Q${index + 1}`;
    test(`${label}: model and paraphrases earn full marks`, () => {
      const q = c.q(lesson, index);
      for (const answer of [q.model, ...good]) assert.equal(total(c.mark(lesson, index, answer)), q.points.length, answer);
    });
    if (bad.length) test(`${label}: wrong, reversed or contradictory answers lose the point`, () => {
      for (const [answer, expected] of bad) assert.deepEqual(c.mark(lesson, index, answer), expected, answer);
    });
  }
}
