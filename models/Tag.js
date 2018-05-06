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
  const Tag = sequelize.define('Tag', schema, options)

  return Tag
}
