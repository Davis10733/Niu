const ipfs = require('./ipfs-helper')
const ethereum = require('./ethereum-helper')

module.exports = (app) => {
  app.helpers = {
    ipfs,
    ethereum,
  }
}
