const ipfs = require('../helpers/ipfs-helper.js')
const db = ipfs.db['insider.tag']

class Tag {
  static async createNewTag(data) {
    return db.put(data)
  }

  static async findByPostId(id) {
    return db.query((doc) => doc.post_id == id )
  }
}

module.exports = Tag
