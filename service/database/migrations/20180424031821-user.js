'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Users', 
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
        activeCode: Sequelize.BIGINT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }).then(() => queryInterface.addIndex('Users', { fields: ['email'], unique: true }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
