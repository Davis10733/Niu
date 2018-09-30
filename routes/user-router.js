const Router = require('koa-router')
const ctrl = require('../controllers').user
const router = new Router()

router.post('/user', ctrl.create)
router.post('/user/login', ctrl.login)

module.exports = router.routes()
