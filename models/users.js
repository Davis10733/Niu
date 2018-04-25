module.exports = (sequelize, DataTypes) => {
  const options = {
    timestamp: true,
  }
  const schema = {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    keyObject: DataTypes.JSON,
    active: DataTypes.BOOLEAN,
  }
  const user = sequelize.define('users', schema, options)

  return user
}
