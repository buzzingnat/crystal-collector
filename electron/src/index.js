const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
// Set this to true if building for steam
const useSteam = require('./isSteam');
let steamworks;
let client;
let mainWindow;

if (useSteam) {
  steamworks = require('steamworks.js');
  // console.log('steamworks, ', steamworks);

  try {
    client = steamworks.init();
  } catch (error) {
    console.log({error});
    client = steamworks.init(2560850);
    console.log('\n\n******\nForced app id\n******\n\n');
  }

  // console.log("client", client)
  console.log(client.localplayer.getName())
  // /!\ Those 3 lines are important for Steam compatibility!
  // app.commandLine.appendSwitch("in-process-gpu")
  // app.commandLine.appendSwitch("disable-direct-composition")
  // app.allowRendererProcessReuse = false
}

const isSteam = (useSteam) => {
  if (!useSteam) {
    console.log('STEAM IS NOT ENABLED');
    return false;
  }
  return true;
};

const hasClient = async (client) => {
  if (!client) {
    client = await steamworks.init(2560850);
    console.log('\n\n******\nSet app id\n******\n\n');
    return false;
  }
  return true;
};

const handleSteamLogUser = async (event) => {
  if (!isSteam(useSteam) && !hasClient(client)) {
    return;
  }

  const result = await client.localplayer.getName();
  return result;
}

const handleFetchSteamAchievements = async (event, achievementName) => {
  if (!isSteam(useSteam) && !hasClient(client)) {
    return;
  }

  const result = await client.achievement.isActivated(achievementName);
  return result;
}

const handleSetSteamAchievements = async (event, achievementName) => {
  if (!isSteam(useSteam) && !hasClient(client)) {
    return;
  }

  const result = await client.achievement.activate(achievementName);
  return result;
}

const handleClearSteamAchievements = async (event, achievementName) => {
  if (!isSteam(useSteam) && !hasClient(client)) {
    return;
  }

  const result = await client.achievement.clear(achievementName);
  return result;
}
// end steam code

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createMainWindow = () => {
  // add listener for the quit/close button
  ipcMain.on('close-app', handleCloseApp);
  // add listener for the steam user
  ipcMain.handle('steam-log-user', handleSteamLogUser);
  ipcMain.handle('steam-fetch-steam-achievements', handleFetchSteamAchievements);
  ipcMain.handle('steam-set-steam-achievements', handleSetSteamAchievements);
  ipcMain.handle('steam-clear-steam-achievements', handleClearSteamAchievements);
  // ipcMain.on('steam-activate-overlay', (event) => {
  //   console.log('\n****\nsteam-activate-overlay\n');
  //   console.log({overlay: client.overlay});
  //   client.overlay.activateDialog(6);
  // });

  ipcMain.on('window-app', handleWindowApp);
  ipcMain.on('fullscreen-app', handleFullscreenApp);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // /!\ Those two options are needed for Steamworks to behave
      // nodeIntegration: true,
      // contextIsolation: false,
    },
    icon: '/app-icons/icon.png',
  });
  // mainWindow.hide();
  // mainWindow.show();

  // load the loading.html of the app
  // mainWindow.loadFile(path.join(__dirname, '../out-resources/loading.html'));

  // load the index.html of the app.
  // setTimeout(() => {
  mainWindow.loadFile(path.join(__dirname, '../out-resources/index.html'));
  // }, 10);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

const handleCloseApp = (isClosed) => {
  if (isClosed) {
    app.quit();
  }
};

const handleWindowApp = (isWindowed) => {
  if (isWindowed && mainWindow) {
    mainWindow.setFullScreen(false);
    // win.setSize(width, height)
    // mainWindow.setSize(800, 600);
    mainWindow.setBounds({width: 800, height: 600 })
    mainWindow.center();
    mainWindow.setAutoHideMenuBar(false);
    mainWindow.titleBarStyle = 'default';
    mainWindow.titleBarOverlay = true;
    console.log('exit fullscreen, enter windowed view');
  }
};

const handleFullscreenApp = (isFullscreen) => {
  if (isFullscreen && mainWindow) {
    mainWindow.setFullScreen(true);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.titleBarStyle = 'hidden';
    mainWindow.titleBarOverlay = true;
    console.log('exit windowed, enter fullscreen view');
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  mainWindow = createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

// if (useSteam) steamworks.electronEnableSteamOverlay();
