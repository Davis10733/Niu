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
    activeCode: DataTypes.BIGINT,
  }
  const user = sequelize.define('users', schema, options)

  user.findByAddress = (address) => {
    return user.findOne({
      where: {
        address: address
      }
    })
  }
  user.findByEmail = (email) => {
    return user.findOne({
      where: {
        email: email
      }
    })
  }
  user.prototype.activeUser = async function() {
    this.active = true
    return this.save()
  }

  return user
}
