const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../physics/forces-widgets.js'), 'utf8');

function harness() {
  const nodes = new Map(), choices = new Map(), drags = [], frames = new Map();
  let nextFrame = 1, rangeInput;
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: '', textContent: '', children: [], attributes: {}, style: {}, chips: [],
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(name, value) { this.attributes[name] = value; },
      appendChild(child) { this.chips.push(child); }
    });
    return nodes.get(id);
  }
  node('lfst').children = Array.from({ length: 3 }, () => ({ classList: { toggle() {} } }));
  const el = {
    innerHTML: '',
    querySelector(selector) { return node(selector.slice(1)); },
    querySelectorAll(selector) { return selector === '#spw .chip' ? node('spw').chips : []; }
  };
  const Kit = {
    range() { return '<input type="range">'; },
    ranges(_el, cb) { rangeInput = cb; },
    choices(box, labels, cb, start) { choices.set(box.id, { labels, set: cb }); if (start != null) cb(start); },
    arrow(x1, y1, x2, y2) { return `<arrow x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }
  };
  const context = {
    window: { Kit },
    Engine: { drag(chip, spec) { drags.push({ chip, ...spec }); } },
    document: { body: { contains() { return true; } } },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame(fn) { const id = nextFrame++; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); }
  };
  vm.runInNewContext(source, context, { filename: 'forces-widgets.js' });
  function frame() {
    const [id, callback] = frames.entries().next().value || [];
    assert.ok(callback, 'expected a pending animation frame');
    frames.delete(id); callback();
  }
  const U = { h(_tag, _props, label) { return { label, style: {}, classList: { add() {}, remove() {} } }; } };
  return { widgets: context.window.ForcesWidgets, el, U, node, choices, drags, frames, frame, input: (...values) => rangeInput(values) };
}

test('book continues at steady speed when push falls to match friction', () => {
  const h = harness(); h.widgets.pushBook(h.el, h.U);
  h.input(11); h.frame();
  const before = h.node('pbbook').attributes.transform;
  h.input(10); h.frame();
  const after = h.node('pbbook').attributes.transform;
  assert.notEqual(after, before);
  assert.equal(h.node('pbf').textContent, '10 N');
  assert.equal(h.node('pbr').textContent, '0 N');
  assert.match(h.node('pbv').innerHTML, /steady speed/);
});

test('leaf reaches balanced steady fall; pause and reset cancel frames', () => {
  const h = harness(); h.widgets.leaf(h.el, h.U);
  h.node('lfgo').onclick();
  for (let i = 0; i < 450; i++) h.frame();
  assert.equal(h.node('lfres').textContent, '0 (balanced)');
  assert.equal(h.node('lfa').textContent, '6.00');
  assert.equal(h.frames.size, 1);
  h.node('lfgo').onclick();
  assert.equal(h.frames.size, 0);
  assert.equal(h.node('lfgo').textContent, 'Drop again');
  h.node('lfgo').onclick();
  assert.equal(h.frames.size, 1);
  h.node('lfr').onclick();
  assert.equal(h.frames.size, 0);
  assert.equal(h.node('lfa').textContent, '0.00');
});

test('spring unload retains permanent extension; one new weight measures from original length', () => {
  const h = harness(); h.widgets.springLab(h.el, h.U);
  for (let i = 0; i < 8; i++) assert.equal(h.drags[i].onDrop(h.drags[i].chip), true);
  h.node('spoff').onclick();
  assert.match(h.node('spc').innerHTML, /Length now = 7\.0 cm/);
  assert.match(h.node('spc').innerHTML, /Permanent extension = 2\.0 cm/);
  assert.match(h.node('spgraph').innerHTML, /transform="translate\(0 230\)"/);
  assert.equal(h.drags[0].onDrop(h.drags[0].chip), true);
  assert.match(h.node('spc').innerHTML, /Length now = 9\.0 cm/);
  assert.match(h.node('spc').innerHTML, /Extension from the original length = <b>4\.0 cm<\/b>/);
  assert.match(h.node('spgraph').innerHTML, /transform="translate\(24 210\)"/); // 1 N, 4 cm on a 24 cm scale
  h.node('spnew').onclick();
  assert.match(h.node('spc').innerHTML, /Length now = 5\.0 cm/);
  assert.match(h.node('spc').innerHTML, /Extension from the original length = <b>0\.0 cm<\/b>/);
  assert.match(h.node('spgraph').innerHTML, /transform="translate\(0 250\)"/);
});

test('door push turns clockwise and stays within SVG at maximum settings', () => {
  const h = harness(); h.widgets.door(h.el, h.U);
  h.input(20, 1);
  const svg = h.node('dsvg').innerHTML;
  assert.match(svg, /rotate\(25 60 105\)/);
  assert.match(svg, /<arrow x1="350" y1="55" x2="350" y2="97"\/>/);
  assert.match(h.node('dc').innerHTML, /20 Nm/);
  const a = 25 * Math.PI / 180, pivot = { x: 60, y: 105 };
  const corners = [[60, 99], [350, 99], [350, 111], [60, 111], [350, 55], [350, 97]];
  for (const [x, y] of corners) {
    const xx = pivot.x + (x - pivot.x) * Math.cos(a) - (y - pivot.y) * Math.sin(a);
    const yy = pivot.y + (x - pivot.x) * Math.sin(a) + (y - pivot.y) * Math.cos(a);
    assert.ok(xx >= 0 && xx <= 420 && yy >= 0 && yy <= 260, `clipped point ${xx}, ${yy}`);
  }
});
