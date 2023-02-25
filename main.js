const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const platformName = process.platform
const { exec } = require("child_process");
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH()
require('dotenv').config()

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
  ipcMain.handle('runCommand', executeTerminal);
  ipcMain.handle('platformName', () => {
    return process.platform;
  });
  ipcMain.handle('runSSHcommand', sshTransfer);
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}

app.whenReady().then(() => {
  createWindow()
})

function executeTerminal(event, cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve(error);
      }
      if (stderr) {
        resolve(stderr);
      }
      resolve(stdout);
    });
  })
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] }, (directory) => {
  })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

function sshTransfer(event, obj_info) {
  return new Promise((resolve, reject) => {
    const ssh = new NodeSSH()
    ssh.connect({
      host: process.env.SSH_HOST,
      username: process.env.SSH_USER,
      port: process.env.SSH_PORT,
      password: process.env.SSH_PASS,
      tryKeyboard: true,
    }).then((out) => {
      ssh.execCommand(`rm -rf ${obj_info.remote_url}/*`).then(() => {
        resolve(ssh.putDirectory(obj_info.dist, obj_info.remote_url))
      })
    }).catch((err) => {
      console.log("Not auth", err);
      resolve("not connected")
    })
  })
}