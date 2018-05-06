'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Tags', 
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
      return queryInterface.addIndex('Tags', { fields: ['value'] })
    }).then(() => {
      queryInterface.addIndex('Tags', { fields: ['key'] })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tags');
  }
};
