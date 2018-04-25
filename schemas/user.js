const yup = require('yup')

const createSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

module.exports = {
  name: 'user',
  create: (response) => {
    return createSchema.validate(response)
  }
}
