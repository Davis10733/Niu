const fs = require('fs')

module.exports = {
  async post(ctx) {
    try {
      const files = await ctx.app.helpers.ipfs.add([{
        content: Buffer.from(JSON.stringify(ctx.request.body))
      }])

      ctx.body = files[0].hash
    } catch (e) {
      console.log(e)
    }
  }, 

  async get(ctx) {
    const path = ctx.request.query.path
    const files = await ctx.app.helpers.ipfs.files.cat(`/ipfs/${path}`)
    ctx.body = JSON.parse(files.toString())
  }
}
