const ipfs = require('./ipfs-helper')
const user = require('./user-helper')
const redis = require('./redis-helper')

module.exports = app => {
  app.helpers = {
    ipfs,
    user,
    redis
  }
}
