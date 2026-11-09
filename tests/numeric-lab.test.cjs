const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('numeric answers match the requested rounding or the actual 3.14 calculation', () => {
  const source = fs.readFileSync(path.join(root, 'maths/maths-kit.js'), 'utf8');
  const context = {window: {Engine: {h() {}}}};
  vm.runInNewContext(source.replace('  window.MathsEngine={', '  globalThis.checkNum=checkNum;\n  window.MathsEngine={'), context);
  const check = context.checkNum;
  const circle = {ans: Math.PI * 100, dp: 1, pi: true, text: 'Find the area of this circle.'};
  assert.equal(check(314.2, circle), 'ok');
  assert.equal(check(Math.PI * 100, circle), 'ok');
  assert.equal(check(314.159265, circle), 'ok');
  assert.equal(check(314.0, circle), 'ok314');
  assert.notEqual(check(314.6, circle), 'ok314');
  assert.notEqual(check(314.6, circle), 'ok');
  assert.notEqual(check(314.24, circle), 'ok');
  const whole = {...circle, dp: 0};
  assert.equal(check(314, whole), 'ok');
  assert.notEqual(check(315, whole), 'ok');
  const compound = {ans: 60 + Math.PI * 49 / 2, dp: 1, pi: true, piOffset: 60};
  assert.equal(check(136.9, compound), 'ok314');
  assert.notEqual(check(137.2, compound), 'ok314');

  const generatorContext = {window: {}, MathsEngine: {K: {
    v: (key, value) => String(value), fmt: value => String(value), figure: () => ''
  }}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'maths/area-volume-practice.js'), 'utf8'), generatorContext);
  const generated = generatorContext.window.AVQ.comp[3]({even: () => 10, int: () => 12});
  assert.equal(generated.piOffset, 120);
  assert.equal(check(120 + (generated.ans - 120) * 3.14 / Math.PI, generated), 'ok314');
});

test('cylinder working keeps full pi until the final rounding', () => {
  const c = {Engine: {}}; c.window = c;
  vm.createContext(c);
  const kit = fs.readFileSync(path.join(root, 'maths/maths-kit.js'), 'utf8');
  vm.runInContext(kit.replace('  window.MathsEngine={', '  globalThis.checkNum=checkNum;\n  window.MathsEngine={'), c);
  vm.runInContext(fs.readFileSync(path.join(root, 'maths/area-volume-practice.js'), 'utf8'), c);
  for (const [radius, height] of [[2, 20], [3, 11], [7, 19]]) {
    const values = [radius, height];
    const q = c.AVQ.cyl[0]({int: () => values.shift()});
    const work = q.work.map(s => s.replace(/<[^>]*>/g, ''));
    assert.match(work[0], /≈/, 'rounded area is an approximation');
    assert.ok(work[1].includes(`π × ${radius}² × ${height}`), 'volume uses exact circle area');
    const rounded = Number((Math.PI * radius * radius * height).toFixed(1));
    assert.equal(c.checkNum(rounded, q), 'ok');
    assert.ok(work[1].replace(/,/g, '').endsWith(`≈ ${rounded} cm³`), work[1]);
  }
  const q = c.AVQ.cyl[0]({int: (() => {const values = [2, 20]; return () => values.shift();})()});
  assert.notEqual(c.checkNum(251.4, q), 'ok', 'intermediate rounding is not the requested final answer');
});

test('protein lab adds both reagents before showing the purple result', async () => {
  const nodes = new Map();
  const snapshots = [];
  const element = id => {
    if (!nodes.has(id)) nodes.set(id, {
      style: {}, children: [], attributes: {}, textContent: '', innerHTML: '', disabled: false,
      classList: {add() {}, remove() {}},
      setAttribute(name, value) { this.attributes[name] = value; },
      appendChild(child) { this.children.push(child); },
      querySelectorAll() { return this.children; },
      querySelector(selector) { return selector === '.hint' ? {textContent: 'placeholder'} : null; },
      insertAdjacentHTML() {},
      animate() { this.animations = (this.animations || 0) + 1; }
    });
    return nodes.get(id);
  };
  const host = {innerHTML: '', querySelector(selector) { return element(selector); }};
  const context = {
    window: {}, Math,
    setTimeout(resolve) {
      snapshots.push({label: element('#res').textContent, colour: element('#liquid').style.fill,
        drops: element('#drop').animations || 0});
      resolve();
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'biology/digestion-widgets.js'), 'utf8'), context);
  context.window.DigestionWidgets.lab(host, {h(tag, attrs, html) {
    const button = element(Symbol());
    button.innerHTML = html;
    return button;
  }});
  element('#lf').children.find(b => b.innerHTML === 'Protein solution').onclick();
  element('#lt').children.find(b => b.innerHTML === 'Copper sulfate + sodium hydroxide').onclick();
  await element('#run').onclick();
  const second = snapshots.findIndex(s => s.label.includes('sodium hydroxide'));
  assert.ok(second >= 0, 'second reagent is shown');
  assert.ok(snapshots[second].drops < snapshots.at(-1).drops, 'second reagent drops into the tube');
  assert.ok(snapshots.slice(0, second + 1).every(s => s.colour !== '#7b3fa0'), 'purple appears after the second reagent');
  assert.equal(element('#liquid').style.fill, '#7b3fa0');
});
