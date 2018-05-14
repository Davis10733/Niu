const yup = require('yup')

const createSchema = yup.object().shape({
  content: yup.string().required(),
  address: yup.string().required(),
})

module.exports = {
  name: 'comment',
  create: (response) => {
    return createSchema.validate(response)
  },
}
