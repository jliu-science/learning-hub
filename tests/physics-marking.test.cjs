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
  c.mark = (lesson, index, answer) => {
    const q = (lesson === 'final' ? c.topic.final : c.topic.lessons.find(l => l.id === lesson)).apply[index];
    return c.Engine.markAnswer(answer, c.MARKS[lesson][index], (q.scenario + ' ' + q.question).replace(/<[^>]+>/g, ' '));
  };
  c.score = (...args) => c.mark(...args).filter(r => r.ok).length;
  return c;
}

for (const base of ['forces', 'magnets']) test(`${base}: all thirteen model answers earn their intended points`, () => {
  const c = load(base);
  for (const section of [...c.topic.lessons, {...c.topic.final, id: 'final'}]) section.apply.forEach((q, i) => {
    assert.equal(c.score(section.id, i, q.model), q.points.length, `${section.id} problem ${i + 1}`);
  });
});

test('magnet outcomes must match the labelled diagram or correct pole relationship', () => {
  const c = load('magnets');
  for (const wrong of ['A repels. B attracts.', 'Like poles attract. Unlike poles repel.']) {
    assert.equal(c.score('final', 0, wrong), 0, wrong);
  }
  for (const correct of ['A attracts. B repels.', 'Diagram A: they attract. Diagram B: they repel.',
    'Unlike poles attract and like poles repel.']) {
    assert.equal(c.score('final', 0, correct), 2, correct);
  }
});

test('missing-word answers are marked in order, with both loudspeaker outcomes required', () => {
  const c = load('magnets');
  assert.equal(c.score('l1', 0, 'north south repel attract needle compass'), 6);
  assert.ok(c.score('l1', 0, 'south north attract repel compass needle') < 6);
  assert.equal(c.score('l3', 0, 'electromagnet; ring; switch; reset; permanent; attract and repel'), 6);
  assert.equal(c.mark('l3', 0, 'electromagnet; ring; switch; reset; permanent; repel')[5].ok, false);
  assert.ok(c.score('l3', 0, 'ring; electromagnet; reset; switch; permanent; repel and attract') < 6);
});

test('fair testing requires keeping the control variables constant', () => {
  const c = load('forces');
  assert.equal(c.score('l1', 3, 'Change the area, mass and height for each parachute.'), 0);
  assert.equal(c.score('l1', 3, 'Keep the area, mass and height the same.'), 3);
  assert.equal(c.score('l1', 3, 'Change the material but keep the area, mass and height the same.'), 3);
});

test('elastic-limit claims must describe permanent deformation', () => {
  const c = load('forces');
  const prefix = '12 cm. Double the force doubles the extension. ';
  for (const wrong of ['Beyond the elastic limit it will return to its original length.',
    'Beyond the elastic limit it is unsafe.',
    'It stays permanently stretched. Beyond the elastic limit it will return to its original length.']) {
    assert.equal(c.mark('l2', 2, prefix + wrong)[2].ok, false, wrong);
  }
  assert.equal(c.mark('l2', 2, prefix + 'It will not return to its original length.')[2].ok, true);
  assert.equal(c.mark('final', 1, 'The cord is in tension and has an extension. Beyond its elastic limit it will return to its original length.')[2].ok, false);
});

test('the calculated moment needs moment units, not force units', () => {
  const c = load('forces');
  assert.equal(c.score('l3', 0, '5 x 0.75 = 3.75 N'), 1);
  for (const unit of ['Nm', 'N m', 'N·m', 'newton metres']) {
    assert.equal(c.score('l3', 0, '5 x 0.75 = 3.75 ' + unit), 2, unit);
  }
});

test('equilibrium cannot be explained using unbalanced forces or the wrong fluid', () => {
  const c = load('forces');
  assert.equal(c.score('final', 0, 'It has a constant speed because the forces are unbalanced. Air resistance is equal to friction.'), 0);
  assert.equal(c.score('final', 0, 'It moves at steady speed with balanced equal and opposite forces. Water resistance acts against its motion.'), 3);
});

test('surgeon rubric requires an explained material problem for the two problem marks', () => {
  const c = load('magnets');
  assert.equal(c.score('final', 1, 'An electromagnet can be strong and turned off. The splinter is metal.'), 2);
  assert.equal(c.score('final', 1, 'Use an electromagnet because it can be switched off. A non-magnetic splinter would not be attracted.'), 4);
});

test('bell and breaker comparison needs a shared mechanism and reset difference', () => {
  const c = load('magnets');
  for (const answer of ['An electromagnet rings the bell.', 'Both use electromagnets. Bells ring.',
    'The bell rings again.', 'Both have an electromagnet that repels the iron catch.']) {
    assert.equal(c.score('l3', 1, answer), 0, answer);
  }
  const similarity = 'Both use an electromagnet that attracts iron and breaks the circuit. ';
  assert.equal(c.score('l3', 1, similarity), 1);
  for (const difference of ['The circuit breaker stays off until you press the reset button.',
    'The breaker must be manually reset.',
    'The bell circuit makes again by itself.',
    'The bell keeps making and breaking the circuit.']) {
    assert.equal(c.score('l3', 1, similarity + difference), 2, difference);
  }
  for (const wrong of ['The breaker resets automatically.',
    'The circuit breaker does not need a reset.',
    'The circuit breaker does not stay off.',
    'The breaker does not need to be reset.',
    'The bell circuit never makes again by itself.']) {
    assert.equal(c.mark('l3', 1, similarity + wrong)[1].ok, false, wrong);
  }
});
