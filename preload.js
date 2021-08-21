// APP SHIT
// Full list of available icons
const list = require('./iconlist')
// My jQuery
const q = ele => document.querySelector(ele)
// Config for commands
const config = require('./config')
// Util functions
const { quit, isLetter } = require('./utils')
// Constants
const defaultBrowser = require('./constant').BROWSER.DEFAULT


const { exec, fs } = require('./api')

// CONSTANTS
// the bar
const BAR = q('#bar')

// the icon
const ICON = q('#icon')

// search types
const SEARCHTYPE = {
  drive: 'drive',
  internet: {
    google: 'google',
    bing: 'bing'
  }
}

// zero keeps track of whether the icon has changed since its original random creation
// I don't know why I named it zero, but it's named, and I'm not changing it
let zero = true

// keep track of the search type
let searchType = null

// keep track of backspaces for removing search type
let backspaceCount = 0


// FUNCTIONS

/*
   Adding some string functionality, because why not?
   This is basically just substr but starting from 0 and lowercasing
   ln: length of the string to return
   opts:
     start: where to start the substr, default is 0
     lc: boolean for making string lowercase, default is true
*/
String.prototype.select = function(ln, ...opts) {
  let start = 0, lc = true
  if (opts.length) {
    if (opts.length === 1) {
      if (opts[0] === false) lc = false
      else if (Number.isInteger(opts[0])) start = opts[0]
    } else if (opts.length === 2) {
      if (opts[0] === false || opts[1] === false) lc = false
      if (Number.isInteger(opts[0])) start = opts[0]
      else if (Number.isInteger(opts[1])) start = opts[1]
    }
  }
  return lc ? this.substr(start, ln).toLowerCase() : this.substr(start, ln)
}

/*
  This may shock you, but this is used to change the icon
  cls: class name
  TODO: update to allow for other class types besides fas fa-[class]
*/
const changeIcon = cls => {
  if (ICON.classList.length === 3) ICON.classList.remove(ICON.classList[2])
  ICON.classList.add(`fa-${cls}`)
  zero = false
}

// random icon... because it's fun!
const randIcon = () => {
  const r = Math.floor(Math.random() * 979)
  changeIcon(list[r])
}

/*
  Function to reset icon (random) and bar
*/
const reset = () => {
  searchType = null
  zero = true
  backspaceCount = 0
  BAR.value = ''
  randIcon()
}

window.addEventListener('DOMContentLoaded', () => {
  if (ICON.classList.length === 3) return
  randIcon()
})

const keydown = e => {
  if (searchType === 'drive' && !BAR.value && isLetter(e.key)) {
    e.preventDefault()
    BAR.value = e.key.toUpperCase() + ':\\ '
  }
  if (e.key !== 'Backspace') return
  if (!searchType) return

  if (searchType && BAR.value.length === 4) {
    e.preventDefault()
    if (!backspaceCount) backspaceCount++
    // Removes the searchType if pressed twice while no value is in the bar
    else reset()
  }
}

const keyup = e => {
  const key = e.key
  const sub = BAR.value

  switch (key) {
    // This will go away when completed
    case 'Escape': return quit()
    // Submits the value
    case 'Enter': return submit(sub)
    case 'Backspace': return
    default: break
  }

  // if something other than backspace is typed, reset the counter
  // for "zeroing out" the searchType
  backspaceCount = 0

  // If it's passed all the checks but is blank, just let it be blank
  if (!sub) return

  // if one was to then backspace and start typing, then just reset it all
  // don't fuck with my auto-code!
  if (sub.length === 4) {
    if (searchType === 'drive' && sub[3] !== ' ') return reset()
  }

  if (searchType) return

  // List of commands, if there is no search type

  // blank box
  if (!sub) {
    // icon has changed form its original
    if (!zero) {
      // reset it to a random icon
      randIcon()
      // don't let it randomize again until it's changed again
      zero = true
    }
  } else if (sub.select(2) === 'g ')     // google search
    setSearchType(SEARCHTYPE.internet.google, 'search')
  else if (sub.select(2) === 'b ')     // bing search
    setSearchType(SEARCHTYPE.internet.bing, 'search')
  else if (sub.select(5) === 'drive')    // 'drive' = search specific drive
    setSearchType(SEARCHTYPE.drive, 'hdd')
}

const setSearchType = (type, icon) => {
  searchType = type
  BAR.value = ''
  changeIcon(icon)
}

const submit = sub => {
  sub = sub.trim()

  // google search
  if (searchType === 'google') return exec(`${defaultBrowser} http://google.com/search?q=${sub}`)
  if (searchType === 'bing') return exec(`${defaultBrowser} http://google.com/search?q=${sub}`)

  // Check if removing spaces makes it the same length... if so, it has flags, otherwise, it doesn't
  const hasFlags = sub.length !== sub.replace(/\s/, '').length

  // Get those flags
  const getFlags = fullCommand => fullCommand.slice(fullCommand.match(/\s/).index +1).split(/\s/)
  // Get the command from the flags
  const getCmd = fullCommand => fullCommand.slice(0, fullCommand.match(/\s/).index)
  // The command depending on whether or not flags exist
  const cmd = hasFlags ? getCmd(sub) : sub
  // The flags, if they exist
  const flags = hasFlags ? getFlags(sub) : null

  return config.commands[cmd](flags)
}
