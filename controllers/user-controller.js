const fs = require('fs')

module.exports = {
  async create(ctx) {
    try {

      await ctx.app.schemas.user.create(ctx.request.body)
        .catch((e) => {
          ctx.throw(400, 'Invalid request')
        })
 
      const userObject = await ctx.app.helpers.user.createUserObject(ctx)

      fs.writeFileSync(`./keystore/${userObject.email}.json`, JSON.stringify(userObject), 'utf8')

      ctx.body = {
        'message' : 'success'
      }
    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  },
 async login(ctx) {
    try {
      await ctx.app.schemas.user.login(ctx.request.body)
        .catch(e => {
          ctx.throw(400, e.message)
        })

      const userObject = await ctx.app.helpers.user.login(ctx)
        .catch(e => {
          ctx.throw(400, e.message)
        })

      //store object into redis
      ctx.app.helpers.redis.client.set(userObject.email, JSON.stringify(userObject), 'EX', 60 * 120)

      const jwt = await ctx.app.helpers.user.createJwt(userObject)

      ctx.body = {
        'jwt': jwt,
        'message': 'success'
      }

    } catch (e) {
      console.log(e)
      ctx.throw(e.status, e.message)
    }
  }
}
