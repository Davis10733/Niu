const config = require('../config')
const mailjet = require ('node-mailjet')
  .connect(config.mail.publicKey, config.mail.privateKey)

const getMessage = (userObject) => {
  return {
    'From': {
      'Email': 'davis10733@hotmail.com',
      'Name': 'INSIDER'
    },
    'To': [
      {
        'Email': userObject.email,
        'Name': 'New insider',
      }
    ],
    "TemplateID": 369034,
    "TemplateLanguage": true,
    "Subject": "Welcome to INSIDER",
    "Variables": {
       "confirmation_link": `${config.server.host}/active?email=${userObject.email}`
    }
  }
}
module.exports = {
  sendActiveMail: async(userObject) => {
    const message = getMessage(userObject)
    return mailjet
      .post('send', { 'version': 'v3.1' })
      .request({
        'Messages': [
          message
        ]
      })
  
  }
}
