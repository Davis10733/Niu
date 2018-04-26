const keythereum = require('keythereum')
const bcrypt = require('bcrypt')

module.exports = {
  createUserObject: async(ctx) => {
    
    // hash the password
    const hashPw = await bcrypt.hash(ctx.request.body.password, 10)

    // create key
    let dk = keythereum.create()
    let keyObject = keythereum.dump(ctx.request.body.password, dk.privateKey, dk.salt, dk.iv)

    return {
      username: ctx.request.body.username,
      password: hashPw,
      address: keyObject.address, 
      keyObject: keyObject,
      email: ctx.request.body.email,
    }
  }
}
