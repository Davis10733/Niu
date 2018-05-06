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
  const User = sequelize.define('User', schema, options)

  User.findByAddress = (address) => {
    console.log(User)
    return User.findOne({
      where: {
        address: address
      }
    })
  }
  User.findByEmail = (email) => {
    return User.findOne({
      where: {
        email: email
      }
    })
  }
  User.prototype.activeUser = async function() {
    this.active = true
    return this.save()
  }

  return User
}
