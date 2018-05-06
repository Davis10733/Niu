const fs = require('fs')

module.exports = {
  async post(ctx) {
    try {
      await ctx.app.schemas.post.create(ctx.request.body)
        .catch((e) => {
          ctx.throw(400, e.message)
        })

      let user = await ctx.app.db.User.findByAddress(ctx.request.auth.address)

      let post = {
        ...ctx.request.body,
        author: user.username,
        publicKey: user.address
      }

      // Sending data into IPFS
      const files = await ctx.app.helpers.ipfs.add([{
        content: Buffer.from(JSON.stringify(post))
      }])
      const ipfsHash = files[0].hash

      // Add record into ethereum
      const etherumEvents = await ctx.app.helpers.ethereum.createNewPost(ctx, ipfsHash, user.address)

      // Add index in mysql
      const postModel = await ctx.app.db.Post.createNewPost({
        title: post.title,
        ipfs_hash: ipfsHash,
        tags: post.tags,
      })

      ctx.body = {
        post: postModel,
        success: true
      }

    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  }, 

  async get(ctx) {
    const path = ctx.request.query.path
    const files = await ctx.app.helpers.ipfs.files.cat(`/ipfs/${path}`)
    ctx.body = JSON.parse(files.toString())
  }
}
