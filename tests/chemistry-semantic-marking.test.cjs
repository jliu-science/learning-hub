const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
function load() {
  const c = {svgIcon: () => ''}; c.window = c;
  c.EnergyWidgets = new Proxy({}, {get: () => () => {}});
  c.Kit = new Proxy({}, {get: () => () => {}});
  vm.createContext(c);
  const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c);
  run('assets/engine.js'); c.Engine.start = topic => {c.topic = topic;};
  run('chemistry/energy-data.js'); run('chemistry/energy-marks.js');
  c.mark = (lesson, index, answer) => {
    const section = lesson === 'final' ? c.topic.final : c.topic.lessons.find(l => l.id === lesson);
    const q = section.apply[index];
    return Array.from(c.Engine.markAnswer(answer, c.MARKS[lesson][index], q.scenario + ' ' + q.question), p => p.ok);
  };
  return c;
}

test('pack choice and explanation must belong to the correct substance', () => {
  const c = load();
  assert.deepEqual(c.mark('l1', 1, 'Calcium chloride is for the cold pack because it makes temperature rise. Potassium chloride is for the hand warmer because it makes temperature fall.'), [false, false, false, false]);
  assert.deepEqual(c.mark('l1', 1, 'Use calcium chloride in the hand warmer: it is exothermic and rises by 15 degrees. Use potassium chloride in the cold pack: it is endothermic and falls by 10 degrees.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l1', 1, 'Use calcium chloride for the hand warmer because it rises by 15 degrees and potassium chloride for the cold pack because it falls by 10 degrees.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l1', 1, 'Use calcium chloride for the hand warmer because it is endothermic and rises by 15 degrees. Use potassium chloride for the cold pack because it is exothermic and falls by 10 degrees.'), [true, false, true, false]);
});

test('bond energy comparisons need the correct numerical relationship', () => {
  const c = load();
  assert.deepEqual(c.mark('l3', 1, 'Breaking needs 594; making gives 1124. Since 594 is greater than 1124, the reaction is exothermic.'), [true, true, false, false]);
  assert.deepEqual(c.mark('l3', 0, 'Breaking needs 679. Making releases 864. Since 679 is greater than 864, it is exothermic.'), [true, true, false, false]);
  assert.deepEqual(c.mark('l3', 1, 'Breaking takes 594 and making releases 1124. More energy is released than taken in, so it is exothermic.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l3', 0, 'Breaking takes 679 and making releases 864. Less energy is needed than released, so it is exothermic.'), [true, true, true, true]);
  for (const comparison of ['594 < 1124', '1124 > 594']) assert.deepEqual(c.mark('l3', 1, `Break 594, make 1124; ${comparison}; exothermic.`), [true, true, true, true]);
  for (const comparison of ['594 > 1124', '1124 < 594']) assert.deepEqual(c.mark('l3', 1, `Break 594, make 1124; ${comparison}; exothermic.`), [true, true, false, false]);
  assert.deepEqual(c.mark('l3', 1, 'Break 594, make 1124. 594 is less than 1124, but 594 is greater than 1124. Exothermic.'), [true, true, false, false]);
  assert.deepEqual(c.mark('l3', 1, 'Breaking requires 1124; making releases 594. 594 is less than 1124. Exothermic.'), [false, false, true, true]);
  assert.deepEqual(c.mark('l3', 1, 'Break: 594; Make: 1124. 594 is less than 1124. Exothermic.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l3', 1, 'Break 594; make 1124. 594 is less than 1124. Less energy is released than needed. Exothermic.'), [true, true, false, false]);
  assert.deepEqual(c.mark('l3', 1, 'Break 594; make 1124. More energy is released making bonds than is needed breaking them. Exothermic.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l3', 1, 'Breaking requires 594 whereas making releases 1124. 594 is less than 1124; exothermic.'), [true, true, true, true]);
  assert.deepEqual(c.mark('l3', 1, 'Energy needed to break bonds is 594 and energy released making bonds is 1124. More energy is released than needed, so exothermic.'), [true, true, true, true]);
});

test('methane comparison rejects a reversed ranking', () => {
  const c = load();
  assert.deepEqual(c.mark('l2', 2, 'Methane has the least energy: 56 is less than 33 and 21. Cost matters too.'), [false, false, true]);
  assert.deepEqual(c.mark('l2', 2, 'Methane has the most energy per kg: 56 MJ compared with 33 for coal and 21 for wood. Consider cost.'), [true, true, true]);
});

test('combustion must transfer heat toward the water', () => {
  const c = load();
  assert.deepEqual(c.mark('final', 0, 'Combustion is exothermic, transferring energy from the water to the fuel so the water temperature rises. Independent variable is type of fuel. Keep volume of water and burning time the same.'), [true, false, true, true, true]);
  assert.deepEqual(c.mark('final', 0, 'Combustion is exothermic, transferring energy from the fuel to the water so the water temperature rises. Independent variable is type of fuel. Keep volume of water and burning time the same.'), [true, true, true, true, true]);
});
