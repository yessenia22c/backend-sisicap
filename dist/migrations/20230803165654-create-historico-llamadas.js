'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historico_llamadas', {
      id_historico: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_historico: {
        type: Sequelize.INTEGER
      },
      id_grupo_seguimiento: {
        type: Sequelize.INTEGER
      },
      id_contacto: {
        type: Sequelize.INTEGER
      },
      fecha_actualizacion: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('historico_llamadas');
  }
};