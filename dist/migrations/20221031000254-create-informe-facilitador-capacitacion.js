'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('informe_facilitador_capacitacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_facilitador: {
        type: Sequelize.INTEGER
      },
      id_capacitacion: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('informe_facilitador_capacitacions');
  }
};