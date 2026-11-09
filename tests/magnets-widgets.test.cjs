const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../physics/magnets-widgets.js'), 'utf8');

function harness() {
  const nodes = new Map(), choices = new Map(), timers = new Map();
  let nextTimer = 1, rangeInput;
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: '', textContent: '', disabled: false, children: [], events: {},
      classList: { add() {}, remove() {}, toggle() {} },
      addEventListener(type, fn) { this.events[type] = fn; },
      insertAdjacentHTML(_position, html) { this.innerHTML += html; }
    });
    return nodes.get(id);
  }
  const el = {
    innerHTML: '', isConnected: true,
    querySelector(selector) {
      if (selector.startsWith('[data-k=')) return node('emlog').innerHTML.includes(selector.slice(9, -2)) ? node('emlog') : null;
      return node(selector.slice(1));
    }
  };
  node('bst').children = Array.from({ length: 4 }, () => ({ classList: { toggle() {} } }));
  const Kit = {
    choices(box, labels, onPick, start) { choices.set(box.id, { labels, set: onPick }); if (start != null) onPick(start); },
    range() { return '<input type="range">'; },
    ranges(_el, fn) { rangeInput = fn; fn([3]); }
  };
  const context = {
    window: { Kit },
    setTimeout(fn, delay) { const id = nextTimer++; timers.set(id, { fn, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(source, context, { filename: 'magnets-widgets.js' });
  function tick() {
    const [id, job] = timers.entries().next().value || [];
    assert.ok(job, 'expected pending timer');
    timers.delete(id); job.fn();
  }
  return { widgets: context.window.MagnetWidgets, el, node, choices, timers, tick, input: v => rangeInput([v]) };
}

test('bell phases keep the held push separate from the make and break contact', () => {
  const h = harness(); h.widgets.bellSim(h.el, {});
  const svg = () => h.node('bstage').innerHTML;
  assert.match(svg(), /M70 340 L96 385/);
  h.node('bellpush').events.pointerdown({ preventDefault() {} });
  assert.match(svg(), /M70 340 L70 400/);
  assert.match(svg(), /rotate\(0 345 90\)/);
  h.tick();
  assert.match(svg(), /rotate\(7 345 90\)/);
  assert.match(svg(), /Q374 156 364 170/);
  assert.equal(h.node('brn').textContent, 1);
  h.tick();
  assert.match(svg(), /M70 340 L70 400/);
  assert.match(svg(), /Q348 156 343 170/);
  assert.match(svg(), /stroke="#9ca3af"/);
  h.tick();
  assert.match(svg(), /rotate\(0 345 90\)/);
  assert.match(svg(), /Q374 156 364 170/);
  assert.match(svg(), /stroke="#dc2626"/);
  h.node('bellpush').events.pointerup();
  h.tick();
  assert.match(svg(), /M70 340 L96 385/);
});

test('electromagnet pickup stops on switch off and configuration change', () => {
  const h = harness(); h.widgets.buildEM(h.el, {});
  h.node('emon').onclick();
  assert.equal(h.timers.size, 1);
  h.tick();
  h.node('emoff').onclick();
  assert.equal(h.timers.size, 0);
  assert.doesNotMatch(h.node('emvd').innerHTML, /steel/);
  assert.doesNotMatch(h.node('emsvg').innerHTML, /translate\(130 128\)/);
  h.node('emon').onclick();
  h.choices.get('emv').set(2);
  h.choices.get('emo').set(1); // steel
  assert.equal(h.timers.size, 0);
  h.node('emon').onclick();
  h.tick();
  h.node('emoff').onclick();
  assert.equal(h.timers.size, 0);
  assert.match(h.node('emvd').innerHTML, /steel.*2 clips/);
  assert.match(h.node('emsvg').innerHTML, /translate\(130 128\)/);
  h.node('emon').onclick();
  h.el.isConnected = false;
  h.tick();
  assert.equal(h.timers.size, 0);
});

test('breaker contacts touch normally, separate when tripped, and retrip at high current', () => {
  const h = harness(); h.widgets.breaker(h.el, {});
  const svg = () => h.node('cbsvg').innerHTML;
  assert.match(svg(), /M140 120 L230 100/);
  assert.match(svg(), /rotate\(0 140 120\)/);
  assert.match(svg(), /<rect x="226" y="96" width="8" height="8" fill="#d97706"\/>/);
  assert.match(svg(), /M120 60 L120 20 L60 20/);
  h.input(8); h.tick();
  assert.match(svg(), /rotate\(-18 140 120\)/);
  assert.match(svg(), /circuit broken: no current/);
  h.node('cbr').onclick();
  assert.match(svg(), /rotate\(0 140 120\)/);
  h.tick();
  assert.match(svg(), /rotate\(-18 140 120\)/);
});
