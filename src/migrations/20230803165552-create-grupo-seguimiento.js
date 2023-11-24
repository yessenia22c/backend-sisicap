'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('grupo_seguimiento', {
      id_grupo_seguimiento: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_grupo_seguimiento: {
        type: Sequelize.INTEGER
      },
      nombre_seguimiento: {
        type: Sequelize.STRING
      },
      fecha_creado: {
        type: Sequelize.DATEONLY
      },
      id_capacitacion: {
        type: Sequelize.INTEGER
      },
      estado: {
        type: Sequelize.BOOLEAN
      },
      id_empleado: {
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
    await queryInterface.dropTable('grupo_seguimiento');
  }
};