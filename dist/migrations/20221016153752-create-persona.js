'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personas', {
      id_persona: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nombres_per: {
        type: Sequelize.STRING
      },
      primer_apellido: {
        type: Sequelize.STRING
      },
      segundo_apellido: {
        type: Sequelize.STRING
      },
      nro_ci: {
        type: Sequelize.STRING
      },
      id_sexo: {
        type: Sequelize.INTEGER
      },
      correo: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      id_ciudad: {
        type: Sequelize.INTEGER
      },
      fecha_nac: {
        type: Sequelize.DATEONLY
      },
      id_pais: {
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
    await queryInterface.dropTable('personas');
  }
};