'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('facilitadors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_facilitador: {
        type: Sequelize.INTEGER
      },
      id_persona: {
        type: Sequelize.INTEGER
      },
      profesion: {
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
    await queryInterface.dropTable('facilitadors');
  }
};