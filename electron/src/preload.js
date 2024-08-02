// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setCloseButton: (isClosed) => ipcRenderer.send('close-app', isClosed),
  setWindowedButton: (isWindowed) => ipcRenderer.send('window-app', isWindowed),
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
  steamFetchSteamAchievements: (achievementName) => {
    ipcRenderer.invoke('steam-fetch-steam-achievements', achievementName)
      .then((response) => {
        return console.log('steam-fetch-steam-achievements: ', achievementName, ', ', response)
      })
  },
  steamSetSteamAchievements: (achievementName) => {
    ipcRenderer.invoke('steam-set-steam-achievements', achievementName)
      .then((response) => {
        return console.log('steam-set-steam-achievements: ', achievementName, ', ', response)
      })
  },
  steamClearSteamAchievements: (achievementName) => {
    ipcRenderer.invoke('steam-clear-steam-achievements', achievementName)
      .then((response) => {
        return console.log('steam-clear-steam-achievements: ', achievementName, ', ', response)
      })
  },
})
