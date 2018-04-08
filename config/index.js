const _ = require('lodash')

module.exports = {
  server: {
    port: normalizePort(_.defaultTo(process.env.PORT, 3000))
  },
  ipfs: {
    host: _.defaultTo(process.env.IPFS_HOST, 'localhost'),
    port: normalizePort(_.defaultTo(process.env.IPFS_PORT, 3000)),
  }
}



function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
        return val
      }

  if (port >= 0) {
        return port
      }

  return false
}
