require('dotenv').config()
const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
const cors = require('kcors')
const paginator = require('koa-pagination')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const routes = require('./routes')

const fs = require('fs')

const createServer = async() => {
  const app = new Koa()

  require('./helpers')(app)

  // setup oribit db connection
  app.helpers.ipfs.db['insider.post'] = await app.helpers.ipfs.orbitdb.docs(config.orbit.post)
  app.helpers.ipfs.db['insider.tag'] = await app.helpers.ipfs.orbitdb.docs(config.orbit.tag)
  app.helpers.ipfs.db['insider.comment'] = await app.helpers.ipfs.orbitdb.docs(config.orbit.comment)
  app.helpers.ipfs.db['insider.post'].load()
  app.helpers.ipfs.db['insider.tag'].load()
  app.helpers.ipfs.db['insider.comment'].load()

  app.use(helmet())
  app.use(logger())
  app.use(
    paginator.middleware({
      allowAll: false,
      maximum: 25,
    })
  )
  app.use(cors(config.cors))
  app.use(bodyParser(config.bodyParser))
  app.use(routes.routes())
  app.use(routes.allowedMethods())

  require('./schemas')(app)
  require('./models')(app)

  const router = new Router()


  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  app.use(router.routes())

  const server = app.listen(config.server.port, err => {
    if (err) throw err
    console.log(`Ready on http://localhost:${config.server.port}`)
  })
}

createServer()
