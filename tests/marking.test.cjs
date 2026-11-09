const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
function load(subject) {
  const biology = subject === 'biology';
  const base = biology ? 'digestion' : 'energy';
  const context = {svgIcon: () => ''};
  context.window = context;
  context[biology ? 'DigestionWidgets' : 'EnergyWidgets'] = new Proxy({}, {get: () => () => {}});
  context.Kit = new Proxy({}, {get: () => () => {}});
  vm.createContext(context);
  const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  run('assets/engine.js');
  context.Engine.start = topic => context.topic = topic;
  run(`${subject}/${base}-data.js`);
  run(`${subject}/${base}-marks.js`);
  context.mark = (lesson, index, answer) => {
    const section = lesson === 'final' ? context.topic.final : context.topic.lessons.find(l => l.id === lesson);
    const question = section.apply[index];
    const stem = (question.scenario + ' ' + question.question).replace(/<[^>]+>/g, ' ');
    return context.Engine.markAnswer(answer, context.MARKS[lesson][index], stem);
  };
  return context;
}

for (const subject of ['biology', 'chemistry']) {
  test(`${subject}: all supplied model answers retain every marking point`, () => {
    const c = load(subject);
    for (const section of [...c.topic.lessons, {...c.topic.final, id: 'final'}]) {
      section.apply.forEach((q, i) => {
        assert.ok(c.mark(section.id, i, q.model).every(r => r.ok), `${section.id} problem ${i + 1}`);
      });
    }
  });
}

test('enzyme products must be associated with the correct enzyme', () => {
  const c = load('biology');
  for (const answer of [
    'Carbohydrase makes amino acids in the mouth. Protease makes sugar in the stomach.',
    'Carbohydrase makes amino acids in the mouth and protease makes sugar in the stomach.',
    'Carbohydrase makes amino acids in the mouth; protease makes sugar in the stomach.',
    'Carbohydrase makes amino acids in the mouth, protease makes sugar in the stomach.',
    'Carbohydrase does not make sugar in the mouth. Protease does not make amino acids in the stomach.'
  ]) {
    const result = c.mark('final', 0, answer);
    assert.equal(result[0].ok, false, answer);
    assert.equal(result[2].ok, false, answer);
  }
});

test('consumed enzymes and negated correct claims do not earn a catalyst mark', () => {
  const c = load('biology');
  const opening = 'Enzymes turn large molecules into small molecules and speed up digestion. ';
  for (const claim of ['Enzymes are used up.', 'They are consumed.', 'Enzymes are not reused.',
    'Enzymes are not used up. They are used up.']) {
    assert.equal(c.mark('l5', 2, opening + claim)[2].ok, false, claim);
  }
  for (const claim of ['Enzymes are not used up.', 'Enzymes do not get used up.', 'They can be reused.']) {
    assert.equal(c.mark('l5', 2, opening + claim)[2].ok, true, claim);
  }
  const chemistry = load('chemistry');
  assert.equal(chemistry.mark('final', 0, 'Combustion is not exothermic.')[0].ok, false);
});

test('correct short statements are not discarded for reusing question vocabulary', () => {
  const c = load('chemistry');
  assert.equal(c.mark('final', 0, 'The independent variable is the type of fuel.')[2].ok, true);
});

test('numeric marking terms cannot match prefixes of a different number', () => {
  const c = load('chemistry');
  for (const [term, wrong] of [['45', '450'], ['594', '5940'], ['1124', '11240'], ['100', '1000']]) {
    const rules = [[[term]]];
    assert.equal(c.Engine.markAnswer(`The answer is ${term}.`, rules, '')[0].ok, true);
    assert.equal(c.Engine.markAnswer(`The answer is ${wrong}.`, rules, '')[0].ok, false);
  }
  // Scientific stems still accept inflected vocabulary.
  assert.equal(c.Engine.markAnswer('The reaction is exothermic.', [[['exotherm']]], '')[0].ok, true);
});

test('any two distinct controls earn two marks; synonyms alone earn one', () => {
  const c = load('chemistry');
  const choices = ['volume of water', 'starting temperature', 'mass of fuel', 'burning time', 'distance from flame to beaker'];
  for (let i = 0; i < choices.length; i++) for (let j = i + 1; j < choices.length; j++) {
    const answer = `Keep the ${choices[i]} and the ${choices[j]} the same.`;
    const result = c.mark('final', 0, answer);
    assert.equal(result[3].ok, true, answer);
    assert.equal(result[4].ok, true, answer);
  }
  const duplicate = c.mark('final', 0, 'Keep the volume of water and the water volume the same.');
  assert.equal(duplicate[3].ok, true);
  assert.equal(duplicate[4].ok, false);
  for (const answer of [
    'Keep how much water and how much fuel you use the same.',
    'Keep the volume and initial temperature of the water the same.'
  ]) {
    const result = c.mark('final', 0, answer);
    assert.equal(result[3].ok, true, answer);
    assert.equal(result[4].ok, true, answer);
  }
  assert.equal(c.mark('final', 0, 'Keep the volume of fuel and the amount of fuel the same.')[4].ok, false);
  const answer = 'It is exothermic because heat is transferred to the water. The independent variable is the type of fuel. Keep the starting temperature and the distance between flame and beaker the same.';
  assert.ok(c.mark('final', 0, answer).every(r => r.ok));
});
