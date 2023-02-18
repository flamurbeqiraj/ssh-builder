const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const platformName = process.platform

const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    },
  })
  win.removeMenu();

  win.loadFile('pages/dashboard/dashboard.html')

  win.webContents.openDevTools()
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('build_progress', (event, argument) => {
    console.log(argument);
    win.setProgressBar(argument)
  });
  ipcMain.handle('platformName', () => {
    return process.platform;
  });
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}

app.whenReady().then(() => {
  createWindow()
})

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] }, (directory) => {
  })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}