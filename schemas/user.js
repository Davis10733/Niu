const yup = require('yup')

const createSchema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string(),
  password: yup.string(),
})

const activeSchema = yup.object().shape({
  email: yup.string().email().required(),
  activeCode: yup.number().required(),
})

module.exports = {
  name: 'user',
  create: (response) => {
    return createSchema.validate(response)
  },
  active: (response) => {
    return activeSchema.validate(response)
  }
}
