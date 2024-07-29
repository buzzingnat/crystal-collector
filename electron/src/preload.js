// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setCloseButton: (isClosed) => ipcRenderer.send('close-app', isClosed),
  setWindowedButton: (isWindow) => ipcRenderer.send('window-app', isWindow),
  setFullscreenButton: (isFullscreen) => ipcRenderer.send('fullscreen-app', isFullscreen),
})

contextBridge.exposeInMainWorld('steamAPI', {
  steamLogUser: () => {
    ipcRenderer.invoke('steam-log-user')
      .then((response) => {
        return console.log('steam-log-user: ', response)
      })
  },
  activateOverlay: () => {
    ipcRenderer.send('steam-activate-overlay')
  },
})
