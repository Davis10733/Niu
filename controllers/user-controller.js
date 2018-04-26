const fs = require('fs')

module.exports = {
  async create(ctx) {
    try {

      await ctx.app.schemas.user.create(ctx.request.body)
        .catch((e) => {
          ctx.throw(400, 'Invalid request')
        })

      let user = await ctx.app.db.users.findByEmail(ctx.request.body.email)
      
      if (user !== undefined) {
        if (user.address !== undefined) {
          ctx.throw(400, 'This email has been already registered')
        }
        const userObject = await ctx.app.helpers.user.createUserObject(ctx)
        await user.update(userObject)
        ctx.body = {
          'message': 'success'
        }
        return
      }
      
      const activeCode = Math.floor(Math.random() * Math.floor(10000))
      const userObject = {
        email: ctx.request.body.email,
        activeCode: activeCode,
      }

      await ctx.app.db.users.create(userObject)

      // sending email
      await ctx.app.helpers.mail.sendActiveMail(userObject)

      ctx.body = {
        'message' : 'success'
      }
    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  },
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
