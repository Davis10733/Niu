const fs = require('fs')

module.exports = {
  async create(ctx) {
    try {

      const etherumEvents = await ctx.app.helpers.ethereum.registerNewWriter(ctx)

      ctx.body = {
        'status' : 'success'
      }
    } catch (e) {
      console.log(e)
    }
  }, 
}
