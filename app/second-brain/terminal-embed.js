// Embedded-terminal engine: runs `claude` in a pty inside the glass window.
// node-pty is required lazily (only when no spawn is injected) so unit tests
// run under plain `node` without loading the Electron-ABI native binary.

const path = require('path');
const fs = require('fs');
const os = require('os');

// The repo root (two levels up from app/second-brain/) is the assistant's
// working directory — where CLAUDE.md, context/, wiki/ and workflows/ live.
const PA_DIR = process.env.SECOND_BRAIN_DIR || path.resolve(__dirname, '..', '..');

// Find the Claude Code binary: env override first, then common install
// locations, then fall back to whatever `claude` resolves to on PATH.
function findClaudeBin() {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const candidates = [
    path.join(os.homedir(), '.local', 'bin', 'claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
  ];
  for (const c of candidates) {
    try { fs.accessSync(c, fs.constants.X_OK); return c; } catch (_) {}
  }
  return 'claude'; // resolved via PATH inside the login shell
}

const CLAUDE_BIN = findClaudeBin();

function buildCommand(paDir = PA_DIR, claudeBin = CLAUDE_BIN) {
  return `cd '${paDir}' && exec '${claudeBin}'`;
}

function makeTerminal({ spawn, paDir = PA_DIR, claudeBin = CLAUDE_BIN } = {}) {
  const doSpawn = spawn || ((file, args, opts) => require('node-pty').spawn(file, args, opts));
  let proc = null;

  return {
    start(cols, rows, onData, onExit) {
      if (proc) return proc;
      proc = doSpawn('/bin/zsh', ['-ilc', buildCommand(paDir, claudeBin)], {
        name: 'xterm-256color', cols: cols || 80, rows: rows || 24, cwd: paDir, env: process.env,
      });
      if (onData) proc.onData(onData);
      proc.onExit((e) => { proc = null; if (onExit) onExit(e); });
      return proc;
    },
    write(data) { if (proc) proc.write(data); },
    resize(cols, rows) { if (proc) { try { proc.resize(cols, rows); } catch (_) {} } },
    kill() { if (proc) { try { proc.kill(); } catch (_) {} proc = null; } },
    isRunning() { return !!proc; },
  };
}

module.exports = { makeTerminal, buildCommand, PA_DIR, CLAUDE_BIN };
