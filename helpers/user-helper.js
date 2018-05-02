const keythereum = require('keythereum')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
  createUserObject: async(ctx) => {
    
    // hash the password
    const hashPw = await bcrypt.hash(ctx.request.body.password, 10)

    // create key
    let dk = keythereum.create()
    let keyObject = keythereum.dump(hashPw, dk.privateKey, dk.salt, dk.iv)

    return {
      username: ctx.request.body.username,
      password: hashPw,
      address: keyObject.address, 
      keyObject: keyObject,
      email: ctx.request.body.email,
    }
  },

  login: async(ctx) => {
    let user = await ctx.app.db.users.findByEmail(ctx.request.body.email)

    if (user == undefined) {
      throw new Error('User not found')
    }

    let result = await bcrypt.compare(ctx.request.body.password, user.password)

    if (result == false) {
      throw new Error('Invlaid password')
    }

    return user.toJSON()
  },
  
  createJwt: async(user) => {
    return jwt.sign({
      'userId': user.id,
      'address': user.address,
      'exp': Math.floor(Date.now() / 1000) + (60 * 120)
    }, config.jwt.secret)
  }
}
