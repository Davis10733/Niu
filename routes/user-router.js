const Router = require('koa-router')
const ctrl = require('../controllers').user
const router = new Router()

router.post('/user', ctrl.create)

module.exports = router.routes()
