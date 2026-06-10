const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');
const { makeTerminal } = require('./terminal-embed');

app.setName('Second Brain');

const term = makeTerminal();
let win = null;
let tray = null;
let lastTrigger = 0;
let started = false;     // claude pty has been started at least once
let isQuitting = false;

function createWindow() {
  win = new BrowserWindow({
    width: 740, height: 560, show: false, frame: false, transparent: true,
    resizable: true, movable: true, alwaysOnTop: true, skipTaskbar: true,
    hasShadow: false, fullscreenable: false, minWidth: 520, minHeight: 380,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile(path.join(__dirname, 'renderer', 'intro.html'));
  win.on('close', (e) => { if (!isQuitting) { e.preventDefault(); win.hide(); } }); // keep the session alive
}

function positionOnActiveDisplay() {
  const disp = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const wa = disp.workArea;
  const h = Math.round(wa.height * 0.32);
  win.setBounds({ x: wa.x, y: wa.y, width: wa.width, height: h }); // top dropdown, full width
}

function summon() {
  const now = Date.now();
  if (now - lastTrigger < 350) return;       // debounce
  lastTrigger = now;
  if (!win) createWindow();
  if (win.isVisible()) { win.hide(); return; } // toggle off (session persists)
  positionOnActiveDisplay();
  win.show();
  win.setAlwaysOnTop(true, 'screen-saver');
  win.focus();
  win.webContents.send('intro:play');  // brief sphere intro every summon, then reveal the (persistent) chat
}

function buildTray(shortcutOk) {
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle(shortcutOk ? '◈' : '◈!');
  const menu = Menu.buildFromTemplate([
    { label: shortcutOk ? 'Second Brain — ⌥Space to summon' : '⚠︎ ⌥Space unavailable (in use)', enabled: false },
    { type: 'separator' },
    { label: 'Summon', click: summon },
    { label: 'Launch at login', type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (mi) => app.setLoginItemSettings({ openAtLogin: mi.checked }) },
    { type: 'separator' },
    { label: 'Quit Second Brain', click: () => app.quit() },
  ]);
  tray.setContextMenu(menu);
}

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();           // menu-bar app, no Dock icon
  createWindow();
  const ok = globalShortcut.register('Alt+Space', summon);
  buildTray(ok);
  // Login-at-login is opt-in via the tray checkbox — not forced on.

  ipcMain.on('term:start', (_e, { cols, rows }) => {
    started = true;
    term.start(cols, rows,
      (data) => { if (win && !win.isDestroyed()) win.webContents.send('term:data', data); },
      () => { started = false; if (win && !win.isDestroyed()) win.webContents.send('term:exit'); });
  });
  ipcMain.on('term:write', (_e, data) => term.write(data));
  ipcMain.on('term:resize', (_e, { cols, rows }) => term.resize(cols, rows));

  ipcMain.on('win:hide', () => { if (win) win.hide(); });
  ipcMain.on('win:minimize', () => { if (win) win.minimize(); });
  ipcMain.on('win:togglemax', () => { if (win) (win.isMaximized() ? win.unmaximize() : win.maximize()); });
});

// Single-instance: a second launch just summons the running one.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else app.on('second-instance', summon);

app.on('window-all-closed', (e) => e.preventDefault()); // stay alive in the tray
app.on('before-quit', () => { isQuitting = true; term.kill(); });
app.on('will-quit', () => globalShortcut.unregisterAll());
