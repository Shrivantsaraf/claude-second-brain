const { test } = require('node:test');
const assert = require('node:assert');
const { makeTerminal, buildCommand } = require('../terminal-embed');

function fakeProc() { return { onData() {}, onExit() {}, write() {}, resize() {}, kill() {} }; }

test('buildCommand cds into the project and execs claude', () => {
  const cmd = buildCommand('/tmp/PA', '/bin/claude');
  assert.match(cmd, /cd '\/tmp\/PA'/);
  assert.match(cmd, /exec '\/bin\/claude'/);
});

test('start() spawns a login zsh with the command and given size', () => {
  let got = null;
  const spawn = (file, args, opts) => { got = { file, args, opts }; return fakeProc(); };
  const term = makeTerminal({ spawn, paDir: '/tmp/PA', claudeBin: '/bin/claude' });
  term.start(100, 30, () => {}, () => {});
  assert.equal(got.file, '/bin/zsh');
  assert.deepEqual(got.args, ['-ilc', "cd '/tmp/PA' && exec '/bin/claude'"]);
  assert.equal(got.opts.cols, 100);
  assert.equal(got.opts.rows, 30);
});

test('start() is idempotent while running', () => {
  let calls = 0;
  const spawn = () => { calls++; return fakeProc(); };
  const term = makeTerminal({ spawn });
  term.start(80, 24, () => {}, () => {});
  term.start(80, 24, () => {}, () => {});
  assert.equal(calls, 1);
  assert.equal(term.isRunning(), true);
});
