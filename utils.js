const ipc = require('electron').ipcRenderer
const e = require('child_process').exec

// Messaging

// Quit function
const quit = () => ipc.send('msg', 'quit')

/*
  Execute function
  c: command to execute
*/
const exec = c => {
  ipc.send('exec', c)
}

const isLetter = (val) => {
  if (typeof val !== 'string') return false
  val = val.toLowerCase()
  return (
    val === 'a' ||
    val === 'b' ||
    val === 'c' ||
    val === 'd' ||
    val === 'e' ||
    val === 'f' ||
    val === 'g' ||
    val === 'h' ||
    val === 'i' ||
    val === 'j' ||
    val === 'k' ||
    val === 'l' ||
    val === 'm' ||
    val === 'n' ||
    val === 'o' ||
    val === 'p' ||
    val === 'q' ||
    val === 'r' ||
    val === 's' ||
    val === 't' ||
    val === 'u' ||
    val === 'v' ||
    val === 'w' ||
    val === 'x' ||
    val === 'y' ||
    val === 'z'
  )
}

module.exports = {
  quit, exec, isLetter
}