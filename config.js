const path = require('path')
const { exec, fs } = require('./api')
const constants = require('./globals')

const config = {
  'indexDirectories' : [
    'C:\\Games'
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
