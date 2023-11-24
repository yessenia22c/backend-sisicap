'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nivels', {
      id_nivel: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_nivel: {
        type: Sequelize.INTEGER
      },
      nombre_nivel: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.BOOLEAN
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nivels');
  }
};