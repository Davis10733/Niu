const Router = require('koa-router')
const ctrl = require('../controllers').post
const router = new Router()

router.get('/post', ctrl.get)
router.post('/post', ctrl.post)

module.exports = router.routes()
