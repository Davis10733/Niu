const Sequelize = require('sequelize')
const config = require('../config')
const path = require('path')
const fs = require('fs')
const db = {}
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, 
  {
    host: config.db.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 1, 
      acquire: 30000,
      idle: 10000,
    },
  })

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js')
}).forEach(function (file) {
  let model = sequelize['import'](path.join(__dirname, file))
  db[model.name] = model
})

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(sequelize)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = (app) => {
  app.db = db
}
