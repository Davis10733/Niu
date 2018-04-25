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
      }
    } catch (e) {
      console.log(e)
      ctx.throw(500)
    }
  }, 
}
