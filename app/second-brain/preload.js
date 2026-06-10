const { contextBridge, ipcRenderer } = require('electron');

// Minimal, safe surface for the renderer (contextIsolation on, nodeIntegration off).
contextBridge.exposeInMainWorld('sb', {
  onPlay: (cb) => ipcRenderer.on('intro:play', () => cb()),
  onFocus: (cb) => ipcRenderer.on('term:focus', () => cb()),
  win: {
    hide: () => ipcRenderer.send('win:hide'),
    minimize: () => ipcRenderer.send('win:minimize'),
    toggleMax: () => ipcRenderer.send('win:togglemax'),
  },
  term: {
    start: (cols, rows) => ipcRenderer.send('term:start', { cols, rows }),
    write: (data) => ipcRenderer.send('term:write', data),
    resize: (cols, rows) => ipcRenderer.send('term:resize', { cols, rows }),
    onData: (cb) => ipcRenderer.on('term:data', (_e, d) => cb(d)),
    onExit: (cb) => ipcRenderer.on('term:exit', () => cb()),
  },
});
