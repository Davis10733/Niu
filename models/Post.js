const ipfs = require('../helpers/ipfs-helper.js')
const db = ipfs.db['insider-test.post']
const moment = require('moment')
const Tag = require('./Tag.js')
const Comment = require('./Comment.js')
const uuidv4 = require('uuid/v4');

class Post {
  constructor(post, tag = undefined, comment = undefined) {
    this.value = {}
    this.value.post = post[0]
    this.value.tags = tag
    this.value.comments = comment
    this.id = post[0]._id
  }

  static async createNewPost(data) {

    let tagsData = [];
    if (data.tags !== undefined) {
      tagsData = data.tags;
      data.tags = undefined;
    }
    let doc = {
      _id: uuidv4(),
      ...data,
      createdAt: moment().unix(),
    }

    const hash = await db.put(doc)

    if (tagsData.length > 0) {
      await Promise.all(tagsData.map(tag => {
        return Tag.createNewTag( {
          _id: `${hash}-${tag}`,
          key: 'meta',
          value: tag,
          post_id: doc._id,
          createdAt: moment().unix(),
        })
      }))
    }

    return {
      ipfsHash: hash,
      ...doc
    }
  }

  static async findById(id) {
    let tags = await Tag.findByPostId(id)
    let comments = await Comment.findByPostId(id)
    let post = await db.get(id)
    return new Post(post, tags, comments)
  }

  createNewComment(data) {
    return Commment.createNewComment({
      ...data,
      post_id: this.id
    })
  }

  toJSON() {
    return {
      ...this.value
    }
  }
}

module.exports = Post
