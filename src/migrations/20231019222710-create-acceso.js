'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accesos', {

      id_acceso: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_nivel: {
        type: Sequelize.INTEGER
      },
      id_tipo_usuario: {
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
    await queryInterface.dropTable('accesos');
  }
};