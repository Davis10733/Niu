const config = require('../config')
const path = require('path')
const fs = require('fs')
const db = {}

module.exports = (app) => {
  
  //Dynamic load module
  fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  }).forEach(function (file) {
    let model = require(path.join(__dirname, file))
    db[model.name] = model
  })
 
  app.db = db
}
