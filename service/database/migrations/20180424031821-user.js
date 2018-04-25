'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('users', 
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        username: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        address: Sequelize.STRING,
        keyObject: Sequelize.JSON,
        active: Sequelize.BOOLEAN,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('users', { fields: ['email'] }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
