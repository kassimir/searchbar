const ipc = require('electron').ipcRenderer

const exec = c => ipc.send('exec', c)
const fs = (...args) => ipc.sendSync('fs', args)

module.exports = {
  exec, fs
}