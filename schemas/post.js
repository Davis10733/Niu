const yup = require('yup')

const createSchema = yup.object().shape({
  title: yup.string().required(),
  location: yup.string().required(),
  content: yup.string().required(),
})

module.exports = {
  name: 'post',
  create: (response) => {
    return createSchema.validate(response)
  },
}
