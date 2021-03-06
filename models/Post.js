const ipfs = require('../helpers/ipfs-helper.js')
const db = ipfs.db['insider.post']
const moment = require('moment')
const Tag = require('./Tag.js')
const Comment = require('./Comment.js')
const uuidv4 = require('uuid/v4');
const Collection = require('./Collection.js')

class Post {
  constructor(post, tag = undefined, comment = undefined) {
    this.value = {}
    this.value.post = post
    this.value.tags = tag
    this.value.comments = comment
    this.id = post._id
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
          _id: uuidv4(),
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
    return new Post(post[0], tags, comments)
  }

  static findAll() {
    let posts = db.query((doc) => doc.createdAt > 0)
    posts = posts.map(post => {
      return new Post(post)
    })

    return new Collection(...posts)
  }

  createNewComment(data) {
    return Comment.createNewComment({
      ...data,
      _id: uuidv4(),
      post_id: this.id,
      createdAt: moment().unix(),
    })
  }

  async reload() {
    this.value.tags = await Tag.findByPostId(this.id)
    this.value.comments = await Comment.findByPostId(this.id)
    let post = await db.get(this.id)
    return this
  }

  toJSON() {
    return {
      ...this.value
    }
  }
}

module.exports = Post
