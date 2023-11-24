'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacto', {
      id_contacto: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_contacto: {
        type: Sequelize.INTEGER
      },
      nombre_apellidos: {
        type: Sequelize.STRING
      },
      numero_contacto: {
        type: Sequelize.STRING
      },
      id_estado_contacto: {
        type: Sequelize.INTEGER
      },
      correo_contacto: {
        type: Sequelize.STRING
      },
      nombre_empresa: {
        type: Sequelize.STRING
      },
      id_sexo: {
        type: Sequelize.INTEGER
      },
      id_ciudad: {
        type: Sequelize.INTEGER
      },
      id_pais: {
        type: Sequelize.INTEGER
      },
      profesion: {
        type: Sequelize.STRING
      },
      intereses: {
        type: Sequelize.STRING
      },
      observaciones: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('contactos');
  }
};