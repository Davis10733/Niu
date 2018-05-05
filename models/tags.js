module.exports = (sequelize, DataTypes) => {
  const options = {
    timestamp: true,
  }
  const schema = {
    item_id: DataTypes.BIGINT,
    item_type: DataTypes.STRING,
    key: DataTypes.STRING,
    value: DataTypes.STRING,
  }
  const tag = sequelize.define('tags', schema, options)

  return tag
}
