const fs = require('fs')

module.exports = {
  async post(ctx) {
    try {
      await ctx.app.schemas.post.create(ctx.request.body)
        .catch((e) => {
          ctx.throw(400, e.message)
        })

      let user = await ctx.app.helpers.redis.client.getAsync(ctx.request.auth.email)
      user = JSON.parse(user)

      let post = {
        ...ctx.request.body,
        author: user.username,
        publicKey: user.address
      }

      // Saving data
      let doc = await ctx.app.db.Post.createNewPost(post)

      // Add record into ethereum
      const etherumEvents = await ctx.app.helpers.ethereum.createNewPost(ctx, doc.ipfsHash, user.address)

      ctx.body = {
        post: {
          ...doc,
        },
        success: true
      }

    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  },

  async comment(ctx) {
    try {
      await ctx.app.schemas.comment.create(ctx.request.body)
        .catch(e => {
          ctx.throw(400, e.message)
        })

      const comment = {
        ...ctx.request.body,
        publicKey: ctx.request.auth.address
      }

      // Add into orbitdb
      let post = await ctx.app.db.Post.findById(ctx.params.postId)
      let ipfsHash = await post.createNewComment(comment)

      // Add record into ethereum
      const etherumEvents = await ctx.app.helpers.ethereum.createNewPost(ctx, ipfsHash, comment.publicKey)

      await post.reload()
      ctx.body = post.toJSON()

    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  },

  async get(ctx) {
    try {
      let post = await ctx.app.db.Post.findById(ctx.params.postId)
      if (post == undefined) {
        ctx.throw(404, 'Post notfound')
      }

      ctx.body = post
    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  },

  async list(ctx) {
    try {
      let posts = await ctx.app.db.Post.findAll()
      ctx.body = posts
    } catch (e) {
      console.log(e) 
      ctx.throw(e.status, e.message)
    }
  
  }
}
