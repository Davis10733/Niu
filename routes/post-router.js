const Router = require('koa-router')
const ctrl = require('../controllers').post
const router = new Router()
const config = require('../config')
const { middleware } = require('@jermysu/koa-auth-middleware')

router.use('/post/', middleware(config.jwt.secret))
router.get('/post/:postId', ctrl.get)
router.get('/post', ctrl.list)
router.post('/post', ctrl.post)
router.post('/post/:postId/comment', ctrl.comment)

module.exports = router.routes()
