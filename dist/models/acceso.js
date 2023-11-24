'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class acceso extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.acceso.belongsTo(models.nivel, {
        as: 'NivelAcceso',
        foreignKey: 'id_nivel'
      });
      models.acceso.belongsTo(models.tipo_usuario, {
        as: 'TipoUsuarioAcceso',
        foreignKey: 'id_tipo_usuario'
      });
    }
  }
  acceso.init({
    id_acceso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_nivel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'acceso',
    freezeTableName: true
  });
  return acceso;
};