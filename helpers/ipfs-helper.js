const config =  require('../config')
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI(config.ipfs.host, config.ipfs.port, {protocol: 'http'})

module.exports = ipfs
