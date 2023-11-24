'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('capacitacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_capacitacion: {
        type: Sequelize.INTEGER
      },
      nombre_capacitacion: {
        type: Sequelize.STRING
      },
      fecha_inicio_cap: {
        type: Sequelize.DATEONLY
      },
      fecha_fin_cap: {
        type: Sequelize.DATEONLY
      },
      cantidad_modulos: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      id_categoria: {
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
    await queryInterface.dropTable('capacitacions');
  }
};