const ipfs = require('../helpers/ipfs-helper.js')
const db = ipfs.db['insider.comment']

class Comment {
  static async createNewComment(data) {
    return db.put(data)
  }

  static async findByPostId(postId) {
    return db.query((doc) => doc.post_id == postId )
  }
}

module.exports = Comment
