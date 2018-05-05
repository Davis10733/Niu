module.exports = (sequelize, DataTypes) => {
  const options = {
    timestamp: true,
  }
  const schema = {
    title: DataTypes.STRING,
    ipfs_hash: DataTypes.STRING,
  }
  const post = sequelize.define('posts', schema, options)

  post.associate = (db) => {
    post.hasMany(db.tags)
  }

  post.createNewPost = async(data) => {
    let model = await post.create(data)

    if (data.tags !== undefined) {
      model.addTags(data.tags)
    }

    return model
  }

  return post
}
