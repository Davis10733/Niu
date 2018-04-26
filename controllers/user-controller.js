const fs = require('fs')

module.exports = {
  async create(ctx) {
    try {

      await ctx.app.schemas.user.create(ctx.request.body)
        .catch((e) => {
          ctx.throw(400, 'Invalid request')
        })
      
      const userObject = await ctx.app.helpers.user.createUserObject(ctx)
      
      await ctx.app.db.users.create(userObject)

      // sending email
      await ctx.app.helpers.mail.sendActiveMail(userObject)

      ctx.body = {
        'status' : 'success'
  async active(ctx) {
    try {
      await ctx.app.schemas.user.active(ctx.request.body)
        .catch ((e) => {
          ctx.throw(400, e.message)
        })

      let user = await ctx.app.db.users.findByEmail(ctx.request.body.email)
      if (user == undefined) {
        ctx.throw(404, 'user not found')
      }

      if (user.activeCode !== parseInt(ctx.request.body.activeCode)) {
        ctx.throw(400, 'Active code is not correct')
      }

      ctx.body = {
        'message': 'success'
      }
    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  }
}
