const path = require('path')
const fs = require('fs')
const { exec } = require('./utils')
const { RPLOC } = require('./constants')

const config = {
  'primaryDirectories' : [
    'C:\\Games',
    'C:\\Program Files',
    'C:\\Program Files (x86)',
    'C:\\Windows'
  ],
  'commands' : {
    'cc': () => exec('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'),
    'rp': (flags) => {
      if (!flags.length) {
        console.log(fs.existsSync(path.join(RPLOC, 'rp.dll')))
      } else {
        console.log('flags: ', flags)
      }
    }
  }
}

module.exports = config
