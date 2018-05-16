const config =  require('../config')
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI(config.ipfs.host, config.ipfs.port, {protocol: 'http'})

ipfs.getContent = async(items) => {
  if (!(items instanceof Array)) {
    let content = await ipfs.files.cat(`/ipfs/${items.ipfs_hash}`)
    content = JSON.parse(content.toString())
    return {
      ...items,
      ...content,
    }
  }

  items = items.map(async(item) => {
    let content = await ipfs.files.cat(`/ipfs/${item.ipfs_hash}`)
    content = JSON.parse(content.toString())

    return {
      ...item,
      ...content,
    }
  })

  return items
}
module.exports = ipfs
