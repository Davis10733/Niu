module.exports = (sequelize, DataTypes) => {
  const options = {
    timestamp: true,
  }
  const schema = {
    title: DataTypes.STRING,
    ipfs_hash: DataTypes.STRING,
  }
  const Post = sequelize.define('Post', schema, options)

  Post.associate = (sequelize) => {
    Post.hasMany(sequelize.models.Tag, { foreignKey: 'item_id' })
  }

  Post.createNewPost = async(data) => {

    if (data.tags !== undefined) {
      data.Tags = data.tags.map((tag) => {
        return {
          item_type: 'post',
          key: 'meta',
          value: tag
        }
      }) 
    }

    return Post.create(data, { include: sequelize.models.Tag})
  }

  return Post
}
