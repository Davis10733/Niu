const Router = require('koa-router')
const router = new Router()
const api = new Router()

const post = require('./post-router')

api.use(post)
router.use('/api/v0', api.routes())

module.exports = router
