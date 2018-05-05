'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('tags', 
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        item_id: Sequelize.BIGINT,
        item_type: Sequelize.STRING,
        key: Sequelize.STRING,
        value: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }).then(() => {
      return queryInterface.addIndex('tags', { fields: ['value'] })
    }).then(() => {
      queryInterface.addIndex('tags', { fields: ['key'] })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tags');
  }
};
