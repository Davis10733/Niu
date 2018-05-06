'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Posts', 
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
    }).then(() => queryInterface.addIndex('Posts', { fields: ['title'] }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Posts');
  }
};
