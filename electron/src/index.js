const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
// Set this to true if building for steam
const useSteam = require('./isSteam');
let steamworks;
let client;

if (useSteam) {
  steamworks = require('steamworks.js');
  // console.log('steamworks, ', steamworks);

  try {
    client = steamworks.init();
  } catch (error) {
    console.log(error);
    client = steamworks.init(480);
    console.log('\n\n******\nNow playing as the demo app Spacewar\n******\n\n');
  }

  // console.log("client", client)
  console.log(client.localplayer.getName())
  // /!\ Those 3 lines are important for Steam compatibility!
  app.commandLine.appendSwitch("in-process-gpu")
  app.commandLine.appendSwitch("disable-direct-composition")
  app.allowRendererProcessReuse = false
}

const handleSteamLogUser = async (event) => {
  if (!useSteam) {
    return console.log('STEAM IS NOT ENABLED');
  }

  if (!client) {
    client = await steamworks.init(480);
    console.log('\n\n******\nNow playing as the demo app Spacewar\n******\n\n');
  }
  const result = await client.localplayer.getName();
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
};

const handleCloseApp = (isClosed) => {
  if (isClosed) {
    app.quit();
  }
};

const handleWindowApp = (isWindowed) => {
  if (isWindowed) {
    console.log('exit fullscreen, enter windowed view');
  }
};

const handleFullscreenApp = (isFullscreen) => {
  if (isFullscreen) {
    console.log('exit windowed, enter fullscreen view');
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
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
    createMainWindow();
  }
});

// if (useSteam) steamworks.electronEnableSteamOverlay();
