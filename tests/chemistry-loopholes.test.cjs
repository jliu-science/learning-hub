// Regression tests for the chemistry "Apply it" marking: wrong, reversed or contradictory answers
// must lose the matching points, and natural correct answers must keep full marks.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const c = {svgIcon: () => ''};
c.window = c;
c.EnergyWidgets = new Proxy({}, {get: () => () => {}});
c.Kit = new Proxy({}, {get: () => () => {}});
vm.createContext(c);
const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c);
run('assets/engine.js');
c.Engine.start = topic => { c.topic = topic; };
run('chemistry/energy-data.js');
run('chemistry/energy-marks.js');
const section = id => id === 'final' ? c.topic.final : c.topic.lessons.find(l => l.id === id);
const mark = (id, i, answer) => {
  const q = section(id).apply[i];
  return Array.from(c.Engine.markAnswer(answer, c.MARKS[id][i], q.scenario + ' ' + q.question), p => p.ok ? '1' : '0').join('');
};
const expect = cases => { for (const [id, i, answer, want] of cases) assert.equal(mark(id, i, answer), want, `${id} Q${i + 1}: ${answer}`); };

test('every model answer gets full marks', () => {
  for (const id of [...c.topic.lessons.map(l => l.id), 'final']) section(id).apply.forEach((q, i) => {
    assert.equal(mark(id, i, q.model), '1'.repeat(q.points.length), `${id} Q${i + 1}`);
  });
});

test('l1 Q1 cold pack: direction of energy and temperature', () => {
  expect([
    ['l1', 0, 'It is endothermic so it takes in heat from the ankle which makes it cooler.', '111'],
    ['l1', 0, 'The ammonium nitrate dissolving takes in energy from the ankle so the ankle gets cold. This is an endothermic reaction.', '111'],
    ['l1', 0, 'Endothermic. The ankle gives energy to the pack so the ankle gets cold.', '111'],
    ['l1', 0, 'Endothermic, the cold pack takes in energy from the injury so the injury goes cold.', '111'],
    ['l1', 0, 'It is endothermic, so energy goes from the pack into the ankle and the ankle temperature goes down.', '101'],
    ['l1', 0, 'Endothermic means it gives out energy. Energy goes from the ankle into the pack, temperature falls.', '011'],
    ['l1', 0, 'It is exothermic and endothermic. energy taken from the ankle so temperature goes down', '011'],
    ['l1', 0, 'It is endothermic so it gives out energy to the ankle which makes it hotter.', '000'],
  ]);
});

test('l1 Q2 hand warmer / cold pack: substance, use and direction must agree', () => {
  expect([
    // correct, including formulas and everyday words
    ['l1', 1, 'Use CaCl2 for the hand warmer because it rises 15 °C and KCl for the cold pack because it falls 10 °C.', '1111'],
    ['l1', 1, 'Hand warmer: CaCl2, exothermic, +15. Cold pack: KCl, endothermic, -10.', '1111'],
    ['l1', 1, 'Hand warmer: CaCl₂ because it is exothermic and the temperature rises by 15 °C. Cold pack: KCl because it is endothermic and the temperature falls by 10 °C.', '1111'],
    ['l1', 1, 'For the hand warmer I choose calcium chloride because it gets hot. For the cold pack I choose potassium chloride because it gets cold.', '1111'],
    ['l1', 1, 'I would choose calcium chloride for the hand warmer because its temperature went up the most, from 20 to 35. For the cold pack I would choose potassium chloride because it went down the most, from 20 to 10.', '1111'],
    ['l1', 1, 'Hand warmer: calcium chloride. It gets hotter by 15. Cold pack: potassium chloride. It gets colder by 10.', '1111'],
    // reviewer item: reversed temperatures lose the reason points
    ['l1', 1, 'Hand warmer: calcium chloride because it drops to 35 °C. Cold pack: potassium chloride because it rises to 10 °C.', '1010'],
    ['l1', 1, 'Calcium chloride for the hand warmer because it falls to 35 and potassium chloride for the cold pack because it rises to 10.', '1010'],
    ['l1', 1, 'Calcium chloride for the hand warmer because it falls 15 and potassium chloride for the cold pack because it rises 10', '1010'],
    // bare choice: 'hand warmer' itself is not a reason
    ['l1', 1, 'Calcium chloride for the hand warmer and potassium chloride for the cold pack', '1010'],
    ['l1', 1, 'Hand warmer: calcium chloride. Cold pack: potassium chloride.', '1010'],
    ['l1', 1, 'Calcium chloride for the cold pack and potassium chloride for the hand warmer.', '0000'],
    ['l1', 1, 'Calcium chloride hand warmer endothermic. Potassium chloride cold pack exothermic.', '1010'],
  ]);
});

test('l1 Q3/Q4 melting ice and burning ethanol', () => {
  expect([
    ['l1', 2, 'Melting is endothermic. The ice needs energy to melt so it takes heat from the glass and from your hand, which makes your hand feel cold.', '111'],
    ['l1', 2, 'Melting is endothermic because ice takes in energy from the drink, glass and hand. The glass feels cold because heat leaves your hand.', '111'],
    ['l1', 2, 'Melting is exothermic. The ice gives out energy to the drink and your hand feels cold from it.', '000'],
    ['l1', 2, 'Melting is endothermic because the ice takes in energy from the surroundings. The glass feels cold because the ice transfers cold to your hand.', '100'],
    ['l1', 2, 'Melting is endothermic. The ice gives out energy to your hand so your hand feels hot.', '100'],
    ['l1', 3, 'Exothermic, because the burning ethanol gives energy to the water and the water\'s temperature goes up.', '11'],
    ['l1', 3, 'It is exothermic because it takes in energy from the water and the water goes up', '10'],
    ['l1', 3, 'It is exothermic because energy is taken in from the surroundings and temperature falls to the water', '10'],
    ['l1', 3, 'It is endothermic. Energy is transferred to the water so its temperature rises.', '01'],
  ]);
});

test('l2 freezing (Sam): a wrong conclusion never scores the conclusion point', () => {
  expect([
    ['l2', 1, 'Sam is wrong. Ice has less energy than water, so the ice is lower down on the diagram. The arrow goes down because energy is given out to the surroundings, so freezing is exothermic.', '111'],
    ['l2', 1, 'Sam thinks freezing is endothermic but it is exothermic. The water gives out energy as it freezes, so the ice is lower than the water and the arrow points down.', '111'],
    ['l2', 1, 'Sam is wrong. Water loses energy when it freezes to the surroundings. Exothermic.', '111'],
    ['l2', 1, 'Freezing is endothermic. Ice has less energy than water. Energy given out.', '110'],
    ['l2', 1, 'Freezing is endothermic because ice has less energy; the products are lower; energy is given out. Exothermic is wrong.', '110'],
    ['l2', 1, 'Freezing is exothermic so it takes in energy from the surroundings. Ice has more energy, lower down.', '000'],
    ['l2', 1, 'Freezing is endothermic. Ice has less energy and the arrow points down, energy given out to the surroundings, exothermic', '110'],
    ['l2', 1, 'Sam is right because freezing is endothermic. Products are lower and the arrow points down.', '110'],
    ['l2', 0, 'boiling is exothermic, end state is higher, energy given out', '110'],
  ]);
});

test('l2 fuels: coal or wood ranked highest loses the ranking points (methane 56 MJ/kg is highest)', () => {
  expect([
    ['l2', 2, 'I would choose methane because it gives the most energy per kg: 56 MJ compared with 33 MJ for coal and 21 MJ for wood. They should also think about the cost.', '111'],
    ['l2', 2, 'Natural gas has the highest energy, 56 MJ/kg, which is more than coal (33) and wood (21). Another factor is how much pollution it makes.', '111'],
    ['l2', 2, 'Coal releases the most energy per kg. Methane 56, coal 33, wood 21 MJ/kg. Cost matters.', '001'],
    ['l2', 2, 'Coal releases the most energy per kg (33), methane is 56 and wood is 21. Pollution is a factor.', '001'],
    ['l2', 2, 'Coal releases the most energy per kg, more than methane (56) and wood (21).', '000'],
    ['l2', 2, 'Coal has the most energy because 33 is more than 56. Methane 56. cost', '001'],
    ['l2', 2, 'Wood gives the most energy, 21 MJ, and is cheap. Coal 33 and methane 56 are less.', '001'],
    ['l2', 2, 'Methane 56, coal 33, wood 21. Wood releases the most energy per kg. Cost.', '001'],
  ]);
});

test('l3 bond energies: roles, comparison and conclusion', () => {
  expect([
    ['l3', 0, 'Breaking: 436 + 243 = 679 kJ/mol. Making: 2 x 432 = 864 kJ/mol. More energy is released making the bonds than is needed to break them, so the reaction is exothermic.', '1111'],
    ['l3', 0, 'Break 679, make 864. Breaking takes in less energy than making gives out. Exothermic.', '1111'],
    ['l3', 0, '679 to break and 864 to make, which is exothermic', '1101'],
    ['l3', 1, 'Break: 594. Make: 1124. Breaking needs less energy than making releases, so exothermic.', '1111'],
    ['l3', 1, 'To break the bonds: 436 + 158 = 594. To make the bonds: 2 × 562 = 1124. 1124 is bigger than 594 so more energy is given out than taken in. It is exothermic.', '1111'],
    // endothermic conclusion never earns the conclusion point
    ['l3', 0, 'Breaking 679, making 864. Energy to break is less than energy released, so it is endothermic.', '1110'],
    ['l3', 0, 'Energy to break is 679 and energy released is 864. So endothermic.', '1000'],
    ['l3', 0, 'Break 679 make 864. Breaking needs more energy than making releases so it is endothermic.', '0000'],
    ['l3', 1, 'Break 594 make 1124, 594 is less than 1124, so it is endothermic.', '0010'],
    // swapped break/make roles
    ['l3', 0, 'Breaking bonds gives out 679 and making bonds takes in 864. Less energy is needed to break bonds than released, exothermic.', '0011'],
    ['l3', 0, 'Break: 436 + 243 = 679. Make: 2 × 432 = 864. Breaking bonds releases energy, making bonds takes in energy so exothermic', '0001'],
    ['l3', 1, 'Break 594, make 1124. Breaking bonds gives out energy and making bonds takes in energy. 594 is less than 1124 so exothermic.', '0011'],
  ]);
});

test('l3 engine: bonds broken need energy; catalyst makes gases less harmful', () => {
  expect([
    ['l3', 2, 'The bonds in nitrogen and oxygen need to be broken, and breaking bonds takes in energy. The engine is very hot so it gives enough energy. In normal air there is not enough energy. The catalytic converter has platinum and rhodium which turn the harmful gases into less harmful ones.', '1111'],
    ['l3', 2, 'The hot engine gives energy to break bonds. The catalytic converter uses platinum to speed up gases becoming less harmful.', '1111'],
    ['l3', 2, 'The bonds in nitrogen and oxygen break giving out energy. Hot engine supplies energy. Platinum rhodium catalyst.', '1010'],
    ['l3', 2, 'Bonds are made in nitrogen and oxygen which needs energy, the hot engine supplies energy and catalyst platinum', '0010'],
    ['l3', 2, 'Nitrogen and oxygen bonds break in the engine because it is cold, and the catalyst is used up.', '1000'],
    ['l3', 2, 'bond break energy hot engine platinum', '1010'],
  ]);
});

test('final Q1 Marcus: transfer direction and independent variable', () => {
  expect([
    ['final', 0, 'Combustion is exothermic: energy is transferred to the water so it gets hotter. I change the type of fuel burned. I keep the volume of water and the starting temperature the same.', '11111'],
    ['final', 0, 'Combustion is exothermic: energy is transferred to the water so it gets hotter. The thing he changes is the fuel. He keeps the volume of water and the starting temperature the same.', '11111'],
    ['final', 0, 'Burning is exothermic because energy is transferred from the fuel to the water, so the water heats up. The independent variable is which fuel he burns. He must keep the amount of water and the distance from the flame the same.', '11111'],
    ['final', 0, 'It is exothermic: heat goes from the flame into the water and the water\'s temperature rises. He changes the fuel (ethanol or propanol). Keep the mass of fuel burned and the starting temperature of the water the same.', '11111'],
    ['final', 0, 'Combustion is exothermic. Heat transfers from the water to the flame so the water temperature rises. The independent variable is the type of fuel. Keep the volume of water and the starting temperature the same.', '10111'],
    ['final', 0, 'Exothermic. Heat goes from the water to the flame. Independent variable is fuel. Same water volume and time.', '10110'],
    ['final', 0, 'Combustion is exothermic. Independent variable is the amount of water. Keep fuel type and starting temperature the same.', '10011'],
    ['final', 0, 'Exothermic. Energy goes to the water so the temperature rises. The independent variable is fuel type. Keep the time and the time of day the same.', '11100'],
    ['final', 0, 'Exothermic. Energy goes to the water so the temperature rises. The independent variable is the temperature. Keep the fuel the same, the type of fuel the same', '11000'],
  ]);
});

test('final Q2 dissolving diagram', () => {
  expect([
    ['final', 1, 'It is endothermic because the solution is higher than the solute and solvent, so it has more energy. It takes in energy from the surroundings. It would be good for a cold pack because it takes heat from the injury and cools it.', '111'],
    ['final', 1, 'It is endothermic as the solution is higher up. It takes energy in from the surroundings. It is better for a cold pack as it takes energy from your skin.', '111'],
    ['final', 1, 'The solution is lower than the reactants. It is endothermic and takes in energy from the surroundings. Cold pack because it takes energy from the injury.', '011'],
    ['final', 1, 'Endothermic because it is higher. It would be good for hand warmer, not cold pack: it cools the injury.', '100'],
    ['final', 1, 'It is endothermic but it gives out energy to the surroundings. Hand warmer, it makes hands cold.', '000'],
  ]);
});

test('final Q3 methane bonds', () => {
  expect([
    ['final', 2, 'Breaking bonds takes in energy. Making bonds gives out energy. More energy is given out making the new bonds than is taken in breaking the old ones, so overall energy is given out. Products lower than reactants.', '1111'],
    ['final', 2, 'Bond breaking takes in energy. Bond making gives out energy. Making releases more than breaking needs. Arrow down.', '1111'],
    ['final', 2, 'Breaking the bonds in methane and oxygen takes in energy. Making the new bonds in carbon dioxide and water gives out energy. More energy is given out than taken in, so it is exothermic. On the diagram the products are lower than the reactants and the arrow points down.', '1111'],
    ['final', 2, 'Breaking bonds needs energy and new bonds give out energy when they form. More energy is given out than taken in. Arrow points down.', '1111'],
    ['final', 2, 'Breaking bonds takes in energy; making bonds gives out energy. Less energy is needed to break than released. The reactants are higher than the products.', '1111'],
    ['final', 2, 'Break bonds takes in energy, make bonds gives out energy. Less energy released making than needed breaking. Products higher than reactants.', '1100'],
    ['final', 2, 'Breaking bonds gives out energy. Making bonds takes in energy. More energy is taken in breaking than given out making. Products lower, arrow down.', '0001'],
    ['final', 2, 'Breaking the bonds in methane and oxygen gives out energy. Making bonds in carbon dioxide and water takes in energy. More energy given out than taken in. Products lower.', '0011'],
    ['final', 2, 'Bond breaking takes energy in. Bond making gives energy out. Less energy is released making than is needed for breaking. Products lower.', '1101'],
    ['final', 2, 'break in make out more lower', '0000'],
  ]);
});
