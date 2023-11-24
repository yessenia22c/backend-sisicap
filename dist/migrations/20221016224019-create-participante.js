'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('participantes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_participante: {
        type: Sequelize.INTEGER
      },
      id_registrante: {
        type: Sequelize.INTEGER
      },
      id_persona: {
        type: Sequelize.INTEGER
      },
      ocupacion: {
        type: Sequelize.STRING
      },
      codigo_participante: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('participantes');
  }
};