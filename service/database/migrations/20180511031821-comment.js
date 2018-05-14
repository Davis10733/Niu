'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Comments', 
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        post_id: Sequelize.BIGINT,
        ipfs_hash: Sequelize.STRING,
        address: Sequelize.STRING,
        author: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('Comments', { fields: ['address'] }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Comments');
  }
};
