// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const spawn = require('child_process').spawn;
const fs = require('fs')


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 563,
    height: 61,
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    frame: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    opacity: .7,
    transparent: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('msg', (e, a) => {
  if (a === 'quit') app.quit()
  else console.log(a)
})

ipcMain.on('exec', (e, a) => {
  const cmd = spawn(a);
  //  const ahk = spawn('C:\\Program Files\\AutoHotkey\\Autohotkey.exe', [__dirname + '\\hide.ahk'])

  cmd.on('close', (code) => {
    if (!code) console.log(`Successfully ran command`);
    else console.log('Oh shit! ', code)
  });

  // ahk.on('close', (code) => {
  //   if (!code) console.log(`Successfully ran command`);
  //   else console.log('Oh shit! ', code)
  // });
})

ipcMain.on('fs', (e, a) => {
  const ret = fs[a[0]](a[1])
  console.log(ret)
  e.returnValue = ret
})
