const fs = require('fs')

module.exports = {
  async post(ctx) {
    try {
      const files = await ctx.app.helpers.ipfs.add([{
        content: Buffer.from(JSON.stringify(ctx.request.body))
      }])

      const ipfsHash = files[0].hash
      
      const etherumEvents = await ctx.app.helpers.ethereum.createNewPost(ctx, ipfsHash, ctx.request.body.writer)

      ctx.body = {
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
