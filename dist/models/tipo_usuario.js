'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipo_usuario extends Model {
    static associate(models) {
      models.tipo_usuario.hasMany(models.usuario, {
        foreignKey: 'id_tipo_usuario'
      });
      models.tipo_usuario.hasMany(models.acceso, {
        as: 'TipoUsuarioAcceso',
        foreignKey: 'id_tipo_usuario'
      });
      // define association here
    }
  }

  tipo_usuario.init({
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_tipo_usuario: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(200)
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tipo_usuario',
    freezeTableName: true
  });
  return tipo_usuario;
};