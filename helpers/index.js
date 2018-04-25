const ipfs = require('./ipfs-helper')
const ethereum = require('./ethereum-helper')
const user = require('./user-helper')
const mail = require('./mail-helper')

module.exports = (app) => {
  app.helpers = {
    ipfs,
    ethereum,
    user,
    mail,
  }
}
