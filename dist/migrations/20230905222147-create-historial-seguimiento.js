'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historial_seguimientos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_historial_seguimiento: {
        type: Sequelize.INTEGER
      },
      observacion_llamada: {
        type: Sequelize.STRING
      },
      fecha_actualizacion: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('historial_seguimientos');
  }
};