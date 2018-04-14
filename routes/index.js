const Router = require('koa-router')
const router = new Router()
const api = new Router()

const post = require('./post-router')
const user = require('./user-router')

api.use(post)
api.use(user)

router.use('/api/v0', api.routes())

module.exports = router
