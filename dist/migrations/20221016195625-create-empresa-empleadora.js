'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empresa_empleadoras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_empresa: {
        type: Sequelize.INTEGER
      },
      nombre_empleador: {
        type: Sequelize.STRING
      },
      ubicacion: {
        type: Sequelize.STRING
      },
      correo_empleador: {
        type: Sequelize.STRING
      },
      sitio_web: {
        type: Sequelize.STRING
      },
      telefono_contacto: {
        type: Sequelize.STRING
      },
      nit_empresa: {
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
    await queryInterface.dropTable('empresa_empleadoras');
  }
};