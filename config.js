const path = require('path')
const { exec, fs } = require('./api')
const constants = require('./constant')

const config = {
  'primaryDirectories' : [
    'C:\\Games',
    'C:\\Program Files',
    'C:\\Program Files (x86)',
    'C:\\Windows'
  ],
  'commands' : {
    'cc': () => exec(constants.BROWSER.CHROME),
    'rp': (flags) => {
      if (!flags.length) {
        const yayornay = fs('existsSync', path.join(constants.RPLOC, 'rp.dll'))
        console.log('yay or nay: ', yayornay)
      } else {
        console.log('flags: ', flags)
      }
    }
  }
}

module.exports = config
