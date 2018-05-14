module.exports = (sequelize, DataTypes) => {
  const options = {
    timestamp: true,
  }
  const schema = {
    post_id: DataTypes.BIGINT,
    ipfs_hash: DataTypes.STRING,
    address: DataTypes.STRING,
    author: DataTypes.STRING,
  }
  const Comment = sequelize.define('Comment', schema, options)

  Comment.associate = (sequelize) => {
    Comment.belongsTo(sequelize.models.Post, { foreignKey: 'post_id' })
  }

  return Comment
}
