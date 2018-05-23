const keythereum = require('keythereum')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config')
const fs = require('fs')

module.exports = {
  createUserObject: async(ctx) => {
    
    // hash the password
    const hashPw = await bcrypt.hash(ctx.request.body.password, 10)

    // create key
    let dk = keythereum.create()
    let keystore = keythereum.dump(hashPw, dk.privateKey, dk.salt, dk.iv)

    return {
      username: ctx.request.body.username,
      password: hashPw,
      address: keystore.address, 
      keystore: keystore,
      email: ctx.request.body.email,
    }
  },

  login: async(ctx) => {
    let user = {}
    try {
      user = fs.readFileSync(`./keystore/${ctx.request.body.email}.json`)
    } catch (e) {
      if (e.code == 'ENOENT') {
        throw new Error('user not found')
      }
    }
    user = JSON.parse(user)
    let result = await bcrypt.compare(ctx.request.body.password, user.password)

    if (result == false) {
      throw new Error('Invlaid password')
    }

    return user
  },
  
  createJwt: async(user) => {
    return jwt.sign({
      'email': user.email,
      'address': user.address,
      'exp': Math.floor(Date.now() / 1000) + (60 * 120)
    }, config.jwt.secret)
  }
}
