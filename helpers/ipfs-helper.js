const config =  require('../config')
const ipfsAPI = require('ipfs-api')
const OrbitDB = require('orbit-db')
const ipfs = ipfsAPI(config.ipfs.host, config.ipfs.port, {protocol: 'http'})
const orbitdb = new OrbitDB(ipfs)

module.exports = {
  ipfsApi: ipfs,
  orbitdb: orbitdb,
  db: {}
}
