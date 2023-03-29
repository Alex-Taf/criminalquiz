import { join } from "path";
import { app, BrowserWindow, ipcMain, session } from "electron";

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, "../preload/preload.js")
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000"); // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../../../../index.html"));
  }
  // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
  //     isDev ?
  //     'http://localhost:3000' :
  //     join(__dirname, '../../index.html')
  // );
}

//app.enableSandbox();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

ipcMain.handle("potd", async (event, mess) => {
  try {
    return `Server is running on port ${4000}.`;
  } catch (error) {
    return error;
  }
});

// ipcMain.handle("potd", async (event, dbPath) => {
//   try {
//     return await setdbPath(dbPath);
//   } catch (error) {
//     return error
//   }
// })

// ipcMain.handle("executeQuery", async (event, query, fetch, value) => {
//   try {
//     return await executeQuery(query, fetch, value);
//   } catch (error) {
//     return error
//   }
// })

// ipcMain.handle("executeMany", async (event, query, values) => {
//   try {
//     return await executeMany(query, values);
//   } catch (error) {
//     return error
//   }
// })

// ipcMain.handle("executeScript", async (event, scriptpath) => {
//   try {
//     return await executeScript(scriptpath);
//   } catch (error) {
//     return error
//   }
// })
