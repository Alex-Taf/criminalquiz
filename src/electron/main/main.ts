import { join } from "path";
import { app, BrowserWindow, ipcMain } from "electron";
// import * as remoteMain from '@electron/remote/main';
// remoteMain.initialize();

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
  // Create the browser window.
  const splashWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true
  })

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "../preload/preload.js")
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    splashWindow.loadURL("http://localhost:3000/loading/splash/index.html")
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.once('dom-ready', () => {
      splashWindow.hide()
      mainWindow.show()
      // Open the DevTools.
      mainWindow.webContents.openDevTools();
    })
  } else {
    splashWindow.loadFile(join(__dirname, "../../../loading/splash/index.html"))
    mainWindow.loadFile(join(__dirname, "../../../index.html"));
    mainWindow.webContents.once('dom-ready', () => {
      splashWindow.hide()
      mainWindow.show()
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Menu setting
// Menu.setApplicationMenu(Menu.buildFromTemplate([
//   {
//     label: 'Программа',
//     submenu: [
//       { label: 'Выход', role: 'quit' }
//     ]
//   }
// ]))

