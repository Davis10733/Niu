const fs = require('fs')
const path = require('path')

let schemas = {}

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
}).forEach(function (file) {
    let schema = require(path.join(__dirname, file))
    schemas[schema.name] = schema
})

module.exports = (app) => {
  app.schemas = schemas
}
