'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_empleado: {
        type: Sequelize.INTEGER
      },
      id_persona: {
        type: Sequelize.INTEGER
      },
      id_cargo: {
        type: Sequelize.INTEGER
      },
      fecha_contrato: {
        type: Sequelize.DATEONLY
      },
      id_empresa_empleadora: {
        type: Sequelize.INTEGER
      },
      estado_emp: {
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
    await queryInterface.dropTable('empleados');
  }
};