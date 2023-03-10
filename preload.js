const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    updateProgress: (val) => ipcRenderer.invoke('build_progress', val),
    getPlatformName: (name) => ipcRenderer.invoke('platformName', name),
    execCommand: (cmd) => ipcRenderer.invoke('runCommand', cmd),
    sshFilesTransfer: (bck) => ipcRenderer.invoke('runSSHcommand', bck),
    createEnvFile: (bck) => ipcRenderer.invoke('runEnvFileCreator', bck),
    createUniqueUUID: () => ipcRenderer.invoke('createUUID'),
    createFullBackup: (cont) => ipcRenderer.invoke('createFullBackupFile', cont)
})