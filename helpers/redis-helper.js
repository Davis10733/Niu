const redis = require('redis')
const bluebird = require('bluebird')
const config = require('../config')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient({
  host: config.redis.host,
})

module.exports = {
  client: client,
  module: redis
}
