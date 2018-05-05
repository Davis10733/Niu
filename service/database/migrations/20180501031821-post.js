'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('posts', 
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        title: Sequelize.STRING,
        ipfs_hash: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('posts', { fields: ['title'] }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('posts');
  }
};
