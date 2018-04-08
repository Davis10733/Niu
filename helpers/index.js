const ipfs = require('./ipfs-helper')

module.exports = (app) => {
  app.helpers = {
    ipfs
  }
}
