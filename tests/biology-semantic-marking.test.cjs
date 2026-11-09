const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = {svgIcon: () => ''};
context.window = context;
context.DigestionWidgets = new Proxy({}, {get: () => () => {}});
context.Kit = new Proxy({}, {get: () => () => {}});
vm.createContext(context);
for (const file of ['assets/engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
context.Engine.start = topic => context.topic = topic;
for (const file of ['biology/digestion-data.js', 'biology/digestion-marks.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const mark = (lesson, index, answer) => context.Engine.markAnswer(answer, context.MARKS[lesson][index]);

test('percentage mark requires an answer near 45 percent', () => {
  const working = '5000 divided by 11000 times 100 gives ';
  assert.equal(mark('l3', 1, working + '45.45%')[3].ok, true);
  assert.equal(mark('l3', 1, working + '450%')[3].ok, false);
  assert.equal(mark('l3', 1, working + '450 percent')[3].ok, false);
  assert.equal(mark('l3', 1, working + '45% or 450%')[3].ok, false);
});

test('food-test colours must indicate positive results', () => {
  assert.equal(mark('l2', 3, 'Add copper sulfate and sodium hydroxide. Purple means protein is present.')[2].ok, true);
  assert.ok(mark('l2', 3, 'Add copper sulfate then sodium hydroxide. A purple colour is a positive result.').every(point => point.ok));
  assert.equal(mark('l2', 3, 'Add copper sulfate and sodium hydroxide. Purple means no protein is present.')[2].ok, false);
  const negative = 'Iodine blue-black means no starch. Benedict orange-red means no sugar. Copper sulfate and sodium hydroxide purple means no protein. Carbohydrase makes sugar into starch and protease makes amino acids into protein.';
  assert.ok(mark('final', 3, negative).every(point => !point.ok));
  assert.ok(mark('final', 3, 'The bar contains starch, sugar and protein. Carbohydrase breaks starch into sugar; protease breaks protein into amino acids.').every(point => point.ok));
});

test('vitamin D deficiency must be a cause of rickets', () => {
  assert.equal(mark('l3', 2, 'Rickets is caused by a lack of vitamin D, leaving weak bones.')[1].ok, true);
  assert.equal(mark('l3', 2, 'Rickets is caused by not enough vitamin D, so bones become weak.')[1].ok, true);
  assert.equal(mark('l3', 2, 'A lack of vitamin D does not cause rickets; bones become weak.')[1].ok, false);
  assert.equal(mark('l3', 2, 'A lack of vitamin D causes rickets. A lack of vitamin D does not cause rickets.')[1].ok, false);
});

test('villi increase area and blood supply supports absorption', () => {
  assert.ok(mark('l4', 1, 'Its epithelium is one cell thick; numerous villi increase surface area; each villus has a dense capillary network.').every(point => point.ok));
  const wrong = mark('l4', 1, 'The wall is thin. Villi reduce the surface area. Blood capillaries do not carry absorbed nutrients away.');
  assert.equal(wrong[1].ok, false);
  assert.equal(wrong[2].ok, false);
  assert.equal(mark('l4', 1, 'The wall is not thin.')[0].ok, false);
  assert.equal(mark('l4', 1, 'The wall is not one cell thick.')[0].ok, false);
  assert.equal(mark('l4', 1, 'Villi do not increase surface area.')[1].ok, false);
  const contradictory = mark('l4', 1, 'The wall is thin. Villi increase surface area. Villi reduce surface area. Capillaries carry nutrients away. Capillaries do not carry nutrients away.');
  assert.equal(contradictory[1].ok, false);
  assert.equal(contradictory[2].ok, false);
});

test('enzyme products follow the digestion direction', () => {
  assert.ok(mark('l5', 1, 'Salivary amylase hydrolyses starch to maltose.').every(point => point.ok));
  assert.equal(mark('l5', 1, 'Salivary amylase turns sugar into starch.')[2].ok, false);
  assert.equal(mark('l5', 1, 'Salivary amylase makes starch from sugar.')[2].ok, false);
  assert.equal(mark('l5', 1, 'Salivary amylase cannot convert starch into sugar.')[2].ok, false);
  assert.equal(mark('l5', 1, 'Salivary amylase does not break starch into sugar.')[2].ok, false);
  assert.equal(mark('l5', 1, 'Sugar is produced from starch by salivary amylase.')[2].ok, true);
  assert.equal(mark('final', 3, 'The bar contains starch, sugar and protein. Carbohydrase breaks starch into sugar. Protease makes protein from amino acids.')[4].ok, false);
  assert.equal(mark('final', 1, 'In the small intestine bile acts on lipids. Lipase breaks lipids down into fatty acids and glycerol.')[2].ok, true);
  assert.equal(mark('final', 1, 'In the small intestine bile acts on lipids. Lipase converts fatty acids and glycerol into lipids.')[2].ok, false);
});
