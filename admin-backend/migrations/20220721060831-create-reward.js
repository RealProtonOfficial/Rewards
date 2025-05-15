'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rewards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      referralId: {
        type: Sequelize.INTEGER
      },
      assetName: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      commissionPercentage: {
        type: Sequelize.DOUBLE
      },
      assetAmount: {
        type: Sequelize.DOUBLE
      },
      commissionAmount: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rewards');
  }
};