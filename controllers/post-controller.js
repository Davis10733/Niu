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

      const comment = ctx.request.body

      // Sending data into IPFS
      const files = await ctx.app.helpers.ipfs.add([{
        content: Buffer.from(JSON.stringify({ content: comment.content }))
      }])
      const ipfsHash = files[0].hash

      // Add record into ethereum
      const etherumEvents = await ctx.app.helpers.ethereum.createNewPost(ctx, ipfsHash, comment.address)

      // Add into mysql
      let post = await ctx.app.db.Post.findById(ctx.params.postId)

      let data = {
        ipfs_hash: ipfsHash,
        ...ctx.request.body
      }
      
      await post.createNewComment(data)

      ctx.body = await post.reload()

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
      post = post.toJSON()
      post = await ctx.app.helpers.ethereum.filterInvalidArticle(post)
      if (post == undefined) {
        ctx.throw(400, 'Invalid post')
      }
      post.Comments = await ctx.app.helpers.ethereum.filterInvalidArticle(post.Comments)

      post = await ctx.app.helpers.ipfs.getContent(post)
      post.Comments = await ctx.app.helpers.ipfs.getContent(post.Comments)

      ctx.body = post
    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  }
}
