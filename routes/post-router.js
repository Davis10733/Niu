const Router = require('koa-router')
const ctrl = require('../controllers').post
const router = new Router()
const config = require('../config')
const { middleware } = require('@jermysu/koa-auth-middleware')

router.use('/post/', middleware(config.jwt.secret))
router.get('/post', ctrl.get)
router.post('/post', ctrl.post)

module.exports = router.routes()
